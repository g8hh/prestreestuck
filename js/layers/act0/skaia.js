if (act == 0) addLayer("skaia", {
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
        return "Skaia 等级 " + formatWhole(player.skaia.level) + "\n" + formatWhole(player.skaia.points.floor()) + " Echepoints\n" + (!tmp.skaia.effect.climbReq || tmp.skaia.effect.climbReq.gte(1e9) ? "" : "(+" + format((player.skaia.points % 1) * 100) + "%)")
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
        13: {
            fullDisplay: "<h3>INFLATE.</h3><br/>Need " + format("eeee1111") + " points<br/>(PS: Might contains flashing lights.)",
            canAfford() { return player.points.gte("eeee1111") },
            pay() {
                player.phaseTimer = 0
                player.tab = "none";

                ["metaAspects", "metaClasses", "metaProspit", "metaDerse"].forEach(x => {
                    layerDataReset(x)
                    player[x].unlocked = false
                })

                player.points = new Decimal(1)
                player.skaia.level = new Decimal(1)
                player.skaia.points = new Decimal(0)
                player.skaia.boondollars = new Decimal(0)
                player.subtabs.skaia.stuff = "Meta"

                player.skaia.upgrades = ["13"]
            },
            unlocked() { return hasUpgrade("skaia", 90) },
        },
        14: {
            fullDisplay: "",
            canAfford() { return true },
            unlocked() { return true },
            pay() {
                ["aspTime", "aspSpace", "aspMind", "aspHeart", "aspHope", "aspRage", "aspLight", "aspVoid", "aspLife", "aspDoom", "aspBlood", "aspBreath",
                "metaAspects", "metaClasses", "metaProspit", "metaDerse"].forEach(x => {
                    layerDataReset(x)
                    player[x].unlocked = false
                })

                player.skaia.level = new Decimal(1)
                player.skaia.points = new Decimal(0)
                player.skaia.boondollars = new Decimal(0)
                player.subtabs.skaia.stuff = "Meta"},
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
                if (hasUpgrade("skaia", 41)) ret = ret.pow(upgradeEffect("skaia", 41))
                if (hasUpgrade("skaia", 43)) ret = ret.mul(player.skaia.level.add(1).pow(hasUpgrade("skaia", 47) ? 2 : 0.25))
                if (hasUpgrade("skaia", 44)) ret = ret.pow(upgradeEffect("skaia", 44))
                if (hasUpgrade("skaia", 45)) ret = ret.pow(upgradeEffect("skaia", 45))

                if (hasMilestone("metaDerse", 6)) ret = ret.pow(tmp.metaDerse.milestones[6].effect)
                if (hasMilestone("metaProspit", 6)) ret = ret.pow(tmp.metaProspit.milestones[6].effect)
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
                if (hasUpgrade("skaia", 41)) ret = ret.pow(upgradeEffect("skaia", 41))
                if (hasUpgrade("skaia", 43)) ret = ret.mul(player.skaia.level.add(1).pow(hasUpgrade("skaia", 47) ? 2 : 0.25))
                if (hasUpgrade("skaia", 44)) ret = ret.pow(upgradeEffect("skaia", 44))
                if (hasUpgrade("skaia", 45)) ret = ret.pow(upgradeEffect("skaia", 45))

                if (hasMilestone("metaDerse", 6)) ret = ret.pow(tmp.metaDerse.milestones[6].effect)
                if (hasMilestone("metaProspit", 6)) ret = ret.pow(tmp.metaProspit.milestones[6].effect)
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
                if (hasUpgrade("skaia", 41)) ret = ret.pow(upgradeEffect("skaia", 41))
                if (hasUpgrade("skaia", 43)) ret = ret.mul(player.skaia.level.add(1).pow(hasUpgrade("skaia", 47) ? 2 : 0.25))
                if (hasUpgrade("skaia", 44)) ret = ret.pow(upgradeEffect("skaia", 44))
                if (hasUpgrade("skaia", 45)) ret = ret.pow(upgradeEffect("skaia", 45))

                if (hasMilestone("metaDerse", 6)) ret = ret.pow(tmp.metaDerse.milestones[6].effect)
                if (hasMilestone("metaProspit", 6)) ret = ret.pow(tmp.metaProspit.milestones[6].effect)
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
        38: {
            title: "<p style='transform: scale(-1, -1)'><alternate>ALTERNATE PROGRESSION</alternate>",
            description: "All Aspect Powers are procedually generated instead of bought.",
            cost: new Decimal("ee82500"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 35) && hasUpgrade("skaia", 36) && hasUpgrade("skaia", 37) },
        },
        39: {
            title: "<p style='transform: scale(-1, -1)'><alternate>REPLACING ALL THE PROCESS</alternate>",
            description: "Replace the process of getting Aspect Shards.",
            cost: new Decimal("ee100000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 35) && hasUpgrade("skaia", 36) && hasUpgrade("skaia", 37) },
        },
        40: {
            title: "<p style='transform: scale(-1, -1)'><alternate>FULLY REFURBISHED</alternate>",
            description: "Replace the process of getting Aspect Essences.",
            cost: new Decimal("ee105000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 35) && hasUpgrade("skaia", 36) && hasUpgrade("skaia", 37) },
        },
        41: {
            title: "<p style='transform: scale(-1, -1)'><alternate>CLASS POINTS INFINITED CUBED</alternate>",
            effect: new Decimal(Math.log(5) / Math.log(3)),
            description: "Vicsek fractals (^" + format(Math.log(5) / Math.log(3), 3) + ") all of the second upgrade row effect.",
            cost: new Decimal("ee132500"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 40) },
        },
        42: {
            title: "<p style='transform: scale(-1, -1)'><alternate>PROGRESSION SQUARED</alternate>",
            effect() {
                var ret = player.metaClasses.points.add(1).log(10).div(10).add(1).pow(0.35)
                if (hasMilestone("metaDerse", 7)) ret = ret.mul(tmp.metaDerse.milestones[7].effect)
                if (hasMilestone("metaProspit", 7)) ret = ret.mul(tmp.metaProspit.milestones[7].effect)
                if (hasMilestone("metaDerse", 8)) ret = ret.mul(tmp.metaDerse.milestones[8].effect)
                if (hasMilestone("metaProspit", 8)) ret = ret.mul(tmp.metaProspit.milestones[8].effect)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            description: "Shard and Essence replacements are stronger based on Class Points.",
            cost: new Decimal("ee205000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 41) },
        },
        43: {
            title: "<p style='transform: scale(-1, -1)'><alternate>CLASS POINTS INFINITED TESSERACTED</alternate>",
            description: "Multiplies all of the second upgrade row effect with the fourth root of Skaia level plus 1, after all above power upgrades.",
            cost: new Decimal("ee336699"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 42) },
            style: { "width": "140px", "height": "140px" },
        },
        44: {
            title: "<p style='transform: scale(-1, -1)'><alternate>CLASS POINTS INFINITED PENTERACTED</alternate>",
            description: "Boosts all of the second upgrade row effect, based on Aspect Points, including the above upgrade's effect.",
            effect() {
                var ret = player.metaAspects.points.add(1).slog().div(10).add(1)
                if (hasMilestone("metaDerse", 7)) ret = ret.mul(tmp.metaDerse.milestones[7].effect)
                if (hasMilestone("metaProspit", 7)) ret = ret.mul(tmp.metaProspit.milestones[7].effect)
                return ret
            },
            effectDisplay() { return "^" + format(this.effect()) },
            cost: new Decimal("ee441122"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 43) },
            style: { "width": "160px", "height": "160px" },
        },
        45: {
            title: "<p style='transform: scale(-1, -1)'><alternate>CLASS POINTS INFINITED HEXERACTED</alternate>",
            description: "Boosts all of the second upgrade row effect, based on Class Points.",
            effect() {
                return player.metaClasses.points.add(1).slog().div(15).add(1)
            },
            effectDisplay() { return "^" + format(this.effect()) },
            cost: new Decimal("ee1000000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 44) },
            style: { "width": "180px", "height": "180px" },
        },
        46: {
            title: "<p style='transform: scale(-1, -1)'><alternate>PROGRESSION CUBED</alternate>",
            description: "Shard and Essence replacements scales better.",
            cost: new Decimal("ee1220000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 45) },
            style: { "width": "200px", "height": "200px" },
        },
        47: {
            title: "<p style='transform: scale(-1, -1)'><alternate>GET READY</alternate>",
            description: "The first “Multiplies all of the second upgrade row effect” gets improved from fourth rooted to squared.",
            cost: new Decimal("ee1314000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 46) },
        },
        48: {
            title: "<p style='transform: scale(-1, -1)'><alternate>GET SET</alternate>",
            description: "Slyph and Bard Power affects more to Aspect Essence replacements.",
            cost: new Decimal("ee1515000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 46) },
        },
        49: {
            title: "Unlocks Prospit.",
            cost: () => hasUpgrade("skaia", 50) ? new Decimal("ee2100000") : new Decimal("ee1600000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 47) && hasUpgrade("skaia", 48) },
            style: { "width": "160px", "height": "160px" },
        },
        50: {
            title: "Unlocks Derse.",
            cost: () => hasUpgrade("skaia", 49) ? new Decimal("ee2100000") : new Decimal("ee1600000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 47) && hasUpgrade("skaia", 48) },
            style: { "width": "160px", "height": "160px" },
        },
        51: {
            title: "<p style='transform: scale(-1, -1)'><alternate>THE HEMO ERA</alternate>",
            description: "Points beyond ee1,600,000 boosts Class Point gain.",
            cost: new Decimal("ee1825000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            effect() {
                let ret = player.points.add(1).log(10).add(1).log(10).sub(1599999).max(1).pow(0.5)
                if (hasUpgrade("skaia", 53)) ret = ret.pow(upgradeEffect("skaia", 53))
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("skaia", 49) || hasUpgrade("skaia", 50) },
        },
        52: {
            title: "<p style='transform: scale(-1, -1)'><alternate>FASTER LEVEL UPS</alternate>",
            description: "Filling the Echebar gives you 100 levels instead of 1.",
            cost: new Decimal("ee1975000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 49) || hasUpgrade("skaia", 50) },
        },
        53: {
            title: "<p style='transform: scale(-1, -1)'><alternate>A NEW AGE</alternate>",
            description: "The first upgrade in this row gets boosted based on Aspect Points.",
            cost: new Decimal("ee2050000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            effect() {
                let ret = player.metaAspects.points.add(1).log(10).add(1).log(10).max(1).pow(0.5)
                return ret
            },
            effectDisplay() { return "^" + format(this.effect()) },
            unlocked() { return hasUpgrade("skaia", 49) || hasUpgrade("skaia", 50) },
        },
        54: {
            title: "<p style='transform: scale(-1, -1)'><alternate>SPECIAL TREATMENT</alternate>",
            description: "Doubles the Time Shards and Time Essence replacement value.",
            cost: new Decimal("ee1925000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 49) || hasUpgrade("skaia", 50) },
        },
        55: {
            title: "<p style='transform: scale(-1, -1)'><alternate>SIGNPHONY</alternate>",
            description: "Unlocks special milestones for each of the Lunar Sway (Derse & Prospit) layers.",
            cost: new Decimal("ee2850000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 49) && hasUpgrade("skaia", 50) },
        },
        56: {
            title: "<p style='transform: scale(-1, -1)'><alternate>CARAPACIPHONY</alternate>",
            description: "Prospitians boost Dersite gain and vice versa.",
            cost: new Decimal("ee2500000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 49) && hasUpgrade("skaia", 50) },
        },
        57: {
            title: "<p style='transform: scale(-1, -1)'><alternate>SWAYPHONY</alternate>",
            description: "Prospit points boost Dersite gain and vice versa.",
            cost: new Decimal("ee3150000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 49) && hasUpgrade("skaia", 50) },
        },
        58: {
            title: "<p style='transform: scale(-1, -1)'><alternate>CLASSPHONY</alternate>",
            description: "Prospitians and Dersites boosts Class Point gain.",
            cost: new Decimal("ee2750000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            effect() {
                let ret = player.metaProspit.population.mul(player.metaDerse.population).add(1).pow(0.85)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("skaia", 49) && hasUpgrade("skaia", 50) },
        },
        59: {
            title: "<p style='transform: scale(-1, -1)'><alternate>SELFPHONY</alternate>",
            description: "Prospitians and Dersites boosts their own gain.",
            cost: new Decimal("ee3200000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 55) && hasUpgrade("skaia", 56) && hasUpgrade("skaia", 57) && hasUpgrade("skaia", 58) },
            style: { "width": "160px", "height": "160px" },
        },
        60: {
            title: "<p style='transform: scale(-1, -1)'><alternate>RESETPHONY</alternate>",
            description: "You can reset a Sign Row to give it a better boost.",
            cost: new Decimal("ee3500000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 55) && hasUpgrade("skaia", 56) && hasUpgrade("skaia", 57) && hasUpgrade("skaia", 58) },
            style: { "width": "160px", "height": "160px" },
        },
        61: {
            title: "<p style='transform: scale(-1, -1)'><alternate>REVERSEPHONY</alternate>",
            description: "Class Points beyond 1e150 boost Prospitian and Dersite gain.",
            cost: new Decimal("ee3350000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            effect() {
                let ret = Decimal.pow(10, player.metaClasses.points.div(1e150).max(1).cbrt().log(10).sqrt())
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("skaia", 55) && hasUpgrade("skaia", 56) && hasUpgrade("skaia", 57) && hasUpgrade("skaia", 58) },
            style: { "width": "160px", "height": "160px" },
        },
        62: {
            title: "<p style='transform: scale(-1, -1)'><alternate>TOO MANY PHONIES</alternate>",
            description: "Boosts the Aspect Shards and Aspect Essences replacements based on Prospitians and Dersites.",
            cost: new Decimal("ee5100000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            effect() {
                let ret = player.metaProspit.population.mul(player.metaDerse.population).add(1).log(1000).add(1)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("skaia", 59) && hasUpgrade("skaia", 60) && hasUpgrade("skaia", 61) },
            style: { "width": "160px", "height": "160px" },
        },
        63: {
            title: "<p style='transform: scale(-1, -1)'><alternate>NOT A SYMPHONY</alternate>",
            description: "Buying Class Power gives you 12 levels instead of 1, except for the last two special classes. Also does a Lunar Sway reset.",
            cost: new Decimal("ee6000000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 59) && hasUpgrade("skaia", 60) && hasUpgrade("skaia", 61) },
            onPurchase() { doReset("metaDerse", true) },
            style: { "width": "160px", "height": "160px" },
        },
        64: {
            title: "<p style='transform: scale(-1, -1)'><alternate>SYMPHONYCEPTION</alternate>",
            description: "Places the last upgrade in the row two times above this after the softcap.",
            cost: new Decimal("ee4600000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 59) && hasUpgrade("skaia", 60) && hasUpgrade("skaia", 61) },
            style: { "width": "160px", "height": "160px" },
        },
        65: {
            title: "<p style='transform: scale(-1, -1)'><alternate>AMPLIFYMPHONY</alternate>",
            description: "Prospit Point and Derse Point effects scale better.",
            cost: new Decimal("ee7200000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 62) && hasUpgrade("skaia", 63) && hasUpgrade("skaia", 64) },
        },
        66: {
            title: "<p style='transform: scale(-1, -1)'><alternate>DIVIDEPHONY</alternate>",
            description: "Prospitian count plus 1 divides the Derse Point requirement and vice versa.",
            cost: new Decimal("ee9250000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 62) && hasUpgrade("skaia", 63) && hasUpgrade("skaia", 64) },
        },
        67: {
            title: "<p style='transform: scale(-1, -1)'><alternate>AMPLIFYMPHONIER<</alternate>",
            description: "Prospit and Derse Point effects scale even better, if you have the first upgrade of this layer.",
            cost: new Decimal("ee10000000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 62) && hasUpgrade("skaia", 63) && hasUpgrade("skaia", 64) },
        },
        68: {
            title: "<p style='transform: scale(-1, -1)'><alternate>COSTPHONY</alternate>",
            description: "Prospit Points plus 1 hepteracted divides the Derse Point requirement and vice versa.",
            cost: new Decimal("ee7825000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 62) && hasUpgrade("skaia", 63) && hasUpgrade("skaia", 64) },
        },
        69: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE ONE</alternate>",
            description: "Lunar Sway abolishments no longer resets anything.",
            cost: new Decimal("eee30"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 65) && hasUpgrade("skaia", 66) && hasUpgrade("skaia", 67) && hasUpgrade("skaia", 68) },
        },
        70: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE TWO</alternate>",
            description: "Autobuys Sway Sign rows if they have at least 5 Abolishments.",
            cost: new Decimal("eee18"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 65) && hasUpgrade("skaia", 66) && hasUpgrade("skaia", 67) && hasUpgrade("skaia", 68) },
        },
        71: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE THREE</alternate>",
            description: "Filling the Echebar also doubles you current level.",
            cost: new Decimal("eee12"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 65) && hasUpgrade("skaia", 66) && hasUpgrade("skaia", 67) && hasUpgrade("skaia", 68) },
        },
        72: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE FOUR</alternate>",
            description: "Autobuys Class Powers.",
            cost: new Decimal("eee24"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 65) && hasUpgrade("skaia", 66) && hasUpgrade("skaia", 67) && hasUpgrade("skaia", 68) },
        },
        73: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE FIVE</alternate>",
            description: "Lunar Sway Sign abolishments no longer resets anything.",
            cost: new Decimal("eee200"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 69) && hasUpgrade("skaia", 70) && hasUpgrade("skaia", 71) && hasUpgrade("skaia", 72) },
        },
        74: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE SIX</alternate>",
            description: "Boosts Jade Symphony effect from Lunar Sway layers based on current points.",
            cost: new Decimal("eee350"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            effect() {
                let ret = Decimal.pow10(player.points.add(1).log10().add(1).log10().add(1).log10().pow(0.5))
                if (hasUpgrade("skaia", 77)) ret = ret.pow(2)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("skaia", 69) && hasUpgrade("skaia", 70) && hasUpgrade("skaia", 71) && hasUpgrade("skaia", 72) },
        },
        75: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE SEVEN</alternate>",
            description: "Gold and Olive Symphony effects are squared.",
            cost: new Decimal("eee500"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 69) && hasUpgrade("skaia", 70) && hasUpgrade("skaia", 71) && hasUpgrade("skaia", 72) },
        },
        76: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE EIGHT</alternate>",
            description: "Boosts Aspect Point gain based on Prospitians and Dersites.",
            cost: new Decimal("eee675"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            effect() {
                let ret = player.metaProspit.population.mul(player.metaDerse.population).div(1e200).max(1).pow(3)
                if (hasUpgrade("skaia", 77)) ret = ret.pow(2)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("skaia", 73) && hasUpgrade("skaia", 74) && hasUpgrade("skaia", 75) },
        },
        77: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE NINE</alternate>",
            description: "All effects from Boosts Upgrades that're next to this one are boosted.",
            cost: new Decimal("eee900"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 73) && hasUpgrade("skaia", 74) && hasUpgrade("skaia", 75) },
        },
        78: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE TEN</alternate>",
            description: "Boosts Prospit and Derse effects based on their amount, after the softcap.",
            cost: new Decimal("eee1111"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            effect() {
                let ret = player.metaProspit.points.mul(player.metaDerse.points).pow(2.5)
                if (hasUpgrade("skaia", 77)) ret = ret.pow(2)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("skaia", 76) && hasUpgrade("skaia", 77) },
        },
        79: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE ELEVEN</alternate>",
            description: "Boosts Prospit and Derse effects based on points, after the softcap.",
            cost: new Decimal("eee1500"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            effect() {
                let ret = Decimal.pow(10, player.points.add(1).log10().add(1).log10().add(1).log10().sub("1500").max(0).pow(0.5))
                if (hasUpgrade("skaia", 81)) ret = ret.pow(upgradeEffect("skaia", 81))
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("skaia", 78) },
        },
        80: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE TWELVE</alternate>",
            description: "All effects of the “True” signs (Aries, Taurus, etc.) are tesseracted.",
            cost: new Decimal("eee1750"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 79) },
        },
        81: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE THIRTEEN</alternate>",
            description: "Skaia levels boosts the upgrade two times above this one.",
            cost: new Decimal("eee1875"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            effect() {
                let ret = player.skaia.level.div("e500").max(1).log10().add(1).pow(0.1)
                if (hasUpgrade("skaia", 82)) ret = ret.mul(upgradeEffect("skaia", 82))
                return ret
            },
            effectDisplay() { return "^" + format(this.effect()) },
            unlocked() { return hasUpgrade("skaia", 80) },
        },
        82: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE FOURTEEN</alternate>",
            description: "Skaia levels boosts the upgrade above this one.",
            cost: new Decimal("eee2300"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            effect() {
                let ret = player.skaia.level.div("e612").max(1).log10().add(1).pow(0.05)
                if (hasUpgrade("skaia", 83)) ret = ret.mul(upgradeEffect("skaia", 83))
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("skaia", 81) },
        },
        83: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE FIFTEEN</alternate>",
            description: "Skaia levels boosts the upgrade above this one, again.",
            cost: new Decimal("eee2500"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            effect() {
                let ret = player.skaia.level.div("e680").max(1).log10().add(1).pow(0.05)
                if (hasUpgrade("skaia", 84)) ret = ret.mul(upgradeEffect("skaia", 84))
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("skaia", 82) },
        },
        84: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE SIXTEEN</alternate>",
            description: "Skaia levels boosts the upgrade above this one, yet again.",
            cost: new Decimal("eee3000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            effect() {
                let ret = player.skaia.level.div("e800").max(1).log10().add(1).pow(0.01)
                if (hasUpgrade("skaia", 85)) ret = ret.mul(upgradeEffect("skaia", 85))
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("skaia", 83) },
        },
        85: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE SIXTEEN</alternate>",
            description: "Skaia levels boosts the upgrade above this one... really?",
            cost: new Decimal("eee3300"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            effect() {
                let ret = player.skaia.level.div("e900").max(1).log10().add(1).pow(0.01)
                if (hasUpgrade("skaia", 86)) ret = ret.mul(upgradeEffect("skaia", 86))
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("skaia", 84) },
        },
        86: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE SEVENTEEN</alternate>",
            description: "All previous “Skaia levels” upgrades boost the upgrade above this one.",
            cost: new Decimal("eee3600"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            effect() {
                let ret = upgradeEffect("skaia", 82).mul(upgradeEffect("skaia", 83)).mul(upgradeEffect("skaia", 84)).mul(upgradeEffect("skaia", 85)).log(1e10).add(1)
                if (hasUpgrade("skaia", 87)) ret = ret.pow(2)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return hasUpgrade("skaia", 85) },
        },
        87: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE EIGHTEEN</alternate>",
            description: "Squares the effect of the previous upgrade.",
            cost: new Decimal("eee4000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 86) },
        },
        88: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE NINETEEN</alternate>",
            description: "Automatically do Lunay Sway abolishments.",
            cost: new Decimal("eee5000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 87) },
        },
        89: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INFLATION UPGRADE TWENTY</alternate>",
            description: "Automatically do Lunay Sway Class abolishments.",
            cost: new Decimal("eee7000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 88) },
        },
        90: {
            title: "<p style='transform: scale(-1, -1)'><alternate>IT IS JUST THE BEGINNING</alternate>",
            description: "Increase Skaia level multiplier from 2 to 1.000e10.",
            cost: new Decimal("eee10000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return hasUpgrade("skaia", 89) },
        },
    },

    update(delta) {
        player.phaseTimer += delta
        if (player.skaia.points.gt(tmp.skaia.effect.climbReq)) {
            player.skaia.points = player.skaia.points.sub(tmp.skaia.effect.climbReq)
            player.skaia.level = player.skaia.level.add(hasUpgrade("skaia", 52) ? 100 : 1).mul(hasUpgrade("skaia", 71) ? (hasUpgrade("skaia", 90) ? 1e10 : 2) : 1)
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

        if (hasUpgrade("skaia", 13) && player.aspTime.points.gte("1")) {
            buyUpgrade("skaia", 14)
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
            effectDescription: "Keeps Hope Upgrades and Rage Challenges on Breath and Blood resets.",
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
                        const tgs = [["buildGrist", "神圣谷仓"]]
                        let data = "<h5/>" + "仓库名".padEnd(16, "\u00a0") + " |" + "库中储量".padStart(15, "\u00a0") + " |" + "出售价格".padStart(9, "\u00a0") + " |" + "涨价速度".padStart(9, "\u00a0") + " | 行动:<br/>"
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
                    ["display-text", () => "你的点数每分钟给你 " + format(tmp.skaia.effect.levelGain.mul(60)) + " 点."],
                    ["blank", "15px"],
                    ["upgrade", "31"],
                    ["row", [["upgrade", "32"], ["upgrade", "33"], ["upgrade", "34"]]],
                    ["row", [["upgrade", "35"], ["upgrade", "36"], ["upgrade", "37"]]],
                    ["row", [["upgrade", "38"], ["upgrade", "39"], ["upgrade", "40"]]],
                    ["row", [["upgrade", "41"]]],
                    ["row", [["upgrade", "42"]]],
                    ["row", [["upgrade", "43"]]],
                    ["row", [["upgrade", "44"]]],
                    ["row", [["upgrade", "45"]]],
                    ["row", [["upgrade", "46"]]],
                    ["row", [["upgrade", "47"], ["upgrade", "48"]]],
                    ["row", [["upgrade", "49"], ["upgrade", "50"]]],
                    ["row", [["upgrade", "51"], ["upgrade", "52"], ["upgrade", "53"], ["upgrade", "54"]]],
                    ["row", [["upgrade", "55"], ["upgrade", "56"], ["upgrade", "57"], ["upgrade", "58"]]],
                    ["row", [["upgrade", "59"], ["upgrade", "60"], ["upgrade", "61"]]],
                    ["row", [["upgrade", "62"], ["upgrade", "63"], ["upgrade", "64"]]],
                    ["row", [["upgrade", "65"], ["upgrade", "66"], ["upgrade", "67"], ["upgrade", "68"]]],
                    ["row", [["upgrade", "69"], ["upgrade", "70"], ["upgrade", "71"], ["upgrade", "72"]]],
                    ["row", [["upgrade", "73"], ["upgrade", "74"], ["upgrade", "75"]]],
                    ["row", [["upgrade", "76"], ["upgrade", "77"]]],
                    ["row", [["upgrade", "78"]]],
                    ["row", [["upgrade", "79"]]],
                    ["row", [["upgrade", "80"]]],
                    ["row", [["upgrade", "81"]]],
                    ["row", [["upgrade", "82"]]],
                    ["row", [["upgrade", "83"]]],
                    ["row", [["upgrade", "84"]]],
                    ["row", [["upgrade", "85"]]],
                    ["row", [["upgrade", "86"]]],
                    ["row", [["upgrade", "87"]]],
                    ["row", [["upgrade", "88"]]],
                    ["row", [["upgrade", "89"]]],
                    ["row", [["upgrade", "90"]]],
                    ["row", [["upgrade", "13"]]],
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
        ["display-text", () => tmp.skaia.effect.climbReq.gte(10000) ? "" : "<h5>" + format((player.skaia.points % 1) * 100) + "% 直到下一个回切点"],
        ["blank", "25px"],
        "upgrades",
        ["microtabs", "stuff"],
        ["blank", "25px"],
    ],

    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
})
