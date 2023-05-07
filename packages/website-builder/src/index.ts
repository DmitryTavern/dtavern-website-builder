import '@shared/environment'
import gulp from 'gulp'
import { clean } from './clean'
import { server } from './server'
import { htmlBuild, htmlStart } from './html'
import { fontsBuild, fontsStart } from './fonts'
import { stylesBuild, stylesStart } from './styles'
import { imagesBuild, imagesStart } from './images'
import { scriptsBuild, scriptsStart } from './scripts'
import { spriteBuild, spriteStart } from './sprite'
import { faviconBuild, faviconStart } from './favicon'

gulp.task('clean', clean)

gulp.task('server', server)

gulp.task('build:html', htmlBuild)
gulp.task('build:styles', stylesBuild)
gulp.task('build:scripts', scriptsBuild)
gulp.task('build:images', imagesBuild)
gulp.task('build:sprite', spriteBuild)
gulp.task('build:fonts', fontsBuild)
gulp.task('build:favicon', faviconBuild)

gulp.task('start:html', htmlStart)
gulp.task('start:styles', stylesStart)
gulp.task('start:scripts', scriptsStart)
gulp.task('start:images', imagesStart)
gulp.task('start:sprite', spriteStart)
gulp.task('start:fonts', fontsStart)
gulp.task('start:favicon', faviconStart)

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
