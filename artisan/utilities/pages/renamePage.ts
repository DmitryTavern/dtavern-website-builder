import * as fs from 'fs'
import * as path from 'path'
import * as glob from 'glob'
import {
	__,
	log,
	warn,
	readConfig,
	writeConfig,
	existsPage,
	createPageTitle,
	getNamespacePathes,
} from '@utilities'

const { APP_PAGES_DIR } = process.env

const extFindFns = {
	pug: (pageName: string) => `include ((|..)${pageName}\/)(.*)\n`,
	scss: (pageName: string) => `@import (("|"..|'|'..)${pageName}\/)(.*)\n`,
	js: (pageName: string) => `import (("|"..|'|'..)${pageName}\/)(.*)\n`,
}

const extInjectFns = {
	pug: (path: string) => `include ${path}\n`,
	scss: (path: string) => `@import ${path}\n`,
	js: (path: string) => `import ${path}\n`,
}

function getFileInfo(file: string) {
	const fileExt = path.extname(file)
	const fileName = path.basename(file).replace(fileExt, '')

	return {
		fileExt: fileExt.replace('.', ''),
		fileName,
	}
}

function renameFile(file: string, newName: string) {
	if (!fs.existsSync(file)) return

	const { fileName, fileExt } = getFileInfo(file)

	const newFile = file.replace(
		`${fileName}.${fileExt}`,
		`${newName}.${fileExt}`
	)

	if (fs.existsSync(newFile)) {
		warn(__('WARN_PAGE_RENAME_OVERWRITE', { file: newFile }))
	}

	fs.renameSync(file, newFile)
}

function renamePageSubDirectoriesImport(oldName: string, newName: string) {
	const pathes = getNamespacePathes(oldName)

	for (const key in pathes) {
		const file = pathes[key]

		if (!fs.existsSync(file)) continue

		const { fileName, fileExt } = getFileInfo(file)

		const regexp = new RegExp(extFindFns[fileExt](fileName))

		let fileData = fs.readFileSync(file, { encoding: 'utf-8' })

		let match = fileData.match(regexp)

		while (match) {
			const content = extInjectFns[fileExt](
				match[1].replace(oldName, newName) + match[3]
			)

			fileData = fileData.replace(regexp, content)

			match = fileData.match(regexp)
		}

		fs.writeFileSync(file, fileData)
	}
}

function renamePageSubDirectories(oldName: string, newName: string) {
	const pathes = getNamespacePathes(oldName)

	for (const key in pathes) {
		const file = pathes[key]
		const fileName = path.basename(file)
		const directory = file.replace(fileName, oldName)

		if (fs.existsSync(directory)) {
			const newDirectory = file.replace(fileName, newName)

			if (fs.existsSync(newDirectory)) {
				warn(
					__('WARN_PAGE_RENAME_MERGE', {
						dir: newDirectory,
						pageDir: directory,
					})
				)
			}

			fs.renameSync(directory, newDirectory)
		}
	}
}

function renameConfigNamespace(oldName: string, newName: string) {
	const config = readConfig()

	if (config[oldName]) {
		const injectedComponents = [...config[oldName]]

		delete config[oldName]

		config[newName] = injectedComponents

		writeConfig(config)
	}
}

function renamePageContent(oldName: string, newName: string) {
	const pathes = getNamespacePathes(oldName)

	if (fs.existsSync(pathes.pugFile)) {
		let pugData = fs.readFileSync(pathes.pugFile, { encoding: 'utf-8' })

		pugData = pugData.replace(/title .*\n/, createPageTitle(newName))

		pugData = pugData.replace(
			`+style('${oldName}.css')`,
			`+style('${newName}.css')`
		)

		pugData = pugData.replace(
			`+script('${oldName}.js')`,
			`+script('${newName}.js')`
		)

		fs.writeFileSync(pathes.pugFile, pugData)
	}
}

function renamePageLinks(oldName: string, newName: string) {
	const files = glob.sync(`${path.join(APP_PAGES_DIR, '**/*.pug')}`)
	const regexpLink = new RegExp(`href=('|")/${oldName}.html('|")`)

	for (const file of files) {
		let fileData = fs.readFileSync(file, { encoding: 'utf-8' })

		fileData = fileData.replace(regexpLink, `href='/${newName}.html'`)

		fs.writeFileSync(file, fileData)
	}
}

export function renamePage(oldName: string, newName: string) {
	if (!existsPage(oldName)) return
	if (existsPage(newName)) return

	const pathes = getNamespacePathes(oldName)

	renamePageSubDirectoriesImport(oldName, newName)
	renamePageSubDirectories(oldName, newName)
	renamePageContent(oldName, newName)
	renamePageLinks(oldName, newName)

	renameConfigNamespace(oldName, newName)

	renameFile(pathes.pugFile, newName)
	renameFile(pathes.scssFile, newName)
	renameFile(pathes.jsFile, newName)

	log(__('LOG_SUCCESS_PAGE_RENAMED', { oldName, newName }))
}
