import gulp from 'gulp'

export interface Compiler {
  (input: gulp.Globs, output: string): gulp.TaskFunction
}
