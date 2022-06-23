import { TaskFunction } from 'gulp'

export interface Compiler {
	(input: string | string[]): TaskFunction
}
