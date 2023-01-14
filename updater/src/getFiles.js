async function getUpdates() {
    const courses = await superagent.get('https://files.aero-nav.com/');
    let text = courses.text.match(/Download Pages([^]*?)<\/body>/g);
    console.log(text);
    let liste = text[0].match(/<b>(.*?)<\/b>/g).map(item => item.replace(/<\/?b>/g, ""));

    liste.forEach(item => {
        var option = document.createElement("option");
        option.text = item;
        dropDownGNG.add(option);
    });
    getFiles();
}


async function getFiles() {
    await removeFileItems();
    let region = "https://files.aero-nav.com/" + dropDownGNG.options[dropDownGNG.selectedIndex].text;
    let courses = await superagent.get(region);
    let text = courses.text.split("Released</th><th colspan='2'>Download</th></tr>").pop();
    text = text.split("<h1>AIRAC <small>News</small></h1>")[0];
    let rows = text.match(/<td>(.*?)<\/td>/g).map(row => row.replace(/<\/?td>/g, ""));

    let fileNames = rows.filter((row, index) => index % 5 === 1);
    let versionNumbers = rows.filter((row, index) => index % 5 === 2);
    let hrefLinks = rows.filter((row, index) => index % 5 === 4).map(row => row.match(/href="(.*?)"/)[1]);

    removeFileItems();
    fileNames.forEach((fileName, index) => {
        let option = document.createElement("option");
        option.text = fileName;
        option.version = versionNumbers[index];
        option.href = hrefLinks[index];
        dropDownFiles.add(option);
    });
    if (structure.file != -1) {
        dropDownFiles.selectedIndex = structure.file;
    }
    return hrefLinks;
}