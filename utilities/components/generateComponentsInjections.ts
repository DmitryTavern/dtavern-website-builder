import * as path from 'path'
import * as types from '@types'
import { getComponentPathes } from './getComponentPathes'

const extInjectFns = {
	pug: (path: string) => `include ${path}\n`,
	scss: (path: string) => `@import "${path}";\n`,
	js: (path: string) => `import '${path}'\n`,
}

export function generateComponentsInjections(
	targetFile: string,
	components: types.Component[]
): string {
	let result = ''

	const fileDir = path.dirname(targetFile)
	const fileExt = path.extname(targetFile).replace('.', '')

	const pathName =
		targetFile === process.env.APP_STYLES_VARIABLES_PATH
			? 'variablesFile'
			: fileExt + 'File'

	for (const component of components) {
		const pathes = getComponentPathes(component)
		const includePath = path.relative(fileDir, pathes[pathName])
		result += extInjectFns[fileExt](includePath)
	}

	return result
}
