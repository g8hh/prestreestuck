addLayer("skaia", {
    name: "Skaia",
    symbol: "<img src='data/spirograph.png' style='width:calc(80% );height:calc(80%);margin:10%'></img>",
    row: 999,
    position: 0,
    branches: [],

    layerShown() { return hasUpgrade("skaia", 12) || hasUpgrade("aspMind", 24) || player.aspHope.unlocked || player.aspRage.unlocked },
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
            boondollars: new Decimal(0),

            tradingClock: 0,

            buildGristStock: new Decimal(0),
            buildGristPrice: new Decimal(10),
            buildGristSpeed: new Decimal(1),
        }
    },
    effect() {
        return {
            levelGain: hasUpgrade("skaia", 12) ? player.points.add(1).log(1e10).pow(0.001).div(100) : new Decimal(0),
            climbReq: player.skaia.level.pow(player.skaia.level.pow(0.03).div(2)).pow(player.skaia.level.sub(299).max(1).pow(0.15)).pow(player.skaia.level.div(6120).max(1).pow(3.5)).ceil(),
            boondollarGain: hasMilestone("aspLife", 2) ? player.skaia.level.sub(20).max(1).pow(3).pow(player.skaia.level.sub(98).max(1).div(3).pow(0.35)) : new Decimal(0),
            boondollarBoost: applyPolynomialSoftcap(player.skaia.boondollars.max(1e10).div(1e10).pow(0.5), 1e10, 10)
        }
    },
    buyables: {
        rows: 1,
        cols: 5,
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
        14: {
            cost(x) { return new Decimal(2500) },
            effect(x) { return new Decimal(0.01).mul((x || getBuyableAmount(this.layer, this.id)).add(1)).mul(100).root((x || getBuyableAmount(this.layer, this.id)).div(100).add(1)).div(100) },
            unlocked() { return player.aspLight.unlocked },
            canAfford() { return getBuyableAmount(this.layer, this.id).lt(temp[this.layer].buyables[this.id].cost) },
            title() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "<p style='transform: scale(-1, -1)'><alternate>LIGHT THE FUTURE</alternate></p>\
                    <h3 style='font-size:13px'>(" + formatWhole(amount) + " / " + formatWhole(data.cost) + ")</h3>"
            },
            display() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "<h3>Complete a Light Research.</h3><br/>+" + format(data.effect.mul(100)) + "% on completion"
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
        15: {
            cost(x) { return new Decimal(50) },
            effect(x) { return new Decimal(0.25).mul((x || getBuyableAmount(this.layer, this.id)).add(1)).mul(100).root((x || getBuyableAmount(this.layer, this.id)).div(10).add(1)).div(100) },
            unlocked() { return player.aspVoid.unlocked },
            canAfford() { return getBuyableAmount(this.layer, this.id).lt(temp[this.layer].buyables[this.id].cost) },
            title() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "<p style='transform: scale(-1, -1)'><alternate>NULL AND VOID</alternate></p>\
                    <h3 style='font-size:13px'>(" + formatWhole(amount) + " / " + formatWhole(data.cost) + ")</h3>"
            },
            display() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "<h3>Complete a Void Enhancement.</h3><br/>+" + format(data.effect.mul(100)) + "% on completion"
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

    upgrades: {
        rows: 1,
        cols: 2,
        11: {
            fullDisplay: "<h3>BEGIN THE PLAN.</h3><br/>Need Skaia Level 22",
            canAfford() { return player.skaia.level.gte(22) },
            pay() {
                player.phaseTimer = 0
                player.tab = "none"
            },
            unlocked() { return player.points.gte("1e2200") && !hasUpgrade(this.layer, this.id) },
        },
        12: {
            fullDisplay: "<h3>REACH BEYOND THE CIRCLE.</h3><br/>Need " + format("ee216") + " points",
            canAfford() { return player.points.gte("ee216") },
            pay() {
                player.phaseTimer = 0
                player.tab = "none";

                ["aspTime", "aspSpace", "aspMind", "aspHeart", "aspHope", "aspRage", "aspLight", "aspVoid", "aspLife", "aspDoom", "aspBlood", "aspBreath"].forEach(x => {
                    layerDataReset(x)
                    player[x].unlocked = false
                })

                player.points = new Decimal(1)
                player.skaia.level = new Decimal(1)
                player.skaia.points = new Decimal(0)
                player.skaia.boondollars = new Decimal(0)
                player.subtabs.skaia.stuff = "Meta"

                player.metaAspects.unlocked = true
            },
            unlocked() { return player.points.gte("ee20") && !hasUpgrade(this.layer, this.id) },
        },
        21: {
            description: "Begin stock trading simulator.",
            cost: new Decimal(1e6),
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Boondollars",
            currencyInternalName: "boondollars",
            unlocked() { return !hasUpgrade(this.layer, this.id) },
        },
        22: {
            description: "Automatically buy low, sell high when possible.",
            cost: new Decimal(1e11),
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Boondollars",
            currencyInternalName: "boondollars",
            unlocked() { return hasUpgrade(this.layer, this.id - 1) && !hasUpgrade(this.layer, this.id) },
        },
        31: {
            title: "<p style='transform: scale(-1, -1)'><alternate>THATS NOT VERY CREATIVE</alternate>",
            description: "Unlocks Classes",
            cost: new Decimal("ee221"),
            currencyLocation() { return player},
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
        },
        32: {
            title: "<p style='transform: scale(-1, -1)'><alternate>CLASS POINTS SQUARED</alternate>",
            description: "You gain Class Points faster based on your points.",
            cost: new Decimal("ee300"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            effect() {
                let ret = player.points.add(1).log(10).add(1).log(10).sub(299).max(1).pow(2)
                if (hasUpgrade("skaia", 35)) ret = ret.pow(upgradeEffect("skaia", 35))
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("skaia", 31) },
        },
        33: {
            title: "<p style='transform: scale(-1, -1)'><alternate>CLASS POINTS CUBED</alternate>",
            description: "You gain Class Points faster based on your Aspect Points.",
            cost: Decimal.pow(10, Number.MAX_VALUE),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            effect() {
                let ret = player.metaAspects.points.add(1).log(10).sub(639).max(1).pow(2)
                if (hasUpgrade("skaia", 36)) ret = ret.pow(upgradeEffect("skaia", 36))
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("skaia", 31) },
        },
        34: {
            title: "<p style='transform: scale(-1, -1)'><alternate>CLASS POINTS TESSERACTED</alternate>",
            description: "You gain Class Points faster based on your Class Points.",
            cost: new Decimal("ee400"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            effect() {
                let ret = player.metaClasses.points.add(1).log(10).add(1).pow(2)
                if (hasUpgrade("skaia", 37)) ret = ret.pow(upgradeEffect("skaia", 37))
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("skaia", 31) },
        },
        35: {
            title: "<p style='transform: scale(-1, -1)'><alternate>CLASS POINTS SQUARED SQUARED</alternate>",
            effect: new Decimal(Math.log(3) / Math.log(2)),
            description: "Sierpinski triangles (^" + format(Math.log(3) / Math.log(2), 3) + ") the effect of the upgrade above this.",
            cost: new Decimal("ee500"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 32) && hasUpgrade("skaia", 33) && hasUpgrade("skaia", 34) },
        },
        36: {
            title: "<p style='transform: scale(-1, -1)'><alternate>CLASS POINTS CUBED SQUARED</alternate>",
            effect: new Decimal(Math.log(4) / Math.log(3)),
            description: "Koch curves (^" + format(Math.log(4) / Math.log(3), 3) + ") the effect of the upgrade above this.",
            cost: new Decimal("ee670"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 32) && hasUpgrade("skaia", 33) && hasUpgrade("skaia", 34) },
        },
        37: {
            title: "<p style='transform: scale(-1, -1)'><alternate>CLASS POINTS TESSERACTED SQUARED</alternate>",
            effect: new Decimal(Math.log(20) / Math.log(3)),
            description: "Menger sponges (^" + format(Math.log(20) / Math.log(3), 3) + ") the effect of the upgrade above this.",
            cost: new Decimal("ee12770"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 32) && hasUpgrade("skaia", 33) && hasUpgrade("skaia", 34) },
        },
    },

    update(delta) {
        player.phaseTimer += delta
        if (player.skaia.points.gt(tmp.skaia.effect.climbReq)) {
            player.skaia.points = player.skaia.points.sub(tmp.skaia.effect.climbReq)
            player.skaia.level = player.skaia.level.add(1)
        }
        player.skaia.boondollars = player.skaia.boondollars.add(tmp.skaia.effect.boondollarGain.mul(delta)).div(player.skaia.boondollars.add(1).log(10).sub(9).max(1).pow(0.05).pow(delta))

        if (Number.isNaN(player.skaia.points.mag) || Number.isNaN(player.skaia.boondollars.mag)) {
            console.log(a)
            player.skaia.boondollars = new Decimal(0)
        }
        if (hasUpgrade("skaia", 12)) {
            player.skaia.points = player.skaia.points.add(tmp.skaia.effect.levelGain.mul(delta))
        }

        if (hasUpgrade("skaia", 21)) {
            player.skaia.tradingClock += delta

            if (player.skaia.tradingClock >= 1) {
                simulateStock("buildGrist", 3, 20, 0.015)

                if (hasUpgrade("skaia", 22)) {
                    if (player.skaia.buildGristSpeed.gt(0)) {
                        let stocks = player.skaia.boondollars.div(player.skaia.buildGristPrice)
                        player.skaia.boondollars = player.skaia.boondollars.sub(stocks.mul(player.skaia.buildGristPrice))
                        if (Number.isNaN(player.skaia.boondollars.mag)) player.skaia.boondollars = new Decimal(0)
                        player.skaia.buildGristStock = player.skaia.buildGristStock.add(stocks)
                    } else {
                        player.skaia.boondollars = player.skaia.boondollars.add(player.skaia.buildGristStock.mul(player.skaia.buildGristPrice))
                        player.skaia.buildGristStock = new Decimal(0)
                    }
                }
                player.skaia.tradingClock = 0
            }
        }
    },

    milestones: {
        0: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>FULLY POWERED</alternate></p>1 Breath Essence & 1 Blood Essence",
            done() { return player.aspBreath.best.gte(1) && player.aspBlood.best.gte(1) },
            effectDescription: "Keeps Light, Void, Life and Doom milestones on Breath and Blood resets.",
        },
        1: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>EVERYTHING IS ACTIVE</alternate></p>2 Breath Essence & 2 Blood Essence",
            done() { return player.aspBreath.best.gte(2) && player.aspBlood.best.gte(2) },
            effectDescription: "Keeps Rage, Hope, Mind and Heart milestones plus Mind and Heart upgrades on Breath and Blood resets.",
        },
        2: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>AGE OF GROWTH</alternate></p>4 Breath Essence & 4 Blood Essence",
            done() { return player.aspBreath.best.gte(4) && player.aspBlood.best.gte(4) },
            effectDescription: "Keeps Hope Upgrades and Rage Milestones on Breath and Blood resets.",
        },
        3: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>EVERYTHING IS ALMOST READY</alternate></p>6 Breath Essence & 6 Blood Essence",
            done() { return player.aspBreath.best.gte(6) && player.aspBlood.best.gte(6) },
            effectDescription: "Keeps Doom Wraths on Breath and Blood resets.",
        },
        4: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>IT MUST HAPPENS</alternate></p>15 Breath Essence & 15 Blood Essence",
            done() { return player.aspBreath.best.gte(15) && player.aspBlood.best.gte(15) },
            effectDescription: "Keeps Space Upgrades on Breath and Blood resets.",
        },
        5: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>IT CAN NOT BE UNDONE</alternate></p>32 Breath Essence & 32 Blood Essence",
            done() { return player.aspBreath.best.gte(32) && player.aspBlood.best.gte(32) },
            effectDescription: "Automatically do Breath and Blood resets.",
            toggles: [["aspBreath", "autoAbsorb"], ["aspBlood", "autoAbsorb"]],
        },
        6: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>IT IS TOO LATE TO DO ANYTHING ELSE</alternate></p>60 Breath Essence & 60 Blood Essence",
            done() { return player.aspBreath.best.gte(60) && player.aspBlood.best.gte(60) },
            effectDescription: "Gain the ability to bulk get Time Boosters. Also affects autobuyers.",
        },
        7: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>THE ASCENSION IS ALMOST HERE</alternate></p>100 Breath Essence & 100 Blood Essence",
            done() { return player.aspBreath.best.gte(100) && player.aspBlood.best.gte(100) },
            effectDescription: "Absorbing Breath and Blood Essence no longer resets anything.",
        },
        8: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>JUST A LITTLE BIT MORE</alternate></p>2000 Breath Essence & 2000 Blood Essence",
            done() { return player.aspBreath.best.gte(2000) && player.aspBlood.best.gte(2000) },
            effectDescription: "You can bulk absorb Breath and Blood Essence.",
        },
    },

    bars: {
        echeprogress: {
            direction: RIGHT,
            width: 400,
            height: 10,
            progress() { return tmp.skaia.effect.climbReq.gt(10) ? player.skaia.points.floor().div(tmp.skaia.effect.climbReq) : (player.skaia.points % 1) },
        },
    },

    microtabs: {
        stuff: {
            "Echetasks": {
                unlocked: () => !hasUpgrade("skaia", 12),
                content: [
                    ["blank", "15px"],
                    "buyables",
                ]
            },
            "Porkhollow": {
                unlocked: () => hasMilestone("aspLife", 2),
                content: [
                    ["blank", "15px"],
                    ["display-text", () => "Your Porkhollow is containing <h2 style='color:white; text-shadow:white 0 0 10px'>" + formatWhole(player.skaia.boondollars) + "</h2> boondollars (+" + formatWhole(tmp.skaia.effect.boondollarGain) + "/s), which are giving a " + format(tmp.skaia.effect.boondollarBoost) + "× boost to Life Point gain"],
                    ["blank", "5px"],
                    ["display-text", function () {
                        var f = format(player.skaia.boondollars.div(1e6), 3) + " boonbucks"
                        if (player.skaia.boondollars.gte(1e12)) f = format(player.skaia.boondollars.div(1e12), 3) + " booncases"
                        if (player.skaia.boondollars.gte(1e18)) f = format(player.skaia.boondollars.div(1e18), 3) + " boonbonds"
                        if (player.skaia.boondollars.gte(1e21)) f = format(player.skaia.boondollars.div(1e21), 3) + " boonbanks"
                        if (player.skaia.boondollars.gte(1e24)) f = format(player.skaia.boondollars.div(1e24), 3) + " boonmints"
                        if (player.skaia.boondollars.gte(1e48)) f = format(player.skaia.boondollars.div(1e48), 3) + " boonmint^2s"
                        if (player.skaia.boondollars.gte(1e96)) f = format(player.skaia.boondollars.div(1e96), 3) + " boonmint^4s"
                        return "<h5 style='opacity:0.5'>(or approximately " + f + ", whatever you prefer.)</h5>"
                    }],
                    ["display-text", () => "<h5 style='opacity:0.5'>(note: your boondollars will be taxed (a.k.a. decays) after 1e10 of them!)</h5>"],
                    ["blank", "15px"],
                    ["upgrade", "21"],
                    ["display-text", function () {
                        if (!hasUpgrade("skaia", 21)) return ""
                        const tgs = [["buildGrist", "PrftlyGnricStock"]]
                        let data = "<h5/>" + "Stock Name".padEnd(16, "\u00a0") + " |" + "In Stock".padStart(15, "\u00a0") + " |" + "S. Price".padStart(9, "\u00a0") + " |" + "P. Speed".padStart(9, "\u00a0") + " | Actions:<br/>"
                        tgs.forEach(target => {
                            data += target[1].padEnd(16, "\u00a0") + " |"
                                + format(player.skaia[target[0] + "Stock"]).padStart(15, "\u00a0") + " |"
                                + format(player.skaia[target[0] + "Price"]).padStart(9, "\u00a0") + " |"
                                + format(player.skaia[target[0] + "Speed"]).padStart(9, "\u00a0")
                                + ` | <a onclick="{
                                    let stocks = player.skaia.boondollars.div(player.skaia.${target[0]}Price)
                                    player.skaia.boondollars = player.skaia.boondollars.sub(stocks.mul(player.skaia.${target[0]}Price))
                                    if (Number.isNaN(player.skaia.boondollars.mag)) player.skaia.boondollars = new Decimal(0)
                                    player.skaia.${target[0]}Stock = player.skaia.${target[0]}Stock.add(stocks)
                                }">Buy</a> <a onclick="{
                                    player.skaia.boondollars = player.skaia.boondollars.add(player.skaia.${target[0]}Stock.mul(player.skaia.${target[0]}Price))
                                    player.skaia.${target[0]}Stock = new Decimal(0)
                                }">Sell</a><br/>`
                        })
                        return data + "</h5>"
                    }],
                    ["blank", "15px"],
                    ["upgrade", "22"],
                ]
            },
            "Progression": {
                unlocked: () => player.aspBreath.unlocked || player.aspBlood.unlocked,
                content: [
                    ["blank", "15px"],
                    "milestones",
                ]
            },
            "Meta": {
                unlocked: () => hasUpgrade("skaia", 12),
                content: [
                    ["blank", "15px"],
                    ["display-text", () => "Your points are giving you " + format(tmp.skaia.effect.levelGain.mul(60)) + " Echepoints per minute."],
                    ["blank", "15px"],
                    ["upgrade", "31"],
                    ["row", [["upgrade", "32"], ["upgrade", "33"], ["upgrade", "34"]]],
                    ["row", [["upgrade", "35"], ["upgrade", "36"], ["upgrade", "37"]]],
                ]
            },
        },
    },

    tabFormat: [
        ["display-text", () => "Skaia is currently in level <h2 style='color:white; text-shadow:white 0 0 10px'>" + formatWhole(player.skaia.level) + "</h2>"],
        ["display-text", () => "<h5 style='opacity:0.5'>(which is equivalent to climbing " + formatWhole(player.skaia.level.sub(1)) + " Achievement Rungs on the Echeladder.)</h5>"],
        ["display-text", () => "<br/>You currently have <h2 style='color:white; text-shadow:white 0 0 10px'>" + formatWhole(player.skaia.points.floor()) + "</h2> Echepoints"],
        ["display-text", () => "<h5 style='opacity:0.5'>and will need " + formatWhole(tmp.skaia.effect.climbReq) + " Echepoints to climb to the next rung.</h5>"],
        ["blank", "25px"],
        ["bar", "echeprogress"],
        ["blank", "5px"],
        ["display-text", () => "<h5>" + format((player.skaia.points % 1) * 100) + "% until next Echepoint"],
        ["blank", "25px"],
        "upgrades",
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
