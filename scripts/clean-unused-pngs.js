const fs = require('fs');
const path = require('path');

// config
const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DRY_RUN = !process.argv.includes('--run');

// Ignore these directories when scanning for usage
const IGNORE_DIRS = ['node_modules', '.git', '.next', 'docx_images'];
// Allowed file extensions to check for references
const TEXT_EXTENSIONS = /\.(ts|tsx|js|jsx|css|scss|json|md|html|env)$/;

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    
    // Ignore specific directories
    if (IGNORE_DIRS.includes(file)) {
      return;
    }

    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

console.log('Scanning project directories...');
const allProjectFiles = getAllFiles(ROOT_DIR);

// Find all PNGs in public/
const pngFiles = allProjectFiles.filter(file => 
  file.startsWith(PUBLIC_DIR) && file.toLowerCase().endsWith('.png')
);

console.log(`Found ${pngFiles.length} PNG files in public/ directory.`);

// Get all source files to scan
const sourceFiles = allProjectFiles.filter(file => TEXT_EXTENSIONS.test(file));

console.log(`Reading ${sourceFiles.length} source files to check for references...`);
const fileContents = sourceFiles
  .map(file => {
    try {
      return fs.readFileSync(file, 'utf8');
    } catch (err) {
      return '';
    }
  })
  .join('\n');

const unusedPngs = [];

pngFiles.forEach(pngPath => {
  const basename = path.basename(pngPath);
  
  if (!fileContents.includes(basename)) {
    unusedPngs.push(pngPath);
  }
});

console.log(`\n================================`);
console.log(`Found ${unusedPngs.length} completely UNUSED PNG files:`);
console.log(`================================\n`);

unusedPngs.forEach(file => {
  console.log(`- ${path.relative(ROOT_DIR, file)}`);
});

if (DRY_RUN) {
  console.log('\n---------------------------------------------------------');
  console.log('  DRY RUN MODE: No files were actually deleted.');
  console.log('  To delete these files, run: node scripts/clean-unused-pngs.js --run');
  console.log('---------------------------------------------------------');
} else {
  console.log('\n---------------------------------------------------------');
  console.log('  FINAL VERSION: Deleting unused files...');
  let deletedCount = 0;
  unusedPngs.forEach(file => {
    try {
      fs.unlinkSync(file);
      deletedCount++;
    } catch (e) {
      console.error(`  Failed to delete ${file}: ${e.message}`);
    }
  });
  console.log(`  Successfully deleted ${deletedCount} files.`);
  console.log('---------------------------------------------------------');
}
