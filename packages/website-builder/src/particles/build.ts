import gulp from 'gulp'

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
