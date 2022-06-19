export interface CreateComponentAnswers {
	js: string
	pug: string
	name: string
	scss: string
	category: string
	newCategory?: string
	namespace: string
}

export interface RenameComponentAnswers {
	oldName: string
	newName: string
}

export interface RemoveComponentAnswers {
	components: string[]
}

export interface ImportComponentsAnswers {
	components: string[]
}
