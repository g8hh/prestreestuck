var systemVer = "0.1.0.2";

var systemComponents = {
	'tab-buttons': {
		props: ['layer', 'data', 'name'],
		template: `
			<div class="upgRow">
				<div v-for="tab in Object.keys(data)">
					<button v-if="data[tab].unlocked == undefined || data[tab].unlocked" v-bind:class="{tabButton: true, notify: subtabShouldNotify(layer, name, tab), resetNotify: subtabResetNotify(layer, name, tab)}" v-bind:style="[{'border-color': tmp[layer].color}, tmp[layer].componentStyles['tab-button'], data[tab].buttonStyle]"
						v-on:click="function(){player.subtabs[layer][name] = tab; needCanvasUpdate = true;}">{{tab}}</button>
				</div>
			</div>
		`
	},

	'tree-node': {
		props: ['layer', 'abb', 'size'],
		template: `
		<button v-if="nodeShown(layer)"
			v-bind:id="layer"
			v-on:click="function() {
				if(tmp[layer].isLayer) {showTab(layer)}
				else {run(layers[layer].onClick, layers[layer])}
			}"

			v-bind:tooltip="(tmp[layer].tooltip == '') ? false : (tmp[layer].isLayer) ? (
				player[layer].unlocked ? (tmp[layer].tooltip ? tmp[layer].tooltip : formatWhole(player[layer].points) + ' ' + tmp[layer].resource)
				: (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : '达到 ' + formatWhole(tmp[layer].requires) + ' ' + tmp[layer].baseResource + ' 去解锁 (你有 ' + formatWhole(tmp[layer].baseAmount) + ' ' + tmp[layer].baseResource + ')')
			)
			: (
				tmp[layer].canClick ? (tmp[layer].tooltip ? tmp[layer].tooltip : 'I am a button!')
				: (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : 'I am a button!')
			)
			"
			v-bind:class="{
				treeNode: tmp[layer].isLayer,
				treeButton: !tmp[layer].isLayer,
				smallNode: size == 'small',
				[layer]: true,
				ghost: tmp[layer].layerShown == 'ghost',
				hidden: !tmp[layer].layerShown,
				locked: tmp[layer].isLayer ? !(player[layer].unlocked || tmp[layer].canReset) : !(tmp[layer].canClick),
				notify: tmp[layer].notify,
				resetNotify: tmp[layer].prestigeNotify,
				can: ((player[layer].unlocked || tmp[layer].isLayer) && tmp[layer].isLayer) || (!tmp[layer].isLayer && tmp[layer].canClick),
			}"
			v-bind:style="tmp[layer].computedNodeStyle" v-html="(abb !== '' && tmp[layer].image === undefined) ? abb : '&nbsp;'">
			} : {}, tmp[layer].nodeStyle]">
			{{(abb !== '' ? abb : '&nbsp;')}}
			} : {}, tmp[layer].nodeStyle]">
			{{(abb !== '' ? abb : '&nbsp;')}}
			} : {}, tmp[layer].nodeStyle]">
			{{(abb !== '' ? abb : '&nbsp;')}}
			} : {}, tmp[layer].nodeStyle]">
			{{(abb !== '' ? abb : '&nbsp;')}}
			} : {}, tmp[layer].nodeStyle]">
			{{(abb !== '' ? abb : '&nbsp;')}}
			} : {}, tmp[layer].nodeStyle]">
			{{(abb !== '' ? abb : '&nbsp;')}}
			} : {}, tmp[layer].nodeStyle]">
			{{(abb !== '' ? abb : '&nbsp;')}}
		</button>
		`
	},

	
	'layer-tab': {
		props: ['layer', 'back', 'spacing', 'embedded'],
		template: `<div v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]">
		<div v-if="back && (layoutInfo.showTree() || ['info-tab', 'options-tab'].includes(layer))"><button v-bind:class="back == 'big' ? 'other-back' : 'back'" :style="{left: layoutInfo.showTree() ? '' : '8px'}" v-on:click="layoutInfo.showTree() ? goBack() : player.tab = 'player1'">←</button></div>
		<div v-if="!tmp[layer].tabFormat">
			<div v-if="spacing" v-bind:style="{'height': spacing}" :key="this.$vnode.key + '-spacing'"></div>
			<info-box v-if="tmp[layer].infoboxes" :layer="layer" :data="Object.keys(tmp[layer].infoboxes)[0]":key="this.$vnode.key + '-info'"></info-box>
			<main-display v-bind:style="tmp[layer].componentStyles['main-display']" :layer="layer"></main-display>
			<div v-if="tmp[layer].type !== 'none'">
				<prestige-button v-bind:style="tmp[layer].componentStyles['prestige-button']" :layer="layer"></prestige-button>
			</div>
			<resource-display v-bind:style="tmp[layer].componentStyles['resource-display']" :layer="layer"></resource-display>
			<milestones v-bind:style="tmp[layer].componentStyles.milestones" :layer="layer"></milestones>
			<div v-if="Array.isArray(tmp[layer].midsection)">
				<column :layer="layer" :data="tmp[layer].midsection" :key="this.$vnode.key + '-mid'"></column>
			</div>
			<clickables v-bind:style="tmp[layer].componentStyles['clickables']" :layer="layer"></clickables>
			<buyables v-bind:style="tmp[layer].componentStyles.buyables" :layer="layer"></buyables>
			<upgrades v-bind:style="tmp[layer].componentStyles['upgrades']" :layer="layer"></upgrades>
			<challenges v-bind:style="tmp[layer].componentStyles['challenges']" :layer="layer"></challenges>
			<achievements v-bind:style="tmp[layer].componentStyles.achievements" :layer="layer"></achievements>
			<br><br>
		</div>
		<div v-if="tmp[layer].tabFormat">
			<div v-if="Array.isArray(tmp[layer].tabFormat)"><div v-if="spacing" v-bind:style="{'height': spacing}"></div>
				<column :layer="layer" :data="tmp[layer].tabFormat" :key="this.$vnode.key + '-col'"></column>
			</div>
			<div v-else>
				<div class="upgTable" v-bind:style="{'padding-top': (embedded ? '0' : '25px'), 'margin-top': (embedded ? '-10px' : '0'), 'margin-bottom': '24px'}">
					<tab-buttons v-bind:style="tmp[layer].componentStyles['tab-buttons']" :layer="layer" :data="tmp[layer].tabFormat" :name="'mainTabs'"></tab-buttons>
				</div>
				<layer-tab v-if="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :layer="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :embedded="true" :key="this.$vnode.key + '-' + layer"></layer-tab>
				<column v-else :layer="layer" :data="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].content" :key="this.$vnode.key + '-col'"></column>
			</div>
		</div></div>
			`
	},

	'overlay-head': {
		template: `			
		<div class="overlayThing" style="padding-bottom:7px; width: 90%; z-index: 1000; position: relative">
		<span v-if="player.devSpeed && player.devSpeed != 1" class="overlayThing">
			<br>Dev Speed: {{format(player.devSpeed)}}x<br>
		</span>
		<span v-if="player.offTime !== undefined"  class="overlayThing">
			<br>Offline Time: {{formatTime(player.offTime.remain)}}<br>
		</span>
		<br>
		<span v-if="player.points.lt('1e1000')"  class="overlayThing">You have </span>
		<h2  class="overlayThing" id="points">{{format(player.points)}}</h2>
		<span v-if="player.points.lt('1e1e6')"  class="overlayThing"> {{modInfo.pointsName}}</span>
		<br>
		<span v-if="canGenPoints()"  class="overlayThing">({{tmp.other.oompsMag != 0 ? format(tmp.other.oomps) + " OOM" + (tmp.other.oompsMag < 0 ? "^OOM" : tmp.other.oompsMag > 1 ? "^" + tmp.other.oompsMag : "") + "s" : format(getPointGen())}}/秒)</span>
		<div v-for="thing in tmp.displayThings" class="overlayThing"><span v-if="thing" v-html="thing"></span></div>
	</div>
	`
    },

    'info-tab': {
        template: `
        <div>
        <h2>{{modInfo.name}}</h2>
		<p style='transform: scale(-1, -1)'>(<alternate v-html="flavorTitle"></alternate>)</p>
        <h3>{{VERSION.withName}}</h3>
        <br>
        <span v-if="modInfo.author">
            <br>
            made by <a onclick="openCreditsModal()" class="link" style="font-size:14px;display:inline" >some people</a>
        </span>
        <br>${
			Math.random() < 0.1 ?
			`<br>
			<i>The Prestige Tree</i>, courtesy of <i>Distance Incremental</i> creator<br>
			<i>The Modding Tree</i>, courtesy of <i>Homestuck: Act Omega</i> creator<br>
			<i>Homestuck</i>, courtesy of <i>Psycholonials</i> creator<br>
			also kudos to the original tree style game idea by the person with a name taken from a character from <i>Undertale</i> but whatever<br>` :
			`<br>
			a mod of The Prestige Tree made by Jacorb and Aarex<br>
			original idea by papyrus (on discord)<br>
			using The Modding Tree <a v-bind:href="'https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md'" target="_blank" class="link" v-bind:style = "{'font-size': '14px', 'display': 'inline'}" >{{TMT_VERSION.tmtNum}}</a> by Acamaeda<br>
			based on Homestuck by Andrew Hussie (of course)<br>`
		}
		<br>
        <h5 style="opacity: 0.5">
            This is made entirely for entertainment and parody purposes, no income is generated from this nor it's made to steal anybody's original works.
        </h5>
		<br><br>
		<div class="link" onclick="showTab('changelog-tab')">The Changelog<h5 style="opacity:0.5;font-size:12px;font-weight:normal">(see what happened throughout this thing's history)</h5></div><br>
		<a class="link" href="acknowledgements.md" target="_blank">Acknowledgements<h5 style="opacity:0.5;font-size:12px;font-weight:normal">(wall of text saying I do not own most of this)</h5></a><br>
        <span v-if="modInfo.discordLink"><a class="link" v-bind:href="modInfo.discordLink" target="_blank">{{modInfo.discordName}}<h5 style="opacity:0.5;font-size:12px;font-weight:normal">(suggest everything and talk about how bad this mod is here)</h5></a><br></span>
        <a class="link" href="https://discord.gg/F3xveHV" target="_blank">The Modding Tree Discord<h5 style="opacity:0.5;font-size:12px;font-weight:normal">(talking about all the mods, mod-creators and modded trees)</h5></a><br>
        <a class="link" href="http://discord.gg/wwQfgPa" target="_blank">Main Prestige Tree server<h5 style="opacity:0.5;font-size:12px;font-weight:normal">(server of the person who made the original game)</h5></a><br>
		<a class="link" href="finder.html" target="_blank">The Prestige Tree Modfinder<h5 style="opacity:0.5;font-size:12px;font-weight:normal">(in case you're already sick of this)</h5></a><br>
		<br><br>
        Time Played: {{ formatTime(player.timePlayed) }}<br><br>
        <h3>Hotkeys</h3><br>
        <span v-for="key in hotkeys" v-if="player[key.layer].unlocked && tmp[key.layer].hotkeys[key.id].unlocked"><br>{{key.description}}</span>
		<br><br>&nbsp;
		</div>
		
    `
    },

    'options-tab': {
        template: `
        <table>
            <tr>
                <td><button class="opt" onclick="save()">Save</button></td>
                <td><button class="opt" onclick="toggleOpt('autosave')">Autosave: {{ player.autosave?"ON":"OFF" }}</button></td>
                <td><button class="opt" onclick="hardReset()">HARD RESET</button></td>
            </tr>
            <tr>
                <td><button class="opt" onclick="exportSave()">Export to clipboard</button></td>
                <td><button class="opt" onclick="importSave()">Import</button></td>
                <td><button class="opt" onclick="openSaveModal()">All Save States</button></td>
                <td><button class="opt" onclick="toggleOpt('offlineProd')">Offline Prod: {{ player.offlineProd?"ON":"OFF" }}</button></td>
            </tr>
            <tr>
                <td><button class="opt" onclick="switchTheme()">Color Scheme: {{ (player.theme ? "" : "") + getThemeName() }}</button></td>
                <td><button class="opt" onclick="adjustMSDisp()">Show Milestones: {{ player.msDisplay.toUpperCase() }}</button></td>
                <td><button class="opt" onclick="toggleOpt('hqTree')">High-Quality Tree: {{ player.hqTree?"ON":"OFF" }}</button></td>
            </tr>
        	<tr>
                <td><button class="opt" onclick="toggleOpt('hideChallenges')">Completed Challenges: {{ player.hideChallenges?"HIDDEN":"SHOWN" }}</button></td>
            </tr> 
        </table>`
    },

    'back-button': {
        template: `
        <button v-bind:class="back" onclick="goBack()">←</button>
        `
    }
}