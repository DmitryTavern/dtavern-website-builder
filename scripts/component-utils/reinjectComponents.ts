import * as fs from 'fs'
import * as path from 'path'
import { log, warn } from '../helpers/logger'
import { readConfig } from './componentsConfig'
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

	if (!pathes.pugFileExists && needScss) {
		createPage(namespace)
		log(`[checkNamespaceFiles]: Was created '${namespace}' page`)
	}

	if (!pathes.scssFileExists && needScss) {
		includePageStyle(namespace)
		log(`[checkNamespaceFiles]: For '${namespace}' page was created style`)
	}

	if (!pathes.jsFileExists && needJs) {
		includePageScript(namespace)
		log(`[checkNamespaceFiles]: For '${namespace}' page was created script`)
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

	const componentsRegexp = new RegExp(extReplaceFns[fileExt](), 'gm')
	const autoimportRegexp = new RegExp('//- @-auto-import\n')

	let componentsString = ''

	for (const component of components) {
		const [category, name] = component.split('/')
		const pathes = getComponentPathes(category, name)
		const pathFile = pathes[`${fileExt}Path`]
		const pathFileExists = pathes[`${fileExt}FileExists`]

		const includePath = path.relative(file, pathFile)

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
	if (namespace === 'none')
		return warn("[reinjectComponents]: please, don't use 'none' namespace")

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

	log(`${namespace} namespace components success reinjected`)
}
