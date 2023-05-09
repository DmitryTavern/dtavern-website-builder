import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watch } from '../utils/watch'
import { watchViews } from '../utils/watchViews'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import { compiler, devCompiler } from '../compilers/styleCompilers'

const sourceDir = resolveSource(env.styles.sourceDir)
const outputDir = resolveOutput(env.styles.outputDir)
const sourcePagesDir = resolveSource(env.styles.sourcePagesDir)
const outputPagesDir = resolveOutput(env.styles.outputPagesDir)
const stylesGlob = path.join(sourceDir, '*.scss')
const stylesPagesGlob = path.join(sourcePagesDir, '*.scss')

/**
 *
 */
export const build: gulp.TaskFunction = (done) => {
  gulp.series(
    compiler(stylesGlob, outputDir),
    compiler(stylesPagesGlob, outputPagesDir)
  )(done)
}

/**
 *
 */
export const start: gulp.TaskFunction = () => {
  const fn = devCompiler(stylesGlob, outputDir)
  const fnPages = devCompiler(stylesPagesGlob, outputPagesDir)

  watch(stylesGlob, gulp.series(fn, fnPages))
  watchViews(stylesPagesGlob, outputPagesDir, devCompiler)
}
