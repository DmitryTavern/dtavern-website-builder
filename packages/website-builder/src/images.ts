import gulp from 'gulp'
import path from 'path'
import { environment } from '@shared/environment'
import { isDevelopment, isProduction } from '@shared/mode'
import { TaskFunction, TaskFunctionCallback } from 'gulp'
import {
  compiler,
  devCompiler,
  webpCompiler,
  devWebpCompiler,
} from './compilers/imageCompilers'

/**
 * Function for html processing.
 *
 * @param done gulp TaskFunctionCallback
 */
export const images: TaskFunction = function images(
  done: TaskFunctionCallback
) {
  const env = environment()

  const imagesSourceDir = path.join(
    env.root,
    env.sourceDir,
    env.images.sourceDir
  )

  const imagesOutputDir = path.join(
    env.root,
    env.outputDir,
    env.images.outputDir
  )

  const pngGlob = path.join(imagesSourceDir, '**', '*.*')
  const webpGlob = path.join(imagesSourceDir, '**', '*.+(png|jpg|jpeg)')

  if (isProduction()) {
    const _pngCompiler = compiler(pngGlob, imagesOutputDir)
    const _webpCompiler = webpCompiler(webpGlob, imagesOutputDir)

    gulp.series(_pngCompiler, _webpCompiler)(done)
    return
  }

  if (isDevelopment()) {
    const _pngCompiler = devCompiler(pngGlob, imagesOutputDir)
    const _webpCompiler = devWebpCompiler(webpGlob, imagesOutputDir)

    gulp.watch(pngGlob, _pngCompiler)
    gulp.watch(webpGlob, _webpCompiler)
    return
  }
}
