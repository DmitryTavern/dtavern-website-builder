import * as fs from 'fs'
import * as path from 'path'
import * as shell from 'shelljs'
import { program } from 'commander'
import { __, warn, log } from '@utilities'

const { APP_PROJECT_STORE, APP_PROJECT_STORE_LINK } = process.env

const installStore = () => {
	if (fs.existsSync(APP_PROJECT_STORE)) {
		return warn(__('WARN_STORE_EXISTS'))
	}

	shell.cd(path.resolve())

	shell.exec(`git clone ${APP_PROJECT_STORE_LINK} ${APP_PROJECT_STORE}`)

	log(__('LOG_STORE_INSTALLED'))
}

program
	.command('install:store')
	.description('install component store')
	.action(() => installStore())
