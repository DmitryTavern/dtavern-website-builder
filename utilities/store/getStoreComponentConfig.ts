import * as fs from 'fs'
import * as path from 'path'
import * as types from '@types'
import { __, error } from '../../utilities/logger'
import { getComponentInfo } from '../components'

const { APP_PROJECT_STORE } = process.env

const requiredParams = ['depends', 'namespace']

export function getStoreComponentConfig(component: types.Component) {
	const { name } = getComponentInfo(component)
	const componentDir = path.join(APP_PROJECT_STORE, component)
	const componentConfigPath = path.join(componentDir, `${name}.json`)

	if (!fs.existsSync(componentConfigPath)) {
		return error(
			__('ERROR_COMPONENT_CONFIG_NOT_FOUND', {
				component,
			})
		)
	}

	const componentConfig = JSON.parse(
		fs.readFileSync(componentConfigPath, { encoding: 'utf-8' })
	)

	for (const requiredParam of requiredParams) {
		if (!componentConfig[requiredParam]) {
			return error(
				__('ERROR_COMPONENT_CONFIG_HAVE_NOT_PARAM', {
					component,
					param: requiredParam,
				})
			)
		}
	}

	return componentConfig
}
