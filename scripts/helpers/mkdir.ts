import * as fs from 'fs'
import { log } from './logger'
import * as mkdirp from 'mkdirp'

export function mkdir(path: string) {
	if (!fs.existsSync(path)) {
		mkdirp.sync(path)
		log('created directory: ' + path)
	}
}
