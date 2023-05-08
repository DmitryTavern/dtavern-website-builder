import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watch } from './watchers/watch'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import { compiler } from './compilers/spriteCompilers'

const sourceDir = resolveSource(env.sprite.sourceDir)
const outputDir = resolveOutput(env.sprite.outputDir)
const spriteGlob = path.join(sourceDir, '*.svg')

/**
 *
 * @param done gulp TaskFunctionCallback
 */
export const spriteBuild: gulp.TaskFunction = function sprite(done) {
  gulp.series(compiler(spriteGlob, outputDir))(done)
}

/**
 *
 */
export const spriteStart: gulp.TaskFunction = function sprite() {
  const fn = compiler(spriteGlob, outputDir)

  watch(spriteGlob, fn)
}
