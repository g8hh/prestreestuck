addLayer("tracker", {
    name: "Tracker",
    symbol: () => player.tracker.points,
    row: "side",

    resource: "Potential",
    color: "#ffffff",
    type: "none",

    componentStyles: {
        "achievement": { margin: "5px", "background-origin": "border-box" }
    },

    startData() {
        return {
            points: new Decimal(0),
            achNeg1: false,
            achNeg4: 0,
        }
    },

    achievements: {
        "-1": {
            name() { return hasAchievement("tracker", this.id) ? "You Have Potential" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/s1.png" : ""},
            done() { return player.tracker.achNeg1 },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            goalTooltip: "Hint: You have potential.",
            doneTooltip: "Click the potential counter.<br/>Hint: You have potential.",
        },
        "-2": {
            name() { return hasAchievement("tracker", this.id) ? "Definitely Not a Google Thing" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/s2.png" : ""},
            done() { return window.location.hostname == "cc.bingj.com" },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            goalTooltip: "Hint: Have you tried to Bing it?",
            doneTooltip: "Play the game on Bing's cache.<br/>Hint: Have you tried to Bing it?",
        },
        "-3": {
            name() { return hasAchievement("tracker", this.id) ? "One For Each Extended Sign" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/s3.png" : ""},
            done() { return player.timePlayed >= 1036800 },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            goalTooltip: () => "Hint: This one requires patience. (" + format(player.timePlayed / 10368) + "%)",
            doneTooltip: "Play the game for 288 hours.<br/>Hint: This one requires patience.",
        },
        "-4": {
            name() { return hasAchievement("tracker", this.id) ? "<ts>Colors of Zillimayhem</ts>" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/s4.png" : ""},
            done() { return player.tracker.achNeg4 >= 2478 },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            goalTooltip: () => "Hint: Pick the Candy path. (" + format(player.tracker.achNeg4 / 24.78) + "%)",
            doneTooltip: "Use the <ts>Trickster</ts> theme for more than 41.3 minutes.<br/>Hint: Pick the Candy path.",
        },


        11: {
            name() { return hasAchievement("tracker", this.id) ? "And So It Begins" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/11.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) },
            done() { return act == "0.0" && player.aspTime.points.gte(1) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Get a Time Power.",
        },
        12: {
            name() { return hasAchievement("tracker", this.id) ? "Accelerate" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/12.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) },
            done() { return act == "0.0" && player.aspTime.buyables[12].gte(1) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Get a Time Multiplier^2.",
        },
        13: {
            name() { return hasAchievement("tracker", this.id) ? "It's a Clicker!" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/13.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) },
            done() { return act == "0.0" && player.aspTime.points.gte(1000000) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Reach 1,000,000 Time Power.",
        },
        14: {
            name() { return hasAchievement("tracker", this.id) ? "All Over Again" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/14.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) },
            done() { return act == "0.0" && player.aspTime.buyables[21].gte(1) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Perform a Time Booster reset.",
        },
        15: {
            name() { return hasAchievement("tracker", this.id) ? "From Active to Idle" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/15.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) },
            done() { return act == "0.0" && player.aspSpace.points.gte(1) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Get a Space Power.",
        },
        16: {
            name() { return hasAchievement("tracker", this.id) ? "Accelerate^2: Beyond Speed" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/16.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || player.aspSpace.unlocked) },
            done() { return act == "0.0" && player.aspSpace.buyables[12].gte(1) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Get a Space Accelerator^2.",
        },
        17: {
            name() { return hasAchievement("tracker", this.id) ? "Wait, These Don't Have Off Switches?" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/17.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || player.aspSpace.unlocked) },
            done() { return act == "0.0" && hasUpgrade("aspSpace", 14) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Buy the 100,000,000 Space Space Upgrade.",
        },
        18: {
            name() { return hasAchievement("tracker", this.id) ? "A Whopping Googol" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/18.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || player.aspSpace.unlocked) },
            done() { return act == "0.0" && player.points.gte(1e100) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Reach 1e100 points.",
        },
        19: {
            name() { return hasAchievement("tracker", this.id) ? "Extra Layers" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/19.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || player.aspSpace.unlocked) },
            done() { return act == "0.0" && (player.aspMind.unlocked || player.aspHeart.unlocked) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Unlock 3 aspect layers.<br/>Reward: Unlock Space Accelerator.",
        },
        20: {
            name() { return hasAchievement("tracker", this.id) ? "One Timewall Broken, Many More To Go" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/20.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || player.aspSpace.unlocked) },
            done() { return act == "0.0" && player.aspMind.unlocked && player.aspHeart.unlocked },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Unlock 4 aspect layers.<br/>Reward: Replace the \"Unlock new aspect layers\" Space upgrade into more actually useful upgrades.",
        },
        21: {
            name() { return hasAchievement("tracker", this.id) ? "3nd" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/21.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || player.aspMind.unlocked || player.aspHeart.unlocked) },
            done() { return act == "0.0" && hasMilestone("aspMind", 2) && hasMilestone("aspHeart", 2) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Get the 100 Mind Power and the 100 Heart Power milestone.",
        },
        22: {
            name() { return hasAchievement("tracker", this.id) ? "Two By The Two By The Two" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/22.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || player.aspMind.unlocked || player.aspHeart.unlocked) },
            done() { return act == "0.0" && player.aspTime.buyables[22].gte(4) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Get 4 Time Booster^2s.",
        },
        23: {
            name() { return hasAchievement("tracker", this.id) ? "The Space Generator^7 was a lie" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/23.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || player.aspMind.unlocked || player.aspHeart.unlocked) },
            done() { return act == "0.0" && player.aspSpace.buyables[16].gte(11) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Get 11 Space Generator^6s.",
        },
        24: {
            name() { return hasAchievement("tracker", this.id) ? "The 64-bit Limit Can't Stop Us Now!" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/24.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || player.aspMind.unlocked || player.aspHeart.unlocked) },
            done() { return act == "0.0" && player.points.gte(Number.MAX_VALUE) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Reach 1.798e308 points.",
        },
        25: {
            name() { return hasAchievement("tracker", this.id) ? "The <gs>Green Sun</gs> Isn't Actually That Big" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/25.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || player.aspMind.unlocked || player.aspHeart.unlocked) },
            done() { return act == "0.0" && player.aspSpace.space.gte(2.32045411685e136) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Reach 2.320e136 Space.",
        },
        26: {
            name() { return hasAchievement("tracker", this.id) ? "Sense of Achievements" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/26.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || tmp.skaia.layerShown) },
            done() { return act == "0.0" && player.skaia.level.gte(2) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Reach Skaia Level 2.",
        },
        27: {
            name() { return hasAchievement("tracker", this.id) ? "Challenge Speedrun 100% Glitchless" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/27.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || tmp.skaia.layerShown) },
            done() { return act == "0.0" && player.skaia.buyables[13].gte(20) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Fully complete all first four Rage Challenges.<br/>Reward: Unlock the fifth Rage Challenge.",
        },
        28: {
            name() { return hasAchievement("tracker", this.id) ? "Devilspace" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/28.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || tmp.skaia.layerShown) },
            done() { return act == "0.0" && player.aspSpace.points.gte("e666") },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Reach 1e666 Space Power.",
        },
        29: {
            name() { return hasAchievement("tracker", this.id) ? "The Plan" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/29.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || tmp.skaia.layerShown) },
            done() { return act == "0.0" && hasUpgrade("skaia", 11) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            goalTooltip: "?????",
            doneTooltip: "Begin the plan.<br/>Reward: Unlock a new layer.",
        },
        30: {
            name() { return hasAchievement("tracker", this.id) ? "The 128-bit Limit Can't Stop Us Now!" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/30.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || tmp.skaia.layerShown) },
            done() { return act == "0.0" && player.points.gte("1.189731495e4932") },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Reach 1e4932 points.",
        },
        31: {
            name() { return hasAchievement("tracker", this.id) ? "Artificially Controlled Economy" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/31.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || hasUpgrade("skaia", 11)) },
            done() { return act == "0.0" && hasUpgrade("skaia", 22) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Buy the 1e11 boondollar upgrade.",
        },
        32: {
            name() { return hasAchievement("tracker", this.id) ? "Does This Echeladder Even Has An End?" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/32.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || hasUpgrade("skaia", 11)) },
            done() { return act == "0.0" && player.skaia.level.gte(100) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            goalTooltip: "Reach Skaia Level 100.",
            doneTooltip: "Reach Skaia Level 100.<br/>Reward: Passive boondollar gain formula grows faster past Skaia Level 100.",
        },
        33: {
            name() { return hasAchievement("tracker", this.id) ? "413 boonbonds???" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/33.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || hasUpgrade("skaia", 11)) },
            done() { return act == "0.0" && player.skaia.boondollars.gte(413e18) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Reach 4.13e20 boondollars.",
        },
        34: {
            name() { return hasAchievement("tracker", this.id) ? "Is This A Synergism Reference???" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/34.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || hasUpgrade("skaia", 11)) },
            done() { return act == "0.0" && (player.aspBlood.unlocked || player.aspBreath.unlocked) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Unlock 11 aspect layers.",
        },
        35: {
            name() { return hasAchievement("tracker", this.id) ? "Finally, An Off Switch" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/35.png" : ""},
            unlocked() { return (act == "0.0" || hasAchievement("tracker", 11)) && (hasAchievement("tracker", this.id) || hasUpgrade("skaia", 11)) },
            done() { return act == "0.0" && hasMilestone("skaia", 5) },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            goalTooltip: "?????",
            doneTooltip: "Get the \"25 Breath Essence & 25 Blood Essence\" Skaia milestone.",
        },
        111: {
            name() { return hasAchievement("tracker", this.id) ? "A Second Time" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/111.png" : ""},
            unlocked() { return (act == "0.1" || hasAchievement("tracker", 111)) },
            done() { return act == "0.1" },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Reach beyond the circle.",
        },
        112: {
            name() { return hasAchievement("tracker", this.id) ? "An Insane Multiple of One Googolplex" : "?????"},
            image() { return hasAchievement("tracker", this.id) ? "data/achs/112.png" : ""},
            unlocked() { return (act == "0.1" || hasAchievement("tracker", 112)) },
            done() { return act == "0.1" && player.points.gte("ee100") },
            onComplete() { player.tracker.points = player.tracker.points.add(1) },
            tooltip: "Reach e1e100 points.",
        },
    },

    update(delta) {
        if (meta.options.theme == 3) player.tracker.achNeg4 += rawDiff
    },

    tabFormat: [
        ["raw-html", () => `You have <h2 style="--res:#ffffff; color: var(--res); text-shadow: 0px 0px 10px var(--res);" onclick="player.tracker.achNeg1 = true">${formatWhole(player.tracker.points)}</h2> potential`],
        ["raw-html", `You gain 1 potential per achievement you get, including secrets.`],
        ["blank", "25px"],
        ["microtabs", "stuff"],
        ["blank", "35px"],
    ],

    microtabs: {
        stuff: {
            "Act 0": {
                unlocked() { 
                    return act == "0.0" || hasAchievement("tracker", 11)
                },
                content: [
                    ["blank", "25px"],
                    ["raw-html", () => (act == "0.0" || hasAchievement("tracker", 11)) ? `
                        <div class="act-bar" style="">
                            <h2>Act 0 - Part 1</h2><br/>
                            “Genesis”
                        </div>
                    ` : ``],
                    ["row", [["achievement", 11], ["achievement", 12], ["achievement", 13], ["achievement", 14], ["achievement", 15]]],
                    ["row", [["achievement", 16], ["achievement", 17], ["achievement", 18], ["achievement", 19], ["achievement", 20]]],
                    ["row", [["achievement", 21], ["achievement", 22], ["achievement", 23], ["achievement", 24], ["achievement", 25]]],
                    ["row", [["achievement", 26], ["achievement", 27], ["achievement", 28], ["achievement", 29], ["achievement", 30]]],
                    ["row", [["achievement", 31], ["achievement", 32], ["achievement", 33], ["achievement", 34], ["achievement", 35]]],
                    ["raw-html", () => (act == "0.1" || hasAchievement("tracker", 111)) ? `
                        <div class="act-bar" style="">
                            <h2>Act 0 - Part 2</h2><br/>
                            “Skaia”
                        </div>
                    ` : ``],
                    ["row", [["achievement", 111], ["achievement", 112], ["achievement", 113], ["achievement", 114], ["achievement", 115]]],
                ],
            },
            "Secrets": {
                content: [
                    ["blank", "25px"],
                    ["raw-html", `
                        <div class="act-bar" style="">
                            <h2>Secrets</h2>
                        </div>
                    `],
                    ["row", [["achievement", -1], ["achievement", -2], ["achievement", -3], ["achievement", -4], ["achievement", -5]]],
                ],
            },
        }
    },
})