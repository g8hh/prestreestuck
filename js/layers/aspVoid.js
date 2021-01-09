addLayer("aspVoid", {
    name: "Void",
    symbol: "<img src='data/void.png' style='width:calc(80%);height:calc(80%);margin:10%'></img>",
    row: 4,
    position: 2,
    branches: [["aspLight", 3]],

    layerShown() { return (hasMilestone("aspLight", 3) || player[this.layer].unlocked) && !inChallenge("aspDoom", 12) && !hasUpgrade("skaia", 12) },
    resource: "Void Power",
    baseAmount() { return player.points },
    baseResource: "points",
    color: "#104ea2",
    resetDescription: "Absorb ",

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            currentResearch: 0,
            researchExp: new Decimal(0),
        }
    },
    effect() {
        return {
        }
    },

    type: "normal",
    requires: new Decimal("1e1750"),
    exponent: 0.005,
    gainMult() {
        mult = new Decimal(1)
        if (hasUpgrade("aspHope", 62)) mult = mult.mul(tmp.aspHope.upgrades[62].effect)
        return mult.mul(tmp.aspBlood.buyables[23].effect)
    },
    gainExp() {
        let mult = new Decimal(1)
        if (inChallenge("aspDoom", 11)) mult = mult.pow(0.75)
        return mult
    },

    buyables: {
        rows: 1,
        cols: 2,
        11: {
            cost(x) { return new Decimal(10).pow((x || getBuyableAmount(this.layer, this.id)).div(10).add(1).pow((x || getBuyableAmount(this.layer, this.id)).sub(20).max(0).add(2)).sub(1)) },
            effect(x) {
                var eff = (x || getBuyableAmount(this.layer, this.id)).mul(2).add(1).pow(0.2)
                if (challengeCompletions("aspDoom", 11) >= 4) eff = eff.pow(3)
                return eff.mul(tmp.aspBlood.buyables[24].effect)
            },
            canAfford() { return true },
            title() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return formatWhole(amount) + "<br/><p style='transform: scale(-1, -1)'><alternate>LEVELS OF VOID</alternate><p><h3 style='font-size:12px'>("
                    + (player[this.layer].currentResearch == this.id ? format(player[this.layer].researchExp) : "Idle") + " / " + format(data.cost)
                    + ")"
            },
            display() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "which are multiplying the base exponent of each Light Researches by ×" + format(data.effect)
            },
            buy() {
                player[this.layer].researchExp = new Decimal(0)
                player[this.layer].currentResearch = player[this.layer].currentResearch == this.id ? 0 : this.id
            },
        },
        12: {
            cost(x) { return new Decimal(1000000).pow((x || getBuyableAmount(this.layer, this.id)).div(10).add(1).pow((x || getBuyableAmount(this.layer, this.id)).sub(5).max(0).add(2))) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).mul(5) },
            canAfford() { return true },
            title() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return formatWhole(amount) + "<br/><p style='transform: scale(-1, -1)'><alternate>LEVELS OF NULL</alternate><p><h3 style='font-size:12px'>("
                    + (player[this.layer].currentResearch == this.id ? format(player[this.layer].researchExp) : "Idle") + " / " + format(data.cost)
                    + ")"
            },
            display() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "which are decreasing the scaling point of Light Researches by " + format(data.effect)
            },
            buy() {
                player[this.layer].researchExp = new Decimal(0)
                player[this.layer].currentResearch = player[this.layer].currentResearch == this.id ? 0 : this.id
            },
        },
    },

    milestones: {
        0: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>NULL AND VOID</alternate></p>1 Void Power",
            done() { return player[this.layer].best.gte(1) },
            effectDescription: "Keeps all Hope and Rage milestones on Void resets.",
        },
        1: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>VOID AND NULL</alternate></p>5 Void Power",
            done() { return player[this.layer].best.gte(5) },
            effectDescription: "Keeps Rage challenges on Void and Light resets.",
        },
        2: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>NULL AND UNDEFINED</alternate></p>25 Void Power",
            done() { return player[this.layer].best.gte(25) },
            effectDescription: "Keeps Hope upgrades on Void and Light resets.",
        },
        3: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>VOID AND UNDEFINED</alternate></p>50 Void Power",
            done() { return player[this.layer].best.gte(50) },
            effectDescription: "Unlocks more Hope upgrades.",
        },
        4: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>UNDEFINED AND UNDEFINED</alternate></p>1,000 Void Power",
            done() { return player[this.layer].best.gte(1000) },
            effectDescription: "Gain 10% of your Void Power gain on absorb every second.",
        },
    },

    update(delta) {
        player[this.layer].researchExp = player[this.layer].currentResearch
            ? player[this.layer].researchExp.add(player[this.layer].points.mul(delta))
            : new Decimal(0)
        if (player[this.layer].currentResearch && player[this.layer].researchExp.gte(tmp[this.layer].buyables[player[this.layer].currentResearch].cost)) {
            player[this.layer].researchExp = player[this.layer].researchExp.sub(tmp[this.layer].buyables[player[this.layer].currentResearch].cost)
            player[this.layer].buyables[player[this.layer].currentResearch] = player[this.layer].buyables[player[this.layer].currentResearch].add(1)
            buyMaxBuyable("skaia", 15)
        }
        if (hasMilestone(this.layer, 4))
            addPoints(this.layer, tmp[this.layer].resetGain.mul(delta).mul(0.1))
    },

    doReset(pLayer) {
        if (pLayer && layers[pLayer].row > layers[this.layer].row) {
            var listKeep = [];
            if ((pLayer === "aspLife" && hasMilestone("aspLife", 0)) || (pLayer === "aspDoom" && hasMilestone("aspDoom", 0)) || (layers[pLayer].row == 7 && hasMilestone("skaia", 0))) {
                listKeep.push("milestones")
            }
            layerDataReset(this.layer, listKeep)
        }
    },

    microtabs: {
        stuff: {
            "Milestones": {
                content: [
                    ["blank", "15px"],
                    "milestones",
                ]
            },
            "Enhancements": {
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
        { key: "l", description: "L: Absorb Light Power", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
})
