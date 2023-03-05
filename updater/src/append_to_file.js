let filesAppended = [];

function searchAndAppendCredentials(dir, data) {
    var stringToAppend = `\nLastSession	connecttype	0\nLastSession	realname	${data[0]}\nLastSession	certificate	${data[1]}\nLastSession	password	${data[2]}\nLastSession	rating	${data[3]}\nLastSession	server	AUTOMATIC\nLastSession	tovatsim	1\n`;
    fs.readdir(dir, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            const filepath = path.join(dir, file);
            fs.stat(filepath, (err, stat) => {
                if (err) throw err;
                if (stat.isDirectory()) {
                    searchAndAppend(filepath, data);
                } else if (path.extname(file) === '.prf') {
                    fs.readFile(filepath, 'utf8', (err, data) => {
                        if (err) throw err;
                        const lastLine = data.split('\n').slice(-2)[0];
                        if (lastLine !== stringToAppend.split('\n').slice(-2)[0] && !filesAppended.includes(filepath)) {
                            fs.appendFile(filepath, stringToAppend, (err) => {
                                if (err) throw err;
                                // console.log(`The following lines were appended to ${filepath}`);
                                filesAppended.push(filepath);
                            });
                        }
                    });
                }
            });
        });
    });
}

function searchAndInsertHoppie(directory) {
    let files = [];
    const targetFile = "TopSkyCPDLChoppieCode.txt";

    function searchDir(dir) {
        fs.readdirSync(dir).forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                search(filePath);
            } else if (file === targetFile) {
                files.push(filePath);
            }
        });
    }
    search(directory);

    files.forEach(file => {
        fs.writeFileSync(file, passwordhoppieInput.value, (err) => {
            if (err) {
                console.log(err);
            }
        });
    });
}