import { execSync } from 'child_process';
import { isPath, mkPath, clearDirectory } from './fileUtils.js';


function run(command) {
    try {
        execSync(command, { stdio: ['ignore', 'ignore', 'inherit'] }); // need to change this
    } catch (error) {
        throw new Error(`Error While Publishing`, 400);
    }
}

function getRegistryDefaultBranch(git) {
    return process.env.DEFAULT_BRANCH || 'main';
}

function gitCmd(registryPath) {
    return `git -C ${registryPath}`;
}

function updateRegistry(git, registryPath, registryUrl) {
    
    if (!isPath(registryPath)) {
        run(`git clone -q --depth=1 ${registryUrl} ${registryPath}`);
    } else {
        run(`${git} config remote.origin.url ${registryUrl}`);

        const registryDefBranch = getRegistryDefaultBranch(git);

        run(`${git} clean -fd`);
        run(`${git} checkout -q -f ${registryDefBranch}`);
        run(`${git} pull origin ${registryDefBranch}`);
    }
}

function resetRegistry(git, registryPath) {
    run(`${git} reset --hard HEAD`);
}

function publishPackage(git, newVersion, branchName) {
    run(`${git} add .`);
    run(`${git} commit -m "Publish version ${newVersion}"`);
    run(`${git} push origin ${branchName}`);
}

function switchToNewBranch(git, branchName) {
    run(`${git} checkout -b ${branchName}`);
}

function downloadPackage(pkgRepo, packageName, downloadsFolder) {

    if(isPath(downloadsFolder))
        clearDirectory(downloadsFolder);

    mkPath(downloadsFolder);
    
    const pkgFolder = `${downloadsFolder}/${packageName}`;

    run(`git clone --depth=1 ${pkgRepo} ${pkgFolder}`);
    return pkgFolder;
}

export { run, getRegistryDefaultBranch, gitCmd, updateRegistry, publishPackage, downloadPackage, resetRegistry, switchToNewBranch };
