import '@shared/environment'
import gulp from 'gulp'
import { clean } from './tasks/clean'
import { server } from './tasks/server'
import * as html from './tasks/html'
import * as fonts from './tasks/fonts'
import * as styles from './tasks/styles'
import * as images from './tasks/images'
import * as sprite from './tasks/sprite'
import * as scripts from './tasks/scripts'
import * as favicon from './tasks/favicon'

gulp.task('clean', clean)

gulp.task('server', server)

gulp.task('build:html', html.build)
gulp.task('build:fonts', fonts.build)
gulp.task('build:styles', styles.build)
gulp.task('build:images', images.build)
gulp.task('build:sprite', sprite.build)
gulp.task('build:scripts', scripts.build)
gulp.task('build:favicon', favicon.build)

gulp.task('start:html', html.start)
gulp.task('start:fonts', fonts.start)
gulp.task('start:styles', styles.start)
gulp.task('start:images', images.start)
gulp.task('start:sprite', sprite.start)
gulp.task('start:scripts', scripts.start)
gulp.task('start:favicon', favicon.start)

gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel(
      'build:html',
      'build:styles',
      'build:scripts',
      'build:images',
      'build:sprite',
      'build:fonts',
      'build:favicon'
    )
  )
)

gulp.task(
  'start',
  gulp.series(
    'clean',
    gulp.parallel(
      'start:html',
      'start:styles',
      'start:scripts',
      'start:images',
      'start:sprite',
      'start:fonts',
      'start:favicon',
      'server'
    )
  )
)
