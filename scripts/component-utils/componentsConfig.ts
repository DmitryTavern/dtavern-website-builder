import * as fs from 'fs'
import * as path from 'path'
import { mkdir } from '../helpers/mkdir'

interface ComponentsConfig {
	[key: string]: string[]
}

const { APP_COMPONENTS_DIR, APP_COMPONENTS_CONFIG_FILENAME } = process.env

export function readConfig(): ComponentsConfig {
	const configPath = path.join(
		APP_COMPONENTS_DIR,
		APP_COMPONENTS_CONFIG_FILENAME
	)

	if (!fs.existsSync(configPath)) {
		mkdir(APP_COMPONENTS_DIR)
		fs.writeFileSync(configPath, '{}')
	}

	return JSON.parse(fs.readFileSync(configPath, { encoding: 'utf-8' }))
}

export function convertConfig(options: { withoutNone?: boolean } = {}): string[] {
	const config = readConfig()
	const components = []

	for (const key in config) {
		if (options.withoutNone && key === 'none') continue

		components.push(...config[key])
	}

	return components
}

export function writeConfig(data: ComponentsConfig): void {
	const configPath = path.join(
		APP_COMPONENTS_DIR,
		APP_COMPONENTS_CONFIG_FILENAME
	)

	fs.writeFileSync(configPath, JSON.stringify(data, null, 2))
}
