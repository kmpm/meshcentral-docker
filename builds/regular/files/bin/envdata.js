#!/usr/bin/env node
/*
 * This script dumps all environment variables to a JSON file.
 */
const fs = require('fs');
const path = require('path');


function showUsage() {
  console.log('Usage: node envdata.js [options]');
  console.log('');
  console.log('Dumps all environment variables to a JSON file');
  console.log('');
  console.log('Options:');
  console.log('  -o, --output <file>  Output file (default: envdata.json)');
  console.log('  -p, --pretty         Pretty print JSON with indentation');
  console.log('  --prefix <string>    Filter variables by prefix (e.g., NODE_, DOCKER_)');
  console.log('  -h, --help           Show this help message');
}


function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    output: 'envdata.json',
    pretty: false,
    prefix: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--output' || arg === '-o') {
      if (i + 1 < args.length) {
        options.output = args[++i];
      } else {
        console.error('Error: --output flag requires a file path');
        process.exit(1);
      }
    } else if (arg === '--pretty' || arg === '-p') {
      options.pretty = true;
    } else if (arg === '--prefix') {
      if (i + 1 < args.length) {
        options.prefix = args[++i];
      } else {
        console.error('Error: --prefix flag requires a prefix string');
        process.exit(1);
      }
    } else if (arg === '--help' || arg === '-h') {
      showUsage();
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${arg}`);
      showUsage();
      process.exit(1);
    }
  }

  return options;
}

function mainFunction() {
  try {
    const options = parseArgs();
    
    // Get all environment variables
    let envVars = process.env;
    
    // Filter by prefix if specified
    if (options.prefix) {
      const filteredVars = {};
      for (const [key, value] of Object.entries(envVars)) {
        if (key.startsWith(options.prefix)) {
          filteredVars[key] = value;
        }
      }
      envVars = filteredVars;
    }
    
    // Convert to JSON
    const jsonOutput = options.pretty 
      ? JSON.stringify(envVars, null, 2)
      : JSON.stringify(envVars);
    
    // Write to file
    const outputPath = path.resolve(options.output);
    fs.writeFileSync(outputPath, jsonOutput, 'utf8');
    
    const totalCount = Object.keys(envVars).length;
    const prefixMsg = options.prefix ? ` with prefix "${options.prefix}"` : '';
    
    console.log(`Environment variables${prefixMsg} dumped to: ${outputPath}`);
    console.log(`Total variables: ${totalCount}`);
    
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  // If this script is run directly, execute the main function
  mainFunction();
}
