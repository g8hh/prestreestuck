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