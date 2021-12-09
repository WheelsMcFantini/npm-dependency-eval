const https = require('https');
const fetch = require('node-fetch')
const VERSION = ""
const REGISTRY_API = "registry.npmjs.org"

//Basic flow: Take in a package name
//query that package and pull down it;s dependency list into a dictionary. 
//key = package, value = empty dict?
//populate each value with the same package > dependency
//visualize?

function extractLatestVersion(packageInfo){
  console.log(`[dependency-eval] Recieved: ${packageInfo}`)
  const { version } = packageInfo
  console.log(`[dependency-eval] Extracted: ${version}`)
  console.log(version)
}


function fetchLatestPackageInfo(packageName, callback) {
  var object
  const url = `https://${REGISTRY_API}/${packageName}/latest`
  console.log(`[dependency-eval] Fetching url: ${url}`)
  fetch(url)
      .then(res => res.json())//fetch returns a response object, this is assigned to 'res' to the left of the arrow. 
      //to the right of the arrow is an anonymous function that takes the left side of the arrow as input
      .then(data => object = data)//this one takes the return value of res.json() as data and attempts to assign it;s value to object
      .then(() => callback(object))//
}

//callback function for ensuring the package exists/I connected properly?

async function getDependencyList(options) {
  const { packageName, packageVersion } = options
  console.log(`[dependency-eval] package Name:  ${packageName}`)
  console.log(`[dependency-eval] package Version:  ${packageVersion}`)

  const url = `https://${REGISTRY_API}/${packageName}/${packageVersion}`
  console.log(url)
  //fetch(url)
  return;

  // const options = {
  // hostname: REGISTRY_API,
  // port: 443,
  // path: '/' + packageName + '/latest',
  // method: 'GET'
  // }
  //runs an http get and then creates an anonymous arrow function that happens for get
  https.get(options, res => {
    let data = [];
    const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';

    console.log('Status Code:', res.statusCode);
    console.log('Date in Response header:', headerDate);

    //on the response event (and every time) 
    //push the recieved data chunk onto the data buffer array
    res.on('data', chunk => {
      data.push(chunk);
    });

    res.on('end', () => {
      console.log('Response ended: ');
      //Thanks LogRocket! Create a constant called dependencies
      //Take the http data buffer and have iut concatenante the data into a string
      //then json.parse it so it's a js object
      const responseObj = JSON.parse(Buffer.concat(data).toString());
      const dependencies = responseObj["dependencies"]
      const devDependencies = responseObj["devDependencies"]
      console.log(responseObj)
      console.log("")
      console.log(responseObj["dependencies"])
      console.log("")
      //return [ dependencies, devDependencies ]
      dependencyArray = JSON.parse(dependencies)
      devDependencyArray = JSON.parse(devDependencies)

      console.log(dependencyArray)
      console.log(devDependencyArray)
      //I'd like this function to be more generic so I can use ti repeatedly
      //to fetch each packages dependencies
      //TODO

      //loop through the dependency objects and make a dict out of them

      //dependencyObj = [dependencies, devDependencies]
      //return dependencyObj
      //do I use the versions at all? I feel like I should but it's not obvious to me how to


      /* for(user of users) {
        console.log(`Got user with id: ${user.id}, name: ${user.name}`);
      } */
    });
  }).on('error', err => {
    console.log('Error: ', err.message);
  })
}

//console.log(packageName)
//packageName = "puppeteer"
//console.log(packageName)
//const deps = getDependencyList(packageName)

//console.log(deps)

function convertToTree() {
  console.log('[convertToTree] lol converting to tree');
}



module.exports = { extractLatestVersion, fetchLatestPackageInfo, getDependencyList, convertToTree};
