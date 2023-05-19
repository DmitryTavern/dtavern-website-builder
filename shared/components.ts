import fs from 'fs'
import { env } from './environment'
import { resolveApp } from './resolveApp'
import { Components } from './types/Components'

/**
 * Cached components configuration.
 */
export let components: Components = {}

const configPath = resolveApp(
  env.components.configDir,
  env.components.configFile
)

const refresh = function () {
  console.log('refresh')

  components = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, { encoding: 'utf-8' }))
    : {}
}

refresh()

fs.watch(
  configPath,
  {
    encoding: 'utf-8',
  },
  refresh
)
