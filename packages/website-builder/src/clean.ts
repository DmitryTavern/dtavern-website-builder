/**
 * Types
 */
import { TaskFunction, TaskFunctionCallback } from 'gulp'

/**
 * Utilities
 */
import fs from 'fs'
import path from 'path'
import { environment } from '@shared/environment'

/**
 * Function for clean old build.
 *
 * @param done gulp TaskFunctionCallback
 */
export const clean: TaskFunction = function clean(done: TaskFunctionCallback) {
  const env = environment()

  const outputDir = path.join(env.root, env.outputDir)

  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, {
      force: true,
      recursive: true,
    })
  }

  done()
}
