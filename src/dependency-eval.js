const { version } = require('commander')
const https = require('https')
const fetch = require('node-fetch')
const VERSION = ""
const REGISTRY_API = "registry.npmjs.org"

async function fetchPackageInfo(packageName, packageVersion) {
  const url = `https://${REGISTRY_API}/${packageName}/${packageVersion}`
  console.log(`[dependency-eval] Fetching url: ${url}`)
  const data = await fetch(url)
  const parsedData = await data.json()
  return parsedData
}

async function getLatestPackageVersion(packageName) {
  const packageInfo = await fetchPackageInfo(packageName, 'latest')
  return packageInfo.version
}


async function getDependencyList(packageData) {
  let { name, version } = packageData
  //console.log(`[dependency-eval] package Name:  ${packageData.name}`)
  //console.log(`[dependency-eval] package Version:  ${packageData.version}`)

  //if the first character of version is '^' 
  //?
  //then version = version.split('^')[1]
  //: else
  //version = version
  version = version[0] === '^' ?  version.split('^')[1] : version;
  version = version[0] === '~' ?  version.split('~')[1] : version;

  const url = `https://${REGISTRY_API}/${name}/${version}`
  console.log(`[dependency-eval] URL: ${url}`)
  
  const data = await fetch(url)
  const parsedData = await data.json()
  //console.log(`[dependency-eval] Got dependencies for ${packageData.name}: ${packageData.version}`)
  //return parsed data deps if parsedData.deps is defined, otherwise return an empty object
  if (!parsedData.dependencies) console.log(`on no, no data ${packageData.name}`);
  return parsedData.dependencies ? parsedData.dependencies  : {};
}

async function recursiveRoutine(packageData, depth, depthLimit){
  
  const myDeps = {};

  console.log(`[dependency-eval] package Name:  ${depth} --> ${packageData.name}@${packageData.version}`)
  const dependencyList = await getDependencyList(packageData)
  //console.log(Object.keys(dependencyList))
  // console.log(`${packageData.name} ${depth} ${depthLimit} --> ${depth === depthLimit}`);
  if ((Object.keys(dependencyList).length === 0) || depth == depthLimit) {
    myDeps [`${packageData.name}@${packageData.version}`] = depth == depthLimit ?  "depth limit reached"  : {};
    return myDeps;
  }
  for (dependency of Object.keys(dependencyList)) {
    myDeps[`${dependency}@${dependencyList[dependency]}`] = await recursiveRoutine({'name': dependency, 'version': dependencyList[dependency]}, depth+1, depthLimit)

  }
  // console.log(packageData.name);
  // console.log(myDeps);

  return myDeps;
}

async function getDependenciesOfDependencies(dependencies) {
  depsOfDeps = {}
    for (const dependency in dependencies) {
        console.log(`[dependency-eval] grabbing dependencies for ${dependency}:${dependencies[dependency]}`)
        depKey = `${dependency}:${dependencies[dependency]}`
        const name = dependency
        const version = dependencies[dependency]
        depsOfDeps[depKey] = await getDependencyList({ name, version})
      }
  return depsOfDeps
}

function convertToTree() {
  console.log('[convertToTree] lol converting to tree')
}

module.exports = { getLatestPackageVersion, fetchPackageInfo, getDependencyList, getDependenciesOfDependencies, recursiveRoutine, convertToTree}