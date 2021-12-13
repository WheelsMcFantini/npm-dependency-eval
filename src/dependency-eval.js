const { version } = require('commander')
const https = require('https')
const fetch = require('node-fetch')
const REGISTRY_API = "registry.npmjs.org"

async function fetchPackageInfo(packageName, packageVersion) {
  const url = `https://${REGISTRY_API}/${packageName}/${packageVersion}`
  console.log(`[dependency-eval] Fetching url: ${url}`)
  // Question: what do we fetch when a dep includes ^ or 0.0.x?
  // Intresting enough ... registry api listed above, converts https://registry.npmjs.org/stack-trace/0.0.x and returns info for 0.0.x
  // However, https://registry.npmjs.org/triple-beam/^1.3.0 does not translates to anything
  
  const data = await fetch(url) // Will this always be successful?
  
  const parsedData = await data.json()
  return parsedData
}

// Question: Maybe we need a "resolve" package version which can return a package version for semvar expressions + latest
async function getLatestPackageVersion(packageName) {
  const packageInfo = await fetchPackageInfo(packageName, 'latest')
  return packageInfo.version
}


async function getDependencyList(packageData) {
  // neat trick for left to right assignment. the left are the keys inside `packageData` and the right are the consts we are creating 
  const { name: packageName, version: packageVersion } = packageData

  const url = `https://${REGISTRY_API}/${packageName}/${packageVersion}`;
  console.log(`[dependency-eval] URL: ${url}`)
  
  const data = await fetch(url)
  const parsedData = await data.json()
  //console.log(`[dependency-eval] Got dependencies for ${packageData.name}: ${packageData.version}`)
  return parsedData.dependencies
}

async function getDependenciesOfDependencies(dependencies) {
  depsOfDeps = {}
  for (const dependency in dependencies) {
      console.log(`[dependency-eval] grabbing dependencies for ${dependency}:${dependencies[dependency]}`)
      depKey = `${dependency}:${dependencies[dependency]}`
      const name = dependency;
      const version = dependencies[dependency];
      depsOfDeps[depKey] = await getDependencyList({ name, version})
    }
  return depsOfDeps
}

module.exports = { getLatestPackageVersion, fetchPackageInfo, getDependencyList, getDependenciesOfDependencies}