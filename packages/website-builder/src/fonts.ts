import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watcher } from './watchers/watcher'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import { compiler, devCompiler } from './compilers/fontsCompilers'

const sourceDir = resolveSource(env.fonts.sourceDir)
const outputDir = resolveOutput(env.fonts.outputDir)
const fontsGlob = path.join(sourceDir, '**', '*.*')

/**
 * @param done
 */
export const fontsBuild: gulp.TaskFunction = function fonts(done) {
  gulp.series(compiler(fontsGlob, outputDir))(done)
}

/**
 *
 */
export const fontsStart: gulp.TaskFunction = function fonts() {
  const fn = devCompiler(fontsGlob, outputDir)

  watcher(fontsGlob, fn)
}
