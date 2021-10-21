
// ************ Themes ************

const themes = {
	0: ["Default", "#0f0f0f", "#000000b0", "#dfdfdf", "#ffffff", "#bf8f8f"],
	1: ["Aqua", "#001f3f", "#000f1fb0", "#bfdfff", "#dfefff", "#c4a7b3"],
	2: ["The Felt", "#042300", "#030f00b0", "#abefb0", "#efffdf", "#c4a7b3"],
	3: ["<ts style='text-shadow:0 0 5px var(--background),0 0 5px var(--background)'>Trickster</ts>", "#00117e", "#ff73fdb0", "#f9fd60", "#44ff00", "#ff0000"],
}
const colors = {
	0: { 1: "#ffffff", 2: "#ffffffbf", 3: "#ffffff7f", },
	1: { 1: "#bfdfff", 2: "#bfdfffbf", 3: "#bfdfff7f", },
	2: { 1: "#abefb0", 2: "#abefb0bf", 3: "#abefb07f", },
	3: { 1: "#ff73fd", 2: "#ff73fdbf", 3: "#ff73fd7f", },
}

function changeTheme() {
	colors_theme = colors[meta.options.theme] || colors[0]
	document.body.style.setProperty('--background', themes[meta.options.theme] ? themes[meta.options.theme][1] : "#0f0f0f")
	document.body.style.setProperty('--background_tooltip', themes[meta.options.theme] ? themes[meta.options.theme][2] : "#000000b0")
	document.body.style.setProperty('--color', themes[meta.options.theme] ? themes[meta.options.theme][3] : "#dfdfdf")
	document.body.style.setProperty('--points', themes[meta.options.theme] ? themes[meta.options.theme][4] : "#ffffff")
	document.body.style.setProperty("--locked", themes[meta.options.theme] ? themes[meta.options.theme][5] : "#bf8f8f")
}

function switchTheme() {
	meta.options.theme = themes[+meta.options.theme + 1] ? +meta.options.theme + 1 : 0
	changeTheme()
}

function getThemeName() {
	return meta.options.theme && themes[meta.options.theme] ? themes[meta.options.theme][0] : "Default"
}