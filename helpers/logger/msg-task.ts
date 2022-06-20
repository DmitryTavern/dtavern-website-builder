export default {
	// Task names
	TASK_HTML: '[task]: run html service',
	TASK_STYLE: '[task]: run style service',
	TASK_SCRIPT: '[task]: run script service',
	TASK_IMAGES: '[task]: run image service',
	TASK_SPRITE: '[task]: run sprite service',
	TASK_SERVER: '[task]: run server service',
	TASK_CLEAN: '[task]: run clean service',
	TASK_FONTS: '[task]: run font service',

	// Compilers
	TASK_COMPILER_PAGE: {
		message: "[page/${type}]: compiling '${namespace}' page",
		payload: { type: '', namespace: '' },
	},
	TASK_COMPILER_COMPONENT: {
		message: "[${name}/${type}]: compiling '${namespace}' page",
		payload: { name: '', type: '', namespace: '' },
	},

	TASK_COMPILER_STYLE_PAGES: '[global/style]: compiling pages',
	TASK_COMPILER_STYLE_GLOBAL: '[global/style]: compiling files',

	TASK_COMPILER_SCRIPT_PAGES: '[global/js]: compiling all pages',
	TASK_COMPILER_SCRIPT_GLOBAL: '[global/js]: compiling all files',
	TASK_COMPILER_SCRIPT_VENDOR: '[global/js/vendor]: compiling all vendor files',

	TASK_COMPILER_IMAGES: '[global/images]: compiling all images',
	TASK_COMPILER_IMAGES_WEBP: '[global/images/webp]: compiling all images',
	TASK_COMPILER_IMAGES_FAVICON: '[global/images/favicon]: compiling all images',

	TASK_COMPILER_FONT: '[font]: move all files',

	TASK_COMPILER_SPRITE: '[global/sprite]: compiling sprite',
}
