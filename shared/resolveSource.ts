import path from 'path'
import { environment } from './environment'

/**
 *
 * @param paths
 * @returns
 */
export const resolveSource = (...paths: string[]) => {
  const env = environment()
  return path.join(env.root, env.sourceDir, ...paths)
}
