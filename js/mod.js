let modInfo = {
	name: "The Prestreestuck",
	id: "treestuck",
	author: "ducdat0507",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

let flavorTitles = [
	"NOW WITH TROLL LANGUAGE SUPPORT",
	"P.S. YOU CAN USE COPY AND PASTE TO SEE THE TRANSLATIONS. I AM JUST SAYING",
	"WAIT THIS ISNT HOMESTUCK WHERE IS MY JHON EGBRET",
	"COOL AND NEW INCREMENTAL GAME",
	"COOL AND NEW PRESTIGE TREE",
	"I NEVER SAID IT WAS AN IDLE GAME",
	"DUE TO THE NATURE OF HOMESTUCK, SUFFERING IS MANDATORY",
	"NO, IT IS NOT CANON YET",
	"BUT WHY THOUGH",
	"READ HOMESTUCK INSTEAD",
	"UNDEFINED"
]
let flavorTitle = flavorTitles[Math.floor(Math.random() * flavorTitles.length)]

// Set your version in num and name
let VERSION = {
	num: "0.0.2.1",
	name: "This is stupid^2",
}

let changelog = `<h1>Changelog</h1><br>
	<h5 style="opacity:0.5">Tip: Click on a spoiler to reveal it.</h5><br>
	<h3>v0.0.2.1</h3><br>
		Fixed some bugs, here and there.<br>
		Dropped the alpha thingy. This game is still in the development stage, it's just me wanting a shorter version name.<br>
	<br>
	<h2>v0.0.2</h2><br>
		<h5 style="opacity:0.5">- This is stupid^2 -</h5>
		Added six more aspect layers. SIX OF THEM.<br>
		Rebalanced <spoiler>Rage Challenges</spoiler> and added more <spoiler>Hope Upgrades</spoiler>.<br>
		Added a tip in the Time layer that you can hold T to temporarily automate absorbing Time Power.<br>
		Added an order of magnitude per second display for large numbers.<br>
		Fixed some bugs, here and there.<br>
		Also added random title text in the info tab.<br>
		Also added a link to the TPT Modfinder, in case you're alreay sick of this, or Homestuck altogether.<br>
		Also added some metadata.<br>
		Also added a favicon.<br>
	<br>
	<h2>v0.0.1</h2><br>
		<h5 style="opacity:0.5">- This is stupid -</h5>
		The beginning. Nothing is really changed at this point because this is the first version... <i>ever.</i><br>
`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	for (var a = 11; a <= 16; a++) gain = gain.mul(tmp.aspTime.buyables[a].effect)

	if (hasUpgrade("aspTime", 11)) gain = gain.mul(tmp.aspTime.upgrades[11].effect)
	if (hasUpgrade("aspTime", 12)) gain = gain.mul(tmp.aspTime.upgrades[12].effect)

	if (hasUpgrade("aspSpace", 11)) gain = gain.mul(tmp.aspSpace.upgrades[11].effect)
	if (hasUpgrade("aspSpace", 13)) gain = gain.mul(tmp.aspSpace.upgrades[13].effect)
	if (hasUpgrade("aspSpace", 23)) gain = gain.mul(tmp.aspSpace.upgrades[23].effect)

	if (hasUpgrade("aspMind", 11)) gain = gain.mul(tmp.aspMind.upgrades[11].effect)
	if (hasUpgrade("aspMind", 22)) gain = gain.mul(tmp.aspMind.upgrades[22].effect)

	if (hasUpgrade("aspHope", 21)) gain = gain.mul(tmp.aspHope.upgrades[21].effect)
	if (hasUpgrade("aspHope", 34)) gain = gain.mul(tmp.aspHope.upgrades[34].effect)
	if (hasUpgrade("aspHope", 51)) gain = gain.mul(tmp.aspHope.upgrades[51].effect)
	if (hasUpgrade("aspHope", 63)) gain = gain.mul(tmp.aspHope.upgrades[63].effect)

	gain = gain.mul(tmp.aspHeart.effect.pointBoost)
	gain = gain.mul(tmp.aspMind.effect.pointBoost)
	gain = gain.mul(tmp.aspLife.effect.pointBoost)
	gain = gain.mul(tmp.aspDoom.effect.pointBoost)

	gain = gain.mul(tmp.aspLight.buyables[11].effect)

	if (getBuyableAmount("aspLife", 11).gt(0)) gain = gain.mul(tmp.aspLife.buyables[11].effect)
	if (challengeCompletions("aspDoom", 11) >= 8) gain = gain.pow(1.05)

	if (inChallenge("aspDoom", 13)) gain = gain.tetrate(0.1)
	if (inChallenge("aspRage", 11)) gain = applyPolynomialSoftcap(gain, 1e20, challengeCompletions("aspRage", 11) + 2)
	if (inChallenge("aspRage", 14)) gain = gain.tetrate(1 - (challengeCompletions("aspRage", 14) + 1) / 20)

	if (Number.isNaN(gain.mag)) gain = new Decimal(0)

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	act: 0,
	phaseTimer: 0,
}}

// Display extra things at the top of the page
var displayThings = [
	() => `<h2><br/>Act 0</h2><br/>- Genesis -`
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}