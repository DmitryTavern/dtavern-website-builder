import gulp from 'gulp'
import path from 'path'
import { env } from '@shared/environment'
import { watcher } from './watchers/watcher'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
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
  const sourceDir = resolveSource(env.images.sourceDir)
  const outputDir = resolveOutput(env.images.outputDir)
  const pngGlob = path.join(sourceDir, '**', '*.*')
  const webpGlob = path.join(sourceDir, '**', '*.+(png|jpg|jpeg)')

  if (isProduction()) {
    const _pngCompiler = compiler(pngGlob, outputDir)
    const _webpCompiler = webpCompiler(webpGlob, outputDir)
    gulp.series(_pngCompiler, _webpCompiler)(done)
    return
  }

  if (isDevelopment()) {
    const _pngCompiler = devCompiler(pngGlob, outputDir)
    const _webpCompiler = devWebpCompiler(webpGlob, outputDir)
    watcher(pngGlob, _pngCompiler)
    watcher(webpGlob, _webpCompiler)
    return
  }
}
