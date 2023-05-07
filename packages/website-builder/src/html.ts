import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watcher } from './watchers/watcher'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import { compiler, devCompiler } from './compilers/htmlCompilers'

const sourceDir = resolveSource(env.html.sourceDir)
const outputDir = resolveOutput(env.html.outputDir)
const viewsGlob = path.join(outputDir, '**', '*.pug')
const viewsPagesGlob = path.join(sourceDir, '*.pug')

/**
 *
 * @param done gulp TaskFunctionCallback
 */
export const htmlBuild: gulp.TaskFunction = function html(done) {
  gulp.series(compiler(viewsPagesGlob, outputDir))(done)
}

/**
 *
 */
export const htmlStart: gulp.TaskFunction = function html() {
  const fn = devCompiler(viewsPagesGlob, outputDir)

  watcher([viewsGlob, `!${viewsPagesGlob}`], fn)
  watcher(viewsPagesGlob, fn)
}
