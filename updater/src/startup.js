let systemsettings = "systemfile.json";
let settings = "settings.json";
var filepath = "F:\\02 Benutzer\\Chef\\Dokumente\\00 Git\\sectorfileupdater\\updater"; // Set to exe path ex: app.getPath('exe') + '\\' + systemsettings;
async function firstStart() {
    // await ipcRenderer.send('app-path');
    // await ipcRenderer.on("app-path", async(event, path) => {
    //     filepath = path;
    // });
    // await delay(2000); // Not the best solution
    // filepath = await app.getPath('home') + '\\' + systemsettings;
    await console.log(filepath + "\\" + systemsettings);
    if (await fs.existsSync(filepath + "\\" + systemsettings)) {
        systemstructure = JSON.parse(fs.readFileSync(filepath + "\\" + systemsettings, 'utf8'));
    } else {
        await changeUserpath();
    }
    delay(100);
    if (await fs.existsSync(systemstructure.path + "\\" + settings)) {
        console.log(fs.readFileSync(systemstructure.path + "\\" + settings, 'utf8'));
        structure = JSON.parse(await fs.readFileSync(systemstructure.path + "\\" + settings, 'utf8'));
        if (structure.cid.save == true) {
            usernameInput.value = structure.cid.id;
        }
        if (structure.password.save == true) {
            passwordInput.value = structure.password.pass;
        }
        if (structure.passwordhoppie.save == true) {
            passwordhoppieInput.value = structure.passwordhoppie.pass;
        }
        if (structure.cid.save == true) {
            checkBoxUsername.checked = true;
        }
        if (structure.password.save == true) {
            checkBoxPassword.checked = true;
        }
        if (structure.passwordhoppie.save == true) {
            checkBoxSavepwhoppie.checked = true;
        }
        dirBox.value = systemstructure.path;

    } else {
        fs.writeFileSync(systemstructure.path + "\\" + settings, JSON.stringify(structure, null, 4), 'utf8');
        gng.selectedIndex = structure.region;
        if (files.selectedIndex < 0) {
            files.selectedIndex = 0;
        } else {
            files.selectedIndex = structure.file;
        }
        // Broken

    }
    await getUpdates();
    gng.selectedIndex = structure.region;
    if (files.selectedIndex < 0) {
        files.selectedIndex = 0;
    } else {
        files.selectedIndex = structure.file;
    }
    await getFiles();
    save();
}