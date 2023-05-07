import path from 'path'
import gulp from 'gulp'
import { watcher } from './watchers/watcher'
import { environment } from '@shared/environment'
import { isDevelopment, isProduction } from '@shared/mode'
import { TaskFunction, TaskFunctionCallback } from 'gulp'
import { compiler, devCompiler } from './compilers/faviconCompilers'

/**
 * Function for favicon processing.
 * @param done gulp TaskFunctionCallback
 */
export const favicon: TaskFunction = function favicon(
  done: TaskFunctionCallback
) {
  const env = environment()

  const faviconSourceDir = path.join(
    env.root,
    env.sourceDir,
    env.favicon.sourceDir
  )

  const faviconOutputDir = path.join(
    env.root,
    env.outputDir,
    env.favicon.outputDir
  )

  const faviconGlob = path.join(faviconSourceDir, '**', '*.*')

  if (isProduction()) {
    const faviconCompiler = compiler(faviconGlob, faviconOutputDir)

    gulp.series(faviconCompiler)(done)
    return
  }

  if (isDevelopment()) {
    const faviconCompiler = devCompiler(faviconGlob, faviconOutputDir)

    watcher(faviconGlob, faviconCompiler)
    return
  }
}
