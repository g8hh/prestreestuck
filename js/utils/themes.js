
// ************ Themes ************

const themes = {
	0: ["Default", "#0f0f0f", "#000000b0", "#dfdfdf", "#ffffff", "#bf8f8f"],
	1: ["Aqua", "#001f3f", "#000f1fb0", "#bfdfff", "#dfefff", "#c4a7b3"],
	2: ["Homosuck", "#042300", "#030f00b0", "#abefb0", "#efffdf", "#c4a7b3"],
}
const colors = {
	0: { 1: "#ffffff", 2: "#ffffffbf", 3: "#ffffff7f", },
	1: { 1: "#bfdfff", 2: "#bfdfffbf", 3: "#bfdfff7f", },
	2: { 1: "#abefb0", 2: "#abefb0bf", 3: "#abefb07f", },
}

function changeTheme() {
	colors_theme = colors[player.theme] || colors[0]
	document.body.style.setProperty('--background', themes[player.theme] ? themes[player.theme][1] : "#0f0f0f")
	document.body.style.setProperty('--background_tooltip', themes[player.theme] ? themes[player.theme][2] : "#000000b0")
	document.body.style.setProperty('--color', themes[player.theme] ? themes[player.theme][3] : "#dfdfdf")
	document.body.style.setProperty('--points', themes[player.theme] ? themes[player.theme][4] : "#ffffff")
	document.body.style.setProperty("--locked", themes[player.theme] ? themes[player.theme][5] : "#bf8f8f")
}

function switchTheme() {
	player.theme = themes[+player.theme + 1] ? +player.theme + 1 : 0
	changeTheme()
}

function getThemeName() {
	return player.theme && themes[player.theme] ? themes[player.theme][0] : "Default"
}