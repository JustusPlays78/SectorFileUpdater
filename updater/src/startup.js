let systemsettings = "systemfile.json";
let settings = "settings.json";
var filePath = "F:\\02 Benutzer\\Chef\\Dokumente\\00 Git\\sectorfileupdater\\updater"; // Set to exe path ex: app.getPath('exe') + '\\' + systemsettings;

async function firstStart() {
    // Get the file path
    // filePath = await app.getPath('home');

    // Check if the system settings file exists
    if (fs.existsSync(`${filePath}/${systemsettings}`)) {
        // If the file exists, read the structure
        systemstructure = JSON.parse(fs.readFileSync(filePath + "\\" + systemsettings, 'utf8'));
    } else {
        // If the file doesn't exist, get the user path and create the file
        await changeUserpath();
        // fs.writeFileSync(filePath + "\\" + systemsettings, JSON.stringify(systemstructure, null, 4), 'utf8');
    }

    // Check if the user settings file exists
    if (fs.existsSync(`${systemstructure.path}/${settings}`)) {
        // If the file exists, read the structure
        structure = JSON.parse(fs.readFileSync(systemstructure.path + "\\" + settings, 'utf8'));
    } else {
        // If the file doesn't exist, create the file with the default structure
        fs.writeFileSync(systemstructure.path + "\\" + settings, JSON.stringify(structure, null, 4), 'utf8');
    }


    // Perform other necessary actions
    await getUpdates();
    // Update the UI with the settings from the user structure
    updateUI();
}

function updateUI() {

    if (structure.realname.save) {
        realnameInput.value = structure.realname.name;
        checkBoxRealname.checked = true;
    }
    if (structure.cid.save) {
        usernameInput.value = structure.cid.id;
        checkBoxUsername.checked = true;
    }
    if (structure.password.save) {
        passwordInput.value = structure.password.pass;
        checkBoxPassword.checked = true;
    }
    if (structure.passwordhoppie.save) {
        passwordhoppieInput.value = structure.passwordhoppie.pass;
        checkBoxSavepwhoppie.checked = true;
    }
    dirBox.value = systemstructure.path;
    // Set the rating WIP!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    var index = [...rating.options].findIndex(o => o.value == structure.rating);
    if (index > -1) {
        rating.options[index].selected = true;
    }
    gng.selectedIndex = structure.region;
    if (files.selectedIndex < 0) {
        files.selectedIndex = 0;
    } else {
        files.selectedIndex = structure.file;
    }
}

// async function firstStart() {
//     // await ipcRenderer.send('app-path');
//     // await ipcRenderer.on("app-path", async(event, path) => {
//     //     filepath = path;
//     // });
//     // await delay(2000); // Not the best solution
//     // filepath = await app.getPath('home') + '\\' + systemsettings;
//     if (await fs.existsSync(filepath + "\\" + systemsettings)) {
//         systemstructure = JSON.parse(fs.readFileSync(filepath + "\\" + systemsettings, 'utf8'));
//     } else {
//         await changeUserpath();
//     }
//     delay(100);
//     if (await fs.existsSync(systemstructure.path + "\\" + settings)) {
//         structure = JSON.parse(await fs.readFileSync(systemstructure.path + "\\" + settings, 'utf8'));
//         if (structure.cid.save == true) {
//             usernameInput.value = structure.cid.id;
//         }
//         if (structure.password.save == true) {
//             passwordInput.value = structure.password.pass;
//         }
//         if (structure.passwordhoppie.save == true) {
//             passwordhoppieInput.value = structure.passwordhoppie.pass;
//         }
//         if (structure.cid.save == true) {
//             checkBoxUsername.checked = true;
//         }
//         if (structure.password.save == true) {
//             checkBoxPassword.checked = true;
//         }
//         if (structure.passwordhoppie.save == true) {
//             checkBoxSavepwhoppie.checked = true;
//         }
//         dirBox.value = systemstructure.path;

//     } else {
//         fs.writeFileSync(systemstructure.path + "\\" + settings, JSON.stringify(structure, null, 4), 'utf8');
//         gng.selectedIndex = structure.region;
//         if (files.selectedIndex < 0) {
//             files.selectedIndex = 0;
//         } else {
//             files.selectedIndex = structure.file;
//         }
//         // Broken

//     }
//     await getUpdates();
//     gng.selectedIndex = structure.region;
//     if (files.selectedIndex < 0) {
//         files.selectedIndex = 0;
//     } else {
//         files.selectedIndex = structure.file;
//     }
//     await getFiles();
//     save();
// }