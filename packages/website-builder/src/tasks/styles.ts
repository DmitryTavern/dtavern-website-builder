import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watch } from '../watchers/watch'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import { compiler, devCompiler } from '../compilers/styleCompilers'

const sourceDir = resolveSource(env.styles.sourceDir)
const outputDir = resolveOutput(env.styles.outputDir)
const sourcePagesDir = resolveSource(env.styles.sourcePagesDir)
const outputPagesDir = resolveOutput(env.styles.outputPagesDir)
const stylesGlob = path.join(sourceDir, '**', '*.scss')
const stylesPagesGlob = path.join(sourcePagesDir, '**', '*.scss')
const stylesCompilerGlob = [stylesGlob, `!${stylesPagesGlob}`]
const stylesPageCompilerGlob = [stylesPagesGlob]

/**
 *
 */
export const build: gulp.TaskFunction = (done) => {
  gulp.series(
    compiler(stylesCompilerGlob, outputDir),
    compiler(stylesPageCompilerGlob, outputPagesDir)
  )(done)
}

/**
 *
 */
export const start: gulp.TaskFunction = () => {
  const fn = devCompiler(stylesCompilerGlob, outputDir)
  const fnPages = devCompiler(stylesPageCompilerGlob, outputPagesDir)

  watch(stylesCompilerGlob, fn)
  watch(stylesPageCompilerGlob, fnPages)
}
