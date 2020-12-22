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

// Set your version in num and name
let VERSION = {
	num: "0.0.1 alpha",
	name: "This is stupid",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0.1 alpha</h3><br>
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

	gain = gain.mul(tmp.aspHeart.effect.pointBoost)
	gain = gain.mul(tmp.aspMind.effect.pointBoost)

	if (inChallenge("aspRage", 11)) gain = applyPolynomialSoftcap(gain, 1e20, challengeCompletions("aspRage", 11) + 2)

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
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