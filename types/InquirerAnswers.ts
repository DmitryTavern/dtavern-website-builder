import * as types from './index'

// Components
export interface CreateComponentAnswers {
	js: boolean
	pug: boolean
	scss: boolean
	name: types.ComponentName
	category: types.ComponentCategory
	newCategory?: types.ComponentCategory
	namespace: types.Namespace
}

export interface RenameComponentAnswers {
	component: types.Component
	newName: types.ComponentName
}

export interface RemoveComponentAnswers {
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

// Store
export interface ImportComponentsAnswers {
	components: types.Component[]
}
