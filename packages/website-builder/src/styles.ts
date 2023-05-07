import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watcher } from './watchers/watcher'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import { compiler, devCompiler } from './compilers/styleCompilers'

const sourceDir = resolveSource(env.styles.sourceDir)
const outputDir = resolveOutput(env.styles.outputDir)
const sourcePagesDir = resolveSource(env.styles.sourcePagesDir)
const outputPagesDir = resolveOutput(env.styles.outputPagesDir)
const stylesGlob = path.join(sourceDir, '**', '*.scss')
const stylesPagesGlob = path.join(sourcePagesDir, '**', '*.scss')

/**
 * @param done gulp TaskFunctionCallback
 */
export const stylesBuild: gulp.TaskFunction = function styles(done) {
  const fn = compiler(stylesGlob, outputDir)
  const fnPages = compiler(stylesPagesGlob, outputPagesDir)

  gulp.series(fn, fnPages)(done)
}

/**
 *
 */
export const stylesStart: gulp.TaskFunction = function styles() {
  const fn = devCompiler(stylesGlob, outputDir)
  const fnPages = devCompiler(stylesPagesGlob, outputPagesDir)

  watcher([stylesGlob, `!${stylesPagesGlob}`], fn)
  watcher([stylesPagesGlob, `!${stylesGlob}`], fnPages)
}
