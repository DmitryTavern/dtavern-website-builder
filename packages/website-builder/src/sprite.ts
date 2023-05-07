import path from 'path'
import gulp from 'gulp'
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

  if (isDevelopment()) {
    gulp.watch(spriteGlob, spriteCompiler)
    return
  }

  if (isProduction()) {
    gulp.series(spriteCompiler)(done)
    return
  }
}
