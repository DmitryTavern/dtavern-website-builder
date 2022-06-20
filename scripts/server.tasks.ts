import * as server from 'browser-sync'
import { setDisplayName } from './helpers/setDisplayName'
import { isDev, isProd } from './helpers/mode'
import { __ } from '../helpers/logger'

const { APP_BUILD_DIRNAME, APP_DEV_SERVER_PORT } = process.env

let browserSync

if (isDev()) {
	browserSync = server.create()
}

const taskName = __('TASK_SERVER')

export default setDisplayName(taskName, (done: any) => {
	if (isProd()) return done()

	browserSync.init({
		port: APP_DEV_SERVER_PORT,
		ui: {
			port: +APP_DEV_SERVER_PORT + 1,
		},
		server: {
			baseDir: APP_BUILD_DIRNAME,
		},
		notify: false,
		open: false,
	})

	browserSync.watch(APP_BUILD_DIRNAME).on('change', browserSync.reload)

	done()
})
