import path from 'path'
import gulp from 'gulp'
import { watcher } from './watchers/watcher'
import { environment } from '@shared/environment'
import { isDevelopment, isProduction } from '@shared/mode'
import { TaskFunction, TaskFunctionCallback } from 'gulp'
import { compiler, devCompiler } from './compilers/fontsCompilers'

/**
 * Function for fonts processing.
 * @param done gulp TaskFunctionCallback
 */
export const fonts: TaskFunction = function fonts(done: TaskFunctionCallback) {
  const env = environment()

  const fontsSourceDir = path.join(env.root, env.sourceDir, env.fonts.sourceDir)
  const fontsOutputDir = path.join(env.root, env.outputDir, env.fonts.outputDir)

  const fontsGlob = path.join(fontsSourceDir, '**', '*.*')

  if (isProduction()) {
    const fontsCompiler = compiler(fontsGlob, fontsOutputDir)

    gulp.series(fontsCompiler)(done)
    return
  }

  if (isDevelopment()) {
    const fontsCompiler = devCompiler(fontsGlob, fontsOutputDir)

    watcher(fontsGlob, fontsCompiler)

    return
  }
}
