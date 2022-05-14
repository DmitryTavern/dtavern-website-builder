import { TaskFunction } from 'gulp'

export default (displayName: string, compiler: TaskFunction): TaskFunction => {
	compiler.displayName = displayName
	return compiler
}
