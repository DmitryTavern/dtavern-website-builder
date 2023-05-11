import gulp from 'gulp'
import path from 'path'
import { env } from '@shared/environment'
import { watch } from '../utils/watch'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import {
  compiler,
  devCompiler,
  webpCompiler,
  devWebpCompiler,
} from '../compilers/imageCompilers'

const sourceDir = resolveSource(env.images.sourceDir)
const outputDir = resolveOutput(env.images.outputDir)
const pngGlob = path.join(sourceDir, '**', '*.*')
const webpGlob = path.join(sourceDir, '**', '*.+(png|jpg|jpeg)')

/**
 *
 */
gulp.task('build:images', (done) => {
  gulp.series(
    compiler(pngGlob, outputDir),
    webpCompiler(webpGlob, outputDir)
  )(done)
})

/**
 *
 */
gulp.task('start:images', () => {
  watch(pngGlob, devCompiler(pngGlob, outputDir))
  watch(webpGlob, devWebpCompiler(webpGlob, outputDir))
})
