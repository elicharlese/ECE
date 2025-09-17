'use client';

import { NextApiRequest, NextApiResponse } from 'next';

// SSO Provider Types
export type SSOProvider = 'azure-ad' | 'google-workspace' | 'okta' | 'auth0' | 'saml' | 'ldap';

export interface SSOConfig {
  provider: SSOProvider;
  clientId: string;
  clientSecret: string;
  tenantId?: string; // For Azure AD
  domain?: string; // For Auth0/Okta
  metadataUrl?: string; // For SAML
  ldapUrl?: string; // For LDAP
  redirectUri: string;
  scopes: string[];
  enabled: boolean;
}

export interface SSOUser {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  tenantId: string;
  provider: SSOProvider;
  roles: string[];
  permissions: string[];
  lastLogin: Date;
  metadata: Record<string, any>;
}

export interface AuthenticationResponse {
  success: boolean;
  user?: SSOUser;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
  error?: string;
  redirectUrl?: string;
}

export interface SSOSession {
  id: string;
  userId: string;
  tenantId: string;
  provider: SSOProvider;
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  createdAt: Date;
  lastActivity: Date;
  metadata: Record<string, any>;
}

export class SSOService {
  private configs: Map<string, SSOConfig> = new Map();
  private sessions: Map<string, SSOSession> = new Map();

  /**
   * Configure SSO provider for a tenant
   */
  async configureSSOProvider(tenantId: string, config: SSOConfig): Promise<boolean> {
    try {
      // Validate configuration
      await this.validateSSOConfig(config);
      
      // Store configuration securely
      this.configs.set(`${tenantId}:${config.provider}`, config);
      
      // Test connection
      const testResult = await this.testSSOConnection(tenantId, config.provider);
      
      if (!testResult.success) {
        throw new Error(`SSO configuration test failed: ${testResult.error}`);
      }

      return true;
    } catch (error) {
      console.error('Failed to configure SSO provider:', error);
      throw error;
    }
  }

  /**
   * Initiate SSO authentication flow
   */
  async initiateSSOLogin(
    tenantId: string, 
    provider: SSOProvider, 
    returnUrl?: string
  ): Promise<{ redirectUrl: string; state: string }> {
    const config = this.getSSOConfig(tenantId, provider);
    if (!config) {
      throw new Error(`SSO provider ${provider} not configured for tenant ${tenantId}`);
    }

    const state = this.generateState();
    const nonce = this.generateNonce();

    let redirectUrl: string;

    switch (provider) {
      case 'azure-ad':
        redirectUrl = await this.buildAzureADAuthUrl(config, state, nonce);
        break;
      case 'google-workspace':
        redirectUrl = await this.buildGoogleWorkspaceAuthUrl(config, state);
        break;
      case 'okta':
        redirectUrl = await this.buildOktaAuthUrl(config, state);
        break;
      case 'auth0':
        redirectUrl = await this.buildAuth0AuthUrl(config, state);
        break;
      case 'saml':
        redirectUrl = await this.buildSAMLAuthUrl(config, state);
        break;
      default:
        throw new Error(`Unsupported SSO provider: ${provider}`);
    }

    // Store state for validation
    await this.storeAuthState(state, {
      tenantId,
      provider,
      returnUrl: returnUrl || '/app',
      nonce,
      timestamp: Date.now()
    });

    return { redirectUrl, state };
  }

  /**
   * Handle SSO callback and complete authentication
   */
  async handleSSOCallback(
    code: string,
    state: string,
    req: NextApiRequest
  ): Promise<AuthenticationResponse> {
    try {
      // Validate state
      const authState = await this.validateAuthState(state);
      if (!authState) {
        return { success: false, error: 'Invalid or expired state parameter' };
      }

      const { tenantId, provider } = authState;
      const config = this.getSSOConfig(tenantId, provider);
      
      if (!config) {
        return { success: false, error: 'SSO configuration not found' };
      }

      // Exchange code for tokens
      const tokenResponse = await this.exchangeCodeForTokens(config, code);
      if (!tokenResponse.success) {
        return { success: false, error: tokenResponse.error };
      }

      // Get user information
      const userInfo = await this.getUserInfo(config, tokenResponse.accessToken!);
      if (!userInfo.success) {
        return { success: false, error: userInfo.error };
      }

      // Create/update user
      const user = await this.createOrUpdateUser(userInfo.user!, tenantId, provider);
      
      // Create session
      const session = await this.createSession(user, tokenResponse, provider);
      
      // Generate JWT token for client
      const jwtToken = await this.generateJWTToken(user, session);

      return {
        success: true,
        user,
        token: jwtToken,
        refreshToken: tokenResponse.refreshToken,
        expiresIn: tokenResponse.expiresIn,
        redirectUrl: authState.returnUrl
      };

    } catch (error) {
      console.error('SSO callback error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      };
    }
  }

  /**
   * Refresh SSO tokens
   */
  async refreshSSOTokens(sessionId: string): Promise<AuthenticationResponse> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        return { success: false, error: 'Session not found' };
      }

