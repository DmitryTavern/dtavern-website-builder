import * as gulp from 'gulp'
import * as clean from 'gulp-clean'
import taskWrap from './helpers/taskWrap'

const { APP_BUILD_DIRNAME } = process.env

export default taskWrap('[task]: clean folders', (done: any) => {
	gulp.src(APP_BUILD_DIRNAME, { allowEmpty: true }).pipe(clean())
	done()
})
