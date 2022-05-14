import * as server from 'browser-sync'
import taskWrap from './helpers/taskWrap'

const { NODE_ENV, APP_BUILD_DIRNAME, APP_DEV_SERVER_PORT } = process.env

let browserSync

if (NODE_ENV === 'development') {
	browserSync = server.create()
}

export default taskWrap('[task]: run server service', (done: any) => {
	if (NODE_ENV === 'production') return

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
