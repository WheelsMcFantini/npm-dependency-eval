//importing commander
const { option } = require('commander')
//importing the fucntions I exported with module.exports
const { getLatestPackageVersion, 
    getDependencyList, 
    fetchPackageInfo } = require('./dependency-eval')
const chalk = require('chalk')

async function evalRunner(options) {
    const { packageName } = options
    let { packageVersion} = options

    console.log(`[evalRunner] package Name:  ${packageName}`)
    //alternate if statement:
    // if packageVersion exists, assign it;s value to itsself. 
    // packageVersion = packageVersion ? packageVersion : await getLatestPackageVersion(packageName);
    
    //logic to ensure we can feed a package name and version to getDependencyList
    if (packageVersion == undefined) {
        console.log(`${chalk.red("[evalRunner]")} packageVersion was undefined`)
        console.log(`${chalk.red("[evalRunner]")} Retrieving latest package version`)
        packageVersion = await getLatestPackageVersion(packageName)
        console.log(`${chalk.green("[evalRunner]")} ${packageName} latest version is ${packageVersion}`)
    } else {
        console.log("[evalRunner] packageVersion was defined")
        console.log(`[evalRunner] packageVersion: ${packageVersion}`)
    }
    //console.log(`${chalk.green("[evalRunner]")} retrieved package Version:  ${packageVersion}`);
    
    const requestedPackageInfo = await fetchPackageInfo(packageName, packageVersion);
    console.log(`[dependency-eval] ${requestedPackageInfo.name}`)
    console.log(`[dependency-eval] ${requestedPackageInfo.version}`)

    const dependencies = await getDependencyList(requestedPackageInfo)

    //output the dependencies programatically, eventually look up each one
    //dependency is an object like {'coolPackage/neat-feature': 4.2.0, etc}
    bigDeps = {}
    for (const dependency in dependencies) {
        console.log(`[dependency-eval] grabbing dependencies for ${dependency}:${dependencies[dependency]}`)
        depKey = `${dependency}:${dependencies[dependency]}`
        bigDeps[depKey] = await getDependencyList(requestedPackageInfo)
      }
    console.log(bigDeps)
    return
}

module.exports = { evalRunner} 