'use client';

import { AppCard } from '@/types/profile';

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
  homepage: string | null;
  has_pages: boolean;
  default_branch: string;
}

interface GitHubLanguages {
  [language: string]: number;
}

export class GitHubRepositoryService {
  private static readonly API_BASE = 'https://api.github.com';
  private static readonly TECH_STACK_MAPPING: Record<string, string[]> = {
    'TypeScript': ['TypeScript', 'JavaScript', 'Node.js'],
    'JavaScript': ['JavaScript', 'Node.js'],
    'React': ['React', 'JavaScript', 'Frontend'],
    'Next.js': ['Next.js', 'React', 'TypeScript', 'Full-Stack'],
    'Python': ['Python', 'Backend'],
    'Java': ['Java', 'Backend'],
    'C++': ['C++', 'Systems'],
    'C#': ['C#', '.NET', 'Backend'],
    'Go': ['Go', 'Backend', 'Microservices'],
    'Rust': ['Rust', 'Systems', 'Performance'],
    'Swift': ['Swift', 'iOS', 'Mobile'],
    'Kotlin': ['Kotlin', 'Android', 'Mobile'],
    'PHP': ['PHP', 'Backend', 'Web'],
    'Ruby': ['Ruby', 'Ruby on Rails', 'Backend'],
    'HTML': ['HTML', 'CSS', 'Frontend'],
    'CSS': ['CSS', 'Frontend', 'Styling'],
    'SCSS': ['SCSS', 'CSS', 'Frontend'],
    'Vue': ['Vue.js', 'JavaScript', 'Frontend'],
    'Angular': ['Angular', 'TypeScript', 'Frontend'],
    'Svelte': ['Svelte', 'JavaScript', 'Frontend'],
  };

  /**
   * Fetch repository metadata from GitHub API
   */
  static async fetchRepositoryData(githubUrl: string): Promise<AppCard | null> {
    try {
      const repoPath = this.extractRepoPath(githubUrl);
      if (!repoPath) return null;

      const [repoData, languages] = await Promise.all([
        this.fetchRepository(repoPath),
        this.fetchRepositoryLanguages(repoPath)
      ]);

      if (!repoData) return null;

      return this.transformToAppCard(repoData, languages);
    } catch (error) {
      console.error('Error fetching repository data:', error);
      return null;
    }
  }

