
// ************ Save stuff ************

var meta = {
	currentSave: "",
	act: 0,
	saves: {},
}

function save(saveId) {
	if (!saveId) saveId = player.saveId

	meta.currentSave = player.saveId
	meta.act = player.act
	
	meta.saves[player.saveId].act = player.act
	meta.saves[player.saveId].desc = (() => {
		var ret = format(player.points) + " points"
		return ret
	})()

	localStorage.setItem("pts_" + saveId, btoa(JSON.stringify(player)))
	localStorage.setItem(modInfo.id, btoa(JSON.stringify(meta)))
}

function startPlayerBase() {
	return {
		tab: layoutInfo.startTab,
		navTab: (layoutInfo.showTree ? "tree-tab" : "none"),
		saveId: Date.now(),
		time: Date.now(),
		autosave: true,
		notify: {},
		msDisplay: "always",
		offlineProd: true,
		versionType: modInfo.id,
		version: VERSION.num,
		beta: VERSION.beta,
		timePlayed: 0,
		keepGoing: false,
		hasNaN: false,
		hideChallenges: false,
		splitMode: "flexible",
		showStory: true,
		points: modInfo.initialStartPoints,
		subtabs: {},
		lastSafeTab: (layoutInfo.showTree ? "none" : layoutInfo.startTab)
	}
}

function getStartPlayer() {
	playerdata = startPlayerBase()
	
	if (addedPlayerData) {
		extradata = addedPlayerData()
		for (thing in extradata)
			playerdata[thing] = extradata[thing]
	}

	playerdata.infoboxes = {}
	for (layer in layers){
		playerdata[layer] = getStartLayerData(layer)

		if (layers[layer].tabFormat && !Array.isArray(layers[layer].tabFormat)) {
			playerdata.subtabs[layer] = {}
			playerdata.subtabs[layer].mainTabs = Object.keys(layers[layer].tabFormat)[0]
		}
		if (layers[layer].microtabs) {
			if (playerdata.subtabs[layer] == undefined) playerdata.subtabs[layer] = {}
			for (item in layers[layer].microtabs)
			playerdata.subtabs[layer][item] = Object.keys(layers[layer].microtabs[item])[0]
		}
		if (layers[layer].infoboxes) {
			if (playerdata.infoboxes[layer] == undefined) playerdata.infoboxes[layer] = {}
			for (item in layers[layer].infoboxes)
				playerdata.infoboxes[layer][item] = false
		}
	
	}
	return playerdata
}

function getStartLayerData(layer){
	layerdata = {}
	if (layers[layer].startData) 
		layerdata = layers[layer].startData()

	if (layerdata.unlocked === undefined) layerdata.unlocked = true
	if (layerdata.total === undefined) layerdata.total = new Decimal(0)
	if (layerdata.best === undefined) layerdata.best = new Decimal(0)
	if (layerdata.resetTime === undefined) layerdata.resetTime = 0

	layerdata.buyables = getStartBuyables(layer)
	if(layerdata.clickables == undefined) layerdata.clickables = getStartClickables(layer)
	layerdata.spentOnBuyables = new Decimal(0)
	layerdata.upgrades = []
	layerdata.milestones = []
	layerdata.achievements = []
	layerdata.challenges = getStartChallenges(layer)
	layerdata.story = getStartStory(layer)
	return layerdata
}


function getStartBuyables(layer){
	let data = {}
	if (layers[layer].buyables) {
		for (id in layers[layer].buyables)
			if (isPlainObject(layers[layer].buyables[id]))
				data[id] = new Decimal(0)
	}
	return data
}

function getStartClickables(layer){
	let data = {}
	if (layers[layer].clickables) {
		for (id in layers[layer].clickables)
			if (isPlainObject(layers[layer].clickables[id]))
				data[id] = ""
	}
	return data
}

function getStartChallenges(layer){
	let data = {}
	if (layers[layer].challenges) {
		for (id in layers[layer].challenges)
			if (isPlainObject(layers[layer].challenges[id]))
				data[id] = 0
	}
	return data
}

function getStartStory(layer){
	let data = {}
	if (layers[layer].story) {
		data = {
			page: 1
		}
	}
	return data
}

