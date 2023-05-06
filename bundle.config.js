import path from 'path'
import alias from '@rollup/plugin-alias'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

const DIST_DIR = 'dist'

const SOURCE_DIR = 'src'

export const bundle = (config) => {
  const workspaceRootDir = path.resolve(__dirname, '../../')

  const external = config.external ? config.external : []

  const plugins = config.plugins ? config.plugins : []

  return {
    ...config,
    external,
    plugins: [
      typescript(),
      alias({
        entries: [
          {
            find: '@shared',
            replacement: path.join(workspaceRootDir, 'shared'),
          },
        ],
      }),
      ...plugins,
    ],
  }
}

export const input = (...args) => path.join(SOURCE_DIR, ...args)

export const output = (...args) => path.join(DIST_DIR, ...args)

export const terserBeautify = terser({
  compress: false,
  mangle: false,
  format: {
    beautify: true,
    comments: false,
  },
})

export const terserMinify = terser({
  compress: true,
})

export default {
  bundle,
  input,
  output,
  terserBeautify,
  terserMinify,
}
