import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watch } from '../utils/watch'
import { watchViews } from '../utils/watchViews'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import { compiler, devCompiler } from '../compilers/htmlCompilers'

const sourceDir = resolveSource(env.html.sourceDir)
const outputDir = resolveOutput(env.html.outputDir)
const viewsGlob = path.join(sourceDir, '**', '*.pug')
const viewsPagesGlob = path.join(sourceDir, '*.pug')

/**
 *
 */
export const build: gulp.TaskFunction = (done) => {
  gulp.series(compiler(viewsPagesGlob, outputDir))(done)
}

/**
 *
 */
export const start: gulp.TaskFunction = () => {
  const fn = devCompiler(viewsPagesGlob, outputDir)

  watch([viewsGlob, `!${viewsPagesGlob}`], fn)
  watchViews(viewsPagesGlob, outputDir, devCompiler)
}
