function searchAndAppend(dir, data) {
    var stringToAppend = `LastSession	connecttype	0\nLastSession	realname	${data[0]}\nLastSession	certificate	${data[1]}\nLastSession	password	${data[2]}\nLastSession	rating	${data[3]}\nLastSession	server	AMSTERDAM\nLastSession	tovatsim	1\n`;
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
                        if (lastLine !== stringToAppend.split('\n').slice(-2)[0]) {
                            fs.appendFile(filepath, stringToAppend, (err) => {
                                if (err) throw err;
                                console.log(`The following lines were appended to ${filepath}`);
                            });
                        }
                    });
                }
            });
        });
    });
}