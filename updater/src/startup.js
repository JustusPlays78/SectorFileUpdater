let systemsettings = "systemfile.json";
let settings = "settings.json";
let filePath = "";

//var filePath = app.getPath('exe') + '\\' + systemsettings; // Set to exe path ex: app.getPath('exe') + '\\' + systemsettings;

async function firstStart() {
    await ipcRenderer.send('app-path-get');
    await ipcRenderer.on("app-path-get", (event, path) => {
        filePath = path; // 'undefined\settings.json'
    });

    await delay(250);
    // Check if the system settings file exists
    if (fs.existsSync(`${filePath}/${systemsettings}`)) {
        // If the file exists, read the structure
        systemstructure = JSON.parse(fs.readFileSync(`${filePath}/${systemsettings}`, 'utf8'));
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
        fs.writeFileSync(`${systemstructure.path}/${settings}`, JSON.stringify(structure, null, 4), 'utf8');
    }


    // Perform other necessary actions
    await getUpdates();
    // Update the UI with the settings from the user structure
    updateUI();
}

function updateUI() {

    console.log(structure);

    if (structure.realname.save) {
        realnameInput.value = structure.realname.name;
        checkBoxRealname.checked = true;
    }
    if (structure.cid.save) {
        usernameInput.value = structure.cid.id;
        checkBoxUsername.checked = true;
    }
    if (structure.password.save) {
        //passwordInput.value = structure.password.pass;
        checkBoxPassword.checked = true;
    }
    if (structure.passwordhoppie.save) {
        //passwordhoppieInput.value = structure.passwordhoppie.pass;
        checkBoxSavepwhoppie.checked = true;
    }
    dirBox.value = systemstructure.path;
    const selectElement = document.getElementById("rating");
    const optionElement = document.getElementById(structure.rating);
    selectElement.selectedIndex = optionElement.index;

    applyToPrf.checked = structure.applyToPrf;
    applyHoppie.checked = structure.applyHoppie;

    dropDownGNG.selectedIndex = structure.region;

    // gng.selectedIndex = structure.region;
    if (files.selectedIndex < 0) {
        files.selectedIndex = 0;
    } else {
        files.selectedIndex = structure.file;
    }
}