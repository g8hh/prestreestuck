addLayer("aspTime", {
    name: "Time",
    symbol: "<img src='data/time.png' style='width:calc(80% - 2px);height:calc(80% - 2px);margin:10%'></img>",
    row: 0,
    position: 0,

    layerShown() { return !inChallenge("aspDoom", 12) && !hasUpgrade("skaia", 12) && !hasUpgrade("skaia", 14) },
    resource: "Time Power",
    baseAmount() { return player.points },
    baseResource: "点",
    color: "#b70d0e",
    resetDescription: "Absorb ",

    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },

    type: "normal",
    requires: new Decimal(10),
    exponent: 0.5,
    gainMult() {
        let mult = new Decimal(1).mul(tmp.aspSpace.effect.timeBoost)
        if (hasUpgrade("aspTime", 14)) mult = mult.mul(tmp.aspTime.upgrades[14].effect)
        if (hasUpgrade("aspTime", 21)) mult = mult.mul(tmp.aspTime.upgrades[21].effect)
        if (hasUpgrade("aspTime", 22)) mult = mult.mul(tmp.aspTime.upgrades[22].effect)
        if (hasUpgrade("aspMind", 12)) mult = mult.mul(tmp.aspMind.upgrades[12].effect)
        if (hasUpgrade("aspMind", 23)) mult = mult.mul(tmp.aspMind.upgrades[23].effect)
        if (hasUpgrade("aspHope", 22)) mult = mult.mul(tmp.aspHope.upgrades[22].effect)
        if (hasUpgrade("aspHope", 33)) mult = mult.mul(tmp.aspHope.upgrades[33].effect)
        if (hasUpgrade("aspHope", 52)) mult = mult.mul(tmp.aspHope.upgrades[52].effect)
        if (hasChallenge("aspRage", 12)) mult = mult.mul(tmp.aspRage.challenges[12].rewardEffect)
        if (getBuyableAmount("aspLife", 12).gt(0)) mult = mult.mul(tmp.aspLife.buyables[12].effect)
        mult = mult.mul(tmp.aspLight.buyables[12].effect)
        return mult
    },
    gainExp() {
        let mult = new Decimal(1)
        if (inChallenge("aspDoom", 11)) mult = mult.mul(0.75)
        if (inChallenge("aspRage", 12)) mult = mult.mul(1 / (challengeCompletions("aspRage", 12) + 2))
        return mult
    },

    upgrades: {
        rows: 2,
        cols: 5,
        11: {
            title: "<p style='transform: scale(-1, -1)'><alternate>USE THE TIME POWER</alternate>",
            description: "Time Power boosts point gain.",
            cost: new Decimal(1e28),
            effect() {
                let ret = player.aspTime.points.div(1e21).pow(0.3).add(15)
                ret = applyPolynomialSoftcap(ret, 1e6, 1.5)
                ret = applyPolynomialSoftcap(ret, 1e12, 2)
                ret = applyPolynomialSoftcap(ret, 1e36, 3)
                ret = applyPolynomialSoftcap(ret, 1e144, 4)
                ret = applyPolynomialSoftcap(ret, "1e720", 4)
                if (challengeCompletions("aspDoom", 11) >= 2) ret = ret.pow(5)
                if (challengeCompletions("aspDoom", 12) >= 4) ret = ret.pow(3)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return true },
        },
        12: {
            title: "<p style='transform: scale(-1, -1)'><alternate>POWER THE TIME</alternate>",
            description: "You total amount of Time Multipliers boosts your point gain.",
            cost: new Decimal(1e32),
            effect() {
                let ret = new Decimal(0)
                for (var a = 11; a <= 16; a++) ret = ret.add(player.aspTime.buyables[a])
                ret = ret.pow(ret.min(4.13e10).div(3500).add(1)).div(10).add(1)
                if (challengeCompletions("aspDoom", 11) >= 3) ret = ret.pow(2)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return true },
        },
        13: {
            title: "<p style='transform: scale(-1, -1)'><alternate>DILATE THE TIME CONTINUUM</alternate>",
            description: "Time Boosters scale less and worth more.",
            cost: new Decimal(1e37),
            unlocked() { return true },
        },
        14: {
            title: "<p style='transform: scale(-1, -1)'><alternate>SPACE IS BOOSTING TIME</alternate>",
            description: "Space Power boosts Time Power gain.",
            cost: new Decimal(1e50),
            effect() {
                let ret = player.aspSpace.points.div(1e10).add(1).pow(0.75)
                ret = applyPolynomialSoftcap(ret, 1e6, 2)
                if (challengeCompletions("aspDoom", 11) >= 5) ret = ret.pow(2)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return true },
        },
        15: {
            title: "<p style='transform: scale(-1, -1)'><alternate>THIS IS BORING</alternate>",
            description: "Add another Time Booster that reduces the price of the previous one.",
            cost: new Decimal(1e60),
            unlocked() { return true },
        },
        21: {
            title: "<p style='transform: scale(-1, -1)'><alternate>MIND IS BOOSTING TIME</alternate>",
            description: "Mind Power boosts Time Power gain.",
            effect() {
                let ret = player.aspMind.points.add(1).pow(0.65)
                ret = applyPolynomialSoftcap(ret, 1e6, 2)
                if (challengeCompletions("aspDoom", 11) >= 6) ret = ret.pow(4)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            cost: new Decimal(1e90),
            unlocked() { return hasUpgrade("aspSpace", 51) },
        },
        22: {
            title: "<p style='transform: scale(-1, -1)'><alternate>HEART IS BOOSTING TIME</alternate>",
            description: "Heart Power boosts Time Power gain.",
            effect() {
                let ret = player.aspHeart.points.add(1).pow(0.65)
                ret = applyPolynomialSoftcap(ret, 1e6, 2)
                if (challengeCompletions("aspDoom", 11) >= 6) ret = ret.pow(4)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            cost: new Decimal(1e120),
            unlocked() { return hasUpgrade("aspSpace", 51) },
        },
    },

    buyables: {
        rows: 1,
        cols: 6,
        11: {
            cost(x) { return new Decimal(1.12).pow(x || getBuyableAmount(this.layer, this.id)).div(tmp.aspTime.buyables[21].effect).div(tmp.aspTime.buyables[22].effect) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).mul(tmp.aspBreath.buyables[11].effect).mul(tmp.aspBlood.buyables[11].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Time Multiplier"
            },
            display() {
                return "which are boosting your point gain by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Time Power"
            },
            buy() {
                let base = new Decimal(1).div(tmp.aspTime.buyables[21].effect).div(tmp.aspTime.buyables[22].effect)
                let growth = 1.12
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade("aspHeart", 22)) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
        },
        12: {
            cost(x) { return new Decimal(1.2).pow(x || getBuyableAmount(this.layer, this.id)).mul(15).div(tmp.aspTime.buyables[21].effect).div(tmp.aspTime.buyables[22].effect) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(2).mul(tmp.aspBreath.buyables[11].effect).mul(tmp.aspBlood.buyables[11].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Time Multiplier^2"
            },
            display() {
                return "which are boosting your point gain by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Time Power"
            },
            buy() {
                let base = new Decimal(15).div(tmp.aspTime.buyables[21].effect).div(tmp.aspTime.buyables[22].effect)
                let growth = 1.2
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade("aspHeart", 22)) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
        },
        13: {
            cost(x) { return new Decimal(3).pow(x || getBuyableAmount(this.layer, this.id)).mul(200).div(tmp.aspTime.buyables[21].effect).div(tmp.aspTime.buyables[22].effect) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(3).mul(tmp.aspBreath.buyables[11].effect).mul(tmp.aspBlood.buyables[11].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Time Multiplier^3"
            },
            display() {
                return "which are boosting your point gain by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Time Power"
            },
            buy() {
                let base = new Decimal(200).div(tmp.aspTime.buyables[21].effect).div(tmp.aspTime.buyables[22].effect)
                let growth = 3
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade("aspHeart", 22)) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
        },
        14: {
            cost(x) { return new Decimal(20).pow(x || getBuyableAmount(this.layer, this.id)).mul(15000).div(tmp.aspTime.buyables[21].effect).div(tmp.aspTime.buyables[22].effect) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(4).mul(tmp.aspBreath.buyables[11].effect).mul(tmp.aspBlood.buyables[11].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Time Multiplier^4"
            },
            display() {
                return "which are boosting your point gain by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Time Power"
            },
            buy() {
                let base = new Decimal(15000).div(tmp.aspTime.buyables[21].effect).div(tmp.aspTime.buyables[22].effect)
                let growth = 20
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade("aspHeart", 22)) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
        },
        15: {
            cost(x) { return new Decimal(120).pow(x || getBuyableAmount(this.layer, this.id)).mul(1.2e6).div(tmp.aspTime.buyables[21].effect).div(tmp.aspTime.buyables[22].effect) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(5).mul(tmp.aspBreath.buyables[11].effect).mul(tmp.aspBlood.buyables[11].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Time Multiplier^5"
            },
            display() {
                return "which are boosting your point gain by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Time Power"
            },
            buy() {
                let base = new Decimal(1.2e6).div(tmp.aspTime.buyables[21].effect).div(tmp.aspTime.buyables[22].effect)
                let growth = 120
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade("aspHeart", 22)) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
        },
        16: {
            cost(x) { return new Decimal(413).pow(x || getBuyableAmount(this.layer, this.id)).mul(6.12e8).div(tmp.aspTime.buyables[21].effect).div(tmp.aspTime.buyables[22].effect) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(6).mul(tmp.aspBreath.buyables[11].effect).mul(tmp.aspBlood.buyables[11].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Time Multiplier^6"
            },
            display() {
                return "which are boosting your point gain by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Time Power"
            },
            buy() {
                let base = new Decimal(6.12e8).div(tmp.aspTime.buyables[21].effect).div(tmp.aspTime.buyables[22].effect)
                let growth = 413
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade("aspHeart", 22)) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
        },
        21: {
            cost(x) { return new Decimal(1e10).pow((x || getBuyableAmount(this.layer, this.id)).mul(hasUpgrade("aspTime", 13) ? 0.175 : 0.2).add(1).pow(hasUpgrade("aspTime", 13) ? 1.55 : 1.75)).div(tmp.aspTime.buyables[22].effect) },
            effect(x) {
                var eff = new Decimal(hasUpgrade("aspTime", 13) ? 612 : 413).pow(x || getBuyableAmount(this.layer, this.id))
                if (hasUpgrade("aspSpace", 33)) eff = eff.pow(1.08)
                return eff.pow(tmp.aspBreath.buyables[12].effect).pow(tmp.aspBlood.buyables[12].effect)
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Time Boosters"
            },
            display() {
                return "which are making all Time Multipliers " + format(tmp[this.layer].buyables[this.id].effect) + "× cheaper.\n\
                    Req: " + format(tmp[this.layer].buyables[this.id].cost) + " Time Power"
            },
            buy() {
                if (hasMilestone("skaia", 6)) {
                    var max = player.aspTime.points.mul(tmp.aspTime.buyables[22].effect).log(1e10).root(hasUpgrade("aspTime", 13) ? 1.55 : 1.75).sub(1).div(hasUpgrade("aspTime", 13) ? 0.175 : 0.2).floor().max(getBuyableAmount(this.layer, this.id))
                    setBuyableAmount(this.layer, this.id, max)
                } else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                if (!hasUpgrade("aspMind", 21)) {
                    player.points = new Decimal(0)
                    player[this.layer].points = new Decimal(10)
                    for (var a = 11; a <= 16; a++) setBuyableAmount(this.layer, a, new Decimal(0))
                }
            },
        },
        22: {
            cost(x) { return new Decimal(11).add((x || getBuyableAmount(this.layer, this.id)).add(1).pow(1.6).floor()) },
            effect(x) {
                var eff = new Decimal(612 * 413).pow(x || getBuyableAmount(this.layer, this.id))
                if (hasUpgrade("aspSpace", 33)) eff = eff.pow(1.08)
                return eff.pow(tmp.aspBreath.buyables[13].effect).pow(tmp.aspBlood.buyables[13].effect)
            },
            unlocked() { return hasUpgrade("aspTime", 15) },
            canAfford() { return player[this.layer].buyables[this.id - 1].gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Time Boosters^2"
            },
            display() {
                return "which are making all Time Multipliers and Time Boosters " + format(tmp[this.layer].buyables[this.id].effect) + "× cheaper.\n\
                    Req: " + format(tmp[this.layer].buyables[this.id].cost) + " Time Boosters"
            },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

                if (!hasUpgrade("aspMind", 23)) {
                    player.points = new Decimal(0)
                    player[this.layer].points = new Decimal(10)
                    for (var a = 11; a <= 16; a++) setBuyableAmount(this.layer, a, new Decimal(0))
                    for (var a = 21; a <= 21; a++) setBuyableAmount(this.layer, a, new Decimal(0))
                }
            },
        },
    },

    microtabs: {
        stuff: {
            "Multipliers": {
                content: [
                    ["blank", "15px"],
                    ["row", [["buyable", 11], ["buyable", 12], ["buyable", 13]]],
                    ["row", [["buyable", 14], ["buyable", 15], ["buyable", 16]]],
                    ["blank", "15px"],
                    ["row", [["buyable", 21], ["buyable", 22]]],
                ]
            },
            "Upgrades": {
                unlocked: () => hasUpgrade("aspSpace", 21),
                content: [
                    ["blank", "15px"],
                    "upgrades"
                ]
            },
        },
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        ["blank", "25px"],
        ["display-text", () => "<h5 style='opacity:0.5'>Beginner tip: Hold T to automatically absorb Time Power</h5>"],
        ["blank", "15px"],
        ["microtabs", "stuff"],
        ["blank", "35px"],
    ],

    hotkeys: [
        { key: "t", description: "T: Absorb Time Power", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
})