addLayer("aspHope", {
    name: "Hope",
    symbol: "<img src='data/hope.png' style='width:calc(80% + 0px);height:calc(80% + 0px);margin:10%'></img>",
    row: 3,
    position: 0,
    branches: [["aspHeart", 2]],

    layerShown() { return hasUpgrade("aspMind", 24) || player.aspHope.unlocked },
    resource: "Hope Essence",
    baseAmount() { return player.aspHeart.points },
    baseResource: "Heart Power",
    color: "#ffde55",
    resetDescription: "Absorb ",

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            power: new Decimal(0),
        }
    },
    effect() {
        return {
            gainBoost: Decimal.pow(100000, player[this.layer].points.pow(0.85)),
            powerGain: player[this.layer].points.gte(6) ? Decimal.pow(player[this.layer].points, player[this.layer].points.sub(6)) : new Decimal(0)
        }
    },
    effectDescription() {
        eff = this.effect();
        return "which are boosting Mind Power gain by ×" + format(eff.gainBoost)
    },

    type: "static",
    requires() {
        let req = new Decimal(1e42)
        if (challengeCompletions("aspRage", 11)) req = req.div(tmp.aspRage.challenges[11].rewardEffect.hopeReqReduce)
        if (hasUpgrade("aspHope", 11)) req = req.div(tmp.aspHope.upgrades[11].effect)
        return req;
    },
    base: 10000,
    exponent: 1.2,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },

    milestones: {
        0: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>HOPES AND DREAMS</alternate></p>1 Hope Essence",
            done() { return player[this.layer].best.gte(1) },
            effectDescription: "Gets all Space upgrades and the first six Mind/Heart milestones on Hope reset.",
        },
        1: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>UPGRADES AND JUSTICE</alternate></p>6 Hope Essence",
            done() { return player[this.layer].best.gte(6) },
            effectDescription: "Unlocks Hope upgrades.",
        },
        2: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>UNEXPECTED SYNERGY</alternate></p>8 Hope Essence",
            done() { return player[this.layer].best.gte(8) },
            effectDescription: "Gives you all Heart and Mind upgrades and their seventh milestone on Hope reset.",
        },
    },

    upgrades: {
        rows: 3,
        cols: 4,
        11: {
            title: "<p style='transform: scale(-1, -1)'><alternate>PLAYER</alternate>",
            description: "Points decrease the requirements for Hope and Rage resets.",
            cost: new Decimal(100),
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Hope Power",
            currencyInternalName: "power",
            effect() {
                let ret = player.points.add(1).tetrate(0.006)
                ret = applyPolynomialSoftcap(ret, 1e6, 1.5)
                ret = applyPolynomialSoftcap(ret, 1e12, 2)
                ret = applyPolynomialSoftcap(ret, 1e36, 3)
                ret = applyPolynomialSoftcap(ret, 1e144, 4)
                ret = applyPolynomialSoftcap(ret, "1e720", 4)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return true },
        },
        21: {
            title: "<p style='transform: scale(-1, -1)'><alternate>IF YOU CAN</alternate>",
            description: "The upgrade above boosts point gain.",
            cost() {
                let cost = new Decimal(250)
                for (var a = 21; a <= 23; a++) if (hasUpgrade("aspHope", a)) cost = cost.pow(1.5)
                return cost
            },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Hope Power",
            currencyInternalName: "power",
            effect() {
                let ret = tmp.aspHope.upgrades[11].effect.pow(tmp.aspHope.upgrades[11].effect.add(1).log(10))
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && hasUpgrade(this.layer, 11) },
            unlocked() { return true },
        },
        22: {
            title: "<p style='transform: scale(-1, -1)'><alternate>SEE THIS</alternate>",
            description: "The upgrade above boosts Time Power gain.",
            cost() {
                let cost = new Decimal(250)
                for (var a = 21; a <= 23; a++) if (hasUpgrade("aspHope", a)) cost = cost.pow(1.5)
                return cost
            },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Hope Power",
            currencyInternalName: "power",
            effect() {
                let ret = tmp.aspHope.upgrades[11].effect.pow(tmp.aspHope.upgrades[11].effect.add(1).log(10)).pow(0.4)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && hasUpgrade(this.layer, 11) },
            unlocked() { return true },
        },
        23: {
            title: "<p style='transform: scale(-1, -1)'><alternate>THAT MEANS</alternate>",
            description: "The upgrade above boosts Space Power gain.",
            cost() {
                let cost = new Decimal(250)
                for (var a = 21; a <= 23; a++) if (hasUpgrade("aspHope", a)) cost = cost.pow(1.5)
                return cost
            },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Hope Power",
            currencyInternalName: "power",
            effect() {
                let ret = tmp.aspHope.upgrades[11].effect.pow(tmp.aspHope.upgrades[11].effect.add(1).log(10)).pow(0.15)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && hasUpgrade(this.layer, 11) },
            unlocked() { return true },
        },
        31: {
            title: "<p style='transform: scale(-1, -1)'><alternate>YOUVE PLAYED ENOUGH</alternate>",
            description: "Hope and Rage Essence boosts Mind and Heart Power gain.",
            cost() {
                let cost = new Decimal(10000)
                return cost
            },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Hope Power",
            currencyInternalName: "power",
            effect() {
                let ret = player.aspHope.points.mul(player.aspRage.points).pow(1.5)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && (hasUpgrade(this.layer, 21) || hasUpgrade(this.layer, 22) || hasUpgrade(this.layer, 23)) },
            unlocked() { return true },
        },
    },

    buyables: {
        showRespec: true,
        respec() { 
            player[this.layer].upgrades = []
            doReset(this.layer, true)
        },
        respecText: "Respec Hope Upgrades",
    },

    onPrestige(gain) {
        console.log(gain)
        gain = new Decimal(gain)
        if (gain.gt(0)) buyMaxBuyable("skaia", 11)
    },
    update(delta) {
        player[this.layer].power = player[this.layer].power.add(tmp[this.layer].effect.powerGain.mul(delta))
    },

    microtabs: {
        stuff: {
            "Milestones": {
                content: [
                    ["blank", "15px"],
                    "milestones"
                ]
            },
            "Upgrades": {
                unlocked: () => hasMilestone("aspHope", 1),
                content: [
                    ["blank", "15px"],
                    ["display-text", () => "You have <h2 style='color:#ffde55;text-shadow:#ffde55 0px 0px 10px;'>" + formatWhole(player.aspHope.power) + "</h2> Hope Power."],
                    ["display-text", () => "<h5 style='opacity:0.5'>Buying an upgrade increases the cost of the upgrades in the same row.<br/>\
                                            You need to buy at least one upgrade in the upper row before you can buy upgrades at that row.<br/>\
                                            Respecing Hope Upgrades does not give your Hope Power back!</h5>"],
                    ["blank", "15px"],
                    "buyables", "upgrades"
                ]
            },
        },
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        ["blank", "25px"],
        ["microtabs", "stuff"],
        ["blank", "35px"],
    ],

    hotkeys: [
        { key: "o", description: "O: Absorb Hope Essence", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
})
