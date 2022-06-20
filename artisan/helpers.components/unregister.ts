import * as types from '../types'
import { readConfig, writeConfig } from './config'
import { getComponentName } from '../helpers.components'
import { __, log } from '../../helpers/logger'

export function unregisterComponent(
	category: types.ComponentCategory,
	name: types.ComponentName
) {
	const config = readConfig().toDefault()
	const component = getComponentName(category, name)

	for (const key in config) {
		const comopnents = config[key]

		const index = comopnents.indexOf(component)

		if (index !== -1) comopnents.splice(index, 1)
	}

	writeConfig(config)

	log(
		__('LOG_SUCCESS_COMPONENT_UNREGISTRED', {
			component,
		})
	)
}
