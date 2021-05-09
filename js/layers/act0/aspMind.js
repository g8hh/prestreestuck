if (act == "0.0") addLayer("aspMind", {
    name: "Mind",
    symbol: "<img src='data/mind.png' style='width:calc(80% - 3px);height:calc(80% - 3px);margin:10%'></img>",
    row: 2,
    position: 1,
    branches: ["aspSpace"],

    layerShown() { return (hasUpgrade("aspSpace", 41) || player.aspMind.unlocked) && !inChallenge("aspDoom", 12) && !hasUpgrade("skaia", 12)  },
    resource: "Mind Power",
    baseAmount() { return player.aspSpace.points },
    baseResource: "Space Power",
    color: "#00923d",
    resetDescription: "Absorb ",

    softcap: new Decimal(1e30),
    softcapPower: new Decimal(0.5),

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
        }
    },
    effect() {
        return {
            pointBoost: applyPolynomialSoftcap(player.aspMind.points.add(1).pow(4), 1e16, 2)
        }
    },
    effectDescription() {
        eff = this.effect();
        return "which are boosting point gain by ×" + format(eff.pointBoost)
    },

    milestones: {
        0: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>NOW WITH MORE IDLE</alternate></p>1 Mind Power",
            done() { return player[this.layer].best.gte(1) },
            effectDescription: "You keep your 2nd, 4th, 6th, 8th, 10th, and 12th Space upgrades on Mind Power absorb.",
        },
        1: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>WORRY ABOUT UPGRADES LESS</alternate></p>10 Mind Power",
            done() { return player[this.layer].best.gte(10) },
            effectDescription: "You keep your 1st, 3nd, and 5th Space upgrades on Mind Power absorb.",
        },
        2: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>ALMOST THE ENTIRE UPGRADE PANEL</alternate></p>100 Mind Power",
            done() { return player[this.layer].best.gte(100) },
            effectDescription: "You keep your 7th, 9th, and 11th Space upgrades on Mind Power absorb.",
        },
        3: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>SUSPICIOUSLY SIMILAR MILESTONE</alternate></p>" + formatWhole(10000) + " Mind Power",
            done() { return player[this.layer].best.gte(10000) },
            effectDescription: "Gain 5% of your Space Power gain on absorb per second.",
        },
        4: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>WORRY LESS ABOUT UPGRADES AGAIN</alternate></p>" + formatWhole(10000000) + " Mind Power",
            done() { return player[this.layer].best.gte(10000000) },
            effectDescription: "You keep your forth row of Space upgrades on Mind Power absorb.",
        },
        5: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>EXPAND YOUR MIND</alternate></p>" + formatWhole(1e12) + " Mind Power",
            done() { return player[this.layer].best.gte(1e12) },
            effectDescription: "Unlocks Mind Upgrades.",
        },
        6: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>THE BALNCE IS BROKEN</alternate></p>" + formatWhole(1e25) + " Mind Power",
            done() { return player[this.layer].best.gte(1e25) },
            effectDescription: "Gain 5% of your Mind Power gain on absorb per second.",
        },
    },


    upgrades: {
        rows: 2,
        cols: 4,
        11: {
            title: "<p style='transform: scale(-1, -1)'><alternate>MIND BOOSTS POINTS</alternate>",
            description: "Mind Power boost point gain.",
            cost: new Decimal(1e12),
            effect() {
                let ret = player.aspMind.points.div(1e10).pow(0.6).add(1).mul(10000)
                if (challengeCompletions("aspDoom", 12) >= 2) ret = ret.pow(2)
                return ret.pow(tmp.aspBreath.buyables[18].effect)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return true },
        },
        12: {
            title: "<p style='transform: scale(-1, -1)'><alternate>MIND BOOSTS TIME</alternate>",
            description: "Mind Power boost Time Power gain.",
            cost: new Decimal(1e16),
            effect() {
                let ret = player.aspMind.points.div(1e14).pow(0.3).add(1).mul(100)
                return ret.pow(tmp.aspBreath.buyables[18].effect)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return true },
        },
        13: {
            title: "<p style='transform: scale(-1, -1)'><alternate>MIND BOOSTS SPACE</alternate>",
            description: "Mind Power boost Space Power gain.",
            cost: new Decimal(1e21),
            effect() {
                let ret = player.aspMind.points.div(1e19).pow(0.2).add(1).mul(100)
                return ret.pow(tmp.aspBreath.buyables[18].effect)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return true },
        },
        14: {
            title: "<p style='transform: scale(-1, -1)'><alternate>MIND BOOSTS SPACE AGAIN</alternate>",
            description: "Mind Power boosts all Space Generators.",
            cost: new Decimal(1e27),
            effect() {
                let ret = player.aspMind.points.div(1e26).pow(0.03).add(1).mul(1.5)
                return ret.pow(tmp.aspBreath.buyables[18].effect)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return true },
        },
        21: {
            title: "<p style='transform: scale(-1, -1)'><alternate>THESE ARE GIVING ME EPILEPSY</alternate>",
            description: "Getting Time Boosters no longer resets anything.",
            cost: new Decimal(1e14),
            unlocked() { return true },
        },
        22: {
            title: "<p style='transform: scale(-1, -1)'><alternate>POINT BOOSTERS</alternate>",
            description: "Multiplier from Time Boosters boosts point gain.",
            cost: new Decimal(1e18),
            effect() {
                let ret = tmp.aspTime.buyables[21].effect.pow(0.045).add(1)
                return ret.pow(tmp.aspBreath.buyables[19].effect)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return true },
        },
        23: {
            title: "<p style='transform: scale(-1, -1)'><alternate>RESET PROOFING</alternate>",
            description: "Time Booster^2s no longer resets, and its multi boosts Time Power gain.",
            cost: new Decimal(1e30),
            effect() {
                let ret = tmp.aspTime.buyables[22].effect.pow(0.06).add(1)
                return ret.pow(tmp.aspBreath.buyables[19].effect)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return true },
        },
        24: {
            title: "<p style='transform: scale(-1, -1)'><alternate>COOL AND NEW UPGRADE</alternate>",
            description: "unolck moar cool n new laeyrs",
            cost: new Decimal(1e32),
            unlocked() { return (!player.aspHope.unlocked || !player.aspRage.unlocked) },
        },
    },

    microtabs: {
        stuff: {
            "Milestones": {
                content: [
                    ["blank", "15px"],
                    "milestones",
                ]
            },
            "Upgrades": {
                unlocked: () => hasMilestone("aspMind", 5),
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
        ["microtabs", "stuff"],
        ["blank", "35px"],
    ],

    update(delta) {
        if (hasMilestone(this.layer, 3)) {
            let mult = new Decimal(0.05)
            addPoints("aspSpace", tmp.aspSpace.resetGain.mul(delta).mul(mult))
        }
        if (hasMilestone(this.layer, 6)) 
            addPoints(this.layer, tmp[this.layer].resetGain.mul(delta).mul(0.05))
    },

    doReset(pLayer) {
        if (pLayer && layers[pLayer].row > layers[this.layer].row) {
            var listKeep = [];
            var upgradeKeep = [];
            var milestoneKeep = [];
            if ((pLayer === "aspHope" && hasMilestone("aspHope", 0)) || (pLayer === "aspRage" && hasMilestone("aspRage", 0)) || (pLayer === "aspDoom" && hasMilestone("aspDoom", 1)) || (layers[pLayer].row == 7 && hasMilestone("skaia", 1))) {
                milestoneKeep.push("0", "1", "2", "3", "4", "5")
            }
            if ((pLayer === "aspHope" && hasMilestone("aspHope", 2)) || (pLayer === "aspRage" && hasMilestone("aspRage", 2)) || (pLayer === "aspDoom" && hasMilestone("aspDoom", 1)) || (layers[pLayer].row == 7 && hasMilestone("skaia", 1))) {
                milestoneKeep.push("6")
                upgradeKeep.push(11, 12, 13, 14, 21, 22, 23)
            }
            layerDataReset("aspMind", listKeep)
            if (!upgradeKeep.includes["milestones"]) player.aspMind.milestones = milestoneKeep
            player.aspMind.upgrades = upgradeKeep;
        }
    },

    type: "normal",
    requires: new Decimal(1e20),
    exponent: 0.335,
    gainMult() {
        mult = new Decimal(1).mul(tmp.aspHope.effect.gainBoost)
        if (hasUpgrade("aspHope", 31)) mult = mult.mul(tmp.aspHope.upgrades[31].effect)
        mult = mult.mul(tmp.aspLight.buyables[14].effect)
        mult = mult.mul(tmp.aspBreath.buyables[17].effect)
        return mult
    },
    gainExp() {
        let mult = new Decimal(1)
        if (inChallenge("aspDoom", 11)) mult = mult.mul(0.75)
        return mult
    },

    hotkeys: [
        { key: "m", description: "M: Absorb Mind Power", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
})
