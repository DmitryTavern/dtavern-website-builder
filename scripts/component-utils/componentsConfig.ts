import * as fs from 'fs'
import * as path from 'path'
import { log } from '../helpers/logger'
import { mkdir } from '../helpers/mkdir'
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
	return JSON.parse(fs.readFileSync(configPath, { encoding: 'utf-8' }))
}

function checkConfigExists() {
	if (!fs.existsSync(configPath)) {
		mkdir(process.env.APP_COMPONENTS_DIR)
		fs.writeFileSync(configPath, '{}')
	}
}

function checkConfigIntegrity() {
	const COMPONENTS_DIR = process.env.APP_COMPONENTS_DIR
	const configComponents = loadConfig()
	let components: string[] = []

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

	log(
		`Components Config Integrity: found components without namesapce. They are added to 'none' namespace`
	)
}

export function readConfig(options: ReadOptionsFn = {}): ReadReturnFn {
	checkConfigExists()
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
	fs.writeFileSync(configPath, JSON.stringify(data, null, 2))
}
