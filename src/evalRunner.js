const {getDependencyList, convertToTree }= require('./dependency-eval');

async function evalRunner(options) {
    const { packageName, packageVersion} = options;
    console.log(`[evalRunner] packagane NAme:  ${packageName}`);
    console.log(`[evalRunner] packagane Version:  ${packageVersion}`);
    
    convertToTree();
    /**
     * Some Logic!
     */
    // Run in some fashion to get some result getDependencyList
    // Logic!

    return;
}

module.exports = { evalRunner} ;