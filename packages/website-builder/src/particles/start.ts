import gulp from 'gulp'

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
