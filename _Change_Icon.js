const { load } = require('resedit/cjs');
load().then(async (ResEdit) => {

     const fs = require('fs')
     const util = require('util');

     const renameFile = util.promisify(fs.rename);
     const unlinkFile = util.promisify(fs.unlink);

     const Final = './build/NewTube-Installer/NewTube-Installer.exe'
     const Edited = './build/NewTube-Installer/NewTube-Installer-Edited.exe'

     let data = fs.readFileSync(Final);
     let exe = ResEdit.NtExecutable.from(data);
     let res = ResEdit.NtExecutableResource.from(exe);
     // -- replace version
     let iconFile = ResEdit.Data.IconFile.from(fs.readFileSync('./assets/Logo.ico'));

     ResEdit.Resource.IconGroupEntry.replaceIconsForResource(
          // destEntries
          res.entries,
          // iconGroupID
          1,
          // lang ('lang: 1033' means 'en-US')
          1033,
          // icons (map IconFileItem to IconItem/RawIconItem)
          iconFile.icons.map((item) => item.data)
     );
     let viList = ResEdit.Resource.VersionInfo.fromEntries(res.entries);
     let vi = viList[0];
     // vi.fixedInfo.fileVersionMS = 0x40004; // '1.1'

     vi.fixedInfo.fileVersionLS = 0;
     vi.setStringValues(
          { lang: 1033, codepage: 1200 },
          {
               FileVersion: `1.0.0`,
               FileDescription: `test`,
               ProductName: 'test'
          }
     );

     vi.outputToResourceEntries(res.entries);


     // write to another binary
     res.outputResource(exe, true);
     let newBinary = exe.generate();
     fs.writeFileSync(Edited, Buffer.from(newBinary));

     await unlinkFile(Final)
     await renameFile(Edited, Final)
});