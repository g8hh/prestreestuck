if (act == "0.0") addLayer("aspHeart", {
    name: "Heart",
    symbol: "<img src='data/heart.png' style='width:calc(80% + 1px);height:calc(80% + 1px);margin:10%'></img>",
    row: 2,
    position: 0,
    branches: ["aspSpace"],

    layerShown() { return (hasUpgrade("aspSpace", 41) || player.aspHeart.unlocked) && !inChallenge("aspDoom", 12) && !hasUpgrade("skaia", 12) },
    resource: "Heart Power",
    baseAmount() { return player.points },
    baseResource: "points",
    color: "#55142a",
    resetDescription: "Absorb ",
        
    softcap: new Decimal(1e40),
    softcapPower: new Decimal(0.5),

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
        }
    },
    effect() {
        return {
            pointBoost: applyPolynomialSoftcap(player.aspHeart.points.add(1).pow(4), 1e16, 2)
        }
    },
    effectDescription() {
        eff = this.effect();
        return "which are boosting point gain by ×" + format(eff.pointBoost)
    },

    milestones: {
        0: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>BOOSTING PRODUCTION</alternate></p>1 Heart Power",
            done() { return player[this.layer].best.gte(1) },
            effectDescription: "You keep your 1st, 3rd, and 5th Space upgrade on Heart Power absorb.",
        },
        1: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>A QUALITY OF LIFE MILESTONE</alternate></p>10 Heart Power",
            done() { return player[this.layer].best.gte(10) },
            effectDescription: "You keep your 7th, 9th, and 11th Space upgrade on Heart Power absorb.",
        },
        2: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>WHY ISNT THIS FIRST</alternate></p>100 Heart Power",
            done() { return player[this.layer].best.gte(100) },
            effectDescription: "You keep your 2nd, 4th, 6th, 8th, 10th, and 12th Space upgrade on Heart Power absorb.",
        },
        3: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>SUSPICIOUSLY SIMILAR MILESTONE</alternate></p>" + formatWhole(10000) + " Heart Power",
            done() { return player[this.layer].best.gte(10000) },
            effectDescription: "Gain 5% of your Space Power gain on absorb per second.",
        },
        4: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>WORRY LESS ABOUT UPGRADES AGAIN</alternate></p>" + formatWhole(10000000) + " Heart Power",
            done() { return player[this.layer].best.gte(10000000) },
            effectDescription: "You keep your fourth row of Space upgrades on Heart Power absorb.",
        },
        5: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>OPEN THEE HEART</alternate></p>" + formatWhole(1e12) + " Heart Power",
            done() { return player[this.layer].best.gte(1e12) },
            effectDescription: "Unlocks Heart Upgrades.",
        },
        6: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>NO LONGER BALANCED</alternate></p>" + formatWhole(1e32) + " Heart Power",
            done() { return player[this.layer].best.gte(1e32) },
            effectDescription: "Gain 5% of your Heart Power gain on absorb per second.",
        },
    },

    upgrades: {
        rows: 2,
        cols: 4,
        11: {
            title: "<p style='transform: scale(-1, -1)'><alternate>POINTS BOOST HEART</alternate>",
            description: "Points boost Heart Power gain.",
            cost: new Decimal(1e12),
            effect() {
                let ret = player.points.div(1e240).pow(0.015).add(1).mul(100)
                if (challengeCompletions("aspDoom", 12) >= 2) ret = ret.pow(2)
                return ret.pow(tmp.aspBlood.buyables[18].effect).pow(tmp.aspBlood.buyables[19].effect)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return true },
        },
        12: {
            title: "<p style='transform: scale(-1, -1)'><alternate>TIME BOOSTS HEART</alternate>",
            description: "Time Power boosts Heart Power gain.",
            cost: new Decimal(1e18),
            effect() {
                let ret = player.aspTime.points.div(1e185).pow(0.02).add(1).mul(50)
                return ret.pow(tmp.aspBlood.buyables[18].effect).pow(tmp.aspBlood.buyables[19].effect)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return true },
        },
        13: {
            title: "<p style='transform: scale(-1, -1)'><alternate>SPACE BOOSTS HEART</alternate>",
            description: "Space Power boosts Heart Power gain.",
            cost: new Decimal(1e25),
            effect() {
                let ret = player.aspSpace.points.div(1e90).pow(0.03).add(1).mul(20)
                return ret.pow(tmp.aspBlood.buyables[18].effect).pow(tmp.aspBlood.buyables[19].effect)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return true },
        },
        14: {
            title: "<p style='transform: scale(-1, -1)'><alternate>SPACE BOOSTS HEART AGAIN</alternate>",
            description: "Space boosts Heart Power gain.",
            cost: new Decimal(1e33),
            effect() {
                let ret = player.aspSpace.space.div(1e60).pow(0.03).add(1).mul(10)
                return ret.pow(tmp.aspBlood.buyables[18].effect).pow(tmp.aspBlood.buyables[19].effect)
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { return true },
        },
        21: {
            title: "<p style='transform: scale(-1, -1)'><alternate>BETTER SCALING</alternate>",
            description: "Space Generators act as if they're bought 10× when you only buy once. Buying this does a forced Heart reset.",
            cost: new Decimal(1e17),
            unlocked() { return true },
            pay() { doReset("aspHeart", true) },
        },
        22: {
            title: "<p style='transform: scale(-1, -1)'><alternate>EVEN LESS JITTERING</alternate>",
            description: "Time Multipliers and Space Generators don't take anything away.",
            cost: new Decimal(1e25),
            unlocked() { return true },
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
                unlocked: () => hasMilestone("aspHeart", 5),
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
                upgradeKeep.push(11, 12, 13, 14, 21, 22)
            }
            layerDataReset("aspHeart", listKeep)
            if (!upgradeKeep.includes["milestones"]) player.aspHeart.milestones = milestoneKeep
            player.aspHeart.upgrades = upgradeKeep;
        }
    },

    type: "normal",
    requires: new Decimal(4.13e110),
    exponent: 0.09,
    gainMult() {
        mult = new Decimal(1).mul(tmp.aspRage.effect.gainBoost)
        if (hasUpgrade("aspHeart", 11)) mult = mult.mul(tmp.aspHeart.upgrades[11].effect)
        if (hasUpgrade("aspHeart", 12)) mult = mult.mul(tmp.aspHeart.upgrades[12].effect)
        if (hasUpgrade("aspHeart", 13)) mult = mult.mul(tmp.aspHeart.upgrades[13].effect)
        if (hasUpgrade("aspHeart", 14)) mult = mult.mul(tmp.aspHeart.upgrades[13].effect)
        if (hasUpgrade("aspHope", 31)) mult = mult.mul(tmp.aspHope.upgrades[31].effect)
        mult = mult.mul(tmp.aspLight.buyables[15].effect)
        mult = mult.mul(tmp.aspBlood.buyables[17].effect)
        return mult
    },
    gainExp() {
        let mult = new Decimal(1)
        if (inChallenge("aspDoom", 11)) mult = mult.mul(0.75)
        return mult
    },

    hotkeys: [
        { key: "h", description: "H: Absorb Heart Power", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
})
