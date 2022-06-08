import * as fs from 'fs'
import * as path from 'path'
import { mkdir } from './mkdir'
import { __, log } from './logger'

export function cpdir(src: string, dest: string) {
	var exists = fs.existsSync(src)
	var stats = exists && fs.statSync(src)
	var isDirectory = exists && stats.isDirectory()
	if (isDirectory) {
		mkdir(dest)
		fs.readdirSync(src).forEach(function (childItemName) {
			cpdir(path.join(src, childItemName), path.join(dest, childItemName))
		})
	} else {
		fs.copyFileSync(src, dest)
	}

	log(__('LOG_COPY_DIR', { formDir: src, toDir: dest }))
}
