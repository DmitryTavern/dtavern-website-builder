import * as fs from 'fs'
import * as path from 'path'
import * as types from '@types'
import { getComponentsFormDrive } from './getComponents'
import { registerComponent } from './registerComponent'
import { getComponentInfo } from './getComponentInfo'
import { __, log } from '../logger'
import { mkdir } from '../directories'

const { APP_COMPONENTS_DIR, APP_COMPONENTS_CONFIG_FILENAME } = process.env

const componentsConfigPath = path.join(
	APP_COMPONENTS_DIR,
	APP_COMPONENTS_CONFIG_FILENAME
)

let _cacheData: types.ComponentsConfig | undefined

function loadData(): types.ComponentsConfig {
	if (!fs.existsSync(componentsConfigPath)) return {}
	return JSON.parse(
		fs.readFileSync(componentsConfigPath, { encoding: 'utf-8' })
	)
}

function checkConfigIntegrity() {
	if (!fs.existsSync(APP_COMPONENTS_DIR)) return

	const componentsFormDrive = getComponentsFormDrive()
	const components: types.Component[] = []

	for (const key in componentsFormDrive) {
		components.push(
			...components.filter(
				(component) => componentsFormDrive[key].indexOf(component) < 0
			)
		)
	}

	for (const component of components) {
		const { category, name } = getComponentInfo(component)

		registerComponent('none', category, name)
	}

	if (components.length !== 0) {
		log(__('LOG_COMPONENTS_CONFIG_INTEGRITY'))
	}
}

export function readConfig(): types.ComponentsConfig {
	if (!_cacheData) {
		_cacheData = loadData()
		checkConfigIntegrity()
	}

	return _cacheData
}

export function writeConfig(data: types.ComponentsConfig): void {
	mkdir(APP_COMPONENTS_DIR)
	fs.writeFileSync(componentsConfigPath, JSON.stringify(data, null, 2))
}
