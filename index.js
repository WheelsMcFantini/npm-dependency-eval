//Creates a js object, and uses "destructuring assignment" to pull a value out of the output of commander
//and pack it into the created object
const { program, version } = require('commander');
const { evalRunner }  = require('./src/evalRunner');
program.version('0.1.0');

/*
So, the following block defines properties of the program object that commander gave us
It has a required option of packageName, and an option for a version
When it recieves the --help argument, it prints out the help. 
Once that code runs, I can pull the given arguments from it and run my program. 
*/
program
    .requiredOption('-p, --packageName <name>', 'package to evaulate the dependencies of')
    .option('-v, --packageVersion [version]',  "package version")
    .option('-d, --debug', 'enables verbose output')
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
        await evalRunner(options);
        console.log("done!")
        console.log("eden is cool, here is his email:")
        console.log("mendeleden@gmail.com");
        // console.log(options);
    })
program.parse()

//const options = program.opts()

/* //console.log(options)
//console.log(options["package"])

var results  = getDependencyList(options["package"])
console.log("results:")
console.log(results)
console.log("")
console.log(eval.getDependencyList(options["package"]))
/*if (results[0] != undefined) {
      console.log("Dependencies:")
      console.log(results[0])
    }
if (results[1] != undefined) {
      console.log("Dev Dependencies:")
      console.log(results[1])
    }*/ 