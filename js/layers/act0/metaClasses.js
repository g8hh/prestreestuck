if (act == "0.1") addLayer("metaClasses", {
    name: "Classes",
    symbol: "C",
    row: 8,
    position: 1,

    layerShown() { return hasUpgrade("skaia", 31) },
    resource: "Class Points",
    color: "#cfc4ff",
    type: "none",

    startData() {
        return {
            unlocked: true,
            points: new Decimal(1),
        }
    },
    effect() {
        var eff = {}
        return eff
    },
})
