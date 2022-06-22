import * as inquirer from 'inquirer'
import { getComponents } from '../components'
import {
	getStoreCategories,
	excludeInstalledComponents,
	getStoreComponentsByCategory,
} from '../store'

export function getFilteredStoreComponents() {
	const installedComponents = getComponents()
	const storeCategories = getStoreCategories()
	const components = []

	for (const category of storeCategories) {
		const categoryComponents = getStoreComponentsByCategory(category)
		const freeComponents = excludeInstalledComponents(
			installedComponents,
			categoryComponents
		)

		if (freeComponents.length !== 0) {
			components.push(
				// @ts-ignore
				new inquirer.Separator('=== ' + category + ' ==='),
				...freeComponents
			)
		}
	}

	return components
}
