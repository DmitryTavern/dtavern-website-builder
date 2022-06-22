const extReplaceFns = {
	pug: () => `include .*\/components\/.*\n`,
	scss: () => `@import .*\/components\/.*\n`,
	js: () => `import .*\/components\/.*\n`,
}

export function clearComponentInjections(fileData: string) {
	let data = fileData

	for (const extKey in extReplaceFns) {
		const componentsRegexp = new RegExp(extReplaceFns[extKey](), 'gm')
		data = data.replace(componentsRegexp, '')
	}

	return data
}
