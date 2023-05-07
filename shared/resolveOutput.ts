import path from 'path'
import { environment } from './environment'

/**
 *
 * @param paths
 * @returns
 */
export const resolveOutput = (...paths: string[]) => {
  const env = environment()
  return path.join(env.root, env.outputDir, ...paths)
}
