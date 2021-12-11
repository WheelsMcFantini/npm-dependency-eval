//importing commander
const { option } = require('commander')
//importing the fucntions I exported with module.exports
const { getLatestPackageVersion,
    getDependencyList,
    fetchPackageInfo,
    getDependenciesOfDependencies } = require('./dependency-eval')
const chalk = require('chalk')

async function evalRunner(options) {
    console.time("evalrunner")
    const { packageName, depth } = options
    let { packageVersion } = options

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
    console.log(`[evalRunner] ${requestedPackageInfo.name}`)
    console.log(`[evalRunner] ${requestedPackageInfo.version}`)

    const dependencies = await getDependencyList(requestedPackageInfo)

    //output the dependencies programatically, eventually look up each one
    //dependency is an object like {'coolPackage/neat-feature': 4.2.0, etc}
    if (depth > 0) { 
        //create an object, get dependencies of dependencies ${depth} times and print them all
        masterDependencyTree = {}
        console.log(`[evalRunner] Depth: ${depth}`)
        for (let i = 0; i <= depth; i++) {
            console.log(`[evalRunner] Round: ${i}`)
            depKey = i
            masterDependencyTree[depKey] = await getDependenciesOfDependencies(dependencies)
        }
        console.log(`[evalRunner] Dependencies for ${packageName}:${packageVersion}:`)
        console.log(` ${JSON.stringify(masterDependencyTree[0], null, 2)}`)
    } else {
        console.log(`[evalRunner] Dependencies for ${packageName}:${packageVersion}:`)
        console.log(` ${JSON.stringify(dependencies, null, 2)}`)
    }
    console.timeEnd("evalrunner")
    return
}

module.exports = { evalRunner }