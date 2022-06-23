import * as types from '@types'
import { readConfig } from '../components'

export function getNamespaceByComponent(
	component: types.Component
): types.Namespace {
	const namespaces = readConfig()

	for (const namespace in namespaces) {
		if (namespaces[namespace].includes(component)) return namespace
	}

	return 'none'
}
