import path from 'path'
import gulp from 'gulp'
import { watcher } from './watchers/watcher'
import { environment } from '@shared/environment'
import { TaskFunction, TaskFunctionCallback } from 'gulp'
import { isDevelopment, isProduction } from '@shared/mode'
import { compiler } from './compilers/spriteCompilers'

/**
 * Function for sprite processing.
 * @param done gulp TaskFunctionCallback
 */
export const sprite: TaskFunction = function sprite(
  done: TaskFunctionCallback
) {
  const env = environment()

  const spriteSourceDir = path.join(
    env.root,
    env.sourceDir,
    env.sprite.sourceDir
  )

  const spriteOutputDir = path.join(
    env.root,
    env.outputDir,
    env.sprite.outputDir
  )

  const spriteGlob = path.join(spriteSourceDir, '*.svg')

  const spriteCompiler = compiler(spriteGlob, spriteOutputDir)

  if (isProduction()) {
    gulp.series(spriteCompiler)(done)
    return
  }

  if (isDevelopment()) {
    watcher(spriteGlob, spriteCompiler)
    return
  }
}
