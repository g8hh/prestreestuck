addLayer("metaProspit", {
    name: "Prospit",
    symbol: "P",
    row: 9,
    position: 1,

    layerShown() { return hasUpgrade("skaia", 31) && hasUpgrade("skaia", 49) },
    resource: "Class Points",
    color: "#020d65",
    type: "none",

    startData() {
        return {
            unlocked: true,
            points: new Decimal(1),
        }
    },

    // oh my god update teaser

})