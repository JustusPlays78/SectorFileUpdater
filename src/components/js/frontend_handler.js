const HomeType= {
    Home: 1,
    Push: 2,
    Settings: 3
}

function ChangeSite(mimetype){
    console.log(mimetype);
    if (mimetype === HomeType.Home){
        homeDiv.style.display = 'block';
        pushDiv.style.display = 'none';
        settingsDiv.style.display = 'none';
    } else if (mimetype === HomeType.Push){
        homeDiv.style.display = 'none';
        pushDiv.style.display = 'block';
        settingsDiv.style.display = 'none';
    } else if (mimetype === HomeType.Settings){
        homeDiv.style.display = 'none';
        pushDiv.style.display = 'none';
        settingsDiv.style.display = 'block';
    }
}