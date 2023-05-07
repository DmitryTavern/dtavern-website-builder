import path from 'path'
import gulp from 'gulp'
import { watcher } from './watchers/watcher'
import { environment } from '@shared/environment'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
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
  const sourceDir = resolveSource(env.favicon.sourceDir)
  const outputDir = resolveOutput(env.favicon.outputDir)
  const faviconGlob = path.join(sourceDir, '**', '*.*')

  if (isProduction()) {
    const faviconCompiler = compiler(faviconGlob, outputDir)
    gulp.series(faviconCompiler)(done)
    return
  }

  if (isDevelopment()) {
    const faviconCompiler = devCompiler(faviconGlob, outputDir)
    watcher(faviconGlob, faviconCompiler)
    return
  }
}
