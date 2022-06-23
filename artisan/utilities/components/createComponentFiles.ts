import * as fs from 'fs'
import * as types from '@types'
import {
	mkdir,
	templateLoader,
	getComponentInfo,
	getComponentPathes,
	getComponentDirectory,
} from '@utilities'

interface Options {
	pug?: boolean
	scss?: boolean
	js?: boolean
}

const {
	ARTISAN_TEMPLATE_PUG_COMPONENT,
	ARTISAN_TEMPLATE_SCSS_COMPONENT,
	ARTISAN_TEMPLATE_JS_COMPONENT,
} = process.env

export function createComponentFiles(
	component: types.Component,
	options: Options
) {
	const info = getComponentInfo(component)
	const pathes = getComponentPathes(component)
	const directory = getComponentDirectory(component)
	const templateOptions = {
		name: info.name,
	}

	mkdir(directory)

	if (options.pug) {
		const templatePath = ARTISAN_TEMPLATE_PUG_COMPONENT
		const pugData = templateLoader(templatePath, templateOptions)
		fs.writeFileSync(pathes.pugFile, pugData, 'utf-8')
	}

	if (options.scss) {
		const templatePath = ARTISAN_TEMPLATE_SCSS_COMPONENT
		const scssData = templateLoader(templatePath, templateOptions)
		fs.writeFileSync(pathes.scssFile, scssData, 'utf-8')
	}

	if (options.js) {
		const templatePath = ARTISAN_TEMPLATE_JS_COMPONENT
		const jsData = templateLoader(templatePath, templateOptions)
		fs.writeFileSync(pathes.jsFile, jsData, 'utf-8')
	}
}
