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