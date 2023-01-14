function save() {
    // WORK HERE, new files
    // Read config
    structure = JSON.parse(fs.readFileSync(systemstructure.path + "\\" + settings, 'utf8'));
    structure.region = gng.selectedIndex;
    structure.file = files.selectedIndex;
    if (structure.file == -1) {
        structure.file = 0;
    }
    if (checkBoxUsername.checked == true) {
        structure.cid.id = usernameInput.value;
        structure.cid.save = true;
    } else {
        structure.cid.id = -1;
        structure.cid.save = false;
    }
    if (checkBoxPassword.checked == true) {
        structure.password.pass = passwordInput.value;
        structure.password.save = true;
    } else {
        structure.password.pass = "";
        structure.password.save = false;
    }
    if (checkBoxSavepwhoppie.checked == true) {
        structure.passwordhoppie.pass = passwordhoppieInput.value;
        structure.passwordhoppie.save = true;
    } else {
        structure.passwordhoppie.pass = "";
        structure.passwordhoppie.save = false;
    }
    // WIP
    //structure.currentInstalledAirac = currentAirac;
    //structure.version = airacversion;
    // Save config
    fs.writeFileSync(systemstructure.path + "\\" + settings, JSON.stringify(structure, null, 4), 'utf8');
};