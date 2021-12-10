const { option } = require('commander');
const { getLatestPackageVersion, 
    getDependencyList, 
    convertToTree,
    fetchPackageInfo } = require('./dependency-eval');
const chalk = require('chalk');
async function evalRunner(options) {
    const { packageName } = options;
    let { packageVersion} = options;

    console.log(`[evalRunner] package Name:  ${packageName}`);
    //alternate if statement:
    // if packageVersion exists, assign it;s value to itsself. 
    // packageVersion = packageVersion ? packageVersion : await getLatestPackageVersion(packageName);
    
    if (packageVersion == undefined) {
        console.log(`${chalk.red("[evalRunner]")} packageVersion was undefined`)
        console.log(`${chalk.red("[evalRunner]")} Retrieving latest package version`)
        packageVersion = await getLatestPackageVersion(packageName);
        console.log(`${chalk.green("[evalRunner]")} ${packageName} latest version is ${packageVersion}`)
    } else {
        console.log("[evalRunner] packageVersion was defined")
        console.log(`[evalRunner] packageVersion: ${packageVersion}`)
    }
    console.log(`${chalk.green("[evalRunner]")} retrieved package Version:  ${packageVersion}`);
    
    const requestedPackageInfo = await fetchPackageInfo(packageName, packageVersion);
    console.log(`[dependency-eval] ${requestedPackageInfo.name}`)
    console.log(`[dependency-eval] ${requestedPackageInfo.version}`)

    const deps = await getDependencyList(requestedPackageInfo);
    console.log(deps)

    return;
}

module.exports = { evalRunner} ;