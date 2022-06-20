import * as fs from 'fs'
import * as path from 'path'
import * as shell from 'shelljs'
import { program } from 'commander'
import { __, log } from '../../helpers/logger'
import { rmdir } from '../../helpers/dir'

const { APP_PROJECT_STORE, APP_PROJECT_STORE_LINK } = process.env

const installStore = () => {
	if (fs.existsSync(APP_PROJECT_STORE)) {
		rmdir(APP_PROJECT_STORE)
	}

	shell.cd(path.resolve())

	shell.exec(`git clone ${APP_PROJECT_STORE_LINK} ${APP_PROJECT_STORE}`)

	log(__('LOG_STORE_UPDATED'))
}

program
	.command('update:store')
	.description('update component store')
	.action(() => installStore())
