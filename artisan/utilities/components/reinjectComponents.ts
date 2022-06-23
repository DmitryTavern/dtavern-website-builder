import * as fs from 'fs'
import * as path from 'path'
import * as types from '@types'
import {
	__,
	log,
	warn,
	rmdir,
	autoimport,
	getComponents,
	getComponentPathes,
	getComponentsOfNamespace,
	clearComponentInjections,
	generateComponentsInjections,
	getNamespaces,
	getNamespacePathes,
} from '@utilities'

import {
	createPage,
	createPageStyle,
	createPageScript,
	includeStyleToPage,
	includeScriptToPage,
} from '../pages'

type ReinjectTarget = 'all' | types.Namespace

function reinjectFile(file: string, components: types.Component[]) {
	if (!fs.existsSync(file)) return

	let injections = generateComponentsInjections(file, components)

	injections += '//- @-auto-import\n'

	let fileData = fs.readFileSync(file, { encoding: 'utf-8' })

	fileData = clearComponentInjections(fileData)

	fileData = fileData.replace('//- @-auto-import\n', injections)

	fs.writeFileSync(file, fileData)
}

// Reinject functions

function reinjectNamespace(namespace: types.Namespace) {
	const components = getComponentsOfNamespace(namespace)
	const namespacePathes = getNamespacePathes(namespace)
	const pageComponents = []
	const styleComponents = []
	const scriptComponents = []

	for (const component of components) {
		const componentPathes = getComponentPathes(component)

		if (fs.existsSync(componentPathes.pugFile)) {
			if (!fs.existsSync(namespacePathes.pugFile)) {
				createPage(namespace)
				log(__('LOG_NAMESPACE_FILES_CREATED_PAGE', { namespace }))
			}

			pageComponents.push(component)
		}

		if (fs.existsSync(componentPathes.scssFile)) {
			if (!fs.existsSync(namespacePathes.scssFile)) {
				createPageStyle(namespace)
				includeStyleToPage(namespace)
				log(__('LOG_NAMESPACE_FILES_CREATED_STYLE', { namespace }))
			}

			styleComponents.push(component)
		}

		if (fs.existsSync(componentPathes.jsFile)) {
			if (!fs.existsSync(namespacePathes.jsFile)) {
				createPageScript(namespace)
				includeScriptToPage(namespace)
				log(__('LOG_NAMESPACE_FILES_CREATED_SCRIPT', { namespace }))
			}

			scriptComponents.push(component)
		}
	}

	reinjectFile(namespacePathes.pugFile, pageComponents)
	reinjectFile(namespacePathes.scssFile, styleComponents)
	reinjectFile(namespacePathes.jsFile, scriptComponents)
}

function reinjectComponentsVars() {
	const variablesPath = process.env.APP_STYLES_VARIABLES_PATH
	const components = getComponents()
	const componentVars = []

	for (const component of components) {
		const componentPathes = getComponentPathes(component)

		if (fs.existsSync(componentPathes.variablesFile)) {
			componentVars.push(component)
		}
	}

	reinjectFile(variablesPath, componentVars)
}

function reinjectComponentsVendors() {
	const vendorPath = process.env.APP_ASSETS_SCRIPTS_VENDOR_DIR
	const components = getComponents()

	for (const component of components) {
		const componentPathes = getComponentPathes(component)

		if (fs.existsSync(componentPathes.vendorDir)) {
			fs.readdirSync(componentPathes.vendorDir).map((file) => {
				const oldPath = path.join(componentPathes.vendorDir, file)
				const newPath = path.join(vendorPath, file)

				fs.renameSync(oldPath, newPath)
			})

			rmdir(componentPathes.vendorDir)
		}
	}
}

export function reinjectComponents(target: ReinjectTarget) {
	if (!autoimport()) return warn(__('WARN_AUTOIMPORT_TURN_OFF'))
	if (target === 'none') return warn(__('WARN_REINJECT_NONE'))

	const namespaces = getNamespaces()

	for (const namespace of namespaces) {
		if (namespace === 'none') continue
		if (target === 'all' || namespace === target) {
			reinjectNamespace(namespace)
		}
	}

	reinjectComponentsVars()
	reinjectComponentsVendors()

	log(__('LOG_SUCCESS_NAMESPACE_REINJECTED', { namespace: target }))
}
