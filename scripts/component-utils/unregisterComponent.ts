import { readConfig, writeConfig } from './componentsConfig'

export function unregisterComponent(category: string, component: string) {
	const config = readConfig()

	for (const key in config) {
		const comopnents = config[key]

		const index = comopnents.indexOf(`${category}/${component}`)

		if (index !== -1) comopnents.splice(index, 1)
	}

	writeConfig(config)
}
