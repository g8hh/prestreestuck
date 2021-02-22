addLayer("metaMeta", {
    name: "Meta",
    symbol: "<img src='data/favicon.png' style='width:calc(60%);height:calc(60%);margin:20%'></img>",
    row: 8,
    position: 0,

    layerShown() { return hasUpgrade("skaia", 14) },
    resource: "Metaness",
    color: "#31aeb0",
    type: "custom",
    baseAmount() { return player.points },
    requires: new Decimal(10),
    canReset() { return new Decimal(tmp[this.layer].resetGain).gte(1) },
    canBuyMax() { return true },
    prestigeButtonText() { 
        return "Ascend for <b>+" + formatWhole(tmp[this.layer].resetGain) + "</b> Metaness<br/>Next at " + formatWhole(tmp[this.layer].nextAt) + " points"
    },
    getResetGain() {
        var pow = buyableEffect(this.layer, 13).mul(hasUpgrade("metaMeta", 11) ? 1.12 : 1).mul(tmp.metaMeta.effect.overflowNerf)
        return applyLogapolynomialSoftcap(player.points.div(2).add(1).slog(10).pow(0.4).pow(pow).floor(), "e2100000", 2)
    },
    getNextAt() {
        var pow = buyableEffect(this.layer, 13).mul(hasUpgrade("metaMeta", 11) ? 1.12 : 1).mul(tmp.metaMeta.effect.overflowNerf)
        return Decimal.tetrate(10, applyLogapolynomialSoftcap(new Decimal(tmp[this.layer].resetGain), "e2100000", 0.5).add(1).root(0.4).root(pow)).sub(1).mul(2)
    },

    effect() {
        var mtn = player[this.layer].points.pow(buyableEffect(this.layer, 12)).mul(buyableEffect(this.layer, 22).div(100).add(1)).add(hasUpgrade("metaMeta", 32) ? 1e6 : 0)
        var mtt = new Decimal(player[this.layer].resetTime).pow(buyableEffect(this.layer, 11)).add(hasUpgrade("metaMeta", 23) ? 1e3 : 0)
        var asf = player[this.layer].aspectFaucets[0].add(1).pow(11.11)
        var clf = player[this.layer].classFaucets[0].add(1).pow(41.3)
        var nrf = player[this.layer].overflowsTotal.div(5).add(1).pow(player[this.layer].overflowsTotal.pow(0.5))
        var bns = new Decimal(1)
        for (var a = 51; a <= 62; a++) bns = bns.mul(tmp[this.layer].buyables[a].effect)
        var tet = mtn.pow(mtt).add(1).log(10).mul(bns).mul(asf).mul(clf).root(nrf)
        if (tet.gt(Number.MAX_VALUE)) tet = Number.MAX_VALUE
        var eff = {
            aspectFaucetPower: asf,
            classFaucetPower: clf,
            overflowNerf: nrf,
            pointBoost: mtn.add(1).tetrate(tet)
        }
        return eff
    },
    effectDescription() {
        eff = this.effect();
        return "which are giving a " + format(eff.pointBoost) + "× boost to point gain based on time since this Meta-Ascend."
    },

    startData() {
        return {
            unlocked: true,
            remeta: false,
            points: new Decimal(0),
            meta: new Decimal(0),
            overflows: new Decimal(0),
            overflowsTotal: new Decimal(0),
            aspectFaucets: Array.from({ length: 12 }, _ => new Decimal(0)),
            classFaucets: Array.from({ length: 12 }, _ => new Decimal(0)),
        }
    },

    buyables: {
        rows: 2,
        cols: 3,
        11: {
            cost(x) { return Decimal.pow(20, Decimal.pow(2, x || getBuyableAmount(this.layer, this.id))) },
            effect(x) { return Decimal.pow(1.5, (x || getBuyableAmount(this.layer, this.id)).cbrt()) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Meta-Space Upgrades"
            },
            display() {
                return "which are boosting Meta-Ascend time in the effect formula by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(hasUpgrade("metaMeta", 14) ? 2 : 1))
            },
        },
        12: {
            cost(x) { return Decimal.pow(40, Decimal.pow(2, x || getBuyableAmount(this.layer, this.id))) },
            effect(x) { return Decimal.pow(1.5, x || getBuyableAmount(this.layer, this.id)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Meta-Time Upgrades"
            },
            display() {
                return "which are boosting Metaness amount in the effect formula by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(hasUpgrade("metaMeta", 14) ? 2 : 1))
            },
        },
        13: {
            cost(x) { 
                if ((x || getBuyableAmount(this.layer, this.id)).gte(10)) return Decimal.dInf
                return Decimal.pow(80, Decimal.pow(3, x || getBuyableAmount(this.layer, this.id))) 
            },
            effect(x) { return Decimal.pow(2 + (hasUpgrade("metaMeta", 44) ? player.metaMeta.meta * 0.01 : 1), x || getBuyableAmount(this.layer, this.id)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Meta-Meta Upgrades"
            },
            display() {
                return "which are boosting Metaness amount on Meta-ascend by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(hasUpgrade("metaMeta", 14) ? 2 : 1))
            },
        },
        21: {
            cost(x) { return Decimal.pow(25000, Decimal.pow(1.02, x || getBuyableAmount(this.layer, this.id))) },
            effect(x) { return x || getBuyableAmount(this.layer, this.id) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Meta-Heart Upgrades"
            },
            display() {
                return "which are giving " + format(tmp[this.layer].buyables[this.id].effect) + "% of your Metaness gained on Meta-ascend every second.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(hasUpgrade("metaMeta", 41) ? 3 : 1))
            },
        },
        22: {
            cost(x) { return Decimal.pow(4e13, Decimal.pow(1.025, x || getBuyableAmount(this.layer, this.id))) },
            effect(x) { return player.metaMeta.points.add(1).log(10).mul(x || getBuyableAmount(this.layer, this.id)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Meta-Mind Upgrades"
            },
            display() {
                return "which are making Metaness in the effect formula " + format(tmp[this.layer].buyables[this.id].effect) + "% stronger based on Metaness.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(hasUpgrade("metaMeta", 41) ? 3 : 1))
            },
        },
        23: {
            cost(x) { return Decimal.pow(1e15, Decimal.pow(1.01, x || getBuyableAmount(this.layer, this.id))) },
            effect(x) { 
                let ret = (x || getBuyableAmount(this.layer, this.id)) ** 2.5 / Math.log10(player.metaMeta.resetTime + 10) ** 0.3 * 75
                for (var a = 31; a <= 42; a++) ret *= buyableEffect(this.layer, a) / 100 + 1
                return ret
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Meta-Meta-Meta Upgrades"
            },
            display() {
                return "which are speeding up the Meta-Ascension time by an additional " + format(tmp[this.layer].buyables[this.id].effect) + "% based on Meta-Ascension time.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(hasUpgrade("metaMeta", 41) ? 3 : 1))
            },
        },
        31: {
            cost(x) { return Decimal.pow(4e132, Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2.5)) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)) * 75 },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(2000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 2,000<br/>Time Accelerators"
            },
            display() {
                return "which are boosting Meta-Meta-Meta Upgrade effect by an additional " + format(tmp[this.layer].buyables[this.id].effect) + "%.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        32: {
            cost(x) { return Decimal.pow(1e150, Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2.5)) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)) * 120 },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(2000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 2,000<br/>Space Accelerators"
            },
            display() {
                return "which are boosting Meta-Meta-Meta Upgrade effect by an additional " + format(tmp[this.layer].buyables[this.id].effect) + "%.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        33: {
            cost(x) { return Decimal.pow("e412", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2.5)) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)) * 11111 },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(2000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 2,000<br/>Mind Accelerators"
            },
            display() {
                return "which are boosting Meta-Meta-Meta Upgrade effect by an additional " + format(tmp[this.layer].buyables[this.id].effect) + "%.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        34: {
            cost(x) { return Decimal.pow("e1216", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2.5)) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)) * 216314 },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(2000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 2,000<br/>Heart Accelerators"
            },
            display() {
                return "which are boosting Meta-Meta-Meta Upgrade effect by an additional " + format(tmp[this.layer].buyables[this.id].effect) + "%.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        35: {
            cost(x) { return Decimal.pow("e3462", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2.5)) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)) * 413612 },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(2000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 2,000<br/>Hope Accelerators"
            },
            display() {
                return "which are boosting Meta-Meta-Meta Upgrade effect by an additional " + format(tmp[this.layer].buyables[this.id].effect) + "%.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        36: {
            cost(x) { return Decimal.pow("e8950", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2.5)) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)) * 612413 },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(2000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 2,000<br/>Rage Accelerators"
            },
            display() {
                return "which are boosting Meta-Meta-Meta Upgrade effect by an additional " + format(tmp[this.layer].buyables[this.id].effect) + "%.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        37: {
            cost(x) { return Decimal.pow("e10425", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2.5)) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)) * 1111111 },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(2000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 2,000<br/>Light Accelerators"
            },
            display() {
                return "which are boosting Meta-Meta-Meta Upgrade effect by an additional " + format(tmp[this.layer].buyables[this.id].effect) + "%.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        38: {
            cost(x) { return Decimal.pow("e12275", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2.5)) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)) * 2161314 },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(2000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 2,000<br/>Void Accelerators"
            },
            display() {
                return "which are boosting Meta-Meta-Meta Upgrade effect by an additional " + format(tmp[this.layer].buyables[this.id].effect) + "%.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        39: {
            cost(x) { return Decimal.pow("e30250", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2.5)) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)) * 4131612 },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(2000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 2,000<br/>Life Accelerators"
            },
            display() {
                return "which are boosting Meta-Meta-Meta Upgrade effect by an additional " + format(tmp[this.layer].buyables[this.id].effect) + "%.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        40: {
            cost(x) { return Decimal.pow("e35000", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2.5)) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)) * 6121413 },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(2000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 2,000<br/>Doom Accelerators"
            },
            display() {
                return "which are boosting Meta-Meta-Meta Upgrade effect by an additional " + format(tmp[this.layer].buyables[this.id].effect) + "%.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        41: {
            cost(x) { return Decimal.pow("e850000", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2.5)) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)) * 11111111 },
            unlocked() { return hasUpgrade(this.layer, 54) },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(2000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 2,000<br/>Breath Accelerators"
            },
            display() {
                return "which are boosting Meta-Meta-Meta Upgrade effect by an additional " + format(tmp[this.layer].buyables[this.id].effect) + "%.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        42: {
            cost(x) { return Decimal.pow("e2468000", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2.5)) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)) * 21611314 },
            unlocked() { return hasUpgrade(this.layer, 54) },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(2000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 2,000<br/>Blood Accelerators"
            },
            display() {
                return "which are boosting Meta-Meta-Meta Upgrade effect by an additional " + format(tmp[this.layer].buyables[this.id].effect) + "%.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        51: {
            cost(x) { return Decimal.pow("e2650000", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(500).add(1), 5)) },
            effect(x) { return Decimal.pow(160000, (x || getBuyableAmount(this.layer, this.id)).pow(0.9)).mul(buyableEffect("metaMeta", 63)).mul(buyableEffect("metaMeta", 64)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(1000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 1,000<br/>Rogue Booster"
            },
            display() {
                return "which are multipling the Metaness effect's power tower before the Overflow nerf by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1)).min(1000))
            },
        },
        52: {
            cost(x) { return Decimal.pow("e3570000", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(500).add(1), 5)) },
            effect(x) { return Decimal.pow(640000, (x || getBuyableAmount(this.layer, this.id)).pow(0.9)).mul(buyableEffect("metaMeta", 63)).mul(buyableEffect("metaMeta", 64)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(1000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 1,000<br/>Thief Booster"
            },
            display() {
                return "which are multipling the Metaness effect's power tower before the Overflow nerf by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1)).min(1000))
            },
        },
        53: {
            cost(x) { return Decimal.pow("e11000000", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(500).add(1), 5)) },
            effect(x) { return Decimal.pow(2560000, (x || getBuyableAmount(this.layer, this.id)).pow(0.85)).mul(buyableEffect("metaMeta", 63)).mul(buyableEffect("metaMeta", 64)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(1000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 1,000<br/>Heir Booster"
            },
            display() {
                return "which are multipling the Metaness effect's power tower before the Overflow nerf by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1)).min(1000))
            },
        },
        54: {
            cost(x) { return Decimal.pow("e17710000", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(500).add(1), 5)) },
            effect(x) { return Decimal.pow(10240000, (x || getBuyableAmount(this.layer, this.id)).pow(0.85)).mul(buyableEffect("metaMeta", 63)).mul(buyableEffect("metaMeta", 64)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(1000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 1,000<br/>Maid Booster"
            },
            display() {
                return "which are multipling the Metaness effect's power tower before the Overflow nerf by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1)).min(1000))
            },
        },
        55: {
            cost(x) { return Decimal.pow("e27500000", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(500).add(1), 5)) },
            effect(x) { return Decimal.pow(40960000, (x || getBuyableAmount(this.layer, this.id)).pow(0.85)).mul(buyableEffect("metaMeta", 63)).mul(buyableEffect("metaMeta", 64)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(1000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 1,000<br/>Page Booster"
            },
            display() {
                return "which are multipling the Metaness effect's power tower before the Overflow nerf by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1)).min(1000))
            },
        },
        56: {
            cost(x) { return Decimal.pow("e65000000", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(500).add(1), 5)) },
            effect(x) { return Decimal.pow(163840000, (x || getBuyableAmount(this.layer, this.id)).pow(0.8)).mul(buyableEffect("metaMeta", 63)).mul(buyableEffect("metaMeta", 64)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(1000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 1,000<br/>Knight Booster"
            },
            display() {
                return "which are multipling the Metaness effect's power tower before the Overflow nerf by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1)).min(1000))
            },
        },
        57: {
            cost(x) { return Decimal.pow("e75000000", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(500).add(1), 5)) },
            effect(x) { return Decimal.pow(1e12, (x || getBuyableAmount(this.layer, this.id)).pow(0.8)).mul(buyableEffect("metaMeta", 63)).mul(buyableEffect("metaMeta", 64)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(1000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 1,000<br/>Seer Booster"
            },
            display() {
                return "which are multipling the Metaness effect's power tower before the Overflow nerf by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1)).min(1000))
            },
        },
        58: {
            cost(x) { return Decimal.pow("e333000000", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(500).add(1), 5)) },
            effect(x) { return Decimal.pow(1e16, (x || getBuyableAmount(this.layer, this.id)).pow(0.8)).mul(buyableEffect("metaMeta", 63)).mul(buyableEffect("metaMeta", 64)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(1000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 1,000<br/>Mage Booster"
            },
            display() {
                return "which are multipling the Metaness effect's power tower before the Overflow nerf by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1)).min(1000))
            },
        },
        59: {
            cost(x) { return Decimal.pow("e1.35e9", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(500).add(1), 5)) },
            effect(x) { return Decimal.pow(1e20, (x || getBuyableAmount(this.layer, this.id)).pow(0.8)).mul(buyableEffect("metaMeta", 63)).mul(buyableEffect("metaMeta", 64)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(1000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 1,000<br/>Slyph Booster"
            },
            display() {
                return "which are multipling the Metaness effect's power tower before the Overflow nerf by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1)).min(1000))
            },
        },
        60: {
            cost(x) { return Decimal.pow("e1.909e10", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(500).add(1), 5)) },
            effect(x) { return Decimal.pow(1e30, (x || getBuyableAmount(this.layer, this.id)).pow(0.8)).mul(buyableEffect("metaMeta", 63)).mul(buyableEffect("metaMeta", 64)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(1000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 1,000<br/>Slyph Booster"
            },
            display() {
                return "which are multipling the Metaness effect's power tower before the Overflow nerf by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1)).min(1000))
            },
        },
        61: {
            cost(x) { return Decimal.pow("e1.465e11", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(500).add(1), 5)) },
            effect(x) { return Decimal.pow(1e50, (x || getBuyableAmount(this.layer, this.id)).pow(0.8)).mul(buyableEffect("metaMeta", 63)).mul(buyableEffect("metaMeta", 64)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(1000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 1,000<br/>Bard Booster"
            },
            display() {
                return "which are multipling the Metaness effect's power tower before the Overflow nerf by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1)).min(1000))
            },
        },
        62: {
            cost(x) { return Decimal.pow("e5.6245e12", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(500).add(1), 5)) },
            effect(x) { return Decimal.pow(1e80, (x || getBuyableAmount(this.layer, this.id)).pow(0.8)).mul(buyableEffect("metaMeta", 63)).mul(buyableEffect("metaMeta", 64)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(1000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 1,000<br/>Prince Booster"
            },
            display() {
                return "which are multipling the Metaness effect's power tower before the Overflow nerf by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1)).min(1000))
            },
        },
        63: {
            cost(x) { return Decimal.pow("e6.8325e12", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(500).add(1), 5)) },
            effect(x) { return Decimal.pow(Number.MAX_VALUE, (x || getBuyableAmount(this.layer, this.id)).pow(0.9)).mul(buyableEffect("metaMeta", 64)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(1000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 1,000<br/>Muse Booster"
            },
            display() {
                return "which are multipling all above Meta-Classes Boosters' effect and all Aspect Faucets by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1).min(1000))
            },
        },
        64: {
            cost(x) { return Decimal.pow("e7.6635e13", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(500).add(1), 5)) },
            effect(x) { return Decimal.pow(Number.MAX_VALUE, (x || getBuyableAmount(this.layer, this.id)).pow(0.9)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) && player[this.layer].buyables[this.id].lt(1000) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " / 1,000<br/>Lord Booster"
            },
            display() {
                return "which are multipling all above Meta-Classes Boosters' effect, the Muse Booster's effect and all Class Faucets by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1).min(1000))
            },
        },
        71: {
            cost(x) { return Decimal.pow("e80000000", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(200).add(1).pow((x || getBuyableAmount(this.layer, this.id)).max(10).div(10).pow(0.5)), 5)) },
            effect(x) { return Decimal.pow(buyableEffect("metaMeta", 72).add(2), (x || getBuyableAmount(this.layer, this.id)).add(buyableEffect("metaMeta", 74)).pow(0.9985)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Faucet Upgrades"
            },
            display() {
                return "which are multipling all faucet effeciencies by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        72: {
            cost(x) { return Decimal.pow("e400000000", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(400).add(1).pow((x || getBuyableAmount(this.layer, this.id)).max(10).div(10).pow(0.5)), 10)) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).add(buyableEffect("metaMeta", 74)).pow(0.85).div(10).mul(buyableEffect("metaMeta", 73)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Faucet Upgrade^2s"
            },
            display() {
                return "which are adding the Faucet Upgrade effect by +" + format(tmp[this.layer].buyables[this.id].effect, 3) + " per level.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        73: {
            cost(x) { return Decimal.pow("e825000000", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(400).add(1).pow((x || getBuyableAmount(this.layer, this.id)).max(10).div(10).pow(0.5)), 10)) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).add(buyableEffect("metaMeta", 74)).div(5).add(1).pow(0.5) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Faucet Upgrade^3s"
            },
            display() {
                return "which are multipling the Faucet Upgrade^2 effect by ×" + format(tmp[this.layer].buyables[this.id].effect, 3) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        74: {
            cost(x) { return Decimal.pow("e1.9435e9", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(400).add(1).pow((x || getBuyableAmount(this.layer, this.id)).max(10).div(10).pow(0.5)), 30)) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).mul(buyableEffect("metaMeta", 75).add(3)).pow(0.9).ceil() },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Faucet Upgrade^4s"
            },
            display() {
                return "which are increasing the level of all of the above upgrades by +" + format(tmp[this.layer].buyables[this.id].effect, 0) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        75: {
            cost(x) { return Decimal.pow("e6.545e10", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(400).add(1).pow((x || getBuyableAmount(this.layer, this.id)).max(10).div(10).pow(0.5)), 30)) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).mul(0.35).pow(0.9).mul(buyableEffect("metaMeta", 76)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Faucet Upgrade^5s"
            },
            display() {
                return "which are increasing the Faucet Upgrade^4 effect by +" + format(tmp[this.layer].buyables[this.id].effect) + " per level.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        76: {
            cost(x) { return Decimal.pow("e2.095e11", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(400).add(1).pow((x || getBuyableAmount(this.layer, this.id)).max(10).div(10).pow(0.5)), 30)) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).mul(0.1).add(1).pow(0.9) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Faucet Upgrade^6s"
            },
            display() {
                return "which are multipling the Faucet Upgrade^5 effect by ×" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
    },

    bars: {
        pointBar: {
            direction: RIGHT,
            width: 360,
            height: 50,
            progress() {
                return Math.log10(player.points.layer + 1) / Math.log10(Number.MAX_VALUE)
            },
            fillStyle: {
                "background-color": "#ffffff7f",
            },
            display() {
                return "<h5>Points Capacity:<br/>" + format(player.points) + " / F" + format(Number.MAX_VALUE) + "</h5>";
            },
        },
        timeBar: {
            direction: RIGHT,
            width: 360,
            height: 50,
            progress() {
                return Math.log10(player[this.layer].resetTime + 1) / Math.log10(Number.MAX_VALUE)
            },
            fillStyle: {
                "background-color": "#b70d0e",
            },
            display() {
                return "<h5>Infinite Time:<br/>" + formatTime(player[this.layer].resetTime) + " / " + formatTime(Number.MAX_VALUE) + "</h5>";
            },
        },
        metaBar: {
            direction: RIGHT,
            width: 360,
            height: 50,
            progress() {
                return Decimal.log10(player[this.layer].points.add(1)) / Math.log10(2) / 262143 / (hasUpgrade("metaMeta", 44) ? player.metaMeta.meta.div(38).add(1).pow(3.5).pow(player.metaMeta.meta.max(100).div(100).pow(0.1)) : 1)
            },
            fillStyle: {
                "background-color": "#31aeb0",
            },
            display() {
                return "<h5>Meta-Transcension:<br/>" + format(player[this.layer].points) + " / " + format(Decimal.pow(2, 262143).pow(hasUpgrade("metaMeta", 44) ? player.metaMeta.meta.div(38).add(1).pow(3.5).pow(player.metaMeta.meta.max(100).div(100).pow(0.1)) : 1)) + "</h5>";
            },
        },
    },

    clickables: {
        rows: 1,
        cols: 3,
        11: {
            display() {
                return "Meta-Transend for +1 Meta-Metaness"
            },
            canClick() {
                return player[this.layer].points.gte(Decimal.pow(2, 262143).pow(hasUpgrade("metaMeta", 44) ? player.metaMeta.meta.div(38).add(1).pow(3.5).pow(player.metaMeta.meta.max(100).div(100).pow(0.1)) : 1))
            },
            onClick() {
                var a = 0
                while (true) {
                    player[this.layer].meta = player[this.layer].meta.add(1)
                    a++

                    if (!hasUpgrade("metaMeta", 51) || a >= 10 || !this.canClick()) break
                }
                
                if (!hasUpgrade("metaMeta", 84)) {
                    player.points = new Decimal(10)
                    player[this.layer].points = new Decimal(0)
                    if (!hasUpgrade("metaMeta", 61)) resetBuyables(this.layer)
                    doReset(this.layer, true)
                    player[this.layer].aspectFaucets =  Array.from({ length: 12 }, _ => new Decimal(0))
                    player[this.layer].classFaucets = Array.from({ length: 12 }, _ => new Decimal(0))

                    if (hasUpgrade("metaMeta", 13)) for (var a = 11; a <= 13; a++) player[this.layer].buyables[a] = new Decimal(2)
                    if (hasUpgrade("metaMeta", 31)) for (var a = 21; a <= 23; a++) player[this.layer].buyables[a] = new Decimal(3)
                }
            },
            style: {
                "height": "50px",
            }
        },
        12: {
            unlocked() {
                return hasUpgrade("metaMeta", 44)
            },
            display() {
                return "Increment for +1 Overflow"
            },
            canClick() {
                return player.points.layer >= Number.MAX_VALUE
            },
            onClick() {
                player.points = new Decimal(10)
                player[this.layer].points = new Decimal(0)
                resetBuyables(this.layer)
                player[this.layer].aspectFaucets =  Array.from({ length: 12 }, _ => new Decimal(0)),
                player[this.layer].classFaucets = Array.from({ length: 12 }, _ => new Decimal(0)),
                doReset(this.layer, true)
                player[this.layer].overflows = player[this.layer].overflows.add(1)
                player[this.layer].overflowsTotal = player[this.layer].overflowsTotal.add(1)
            },
            style: {
                "height": "50px",
            }
        },
        21: {
            unlocked() {
                return hasUpgrade("metaMeta", 44)
            },
            display() {
                return "Respec Overflow Upgrades"
            },
            canClick() {
                return true
            },
            onClick() {
                [51, 52, 53, 54, 61, 62, 63, 64, 71, 72, 73, 74, 81, 82, 83, 84].forEach(elm => {
                    var i = player[this.layer].upgrades.indexOf(elm)
                    if (i >= 0) player[this.layer].upgrades.splice(i, 1)
                })
                player[this.layer].overflows = player[this.layer].overflowsTotal

                player.points = new Decimal(10)
                player[this.layer].points = new Decimal(0)
                resetBuyables(this.layer)
                player[this.layer].aspectFaucets =  Array.from({ length: 12 }, _ => new Decimal(0)),
                player[this.layer].classFaucets = Array.from({ length: 12 }, _ => new Decimal(0)),
                doReset(this.layer, true)

                if (player.metaMeta.meta.gte(1314)) player.metaMeta.remeta = true;

            },
            style: {
                "height": "50px",
            }
        },
    },

    upgrades: {
        rows: 4,
        cols: 4,
        11: {
            title: "<p style='transform: scale(-1, -1)'><alternate>NUMBER OVERFLOW</alternate>",
            description: "^1.12 Metaness gain.",
            cost: new Decimal(1),
            currencyDisplayName: "Meta-Metaness",
            currencyInternalName: "meta",
            currencyLocation() { return player[this.layer] },
            unlocked() { return player[this.layer].meta.gte(1) || hasUpgrade(this.layer, this.id) },
        },
        12: {
            title: "<p style='transform: scale(-1, -1)'><alternate>AUTOMATIC BUYER</alternate>",
            description: "Automatically clicks all Meta-Aspect Accelerators per tick.",
            cost: new Decimal(1),
            currencyDisplayName: "Meta-Metaness",
            currencyInternalName: "meta",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        13: {
            title: "<p style='transform: scale(-1, -1)'><alternate>A HEADSTART</alternate>",
            description: "Starts with 2 of each upper Meta-Meta Upgrade on Meta-Transcensions.",
            cost: new Decimal(1),
            currencyDisplayName: "Meta-Metaness",
            currencyInternalName: "meta",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        14: {
            title: "<p style='transform: scale(-1, -1)'><alternate>UPPER BUYING POWER</alternate>",
            description: "Buys 2 of each upper Meta-Meta Upgrade on Meta-Transcensions.",
            cost: new Decimal(1),
            currencyDisplayName: "Meta-Metaness",
            currencyInternalName: "meta",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        21: {
            title: "<p style='transform: scale(-1, -1)'><alternate>BULK BUYING</alternate>",
            description: "Buys 10 of each Meta-Aspect Accelerators per click.",
            cost: new Decimal(1),
            currencyDisplayName: "Meta-Metaness",
            currencyInternalName: "meta",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10))  
            },
        },
        22: {
            title: "<p style='transform: scale(-1, -1)'><alternate>A HEADSTART</alternate>",
            description: "Automatically clicks all Meta-Meta Upgrades per tick.",
            cost: new Decimal(1),
            currencyDisplayName: "Meta-Metaness",
            currencyInternalName: "meta",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        23: {
            title: "<p style='transform: scale(-1, -1)'><alternate>SKIP TIME</alternate>",
            description: "Adds 1,000 to the Meta-Ascension time in the effect formula.",
            cost: new Decimal(2),
            currencyDisplayName: "Meta-Metaness",
            currencyInternalName: "meta",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        24: {
            title: "<p style='transform: scale(-1, -1)'><alternate>ACCELERATOR</alternate>",
            description: "Time goes by faster based on Meta-Ascension time.",
            cost: new Decimal(3),
            currencyDisplayName: "Meta-Metaness",
            currencyInternalName: "meta",
            currencyLocation() { return player[this.layer] },
            effect() {
                let ret = new Decimal(player.metaMeta.resetTime).add(1).log(10).add(1).pow(4.13)
                if (hasUpgrade("metaMeta", 53)) ret = ret.pow(1.15)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        31: {
            title: "<p style='transform: scale(-1, -1)'><alternate>A BOTTOMSTART</alternate>",
            description: "Starts with 3 of each lower Meta-Meta Upgrade on Meta-Transcensions.",
            cost: new Decimal(1),
            currencyDisplayName: "Meta-Metaness",
            currencyInternalName: "meta",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        32: {
            title: "<p style='transform: scale(-1, -1)'><alternate>KICKSTARTING</alternate>",
            description: "Adds 1,000,000 to the Metaness amount in the effect formula.",
            cost: new Decimal(2),
            currencyDisplayName: "Meta-Metaness",
            currencyInternalName: "meta",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        33: {
            title: "<p style='transform: scale(-1, -1)'><alternate>FAST FORWARD</alternate>",
            description: "Time goes by faster based on points.",
            cost: new Decimal(3),
            currencyDisplayName: "Meta-Metaness",
            currencyInternalName: "meta",
            currencyLocation() { return player[this.layer] },
            effect() {
                let ret = new Decimal(player.points.layer).add(1).log(10).add(1).pow(4.13)
                if (hasUpgrade("metaMeta", 53)) ret = ret.pow(1.15)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        34: {
            title: "<p style='transform: scale(-1, -1)'><alternate>REPETITION</alternate>",
            description: "Total Meta-Meta Upgrade levels speeds up Time.",
            cost: new Decimal(32),
            currencyDisplayName: "Meta-Metaness",
            currencyInternalName: "meta",
            currencyLocation() { return player[this.layer] },
            effect() {
                let levs = 0
                for (var a = 11; a <= 13; a++) levs += player[this.layer].buyables[a].toNumber()
                for (var a = 21; a <= 23; a++) levs += player[this.layer].buyables[a].toNumber()
                let ret = (levs + 1) ** 1.413
                if (hasUpgrade("metaMeta", 64)) ret = ret ** 1.25
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        41: {
            title: "<p style='transform: scale(-1, -1)'><alternate>BOTTOM BUYING POWER</alternate>",
            description: "Buys 3 of each lower Meta-Meta Upgrade on Meta-Transcensions.",
            cost: new Decimal(1),
            currencyDisplayName: "Meta-Metaness",
            currencyInternalName: "meta",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        42: {
            title: "<p style='transform: scale(-1, -1)'><alternate>TIME TRAVEL</alternate>",
            description: "Time goes by faster based on Metaness.",
            cost: new Decimal(3),
            currencyDisplayName: "Meta-Metaness",
            currencyInternalName: "meta",
            currencyLocation() { return player[this.layer] },
            effect() {
                let ret = player[this.layer].points.add(1).log(10).add(1).pow(2.16)
                if (hasUpgrade("metaMeta", 53)) ret = ret.pow(1.15)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        43: {
            title: "<p style='transform: scale(-1, -1)'><alternate>REPETITION</alternate>",
            description: "Total Meta-Aspect Generator levels speeds up Time.",
            cost: new Decimal(40),
            currencyDisplayName: "Meta-Metaness",
            currencyInternalName: "meta",
            currencyLocation() { return player[this.layer] },
            effect() {
                let levs = 0
                for (var a = 31; a <= 40; a++) levs += player[this.layer].buyables[a].toNumber()
                let ret = (levs + 1) ** 1.111
                if (hasUpgrade("metaMeta", 64)) ret = ret ** 1.25
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        44: {
            title: "<p style='transform: scale(-1, -1)'><alternate>FINAL FRONTIER</alternate>",
            description: "Meta-Metaness increases the Meta-Transcension requirements and Meta-Meta upgrade effect by +0.01 per level. Also resets your Meta-Metaness amount.",
            cost: new Decimal(50),
            currencyDisplayName: "Meta-Metaness",
            currencyInternalName: "meta",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
            onPurchase() {
                player.metaMeta.meta = new Decimal(0)
            },
            style: {
                "height": "160px",
                "margin-bottom": "-40px"
            }
        },
        51: {
            title: "<p style='transform: scale(-1, -1)'><alternate>OMETA ASCENSION</alternate>",
            description: "Unlock the ability to bulk Meta-Ascending, up to 10 Meta-Ascensions at the same time.",
            cost: new Decimal(5),
            currencyDisplayName: "Overflows",
            currencyInternalName: "overflows",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((+this.id + 1) % 10 == 5 || hasUpgrade(this.layer, +this.id + 1)) 
                    && (this.id - 10 < 51 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        52: {
            title: "<p style='transform: scale(-1, -1)'><alternate>SQUARED BULK</alternate>",
            description: "×10 Meta-Aspect Accelerator and Meta-Class Booster buying power.",
            cost: new Decimal(2),
            currencyDisplayName: "Overflows",
            currencyInternalName: "overflows",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((+this.id + 1) % 10 == 5 || hasUpgrade(this.layer, +this.id + 1)) 
                    && (this.id - 10 < 51 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        53: {
            title: "<p style='transform: scale(-1, -1)'><alternate>ACCELERATOR SQUARED</alternate>",
            description: "^1.15 all “Time goes by faster” upgrades effects.",
            cost: new Decimal(1),
            currencyDisplayName: "Overflows",
            currencyInternalName: "overflows",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((+this.id + 1) % 10 == 5 || hasUpgrade(this.layer, +this.id + 1)) 
                    && (this.id - 10 < 51 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        54: {
            title: "<p style='transform: scale(-1, -1)'><alternate>LIMIT REACHED</alternate>",
            description: "Unlocks the missing two Meta-Aspects.",
            cost: new Decimal(1),
            currencyDisplayName: "Overflows",
            currencyInternalName: "overflows",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((+this.id + 1) % 10 == 5 || hasUpgrade(this.layer, +this.id + 1)) 
                    && (this.id - 10 < 51 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        61: {
            title: "<p style='transform: scale(-1, -1)'><alternate>LOSSLESSER</alternate>",
            description: "Keeps all buyables on Meta-Transcensions.",
            cost: new Decimal(1),
            currencyDisplayName: "Overflows",
            currencyInternalName: "overflows",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((+this.id + 1) % 10 == 5 || hasUpgrade(this.layer, +this.id + 1)) 
                    && (this.id - 10 < 51 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        62: {
            title: "<p style='transform: scale(-1, -1)'><alternate>ASPECT FAUCETS</alternate>",
            description: "Unlocks Aspect Faucets, in which faucets get boosted by Meta-Aspect Accelerators.",
            cost: new Decimal(1),
            currencyDisplayName: "Overflows",
            currencyInternalName: "overflows",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((+this.id + 1) % 10 == 5 || hasUpgrade(this.layer, +this.id + 1)) 
                    && (this.id - 10 < 51 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        63: {
            title: "<p style='transform: scale(-1, -1)'><alternate>HIGH CLASS</alternate>",
            description: "Automatically clicks all Meta-Class Boosters per tick.",
            cost: new Decimal(1),
            currencyDisplayName: "Overflows",
            currencyInternalName: "overflows",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((+this.id + 1) % 10 == 5 || hasUpgrade(this.layer, +this.id + 1)) 
                    && (this.id - 10 < 51 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        64: {
            title: "<p style='transform: scale(-1, -1)'><alternate>REPETITION SQUARED</alternate>",
            description: "^1.25 all “speeds up Time” upgrades effects.",
            cost: new Decimal(1),
            currencyDisplayName: "Overflows",
            currencyInternalName: "overflows",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((+this.id + 1) % 10 == 5 || hasUpgrade(this.layer, +this.id + 1)) 
                    && (this.id - 10 < 51 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        71: {
            title: "<p style='transform: scale(-1, -1)'><alternate>ASASS</alternate>",
            description: "Time Faucet boosts all Class Faucets.",
            cost: new Decimal(1),
            currencyDisplayName: "Overflows",
            currencyInternalName: "overflows",
            currencyLocation() { return player[this.layer] },
            effect() {
                let ret = player.metaMeta.aspectFaucets[0].add(1).root(6.12)
                ret = applyPolynomialSoftcap(ret, 1e200, 2.5)
                ret = applyLogapolynomialSoftcap(ret, "e2500", 2)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { 
                return ((+this.id + 1) % 10 == 5 || hasUpgrade(this.layer, +this.id + 1)) 
                    && (this.id - 10 < 51 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        72: {
            title: "<p style='transform: scale(-1, -1)'><alternate>IDLE PRODUCTION</alternate>",
            description: "Automatically clicks on the Faucet Upgrade once per tick.",
            cost: new Decimal(2),
            currencyDisplayName: "Overflows",
            currencyInternalName: "overflows",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((+this.id + 1) % 10 == 5 || hasUpgrade(this.layer, +this.id + 1)) 
                    && (this.id - 10 < 51 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        73: {
            title: "<p style='transform: scale(-1, -1)'><alternate>CLASS FAUCETS</alternate>",
            description: "Unlocks Class Faucets, in which faucets get boosted by Meta-Class Boosters.",
            cost: new Decimal(1),
            currencyDisplayName: "Overflows",
            currencyInternalName: "overflows",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((+this.id + 1) % 10 == 5 || hasUpgrade(this.layer, +this.id + 1)) 
                    && (this.id - 10 < 51 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        74: {
            title: "<p style='transform: scale(-1, -1)'><alternate>TRANSCENDANCY</alternate>",
            description: "Automatically do Meta-Transcensions per tick.",
            cost: new Decimal(2),
            currencyDisplayName: "Overflows",
            currencyInternalName: "overflows",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((+this.id + 1) % 10 == 5 || hasUpgrade(this.layer, +this.id + 1)) 
                    && (this.id - 10 < 51 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        81: {
            title: "<p style='transform: scale(-1, -1)'><alternate>HAHA TIME GO BRRR</alternate>",
            description: "Your unspent Overflows, the upgrade above this, and the upgrade two times to the right speeds up Time.",
            cost: new Decimal(10),
            currencyDisplayName: "Overflows",
            currencyInternalName: "overflows",
            currencyLocation() { return player[this.layer] },
            effect() {
                let ret = upgradeEffect("metaMeta", 71).mul(upgradeEffect("metaMeta", 83)).pow(player.metaMeta.overflows.add(1))
                ret = applyLogapolynomialSoftcap(ret, 1e10, 2.9)
                return ret
            },
            effectDisplay() { return "^" + format(this.effect()) },
            unlocked() { 
                return ((+this.id + 1) % 10 == 5 || hasUpgrade(this.layer, +this.id + 1)) 
                    && (this.id - 10 < 51 || hasUpgrade(this.layer, this.id - 10)) 
            },
            style: {
                "height": "160px",
                "margin-bottom": "-40px"
            }
        },
        82: {
            title: "<p style='transform: scale(-1, -1)'><alternate>CLASSPECTS SQUARED</alternate>",
            description: "Total Overflows boosts the previous upgrade.",
            cost: new Decimal(1),
            currencyDisplayName: "Overflows",
            currencyInternalName: "overflows",
            currencyLocation() { return player[this.layer] },
            effect() {
                let ret = player.metaMeta.overflowsTotal.div(25).add(1)
                return ret
            },
            effectDisplay() { return "^" + format(this.effect()) },
            unlocked() { 
                return ((+this.id + 1) % 10 == 5 || hasUpgrade(this.layer, +this.id + 1)) 
                    && (this.id - 10 < 51 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        83: {
            title: "<p style='transform: scale(-1, -1)'><alternate>CLASSPECTS</alternate>",
            description: "Rouge Power boosts all Aspect Faucets.",
            cost: new Decimal(1),
            currencyDisplayName: "Overflows",
            currencyInternalName: "overflows",
            currencyLocation() { return player[this.layer] },
            effect() {
                let ret = player.metaMeta.classFaucets[0].add(1).root(6.12)
                ret = applyPolynomialSoftcap(ret, 1e200, 2.5)
                if (hasUpgrade("metaMeta", 82)) ret = ret.pow(upgradeEffect("metaMeta", 82))
                ret = applyLogapolynomialSoftcap(ret, "e1000", 2)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { 
                return ((+this.id + 1) % 10 == 5 || hasUpgrade(this.layer, +this.id + 1)) 
                    && (this.id - 10 < 51 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        84: {
            title: "<p style='transform: scale(-1, -1)'><alternate>OVERPOWERED</alternate>",
            description: "Meta-Transcending no longer resets anything.",
            cost: new Decimal(4),
            currencyDisplayName: "Overflows",
            currencyInternalName: "overflows",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((+this.id + 1) % 10 == 5 || hasUpgrade(this.layer, +this.id + 1)) 
                    && (this.id - 10 < 51 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
    },

    update(delta) {
        var timeMul = 1
        if (hasUpgrade("metaMeta", 24)) timeMul *= upgradeEffect("metaMeta", 24)
        if (hasUpgrade("metaMeta", 33)) timeMul *= upgradeEffect("metaMeta", 33)
        if (hasUpgrade("metaMeta", 42)) timeMul *= upgradeEffect("metaMeta", 42)
        if (hasUpgrade("metaMeta", 43)) timeMul *= upgradeEffect("metaMeta", 43)
        if (hasUpgrade("metaMeta", 34)) timeMul *= upgradeEffect("metaMeta", 34)
        if (hasUpgrade("metaMeta", 81)) timeMul *= upgradeEffect("metaMeta", 81)

        player[this.layer].resetTime += ((buyableEffect(this.layer, 23) / 100 + 1) * timeMul - 1) * delta

        if (player[this.layer].resetTime >= Number.MAX_VALUE) player[this.layer].resetTime = Number.MAX_VALUE
        else {
            player[this.layer].points = player[this.layer].points.add(tmp[this.layer].resetGain.mul(buyableEffect(this.layer, 21)).mul(delta).div(100))
            if (!hasUpgrade("metaMeta", 44)) player[this.layer].points = player[this.layer].points.min(Decimal.pow(2, 262143))
        }

        if (hasUpgrade("metaMeta", 12)) for (var a = 31; a <= 42; a++) {
            buyBuyable("metaMeta", a)
        }
        if (hasUpgrade("metaMeta", 22)) {
            for (var a = 11; a <= 13; a++) buyBuyable("metaMeta", a)
            for (var a = 21; a <= 23; a++) buyBuyable("metaMeta", a)
        }
        if (hasUpgrade("metaMeta", 63)) for (var a = 51; a <= 64; a++) {
            buyBuyable("metaMeta", a)
        }
        if (hasUpgrade("metaMeta", 72)) for (var a = 71; a <= 76; a++) {
            buyBuyable("metaMeta", a)
        }
        if (hasUpgrade("metaMeta", 74)) clickClickable("metaMeta", 11)

        if (hasUpgrade("metaMeta", 62)) {
            var mul = tmp.metaMeta.buyables[71].effect.mul(tmp.metaMeta.buyables[63].effect)
            if (hasUpgrade("metaMeta", 83)) mul = mul.mul(upgradeEffect("metaMeta", 83))
            for (var a = 0; a < 12; a++) player.metaMeta.aspectFaucets[a] = 
                player.metaMeta.aspectFaucets[a].add(new Decimal(player.metaMeta.aspectFaucets[a+1]).add(1).mul(player.metaMeta.buyables[a+31]).mul(mul).mul(delta))
        }
        if (hasUpgrade("metaMeta", 73)) {
            var mul = tmp.metaMeta.buyables[71].effect.mul(tmp.metaMeta.buyables[64].effect)
            if (hasUpgrade("metaMeta", 71)) mul = mul.mul(upgradeEffect("metaMeta", 71))
            for (var a = 0; a < 12; a++) player.metaMeta.classFaucets[a] = 
                player.metaMeta.classFaucets[a].add(new Decimal(player.metaMeta.classFaucets[a+1]).add(1).mul(player.metaMeta.buyables[a+51]).mul(mul).mul(delta))
        }
    },

    microtabs: {
        stuff: {
            "Meta-Meta": {
                content: [
                    ["blank", "15px"],
                    ["row", [["buyable", "11"], ["buyable", "12"], ["buyable", "13"]]],
                    ["row", [["buyable", "21"], ["buyable", "22"], ["buyable", "23"]]],
                ]
            },
            "Meta-Aspects": {
                unlocked() { 
                    return player.metaMeta.best.gte(4e130)
                },
                content: [
                    ["blank", "15px"],
                    ["row", [["buyable", "31"], ["buyable", "32"], ["buyable", "33"]]],
                    ["row", [["buyable", "34"], ["buyable", "35"], ["buyable", "36"]]],
                    ["row", [["buyable", "37"], ["buyable", "38"], ["buyable", "39"]]],
                    ["row", [["buyable", "40"], ["buyable", "41"], ["buyable", "42"]]],
                ]
            },
            "Meta-Classes": {
                unlocked() { 
                    return player.metaMeta.best.gte("e2000000")
                },
                content: [
                    ["blank", "15px"],
                    ["row", [["buyable", "51"], ["buyable", "52"], ["buyable", "53"]]],
                    ["row", [["buyable", "54"], ["buyable", "55"], ["buyable", "56"]]],
                    ["row", [["buyable", "57"], ["buyable", "58"], ["buyable", "59"]]],
                    ["row", [["buyable", "60"], ["buyable", "61"], ["buyable", "62"]]],
                    ["row", [["buyable", "63"], ["buyable", "64"]]],
                ]
            },
            "Faucets": {
                unlocked() { 
                    return hasUpgrade("metaMeta", 62) || hasUpgrade("metaMeta", 73)
                },
                content: () => {
                    var arr = [["blank", "15px"]]
                        if (player.subtabs.metaMeta.stuff == "Faucets") {
                        if (hasUpgrade("metaMeta", 62)) {
                            arr.push(["display-text", "Your Time Faucets are multipling the Metaness effect's power tower by " + format(tmp.metaMeta.effect.aspectFaucetPower) + "."])
                            var asps = ["Time", "Space", "Mind", "Heart", "Hope", "Rage", "Light", "Void", "Life", "Doom", "Breath", "Blood"]
                            for (var a = 0; a < 12; a++) {
                                arr.push(["display-text", asps[a] + " Faucet: " + format(player.metaMeta.aspectFaucets[a])])
                            }
                        }
                        arr.push(["blank", "15px"])
                        if (hasUpgrade("metaMeta", 73)) {
                            arr.push(["display-text", "Your Rogue Faucets are multipling the Metaness effect's power tower by " + format(tmp.metaMeta.effect.classFaucetPower) + "."])
                            var clss = ["Rogue", "Thief", "Heir", "Maid", "Page", "Knight", "Seer", "Mage", "Slyph", "Witch", "Bard", "Prince"]
                            for (var a = 0; a < 12; a++) {
                                arr.push(["display-text", clss[a] + " Faucet: " + format(player.metaMeta.classFaucets[a])])
                            }
                        }
                        arr.push(["blank", "15px"], 
                            ["row", [["buyable", "71"], ["buyable", "72"], ["buyable", "73"]]],
                            ["row", [["buyable", "74"], ["buyable", "75"], ["buyable", "76"]]]
                        )
                    }
                    return arr
                }
            },
            "Limitation": {
                unlocked() { 
                    return player.metaMeta.best.gte("e10000")
                },
                content: [
                    ["blank", "15px"],
                    ["bar", "metaBar"],
                    ["blank", "15px"],
                    ["bar", "pointBar"],
                    ["blank", "15px"],
                    ["bar", "timeBar"],
                    ["blank", "15px"],
                    ["row", [["clickable", "11"], 
                        ["display-text", () => "<div style='width:360px'>You have <h2 style='color:#31aeb0;text-shadow:#31aeb0 0px 0px 10px;'>" + formatWhole(player.metaMeta.meta) + "</h2> Meta-Metaness.</div>"]
                    ]],
                    ["row", [["upgrade", 11], ["upgrade", 12], ["upgrade", 13], ["upgrade", 14]]],
                    ["row", [["upgrade", 21], ["upgrade", 22], ["upgrade", 23], ["upgrade", 24]]],
                    ["row", [["upgrade", 31], ["upgrade", 32], ["upgrade", 33], ["upgrade", 34]]],
                    ["row", [["upgrade", 41], ["upgrade", 42], ["upgrade", 43], ["upgrade", 44]]],
                    ["display-text", () => "<h5 style='width:340px;height:40px;margin-right:130px;margin-bottom:-6px;padding:3px;font-size:10px'>" + (hasUpgrade("metaMeta", 44) ? 
                        "You have " + formatWhole(player.metaMeta.overflowsTotal) + " total Overflows, which are applying a " + format(tmp[this.layer].effect.overflowNerf, 3) + "th root to the Metaness effect's power tower, but are raising Metaness gain by the same amount." 
                        : "") + "</h5>"],
                    ["row", [
                        ["clickable", "21"],
                        ["display-text", () => hasUpgrade("metaMeta", 44) ? "<div style='width:240px'>You have <h2 style='color:#ffffff;text-shadow:#ffffff 0px 0px 10px;'>" + formatWhole(player.metaMeta.overflows) + "</h2> Overflows.</div>" : ""],
                        ["clickable", "12"]]],
                    ["row", [["upgrade", 51], ["upgrade", 52], ["upgrade", 53], ["upgrade", 54]]],
                    ["row", [["upgrade", 61], ["upgrade", 62], ["upgrade", 63], ["upgrade", 64]]],
                    ["row", [["upgrade", 71], ["upgrade", 72], ["upgrade", 73], ["upgrade", 74]]],
                    ["row", [["upgrade", 81], ["upgrade", 82], ["upgrade", 83], ["upgrade", 84]]],
                ]
            }
        },
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        ["blank", "25px"],
        ["display-text", () => "You've spent " + formatTime(player.metaMeta.resetTime) + " this Meta-Ascension."],
        ["blank", "25px"],
        ["microtabs", "stuff"],
        ["blank", "35px"],
    ],

    hotkeys: [
        { key: "m", description: "M: Ascend for Metaness", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
})