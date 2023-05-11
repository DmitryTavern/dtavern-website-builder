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
gulp.task('build:favicon', (done) => {
  gulp.series(compiler(faviconGlob, outputDir))(done)
})

/**
 *
 */
gulp.task('start:favicon', () => {
  watch(faviconGlob, devCompiler(faviconGlob, outputDir))
})