function fixSave() {
	defaultData = getStartPlayer()
	fixData(defaultData, player)

	for(layer in layers)
	{
		if (player[layer].best !== undefined) player[layer].best = new Decimal (player[layer].best)
		if (player[layer].total !== undefined) player[layer].total = new Decimal (player[layer].total)

		if (layers[layer].tabFormat && !Array.isArray(layers[layer].tabFormat)) {
		
			if(!Object.keys(layers[layer].tabFormat).includes(player.subtabs[layer].mainTabs)) player.subtabs[layer].mainTabs = Object.keys(layers[layer].tabFormat)[0]
		}
		if (layers[layer].microtabs) {
			for (item in layers[layer].microtabs)
				if(!Object.keys(layers[layer].microtabs[item]).includes(player.subtabs[layer][item])) player.subtabs[layer][item] = Object.keys(layers[layer].microtabs[item])[0]
		}
	}
}

function fixData(defaultData, newData) {
	for (item in defaultData){
		if (defaultData[item] == null) {
			if (newData[item] === undefined)
				newData[item] = null
		}
		else if (Array.isArray(defaultData[item])) {
			if (newData[item] === undefined)
				newData[item] = defaultData[item]
			else
				fixData(defaultData[item], newData[item])
		}
		else if (defaultData[item] instanceof Decimal) { // Convert to Decimal
			if (newData[item] === undefined)
				newData[item] = defaultData[item]
			else
				newData[item] = new Decimal(newData[item])
		}
		else if ((!!defaultData[item]) && (typeof defaultData[item] === "object")) {
			if (newData[item] === undefined || (typeof defaultData[item] !== "object"))
				newData[item] = defaultData[item]
			else
				fixData(defaultData[item], newData[item])
		}
		else {
			if (newData[item] === undefined)
				newData[item] = defaultData[item]
		}
	}	
}

function load(saveId) {
	if (saveId) {
		let get = localStorage.getItem("pts_" + saveId);
		if (get===null || get===undefined || saveId==="new") player = getStartPlayer()
		else player = Object.assign(getStartPlayer(), JSON.parse(atob(get)))
		player.saveId = saveId == "new" ? Date.now() : saveId
		fixSave()

		if (player.offlineProd) {
			if (player.offTime === undefined) player.offTime = { remain: 0 }
			player.offTime.remain += (Date.now() - player.time) / 1000
		}
		player.time = Date.now();
		versionCheck();
		changeTheme();
		changeTreeQuality();
		updateLayers()
		setupModInfo()

		setupTemp();
		updateTemp();
		updateTemp();
		loadVue();
	} else {
		let get = localStorage.getItem(modInfo.id);
		if (get===null || get===undefined) {
			load("new")
			meta.currentSave = player.saveId
			meta.saves[player.saveId] = {
				name: "Default"
			}
		}
		let data = JSON.parse(atob(get))
		if (data.points) {
			player = Object.assign(getStartPlayer(), data)
			meta.currentSave = player.saveId
			meta.saves[player.saveId] = {
				name: "Genesis"
			}
			save(player.saveId)
			load(player.saveId)
		}
		if (data.currentSave !== undefined) {
			meta = Object.assign(meta, data)
			load(meta.currentSave)
		}
	}
}

function setupModInfo() {
	modInfo.changelog = changelog
	modInfo.winText = winText ? winText : `Congratulations! You have reached the end and beaten this game, but for now...`

}

function fixNaNs() {
	NaNcheck(player)
}

function NaNcheck(data) {
	for (item in data){
		if (data[item] == null) {
		}
		else if (Array.isArray(data[item])) {
			NaNcheck(data[item])
		}
		else if (data[item] !== data[item] || data[item] === decimalNaN){
			if (NaNalert === true || confirm ("Invalid value found in player, named '" + item + "'. Please let the creator of this mod know! Would you like to try to auto-fix the save and keep going?")){
				NaNalert = true
				data[item] = (data[item] !== data[item] ? 0 : decimalZero)
			}
			else {
				clearInterval(interval);
				player.autosave = false;
				NaNalert = true;
			}
		}
		else if (data[item] instanceof Decimal) { // Convert to Decimal
		}
		else if ((!!data[item]) && (data[item].constructor === Object)) {
			NaNcheck(data[item])
		}
	}	
}


function exportSave() {
	let str = btoa(JSON.stringify(player))
	
	const el = document.createElement("textarea");
	el.value = str;
	document.body.appendChild(el);
	el.select();
    el.setSelectionRange(0, 999999);
	document.execCommand("copy");
	document.body.removeChild(el);
}

function importSave(imported=undefined, forced=false) {
	if (imported===undefined) imported = prompt("Paste your save here")
	try {
		tempPlr = Object.assign(getStartPlayer(), JSON.parse(atob(imported)))
		if(tempPlr.versionType != modInfo.id && !forced && !confirm("This save appears to be for a different mod! Are you sure you want to import?")) // Wrong save (use "Forced" to force it to accept.)
			return
		tempPlr.saveId = player.saveId
		player = tempPlr;
		player.versionType = modInfo.id
		fixSave()	
		versionCheck()
		save()
		window.location.reload()
	} catch(e) {
		return;
	}
}

