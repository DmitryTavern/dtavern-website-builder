import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watcher } from './watchers/watcher'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import { isDevelopment, isProduction } from '@shared/mode'
import { TaskFunction, TaskFunctionCallback } from 'gulp'
import { compiler, devCompiler } from './compilers/fontsCompilers'

/**
 * Function for fonts processing.
 * @param done gulp TaskFunctionCallback
 */
export const fonts: TaskFunction = function fonts(done: TaskFunctionCallback) {
  const sourceDir = resolveSource(env.fonts.sourceDir)
  const outputDir = resolveOutput(env.fonts.outputDir)
  const fontsGlob = path.join(sourceDir, '**', '*.*')

  if (isProduction()) {
    const fontsCompiler = compiler(fontsGlob, outputDir)
    gulp.series(fontsCompiler)(done)
    return
  }

  if (isDevelopment()) {
    const fontsCompiler = devCompiler(fontsGlob, outputDir)
    watcher(fontsGlob, fontsCompiler)
    return
  }
}
