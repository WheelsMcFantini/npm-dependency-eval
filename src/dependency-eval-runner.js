const { getLatestPackageVersion, recursiveRoutine } = require('./dependency-eval')
const chalk = require('chalk')
const path = require('path');
const fs = require('fs-extra');

function writeOutputFile(packageName, packageVersion, output, dependencyTree) {
    console.log(`[writeOutputFile] ${output}`);
    const outputFile = output !== true ? output : `${packageName}-${packageVersion}.json`;
    console.log(`[writeOutputFile] ${output} --> ${outputFile} | ${path.extname(outputFile)}`);

    outputFileExtension = path.extname(outputFile).length === 0 ? '.json' : '';

    fs.writeFileSync(`${outputFile}${outputFileExtension}`, JSON.stringify(dependencyTree, null, 2));
}

/**
 * Function which takes an option object which may contain the following:
 * - packageName: name of the requested package to evaluate it's dependecy tree
 * - packageVersion: the specific version of the requested package to evaulate 
 * - depth: max depth to iterate to when evaulating the dependecy tree
 * @param {Object} options 
 */
async function evalRunner(options) {
    console.time("evalrunner")

    const { packageName, depth, output } = options


    let { packageVersion } = options

    console.log(`[evalRunner] requested package to evaluted: ${packageName}@${packageVersion}`);

    //logic to ensure we can feed a package name and version to getDependencyList
    if (packageVersion === undefined || packageVersion === 'latest') {
        console.log(`${chalk.red("[evalRunner]")} packageVersion was undefined or latest, retrieving latest package version`)
        packageVersion = await getLatestPackageVersion(packageName)
    }

    const dependencyTree =  await recursiveRoutine(packageName, packageVersion, 1)
    // dependencyTree = {};
    if (output) {
        writeOutputFile(packageName, packageVersion, output, dependencyTree);
    } else {
        console.log(JSON.stringify(dependencyTree, null , 2));
    }
    
    console.timeEnd("evalrunner")
    
}

module.exports = { evalRunner }