function versionCheck() {
	let setVersion = true
	
	if (player.versionType===undefined||player.version===undefined) {
		player.versionType = modInfo.id
		player.version = 0
	}
	
	if (setVersion) {
		if (player.versionType == modInfo.id && VERSION.num > player.version) {
			player.keepGoing = false
			if (fixOldSave) fixOldSave(player.version)
		} 
		player.versionType = getStartPlayer().versionType
		player.version = VERSION.num
		player.beta = VERSION.beta
	}
}

var saveInterval = setInterval(function() {
	if (player===undefined) return;
	if (gameEnded&&!player.keepGoing) return;
	if (player.autosave) save();
}, 5000)

function openSaveModal() {
	modal.show(
		"",
		(() => {
			var html = ""
			var acts = {
				0: ["Act 0", "Genesis"],
				1: ["Act 1", "Incrementalism"],
				omega: ["Act Ω", "?????"],
			}
			for (var save in meta.saves) {
				html += `
				<div class="saveState" style="${save == meta.currentSave ? "box-shadow: 0 0 15px var(--color)" : ""}">
					<input type="text" 
						value="${meta.saves[save].name}" 
						placeholder="Untitled Save" 
						id="save${save}" onchange="changeSaveName(${save})"><br/>
					<span style='font-size:14px'>
						Act ${meta.saves[save].act} - ${acts[meta.saves[save].act][1]}<br/>
						${meta.saves[save].desc}<br/>
					</span>
					<span style='font-size:12px;opacity:0.5'>
						#${save}<br/>
					</span>
					<span style='font-size:3px;'>
						<br/>
					</span>
					
					${save == meta.currentSave ? `
						<button disabled="true"> Loaded </button>
					` : `
						<button onclick='changeSave(${save})'> Load </button>
						<button onclick='openDeleteSaveModal(${save})'> Delete </button>
					`}
				</div>
				`
			}
			html += `
			    <button style="margin:5px" onclick='openCreateSaveModal()'> New Save </span>
			`
			return html
		})()
	)
}

function changeSaveName(id) {
	console.log(id)
	meta.saves[id].name = document.getElementById("save" + id).value
}

function openCreateSaveModal() {
	modal.show(
		"Create New Save",
		`
			Enter your new save's name:<br/>
			<input type="text" id="newSaveNameInput" style="margin:5px 0;width:400px;"
				placeholder="New Save" 
				id="save${save}" onchange="changeSaveName(${save})">
			<br/><br/>Start from:
			<div class="saveState" style='cursor:pointer;margin-top:5px' onclick='createSave(document.getElementById("newSaveNameInput").value, 0); modal.hide()'>
			    <h3 style="font-size:21px">Act 0</h3><br/>
				<span style='font-size:14px'>Genesis</span>
			</div>
			<div class="saveState" style='cursor:pointer' onclick='createSave(document.getElementById("newSaveNameInput").value, 1); modal.hide()'>
			    <h3 style="font-size:21px">Act 1</h3><br/>
				<span style='font-size:14px'>MS-Paint Incremental</span>
			</div>
			<button onclick='openSaveModal()'> Nevermind, return </span>
		`,
		""
	)
}

function createSave(name, targetAct) {
	clearInterval(interval)
	load("new")
	player.act = targetAct || 0
	meta.currentSave = player.saveId
	meta.saves[player.saveId] = {
		name: name || "New Save",
		act: targetAct || 0,
		desc: "0 points",
	}
	save();
	window.location.reload();
}

function openDeleteSaveModal(id) {
	modal.show(
		"Delete “" + (meta.saves[id].name || "Untitled Save") + "”?",
		`
			You will lose everything that's in this save!<br/>
			This process is irreversible!<br/>
			<button style="margin:5px" onclick='deleteSave(${id}); openSaveModal()'> Get rid of it! </span>
			<button onclick='openSaveModal()'> Nevermind, go back </span>
		`,
		""
	)
}

function deleteSave(id) {
	localStorage.removeItem("pts_" + id);
	delete meta.saves[id]
}

function changeSave(id) {
	meta.currentSave = id
	meta.act = meta.saves[id].act
	localStorage.setItem(modInfo.id, btoa(JSON.stringify(meta)))
	window.location.reload();
}

function switchAct(act) {
	player = {
		...getStartPlayer(),
		
		timePlayed: player.timePlayed,
		saveId: player.saveId,
		act: act,
	}
	save();
	window.location.reload()
}
