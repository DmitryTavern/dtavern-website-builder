const invalidNameValues = ['', 'global', 'none', 'common']

export function checkPageName(name: string) {
	return !invalidNameValues.includes(name)
}
