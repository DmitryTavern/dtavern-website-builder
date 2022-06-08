import * as server from 'browser-sync'
import { setDisplayName } from './helpers/setDisplayName'
import { __ } from './helpers/logger'

const { NODE_ENV, APP_BUILD_DIRNAME, APP_DEV_SERVER_PORT } = process.env

const taskName = __('TASK_SERVER')

let browserSync

if (NODE_ENV === 'development') {
	browserSync = server.create()
}

export default setDisplayName(taskName, (done: any) => {
	if (NODE_ENV === 'production') return done()

	browserSync.init({
		port: APP_DEV_SERVER_PORT,
		ui: {
			port: +APP_DEV_SERVER_PORT + 1,
		},
		server: {
			baseDir: APP_BUILD_DIRNAME,
		},
		notify: false,
	})

	browserSync.watch(APP_BUILD_DIRNAME).on('change', browserSync.reload)

	done()
})
