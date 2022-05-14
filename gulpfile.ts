import 'dotenv/config'
import * as gulp from 'gulp'

import viewsTask from './scripts/pages.tasks'
import styleTask from './scripts/style.tasks'
import scriptTask from './scripts/script.tasks'
import imageTask from './scripts/image.tasks'
import spriteTask from './scripts/sprite.tasks'
import fontsTask from './scripts/fonts.tasks'
import serverTask from './scripts/server.tasks'
import cleanTask from './scripts/clean.tasks'

gulp.task(
	'start',
	gulp.series(
		cleanTask,
		gulp.parallel(
			viewsTask,
			styleTask,
			scriptTask,
			imageTask,
			spriteTask,
			fontsTask,
			serverTask
		)
	)
)
