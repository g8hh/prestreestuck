let modInfo = {
	name: "The Prestreestuck",
	id: "treestuck",
	author: "ducdat0507",
	pointsName: "points",
	discordName: "The Prestreestuck Server",
	discordLink: "https://discord.gg/fHcWmmprGm",
	initialStartPoints: new Decimal(act.startsWith("0") ? 10 : 0), // Used for hard resets and new players
	
	offlineLimit: (+act + 1) || 1,  // In hours
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
	"UNDEFINED",
	"PLAY THIS GAME IN TRICKSTER THEME, I DARE YOU",
	"FUN FACT: THE PERSON WHO MADE THE FIVE HOUR MEME IS A HOMESTUCK",
]
let flavorTitle = flavorTitles[Math.floor(Math.random() * flavorTitles.length)]

// Set your version in num and name
let VERSION = {
	num: "0.1.1.2.6",
	name: "The Great Split",
}

let changelog = `<h1>&nbsp;&nbsp;&nbsp;&nbsp;The Changelog<h1 style="opacity:0.05">(ue)</h1></h1><br>
	<h5 style="opacity:0.5">Tip: Click and hold on a spoiler to reveal it.</h5><br>
	<h3>v0.1.1.2.6</h3><br>
		Added a save bank. Now you don't need to painfully grind the game again if you somehow magically delete your browser cookies.<br>
		Adjusted some of <spoiler>Breath / Blood</spoiler> prices.<br>
		Settings are now persistent between saves.<br>
		Added a toggle to reduce background animations because apparently some of you guys hate it.<br>
		Added a button to close all popups.<br>
		Tweaked save preview text.<br>
		Other visual adjustments.<br>
	<br>
	<h3>v0.1.1.2.5</h3><br>
		Challenges now only say "Completed" when you reached the completion limit.<br>
		Darkened locked upgrades to make it distinctable from <spoiler>Life's</spoiler> color.<br>
		Added shadows to main display text.<br>
		Added modals for import save and hard reset.<br>
		Miscellaneous bug fixes.<br>
	<br>
	<h3>v0.1.1.2.4</h3><br>
		Fixed <spoiler>Meta-Faucet Upgrades</spoiler> calculating the wrong results.<br>
	<br>
	<h3>v0.1.1.2.3</h3><br>
		Fixed yet another NaN bug (hopefully).<br>
	<br>
	<h3>v0.1.1.2.2</h3><br>
		Fixed another NaN bug (hopefully).<br>
	<br>
	<h3>v0.1.1.2.1</h3><br>
		Fixed <spoiler>Meta</spoiler> unable to load.<br>
	<br>
	<h3>v0.1.1.2</h3><br>
		Fixed some NaN bugs.<br>
		Last layer no longer (intentionally) NaNs.<br>
		Improved NaN catching system. The game now tells exactly where the NaN is instead of just keep saying 'effect' or something like that.<br>
	<br>
	<h3>v0.1.1.1</h3><br>
		Reduced some of the <spoiler>Sacrifice</spoiler> milestone requirements even more.<br>
		Adjusted the number formatting.<br>
	<br>
	<h2>v0.1.1</h2><br>
		<h5 style="opacity:0.5">- The Great Split -</h5>
		Attepted to split Act 0 into 3 different stages to improve performance.<br>
		Migrated to The Modding Tree v2.5.2.1. The update everyone was waiting for!<br>
		Reduced some of the <spoiler>Sacrifice</spoiler> milestone requirements.<br>
		Fixed hard reset not working properly (if I don't want to say at all).<br>
		Improved readability (sort of).<br>
	<br>
	<h3>v0.1.0.3</h3><br>
		Redesigned the info tab. Discord links now showing member counts.<br>
		Fixed side options sometimes getting hidden on Act 1.<br>
		Added miscellaneous features.<br>
	<br>
	<h3>v0.1.0.2</h3><br>
		Fixed selecting act 0 in the new save dialog directs you to the opening screen.<br>
	<br>
	<h3>v0.1.0.1</h3><br>
		Added opening screen.<br>
	<br>
	<h2>v0.1.0</h2><br>
		<h5 style="opacity:0.5">- MS-Paint Fan Incremental -</h5>
		<i>ACT 1 POG</i><br>
		Fixed black hole eras lasting 1e40 years instead of 1e100.<br>
	<br>
	<h3>v0.0.3.8.6.3</h3><br>
		Fixed <spoiler>Limitation reset</spoiler> resetting <spoiler>Meta-Meta-Faucets</spoiler> even if you have 50+ of them.<br>
		Fixed <spoiler>Meta-Meta-Faucet</spoiler> #1000 effect showing as #100.<br>
		Fixed <spoiler>Sburb Sacrifice Milestones</spoiler> showing sooner than intended.<br>
	<br>
	<h2>v0.0.3.8.6.2</h2><br>
		<h5 style="opacity:0.5">- A Broken Game -</h5>
		End of Act 0?<br>
		This game is definitely very broken by now<br>
		(If you see a bug in the <spoiler>Meta</spoiler> layer, it is probably intentional)<br>
		<spoiler>(I'm definitely going to question my design decisions now)</spoiler><br>
	<br>
	<h3>v0.0.3.8.6.1</h3><br>
		Fixed <spoiler>Sacrifice Milestones</spoiler> unlocking earlier than intended.<br>
	<br>
	<h3>v0.0.3.8.6</h3><br>
		Added <spoiler>Eternity</spoiler> and <spoiler>Sacrifice</spoiler> for the <spoiler>Meta</spoiler> layer.<br>
		Added a multiple saving system. And hey, the modal from The Dynas Tree is back!
	<br>
	<h3>v0.0.3.8.5</h3><br>
		Fixed the <spoiler>Meta-Meta Upgrade</spoiler> effect being too overpowered early game.<br>
	<br>
	<h3>v0.0.3.8.4</h3><br>
		Fixed setiings tab being invisible.<br>
	<br>
	<h3>v0.0.3.8.3</h3><br>
		Fixed overflow upgrades being invisible.<br>
		Changes "themes" into "color schemes" and add a new one.<br>
	<br>
	<h3>v0.0.3.8.2</h3><br>
		Fixed some hotkeys triggerable when they aren't supposed to.<br>
	<br>
	<h3>v0.0.3.8.1</h3><br>
		Fixed some typos.<br>
	<br>
	<h2>v0.0.3.8</h2><br>
		<h5 style="opacity:0.5">- The Game Continues -</h5>
		ACT 0 CONTINUES GODDAMNIT AAAAAAAAAAASADASHFASFHKAHLKSJ<br>
		Added 1 new layer.<br>
		Added... a few more things.<br>
		Migrated to The Modding Tree 2.π.<br>
	<br>
	<h3>v0.0.3.7.1</h3><br>
		Added <spoiler>Compact Mode for Sign Viewers</spoiler>.<br>
    <br>
	<h2>v0.0.3.7</h2><br>
		<h5 style="opacity:0.5">- End of Act 0? -</h5>
		The game now has a definitive "end", or does it?<br>
		More <spoiler>Skaia upgrades</spoiler> becuase why not?<br>
		Even more massive slowdowns.<br>
		Even more bugs.<br>
	<br>
	<h3>v0.0.3.6.1 ~ v0.0.3.6.4</h3><br>
		Miscellaneous bug fixes that I don't even know what they are anymore.<br>
    <br>
	<h2>v0.0.3.6</h2><br>
		<h5 style="opacity:0.5">- Massive Slowdown -</h5>
		Added two new layers, each has over 144(!) new things that you can buy. Gosh that will be very laggy.<br>
		More <spoiler>Skaia upgrades</spoiler> becuase why not?<br>
		Decided not to bump the endgame because I accidently bumped it too much. Content should span until you get your first <spoiler>Gold sign</spoiler> in the new two layers.<br>
		<h5 style="opacity:0.5"><br/><spoiler>(also the title of the new 244 "things" might not be trully accurate to their actual Homestuck-canony-thingy names so i guess you can report it to me if you want to fix something idk oh well)</spoiler></h5>
	<br>
	<h3>v0.0.3.5</h3><br>
		Added more <spoiler>Skaia upgrades</spoiler>.<br>
		Bumped endgame to ee16,000,000 (note: the <spoiler>Unlock Prospit/Derse</spoiler> upgrades currently does nothing).<br>
		Note: your <spoiler>Aspect and Class layers</spoiler> will be reset if you have more than ee100,000 points due to inflation. You still have your ee100,000 points though, so climbing back shouldn't be a problem.<br>
    <br>
	<h3>v0.0.3.4</h3><br>
		Rebalanced the <spoiler>Class Points</spoiler> section.<br>
		Bumped the endgame requrements to ee81,000 points.<br>
    <br>
	<h3>v0.0.3.3</h3><br>
		Fixed having two <spoiler>Muse Powers</spoiler>.<br>
		Used <span style="font-family:'Courier Prime', monospace">Courier Prime</span> as a fallback font if you somehow don't have Courier New installed on your device.<br>
    <br>
	<h2>v0.0.3.2</h3><br>
		<h5 style="opacity:0.5">- I was right -</h5>
		One new layer. Updated metadata. <spoiler>Skaia</spoiler> upgrades. Bumped endgame to ee51,000 points.<br>
		Note: This update changed the internal for the <spoiler>meta aspect layer</spoiler> to make more consistency with the other <spoiler>meta layers</spoiler>, that means it has to be reseted. You should be able to climb back to where you originally was quick.<br>
	<br>
	<h3>v0.0.3.1</h3><br>
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

let winText = `Congratulations! You've made it to the game's end!... or did you?`

var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints(){
	return true
}

function getPointGen() {

	// I'm so funny
	if (act == "omega") {
		player.act = "-1"
		save()
		window.location = "https://mspfa.com/?s=16414&p=1"
	}

	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if (act == "-1") {
		clearInterval(interval);
		openStartModal();
	} else if (act == "0.0") {
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
	} else if (act == "0.1") {
		gain = gain.mul(tmp.metaAspects.effect.pointBoost)
	} else if (act == "0.2") {
		if (player[this.layer].resetTime < Number.MAX_VALUE) gain = gain.mul(tmp.metaMeta.effect.pointBoost)
	} else if (act == 1) {
		gain = new Decimal(0)
	}


	if (Number.isNaN(gain.mag)) gain = new Decimal(0)

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	act: "-1",
	phaseTimer: 0,
}}

// Display extra things at the top of the page
var displayThings = [
	function () {
		var rem = 0
		for (lys in LAYERS) {
			if (player[LAYERS[lys]] !== undefined && (!player[LAYERS[lys]].unlocked || (!tmp[LAYERS[lys]].layerShown && player.act == "0.0" && !inChallenge("aspDoom", 12)))) rem++
		}
		if (act == "0.0") rem += 5;
		else if (act == "0.1") rem += 1;
		var acts = {
			'-1': ["", "", ""],
			"0.0": ["Act 0", "Genesis", rem + " layers remaining"],
			"0.1": ["Act 0", "Genesis", rem + " layers remaining"],
			"0.2": ["Act 0", "Genesis", "The end is nigh..."],
			1: ["End of Act 0??", "-", "Coming soon..."],
			omega: ["Act Ω", "?????", "???????????"],
		}
		return `<h2><br/>${acts[player.act][0]}</h2><br/>- ${acts[player.act][1]} -<br/><h5 style='margin-top:5px;opacity:0.5'><i>(${acts[player.act][2]})</i></h5>`
	}
]

// Determines when the game "ends"
function isEndgame() {
	return false // player.act == 1
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion) {
	console.log("Loaded old version from" + oldVersion)
	if (player.tab == "aspects") player.tab = "metaAspects";
	if (oldVersion <= "0.1.0.3") {
		if (act == 0) {
			player.version = VERSION.num
			if (hasUpgrade("skaia", 12)) switchAct("0.1", false)
			else if (hasUpgrade("skaia", 13) || hasUpgrade("skaia", 14)) switchAct("0.2", false)
			else switchAct("0.0", false)
		}
    }
	if (oldVersion <= "0.0.3.4" && player.points.gte("ee100000")) {
		player.points = new Decimal("ee100000");
		player.skaia.points = new Decimal(0);
		player.skaia.level = new Decimal(1);
		layerDataReset("metaAspects");
		layerDataReset("metaClasses");
    }
}