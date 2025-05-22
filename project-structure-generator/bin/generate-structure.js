#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Configuration for directories and files to ignore
const DEFAULT_IGNORE_PATTERNS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  '.DS_Store',
  'Thumbs.db',
  '.vscode',
  '.idea',
  '*.log',
  '.env',
  '.env.local',
  '.env.production',
  '.env.development',
  'coverage',
  '.nyc_output',
  '.cache',
  'tmp',
  'temp',
  '.turbo'
];

// File extensions to include (empty array means include all)
const INCLUDE_EXTENSIONS = [];

// Maximum depth to scan (0 = no limit)
const MAX_DEPTH = 0;

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    help: false,
    output: 'structure.md',
    path: process.cwd(),
    ignore: [...DEFAULT_IGNORE_PATTERNS],
    maxDepth: MAX_DEPTH
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (arg === '--path' || arg === '-p') {
      options.path = path.resolve(args[++i]);
    } else if (arg === '--ignore' || arg === '-i') {
      options.ignore.push(args[++i]);
    } else if (arg === '--max-depth' || arg === '-d') {
      options.maxDepth = parseInt(args[++i]);
    } else if (!arg.startsWith('-')) {
      options.path = path.resolve(arg);
    }
  }

  return options;
}

/**
 * Display help information
 */
function showHelp() {
  console.log(`
📁 Project Structure Generator

Usage:
  npx project-structure-generator [options] [path]
  generate-structure [options] [path]

Options:
  -h, --help              Show this help message
  -o, --output <file>     Output file name (default: structure.md)
  -p, --path <path>       Project path to scan (default: current directory)
  -i, --ignore <pattern>  Add ignore pattern (can be used multiple times)
  -d, --max-depth <num>   Maximum depth to scan (default: unlimited)

Examples:
  npx project-structure-generator
  npx project-structure-generator --output README.md
  npx project-structure-generator ~/my-project --ignore "*.temp"
  npx project-structure-generator --max-depth 3

Automatically generates a beautiful directory tree structure in Markdown format.
`);
}

/**
 * Check if a file or directory should be ignored
 */
function shouldIgnore(name, ignorePatterns, isDirectory = false) {
  return ignorePatterns.some(pattern => {
    if (pattern.includes('*')) {
      // Handle wildcard patterns
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(name);
    }
    return name === pattern || name.startsWith(pattern);
  });
}

/**
 * Check if file extension should be included
 */
function shouldIncludeFile(filename) {
  if (INCLUDE_EXTENSIONS.length === 0) return true;
  const ext = path.extname(filename).toLowerCase();
  return INCLUDE_EXTENSIONS.includes(ext);
}

/**
 * Generate tree structure for a directory
 */
async function generateTree(dirPath, prefix = '', depth = 0, options = {}) {
  if (options.maxDepth > 0 && depth > options.maxDepth) return '';
  
  let result = '';
  
  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    
    // Filter and sort items
    const filteredItems = items
      .filter(item => !shouldIgnore(item.name, options.ignore, item.isDirectory()))
      .filter(item => item.isDirectory() || shouldIncludeFile(item.name))
      .sort((a, b) => {
        // Directories first, then files
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
      });

    for (let i = 0; i < filteredItems.length; i++) {
      const item = filteredItems[i];
      const isLast = i === filteredItems.length - 1;
      const currentPrefix = isLast ? '└── ' : '├── ';
      const nextPrefix = isLast ? '    ' : '│   ';
      
      result += `${prefix}${currentPrefix}${item.name}`;
      
      if (item.isDirectory()) {
        result += '/\n';
        const subPath = path.join(dirPath, item.name);
        const subTree = await generateTree(subPath, prefix + nextPrefix, depth + 1, options);
        result += subTree;
      } else {
        result += '\n';
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
  }
  
  return result;
}

/**
 * Generate complete project structure
 */
async function generateProjectStructure(projectPath, options = {}) {
  const projectName = path.basename(projectPath);
  let structure = `# Project Structure\n\n`;
  structure += `\`\`\`\n${projectName}/\n`;
  
  const tree = await generateTree(projectPath, '', 0, options);
  structure += tree;
  structure += `\`\`\`\n\n`;
  
  // Add generation timestamp
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  structure += `*Generated automatically on ${timestamp}*\n`;
  
  return structure;
}

/**
 * Main function
 */
async function main() {
  const options = parseArgs();
  
  if (options.help) {
    showHelp();
    return;
  }

  try {
    // Check if path exists
    const stats = await fs.stat(options.path);
    if (!stats.isDirectory()) {
      console.error('❌ Error: Provided path is not a directory');
      process.exit(1);
    }

    console.log(`🔍 Scanning project: ${options.path}`);
    console.log(`📝 Output file: ${options.output}`);
    
    const structure = await generateProjectStructure(options.path, options);
    
    const outputPath = path.resolve(options.output);
    await fs.writeFile(outputPath, structure, 'utf8');
    
    console.log('✅ Structure file generated successfully!');
    console.log(`📍 File saved: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();