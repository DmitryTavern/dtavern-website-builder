import { TaskFunction } from 'gulp'

export const setDisplayName = (displayName: string, compiler: TaskFunction): TaskFunction => {
	compiler.displayName = displayName
	return compiler
}
