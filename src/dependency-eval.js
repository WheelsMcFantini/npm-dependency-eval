const fetch = require('node-fetch')

const REGISTRY_API = "registry.npmjs.org" // Default registry to fetch packages from

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


function stripSemvarAnnotations(packageVersion) {
  const cleanVersionNumber = packageVersion[0] === '^' ?  packageVersion.split('^')[1] : packageVersion;
  return cleanVersionNumber;
}

async function getDependencyList(packageName, packageVersion) {
  console.log(`[getDependencyList] get dependecy list for: ${packageName}@${packageVersion}`);
  const cleanedPackageVersion = stripSemvarAnnotations(packageVersion);
  const url = `https://${REGISTRY_API}/${packageName}/${cleanedPackageVersion}`
  console.log(`[getDependencyList] attempting to fetch URL: ${url}`)

  let packageDependecies;
  try {
    const packageData = await fetch(url);
    const parsedPackageData = await packageData.json();
    // console.log(parsedPackageData);
    packageDependecies = parsedPackageData.dependencies || {};
    console.log(packageDependecies);
  } catch (error) {
    console.log(`[getDependencyList] Failed to fetch package data for ${packageName}@${cleanedPackageVersion}, aborting.`);
    console.log(error);
    throw new Error(`Failed to fetch package data for ${packageName}@${cleanedPackageVersion} from ${url}.`)
  }

  const dependeciesCount = Object.keys(packageDependecies).length;
  console.log(`[getDependencyList] ${packageName}@${cleanedPackageVersion} has ${dependeciesCount} dependecies.`);
  return packageDependecies;
}

/**
 * 
 * @param {*} packageName 
 * @param {*} packageVersion 
 * @param {*} depth numerical value or 'max'
 * @returns 
 */
async function recursiveRoutine(packageName, packageVersion, depth, depthLimit){
  const dependeciesTree = {};

  console.log(`[recursiveRoutine] ${depth} --> ${packageName}@${packageVersion}`);
  const packageDependecies = await getDependencyList(packageName, packageVersion);
  const packageDependeciesListByName = Object.keys(packageDependecies);
  
  // package has no dependecies
  if (packageDependeciesListByName.length === 0) {
    console.log(`[recursiveRoutine] ${packageName}@${packageVersion} has no deps.`)
    dependeciesTree[`${packageName}@${packageVersion}`] = {};
    return dependeciesTree;
  }

  // specified depthLimit has been reached
  if (depthLimit !== 'max' && depth === depthLimit) {
    console.log(`[recusriveRoutine] max depth has been reached`);
    dependeciesTree[`${packageName}@${packageVersion}`] = 'depth limit reached';
    return dependeciesTree;    
  }
    
  for (dependency of packageDependeciesListByName) {
    const dependencyVersion = packageDependecies[dependency];
    dependeciesTree[`${dependency}@${dependencyVersion}`] = await recursiveRoutine(dependency, dependencyVersion, depth+1, depthLimit);
  }

  return dependeciesTree;
}


module.exports = { getLatestPackageVersion, fetchPackageInfo, getDependencyList, recursiveRoutine};