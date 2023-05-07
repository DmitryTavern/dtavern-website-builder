import fs from 'fs'
import { resolveOutput } from '@shared/resolveOutput'
import { TaskFunction, TaskFunctionCallback } from 'gulp'

/**
 * Function for clean old build.
 * @param done gulp TaskFunctionCallback
 */
export const clean: TaskFunction = function clean(done: TaskFunctionCallback) {
  const outputDir = resolveOutput('./')

  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, {
      force: true,
      recursive: true,
    })
  }

  done()
}
