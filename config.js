import os from 'os';
import path from 'path';



function getDefault() {

    let defaultPath = '';

    if (os.platform() === 'win32') {
        defaultPath = path.join(process.env.APPDATA, 'Faust');
    } else if (os.platform() === 'darwin') {
        defaultPath = path.join(process.env.HOME, 'Library', 'Faust');
    } else {
        defaultPath = path.join(process.env.HOME, '.faust');
    }

    return defaultPath
}


function config(){
    if(!process.env.FAUST_PATH) {
        process.env.FAUST_PATH = getDefault();
    }
}

export default config;