import fs from 'fs'
import path from 'path'
import { Environment } from './types'

/**
 * Cached project configuration.
 */
let _cache: Environment | undefined

/**
 * Reads a configuration file from the project root, caches it,
 * and returns it.
 *
 * @returns configuration of the project.
 * @throws if the configuration is not correct.
 */
export function environment(): Environment {
  if (_cache) return _cache

  const workingDirectory = process.cwd()

  const websiteConfigFile = path.join(workingDirectory, 'website.js')

  if (fs.existsSync(websiteConfigFile)) {
    const websiteConfig: Environment = require(websiteConfigFile)

    websiteConfig.root = path.resolve(workingDirectory, websiteConfig.root)

    _cache = websiteConfig

    return _cache
  }

  throw new Error(
    `configuration of the project not found. Path: ${websiteConfigFile}`
  )
}
