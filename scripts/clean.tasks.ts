import taskWrap from './helpers/taskWrap'
import { rmdir } from './helpers/rmdir'

const { APP_BUILD_DIRNAME } = process.env

export default taskWrap('[task]: clean folders', (done: any) => {
	rmdir(APP_BUILD_DIRNAME)
	return done()
})
