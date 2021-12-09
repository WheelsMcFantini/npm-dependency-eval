const { extractLatestVersion, fetchLatestPackageInfo, getDependencyList, convertToTree }= require('./dependency-eval');

async function evalRunner(options) {
    const { packageName, packageVersion} = options;
    console.log(`[evalRunner] package Name:  ${packageName}`);
    if (packageVersion == undefined) {
        console.log("[evalRunner] packageVersion was undefined")
        fetchLatestPackageInfo(packageName, extractLatestVersion)
    } else {
        console.log("[evalRunner] packageVersion was defined")
        console.log(`[evalRunner] packageName: ${packageName}`)
    }
    console.log(`[evalRunner] package Version:  ${packageVersion}`);
    

    //convertToTree();
    /**
     * Some Logic!
     */
    // Run in some fashion to get some result getDependencyList
    // Logic!

    return;
}

module.exports = { evalRunner} ;