      if (session.expiresAt <= new Date()) {
        return { success: false, error: 'Session expired' };
      }

      const config = this.getSSOConfig(session.tenantId, session.provider);
      if (!config) {
        return { success: false, error: 'SSO configuration not found' };
      }

      const tokenResponse = await this.refreshTokens(config, session.refreshToken!);
      if (!tokenResponse.success) {
        return { success: false, error: tokenResponse.error };
      }

      // Update session
      session.accessToken = tokenResponse.accessToken!;
      session.expiresAt = new Date(Date.now() + (tokenResponse.expiresIn! * 1000));
      session.lastActivity = new Date();

      return {
        success: true,
        token: tokenResponse.accessToken,
        expiresIn: tokenResponse.expiresIn
      };

    } catch (error) {
      console.error('Token refresh error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Token refresh failed' 
      };
    }
  }

  /**
   * Logout from SSO session
   */
  async logoutSSO(sessionId: string): Promise<{ success: boolean; redirectUrl?: string }> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        return { success: false };
      }

      const config = this.getSSOConfig(session.tenantId, session.provider);
      
      // Remove local session
      this.sessions.delete(sessionId);

      // Build logout URL for provider
      let logoutUrl: string | undefined;
      
      if (config) {
        switch (session.provider) {
          case 'azure-ad':
            logoutUrl = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(config.redirectUri)}`;
            break;
          case 'google-workspace':
            logoutUrl = `https://accounts.google.com/logout`;
            break;
          case 'okta':
            logoutUrl = `https://${config.domain}/oauth2/v1/logout?post_logout_redirect_uri=${encodeURIComponent(config.redirectUri)}`;
            break;
          case 'auth0':
            logoutUrl = `https://${config.domain}/v2/logout?returnTo=${encodeURIComponent(config.redirectUri)}`;
            break;
        }
      }

      return { success: true, redirectUrl: logoutUrl };

    } catch (error) {
      console.error('SSO logout error:', error);
      return { success: false };
    }
  }

  // Private helper methods

  private getSSOConfig(tenantId: string, provider: SSOProvider): SSOConfig | null {
    return this.configs.get(`${tenantId}:${provider}`) || null;
  }

  private async validateSSOConfig(config: SSOConfig): Promise<void> {
    if (!config.provider || !config.clientId || !config.redirectUri) {
      throw new Error('Missing required SSO configuration fields');
    }

    // Provider-specific validation
    switch (config.provider) {
      case 'azure-ad':
        if (!config.tenantId) {
          throw new Error('Azure AD requires tenantId');
        }
        break;
      case 'google-workspace':
      case 'okta':
      case 'auth0':
        if (!config.domain) {
          throw new Error(`${config.provider} requires domain`);
        }
        break;
      case 'saml':
        if (!config.metadataUrl) {
          throw new Error('SAML requires metadataUrl');
        }
        break;
      case 'ldap':
        if (!config.ldapUrl) {
          throw new Error('LDAP requires ldapUrl');
        }
        break;
    }
  }

  private async testSSOConnection(tenantId: string, provider: SSOProvider): Promise<{ success: boolean; error?: string }> {
    try {
      const config = this.getSSOConfig(tenantId, provider);
      if (!config) {
        return { success: false, error: 'Configuration not found' };
      }

      // Perform basic connectivity test based on provider
      switch (provider) {
        case 'azure-ad':
          // Test Azure AD endpoint
          const azureResponse = await fetch(`https://login.microsoftonline.com/${config.tenantId}/v2.0/.well-known/openid_configuration`);
          return { success: azureResponse.ok };
          
        case 'google-workspace':
          // Test Google endpoint
          const googleResponse = await fetch('https://accounts.google.com/.well-known/openid_configuration');
          return { success: googleResponse.ok };
          
        case 'saml':
          if (config.metadataUrl) {
            const samlResponse = await fetch(config.metadataUrl);
            return { success: samlResponse.ok };
          }
          break;
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Connection test failed' 
      };
    }
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private generateNonce(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private async buildAzureADAuthUrl(config: SSOConfig, state: string, nonce: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: config.clientId,
      response_type: 'code',
      redirect_uri: config.redirectUri,
      response_mode: 'query',
      scope: config.scopes.join(' '),
      state,
      nonce,
      prompt: 'select_account'
    });

    return `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/authorize?${params.toString()}`;
  }

  private async buildGoogleWorkspaceAuthUrl(config: SSOConfig, state: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: config.clientId,
      response_type: 'code',
      redirect_uri: config.redirectUri,
      scope: config.scopes.join(' '),
      state,
      access_type: 'offline',
      include_granted_scopes: 'true'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  private async buildOktaAuthUrl(config: SSOConfig, state: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: config.clientId,
      response_type: 'code',
      redirect_uri: config.redirectUri,
      scope: config.scopes.join(' '),
      state
    });

    return `https://${config.domain}/oauth2/v1/authorize?${params.toString()}`;
  }

  private async buildAuth0AuthUrl(config: SSOConfig, state: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: config.clientId,
      response_type: 'code',
      redirect_uri: config.redirectUri,
      scope: config.scopes.join(' '),
      state
    });

    return `https://${config.domain}/authorize?${params.toString()}`;
  }

  private async buildSAMLAuthUrl(config: SSOConfig, state: string): Promise<string> {
    // SAML implementation would require additional SAML libraries
    // This is a placeholder for the SAML authentication URL
    return `${config.metadataUrl}?SAMLRequest=...&RelayState=${state}`;
  }

  private async storeAuthState(state: string, data: any): Promise<void> {
    // In production, store in Redis or database with expiration
    // For now, using in-memory storage
    (global as any).authStates = (global as any).authStates || new Map();
    (global as any).authStates.set(state, data);
  }

  private async validateAuthState(state: string): Promise<any> {
    const authStates = (global as any).authStates || new Map();
    const data = authStates.get(state);
    
    if (!data) return null;
    
    // Check if state is expired (15 minutes)
    if (Date.now() - data.timestamp > 15 * 60 * 1000) {
      authStates.delete(state);
      return null;
    }
    
    authStates.delete(state); // One-time use
    return data;
  }

  private async exchangeCodeForTokens(config: SSOConfig, code: string): Promise<any> {
    // Implementation would vary by provider
    // This is a simplified example for Azure AD
    const tokenUrl = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`;
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri,
      }),
    });

    if (!response.ok) {
      return { success: false, error: 'Token exchange failed' };
    }

    const data = await response.json();
    return {
      success: true,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  }

  private async getUserInfo(config: SSOConfig, accessToken: string): Promise<any> {
    // Provider-specific user info endpoints
    let userInfoUrl: string;
    
    switch (config.provider) {
      case 'azure-ad':
        userInfoUrl = 'https://graph.microsoft.com/v1.0/me';
        break;
      case 'google-workspace':
        userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
        break;
      default:
        userInfoUrl = 'https://api.provider.com/userinfo';
    }

    const response = await fetch(userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to get user info' };
    }

    const userData = await response.json();
    return {
      success: true,
      user: {
        id: userData.id || userData.sub,
        email: userData.email || userData.mail,
        name: userData.name || `${userData.given_name} ${userData.family_name}`,
        firstName: userData.given_name || userData.givenName,
        lastName: userData.family_name || userData.surname,
        avatar: userData.picture,
      },
    };
  }

  private async createOrUpdateUser(userInfo: any, tenantId: string, provider: SSOProvider): Promise<SSOUser> {
    // In production, this would interact with your user database
    return {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      avatar: userInfo.avatar,
      tenantId,
      provider,
      roles: ['user'], // Default role, would be determined by business logic
      permissions: ['read'], // Default permissions
      lastLogin: new Date(),
      metadata: userInfo,
    };
  }

  private async createSession(user: SSOUser, tokenResponse: any, provider: SSOProvider): Promise<SSOSession> {
    const session: SSOSession = {
      id: this.generateState(),
      userId: user.id,
      tenantId: user.tenantId,
      provider,
      accessToken: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
      expiresAt: new Date(Date.now() + (tokenResponse.expiresIn * 1000)),
      createdAt: new Date(),
      lastActivity: new Date(),
      metadata: {},
    };

    this.sessions.set(session.id, session);
    return session;
  }

  private async generateJWTToken(user: SSOUser, session: SSOSession): Promise<string> {
    // In production, use a proper JWT library like jsonwebtoken
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      tenantId: user.tenantId,
      provider: user.provider,
      roles: user.roles,
      permissions: user.permissions,
      sessionId: session.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(session.expiresAt.getTime() / 1000),
    };

    // This is a simplified token - in production use proper JWT signing
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  private async refreshTokens(config: SSOConfig, refreshToken: string): Promise<any> {
    // Provider-specific token refresh implementation
    // This is a simplified example
    return {
      success: true,
      accessToken: 'new_access_token',
      expiresIn: 3600,
    };
  }
}

// Export singleton instance
export const ssoService = new SSOService();
