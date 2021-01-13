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
	num: "0.0.3.1",
	name: "Another update yay",
}

let changelog = `<h1>Changelog</h1><br>
	<h5 style="opacity:0.5">Tip: Click on a spoiler to reveal it.</h5><br>
	<h2>v0.0.3.1</h2><br>
		Reduced the requirements for the meta layer.<br>
	<br>
	<h2>v0.0.3</h2><br>
		<h5 style="opacity:0.5">- Another update yay -</h5>
		Added a meta aspect layer that mock-ups the previous twelves. You can access it when you completed all of the 12 aspect layers mentioned earlier.<br>
		(also updated the modfinder to give it a new look. And yes, they are in the same repsitory so...)<br>
	<br>
	<h3>v0.0.2.5</h3><br>
		Adjusted the progress text.<br>
		Fixed <spoiler>Life Power</spoiler> going below zero anymore (for real this time).<br>
	<br>
	<h3>v0.0.2.4</h3><br>
		Added a text that says how many layers there are left to unlock in the current act or until current endgame, or the current goal/endgame if there is none remaining.<br>
		<spoiler>Life Power</spoiler> should no longer be able to go below zero anymore. This fixes some softlocks and NaN bugs.<br>
		Fixed the <spoiler>BEGIN THE PLAN.</spoiler> upgrade being buyable before 22 <spoiler>Skaia levels</spoiler> despite being grayed out.<br>
		Fixed the 20 <spoiler>Void Points</spoiler> milestone having the effect of the 1,000 <spoiler>Void Points</spoiler> milestone.<br>
		Fixed the text of some places.<br>
	<br>
	<h3>v0.0.2.3</h3><br>
		Actually updated the endgame popup (finally).<br>
	<br>
	<h3>v0.0.2.2</h3><br>
		Added a system that detects inconsistant version to prevent errors (kind of).<br>
	<br>
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
	<br>
	<h5 style="font-family:'Comic Sans MS',cursive;font-size:10px;color:#f400ec">honestly i want to add a sbahj theme but the current theme api is too strict for that<br/>oh well</h5>
	<br><br><br>
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

	if (!hasUpgrade("skaia", 12)) {
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
	} else {
		gain = gain.mul(tmp.aspects.effect.pointBoost)
    }


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
	function () {
		var rem = 0
		for (lys in LAYERS) {
			if (player[LAYERS[lys]] !== undefined && (!player[LAYERS[lys]].unlocked || (!tmp[LAYERS[lys]].layerShown && !inChallenge("aspDoom", 12)))) rem++
		}
		if (hasUpgrade("skaia", 12)) rem -= 12;
		var acts = [
			["Act 0", "Genesis", rem == 0 ? "Current endgame: " + format("ee220") + " points" : rem + " layers remaining"]
		]
		return `<h2><br/>${acts[player.act][0]}</h2><br/>- ${acts[player.act][1]} -<br/><h5 style='margin-top:5px;opacity:0.5'><i>(${acts[player.act][2]})</i></h5>`
	}
]

// Determines when the game "ends"
function isEndgame() {
	return hasUpgrade("skaia", 12) && player.points.gte("ee220")
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