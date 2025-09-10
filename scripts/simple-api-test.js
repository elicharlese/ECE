#!/usr/bin/env node

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:4200';

async function testAPI() {
  console.log('🚀 Testing ECE Generation Engine API\n');
  
  const results = [];
  
  // Test 1: List Templates (GET)
  try {
    console.log('📋 Testing GET /api/engine/generate (list templates)...');
    const response = await fetch(`${BASE_URL}/api/engine/generate`);
    const data = await response.json();
    
    if (response.ok && data.templates) {
      results.push({
        test: 'List Templates API',
        passed: true,
        message: `Found ${data.templates.length} templates`,
        data: data.templates.map(t => t.name)
      });
      console.log(`✅ Success: Found ${data.templates.length} templates`);
    } else {
      results.push({
        test: 'List Templates API',
        passed: false,
        message: `Failed: ${data.error || 'Unknown error'}`,
        data: data
      });
      console.log(`❌ Failed: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    results.push({
      test: 'List Templates API',
      passed: false,
      message: `Error: ${error.message}`,
    });
    console.log(`❌ Error: ${error.message}`);
  }
  
  // Test 2: Generate Project (POST)
  try {
    console.log('\n🔨 Testing POST /api/engine/generate (generate project)...');
    const payload = {
      projectName: 'test-chrome-extension',
      projectType: 'chrome-extension',
      platforms: ['web'],
      requirements: {
        authentication: false,
        database: false,
        realtime: false
      },
      customRequirements: 'Add a simple popup with a greeting message'
    };

    const response = await fetch(`${BASE_URL}/api/engine/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (response.ok) {
      results.push({
        test: 'Generate Project API',
        passed: data.success || false,
        message: data.success 
          ? `Generated ${data.filesGenerated?.length || 0} files`
          : `Generation failed: ${data.errors?.join(', ') || 'Unknown error'}`,
        data: {
          success: data.success,
          filesGenerated: data.filesGenerated?.length || 0,
          errors: data.errors || [],
          nextSteps: data.nextSteps || []
        }
      });
      
      if (data.success) {
        console.log(`✅ Success: Generated ${data.filesGenerated?.length || 0} files`);
      } else {
        console.log(`❌ Generation failed: ${data.errors?.join(', ') || 'Unknown error'}`);
      }
    } else {
      results.push({
        test: 'Generate Project API',
        passed: false,
        message: `HTTP ${response.status}: ${data.error || 'Unknown error'}`,
        data: data
      });
      console.log(`❌ HTTP ${response.status}: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    results.push({
      test: 'Generate Project API',
      passed: false,
      message: `Error: ${error.message}`,
    });
    console.log(`❌ Error: ${error.message}`);
  }

  // Test 3: AI Echo
  try {
    console.log('\n🤖 Testing GET /api/ai/echo...');
    const response = await fetch(`${BASE_URL}/api/ai/echo?provider=openai&message=ping`);
    const data = await response.json();
    
    if (response.ok && data.ok) {
      results.push({
        test: 'AI Echo API',
        passed: true,
        message: `AI responded: ${data.contentSnippet?.substring(0, 50) || 'No content'}`,
        data: {
          provider: data.routedProvider,
          model: data.model
        }
      });
      console.log(`✅ Success: AI responded via ${data.routedProvider}`);
    } else {
      results.push({
        test: 'AI Echo API',
        passed: false,
        message: `Failed: ${data.error || 'Unknown error'}`,
        data: data
      });
      console.log(`❌ Failed: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    results.push({
      test: 'AI Echo API',
      passed: false,
      message: `Error: ${error.message}`,
    });
    console.log(`❌ Error: ${error.message}`);
  }

  // Print Summary
  console.log('\n📊 Test Results Summary\n');
  
  let passed = 0;
  let failed = 0;

  results.forEach((result) => {
    const status = result.passed ? '✅' : '❌';
    const color = result.passed ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';
    
    console.log(`${status} ${color}${result.test}${reset}`);
    console.log(`   ${result.message}`);
    
    if (result.data && typeof result.data === 'object' && Object.keys(result.data).length > 0) {
      console.log(`   Data: ${JSON.stringify(result.data, null, 2).substring(0, 200)}...`);
    }
    
    console.log('');
    
    if (result.passed) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log(`\n🎯 Final Score: ${passed} passed, ${failed} failed\n`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! The Generation Engine API is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the details above.');
    process.exit(1);
  }
}

// Run the tests
testAPI().catch(console.error);
