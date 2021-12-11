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
  //const { name, version } = packageData
  //console.log(`[dependency-eval] package Name:  ${packageData.name}`)
  //console.log(`[dependency-eval] package Version:  ${packageData.version}`)

  const url = `https://${REGISTRY_API}/${packageData.name}/${packageData.version}`
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
        const name = dependency
        const version = dependencies[dependency]
        depsOfDeps[depKey] = await getDependencyList({ name, version})
      }
  return depsOfDeps
}

function convertToTree() {
  console.log('[convertToTree] lol converting to tree')
}

module.exports = { getLatestPackageVersion, fetchPackageInfo, getDependencyList, getDependenciesOfDependencies, convertToTree}