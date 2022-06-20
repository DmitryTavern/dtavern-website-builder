import * as types from './index'

// Components
export interface CreateComponentAnswers {
	js: string
	pug: string
	name: types.ComponentName
	scss: string
	category: types.ComponentCategory
	newCategory?: types.ComponentCategory
	namespace: types.Namespace
}

export interface RenameComponentAnswers {
	oldComponent: types.Component
	newName: types.ComponentName
}

export interface RemoveComponentAnswers {
	components: types.Component[]
}

export interface ImportComponentsAnswers {
	components: types.Component[]
}

// Pages
export interface CreatePageAnswers {
	name: string
	scss: string
	js: string
}

export interface RenamePageAnswers {
	oldName: string
	newName: string
}
