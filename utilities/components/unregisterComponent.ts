import * as types from '@types'
import { readConfig, writeConfig } from './config'
import { __, log } from '../logger'

export function unregisterComponent(component: types.Component) {
	const config = readConfig()

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
