function save() {
    // Read config, if there is none, the default will be used
    structure = JSON.parse(fs.readFileSync(systemstructure.path + "\\" + settings, 'utf8'));
    structure.region = gng.selectedIndex;
    structure.file = files.selectedIndex;
    if (structure.file == -1) {
        structure.file = 0;
    }
    if (checkBoxRealname.checked == true) {
        structure.realname.name = realnameInput.value;
        structure.realname.save = true;
    } else {
        structure.realname.name = "";
        structure.realname.save = false;
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
    structure.rating = rating.options[rating.selectedIndex].id;
    // Save config
    console.log("Saving config");
    console.log(systemstructure.path + "\\" + settings);
    fs.writeFileSync(systemstructure.path + "\\" + settings, JSON.stringify(structure, null, 4), 'utf8');
};


function saveDownloadInfo(versionInfo) {
    structure.currentInstalledAirac = versionInfo[0];
    structure.version = versionInfo[1];
    fs.writeFileSync(systemstructure.path + "\\" + settings, JSON.stringify(structure, null, 4), 'utf8');
}