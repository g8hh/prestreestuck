addLayer("aspLight", {
    name: "Light",
    symbol: "<img src='data/light.png' style='width:calc(80%);height:calc(80%);margin:10%'></img>",
    row: 4,
    position: 1,
    branches: [],

    layerShown() { return (hasChallenge("aspRage", 15) || player[this.layer].unlocked) && !inChallenge("aspDoom", 12) && !hasUpgrade("skaia", 12) },
    resource: "Light Power",
    baseAmount() { return player.aspSpace.points },
    baseResource: "空间力量",
    color: "#f0840c",
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
        return {
            scalingPoint: tmp.aspVoid.buyables[12].effect.add(25)
        }
    },

    type: "normal",
    requires: new Decimal("4.13e590"),
    exponent: 0.03,
    gainMult() {
        mult = new Decimal(1)
        if (hasUpgrade("aspHope", 61)) mult = mult.mul(tmp.aspHope.upgrades[61].effect)
        return mult.mul(tmp.aspBreath.buyables[22].effect)
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
            cost(x) { return new Decimal(10).pow((x || getBuyableAmount(this.layer, this.id)).sub(tmp.aspLight.effect.scalingPoint).max(1).pow((x || getBuyableAmount(this.layer, this.id)).div(tmp.aspLight.effect.scalingPoint).sub(1).max(0).add(1).pow(0.2).sub(1))) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).pow(tmp.aspVoid.buyables[11].effect.mul(10)).pow(tmp.aspBreath.buyables[24].effect) },
            canAfford() { return true },
            title() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return formatWhole(amount) + "<br/>Point Levels<br/><h3 style='font-size:12px'>("
                    + (player[this.layer].currentResearch == this.id ? format(player[this.layer].researchExp) : "Idle") + " / " + format(data.cost)
                    + ")"
            },
            display() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "which are giving a " + format(data.effect) + "× boost to point gain"
            },
            buy() {
                player[this.layer].researchExp = new Decimal(0)
                player[this.layer].currentResearch = player[this.layer].currentResearch == this.id ? 0 : this.id
            },
        },
        12: {
            cost(x) { return new Decimal(15).pow((x || getBuyableAmount(this.layer, this.id)).sub(tmp.aspLight.effect.scalingPoint).max(1).pow((x || getBuyableAmount(this.layer, this.id)).div(tmp.aspLight.effect.scalingPoint).sub(1).max(0).add(1).pow(0.2).sub(1))) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).pow(tmp.aspVoid.buyables[11].effect.mul(7)).pow(tmp.aspBreath.buyables[24].effect) },
            canAfford() { return true },
            title() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return formatWhole(amount) + "<br/>Time Levels<br/><h3 style='font-size:12px'>("
                    + (player[this.layer].currentResearch == this.id ? format(player[this.layer].researchExp) : "Idle") + " / " + format(data.cost)
                    + ")"
            },
            display() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "which are giving a " + format(data.effect) + "× boost to Time Power gain"
            },
            buy() {
                player[this.layer].researchExp = new Decimal(0)
                player[this.layer].currentResearch = player[this.layer].currentResearch == this.id ? 0 : this.id
            },
        },
        13: {
            cost(x) { return new Decimal(25).pow((x || getBuyableAmount(this.layer, this.id)).sub(tmp.aspLight.effect.scalingPoint).max(1).pow((x || getBuyableAmount(this.layer, this.id)).div(tmp.aspLight.effect.scalingPoint).sub(1).max(0).add(1).pow(0.2).sub(1))) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).pow(tmp.aspVoid.buyables[11].effect.mul(5)).pow(tmp.aspBreath.buyables[24].effect) },
            canAfford() { return true },
            title() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return formatWhole(amount) + "<br/>Space Levels<br/><h3 style='font-size:12px'>("
                    + (player[this.layer].currentResearch == this.id ? format(player[this.layer].researchExp) : "Idle") + " / " + format(data.cost)
                    + ")"
            },
            display() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "which are giving a " + format(data.effect) + "× boost to Space Power gain"
            },
            buy() {
                player[this.layer].researchExp = new Decimal(0)
                player[this.layer].currentResearch = player[this.layer].currentResearch == this.id ? 0 : this.id
            },
        },
        14: {
            cost(x) { return new Decimal(50).pow((x || getBuyableAmount(this.layer, this.id)).sub(tmp.aspLight.effect.scalingPoint).max(1).pow((x || getBuyableAmount(this.layer, this.id)).div(tmp.aspLight.effect.scalingPoint).sub(1).max(0).add(1).pow(0.2).sub(1))) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).pow(tmp.aspVoid.buyables[11].effect.mul(3)).pow(tmp.aspBreath.buyables[24].effect) },
            canAfford() { return true },
            title() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return formatWhole(amount) + "<br/>Mind Levels<br/><h3 style='font-size:12px'>("
                    + (player[this.layer].currentResearch == this.id ? format(player[this.layer].researchExp) : "Idle") + " / " + format(data.cost)
                    + ")"
            },
            display() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "which are giving a " + format(data.effect) + "× boost to Mind Power gain"
            },
            buy() {
                player[this.layer].researchExp = new Decimal(0)
                player[this.layer].currentResearch = player[this.layer].currentResearch == this.id ? 0 : this.id
            },
        },
        15: {
            cost(x) { return new Decimal(75).pow((x || getBuyableAmount(this.layer, this.id)).sub(tmp.aspLight.effect.scalingPoint).max(1).pow((x || getBuyableAmount(this.layer, this.id)).div(tmp.aspLight.effect.scalingPoint).sub(1).max(0).add(1).pow(0.2).sub(1))) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).pow(tmp.aspVoid.buyables[11].effect.mul(4)).pow(tmp.aspBreath.buyables[24].effect) },
            canAfford() { return true },
            title() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return formatWhole(amount) + "<br/>Heart Levels<br/><h3 style='font-size:12px'>("
                    + (player[this.layer].currentResearch == this.id ? format(player[this.layer].researchExp) : "Idle") + " / " + format(data.cost)
                    + ")"
            },
            display() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "which are giving a " + format(data.effect) + "× boost to Heart Power gain"
            },
            buy() {
                player[this.layer].researchExp = new Decimal(0)
                player[this.layer].currentResearch = player[this.layer].currentResearch == this.id ? 0 : this.id
            },
        },
        16: {
            cost(x) { return new Decimal(100).pow((x || getBuyableAmount(this.layer, this.id)).sub(tmp.aspLight.effect.scalingPoint).max(1).pow((x || getBuyableAmount(this.layer, this.id)).div(tmp.aspLight.effect.scalingPoint).sub(1).max(0).add(1).pow(0.2).sub(1))) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).pow(tmp.aspVoid.buyables[11].effect.mul(2)).pow(tmp.aspBreath.buyables[24].effect) },
            canAfford() { return true },
            title() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return formatWhole(amount) + "<br/>Hope Levels<br/><h3 style='font-size:12px'>("
                    + (player[this.layer].currentResearch == this.id ? format(player[this.layer].researchExp) : "Idle") + " / " + format(data.cost)
                    + ")"
            },
            display() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "which are decreasing the Hope Essence requirement by ÷" + format(data.effect)
            },
            buy() {
                player[this.layer].researchExp = new Decimal(0)
                player[this.layer].currentResearch = player[this.layer].currentResearch == this.id ? 0 : this.id
            },
        },
        17: {
            cost(x) { return new Decimal(150).pow((x || getBuyableAmount(this.layer, this.id)).sub(tmp.aspLight.effect.scalingPoint).max(1).pow((x || getBuyableAmount(this.layer, this.id)).div(tmp.aspLight.effect.scalingPoint).sub(1).max(0).add(1).pow(0.2).sub(1))) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).pow(tmp.aspVoid.buyables[11].effect.mul(2)).pow(tmp.aspBreath.buyables[24].effect) },
            canAfford() { return true },
            title() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return formatWhole(amount) + "<br/>Rage Levels<br/><h3 style='font-size:12px'>("
                    + (player[this.layer].currentResearch == this.id ? format(player[this.layer].researchExp) : "Idle") + " / " + format(data.cost)
                    + ")"
            },
            display() {
                let data = temp[this.layer].buyables[this.id]
                let amount = getBuyableAmount(this.layer, this.id)
                return "which are decreasing the Rage Essence requirement by ÷" + format(data.effect)
            },
            buy() {
                player[this.layer].researchExp = new Decimal(0)
                player[this.layer].currentResearch = player[this.layer].currentResearch == this.id ? 0 : this.id
            },
        },
    },

    milestones: {
        0: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>LIGHT THE WAY</alternate></p>1 Light Power",
            done() { return player[this.layer].best.gte(1) },
            effectDescription: "Keeps all Hope and Rage milestones on Light resets. This is already getting repetitive.",
        },
        1: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>METAAUTOMATOR</alternate></p>10 Light Power",
            done() { return player[this.layer].best.gte(10) },
            toggles: [["aspLight", "autoAuto"]],
            effectDescription: "Automatically toggles Hope and Rage Essence auto-reset on.",
        },
        2: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>LOSSLESS ABSORBTION</alternate></p>100 Light Power",
            done() { return player[this.layer].best.gte(100) },
            effectDescription: "Absorbing Hope and Rage Essence doesn't reset anything. This does not apply to Rage Challenges though.",
        },
        3: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>NOT SO LOYAL COMPANION</alternate></p>1,000 Light Power",
            done() { return player[this.layer].best.gte(1000) },
            effectDescription: "Unlocks a new aspect layer.",
        },
        4: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>SUNSHINE</alternate></p>1,000,000 Light Power",
            done() { return player[this.layer].best.gte(1000000) },
            effectDescription: "Get 10% of your current Light Power gain per second.",
        },
    },

    update(delta) {
        player[this.layer].researchExp = player[this.layer].currentResearch
            ? player[this.layer].researchExp.add(player[this.layer].points.mul(delta))
            : new Decimal(0)
        if (player[this.layer].currentResearch && player[this.layer].researchExp.gte(tmp[this.layer].buyables[player[this.layer].currentResearch].cost)) {
            player[this.layer].researchExp = player[this.layer].researchExp.sub(tmp[this.layer].buyables[player[this.layer].currentResearch].cost)
            player[this.layer].buyables[player[this.layer].currentResearch] = player[this.layer].buyables[player[this.layer].currentResearch].add(1)
            buyMaxBuyable("skaia", 14)
        }
        if (player[this.layer].autoAuto) {
            player.aspHope.autoReset = true
            player.aspRage.autoReset = true
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
            "Researches": {
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
