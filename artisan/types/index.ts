export * from './answers'

export type Namespace = 'global' | 'none' | string

export type Component = `${ComponentName}/${ComponentCategory}`
export type ComponentName = string
export type ComponentCategory = string
