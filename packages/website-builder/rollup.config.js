import shared from '../../bundle.config'

const globals = {
  fs: 'fs',
  path: 'path',

  // Gulp core
  gulp: 'gulp',
  'gulp-rename': 'gulp-rename',
  'browser-sync': 'browser-sync',
  'gulp-plumber': 'gulp-plumber',

  // Pug
  'gulp-pug': 'gulp-pug',
  'gulp-html-prettify': 'gulp-html-prettify',

  // Styles
  sass: 'sass',
  'gulp-sass': 'gulp-sass',
  'gulp-cssnano': 'gulp-cssnano',
  'gulp-autoprefixer': 'gulp-autoprefixer',
  'gulp-group-css-media-queries': 'gulp-group-css-media-queries',

  // Scripts
  glob: 'glob',
  rollup: 'rollup',
  'gulp-uglify': 'gulp-uglify',
  '@rollup/plugin-terser': '@rollup/plugin-terser',
}

export default shared.bundle({
  input: shared.input('index.ts'),
  external: Object.keys(globals),
  output: [
    {
      globals,
      file: shared.output('gulpfile.js'),
      format: 'cjs',
      exports: 'named',
      plugins: [shared.terserBeautify],
    },
  ],
})
