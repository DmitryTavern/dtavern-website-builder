import path from 'path'
import { env } from './environment'

/**
 *
 * @param paths
 * @returns
 */
export const resolveSource = (...paths: string[]) => {
  return path.join(env.root, env.sourceDir, ...paths)
}
