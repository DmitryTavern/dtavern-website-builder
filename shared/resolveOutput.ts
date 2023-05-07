import path from 'path'
import { env } from './environment'

/**
 *
 * @param paths
 * @returns
 */
export const resolveOutput = (...paths: string[]) => {
  return path.join(env.root, env.outputDir, ...paths)
}
