import * as fs from 'fs'
import { log } from './logger'

export function mkdir(path: string) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path)
		log('created directory: ' + path)
	}
}
