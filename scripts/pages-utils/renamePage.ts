import * as fs from 'fs'
import * as path from 'path'
import { log } from '../helpers/logger'
import { getPageTitle } from './getPageTitle'
import { readConfig, getNamespacePathes, writeConfig } from '../component-utils'

const extFindFns = {
	pug: (pageName: string) => `include ((|..)${pageName}\/)(.*)\n`,
	scss: (pageName: string) => `@import (("|"..|'|'..)${pageName}\/)(.*)\n`,
	js: (pageName: string) => `require\\((("|"..|'|'..)${pageName}\/)(.*)\n`,
}

const extInjectFns = {
	pug: (path: string) => `include ${path}\n`,
	scss: (path: string) => `@import ${path}\n`,
	js: (path: string) => `require\(${path}\n`,
}

function renameFile(pageName: string, newPageName: string, file: string) {
	if (!fs.existsSync(file)) return

	const fileExt = path.extname(file).replace('.', '')
	const regexp = new RegExp(extFindFns[fileExt](pageName))
	const pageDir = file.replace(`${pageName}.${fileExt}`, `${pageName}`)
	const newPageDir = file.replace(`${pageName}.${fileExt}`, `${newPageName}`)

	let fileData = fs.readFileSync(file, { encoding: 'utf-8' })
	let match = fileData.match(regexp)

	while (match) {
		const content = extInjectFns[fileExt](
			match[1].replace(pageName, newPageName) + match[3]
		)

		fileData = fileData.replace(regexp, content)

		match = fileData.match(regexp)
	}

	fs.writeFileSync(file, fileData)

	fs.renameSync(
		file,
		file.replace(`${pageName}.${fileExt}`, `${newPageName}.${fileExt}`)
	)

	if (fs.existsSync(pageDir)) {
		fs.renameSync(pageDir, newPageDir)
	}
}

export function renamePage(pageName: string, newPageName: string) {
	const pathes = getNamespacePathes(pageName)
	const config = readConfig().toDefault()

	if (config[pageName]) {
		const injectedComponents = [...config[pageName]]

		delete config[pageName]

		config[newPageName] = injectedComponents

		writeConfig(config)
	}

	if (pathes.pugFileExists) {
		let pugData = fs.readFileSync(pathes.pugPath, { encoding: 'utf-8' })

		pugData = pugData.replace(/title .*\n/, getPageTitle(newPageName))

		pugData = pugData.replace(
			`+style('${pageName}.css')`,
			`+style('${newPageName}.css')`
		)

		pugData = pugData.replace(
			`+script('${pageName}.js')`,
			`+script('${newPageName}.js')`
		)

		fs.writeFileSync(pathes.pugPath, pugData)
	}

	renameFile(pageName, newPageName, pathes.pugPath)
	renameFile(pageName, newPageName, pathes.scssPath)
	renameFile(pageName, newPageName, pathes.jsPath)

	log(`Page '${pageName}' success renamed to '${newPageName}'`)
}
