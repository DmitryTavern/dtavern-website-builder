import fs from 'fs'
import path from 'path'
import { Environment } from './types'

const workingDirectory = process.cwd()

const websiteConfigFile = path.join(workingDirectory, 'website.js')

if (!fs.existsSync(websiteConfigFile)) {
  throw new Error(
    `configuration of the project not found. Path: ${websiteConfigFile}`
  )
}

const websiteConfig: Environment = require(websiteConfigFile)

websiteConfig.root = path.resolve(workingDirectory, websiteConfig.root)

/**
 * Cached project configuration.
 */
export const env: Environment = websiteConfig
