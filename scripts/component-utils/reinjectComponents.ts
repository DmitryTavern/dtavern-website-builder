import * as fs from 'fs'
import * as path from 'path'
import { readConfig } from './componentsConfig'
import { __, log, warn } from '../helpers/logger'
import { createPage, includePageScript, includePageStyle } from '../pages-utils'
import {
	getNamespaceList,
	getNamespacePathes,
	getNamespaceComponents,
	getComponentPathes,
} from './utils'

type Namespace = 'all' | 'global' | 'none' | string

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

const checkNamespaceFiles = (namespace: string) => {
	if (namespace === 'none') return
	const pathes = getNamespacePathes(namespace)
	const components = getNamespaceComponents(namespace)
	let needPug = false
	let needScss = false
	let needJs = false

	for (const component of components) {
		const [category, name] = component.split('/')
		const componentPathes = getComponentPathes(category, name)

		if (componentPathes.pugFileExists) needPug = true
		if (componentPathes.scssFileExists) needScss = true
		if (componentPathes.jsFileExists) needJs = true
		if (needPug && needScss && needJs) break
	}

	if (!pathes.pugFileExists && needPug) {
		createPage(namespace)
		log(__('LOG_NAMESPACE_FILES_CREATED_PAGE', { namespace }))
	}

	if (!pathes.scssFileExists && needScss) {
		includePageStyle(namespace)
		log(__('LOG_NAMESPACE_FILES_CREATED_STYLE', { namespace }))
	}

	if (!pathes.jsFileExists && needJs) {
		includePageScript(namespace)
		log(__('LOG_NAMESPACE_FILES_CREATED_SCRIPT', { namespace }))
	}
}

const loadNamespacesFiles = () => {
	const namespaces = getNamespaceList()
	const files = {}

	for (const namespace of namespaces) {
		if (namespace === 'none') continue
		const pathes = getNamespacePathes(namespace)

		files[namespace] = []
		if (pathes.pugFileExists) files[namespace].push(pathes.pugPath)
		if (pathes.scssFileExists) files[namespace].push(pathes.scssPath)
		if (pathes.jsFileExists) files[namespace].push(pathes.jsPath)
	}

	return files
}

const reinjectComponentsInFile = (namespace: string, file: string) => {
	const components = getNamespaceComponents(namespace)
	const fileExt = path.extname(file).replace('.', '')
	const fileName = path.basename(file)

	const componentsRegexp = new RegExp(extReplaceFns[fileExt](), 'gm')
	const autoimportRegexp = new RegExp('//- @-auto-import\n')

	let componentsString = ''

	for (const component of components) {
		const [category, name] = component.split('/')
		const pathes = getComponentPathes(category, name)
		const pathFile = pathes[`${fileExt}Path`]
		const pathFileExists = pathes[`${fileExt}FileExists`]

		const includePath = path.relative(file.replace(fileName, ''), pathFile)

		if (pathFileExists) {
			componentsString += extInjectFns[fileExt](includePath)
		}
	}

	componentsString += '//- @-auto-import\n'

	let fileData = fs.readFileSync(file, { encoding: 'utf-8' })
	fileData = fileData.replace(componentsRegexp, '')
	fileData = fileData.replace(autoimportRegexp, componentsString)

	fs.writeFileSync(file, fileData)
}

export function reinjectComponents(namespace: Namespace) {
	if (namespace === 'none') return warn(__('WARN_REINJECT_NONE'))

	const config = readConfig().toDefault()

	for (const key in config) {
		checkNamespaceFiles(key)
	}

	const namespaces = loadNamespacesFiles()

	for (const namespaceKey in namespaces) {
		if (namespace === 'all' || namespace === namespaceKey) {
			for (const file of namespaces[namespaceKey]) {
				reinjectComponentsInFile(namespaceKey, file)
			}
		}
	}

	log(__('LOG_SUCCESS_NAMESPACE_REINJECTED', { namespace }))
}
