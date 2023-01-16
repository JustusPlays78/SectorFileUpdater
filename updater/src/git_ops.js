const path = require('path');

function compareFolders(templatePath, comparedPath, originalPath) {
    // get all files and directories in template folder
    const templateFiles = fs.readdirSync(templatePath, { withFileTypes: true });
    // loop through each file/directory in template folder
    templateFiles.forEach(file => {
        // create the full path for the current file/directory
        const templateFilePath = path.join(templatePath, file.name);
        const comparedFilePath = path.join(comparedPath, file.name);

        // if the current file/directory is a directory, recursively call the compareFolders function
        if (file.isDirectory()) {
            if (!fs.existsSync(comparedFilePath)) {
                fs.mkdirSync(comparedFilePath);
            }
            compareFolders(templateFilePath, comparedFilePath, originalPath);
        } else {
            // check if the file exists in the compared folder
            if (!fs.existsSync(comparedFilePath)) {
                // if it doesn't exist, copy the file from the template folder
                fs.copyFileSync(templateFilePath, comparedFilePath);
            } else {
                // if it exists, compare the contents of the file
                let templateFileContent = fs.readFileSync(templateFilePath);
                let comparedFileContent = fs.readFileSync(comparedFilePath);
                if (templateFileContent.equals(comparedFileContent)) {
                    // if the contents are the same, don't copy the file
                } else {
                    // if the contents are different, copy the file from the template folder
                    fs.copyFileSync(templateFilePath, comparedFilePath);

                    // log the file that has been updated
                    fs.appendFile(originalPath + "\\update.log", templateFilePath + " has been updated \n", (err) => {
                        if (err) throw err;
                    });
                }
            }
        }
    });

    // realname, cert, pass, rating
    data = [structure.realname.name, structure.cid.id, structure.password.pass, structure.rating];
    searchAndAppend(originalPath, data);
}