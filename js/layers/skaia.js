addLayer("skaia", {
    name: "Skaia",
    symbol: "<img src='data/spirograph.png' style='width:calc(80% );height:calc(80%);margin:10%'></img>",
    row: 999,
    position: 0,
    branches: [],

    layerShown() { return hasUpgrade("aspMind", 24) || player.aspHope.unlocked || player.aspRage.unlocked },
    resource: "Experience",
    type: "none",
    color: "#ffffff",

    tooltip() {
        return "Skaia Level " + formatWhole(player.skaia.level) + "\n" + formatWhole(player.skaia.points.floor()) + " Echepoints\n(+" + format((player.skaia.points % 1) * 100) + "%)"
    },

    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            level: new Decimal(1),

        }
    },
    effect() {
        return {
            climbReq: player.skaia.level.pow(player.skaia.level.pow(0.03).div(2)).ceil()
        }
    },
    buyables: {
        rows: 1,
        cols: 4,
        11: {
            cost(x) { return new Decimal(20) },
            effect(x) { return new Decimal(0.1).mul((x || getBuyableAmount(this.layer, this.id)).add(1)).mul(100).root((x || getBuyableAmount(this.layer, this.id)).div(25).add(1)).div(100) },
            canAfford() { return getBuyableAmount(this.layer, this.id).lt(temp[this.layer].buyables[this.id].cost) },
            title() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "<p style='transform: scale(-1, -1)'><alternate>HOPES AND DREAMS</alternate>\
                    <h3 style='font-size:13px'>(" + formatWhole(amount) + " / " + formatWhole(data.cost) + ")</h3>"
            },
            display() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "<h3>Do a Hope reset.</h3><br/>+" + format(data.effect.mul(100)) + "% on completion"
            },
            buy() {
            },
            buyMax() {
                let data = temp[this.layer].buyables[this.id]
                player.skaia.points = player.skaia.points.add(data.effect)
                player.skaia.buyables[this.id] = player.skaia.buyables[this.id].add(1)
            },
        },
        12: {
            cost(x) { return new Decimal(20) },
            effect(x) { return new Decimal(0.1).mul((x || getBuyableAmount(this.layer, this.id)).add(1)).mul(100).root((x || getBuyableAmount(this.layer, this.id)).div(25).add(1)).div(100) },
            canAfford() { return getBuyableAmount(this.layer, this.id).lt(temp[this.layer].buyables[this.id].cost) },
            title() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "<p style='transform: scale(-1, -1)'><alternate>BRINGER OF CHAOS</alternate></p>\
                    <h3 style='font-size:13px'>(" + formatWhole(amount) + " / " + formatWhole(data.cost) + ")</h3>"
            },
            display() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "<h3>Do a Rage reset.</h3><br/>+" + format(data.effect.mul(100)) + "% on completion"
            },
            buy() {
            },
            buyMax() {
                let data = temp[this.layer].buyables[this.id]
                player.skaia.points = player.skaia.points.add(data.effect)
                player.skaia.buyables[this.id] = player.skaia.buyables[this.id].add(1)
                if (player.skaia.points.gt(tmp.skaia.effect.climbReq)) {
                    player.skaia.points = player.skaia.points.sub(tmp.skaia.effect.climbReq)
                    player.skaia.level = player.skaia.level.add(1)
                }
            },
        },
        13: {
            cost(x) { return new Decimal(20) },
            effect(x) { return new Decimal(0.2).mul((x || getBuyableAmount(this.layer, this.id)).add(1)).mul(100).root((x || getBuyableAmount(this.layer, this.id)).div(25).add(1)).div(100) },
            unlocked() { return hasMilestone("aspRage", 1) },
            canAfford() { return getBuyableAmount(this.layer, this.id).lt(temp[this.layer].buyables[this.id].cost) },
            title() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "<p style='transform: scale(-1, -1)'><alternate>COMMENCER OF DESTRUCTION</alternate></p>\
                    <h3 style='font-size:13px'>(" + formatWhole(amount) + " / " + formatWhole(data.cost) + ")</h3>"
            },
            display() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "<h3>Complete a Rage Challenge.</h3><br/>+" + format(data.effect.mul(100)) + "% on completion"
            },
            buy() {
            },
            buyMax() {
                let data = temp[this.layer].buyables[this.id]
                player.skaia.points = player.skaia.points.add(data.effect)
                player.skaia.buyables[this.id] = player.skaia.buyables[this.id].add(1)
                if (player.skaia.points.gt(tmp.skaia.effect.climbReq)) {
                    player.skaia.points = player.skaia.points.sub(tmp.skaia.effect.climbReq)
                    player.skaia.level = player.skaia.level.add(1)
                }
            },
        },
    },

    bars: {
        echeprogress: {
            direction: RIGHT,
            width: 400,
            height: 10,
            progress() { return player.skaia.points % 1 },
        },
    },

    microtabs: {
        stuff: {
            "Echetasks": {
                content: [
                    ["blank", "15px"],
                    "buyables",
                ]
            },
        },
    },

    tabFormat: [
        ["display-text", () => "Skaia is currently in level <h2 style='color:white; text-shadow:white 0 0 10px'>" + formatWhole(player.skaia.level) + "</h2>"],
        ["display-text", () => "<h5 style='opacity:0.5'>(which is equivalent of climbing " + formatWhole(player.skaia.level.sub(1)) + " Achievement Rungs on the Echeladder.)</h5>"],
        ["display-text", () => "<br/>You currently have <h2 style='color:white; text-shadow:white 0 0 10px'>" + formatWhole(player.skaia.points.floor()) + "</h2> Echepoints"],
        ["display-text", () => "<h5 style='opacity:0.5'>and will need " + formatWhole(tmp.skaia.effect.climbReq) + " Echepoints to climb to the next rung.</h5>"],
        ["blank", "25px"],
        ["bar", "echeprogress"],
        ["blank", "5px"],
        ["display-text", () => "<h5>" + format((player.skaia.points % 1) * 100) + "% until next Echepoint"],
        ["blank", "25px"],
        ["microtabs", "stuff"],
    ],

    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
})
