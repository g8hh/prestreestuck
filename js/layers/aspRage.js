addLayer("aspRage", {
    name: "Rage",
    symbol: "<img src='data/rage.png' style='width:calc(80% + 0px);height:calc(80% + 0px);margin:10%'></img>",
    row: 3,
    position: 1,
    branches: [["aspMind", 2]],

    layerShown() { return hasUpgrade("aspMind", 24) || player.aspRage.unlocked },
    resource: "Rage Essence",
    baseAmount() { return player.aspMind.points },
    baseResource: "Mind Power",
    color: "#520c61",
    resetDescription: "Absorb ",

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
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
        return req;
    },
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
    },

    challenges: {
        rows: 1,
        cols: 3,
        11: {
            name: "<p style='transform: scale(-1, -1)'><alternate>GET TO THE POINT</alternate></p>",
            completionLimit: 5,
            challengeDescription() {
                return "<h3>(" + challengeCompletions(this.layer, this.id) + " / " + this.completionLimit + " completions)</h3><br/>\
                Point gain is softcapped beyond 1e20 points, with a magnitude of " + format((challengeCompletions(this.layer, this.id) + 2)) + "."
            },
            unlocked() { return true },
            goalDescription() {
                return format(1e25 * 1e25 ** challengeCompletions(this.layer, this.id)) + ' points'
            },
            canComplete() { return player.points.gte(1e25 * 1e25 ** challengeCompletions(this.layer, this.id)) },
            rewardEffect() {
                let ret = {
                    hopeReqReduce: player.points.add(1).tetrate(challengeCompletions(this.layer, this.id) * 0.01).pow(1.2),
                    rageReqReduce: player.points.add(1).tetrate(challengeCompletions(this.layer, this.id) * 0.01),
                }
                return ret;
            },
            rewardDisplay() { return "÷" + format(this.rewardEffect().rageReqReduce) + " and ÷" + format(this.rewardEffect().hopeReqReduce) + ", respectively." },
            rewardDescription: "Points decrease the requirement for Rage Essence and Hope Essence absorb.",
            onComplete() { buyMaxBuyable("skaia", 13) }
        },
        12: {
            name: "<p style='transform: scale(-1, -1)'><alternate>TIME DILATION</alternate></p>",
            completionLimit: 5,
            challengeDescription() {
                return "<h3>(" + challengeCompletions(this.layer, this.id) + " / " + this.completionLimit + " completions)</h3><br/>\
                Raises Time Power gain to the power of ^" + format(1 / (challengeCompletions(this.layer, this.id) + 2)) + "."
            },
            unlocked() { return challengeCompletions(this.layer, this.id - 1) },
            goalDescription() {
                return format(new Decimal(1e30).pow((challengeCompletions(this.layer, this.id) + 1) ** 2)) + ' Time Power'
            },
            canComplete() { return player.aspTime.points.gte(new Decimal(1e30).pow((challengeCompletions(this.layer, this.id) + 1) ** 2)) },
            rewardEffect() {
                let times = challengeCompletions(this.layer, this.id)
                let ret = player.aspRage.points.mul(player.aspHope.points).add(1).pow((2 * times) ** ((times + 1) ** 0.25))
                return ret;
            },
            rewardDisplay() { return "×" + format(this.rewardEffect()) },
            rewardDescription: "Rage Essence and Hope Essence boosts Time Power gain.",
            onComplete() { buyMaxBuyable("skaia", 13) }
        },
        13: {
            name: "<p style='transform: scale(-1, -1)'><alternate>SPACE EXPANSION</alternate></p>",
            completionLimit: 5,
            challengeDescription() {
                return "<h3>(" + challengeCompletions(this.layer, this.id) + " / " + this.completionLimit + " completions)</h3><br/>\
                Raises Space Power gain to the power of ^" + format(1 / (challengeCompletions(this.layer, this.id) + 4)) + "."
            },
            unlocked() { return challengeCompletions(this.layer, this.id - 1) },
            goalDescription() {
                return format(new Decimal(1e20).pow((challengeCompletions(this.layer, this.id) + 1) ** 2)) + ' Space Power'
            },
            canComplete() { return player.aspSpace.points.gte(new Decimal(1e20).pow((challengeCompletions(this.layer, this.id) + 1) ** 2)) },
            rewardEffect() {
                let times = challengeCompletions(this.layer, this.id)
                let ret = player.aspRage.points.mul(player.aspHope.points).add(1).pow((2 * times) ** ((times + 1) ** 0.2))
                return ret;
            },
            rewardDisplay() { return "×" + format(this.rewardEffect()) },
            rewardDescription: "Rage Essence and Hope Essence boosts Space Power gain.",
            onComplete() { buyMaxBuyable("skaia", 13) }
        },
    }, 


    onPrestige(gain) {
        gain = new Decimal(gain)
        if (gain.gt(0)) buyMaxBuyable("skaia", 12)
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
