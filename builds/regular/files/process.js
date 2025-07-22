#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    template: null,
    data: null,
    output: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--data' || arg === '-d') {
      if (i + 1 < args.length) {
        options.data = args[++i];
      } else {
        console.error('Error: --data flag requires a file path');
        process.exit(1);
      }
    } else if (arg === '--output' || arg === '-o') {
      if (i + 1 < args.length) {
        options.output = args[++i];
      } else {
        console.error('Error: --output flag requires a file path');
        process.exit(1);
      }
    } else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node sample.js <template.hbs> [options]');
      console.log('');
      console.log('Options:');
      console.log('  -d, --data <file>    JSON data file (optional)');
      console.log('  -o, --output <file>  Output file (optional, defaults to stdout)');
      console.log('  -h, --help           Show this help message');
      process.exit(0);
    } else if (!options.template) {
      options.template = arg;
    } else {
      console.error(`Unknown argument: ${arg}`);
      process.exit(1);
    }
  }

  return options;
}

// Parse command line arguments
const options = parseArgs();

// Simple CLI usage: node sample.js template.hbs [--data data.json] [--output output.txt]
if (!options.template) {
  console.error('Usage: node sample.js <template.hbs> [options]');
  console.error('Use --help for more information');
  process.exit(1);
}

const templatePath = options.template;
const dataPath = options.data;
const outputPath = options.output;

try {
  const templateContent = fs.readFileSync(path.resolve(templatePath), 'utf8');
  
  let data = {};
  if (dataPath) {
    const dataContent = fs.readFileSync(path.resolve(dataPath), 'utf8');
    data = JSON.parse(dataContent);
  }

  const template = handlebars.compile(templateContent);
  const result = template(data);

  if (outputPath) {
    fs.writeFileSync(path.resolve(outputPath), result, 'utf8');
  } else {
    process.stdout.write(result);
  }
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}