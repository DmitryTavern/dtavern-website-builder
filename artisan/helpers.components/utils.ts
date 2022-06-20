import * as fs from 'fs'
import * as path from 'path'
import * as types from '../types'
import { __ } from '../../helpers/logger'
import { readConfig } from './config'

const { APP_PROJECT_STORE, APP_COMPONENTS_DIR } = process.env

interface ViewPathes {
	pugPath: string
	scssPath: string
	jsPath: string
	pugFileExists: boolean
	scssFileExists: boolean
	jsFileExists: boolean
	scssVarPath: string
	scssVarFileExists: boolean
	jsVendorDirPath: string
	jsVendorDirExsits: boolean
}

const defaultPathes: ViewPathes = {
	pugPath: '',
	scssPath: '',
	jsPath: '',
	pugFileExists: false,
	scssFileExists: false,
	jsFileExists: false,
	scssVarPath: '',
	jsVendorDirPath: '',
	scssVarFileExists: false,
	jsVendorDirExsits: false,
}

const invalidComponentNames = ['', 'components']

interface getComponentInfoReturn {
	category: types.ComponentCategory
	name: types.ComponentName
}

export function getComponentInfo(
	component: types.Component
): getComponentInfoReturn {
	const split = component.split('/')

	if (split.length !== 2) throw new Error(__('ERROR_COMPONENT_IS_NOT_CORRECT'))

	return {
		category: split[0],
		name: split[1],
	}
}

export function getComponentName(
	category: types.ComponentCategory,
	name: types.ComponentName
): types.Component {
	return `${category}/${name}`
}

export function getComponentsStore() {
	if (!fs.existsSync(APP_PROJECT_STORE)) return []
	return fs
		.readdirSync(APP_PROJECT_STORE)
		.filter((file) =>
			fs.lstatSync(path.join(APP_PROJECT_STORE, file)).isDirectory()
		)
}

export function getComponentPathes(
	category: string,
	component: string
): ViewPathes {
	const result = { ...defaultPathes }
	const dir = path.join(APP_COMPONENTS_DIR, category, component)

	result.pugPath = path.join(dir, `${component}.pug`)
	result.scssPath = path.join(dir, `${component}.scss`)
	result.jsPath = path.join(dir, `${component}.js`)
	result.scssVarPath = path.join(dir, '_variables.scss')
	result.jsVendorDirPath = path.join(dir, 'vendor')

	result.pugFileExists = fs.existsSync(result.pugPath)
	result.scssFileExists = fs.existsSync(result.scssPath)
	result.jsFileExists = fs.existsSync(result.jsPath)
	result.scssVarFileExists = fs.existsSync(result.scssVarPath)
	result.jsVendorDirExsits = fs.existsSync(result.jsVendorDirPath)

	return result
}

export function existsComponentByCategory(
	category: types.ComponentCategory,
	name: types.ComponentName
) {
	const components = readConfig().toOneArray()

	for (const component of components) {
		const info = getComponentInfo(component)

		if (info.category === category && info.name === name) {
			return true
		}
	}

	return false
}

export function checkComponentName(name: types.ComponentName) {
	return !invalidComponentNames.includes(name)
}

export function getFileInfo(file: string) {
	const fileName = path.basename(file)
	const fileExt = path.extname(file).replace('.', '')
	const fileDir = file.replace(fileName, '')

	return { fileName, fileExt, fileDir }
}
