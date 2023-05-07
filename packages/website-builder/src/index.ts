import { series, parallel } from 'gulp'

/**
 * Gulp tasks
 */
import { html } from './html'
import { clean } from './clean'
import { fonts } from './fonts'
import { styles } from './styles'
import { sprite } from './sprite'
import { images } from './images'
import { scripts } from './scripts'
import { favicon } from './favicon'
import { devserver } from './devserver'

/**
 *
 */
export const start = series(
  clean,
  parallel(html, styles, scripts, images, fonts, sprite, devserver, favicon)
)

/**
 *
 */
export const build = series(
  clean,
  html,
  styles,
  scripts,
  images,
  fonts,
  sprite,
  favicon
)
