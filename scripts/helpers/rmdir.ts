import * as fs from 'fs'
import { log } from './logger'

export function rmdir(path: string) {
	if (fs.existsSync(path)) {
		fs.rmSync(path, {
			force: true,
			recursive: true,
		})
		log('removed directory: ' + path)
	}
}
