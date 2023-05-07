import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watcher } from './watchers/watcher'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
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
  const sourceDir = resolveSource(env.sprite.sourceDir)
  const outputDir = resolveOutput(env.sprite.outputDir)
  const spriteGlob = path.join(sourceDir, '*.svg')
  const spriteCompiler = compiler(spriteGlob, outputDir)

  if (isProduction()) {
    gulp.series(spriteCompiler)(done)
    return
  }

  if (isDevelopment()) {
    watcher(spriteGlob, spriteCompiler)
    return
  }
}
