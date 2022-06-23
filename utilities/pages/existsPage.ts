import { getPages } from './getPages'

export function existsPage(page: string) {
	return getPages().includes(page)
}
