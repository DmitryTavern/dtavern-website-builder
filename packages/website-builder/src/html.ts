import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watcher } from './watchers/watcher'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import { compiler, devCompiler } from './compilers/htmlCompilers'
import { isDevelopment, isProduction } from '@shared/mode'
import { TaskFunction, TaskFunctionCallback } from 'gulp'

/**
 * Function for html processing.
 * @param done gulp TaskFunctionCallback
 */
export const html: TaskFunction = function html(done: TaskFunctionCallback) {
  const sourceDir = resolveSource(env.html.sourceDir)
  const outputDir = resolveOutput(env.html.outputDir)
  const viewsGlob = path.join(outputDir, '**', '*.pug')
  const viewsPagesGlob = path.join(sourceDir, '*.pug')

  if (isProduction()) {
    const pagesCompiler = compiler(viewsPagesGlob, outputDir)
    gulp.series(pagesCompiler)(done)
    return
  }

  if (isDevelopment()) {
    const pagesCompiler = devCompiler(viewsPagesGlob, outputDir)
    watcher([viewsGlob, `!${viewsPagesGlob}`], pagesCompiler)
    watcher(viewsPagesGlob, pagesCompiler)
    return
  }
}
