import * as fs from 'fs'
import * as path from 'path'
import { __, log } from '../logger'
import { mkdir } from './mkdir'

function _cpdir(src: string, dest: string) {
	if (!fs.existsSync(src)) return

	if (fs.statSync(src).isDirectory()) {
		mkdir(dest)

		fs.readdirSync(src).forEach(function (childItemName) {
			_cpdir(path.join(src, childItemName), path.join(dest, childItemName))
		})
	} else {
		fs.copyFileSync(src, dest)
	}
}

export function cpdir(src: string, dest: string) {
	_cpdir(src, dest)

	log(__('LOG_COPY_DIR', { formDir: src, toDir: dest }))
}
