import * as fs from 'fs'
import * as gulp from 'gulp'
import * as types from '../types'
import { mkdir } from './mkdir'

const { APP_COMPONENTS_DIR } = process.env

export default (files: string, compiler: ReturnType<types.Compiler>) => {
	mkdir(APP_COMPONENTS_DIR)

	gulp.watch(files, compiler)
}
