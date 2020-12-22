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
        }
    },
    effect() {
        return {
            gainBoost: Decimal.pow(100000, player[this.layer].points.pow(0.85))
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
    },

    onPrestige(gain) {
        console.log(gain)
        gain = new Decimal(gain)
        if (gain.gt(0)) buyMaxBuyable("skaia", 11)
    },

    hotkeys: [
        { key: "o", description: "O: Absorb Hope Essence", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
})
