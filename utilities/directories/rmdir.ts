import * as fs from 'fs'
import { __, log } from '../logger'

export function rmdir(path: string) {
	if (fs.existsSync(path)) {
		fs.rmSync(path, {
			force: true,
			recursive: true,
		})

		log(
			__('LOG_REMOVE_DIR', {
				dir: path,
			})
		)
	}
}
