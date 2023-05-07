import shared from '../../bundle.config'

const globals = {
  fs: 'fs',
  path: 'path',
  gulp: 'gulp',
  'gulp-pug': 'gulp-pug',
  'gulp-rename': 'gulp-rename',
  'browser-sync': 'browser-sync',
  'gulp-plumber': 'gulp-plumber',
  'gulp-html-prettify': 'gulp-html-prettify',
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
