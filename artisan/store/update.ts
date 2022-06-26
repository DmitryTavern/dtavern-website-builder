import * as fs from 'fs'
import * as path from 'path'
import * as shell from 'shelljs'
import { __, log, rmdir } from '@utilities'

const { APP_PROJECT_STORE, APP_PROJECT_STORE_LINK } = process.env

export const updateStoreCommand = () => {
	if (fs.existsSync(APP_PROJECT_STORE)) {
		rmdir(APP_PROJECT_STORE)
	}

	shell.cd(path.resolve())

	shell.exec(`git clone ${APP_PROJECT_STORE_LINK} ${APP_PROJECT_STORE}`)

	log(__('LOG_STORE_UPDATED'))
}
