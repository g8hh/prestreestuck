if (act == "0.0") addLayer("aspDoom", {
    name: "Doom",
    symbol: "<img src='data/doom.png' style='width:calc(80%);height:calc(80%);margin:10%'></img>",
    row: 6,
    position: 1,
    branches: [["skaia", 3]],

    layerShown() { return (hasMilestone("aspLife", 4) || player[this.layer].unlocked) && !hasUpgrade("skaia", 12) },
    resource: "Doom Power",
    baseAmount() { return player.points },
    baseResource: "点",
    color: "#306800",
    resetDescription: "Absorb ",

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            autoAuto: false,
            currentResearch: 0,
            researchExp: new Decimal(0),
        }
    },
    effect() {
        var effs = {
            pointBoost: applyPolynomialSoftcap(player.aspDoom.points.mul(10).add(1).pow(100), "1e413", 2).pow(tmp.aspBlood.buyables[26].effect)
        }
        return effs
    },
    effectDescription() {
        eff = this.effect();
        return "which are giving a ×" + format(eff.pointBoost) + " boost to point gain."
    },

    type: "normal",
    requires: new Decimal("4.13e6250"),
    exponent: 0.001,
    gainMult() {
        let mult = new Decimal(1)
        return mult.mul(tmp.aspBlood.buyables[25].effect)
    },
    gainExp() {
        let mult = new Decimal(1)
        return mult
    },

    milestones: {
        0: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>END OF THE WORLD</alternate></p>1 Doom Power",
            done() { return player[this.layer].best.gte(1) },
            effectDescription: "Keeps all Life, Light, Void, Hope and Rage milestones on Doom resets.",
        },
        1: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>PREPARE FOR EVACUATION</alternate></p>25 Doom Power",
            done() { return player[this.layer].best.gte(25) },
            effectDescription: "Keeps all Mind and Heart milestones and upgrades, Hope upgrades and Rage challenges on Doom resets.",
        },
        2: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>READY FOR THE PLAN</alternate></p>5,000 Doom Power",
            done() { return player[this.layer].best.gte(5000) },
            effectDescription: "Keeps all Space upgrades on Doom resets.",
        },
        3: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>IT IS ALMOST HERE</alternate></p>75,000 Doom Power",
            done() { return player[this.layer].best.gte(75000) },
            effectDescription: "Gets 5% of your Doom Power gain on reset per second.",
        },
        4: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>GET READY FOR THE ULTIMATE WRATH</alternate></p>1,000,000 Doom Power",
            done() { return player[this.layer].best.gte(1000000) },
            effectDescription: "Unlocks a new Tab (no not the drink).",
        },
        5: {
            requirementDescription: "<p style='transform: scale(-1, -1)'><alternate>YOU CAN NOT ESCAPE</alternate></p>" + format(1e70) + " Doom Power",
            done() { return player[this.layer].best.gte(1e70) },
            effectDescription: "You can bulk absorb Hope and Rage Essence. Why don't this appear sooner you might ask? Because the game went fine without it.",
        },
    },

    challenges: {
        rows: 1,
        cols: 5,
        11: {
            name: "<p style='transform: scale(-1, -1)'><alternate>THE ULTIMATE WRATH</alternate></p>",
            completionLimit: 9,
            challengeDescription() {
                return "Raises all non-static layers' (that means, all layers except for Hope and Rage) gain by ^0.75."
            },
            unlocked() { return true },
            goalDescription() {
                return format(["1e4950", "1e5500", "1e7500", "1e9350", "e13000", "e15500", "e19300", "e27000", "e43500", Decimal.dInf][challengeCompletions(this.layer, this.id)]) + ' 点'
            },
            canComplete() { return player.points.gte(["1e4950", "1e5500", "1e7500", "1e9350", "e13000", "e15500", "e19300", "e27000", "e43500", Decimal.dInf][challengeCompletions(this.layer, this.id)]) },
            rewardEffect() {
                let ret = {}
            },
            rewardDisplay() { return "???" },
            rewardDescription() {
                return [
                    "The minimum number of levels of each Light Discoveries is increased to 1,000,000 instead of 350.",
                    "Raises the effect of the first Time upgrade by 5, after the softcaps. And yes, you should be able to continue doing this challenge for more rewards.",
                    "Squares the second Time upgrade's effect. You still have a long way to go.",
                    "Cubes the first Void Enhancement's effect. That'll make it more interesting.",
                    "Squares the fourth Time upgrade's effect. Wow, who could have thought of that?",
                    "Tesseracts all of the second row of Time upgrades' effect. Wow, such boost, much synergy.",
                    "Increases the maximum number of challenges you can do per each Rage Challenge from 5 to 10.",
                    "Okay, you're almost there. Complete this challenge to give yourself a ^1.05 boost to point gain!",
                    "This is the last one. Complete this challenge to get 2 more wraths to conquer >:D",
                    "All challenges completed!",
                ][challengeCompletions(this.layer, this.id)]
            },
            onComplete() { buyMaxBuyable("skaia", 13) }
        },
        12: {
            name: "<p style='transform: scale(-1, -1)'><alternate>WHAT LAYERS</alternate></p>",
            completionLimit: 32,
            challengeDescription() {
                return "You cannot access any layer below this one. Their upgrades and milestones effect still exists though. Basically you'll have to play blind."
            },
            unlocked() { return challengeCompletions("aspDoom", 11) >= 9 },
            goalDescription() {
                return format(["e39000", "e52500", "e2250000", "e2425000", "e4075000", "e5375000", "e5645000", "e5950000", "e13025000", "e28275000", "e53395000", Decimal.dInf][challengeCompletions(this.layer, this.id)]) + ' 点'
            },
            canComplete() { return player.points.gte(["e39000", "e52500", "e2250000", "e2425000", "e4075000", "e5375000", "e5645000", "e5950000", "e13025000", "e28275000", "e53395000", Decimal.dInf][challengeCompletions(this.layer, this.id)]) },
            rewardEffect() {
                let ret = {}
            },
            rewardDisplay() { return "???" },
            rewardDescription() {
                return [
                    "Raises the effect of the first Hope Upgrade by ^1.1.",
                    "Squares the effect of the first Mind and Heart upgrade.",
                    "Triple tesseracts (a.k.a 64-cube or ^64) the effect of the third row of Hope upgrades.",
                    "Cubes the effect of the first Time Upgrade. Yes, I know we've done this before.",
                    "Cubes the effect of fifth row of Hope upgrades.",
                    "Cubes the effect of the first Space upgrade.",
                    "Tesseracts the effect of the third Space upgrade.",
                    "Tesseracts the effect of the seventh Space upgrade.",
                    "Cubes the effect of the ninth Space upgrade.",
                    "Well, since everything is automated now, I don't think this is a challenge anymore. Squares all of the second row of Hope Upgrades' effect.",
                    "Well, this is the last challenge for you. Unlocks new layers.",
                    "All challenges completed!",
                ][challengeCompletions(this.layer, this.id)]
            },
            onComplete() { buyMaxBuyable("skaia", 13) }
        },
        13: {
            name: "<p style='transform: scale(-1, -1)'><alternate>ONE HELL OF A WRATH</alternate></p>",
            completionLimit: 3,
            challengeDescription() {
                return "Tetrates point gain by ^^0.1."
            },
            unlocked() { return challengeCompletions("aspDoom", 11) >= 9 },
            goalDescription() {
                return format(["e47500", "e59200", "e82100", Decimal.dInf][challengeCompletions(this.layer, this.id)]) + ' 点'
            },
            canComplete() { return player.points.gte(["e47500", "e59200", "e82100", Decimal.dInf][challengeCompletions(this.layer, this.id)]) },
            rewardEffect() {
                let ret = {}
            },
            rewardDisplay() { return "???" },
            rewardDescription() {
                return [
                    "Automatically toggles the \"automatically toggles Hope and Rage Essence auto-reset\" toggle on.",
                    "Starts with 413 levels of the first Void Enhancement.",
                    "Automatically turn all of the Life Blessing on. Well, we don't need to actually disable it atm.",
                    "All challenges completed!",
                ][challengeCompletions(this.layer, this.id)]
            },
            onComplete() { buyMaxBuyable("skaia", 13) }
        },
    },

    onPrestige(gain) {
    },

    update(delta) {
        if (hasMilestone(this.layer, 3))
            addPoints(this.layer, tmp[this.layer].resetGain.mul(delta).mul(0.05))
        if (challengeCompletions("aspDoom", 13) >= 1) player.aspLight.autoAuto = true
        if (challengeCompletions("aspDoom", 13) >= 2) player.aspVoid.buyables[11] = player.aspVoid.buyables[11].max(413)
        if (challengeCompletions("aspDoom", 13) >= 3) for (var a = 11; a <= 13; a++) player.aspLife.buyables[a] = new Decimal(1)
    },

    doReset(pLayer) {
        if (pLayer && layers[pLayer].row > layers[this.layer].row) {
            var listKeep = [];
            if ((layers[pLayer].row == 7 && hasMilestone("skaia", 0))) {
                listKeep.push("milestones")
            }
            if ((layers[pLayer].row == 7 && hasMilestone("skaia", 3))) {
                listKeep.push("challenges")
            }
            layerDataReset(this.layer, listKeep)
        }
    },

    microtabs: {
        stuff: {
            "Milestones": {
                content: [
                    ["blank", "15px"],
                    "milestones",
                ]
            },
            "Wraths": {
                unlocked() { return hasMilestone("aspDoom", 4) },
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
        ["blank", "35px"],
        ["microtabs", "stuff"],
        ["blank", "35px"],
    ],

    hotkeys: [
        { key: "i", description: "I: Absorb Life Power", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
})
