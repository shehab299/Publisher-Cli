import fs from 'fs';
import path from 'path';

function isPath(directory) {
    return fs.existsSync(directory);
}

function mkPath(directory) {
    fs.mkdirSync(directory, { recursive: true });
}

function clearDirectory(directory) {
    fs.rmSync(directory, { recursive: true });
}

function copyPackageToRegistry(mainfilePath, registryPath, owner, packageName, newVersion) {
    
    const registryPackagePath = path.join(registryPath, owner, packageName, newVersion);

    if(isPath(registryPackagePath)){
        throw new AppError(`Package ${packageName} of version ${newVersion} already exists in the registry`, 400);
    }

    mkPath(registryPackagePath);
    fs.copyFileSync(mainfilePath, path.join(registryPackagePath, packageName));
}

export { isPath, mkPath, copyPackageToRegistry, clearDirectory };
