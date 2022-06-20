import * as fs from 'fs'
import * as mkdirp from 'mkdirp'
import { __, log } from '../logger'

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
