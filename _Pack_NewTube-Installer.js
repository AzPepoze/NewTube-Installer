const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

async function ZipFolder(zipFileName, sourceDir, outputFolder) {
     const zip = new AdmZip();

     // Add the contents of the source directory to the zip
     zip.addLocalFolder(sourceDir);

     // Write the zip file to disk
     const outputPath = path.join(outputFolder, zipFileName + ".zip");
     zip.writeZip(outputPath);

     console.log(`Zip file created successfully: ${outputPath}`);
     return outputPath;
}

function emptyFolder(folderPath) {
     if (fs.existsSync(folderPath)) {
          fs.readdirSync(folderPath).forEach(file => {
               const filePath = path.join(folderPath, file);
               if (fs.lstatSync(filePath).isDirectory()) {
                    emptyFolder(filePath);
               } else {
                    fs.unlinkSync(filePath);
               }
          });
          fs.rmdirSync(folderPath);
     }
}

const { execSync } = require('child_process');

function Copy(sourceFolderPath, targetFolderPath) {
     // Empty the target folder first
     emptyFolder(targetFolderPath);

     // Create target folder if it doesn't exist
     if (!fs.existsSync(targetFolderPath)) {
          fs.mkdirSync(targetFolderPath, { recursive: true });
     }

     // Copy files from source folder to target folder
     execSync(`cp -R ${sourceFolderPath}/* ${targetFolderPath}`);

     console.log(`Contents of '${sourceFolderPath}' copied to '${targetFolderPath}'.`);
}

//----------------------------------------------------------------

(async () => {

     await Copy("build", "test");
     await ZipFolder("NewTube-Installer", "build", "release");
})();