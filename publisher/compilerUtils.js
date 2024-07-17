import { spawn } from 'child_process';
import path from 'path';
import { isPath } from './fileUtils.js';


class FaustCompiler
{

    constructor(filePath = "faust"){
        this.faustPath = filePath; 
    }

    compileAsync(file){

        return new Promise((resolve, reject) => {
            const faust = spawn(this.faustPath, [file, '-po']);

            faust.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            faust.on("error", (err) => {
                reject("Can't Find Faust Compiler");
            });

            faust.on('close', (code) => {
                if(code === 0){
                    resolve("Testing Completed Successfully");
                }else{
                    reject("Testing Failed");
                }
            });
        });
    }

};

async function compilePackage(pkgFolder, packageName) {
    
    const compiler = new FaustCompiler();
    const mainfilePath = path.join(pkgFolder, packageName);

    if (!isPath(mainfilePath)) {
        throw new Error("Something went wrong while publishing");
    }

    await compiler.compileAsync(mainfilePath);
    return mainfilePath;
}

export {compilePackage};


