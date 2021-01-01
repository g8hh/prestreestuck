addLayer("aspSpace", {
    name: "Space",
    symbol: "<img src='data/space.png' style='width:calc(80% - 2px);height:calc(80% - 2px);margin:10%'></img>",
    row: 1,
    position: 0,
    branches: ["aspTime", "aspLight"],

    layerShown() { return !inChallenge("aspDoom", 12) },
    resource: "Space Power",
    baseAmount() { return player.points },
    baseResource: "points",
    color: "#000000",
    resetDescription: "Absorb ",

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            space: new Decimal(0),
            generatorTotals: [
                new Decimal(0),
                new Decimal(0),
                new Decimal(0),
                new Decimal(0),
                new Decimal(0),
                new Decimal(0),
            ]
        }
    },
    effect() {
        return {
            timeBoost: applyPolynomialSoftcap(Decimal.pow(player[this.layer].space, 0.5).add(1), 1e6, 2),
        }
    },

    type: "normal",
    requires: new Decimal(4.13e21),
    exponent: 0.2,
    gainMult() {
        mult = new Decimal(1)
        if (hasUpgrade("aspSpace", 31)) mult = mult.mul(tmp.aspSpace.upgrades[31].effect)
        if (hasUpgrade("aspMind", 13)) mult = mult.mul(tmp.aspMind.upgrades[13].effect)
        if (hasUpgrade("aspHope", 23)) mult = mult.mul(tmp.aspHope.upgrades[23].effect)
        if (hasUpgrade("aspHope", 32)) mult = mult.mul(tmp.aspHope.upgrades[32].effect)
        if (hasChallenge("aspRage", 13)) mult = mult.mul(tmp.aspRage.challenges[13].rewardEffect)
        if (getBuyableAmount("aspLife", 13).gt(0)) mult = mult.mul(tmp.aspLife.buyables[13].effect)
        mult = mult.mul(tmp.aspLight.buyables[13].effect)
        mult = mult.mul(tmp.aspBreath.buyables[14].effect)
        return mult
    },
    gainExp() {
        let mult = new Decimal(1)
        if (inChallenge("aspDoom", 11)) mult = mult.mul(0.75)
        if (inChallenge("aspRage", 13)) mult = mult.mul(1 / (challengeCompletions("aspRage", 13) + 2))
        return mult
    },

    upgrades: {
        rows: 5,
        cols: 4,
        11: {
            title: "<p style='transform: scale(-1, -1)'><alternate>WAIT THIS ISNT HOMESTUCK</alternate>",
            description: "Points boost point gain.",
            cost: new Decimal(100),
            effect() {
                let ret = player.points.div(1e21).pow(0.4).add(1.5)
                ret = applyPolynomialSoftcap(ret, 1e6, 1.5)
                ret = applyPolynomialSoftcap(ret, 1e12, 2)
                ret = applyPolynomialSoftcap(ret, 1e36, 3)
                ret = applyPolynomialSoftcap(ret, 1e144, 4)
                ret = applyPolynomialSoftcap(ret, "1e720", 4)
                if (challengeCompletions("aspDoom", 12) >= 6) ret = ret.pow(3)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Space",
            currencyInternalName: "space",
            unlocked() { return true },
        },
        12: {
            title: "<p style='transform: scale(-1, -1)'><alternate>REMOVE CARPAL TUNNEL</alternate>",
            description: "Gain 10% of your Time Power gain on absorb per second.",
            cost: new Decimal(10000),
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Space",
            currencyInternalName: "space",
            unlocked() { return true },
        },
        13: {
            title: "<p style='transform: scale(-1, -1)'><alternate>IS THIS THING A JOKE</alternate>",
            description: "Your Space Power gain on absorb boosts point gain.",
            cost: new Decimal(1000000),
            effect() {
                let ret = Decimal.pow(tmp.aspSpace.resetGain, 0.75).mul(2.5).add(10)
                ret = applyPolynomialSoftcap(ret, 1e6, 1.5)
                ret = applyPolynomialSoftcap(ret, 1e12, 2)
                ret = applyPolynomialSoftcap(ret, 1e36, 3)
                ret = applyPolynomialSoftcap(ret, 1e144, 4)
                ret = applyPolynomialSoftcap(ret, "1e720", 4)
                if (challengeCompletions("aspDoom", 12) >= 7) ret = ret.pow(4)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Space",
            currencyInternalName: "space",
            unlocked() { return true },
        },
        14: {
            title: "<p style='transform: scale(-1, -1)'><alternate>REMOVE CARPAL TUNNEL AGAIN</alternate>",
            description: "Automatically max-upgrades your Time Multipliers for you every tick.",
            cost: new Decimal(100000000),
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Space",
            currencyInternalName: "space",
            unlocked() { return true },
        },
        21: {
            title: "<p style='transform: scale(-1, -1)'><alternate>ADD SOMETHING TO THE GAME</alternate>",
            description: "Adds upgrades to the Time layer",
            cost: new Decimal(1e10),
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Space",
            currencyInternalName: "space",
            unlocked() { return true },
        },
        22: {
            title: "<p style='transform: scale(-1, -1)'><alternate>REMOVE MORE CARPAL TUNNEL</alternate>",
            description: "Automatically get Time Boosters for you every tick.",
            cost: new Decimal(1e12),
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Space",
            currencyInternalName: "space",
            unlocked() { return true },
        },
        23: {
            title: "<p style='transform: scale(-1, -1)'><alternate>NO I MEAN THE HOMESTUCK SOMETHING</alternate>",
            description: "Unspent Space Power boosts point gain.",
            cost: new Decimal(1e14),
            effect() {
                let ret = player.aspSpace.points.mul(5).add(1000)
                ret = applyPolynomialSoftcap(ret, 1e6, 1.5)
                ret = applyPolynomialSoftcap(ret, 1e12, 2)
                ret = applyPolynomialSoftcap(ret, 1e36, 3)
                ret = applyPolynomialSoftcap(ret, 1e144, 4)
                ret = applyPolynomialSoftcap(ret, "1e720", 4)
                if (challengeCompletions("aspDoom", 12) >= 8) ret = ret.pow(4)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Space",
            currencyInternalName: "space",
            unlocked() { return true },
        },
        24: {
            title: "<p style='transform: scale(-1, -1)'><alternate>TIME IS FASTER BASED ON SPACE</alternate>",
            description: "Faster Time Power generation based on Space Power.",
            cost: new Decimal(1e16),
            effect() {
                let ret = player.aspSpace.points.add(1).log(2)
                return ret
            },
            effectDisplay() { return "+" + format(this.effect()) + "%" },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Space",
            currencyInternalName: "space",
            unlocked() { return true },
        },
        31: {
            title: "<p style='transform: scale(-1, -1)'><alternate>TIME IS BOOSTING SPACE</alternate>",
            description: "Time Power boosts Space Power gain.",
            cost: new Decimal(1e18),
            effect() {
                let ret = player.aspTime.points.div(1e45).add(1).pow(0.1)
                if (challengeCompletions("aspDoom", 12) >= 9) ret = ret.pow(3)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Space",
            currencyInternalName: "space",
            unlocked() { return true },
        },
        32: {
            title: "<p style='transform: scale(-1, -1)'><alternate>RECONSTRUCT STRATEGY</alternate>",
            description: "Autobuyer prioritizes later Time Multipliers instead of earlier ones.",
            cost: new Decimal(1e20),
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Space",
            currencyInternalName: "space",
            unlocked() { return true },
        },
        33: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INCREASE BOOSTING EFFICIENCY</alternate>",
            description: "^1.08 all Time Boosters effect.",
            cost: new Decimal(1e22),
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Space",
            currencyInternalName: "space",
            unlocked() { return true },
        },
        34: {
            title: "<p style='transform: scale(-1, -1)'><alternate>ALSO RECONSTRUCT STRATEGY</alternate>",
            description: "Autobuyer prioitizes Time Boosters instead of Time Multipliers.",
            cost: new Decimal(1e24),
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Space",
            currencyInternalName: "space",
            unlocked() { return true },
        },
        41: {
            title: "<p style='transform: scale(-1, -1)'><alternate>NO ITS NOT CANON YET</alternate>",
            description: "Unlocks new aspect layers.",
            unlocked() { return !player.aspHeart.unlocked || !player.aspMind.unlocked },
            cost: new Decimal(1e26),
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Space",
            currencyInternalName: "space",
        },
        51: {
            title: "<p style='transform: scale(-1, -1)'><alternate>A REPLACEMENT UPGRADE</alternate>",
            description: "Adds more upgrades to the Time layer.",
            unlocked() { return player.aspHeart.unlocked && player.aspMind.unlocked },
            cost: new Decimal(1e28),
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Space",
            currencyInternalName: "space",
        },
        52: {
            title: "<p style='transform: scale(-1, -1)'><alternate>AUTOMATE SPACE GENERATORS</alternate>",
            description: "Buys 1 of each Space Generators and Space Accelerators per tick.",
            unlocked() { return player.aspHeart.unlocked && player.aspMind.unlocked },
            cost: new Decimal(1e32),
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Space",
            currencyInternalName: "space",
        },
        53: {
            title: "<p style='transform: scale(-1, -1)'><alternate>FINALLY UPGRADES AUTOBUYERS</alternate>",
            description: "Automatically buys Time upgrades.",
            unlocked() { return player.aspHeart.unlocked && player.aspMind.unlocked },
            cost: new Decimal(1e38),
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Space",
            currencyInternalName: "space",
        },
        54: {
            title: "<p style='transform: scale(-1, -1)'><alternate>TIME AUTO BOOSTER SQUARED</alternate>",
            description: "Automatically get Time Booster^2s.",
            unlocked() { return player.aspHeart.unlocked && player.aspMind.unlocked },
            cost: new Decimal(1e44),
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Space",
            currencyInternalName: "space",
        },
    },

    buyables: {
        rows: 1,
        cols: 4,
        11: {
            cost(x) { return new Decimal(5).pow((x || getBuyableAmount(this.layer, this.id)).div(hasUpgrade("aspHeart", 21) ? 1 : 10).floor()) },
            effect(x) { return player.aspSpace.generatorTotals[this.id - 11].mul(Decimal.pow(2, (x || getBuyableAmount(this.layer, this.id)).div(hasUpgrade("aspHeart", 21) ? 1 : 10).floor())).mul(0.1).mul(tmp.aspSpace.buyables[21].effect).mul(tmp.aspBreath.buyables[15].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(player.aspSpace.generatorTotals[this.id - 11], 0) + " (" + format(getBuyableAmount(this.layer, this.id), 0) + ")<br/>Space Generator"
            },
            display() {
                return "which are giving " + format(tmp[this.layer].buyables[this.id].effect) + " Space per second.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Space Power"
            },
            buy() {
                if (hasUpgrade("aspHeart", 22) && hasUpgrade("aspHope", 41)) {
                    let base = 1
                    let growth = 5
                    let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                    if (!hasUpgrade("aspHeart", 22)) player[this.layer].points = player[this.layer].points.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                    player.aspSpace.generatorTotals[this.id - 11] = player.aspSpace.generatorTotals[this.id - 11].add(max)
                } else {
                    if (!hasUpgrade("aspHeart", 22)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    player.aspSpace.generatorTotals[this.id - 11] = player.aspSpace.generatorTotals[this.id - 11].add(hasUpgrade("aspHeart", 21) ? 10 : 1)
                }
            },
        },
        12: {
            cost(x) { return new Decimal(200).pow((x || getBuyableAmount(this.layer, this.id)).div(hasUpgrade("aspHeart", 21) ? 1 : 10).floor()).mul(10) },
            effect(x) { return player.aspSpace.generatorTotals[this.id - 11].mul(Decimal.pow(2, (x || getBuyableAmount(this.layer, this.id)).div(hasUpgrade("aspHeart", 21) ? 1 : 10).floor())).mul(0.1).mul(tmp.aspSpace.buyables[21].effect).mul(tmp.aspBreath.buyables[15].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(player.aspSpace.generatorTotals[this.id - 11], 0) + " (" + format(getBuyableAmount(this.layer, this.id), 0) + ")<br/>Space Generator^2"
            },
            display() {
                return "which are giving " + format(tmp[this.layer].buyables[this.id].effect) + " Space Generators per second.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Space Power"
            },
            buy() {
                if (hasUpgrade("aspHeart", 22) && hasUpgrade("aspHope", 41)) {
                    let base = 10
                    let growth = 200
                    let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                    if (!hasUpgrade("aspHeart", 22)) player[this.layer].points = player[this.layer].points.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                    player.aspSpace.generatorTotals[this.id - 11] = player.aspSpace.generatorTotals[this.id - 11].add(max)
                } else {
                    if (!hasUpgrade("aspHeart", 22)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    player.aspSpace.generatorTotals[this.id - 11] = player.aspSpace.generatorTotals[this.id - 11].add(hasUpgrade("aspHeart", 21) ? 10 : 1)
                }
            },
        },
        13: {
            cost(x) { return new Decimal(100000).pow((x || getBuyableAmount(this.layer, this.id)).div(hasUpgrade("aspHeart", 21) ? 1 : 10).floor()).mul(1000) },
            effect(x) { return player.aspSpace.generatorTotals[this.id - 11].mul(Decimal.pow(2, (x || getBuyableAmount(this.layer, this.id)).div(hasUpgrade("aspHeart", 21) ? 1 : 10).floor())).mul(0.1).mul(tmp.aspSpace.buyables[21].effect).mul(tmp.aspBreath.buyables[15].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(player.aspSpace.generatorTotals[this.id - 11], 0) + " (" + format(getBuyableAmount(this.layer, this.id), 0) + ")<br/>Space Generator^3"
            },
            display() {
                return "which are giving " + format(tmp[this.layer].buyables[this.id].effect) + " Space Generator^2s per second.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Space Power"
            },
            buy() {
                if (hasUpgrade("aspHeart", 22) && hasUpgrade("aspHope", 41)) {
                    let base = 1000
                    let growth = 100000
                    let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                    if (!hasUpgrade("aspHeart", 22)) player[this.layer].points = player[this.layer].points.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                    player.aspSpace.generatorTotals[this.id - 11] = player.aspSpace.generatorTotals[this.id - 11].add(max)
                } else {
                    if (!hasUpgrade("aspHeart", 22)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    player.aspSpace.generatorTotals[this.id - 11] = player.aspSpace.generatorTotals[this.id - 11].add(hasUpgrade("aspHeart", 21) ? 10 : 1)
                }
            },
        },
        14: {
            cost(x) { return new Decimal(2500000000).pow((x || getBuyableAmount(this.layer, this.id)).div(hasUpgrade("aspHeart", 21) ? 1 : 10).floor()).mul(1000000) },
            effect(x) { return player.aspSpace.generatorTotals[this.id - 11].mul(Decimal.pow(2, (x || getBuyableAmount(this.layer, this.id)).div(hasUpgrade("aspHeart", 21) ? 1 : 10).floor())).mul(0.1).mul(tmp.aspSpace.buyables[21].effect).mul(tmp.aspBreath.buyables[15].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(player.aspSpace.generatorTotals[this.id - 11], 0) + " (" + format(getBuyableAmount(this.layer, this.id), 0) + ")<br/>Space Generator^4"
            },
            display() {
                return "which are giving " + format(tmp[this.layer].buyables[this.id].effect) + " Space Generator^3s per second.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Space Power"
            },
            buy() {
                if (hasUpgrade("aspHeart", 22) && hasUpgrade("aspHope", 41)) {
                    let base = 1000000
                    let growth = 2500000000
                    let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                    if (!hasUpgrade("aspHeart", 22)) player[this.layer].points = player[this.layer].points.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                    player.aspSpace.generatorTotals[this.id - 11] = player.aspSpace.generatorTotals[this.id - 11].add(max)
                } else {
                    if (!hasUpgrade("aspHeart", 22)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    player.aspSpace.generatorTotals[this.id - 11] = player.aspSpace.generatorTotals[this.id - 11].add(hasUpgrade("aspHeart", 21) ? 10 : 1)
                }
            },
        },
        15: {
            cost(x) { return new Decimal(4.12e15).pow((x || getBuyableAmount(this.layer, this.id)).div(hasUpgrade("aspHeart", 21) ? 1 : 10).floor()).mul(1e12) },
            effect(x) { return player.aspSpace.generatorTotals[this.id - 11].mul(Decimal.pow(2, (x || getBuyableAmount(this.layer, this.id)).div(hasUpgrade("aspHeart", 21) ? 1 : 10).floor())).mul(0.1).mul(tmp.aspSpace.buyables[21].effect).mul(tmp.aspBreath.buyables[15].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(player.aspSpace.generatorTotals[this.id - 11], 0) + " (" + format(getBuyableAmount(this.layer, this.id), 0) + ")<br/>Space Generator^5"
            },
            display() {
                return "which are giving " + format(tmp[this.layer].buyables[this.id].effect) + " Space Generator^4s per second.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Space Power"
            },
            buy() {
                if (hasUpgrade("aspHeart", 22) && hasUpgrade("aspHope", 41)) {
                    let base = 1e12
                    let growth = 4.12e15
                    let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                    if (!hasUpgrade("aspHeart", 22)) player[this.layer].points = player[this.layer].points.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                    player.aspSpace.generatorTotals[this.id - 11] = player.aspSpace.generatorTotals[this.id - 11].add(max)
                } else {
                    if (!hasUpgrade("aspHeart", 22)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    player.aspSpace.generatorTotals[this.id - 11] = player.aspSpace.generatorTotals[this.id - 11].add(hasUpgrade("aspHeart", 21) ? 10 : 1)
                }
            },
        },
        16: {
            cost(x) { return new Decimal(6.12e30).pow((x || getBuyableAmount(this.layer, this.id)).div(hasUpgrade("aspHeart", 21) ? 1 : 10).floor()).mul(1e20) },
            effect(x) { return player.aspSpace.generatorTotals[this.id - 11].mul(Decimal.pow(2, (x || getBuyableAmount(this.layer, this.id)).div(hasUpgrade("aspHeart", 21) ? 1 : 10).floor())).mul(0.1).mul(tmp.aspSpace.buyables[21].effect).mul(tmp.aspBreath.buyables[15].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(player.aspSpace.generatorTotals[this.id - 11], 0) + " (" + format(getBuyableAmount(this.layer, this.id), 0) + ")<br/>Space Generator^6"
            },
            display() {
                return "which are giving " + format(tmp[this.layer].buyables[this.id].effect) + " Space Generator^5s per second.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Space Power"
            },
            buy() {
                if (hasUpgrade("aspHeart", 22) && hasUpgrade("aspHope", 41)) {
                    let base = 6.12e30
                    let growth = 1e20
                    let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                    if (!hasUpgrade("aspHeart", 22)) player[this.layer].points = player[this.layer].points.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                    player.aspSpace.generatorTotals[this.id - 11] = player.aspSpace.generatorTotals[this.id - 11].add(max)
                } else {
                    if (!hasUpgrade("aspHeart", 22)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    player.aspSpace.generatorTotals[this.id - 11] = player.aspSpace.generatorTotals[this.id - 11].add(hasUpgrade("aspHeart", 21) ? 10 : 1)
                }
            },
        },
        21: {
            cost(x) { return new Decimal(10).pow((x || getBuyableAmount(this.layer, this.id))).mul(1000) },
            effect(x) { return Decimal.pow(1.08, (x || getBuyableAmount(this.layer, this.id))).mul(tmp.aspBreath.buyables[16].effect) },
            canAfford() { return player[this.layer].space.gte(this.cost()) },
            unlocked() { return player.aspHeart.unlocked || player.aspMind.unlocked },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Space Accelerator"
            },
            display() {
                return "which are making all Space Generators " + format(tmp[this.layer].buyables[this.id].effect) + "× faster.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Space"
            },
            buy() {
                if (hasUpgrade("aspHope", 41)) {
                    let base = 1000
                    let growth = 10
                    let max = Decimal.affordGeometricSeries(player[this.layer].space, base, growth, getBuyableAmount(this.layer, this.id))
                    let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                    player[this.layer].space = player[this.layer].space.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                } else {
                    player[this.layer].space = player[this.layer].space.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
        },
    },

    update(delta) {
        {
            let mult = new Decimal(1)
            if (hasUpgrade("aspMind", 14)) mult = mult.mul(tmp.aspMind.upgrades[14].effect)
            player.aspSpace.space = player.aspSpace.space.add(tmp.aspSpace.buyables[11].effect.mul(delta).mul(mult))
            for (var a = 12; a <= 16; a++)
                player.aspSpace.generatorTotals[a - 12] = player.aspSpace.generatorTotals[a - 12].add(tmp.aspSpace.buyables[a].effect.mul(delta).mul(mult))
        }
        if (hasUpgrade("aspSpace", 12)) {
            let mult = new Decimal(0.1)
            if (hasUpgrade("aspSpace", 24)) mult = mult.mul(tmp.aspSpace.upgrades[24].effect.div(100).add(1))
            addPoints("aspTime", tmp.aspTime.resetGain.mul(delta).mul(mult))
        }

        if (hasUpgrade("aspSpace", 34)) buyBuyable("aspTime", 21)
        if (hasUpgrade("aspSpace", 14)) {
            if (hasUpgrade("aspSpace", 32)) for (var a = 16; a >= 11; a--) buyBuyable("aspTime", a)
            else for (var a = 11; a <= 16; a++) buyBuyable("aspTime", a)
        }
        if (hasUpgrade("aspSpace", 22)) buyBuyable("aspTime", 21)
        if (hasUpgrade("aspSpace", 54)) buyBuyable("aspTime", 22)


        if (hasUpgrade("aspSpace", 52)) {
            for (var a = 11; a <= 16; a++) buyBuyable("aspSpace", a)
            for (var a = 21; a <= 21; a++) buyBuyable("aspSpace", a)
        }
        if (hasUpgrade("aspSpace", 53)) {
            for (var a = 1; a <= 2; a++) for (var b = 1; b <= 5; b++) {
                buyUpgrade("aspTime", a * 10 + b)
            }
        }
    },

    doReset(pLayer) {
        if (pLayer && layers[pLayer].row > layers[this.layer].row) {
            var listKeep = [];
            var upgradeKeep = [];
            if ((pLayer === "aspMind" && hasMilestone("aspMind", 0)) || (pLayer === "aspHeart" && hasMilestone("aspHeart", 2))) {
                upgradeKeep.push(12, 14, 22, 24, 32, 34)
            }
            if ((pLayer === "aspMind" && hasMilestone("aspMind", 1)) || (pLayer === "aspHeart" && hasMilestone("aspHeart", 0))) {
                upgradeKeep.push(11, 13, 21)
            }
            if ((pLayer === "aspMind" && hasMilestone("aspMind", 2)) || (pLayer === "aspHeart" && hasMilestone("aspHeart", 1))) {
                upgradeKeep.push(23, 31, 33)
            }
            if ((pLayer === "aspMind" && hasMilestone("aspMind", 4)) || (pLayer === "aspHeart" && hasMilestone("aspHeart", 4))) {
                upgradeKeep.push(51, 52, 53, 54)
            }
            if ((pLayer === "aspHope" && hasMilestone("aspHope", 0)) || (pLayer === "aspRage" && hasMilestone("aspRage", 0)) || (pLayer === "aspDoom" && hasMilestone("aspDoom", 2)) || (layers[pLayer].row == 7 && hasMilestone("skaia", 4))) {
                upgradeKeep = [11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 51, 52, 53, 54]
            }
            layerDataReset("aspSpace", listKeep)
            player.aspSpace.upgrades = upgradeKeep;
        }
    },

    microtabs: {
        stuff: {
            "Generators": {
                content: [
                    ["blank", "15px"],
                    ["row", [["buyable", 11], ["buyable", 12], ["buyable", 13]]],
                    ["row", [["buyable", 14], ["buyable", 15], ["buyable", 16]]],
                    ["blank", "15px"],
                    ["row", [["buyable", 21]]],
                ]
            },
            "Upgrades": {
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
        ["blank", "35px"],
        ["display-text", () => "You have " + format(player.aspSpace.space) + " Space, which are giving a ×" + format(tmp.aspSpace.effect.timeBoost) + " boost to Time Power gain"],
        ["blank", "25px"],
        ["microtabs", "stuff"],
        ["blank", "35px"],
    ],

    hotkeys: [
        { key: "s", description: "S: Absorb Space Power", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
})
