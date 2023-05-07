import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watcher } from './watchers/watcher'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import { compiler, devCompiler } from './compilers/faviconCompilers'

const sourceDir = resolveSource(env.favicon.sourceDir)
const outputDir = resolveOutput(env.favicon.outputDir)
const faviconGlob = path.join(sourceDir, '**', '*.*')

/**
 * @param done
 */
export const faviconBuild: gulp.TaskFunction = function favicon(done) {
  gulp.series(compiler(faviconGlob, outputDir))(done)
}

/**
 *
 */
export const faviconStart: gulp.TaskFunction = function favicon() {
  const fn = devCompiler(faviconGlob, outputDir)

  watcher(faviconGlob, fn)
}
