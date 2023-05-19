import fs from 'fs'
import path from 'path'
import rollup from 'rollup'
import rollupTerser from '@rollup/plugin-terser'

/**
 *
 * @param input
 * @param output
 */
export const genConfig = (
  output: string,
  filename: string
): rollup.OutputOptions[] => {
  return [
    {
      file: path.join(output, filename),
      plugins: [rollupTerser()],
      format: 'cjs',
    },
  ]
}

/**
 *
 * @param input
 * @param output
 */
export const genDevConfig = (
  output: string,
  filename: string
): rollup.OutputOptions[] => {
  return [
    {
      file: path.join(output, filename),
      format: 'cjs',
    },
  ]
}

/**
 *
 * @param input
 * @param output
 * @param config
 */
export const createBundle = (
  input: string,
  output: string,
  config: rollup.OutputOptions[]
) => {
  rollup
    .rollup({ input })
    .then((bundle) => {
      for (const options of config) {
        bundle.generate(options).then((payload) => {
          for (const chunk of payload.output) {
            if (chunk.type === 'chunk') {
              fs.mkdirSync(output, { recursive: true })
              fs.writeFileSync(path.join(output, chunk.fileName), chunk.code)
            }
          }
        })
      }
    })
    .catch((e) => {
      console.log(e)
    })
}
