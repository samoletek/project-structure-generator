# Project Structure Generator

Automatically generate directory tree structures for project documentation.

## Installation

### Quick usage with NPX (recommended)
```bash
npx project-structure-generator
```

### Global installation
```bash
npm install -g project-structure-generator
generate-structure
```

### Local project installation
```bash
npm install --save-dev project-structure-generator
```

## Usage

### Basic usage
```bash
# Generate structure.md in current directory
npx project-structure-generator

# Generate for specific project
npx project-structure-generator ~/my-project

# Custom output file
npx project-structure-generator --output README.md
```

### Command line options

```bash
generate-structure [options] [path]
```

**Options:**
- `--help`, `-h` - Show help message
- `--output`, `-o` - Output file name (default: structure.md)
- `--path`, `-p` - Project path to scan (default: current directory)
- `--ignore`, `-i` - Add ignore pattern (can be used multiple times)
- `--max-depth`, `-d` - Maximum depth to scan (default: unlimited)

### Examples

```bash
# Basic usage
npx project-structure-generator

# Scan specific directory
npx project-structure-generator ~/Documents/my-app

# Custom output file
npx project-structure-generator --output project-tree.md

# Limit depth and add custom ignores
npx project-structure-generator --max-depth 3 --ignore "*.temp"

# Multiple ignore patterns
npx project-structure-generator -i "logs" -i "*.cache" -i "temp-files"
```

## Default ignore patterns

The tool automatically ignores these files and directories:
```
node_modules, .next, .git, dist, build, .DS_Store, 
Thumbs.db, .vscode, .idea, *.log, .env*, coverage, 
.nyc_output, .cache, tmp, temp, .turbo
```

## Example output

```
# Project Structure

```
my-project/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   └── Header.tsx
│   ├── pages/
│   │   ├── about.tsx
│   │   └── index.tsx
│   └── utils/
│       └── helpers.ts
├── public/
│   ├── favicon.ico
│   └── logo.png
├── package.json
├── README.md
└── tsconfig.json
```

*Generated automatically on 05/22/2025, 14:30*
```

## Integration with package.json

Add to your project's package.json scripts:

```json
{
  "scripts": {
    "structure": "generate-structure",
    "docs": "generate-structure --output docs/structure.md"
  }
}
```

Then run:
```bash
npm run structure
```

## Requirements

- Node.js 14.0.0 or higher

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Issues

If you find any issues, please report them on GitHub.