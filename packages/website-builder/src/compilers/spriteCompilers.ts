import path from 'path'
import gulp from 'gulp'
import server from 'browser-sync'
import plumber from 'gulp-plumber'
import svgSprite from 'gulp-svg-sprite'
import { Compiler } from '../../types'
import { environment } from '@shared/environment'

/**
 *
 * @param input
 * @param output
 * @param config
 */
export const compiler: Compiler = (input, output) => () => {
  const env = environment()

  return gulp
    .src(input)
    .pipe(plumber())
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: path.join('..', env.sprite.filename),
          },
        },
      })
    )
    .pipe(gulp.dest(output))
    .pipe(server.reload({ stream: true }))
}
