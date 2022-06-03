import { readConfig, writeConfig } from './componentsConfig'

export function registerComponent(
	namespace: string,
	category: string,
	component: string
) {
	const config = readConfig()

	const comopnents = config[namespace] ? config[namespace] : []

	const includedComponents = comopnents.map((string: string) =>
		string.split('/')
	)

	includedComponents.push([category, component])

	includedComponents.sort((a, b) => a[0].length - b[0].length)

	includedComponents.sort((a, b) => a[0] === b[0] && a[1].length - b[1].length)

	config[namespace] = includedComponents.map((arr: string[]) => arr.join('/'))

	writeConfig(config)
}
