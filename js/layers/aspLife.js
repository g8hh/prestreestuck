addLayer("aspLife", {
    name: "Life",
    symbol: "<img src='data/life.png' style='width:calc(80%);height:calc(80%);margin:10%'></img>",
    row: 5,
    position: 1,
    branches: [["skaia", 3]],

    layerShown() { return (hasUpgrade("skaia", 11) || player[this.layer].unlocked) && !inChallenge("aspDoom", 12) && !hasUpgrade("skaia", 12) },
    resource: "Life Power",
    baseAmount() { return player.points },
    baseResource: "点",
    color: "#a49787",
    resetDescription: "Absorb ",

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            autoAuto: false,
            currentResearch: 0,
            researchExp: new Decimal(0),
        }
    },
    effect() {
        var effs = {
            pointBoost: player.aspLife.points.mul(125).add(1).pow(25).pow(tmp.aspBreath.buyables[26].effect),
            selfBoost: player.aspLife.points.add(1).pow(0.5),
            skaiaGain: player.aspLife.points.add(1).log(10).mul(2)
        }
        effs.selfBoost = applyPolynomialSoftcap(effs.selfBoost, 1e3, 2)
        effs.selfBoost = applyPolynomialSoftcap(effs.selfBoost, 1e12, 2)
        effs.selfBoost = applyPolynomialSoftcap(effs.selfBoost, 1e64, 2)
        return effs
    },
    effectDescription() {
        eff = this.effect();
        return "which are giving a ×" + format(eff.pointBoost) + " boost to point gain, a ×" + format(eff.selfBoost) + " boost to self gain and are producing " + format(eff.skaiaGain) + " Echepoints per minute."
    },

    type: "normal",
    requires: new Decimal("4.13e2350"),
    exponent: 0.001,
    gainMult() {
        mult = new Decimal(1).mul(tmp.aspLife.effect.selfBoost).mul(tmp.skaia.effect.boondollarBoost)
        return mult.mul(tmp.aspBreath.buyables[25].effect)
    },
    gainExp() {
        let mult = new Decimal(1)
        if (inChallenge("aspDoom", 11)) mult = mult.mul(0.75)
        return mult
    },

    buyables: {
        rows: 1,
        cols: 7,
        11: {
            cost(x) { return new Decimal(612) },
            effect(x) { return player.aspLife.points.add(1).pow(50) },
            canAfford() { return true },
            title() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "<p style='transform: scale(-1, -1)'><alternate>BLESSING OF LIFE</alternate><p><h3 style='font-size:12px'>("
                    + (player[this.layer].buyables[this.id].gt(0) ? "Active" : "Inactive")
                    + ")"
            },
            display() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "which will decrease your Life Power by " + format(data.cost) + " per second but will give a " + format(data.effect) + "× boost to point gain (based on current Life Power count)"
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].gt(0) ? new Decimal(0) : new Decimal(1)
            },
        },
        12: {
            cost(x) { return new Decimal(61 * 2 * 41 * 3) },
            effect(x) { return player.aspLife.points.add(1).pow(60) },
            canAfford() { return true },
            title() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "<p style='transform: scale(-1, -1)'><alternate>BLESSING OF LIFE SQUARED</alternate><p><h3 style='font-size:12px'>("
                    + (player[this.layer].buyables[this.id].gt(0) ? "Active" : "Inactive")
                    + ")"
            },
            display() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "which will decrease your Life Power by " + format(data.cost) + " per second but will give a " + format(data.effect) + "× boost to Time Power gain (based on current Life Power count)"
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].gt(0) ? new Decimal(0) : new Decimal(1)
            },
        },
        13: {
            cost(x) { return new Decimal(6 * 11 * 2 * 4 * 11 * 3 * 11 * 11) },
            effect(x) { return player.aspLife.points.add(1).pow(75) },
            canAfford() { return true },
            title() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "<p style='transform: scale(-1, -1)'><alternate>BLESSING OF LIFE CUBED</alternate><p><h3 style='font-size:12px'>("
                    + (player[this.layer].buyables[this.id].gt(0) ? "Active" : "Inactive")
                    + ")"
            },
            display() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "which will decrease your Life Power by " + format(data.cost) + " per second but will give a " + format(data.effect) + "× boost to Space Power gain (based on current Life Power count)"
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].gt(0) ? new Decimal(0) : new Decimal(1)
            },
        },
    },

    milestones: {
        0: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>INSERT A LIFE MILESTONE NAME HERE</alternate></p>1 Life Power",
            done() { return player[this.layer].best.gte(1) },
            effectDescription: "Keeps all Light and Void milestones on Life resets.",
        },
        1: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>EXTREMELY WONDERFUL COLOR SCHEME</alternate></p>2 Life Power",
            done() { return player[this.layer].best.gte(2) },
            effectDescription: "Keeps 350 levels of each Light Discovery on resets.",
        },
        2: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>NOW WE JUST HAVE TO WAIT</alternate></p>5 Life Power",
            done() { return player[this.layer].best.gte(5) },
            effectDescription: "Gets 2% of your current Life Power gain on absorb per second. Also adds a new minigame into the Skaia layer to make the waiting worth it.",
        },
        3: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>BLESSING OF LIFE</alternate></p>10,000 Life Power",
            done() { return player[this.layer].best.gte(10000) },
            effectDescription: "Unlocks Blessing (a.k.a. temporary boosts).",
        },
        4: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>IT IS TIME</alternate></p>" + format(1e10) + " Life Power",
            done() { return player[this.layer].best.gte(1e10) },
            effectDescription: "Unlocks an aspect layer.",
        },
    },

    doReset(pLayer) {
        if (pLayer && layers[pLayer].row > layers[this.layer].row) {
            var listKeep = [];
            if ((pLayer === "aspDoom" && hasMilestone("aspDoom", 0)) || (layers[pLayer].row == 7 && hasMilestone("skaia", 0))) {
                listKeep.push("milestones")
            }
            layerDataReset(this.layer, listKeep)
        }
    },

    update(delta) {
        player.skaia.points = player.skaia.points.add(tmp.aspLife.effect.skaiaGain.mul(delta).div(60))
        if (hasMilestone(this.layer, 1)) {
            var num = hasChallenge("aspDoom", 11) ? 1000000 : 350
            for (var a = 11; a <= 17; a++) {
                player.aspLight.buyables[a] = player.aspLight.buyables[a].max(num)
            }
        }
        for (var a = 11; a <= 13; a++) {
            if (getBuyableAmount(this.layer, a).gt(0)) {
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[a].cost.mul(delta)).max(0)
            }
        }
        if (hasMilestone(this.layer, 2))
            addPoints(this.layer, tmp[this.layer].resetGain.mul(delta).mul(0.02))
    },

    microtabs: {
        stuff: {
            "Milestones": {
                content: [
                    ["blank", "15px"],
                    "milestones",
                ]
            },
            "Blessings": {
                unlocked() { return hasMilestone("aspLife", 3) },
                content: [
                    ["blank", "15px"],
                    "buyables"
                ]
            },
        },
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        ["blank", "35px"],
        ["microtabs", "stuff"],
        ["blank", "35px"],
    ],

    hotkeys: [
        { key: "i", description: "I: Absorb Life Power", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
})
