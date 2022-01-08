const { program } = require('commander');
const { evalRunner }  = require('./src/dependency-eval-runner');
program.version('0.1.0');


/**
 * Defines the Command Line Interface by creating a commander program instance
 */
program
    .requiredOption('-p, --packageName <name>', 'Package name to evaulate the dependencies of.')
    .option('-d, --depth <max_depth_level>', 'Depth of the dependency tree to iterate on.')
    .option('-v, --packageVersion [version]',  'Package version', 'latest')
    .option('-o, --output [output-file-name]',  'Path to where to create the output file, defaults to `packageName-packageVersion.json`')
    .option('--verbose', 'Enables verbose output.')
    .on('--help', function(){
        console.log("")
        console.log("This command displays the npm dependencies of a given package, version optional")
        console.log("")
        console.log("Examples:")
        console.log("npm-dependency-eval --package neatPackage")
        console.log("npm-dependency-eval --package neatPackage --packageVersion 0.0.0")
        console.log("npm-dependency-eval -p neatPackage -v 0.0.0")
    })
    .action(async (options) => {
        await evalRunner(options)
    })
program.parse()