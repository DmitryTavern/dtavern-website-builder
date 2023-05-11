import path from 'path'
import gulp from 'gulp'
import { env } from '@shared/environment'
import { watch } from '../utils/watch'
import { resolveSource } from '@shared/resolveSource'
import { resolveOutput } from '@shared/resolveOutput'
import { compiler } from '../compilers/spriteCompilers'

const sourceDir = resolveSource(env.sprite.sourceDir)
const outputDir = resolveOutput(env.sprite.outputDir)
const spriteGlob = path.join(sourceDir, '*.svg')

/**
 *
 */
gulp.task('build:sprite', (done) => {
  gulp.series(compiler(spriteGlob, outputDir))(done)
})

/**
 *
 */
gulp.task('start:sprite', () => {
  watch(spriteGlob, compiler(spriteGlob, outputDir))
})
