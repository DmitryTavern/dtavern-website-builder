export default <T extends any>(name: string, fn: T): T => {
	// @ts-ignore
	fn.displayName = name
	return fn
}
