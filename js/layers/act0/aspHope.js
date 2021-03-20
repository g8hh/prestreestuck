if (act == 0) addLayer("aspHope", {
    name: "Hope",
    symbol: "<img src='data/hope.png' style='width:calc(80% + 0px);height:calc(80% + 0px);margin:10%'></img>",
    row: 3,
    position: 0,
    branches: [["aspHeart", 2]],

    layerShown() { return (hasUpgrade("aspMind", 24) || player.aspHope.unlocked) && !inChallenge("aspDoom", 12) && !hasUpgrade("skaia", 12) },
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
            autoReset: false,
        }
    },
    effect() {
        return {
            gainBoost: Decimal.pow(100000, player[this.layer].points.pow(0.85)),
            powerGain: player[this.layer].points.gte(5) ? Decimal.pow(player[this.layer].points.min(12), player[this.layer].points.sub(5)) : new Decimal(0)
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
        if (hasUpgrade("aspHope", 42)) req = req.div(1e12)
        req = req.div(tmp.aspLight.buyables[16].effect)
        return req;
    },
    canBuyMax() { return hasMilestone("aspDoom", 5) },
    base: 10000,
    exponent: 1.2,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        let mult = new Decimal(1)
        return mult
    },

    milestones: {
        0: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>HOPES AND DREAMS</alternate></p>1 Hope Essence",
            done() { return player[this.layer].best.gte(1) },
            effectDescription: "Gets all Space upgrades and the first six Mind/Heart milestones on Hope reset.",
        },
        1: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>UPGRADES AND JUSTICE</alternate></p>5 Hope Essence",
            done() { return player[this.layer].best.gte(5) },
            effectDescription: "Unlocks Hope upgrades.",
        },
        2: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>UNEXPECTED SYNERGY</alternate></p>7 Hope Essence",
            done() { return player[this.layer].best.gte(7) },
            effectDescription: "Gives you all Heart and Mind upgrades and their seventh milestone on Hope reset.",
        },
        3: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>RAGEFUL HOPE</alternate></p>21 Hope Essence",
            toggles: [["aspHope", "autoReset"]],
            done() { return player[this.layer].best.gte(21) },
            effectDescription: "Automatically do Rage resets.",
        },
    },

    upgrades: {
        rows: 6,
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
                ret = applyPolynomialSoftcap(ret, "1e7200", 10)
                ret = applyPolynomialSoftcap(ret, "1e16800", 25)
                ret = applyPolynomialSoftcap(ret, "1e51200", 100)
                ret = applyPolynomialSoftcap(ret, "1e100000", 1000)
                if (challengeCompletions("aspDoom", 12) >= 1) ret = ret.pow(1.1)
                return ret.pow(tmp.aspBreath.buyables[20].effect)
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
                let ret = tmp.aspHope.upgrades[11].effect.pow(tmp.aspHope.upgrades[11].effect.add(1).log(10).min(2000))
                if (challengeCompletions("aspDoom", 12) >= 10) ret = ret.pow(2)
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
                let ret = tmp.aspHope.upgrades[11].effect.pow(tmp.aspHope.upgrades[11].effect.add(1).log(10).min(2000)).pow(0.4)
                if (challengeCompletions("aspDoom", 12) >= 10) ret = ret.pow(2)
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
                let ret = tmp.aspHope.upgrades[11].effect.pow(tmp.aspHope.upgrades[11].effect.add(1).log(10).min(2000)).pow(0.15)
                if (challengeCompletions("aspDoom", 12) >= 10) ret = ret.pow(2)
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
                for (var a = 31; a <= 34; a++) if (hasUpgrade("aspHope", a)) cost = cost.pow(1.5)
                return cost
            },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Hope Power",
            currencyInternalName: "power",
            effect() {
                let ret = player.aspHope.points.mul(player.aspRage.points).add(1).pow(2.5)
                if (challengeCompletions("aspDoom", 12) >= 3) ret = ret.pow(64)
                return ret.pow(tmp.aspBreath.buyables[21].effect)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && (hasUpgrade(this.layer, 21) || hasUpgrade(this.layer, 22) || hasUpgrade(this.layer, 23)) },
            unlocked() { return true },
        },
        32: {
            title: "<p style='transform: scale(-1, -1)'><alternate>TO BE ABLE TO</alternate>",
            description: "Hope and Rage Essence boosts Space Power gain.",
            cost() {
                let cost = new Decimal(10000)
                for (var a = 31; a <= 34; a++) if (hasUpgrade("aspHope", a)) cost = cost.pow(1.5)
                return cost
            },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Hope Power",
            currencyInternalName: "power",
            effect() {
                let ret = player.aspHope.points.mul(player.aspRage.points).add(1).pow(4)
                if (challengeCompletions("aspDoom", 12) >= 3) ret = ret.pow(64)
                return ret.pow(tmp.aspBreath.buyables[21].effect)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && (hasUpgrade(this.layer, 21) || hasUpgrade(this.layer, 22) || hasUpgrade(this.layer, 23)) },
            unlocked() { return true },
        },
        33: {
            title: "<p style='transform: scale(-1, -1)'><alternate>MAKE DECISIONS</alternate>",
            description: "Hope and Rage Essence boosts Time Power gain.",
            cost() {
                let cost = new Decimal(10000)
                for (var a = 31; a <= 34; a++) if (hasUpgrade("aspHope", a)) cost = cost.pow(1.5)
                return cost
            },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Hope Power",
            currencyInternalName: "power",
            effect() {
                let ret = player.aspHope.points.mul(player.aspRage.points).add(1).pow(8)
                if (challengeCompletions("aspDoom", 12) >= 3) ret = ret.pow(64)
                return ret.pow(tmp.aspBreath.buyables[21].effect)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && (hasUpgrade(this.layer, 21) || hasUpgrade(this.layer, 22) || hasUpgrade(this.layer, 23)) },
            unlocked() { return true },
        },
        34: {
            title: "<p style='transform: scale(-1, -1)'><alternate>FOR YOURSELF</alternate>",
            description: "Hope and Rage Essence boosts point gain.",
            cost() {
                let cost = new Decimal(10000)
                for (var a = 31; a <= 34; a++) if (hasUpgrade("aspHope", a)) cost = cost.pow(1.5)
                return cost
            },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Hope Power",
            currencyInternalName: "power",
            effect() {
                let ret = player.aspHope.points.mul(player.aspRage.points).add(1).pow(15)
                if (challengeCompletions("aspDoom", 12) >= 3) ret = ret.pow(64)
                return ret.pow(tmp.aspBreath.buyables[21].effect)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && (hasUpgrade(this.layer, 21) || hasUpgrade(this.layer, 22) || hasUpgrade(this.layer, 23)) },
            unlocked() { return true },
        },
        41: {
            title: "<p style='transform: scale(-1, -1)'><alternate>YOU ARE NOW</alternate>",
            description: "Buying Time Gens and Accelerators buys max instead of buy once. Also affects autobuyers.",
            cost() {
                let cost = new Decimal(1e20)
                for (var a = 41; a <= 43; a++) if (hasUpgrade("aspHope", a)) cost = cost.pow(1.1)
                return cost
            },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Hope Power",
            currencyInternalName: "power",
            canAfford() { return player[this.layer].power.gte(this.cost()) && (hasUpgrade(this.layer, 31) || hasUpgrade(this.layer, 32) || hasUpgrade(this.layer, 33) || hasUpgrade(this.layer, 34)) },
            unlocked() { return true },
        },
        42: {
            title: "<p style='transform: scale(-1, -1)'><alternate>A SKILLED PLAYER</alternate>",
            description: "Reduces the Hope Essence requirements by 1e12.",
            cost() {
                let cost = new Decimal(1e20)
                for (var a = 41; a <= 43; a++) if (hasUpgrade("aspHope", a)) cost = cost.pow(1.1)
                return cost
            },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Hope Power",
            currencyInternalName: "power",
            canAfford() { return player[this.layer].power.gte(this.cost()) && (hasUpgrade(this.layer, 31) || hasUpgrade(this.layer, 32) || hasUpgrade(this.layer, 33) || hasUpgrade(this.layer, 34)) },
            unlocked() { return true },
        },
        43: {
            title: "<p style='transform: scale(-1, -1)'><alternate>AS SUCH</alternate>",
            description: "Reduces the Rage Essence requirements by 1e10.",
            cost() {
                let cost = new Decimal(1e20)
                for (var a = 41; a <= 43; a++) if (hasUpgrade("aspHope", a)) cost = cost.pow(1.1)
                return cost
            },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Hope Power",
            currencyInternalName: "power",
            canAfford() { return player[this.layer].power.gte(this.cost()) && (hasUpgrade(this.layer, 31) || hasUpgrade(this.layer, 32) || hasUpgrade(this.layer, 33) || hasUpgrade(this.layer, 34)) },
            unlocked() { return true },
        },
        51: {
            title: "<p style='transform: scale(-1, -1)'><alternate>YOU ARE ENTITLED</alternate>",
            description: "Hope Power boosts point gain",
            cost() {
                let cost = new Decimal(1e26)
                for (var a = 51; a <= 53; a++) if (hasUpgrade("aspHope", a)) cost = cost.pow(1.12)
                return cost
            },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Hope Power",
            currencyInternalName: "power",
            effect() {
                let ret = player.aspHope.power.add(1).pow(2.4)
                if (challengeCompletions("aspDoom", 12) >= 5) ret = ret.pow(3)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && (hasUpgrade(this.layer, 41) || hasUpgrade(this.layer, 42) || hasUpgrade(this.layer, 43)) },
            unlocked() { return true },
        },
        52: {
            title: "<p style='transform: scale(-1, -1)'><alternate>TO WHAT HAPPENS</alternate>",
            description: "Hope Power boosts Time Power gain",
            cost() {
                let cost = new Decimal(1e26)
                for (var a = 51; a <= 53; a++) if (hasUpgrade("aspHope", a)) cost = cost.pow(1.12)
                return cost
            },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Hope Power",
            currencyInternalName: "power",
            effect() {
                let ret = player.aspHope.power.add(1).pow(1.25)
                if (challengeCompletions("aspDoom", 12) >= 5) ret = ret.pow(3)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && (hasUpgrade(this.layer, 41) || hasUpgrade(this.layer, 42) || hasUpgrade(this.layer, 43)) },
            unlocked() { return true },
        },
        53: {
            title: "<p style='transform: scale(-1, -1)'><alternate>DURING YOUR JOURNEY</alternate>",
            description: "Hope Power boosts Space Power gain",
            cost() {
                let cost = new Decimal(1e26)
                for (var a = 51; a <= 53; a++) if (hasUpgrade("aspHope", a)) cost = cost.pow(1.12)
                return cost
            },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Hope Power",
            currencyInternalName: "power",
            effect() {
                let ret = player.aspHope.power.add(1).pow(0.5)
                if (challengeCompletions("aspDoom", 12) >= 5) ret = ret.pow(3)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && (hasUpgrade(this.layer, 41) || hasUpgrade(this.layer, 42) || hasUpgrade(this.layer, 43)) },
            unlocked() { return true },
        },
        61: {
            title: "<p style='transform: scale(-1, -1)'><alternate>I AM SO</alternate>",
            description: "Void Power boosts Light Power gain",
            cost() {
                let cost = new Decimal(1e42)
                for (var a = 61; a <= 63; a++) if (hasUpgrade("aspHope", a)) cost = cost.pow(1.04)
                return cost
            },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Hope Power",
            currencyInternalName: "power",
            effect() {
                let ret = player.aspVoid.points.add(1)
                ret = applyPolynomialSoftcap(ret, 1e10, 2)
                
                return ret.pow(tmp.aspBreath.buyables[22].effect)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && (hasUpgrade(this.layer, 51) || hasUpgrade(this.layer, 52) || hasUpgrade(this.layer, 53)) },
            unlocked() { return hasMilestone("aspVoid", 3) },
        },
        62: {
            title: "<p style='transform: scale(-1, -1)'><alternate>SO PROUD</alternate>",
            description: "Light Power boosts Void Power gain",
            cost() {
                let cost = new Decimal(1e42)
                for (var a = 61; a <= 63; a++) if (hasUpgrade("aspHope", a)) cost = cost.pow(1.04)
                return cost
            },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Hope Power",
            currencyInternalName: "power",
            effect() {
                let ret = player.aspLight.points.pow(0.2).add(1)
                ret = applyPolynomialSoftcap(ret, 1e5, 2)
                
                return ret.pow(tmp.aspBreath.buyables[22].effect)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && (hasUpgrade(this.layer, 51) || hasUpgrade(this.layer, 52) || hasUpgrade(this.layer, 53)) },
            unlocked() { return hasMilestone("aspVoid", 3) },
        },
        63: {
            title: "<p style='transform: scale(-1, -1)'><alternate>OF YOU</alternate>",
            description: "Light Power and Void Power boosts point gain",
            cost() {
                let cost = new Decimal(1e42)
                for (var a = 61; a <= 63; a++) if (hasUpgrade("aspHope", a)) cost = cost.pow(1.04)
                return cost
            },
            currencyLocation() { return player[this.layer] },
            currencyDisplayName: "Hope Power",
            currencyInternalName: "power",
            effect() {
                let ret = player.aspVoid.points.mul(player.aspLight.points).add(1).pow(2)
                ret = applyPolynomialSoftcap(ret, 1e50, 1.5)
                ret = applyPolynomialSoftcap(ret, 1e250, 2)
                
                return ret.pow(tmp.aspBreath.buyables[22].effect)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && (hasUpgrade(this.layer, 51) || hasUpgrade(this.layer, 52) || hasUpgrade(this.layer, 53)) },
            unlocked() { return hasMilestone("aspVoid", 3) },
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
        gain = new Decimal(gain)
        if (gain.gt(0)) buyMaxBuyable("skaia", 11)
    },
    update(delta) {
        player[this.layer].power = player[this.layer].power.add(tmp[this.layer].effect.powerGain.mul(delta))

        if (player[this.layer].autoReset) doReset("aspRage")
    },

    resetsNothing: () => hasMilestone("aspLight", 2),

    doReset(pLayer) {
        if (pLayer && layers[pLayer].row > layers[this.layer].row) {
            var listKeep = [];
            if ((pLayer === "aspLight" && hasMilestone("aspLight", 0)) || (pLayer === "aspVoid" && hasMilestone("aspVoid", 0)) || (pLayer === "aspDoom" && hasMilestone("aspDoom", 0)) || (layers[pLayer].row == 7 && hasMilestone("skaia", 1))) {
                listKeep.push("milestones")
            }
            if ((pLayer === "aspLight" && hasMilestone("aspVoid", 2)) || (pLayer === "aspVoid" && hasMilestone("aspVoid", 2)) || (pLayer === "aspDoom" && hasMilestone("aspDoom", 1)) || (layers[pLayer].row == 7 && hasMilestone("skaia", 2))) {
                listKeep.push("upgrades")
            }
            layerDataReset("aspHope", listKeep)
        }
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
                    ["display-text", () => "You have <h2 style='color:#ffde55;text-shadow:#ffde55 0px 0px 10px;'>" + formatWhole(player.aspHope.power) + "</h2> Hope Power (+" + formatWhole(tmp.aspHope.effect.powerGain) + "/s)."],
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
