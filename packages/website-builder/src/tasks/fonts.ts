import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watch } from '../utils/watch'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import { compiler, devCompiler } from '../compilers/fontsCompilers'

const sourceDir = resolveSource(env.fonts.sourceDir)
const outputDir = resolveOutput(env.fonts.outputDir)
const fontsGlob = path.join(sourceDir, '**', '*.*')

/**
 *
 */
export const build: gulp.TaskFunction = (done) => {
  gulp.series(compiler(fontsGlob, outputDir))(done)
}

/**
 *
 */
export const start: gulp.TaskFunction = () => {
  watch(fontsGlob, devCompiler(fontsGlob, outputDir))
}
