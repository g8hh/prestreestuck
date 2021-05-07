var modal = {
    showing: false,
    title: "",
    content: "",
    dismiss: "",
    hide() {
        this.showing = false
    },
    show(t, c, d = "Close") {
        this.showing = true
        this.title = t
        this.content = c
        this.dismiss = d
    },
}

function openCreditsModal() {
	modal.show(
		"Le Credets",
		`
            <h5>When there are more than 1 person working in a TMT project</h5>
			<br>
            <h5 style="padding-top:5px">The (original) Prestige Tree made by</h5><h3>Jacorb</h3> and <h3>Aarex Tiaokhiao</h3>
            <h5 style="padding-top:5px">original idea [?] by</h5><h3>papyrus#6977 (on discord)</h3>
            <h5 style="padding-top:5px">The Modding Tree <a v-bind:href="'https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md'" target="_blank" class="link" style="font-size:12px;display:inline" >${TMT_VERSION.tmtNum}</a> by</h5><h3>Harley "Acamaeda" White</h3>
			<br><br>
			<h2>Act 0</h2>
            <h5 style="padding-top:5px">Literally (probably) everything made by </h5><h3>ducdat0507</h3>
            <br><br>
			<h2>Act 1</h2>
            <h5 style="padding-top:5px">Mostly everything made by </h5><h3>ducdat0507</h3>
            <h5 style="padding-top:5px">With art help by </h5><h3>LowDeath675</h3>
            <br>
		`,
		"Ok"
	)
}

function openStartModal() {
    modal.show(
        'The Prestreestuck', `
            <span style='font-size:14px'>
                <i>
                    You found yourself in an unfamilliar place.<br/>
                    It appears to be the first time that you're here.<br/>
                    This place looks like... a title screen? From a game?<br/>
                </i><br/>
                <button onclick='openContentWarningModal()'> Show Content Warning </button>
                <br/><br/>
                You decided to start the game from:
                <div class="saveState" style='cursor:pointer;margin-top:5px' onclick='switchAct("0.0");'>
                    <h3 style="font-size:21px">Act 0</h3><br/>
                    <span style='font-size:14px'>Tree of Genesis</span>
                </div>
                <div class="saveState" style='cursor:pointer' onclick='switchAct(1);'>
                    <h3 style="font-size:21px">Act 1</h3><br/>
                    <span style='font-size:14px'>MS-Paint Incremental</span>
                </div>
                (select one from above!)
            </span>
        `, 
        ''
    )
}

function openContentWarningModal() {
    modal.show(
        'Contenc Waning (!important)', `
            <span style='font-size:14px'><br/>
                This game may contains photosensitive images that may trigger seizures.
                <br/><br/>
                This game may introduces more uncomforting or questiionable content as it evolves.
                <br/><br/>
                Oh and also it's Homestuck related.<br/>
                Don't say we didn't warn you.
            </span><br/><br/>
			<button onclick='openStartModal()'> Go back </button>
        `, 
        ''
    )
}