import * as types from './index'

export type Component = `${ComponentName}/${ComponentCategory}`
export type ComponentName = string
export type ComponentCategory = string
export type ComponentDirectory = string

export interface ComponentsConfig {
	[key: types.Namespace]: Component[]
}
