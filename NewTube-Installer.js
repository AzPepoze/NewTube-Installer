const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const AdmZip = require('adm-zip');

async function main() {
     console.log("Checking if NewTube folder exists...");
     const newTubeFolder = path.join(process.cwd(), '..', 'NewTube');

     if (!fs.existsSync(newTubeFolder)) {
          console.log("NewTube folder doesn't exist. Getting release...");
          await getRelease();
     } else {
          console.log("NewTube folder exists. Checking version...");
          await checkVersion();
     }
}

async function checkVersion() {
     const manifestFilePath = path.join(process.cwd(), '..', 'NewTube', 'manifest.json');
     const manifest = require(manifestFilePath);
     const currentVersion = manifest.version;

     console.log("Current Version:", currentVersion);

     const releasesUrl = 'https://api.github.com/repos/AzPepoze/NewTube/releases/latest';
     const response = await fetch(releasesUrl);
     const release = await response.json();
     const latestVersion = release.tag_name.replace('v', '');

     console.log("Releases Version:", latestVersion);

     if (latestVersion > currentVersion) {
          console.log("Downloading latest release...");
          await getRelease();
     } else {
          console.log("Latest version already installed.");
     }
}

async function getRelease() {
     const releasesUrl = 'https://api.github.com/repos/AzPepoze/NewTube/releases/latest';
     const response = await fetch(releasesUrl);
     const release = await response.json();
     const assets = release.assets.filter(asset => asset.name.includes("Chromium"));

     if (assets.length === 0) {
          console.log("No Chromium release found.");
          return;
     }

     const downloadUrl = assets[0].browser_download_url;
     const downloadResponse = await fetch(downloadUrl);
     const buffer = await downloadResponse.buffer();

     const zipFilePath = path.join(process.cwd(), 'NewTube.zip');
     fs.writeFileSync(zipFilePath, buffer);

     const zip = new AdmZip(zipFilePath);
     const extractTo = path.join(process.cwd(), '..', 'NewTube');
     console.log("Emptying NewTube folder...");
     fs.rmSync(extractTo, { recursive: true, force: true });
     console.log("Extracting new release...");
     zip.extractAllTo(extractTo, true);
     fs.unlinkSync(zipFilePath);

     console.log("New release extracted to NewTube folder. Yay!");
}

main();