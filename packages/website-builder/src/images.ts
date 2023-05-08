import gulp from 'gulp'
import path from 'path'
import { env } from '@shared/environment'
import { watch } from './watchers/watch'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import {
  compiler,
  devCompiler,
  webpCompiler,
  devWebpCompiler,
} from './compilers/imageCompilers'

const sourceDir = resolveSource(env.images.sourceDir)
const outputDir = resolveOutput(env.images.outputDir)
const pngGlob = path.join(sourceDir, '**', '*.*')
const webpGlob = path.join(sourceDir, '**', '*.+(png|jpg|jpeg)')

/**
 *
 * @param done gulp TaskFunctionCallback
 */
export const imagesBuild: gulp.TaskFunction = function images(done) {
  const fn = compiler(pngGlob, outputDir)
  const webpFn = webpCompiler(webpGlob, outputDir)

  gulp.series(fn, webpFn)(done)
}

/**
 *
 */
export const imagesStart: gulp.TaskFunction = function images() {
  const fn = devCompiler(pngGlob, outputDir)
  const webpFn = devWebpCompiler(webpGlob, outputDir)

  watch(pngGlob, fn)
  watch(webpGlob, webpFn)
}
