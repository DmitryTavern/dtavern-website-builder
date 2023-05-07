import path from 'path'
import gulp from 'gulp'
import { watcher } from './watchers/watcher'
import { environment } from '@shared/environment'
import { compiler, devCompiler } from './compilers/htmlCompilers'
import { isDevelopment, isProduction } from '@shared/mode'
import { TaskFunction, TaskFunctionCallback } from 'gulp'

/**
 * Function for html processing.
 * @param done gulp TaskFunctionCallback
 */
export const html: TaskFunction = function html(done: TaskFunctionCallback) {
  const env = environment()
  const viewsSourceDir = path.join(env.root, env.sourceDir, env.html.sourceDir)
  const viewsOutputDir = path.join(env.root, env.outputDir, env.html.outputDir)
  const viewsPagesGlob = path.join(viewsSourceDir, '*.pug')
  const viewsGlob = path.join(viewsSourceDir, '**', '*.pug')

  if (isProduction()) {
    const pagesCompiler = compiler(viewsPagesGlob, viewsOutputDir)

    gulp.series(pagesCompiler)(done)
    return
  }

  if (isDevelopment()) {
    const pagesCompiler = devCompiler(viewsPagesGlob, viewsOutputDir)

    watcher([viewsGlob, `!${viewsPagesGlob}`], pagesCompiler)
    watcher(viewsPagesGlob, pagesCompiler)

    return
  }
}
