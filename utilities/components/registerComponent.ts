import * as types from '@types'
import { readConfig, writeConfig } from './config'
import { getComponentInfo } from './getComponentInfo'
import { getComponent } from './getComponent'
import { __, log } from '../logger'

type ComponentSplited = [types.ComponentCategory, types.ComponentName]

function splitComponents(components: types.Component[]): ComponentSplited[] {
	return components.map((component: types.Component) => {
		const { category, name } = getComponentInfo(component)
		return [category, name]
	})
}

function joinComponents(components: ComponentSplited[]): types.Component[] {
	return components.map((arr: ComponentSplited) => getComponent(arr[0], arr[1]))
}

export function registerComponent(
	namespace: types.Namespace,
	category: types.ComponentCategory,
	name: types.ComponentName
): void {
	const config = readConfig()

	const comopnents = config[namespace] ? config[namespace] : []

	const component = getComponent(category, name)

	comopnents.push(component)

	const includedComponents = splitComponents(comopnents)

	includedComponents.sort((a, b) => a[0].length - b[0].length)

	// @ts-ignore
	includedComponents.sort((a, b) => a[0] === b[0] && a[1].length - b[1].length)

	config[namespace] = joinComponents(includedComponents)

	writeConfig(config)

	log(
		__('LOG_SUCCESS_COMPONENT_REGISTRED', {
			namespace,
			component,
		})
	)
}
