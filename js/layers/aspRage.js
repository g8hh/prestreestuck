addLayer("aspRage", {
    name: "Rage",
    symbol: "<img src='data/rage.png' style='width:calc(80% + 0px);height:calc(80% + 0px);margin:10%'></img>",
    row: 3,
    position: 1,
    branches: [["aspMind", 2]],

    layerShown() { return (hasUpgrade("aspMind", 24) || player.aspRage.unlocked) && !inChallenge("aspDoom", 12) && !hasUpgrade("skaia", 12) },
    resource: "Rage Essence",
    baseAmount() { return player.aspMind.points },
    baseResource: "心灵力量",
    color: "#520c61",
    resetDescription: "Absorb ",

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            autoReset: false,
        }
    },
    effect() {
        return {
            gainBoost: Decimal.pow(1000000, player[this.layer].points.pow(0.85))
        }
    },
    effectDescription() {
        eff = this.effect();
        return "which are boosting Heart Power gain by ×" + format(eff.gainBoost)
    },

    type: "static",
    requires() {
        let req = new Decimal(1e32)
        if (challengeCompletions("aspRage", 11)) req = req.div(tmp.aspRage.challenges[11].rewardEffect.rageReqReduce)
        if (hasUpgrade("aspHope", 11)) req = req.div(tmp.aspHope.upgrades[11].effect)
        if (hasUpgrade("aspHope", 43)) req = req.div(1e10)
        req = req.div(tmp.aspLight.buyables[17].effect)
        return req;
    },
    canBuyMax() { return hasMilestone("aspDoom", 5) },
    base: 1000,
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
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>BRINGER OF CHAOS</alternate></p>1 Rage Essence",
            done() { return player[this.layer].best.gte(1) },
            effectDescription: "Gets all Space upgrades and the first six Mind/Heart milestone on Rage reset.",
        },
        1: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>COMMENCE DESTRUCTION</alternate></p>3 Rage Essence",
            done() { return player[this.layer].best.gte(3) },
            effectDescription: "Unlocks Rage challenges.",
        },
        2: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>UNEXPECTED SYNERGY</alternate></p>7 Rage Essence",
            done() { return player[this.layer].best.gte(7) },
            effectDescription: "Gives you all Heart and Mind upgrades and their seventh milestone on Rage reset.",
        },
        3: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>HOPEFUL RAGE</alternate></p>25 Rage Essence",
            toggles: [["aspRage", "autoReset"]],
            done() { return player[this.layer].best.gte(25) },
            effectDescription: "Automatically do Hope resets.",
        },
    },

    challenges: {
        rows: 1,
        cols: 5,
        11: {
            name: "<p style='transform: scale(-1, -1)'><alternate>GET TO THE POINT</alternate></p>",
            completionLimit: () => challengeCompletions("aspDoom", 11) >= 7 ? 10 : 5,
            challengeDescription() {
                return "<h3>(" + challengeCompletions(this.layer, this.id) + " / " + this.completionLimit() + " completions)</h3><br/>\
                Point gain is softcapped beyond 1e20 points, with a magnitude of " + format((challengeCompletions(this.layer, this.id) + 2)) + "."
            },
            unlocked() { return true },
            goalDescription() {
                return format((1e25 * 1e25 ** challengeCompletions(this.layer, this.id)) ** tmp.aspRage.challenges[14].rewardEffect) + ' 点'
            },
            canComplete() { return player.points.gte((1e25 * 1e25 ** challengeCompletions(this.layer, this.id)) ** tmp.aspRage.challenges[14].rewardEffect) },
            rewardEffect() {
                let ret = {
                    hopeReqReduce: player.points.add(1).tetrate(challengeCompletions(this.layer, this.id) * 0.01).pow(1.2).pow(tmp.aspBlood.buyables[20].effect),
                    rageReqReduce: player.points.add(1).tetrate(challengeCompletions(this.layer, this.id) * 0.01).pow(tmp.aspBlood.buyables[20].effect),
                }
                return ret;
            },
            rewardDisplay() { return "÷" + format(this.rewardEffect().rageReqReduce) + " and ÷" + format(this.rewardEffect().hopeReqReduce) + ", respectively." },
            rewardDescription: "Points decrease the requirement for Rage Essence and Hope Essence absorb.",
            onComplete() { buyMaxBuyable("skaia", 13) }
        },
        12: {
            name: "<p style='transform: scale(-1, -1)'><alternate>TIME DILATION</alternate></p>",
            completionLimit: () => challengeCompletions("aspDoom", 11) >= 7 ? 10 : 5,
            challengeDescription() {
                return "<h3>(" + challengeCompletions(this.layer, this.id) + " / " + this.completionLimit() + " completions)</h3><br/>\
                Raises Time Power gain to the power of ^" + format(1 / (challengeCompletions(this.layer, this.id) + 2), 3) + "."
            },
            unlocked() { return challengeCompletions(this.layer, this.id - 1) },
            goalDescription() {
                return format(new Decimal(1e3).pow((challengeCompletions(this.layer, this.id) + 1)).pow(tmp.aspRage.challenges[14].rewardEffect)) + ' 时间力量'
            },
            canComplete() { return player.aspTime.points.gte(new Decimal(1e3).pow((challengeCompletions(this.layer, this.id) + 1)).pow(tmp.aspRage.challenges[14].rewardEffect)) },
            rewardEffect() {
                let times = challengeCompletions(this.layer, this.id)
                let ret = player.aspRage.points.mul(player.aspHope.points).add(1).pow((2 * times) ** ((times + 1) ** 0.25))
                return ret.pow(tmp.aspBlood.buyables[21].effect);
            },
            rewardDisplay() { return "×" + format(this.rewardEffect()) },
            rewardDescription: "Rage Essence and Hope Essence boosts Time Power gain.",
            onComplete() { buyMaxBuyable("skaia", 13) }
        },
        13: {
            name: "<p style='transform: scale(-1, -1)'><alternate>SPACE EXPANSION</alternate></p>",
            completionLimit: () => challengeCompletions("aspDoom", 11) >= 7 ? 10 : 5,
            challengeDescription() {
                return "<h3>(" + challengeCompletions(this.layer, this.id) + " / " + this.completionLimit() + " completions)</h3><br/>\
                Raises Space Power gain to the power of ^" + format(1 / (challengeCompletions(this.layer, this.id) + 2), 3) + "."
            },
            unlocked() { return challengeCompletions(this.layer, this.id - 1) },
            goalDescription() {
                return format(new Decimal(1e5).pow((challengeCompletions(this.layer, this.id) + 1)).pow(tmp.aspRage.challenges[14].rewardEffect)) + ' Space Power'
            },
            canComplete() { return player.aspSpace.points.gte(new Decimal(1e5).pow((challengeCompletions(this.layer, this.id) + 1)).pow(tmp.aspRage.challenges[14].rewardEffect)) },
            rewardEffect() {
                let times = challengeCompletions(this.layer, this.id)
                let ret = player.aspRage.points.mul(player.aspHope.points).add(1).pow((2 * times) ** ((times + 1) ** 0.2))
                return ret.pow(tmp.aspBlood.buyables[22].effect);
            },
            rewardDisplay() { return "×" + format(this.rewardEffect()) },
            rewardDescription: "Rage Essence and Hope Essence boosts Space Power gain.",
            onComplete() { buyMaxBuyable("skaia", 13) }
        },
        14: {
            name: "<p style='transform: scale(-1, -1)'><alternate>TETRATION PROBLEM</alternate></p>",
            completionLimit: () => challengeCompletions("aspDoom", 11) >= 7 ? 10 : 5,
            challengeDescription() {
                return "<h3>(" + challengeCompletions(this.layer, this.id) + " / " + this.completionLimit() + " completions)</h3><br/>\
                Tetrates point gain by ^^" + format(1 - (challengeCompletions(this.layer, this.id) + 1) / 20, 3) + "."
            },
            unlocked() { return challengeCompletions(this.layer, this.id - 1) },
            goalDescription() {
                return format(new Decimal("1e600")) + ' 点'
            },
            canComplete() { return player.points.gte(new Decimal("1e600")) },
            rewardEffect() {
                let ret = 1 - Math.sqrt(challengeCompletions(this.layer, this.id)) / 8
                return ret;
            },
            rewardDisplay() { return "^" + format(this.rewardEffect()) },
            rewardDescription: "Reduces the requirements of the first three challenges.",
            onComplete() { buyMaxBuyable("skaia", 13) }
        },
        15: {
            name: "<p style='transform: scale(-1, -1)'><alternate>THE ULTIMATE RAGE</alternate></p>",
            challengeDescription() {
                return "<h3>(" + challengeCompletions(this.layer, this.id) + " / " + this.completionLimit + " completions)</h3><br/>\
                All of the previous challenges, combined."
            },
            countsAs: [11, 12, 13, 14],
            unlocked() { if (player.aspLight.unlocked) return false; for (var a = 11; a <= 14; a++) if (player.aspRage.challenges[a] < 5) return false; return true },
            goalDescription() {
                return format(1e34) + ' 点'
            },
            canComplete() { return player.points.gte(1e34) },
            rewardDescription: "Unlocks an aspect layer.",
            onComplete() { buyMaxBuyable("skaia", 13) }
        },
    }, 


    onPrestige(gain) {
        gain = new Decimal(gain)
        if (gain.gt(0)) buyMaxBuyable("skaia", 12)
    },

    update(delta) {
        if (player[this.layer].autoReset) doReset("aspHope")
    },

    microtabs: {
        stuff: {
            "Milestones": {
                content: [
                    ["blank", "15px"],
                    "milestones"
                ]
            },
            "Challenges": {
                unlocked: () => hasMilestone("aspRage", 1),
                content: [
                    ["blank", "15px"],
                    "challenges"
                ]
            },
        },
    },

    resetsNothing: () => hasMilestone("aspLight", 2),

    doReset(pLayer) {
        if (pLayer && layers[pLayer].row > layers[this.layer].row) {
            var listKeep = [];
            var upgradeKeep = [];
            if ((pLayer === "aspLight" && hasMilestone("aspLight", 0)) || (pLayer === "aspVoid" && hasMilestone("aspVoid", 0)) || (pLayer === "aspDoom" && hasMilestone("aspDoom", 0)) || (layers[pLayer].row == 7 && hasMilestone("skaia", 1))) {
                listKeep.push("milestones")
            }
            if ((pLayer === "aspLight" && hasMilestone("aspVoid", 1)) || (pLayer === "aspVoid" && hasMilestone("aspVoid", 1)) || (pLayer === "aspDoom" && hasMilestone("aspDoom", 1)) || (layers[pLayer].row == 7 && hasMilestone("skaia", 2))) {
                listKeep.push("challenges")
            }
            layerDataReset("aspRage", listKeep)
        }
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        ["blank", "25px"],
        ["microtabs", "stuff"],
        ["blank", "35px"],
    ],

    hotkeys: [
        { key: "r", description: "R: Absorb Rage Essence", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
})
