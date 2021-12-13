//importing commander
const chalk = require('chalk')
const { option } = require('commander')

//importing the fucntions I exported with module.exports
const { 
    getLatestPackageVersion,
    getDependencyList,
    fetchPackageInfo,
    getDependenciesOfDependencies } = require('./dependency-eval')

const evalLogger = (msg) => console.log(`${chalk.magenta('[eval-runner]')} ${msg}`);

async function evalRunner(options) {
    evalLogger(`Started EvalRunner`);
    console.time("evalrunner"); // Start timer to determine how long eval timer ran for

    // Question: Should we verify if depth is a negative number?
    const { packageName, depth } = options
    // Question: What to do when package version isn't a semantic version or latest?
    let { packageVersion } = options

    evalLogger(`package Name: ${packageName}`);
    // alternate if statement: if packageVersion exists --> assign it's value to itself, otherwise determine latest version 
    // packageVersion = packageVersion ? packageVersion : await getLatestPackageVersion(packageName);

    //logic to ensure we can feed a package name and version to getDependencyList
    if (packageVersion == undefined) {
        evalLogger(`packageVersion was undefined, retrieving 'latest' information to extract package version.`)
        packageVersion = await getLatestPackageVersion(packageName)
        evalLogger(`${packageName} latest version is ${packageVersion}`)
    } else {
        evalLogger(`packageVersion was defined, packageVersion: ${packageVersion}`)
    }

    const requestedPackageInfo = await fetchPackageInfo(packageName, packageVersion);
    
    const dependencies = await getDependencyList(requestedPackageInfo)
    console.log(dependencies);
    // Potential conversion to an array which is easier to iterate over
    const arrayOfDependecies = Object.entries(dependencies)
        .map( entry => {
          const [name, version] = entry;
          return {name, version}
        })
    console.log(arrayOfDependecies);
    evalLogger(`Package Name: ${requestedPackageInfo.name}, Package Version: ${requestedPackageInfo.version}, has ${dependencies.length} dependecies.`)

    //output the dependencies programatically, eventually look up each one
    //dependency is an object like {'coolPackage/neat-feature': 4.2.0, etc}
    if (depth > 0) { 
        //create an object, get dependencies of dependencies ${depth} times and print them all
        // Question: should we start the master dependecy tree with our requested package as the top item?
        masterDependencyTree = {}
        console.log(`[evalRunner] Depth: ${depth}`)
        for (let i = 0; i <= depth; i++) {
            console.log(`[evalRunner] Round: ${i}`)
            depKey = i
            // Are we recursivley calling it for each package? I think we may be iterating and fetching the same URLs over and over
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