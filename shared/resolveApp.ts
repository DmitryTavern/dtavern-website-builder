import path from 'path'
import { env } from './environment'

/**
 *
 * @param paths
 * @returns
 */
export const resolveApp = (...paths: string[]) => {
  return path.join(env.root, ...paths)
}
