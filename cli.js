//Creates a js object, and uses "destructuring assignment" to pull a value out of the output of commander
//and pack it into the created object
const { program } = require('commander');
const { evalRunner }  = require('./src/evalRunner');
program.version('0.1.0');
const chalk = require('chalk')

const cliLogger = (msg) => console.log(`${chalk.blue('[cli]')} ${msg}`);

/**
 * So, the following block defines properties of the program object that commander gave us
 * It has a required option of packageName, and an option for a version
 * When it recieves the --help argument, it prints out the help. 
 * Once that code runs, I can pull the given arguments from it and run my program. 
 */
program
    .requiredOption('-p, --packageName <name>', 'package to evaulate the dependencies of')
    // Question: Should we default to get the entire dependecy tree? Should --depth only accept string or also numbers, both?
    .option('-d, --depth <max_depth_level>', 'A numerical value of depth of the dependency tree', 'max')
    .option('-v, --packageVersion [version]',  "package version")
    .option('--debug', 'enables verbose output')
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
        cliLogger(`awaiting eval runner`)
        await evalRunner(options)
    })
program.parse()