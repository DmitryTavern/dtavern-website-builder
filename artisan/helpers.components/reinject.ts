import * as fs from 'fs'
import * as path from 'path'
import * as types from '../types'
import { getComponentPathes, getComponentInfo, getFileInfo } from './utils'
import { __, log, warn } from '../../helpers/logger'
import { readConfig } from './config'
import { rmdir } from '../../helpers/dir'
import {
	createPage,
	includePageScript,
	includePageStyle,
} from '../helpers.pages'
import {
	getNamespaceList,
	getNamespacePathes,
	getNamespaceComponents,
} from '../helpers.namespaces'

const {
	ARTISAN_COMPONENT_AUTOIMPORT_SCSS_VAR_PATH,
	APP_ASSETS_SCRIPTS_VENDOR_DIR,
} = process.env

const autoimportRegexp = new RegExp('//- @-auto-import\n')

const extReplaceFns = {
	pug: () => `include .*\/components\/.*\n`,
	scss: () => `@import .*\/components\/.*\n`,
	js: () => `import .*\/components\/.*\n`,
}

const extInjectFns = {
	pug: (path: string) => `include ${path}\n`,
	scss: (path: string) => `@import "${path}";\n`,
	js: (path: string) => `import '${path}'\n`,
}

const clearInjection = (file: string, fileData: string) => {
	const { fileExt } = getFileInfo(file)
	const componentsRegexp = new RegExp(extReplaceFns[fileExt](), 'gm')
	return fileData.replace(componentsRegexp, '')
}

const addInjection = (
	file: string,
	fileData: string,
	componentFile: string
) => {
	const { fileExt, fileDir } = getFileInfo(file)

	const includePath = path.relative(fileDir, componentFile)

	let componentsString = extInjectFns[fileExt](includePath)

	componentsString += '//- @-auto-import\n'

	return fileData.replace(autoimportRegexp, componentsString)
}

const reinjectFile = (file: string, componentFiles: string[]) => {
	if (!fs.existsSync(file)) return

	let fileData = fs.readFileSync(file, { encoding: 'utf-8' })

	fileData = clearInjection(file, fileData)

	for (const componentFile of componentFiles) {
		fileData = addInjection(file, fileData, componentFile)
	}

	fs.writeFileSync(file, fileData)
}

export function reinjectComponents(target: 'all' | types.Namespace) {
	if (target === 'none') return warn(__('WARN_REINJECT_NONE'))

	// Reinject components for namespace
	const namespaces = getNamespaceList()

	for (const namespace of namespaces) {
		if (target === 'all' || namespace === target) {
			const pathes = getNamespacePathes(namespace)
			const components = getNamespaceComponents(namespace)
			const pageComponents = []
			const styleComponents = []
			const scriptComponents = []

			for (const component of components) {
				const { category, name } = getComponentInfo(component)
				const namespacePathes = getNamespacePathes(namespace)
				const componentPathes = getComponentPathes(category, name)

				if (componentPathes.pugFileExists) {
					if (!namespacePathes.pugFileExists) {
						createPage(namespace)
						log(__('LOG_NAMESPACE_FILES_CREATED_PAGE', { namespace }))
					}

					pageComponents.push(componentPathes.pugPath)
				}

				if (componentPathes.scssFileExists) {
					if (!namespacePathes.scssFileExists) {
						includePageStyle(namespace)
						log(__('LOG_NAMESPACE_FILES_CREATED_STYLE', { namespace }))
					}

					styleComponents.push(componentPathes.scssPath)
				}

				if (componentPathes.jsFileExists) {
					if (!namespacePathes.jsFileExists) {
						includePageScript(namespace)
						log(__('LOG_NAMESPACE_FILES_CREATED_SCRIPT', { namespace }))
					}

					scriptComponents.push(componentPathes.jsPath)
				}
			}

			reinjectFile(pathes.pugPath, pageComponents)
			reinjectFile(pathes.scssPath, styleComponents)
			reinjectFile(pathes.jsPath, scriptComponents)
		}
	}

	// Reinject variables of all components
	const components = readConfig().toOneArray()
	const styleComponentVars = []

	for (const component of components) {
		const { category, name } = getComponentInfo(component)
		const componentPathes = getComponentPathes(category, name)

		if (componentPathes.scssVarFileExists) {
			styleComponentVars.push(componentPathes.scssVarPath)
		}

		if (componentPathes.jsVendorDirExsits) {
			fs.readdirSync(componentPathes.jsVendorDirPath).map((file) => {
				const oldPath = path.join(componentPathes.jsVendorDirPath, file)
				const newPath = path.join(APP_ASSETS_SCRIPTS_VENDOR_DIR, file)

				fs.renameSync(oldPath, newPath)
			})

			rmdir(componentPathes.jsVendorDirPath)
		}
	}

	reinjectFile(ARTISAN_COMPONENT_AUTOIMPORT_SCSS_VAR_PATH, styleComponentVars)

	log(__('LOG_SUCCESS_NAMESPACE_REINJECTED', { namespace: target }))
}
