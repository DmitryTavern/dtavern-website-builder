import { TaskFunction } from 'gulp'

export interface Compiler {
	(input?: string, msg?: string): TaskFunction
}
