import * as types from '../types'
import { getComponentInfo, getComponentName } from './utils'
import { readConfig, writeConfig } from './config'
import { __, log } from '../../helpers/logger'

type ComponentArr = [types.ComponentCategory, types.ComponentName]

export function registerComponent(
	namespace: types.Namespace,
	category: types.ComponentCategory,
	component: types.ComponentName
) {
	const config = readConfig({ ignoreIntegrity: true }).toDefault()

	const comopnents = config[namespace] ? config[namespace] : []

	const includedComponents: ComponentArr[] = comopnents.map(
		(component: types.Component) => {
			const { category, name } = getComponentInfo(component)
			return [category, name]
		}
	)

	includedComponents.push([category, component])

	includedComponents.sort((a, b) => a[0].length - b[0].length)

	includedComponents.sort((a, b) => a[0] === b[0] && a[1].length - b[1].length)

	config[namespace] = includedComponents.map((arr: ComponentArr) =>
		getComponentName(arr[0], arr[1])
	)

	writeConfig(config)

	log(
		__('LOG_SUCCESS_COMPONENT_REGISTRED', {
			namespace,
			component: `${category}/${component}`,
		})
	)
}
