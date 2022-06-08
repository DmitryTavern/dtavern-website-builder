import { __, log } from '../helpers/logger'
import { readConfig, writeConfig } from './componentsConfig'

export function unregisterComponent(category: string, name: string) {
	const config = readConfig().toDefault()
	const component = `${category}/${name}`

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