  /**
   * Extract owner/repo from GitHub URL
   */
  private static extractRepoPath(githubUrl: string): string | null {
    try {
      const url = new URL(githubUrl);
      const pathParts = url.pathname.split('/').filter(Boolean);
      
      if (pathParts.length >= 2) {
        return `${pathParts[0]}/${pathParts[1]}`;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Fetch repository information from GitHub API
   */
  private static async fetchRepository(repoPath: string): Promise<GitHubRepository | null> {
    try {
      const response = await fetch(`${this.API_BASE}/repos/${repoPath}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'ECE-Platform'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching repository:', error);
      return null;
    }
  }

  /**
   * Fetch repository languages from GitHub API
   */
  private static async fetchRepositoryLanguages(repoPath: string): Promise<GitHubLanguages> {
    try {
      const response = await fetch(`${this.API_BASE}/repos/${repoPath}/languages`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'ECE-Platform'
        }
      });

      if (!response.ok) {
        return {};
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching repository languages:', error);
      return {};
    }
  }

  /**
   * Transform GitHub repository data to AppCard format
   */
  private static transformToAppCard(repo: GitHubRepository, languages: GitHubLanguages): AppCard {
    const techStack = this.generateTechStack(languages, repo.topics);
    const category = this.determineCategory(repo.name, repo.description, techStack);
    
    return {
      id: `github-${repo.id}`,
      name: repo.name,
      description: repo.description || 'No description available',
      githubUrl: repo.html_url,
      techStack,
      status: this.determineStatus(repo),
      imageUrl: this.generateImageUrl(repo),
      featured: false, // Will be set manually for specific repos
      stats: {
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || 'Unknown',
        lastUpdated: new Date(repo.updated_at)
      },
      links: {
        demo: repo.homepage || undefined,
        live: repo.has_pages ? `https://${repo.full_name.split('/')[0]}.github.io/${repo.name}` : undefined,
        documentation: `${repo.html_url}#readme`
      },
      category,
      tags: [...repo.topics, ...this.generateTags(repo)]
    };
  }

  /**
   * Generate tech stack array from languages and topics
   */
  private static generateTechStack(languages: GitHubLanguages, topics: string[]): string[] {
    const techStack = new Set<string>();
    
    // Add technologies based on languages
    Object.keys(languages).forEach(language => {
      const mappedTech = this.TECH_STACK_MAPPING[language] || [language];
      mappedTech.forEach(tech => techStack.add(tech));
    });
    
    // Add technologies based on topics
    topics.forEach(topic => {
      const normalized = topic.charAt(0).toUpperCase() + topic.slice(1).toLowerCase();
      if (normalized.includes('react')) techStack.add('React');
      if (normalized.includes('next')) techStack.add('Next.js');
      if (normalized.includes('vue')) techStack.add('Vue.js');
      if (normalized.includes('angular')) techStack.add('Angular');
      if (normalized.includes('node')) techStack.add('Node.js');
      if (normalized.includes('api')) techStack.add('API');
      if (normalized.includes('rest')) techStack.add('REST API');
      if (normalized.includes('graphql')) techStack.add('GraphQL');
      if (normalized.includes('database')) techStack.add('Database');
      if (normalized.includes('mongodb')) techStack.add('MongoDB');
      if (normalized.includes('postgres')) techStack.add('PostgreSQL');
      if (normalized.includes('mysql')) techStack.add('MySQL');
      if (normalized.includes('redis')) techStack.add('Redis');
      if (normalized.includes('docker')) techStack.add('Docker');
      if (normalized.includes('kubernetes')) techStack.add('Kubernetes');
      if (normalized.includes('aws')) techStack.add('AWS');
      if (normalized.includes('vercel')) techStack.add('Vercel');
      if (normalized.includes('netlify')) techStack.add('Netlify');
    });
    
    return Array.from(techStack).slice(0, 8); // Limit to 8 technologies
  }

  /**
   * Determine app category based on repository information
   */
  private static determineCategory(name: string, description: string | null, techStack: string[]): AppCard['category'] {
    const content = `${name} ${description || ''}`.toLowerCase();
    
    if (content.includes('game') || content.includes('gaming') || name.toLowerCase().includes('realm')) {
      return 'game';
    }
    if (content.includes('api') || content.includes('backend') || content.includes('server')) {
      return 'api';
    }
    if (content.includes('mobile') || content.includes('ios') || content.includes('android')) {
      return 'mobile-app';
    }
    if (content.includes('library') || content.includes('package') || content.includes('npm')) {
      return 'library';
    }
    if (content.includes('tool') || content.includes('cli') || content.includes('utility')) {
      return 'tool';
    }
    if (techStack.some(tech => ['React', 'Vue.js', 'Angular', 'Next.js'].includes(tech))) {
      return 'web-app';
    }
    
    return 'other';
  }

  /**
   * Determine repository status
   */
  private static determineStatus(repo: GitHubRepository): AppCard['status'] {
    const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceUpdate < 30) return 'active';
    if (daysSinceUpdate < 180) return 'demo';
    if (repo.stargazers_count > 10 || repo.forks_count > 5) return 'production';
    return 'archived';
  }

  /**
   * Generate image URL for the app card
   */
  private static generateImageUrl(repo: GitHubRepository): string {
    // Use GitHub's social preview image if available
    return `https://opengraph.githubassets.com/1/${repo.full_name}`;
  }

  /**
   * Generate additional tags for the repository
   */
  private static generateTags(repo: GitHubRepository): string[] {
    const tags: string[] = [];
    
    if (repo.stargazers_count > 100) tags.push('popular');
    if (repo.forks_count > 20) tags.push('community');
    if (repo.language) tags.push(repo.language.toLowerCase());
    if (repo.has_pages) tags.push('documentation');
    if (repo.homepage) tags.push('live-demo');
    
    const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 7) tags.push('recently-updated');
    if (daysSinceUpdate < 30) tags.push('active-development');
    
    return tags;
  }

  /**
   * Create app cards for specific user repositories
   */
  static async createAppCardsForUser(repositories: string[]): Promise<AppCard[]> {
    const appCards: AppCard[] = [];
    
    for (const repoUrl of repositories) {
      const appCard = await this.fetchRepositoryData(repoUrl);
      if (appCard) {
        // Mark specific repositories as featured
        if (repoUrl.includes('elias-charles') || repoUrl.includes('bangobongo')) {
          appCard.featured = true;
        }
        appCards.push(appCard);
      }
    }
    
    return appCards;
  }

  /**
   * Get default app cards for elicharles.e@gmail.com
   */
  static async getEliCharlesAppCards(): Promise<AppCard[]> {
    const repositories = [
      'https://github.com/elicharlese/elias-charles',
      'https://github.com/elicharlese/bangobongo',
      'https://github.com/elicharlese/Banish-Realm'
    ];
    
    return await this.createAppCardsForUser(repositories);
  }
}
