import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watch } from '../utils/watch'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import { compiler, devCompiler } from '../compilers/faviconCompilers'

const sourceDir = resolveSource(env.favicon.sourceDir)
const outputDir = resolveOutput(env.favicon.outputDir)
const faviconGlob = path.join(sourceDir, '**', '*.*')

/**
 *
 */
export const build: gulp.TaskFunction = (done) => {
  gulp.series(compiler(faviconGlob, outputDir))(done)
}

/**
 *
 */
export const start: gulp.TaskFunction = () => {
  watch(faviconGlob, devCompiler(faviconGlob, outputDir))
}
