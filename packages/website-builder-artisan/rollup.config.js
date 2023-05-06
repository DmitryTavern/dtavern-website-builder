import shared from '../../bundle.config'

const globals = {
  commander: 'commander',
}

export default shared.bundle({
  input: shared.input('index.ts'),
  external: Object.keys(globals),
  output: [
    {
      globals,
      file: shared.output('artisan.js'),
      format: 'cjs',
      exports: 'named',
      plugins: [shared.terserBeautify],
    },
  ],
})
