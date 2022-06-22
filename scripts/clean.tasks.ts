import { __, rmdir, setDisplayName } from '@utilities'

const { APP_BUILD_DIRNAME } = process.env

const taskName = __('TASK_CLEAN')

export default setDisplayName(taskName, (done: any) => {
	rmdir(APP_BUILD_DIRNAME)
	return done()
})
