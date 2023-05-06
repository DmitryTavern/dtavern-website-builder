import shared from '../../bundle.config'

const globals = {
  gulp: 'gulp',
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
