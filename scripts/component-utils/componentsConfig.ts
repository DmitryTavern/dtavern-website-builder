import * as fs from 'fs'
import * as path from 'path'
import { mkdir } from '../helpers/mkdir'
import { __, log } from '../helpers/logger'
import { registerComponent } from './registerComponent'

export interface ComponentsConfig {
	[key: string]: string[]
}

interface ReadOptionsFn {
	ignore?: string | string[] | undefined
	ignoreIntegrity?: boolean
}

interface ReadReturnFn {
	toDefault: () => ComponentsConfig
	toOneArray: () => string[]
}

const configPath = path.join(
	process.env.APP_COMPONENTS_DIR,
	process.env.APP_COMPONENTS_CONFIG_FILENAME
)

function loadConfig(): ComponentsConfig {
	if (!fs.existsSync(configPath)) return {}
	return JSON.parse(fs.readFileSync(configPath, { encoding: 'utf-8' }))
}

function checkConfigIntegrity() {
	const COMPONENTS_DIR = process.env.APP_COMPONENTS_DIR
	const configComponents = loadConfig()
	let components: string[] = []

	if (!fs.existsSync(COMPONENTS_DIR)) return

	fs.readdirSync(COMPONENTS_DIR)
		.filter((file) =>
			fs.lstatSync(path.join(COMPONENTS_DIR, file)).isDirectory()
		)
		.map((category: string) =>
			fs
				.readdirSync(path.join(COMPONENTS_DIR, category))
				.filter((file) =>
					fs.lstatSync(path.join(COMPONENTS_DIR, category, file)).isDirectory()
				)
				.map((component) => {
					components.push(`${category}/${component}`)
				})
		)

	for (const key in configComponents) {
		components = components.filter(
			(component) => configComponents[key].indexOf(component) < 0
		)
	}

	if (components.length === 0) return

	for (const component of components) {
		const [category, name] = component.split('/')
		registerComponent('none', category, name)
	}

	log(__('LOG_COMPONENTS_CONFIG_INTEGRITY'))
}

export function readConfig(options: ReadOptionsFn = {}): ReadReturnFn {
	if (!options.ignoreIntegrity) checkConfigIntegrity()

	const data = loadConfig()

	return {
		toDefault: () => data,
		toOneArray: () => {
			const components = []
			let ignore = Array.isArray(options.ignore)
				? options.ignore
				: [options.ignore]

			for (const key in data) {
				if (ignore.includes(key)) continue
				components.push(...data[key])
			}

			return components
		},
	}
}

export function writeConfig(data: ComponentsConfig): void {
	mkdir(process.env.APP_COMPONENTS_DIR)
	fs.writeFileSync(configPath, JSON.stringify(data, null, 2))
}
