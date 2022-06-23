import * as types from '@types'
import { getPages } from '../pages'

export function getNamespaces(): types.Namespace[] {
	return ['global', ...getPages(), 'none']
}
