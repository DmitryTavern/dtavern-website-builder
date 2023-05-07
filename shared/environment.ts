import fs from 'fs'
import path from 'path'
import { Environment } from './types'

/**
 * Cached project configuration.
 */
export let env: Environment

/**
 * Reads a configuration file from the project root, caches it,
 * and returns it.
 *
 * @returns configuration of the project.
 * @throws if the configuration is not correct.
 */
export function setup(): void {
  const workingDirectory = process.cwd()

  const websiteConfigFile = path.join(workingDirectory, 'website.js')

  if (!fs.existsSync(websiteConfigFile)) {
    throw new Error(
      `configuration of the project not found. Path: ${websiteConfigFile}`
    )
  }

  const websiteConfig: Environment = require(websiteConfigFile)

  websiteConfig.root = path.resolve(workingDirectory, websiteConfig.root)

  env = websiteConfig
}
