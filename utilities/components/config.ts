import * as fs from 'fs'
import * as path from 'path'
import * as types from '@types'
import { mkdir } from '../directories'

const { APP_COMPONENTS_DIR, APP_COMPONENTS_CONFIG_FILENAME } = process.env

const componentsConfigPath = path.join(
	APP_COMPONENTS_DIR,
	APP_COMPONENTS_CONFIG_FILENAME
)

export function readConfig(): types.ComponentsConfig {
	if (!fs.existsSync(componentsConfigPath)) return {}
	return JSON.parse(
		fs.readFileSync(componentsConfigPath, { encoding: 'utf-8' })
	)
}

export function writeConfig(data: types.ComponentsConfig): void {
	mkdir(APP_COMPONENTS_DIR)
	fs.writeFileSync(componentsConfigPath, JSON.stringify(data, null, 2))
}
