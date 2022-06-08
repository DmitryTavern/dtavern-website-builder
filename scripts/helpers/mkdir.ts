import * as fs from 'fs'
import { __, log } from './logger'
import * as mkdirp from 'mkdirp'

export function mkdir(path: string) {
	if (!fs.existsSync(path)) {
		mkdirp.sync(path)
		log(
			__('LOG_CREATE_DIR', {
				dir: path,
			})
		)
	}
}
