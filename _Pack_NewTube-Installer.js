const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

function ZipFolder(zipFileName, sourceFolderPath, targetFolderPath) {
     // Check if the source folder exists
     if (!fs.existsSync(sourceFolderPath)) {
          console.error(`Source folder '${sourceFolderPath}' does not exist.`);
          return;
     }

     // Create target folder if it doesn't exist
     if (!fs.existsSync(targetFolderPath)) {
          fs.mkdirSync(targetFolderPath, { recursive: true });
     }

     // Create a new instance of AdmZip
     const zip = new AdmZip();

     // Add files from the source folder to the zip
     const files = fs.readdirSync(sourceFolderPath);
     files.forEach(file => {
          const filePath = path.join(sourceFolderPath, file);
          if (fs.statSync(filePath).isFile()) {
               zip.addLocalFile(filePath);
          }
     });

     // Save the zip file
     const zipFilePath = path.join(targetFolderPath, zipFileName + '.zip');
     zip.writeZip(zipFilePath);

     console.log(`Folder '${sourceFolderPath}' has been zipped to '${zipFilePath}'.`);
}

const { execSync } = require('child_process');

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

Copy("build", "test");

ZipFolder("Newtube-Installer", "build", "release");