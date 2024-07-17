import { updateRegistry, publishPackage, downloadPackage, gitCmd, switchToNewBranch } from './gitUtils.js';
import { copyPackageToRegistry } from './fileUtils.js';
import { compilePackage } from './compilerUtils.js';
import parseUrl from './parseLink.js';


function getVersion(pkgFolder) { // not sure if this is the right way to get the version
    return "0.0.5";
}

async function publish(registryPath, registryUrl, pkgRepo, downloadsFolder, author) {

    const git = gitCmd(registryPath);

    updateRegistry(git, registryPath, registryUrl);

    const parts = parseUrl(pkgRepo);
    const owner = parts.owner;
    const packageName = parts.repo;

    const pkgFolder = downloadPackage(pkgRepo, packageName, downloadsFolder);

    const mainfilePath = await compilePackage(pkgFolder, packageName);

    const newVersion = getVersion(pkgFolder);

    const branchName= `${author}-${packageName}-${newVersion}-${Date.now()}`;
    switchToNewBranch(git, branchName);

    copyPackageToRegistry(mainfilePath, registryPath, author, packageName, newVersion);
    publishPackage(git, newVersion, branchName);
}

export default publish;
