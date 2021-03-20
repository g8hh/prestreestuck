if (act == 0) addLayer("metaMeta", {
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
        if (!hasUpgrade("skaia", 14)) return new Decimal(0)
        var pow = buyableEffect(this.layer, 13).mul(hasUpgrade("metaMeta", 11) ? 1.12 : 1).mul(tmp.metaMeta.effect.overflowNerf).mul(tmp.metaMeta.effect.eternityNerf).mul(tmp.metaMeta.effect.powBoost)
        if (hasMilestone("metaMeta", 30)) pow = pow.mul(Decimal.pow(3, player.metaMeta.eternities.max(0)))
        if (hasMilestone("metaMeta", 31)) pow = pow.mul(Decimal.pow(1.5, player.metaMeta.overflows.max(0)))
        return applyLogapolynomialSoftcap(player.points.div(2).add(1).slog(10).pow(0.4).pow(pow).floor(), "e2100000", 2)
    },
    getNextAt() {
        if (!hasUpgrade("skaia", 14)) return Decimal.dInf
        var pow = buyableEffect(this.layer, 13).mul(hasUpgrade("metaMeta", 11) ? 1.12 : 1).mul(tmp.metaMeta.effect.overflowNerf).mul(tmp.metaMeta.effect.eternityNerf).mul(tmp.metaMeta.effect.powBoost)
        if (hasMilestone("metaMeta", 30)) pow = pow.mul(Decimal.pow(3, player.metaMeta.eternities.max(0)))
        if (hasMilestone("metaMeta", 31)) pow = pow.mul(Decimal.pow(1.5, player.metaMeta.overflows.max(0)))
        return Decimal.tetrate(10, applyLogapolynomialSoftcap(new Decimal(tmp[this.layer].resetGain), "e2100000", 0.5).add(1).root(0.4).root(pow)).sub(1).mul(2)
    },

    effect() {
        var mtn = player[this.layer].points.pow(buyableEffect(this.layer, 12)).mul(buyableEffect(this.layer, 22).div(100).add(1)).add(hasUpgrade("metaMeta", 32) ? 1e6 : 0)
        var mtt = new Decimal(player[this.layer].resetTime).pow(buyableEffect(this.layer, 11)).add(hasUpgrade("metaMeta", 23) ? 1e3 : 0)
        var asf = player[this.layer].aspectFaucets[0].add(1).pow(11.11)
        var clf = player[this.layer].classFaucets[0].add(1).pow(41.3)
        var nrf = player[this.layer].overflowsTotal.div(5).add(1).pow(player[this.layer].overflowsTotal.pow(0.5)).mul(player.metaMeta.sacrificeMulti)
        var tmd = player[this.layer].eternitiesTotal.div(2).add(1).pow(player[this.layer].eternitiesTotal.pow(0.5)).mul(player.metaMeta.sacrificeMulti)
        var bns = new Decimal(1)
        for (var a = 51; a <= 62; a++) bns = bns.mul(tmp[this.layer].buyables[a].effect)
        var ptb = new Decimal(player.metaMeta.metaFaucets[7]).add(1).log(10).add(1).pow(0.25)
        var tet = mtn.pow(mtt).add(1).log(10).mul(bns).mul(asf).mul(clf).root(nrf.div(player.metaMeta.sacrificeMulti)).pow(tmd).pow(ptb)
        if (hasUpgrade("metaMeta", 19)) tet = tet.pow(player.metaMeta.overflows.add(1))
        if (tet.gt(Number.MAX_VALUE)) tet = Number.MAX_VALUE
        var eff = {
            aspectFaucetPower: asf,
            classFaucetPower: clf,
            overflowNerf: nrf,
            eternityNerf: tmd,
            pointBoost: mtn.add(1).tetrate(tet),

            timeBoost: new Decimal(player.metaMeta.metaFaucets[0]).add(1).pow(16.12),
            faucetBoost: new Decimal(player.metaMeta.metaFaucets[1]).add(1).pow(612),
            powBoost: new Decimal(player.metaMeta.metaFaucets[3]).add(1).log(10).add(1).pow(0.45),
            powTowerBoost: ptb,
            mmUpgradeBoost: new Decimal(player.metaMeta.metaFaucets[23]).add(1).log(10).mul(2).add(1).pow(0.55),
            mmSpaceTimeBoost: new Decimal(player.metaMeta.metaFaucets[71]).add(1).log(10).mul(3).add(1).pow(0.75),
            mFaucetUpgradeBoost: new Decimal(player.metaMeta.metaFaucets[215]).add(1).log(10).pow(0.35).floor().toNumber(),
            mFaucetUpgrade2Boost: new Decimal(player.metaMeta.metaFaucets[431]).add(1).log(10).pow(0.25).floor().toNumber(),

        }
        
        eff.mmFaucetBoost = applyLogapolynomialSoftcap(new Decimal(player.metaMeta.metaMetaFaucets[999]).add(1), 10, 2).pow(0.5).pow(hasUpgrade("metaMeta", 123) ? upgradeEffect("metaMeta", 123) : 1)
            .pow(hasMilestone("metaMeta", 25) ? tmp.metaMeta.milestones[25].effect : 1).pow(hasMilestone("metaMeta", 26) ? tmp.metaMeta.milestones[26].effect : 1)
        eff.mFaucetAllBoost = applyLogapolynomialSoftcap(new Decimal(player.metaMeta.metaMetaFaucets[179]).add(1), 10000, 2).pow(100).pow(hasUpgrade("metaMeta", 123) ? upgradeEffect("metaMeta", 123) : 1)
        eff.mFaucet4Boost = applyLogapolynomialSoftcap(new Decimal(player.metaMeta.metaMetaFaucets[123]).add(1), 1000, 1.4).pow(100).mul(eff.mFaucetAllBoost).pow(hasUpgrade("metaMeta", 123) ? upgradeEffect("metaMeta", 123) : 1)
        eff.mFaucet3Boost = applyLogapolynomialSoftcap(new Decimal(player.metaMeta.metaMetaFaucets[21]).add(1), 100, 2).pow(100).mul(eff.mFaucetAllBoost).mul(eff.mFaucet4Boost).pow(hasUpgrade("metaMeta", 123) ? upgradeEffect("metaMeta", 123) : 1)
        eff.mFaucet2Boost = applyLogapolynomialSoftcap(new Decimal(player.metaMeta.metaMetaFaucets[7]).add(1), 1000, 2).pow(10).mul(eff.mFaucetAllBoost).mul(eff.mFaucet3Boost).pow(hasUpgrade("metaMeta", 123) ? upgradeEffect("metaMeta", 123) : 1)
        eff.mFaucet1Boost = applyLogapolynomialSoftcap(new Decimal(player.metaMeta.metaMetaFaucets[0]).add(1), 1000, 2).pow(100).mul(eff.mFaucetAllBoost).mul(eff.mFaucet2Boost).pow(hasUpgrade("metaMeta", 123) ? upgradeEffect("metaMeta", 123) : 1)
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
            eternities: new Decimal(0),
            eternitiesTotal: new Decimal(0),
            aspectFaucets: Array.from({ length: 12 }, _ => new Decimal(0)),
            classFaucets: Array.from({ length: 12 }, _ => new Decimal(0)),
            sacrificeMulti: new Decimal(1),
            metaFaucets: [],
            metaMetaFaucets: [],
        }
    },

    buyables: {
        rows: 2,
        cols: 3,
        11: {
            cost(x) { return Decimal.pow(20, Decimal.pow(2, x || getBuyableAmount(this.layer, this.id))).root(tmp.metaMeta.effect.mmSpaceTimeBoost) },
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(hasUpgrade("metaMeta", 14) ? 2 : 1))
            },
        },
        12: {
            cost(x) { return Decimal.pow(40, Decimal.pow(2, x || getBuyableAmount(this.layer, this.id))).root(tmp.metaMeta.effect.mmSpaceTimeBoost) },
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(hasUpgrade("metaMeta", 14) ? 2 : 1))
            },
        },
        13: {
            cost(x) { 
                if ((x || getBuyableAmount(this.layer, this.id)).gte(10) && !hasUpgrade("metaMeta", 91)) return Decimal.dInf
                return Decimal.pow(80, Decimal.pow(3, x || getBuyableAmount(this.layer, this.id))).root(tmp.metaMeta.effect.mmUpgradeBoost) 
            },
            effect(x) { return Decimal.pow(2 + (hasUpgrade("metaMeta", 44) ? player.metaMeta.meta * 0.01 : 0), applyPolynomialSoftcap(x || getBuyableAmount(this.layer, this.id), 10, 100)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Meta-Meta Upgrades"
            },
            display() {
                return "which are boosting Metaness amount on Meta-ascend by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Metaness"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(hasUpgrade("metaMeta", 41) ? 3 : 1).add(hasUpgrade("metaMeta", 114) ? getBuyableAmount(this.layer, this.id).div(100).ceil() : 0))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(hasUpgrade("metaMeta", 41) ? 3 : 1).add(hasUpgrade("metaMeta", 114) ? getBuyableAmount(this.layer, this.id).div(100).ceil() : 0))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(hasUpgrade("metaMeta", 41) ? 3 : 1).add(hasUpgrade("metaMeta", 114) ? getBuyableAmount(this.layer, this.id).div(100).ceil() : 0))
            },
        },
        31: {
            cost(x) { return Decimal.pow(4e132, Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2)) },
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        32: {
            cost(x) { return Decimal.pow(1e150, Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2)) },
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        33: {
            cost(x) { return Decimal.pow("e412", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2)) },
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        34: {
            cost(x) { return Decimal.pow("e1216", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2)) },
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        35: {
            cost(x) { return Decimal.pow("e3462", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2)) },
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        36: {
            cost(x) { return Decimal.pow("e8950", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2)) },
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        38: {
            cost(x) { return Decimal.pow("e12275", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2)) },
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        39: {
            cost(x) { return Decimal.pow("e30250", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2)) },
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        40: {
            cost(x) { return Decimal.pow("e34200", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2)) },
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        41: {
            cost(x) { return Decimal.pow("e850000", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2)) },
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 21) ? 10 : 1) * (hasUpgrade("metaMeta", 52) ? 10 : 1)).min(2000))
            },
        },
        42: {
            cost(x) { return Decimal.pow("e2468000", Decimal.pow((x || getBuyableAmount(this.layer, this.id)).div(250).add(1), 2)) },
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1) * (hasUpgrade("metaMeta", 93) ? 10 : 1)).min(1000))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1) * (hasUpgrade("metaMeta", 93) ? 10 : 1)).min(1000))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1) * (hasUpgrade("metaMeta", 93) ? 10 : 1)).min(1000))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1) * (hasUpgrade("metaMeta", 93) ? 10 : 1)).min(1000))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1) * (hasUpgrade("metaMeta", 93) ? 10 : 1)).min(1000))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1) * (hasUpgrade("metaMeta", 93) ? 10 : 1)).min(1000))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1) * (hasUpgrade("metaMeta", 93) ? 10 : 1)).min(1000))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1) * (hasUpgrade("metaMeta", 93) ? 10 : 1)).min(1000))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1) * (hasUpgrade("metaMeta", 93) ? 10 : 1)).min(1000))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1) * (hasUpgrade("metaMeta", 93) ? 10 : 1)).min(1000))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1) * (hasUpgrade("metaMeta", 93) ? 10 : 1)).min(1000))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 52) ? 10 : 1) * (hasUpgrade("metaMeta", 93) ? 10 : 1)).min(1000))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 93) ? 10 : 1)).min(1000))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add((hasUpgrade("metaMeta", 93) ? 10 : 1)).min(1000))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1).add(hasUpgrade("metaMeta", 114) ? getBuyableAmount(this.layer, this.id).div(100).ceil() : 0))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1).add(hasUpgrade("metaMeta", 114) ? getBuyableAmount(this.layer, this.id).div(100).ceil() : 0))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1).add(hasUpgrade("metaMeta", 114) ? getBuyableAmount(this.layer, this.id).div(100).ceil() : 0))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1).add(hasUpgrade("metaMeta", 114) ? getBuyableAmount(this.layer, this.id).div(100).ceil() : 0))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1).add(hasUpgrade("metaMeta", 114) ? getBuyableAmount(this.layer, this.id).div(100).ceil() : 0))
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
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1).add(hasUpgrade("metaMeta", 114) ? getBuyableAmount(this.layer, this.id).div(100).ceil() : 0))
            },
        },
        81: {
            cost(x) { return Decimal.pow("e4000000", Decimal.pow(48, (x || getBuyableAmount(this.layer, this.id)).div(12).floor())) },
            effect(x) { return 0 },
            canAfford() { return getBuyableAmount(this.layer, this.id).lt(120) && player[this.layer].aspectFaucets[getBuyableAmount(this.layer, this.id) % 12].gte(this.cost()) },
            display() {
                return "Buy one with<br/>" + format(tmp[this.layer].buyables[this.id].cost) + "<br/>" +
                ["Time", "Space", "Mind", "Heart", "Hope", "Rage", "Light", "Void", "Life", "Doom", "Breath", "Blood"][getBuyableAmount(this.layer, this.id) % 12] +
                " Faucet"
            },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player[this.layer].metaFaucets.push(new Decimal(0))
            },
            style: {
                "width": "120px",
                "height": "60px",
            }
        },
        82: {
            cost(x) { return Decimal.pow("e3000000", Decimal.pow(48, (x || getBuyableAmount(this.layer, this.id)).div(12).floor())) },
            effect(x) { return 0 },
            canAfford() { return getBuyableAmount(this.layer, this.id).lt(120) && player[this.layer].classFaucets[getBuyableAmount(this.layer, this.id) % 12].gte(this.cost()) },
            display() {
                return "Buy one with<br/>" + format(tmp[this.layer].buyables[this.id].cost) + "<br/>" +
                ["Rogue", "Thief", "Heir", "Maid", "Page", "Knight", "Seer", "Mage", "Slyph", "Witch", "Bard", "Prince"][getBuyableAmount(this.layer, this.id) % 12] +
                " Faucet"
            },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player[this.layer].metaFaucets.push(new Decimal(0))
            },
            style: {
                "width": "120px",
                "height": "60px",
            }
        },
        83: {
            cost(x) { return Decimal.pow(1.2, (x || getBuyableAmount(this.layer, this.id))).mul(10000) },
            effect(x) { return 0 },
            canAfford() { return getBuyableAmount(this.layer, this.id).lt(80) && player[this.layer].meta.gte(this.cost()) },
            display() {
                return "Buy one with<br/>" + format(tmp[this.layer].buyables[this.id].cost) + "<br/>" +
                " Meta-Metaness"
            },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player[this.layer].metaFaucets.push(new Decimal(0))
            },
            style: {
                "width": "120px",
                "height": "60px",
            }
        },
        84: {
            cost(x) { return Decimal.pow((x || getBuyableAmount(this.layer, this.id)), 2).add(52) },
            effect(x) { return 0 },
            canAfford() { return getBuyableAmount(this.layer, this.id).lt(80) && player[this.layer].overflows.gte(this.cost()) },
            display() {
                return "Buy one with<br/>" + format(tmp[this.layer].buyables[this.id].cost) + "<br/>" +
                " Overflows"
            },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player[this.layer].metaFaucets.push(new Decimal(0))
            },
            style: {
                "width": "120px",
                "height": "60px",
            }
        },
        91: {
            cost(x) { return Decimal.pow((x || getBuyableAmount(this.layer, this.id)).add(16), (x || getBuyableAmount(this.layer, this.id)).pow((x || getBuyableAmount(this.layer, this.id)).div(100).max(1))).mul(1e16) },
            effect(x) { 
                var eff = (x || getBuyableAmount(this.layer, this.id)).add(tmp.metaMeta.effect.mFaucetUpgradeBoost).add(buyableEffect("metaMeta", 94)).mul(Decimal.pow(1.01 + buyableEffect("metaMeta", 92), (x || getBuyableAmount(this.layer, this.id)).add(tmp.metaMeta.effect.mFaucetUpgradeBoost).add(buyableEffect("metaMeta", 94)))).add(1)
                if (hasMilestone("metaMeta", 4)) eff = eff.mul(player.metaMeta.sacrificeMulti) 
                if (hasUpgrade("metaMeta", 104)) eff = eff.pow(upgradeEffect("metaMeta", 104))
                return eff.mul(tmp.metaMeta.effect.mFaucet1Boost)
            },
            canAfford() { return new Decimal(player[this.layer].metaFaucets[0]).gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Meta-Faucet Upgrades"
            },
            display() {
                return "which are multipling all Meta-Faucet efficiency by ×" + format(tmp[this.layer].buyables[this.id].effect) + ". Each power of 2 also award you with a bonus Meta-Faucet.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " of Meta-Faucet #1"
            },
            buy() {
                player[this.layer].metaFaucets[0] = player[this.layer].metaFaucets[0].sub(tmp[this.layer].buyables[this.id].cost)
                if (hasMilestone("metaMeta", 7)) {
                    var b = getBuyableAmount(this.layer, this.id)
                    setBuyableAmount(this.layer, this.id, Decimal.min(b.sqrt().add(1.01).floor().pow(2), Decimal.pow(2, b.log(2).add(1).floor())))
                } else {
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
                if (getBuyableAmount(this.layer, this.id).round().log(2) % 1 == 0) player[this.layer].metaFaucets.push(new Decimal(0))
                if (hasUpgrade("metaMeta", 94) && Math.sqrt(getBuyableAmount(this.layer, this.id).round()) % 1 == 0) player[this.layer].metaFaucets.push(new Decimal(0))
            },
        },
        92: {
            cost(x) { return Decimal.pow(1e8, (x || getBuyableAmount(this.layer, this.id)).div(10).add(1).pow(2).pow((x || getBuyableAmount(this.layer, this.id)).div(1000).max(1))) },
            effect(x) { return (+(x || getBuyableAmount(this.layer, this.id)) + buyableEffect("metaMeta", 94) + tmp.metaMeta.effect.mFaucetUpgradeBoost) * 0.01 * buyableEffect("metaMeta", 93) },
            canAfford() { return new Decimal(player[this.layer].metaFaucets[19]).gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Meta-Faucet Upgrade^2s"
            },
            display() {
                return "which are increasing the power in the Meta-Faucet Upgrade formula by +" + format(tmp[this.layer].buyables[this.id].effect) + ". Each perfect square also award you with a bonus Meta-Faucet.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " of Meta-Faucet #20"
            },
            buy() {
                player[this.layer].metaFaucets[19] = player[this.layer].metaFaucets[19].sub(tmp[this.layer].buyables[this.id].cost)
                if (hasMilestone("metaMeta", 7)) {
                    var b = getBuyableAmount(this.layer, this.id)
                    setBuyableAmount(this.layer, this.id, b.sqrt().add(1.01).floor().pow(2))
                } else {
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
                if (Math.sqrt(getBuyableAmount(this.layer, this.id).round()) % 1 == 0) player[this.layer].metaFaucets.push(new Decimal(0))
            },
        },
        93: {
            cost(x) { return Decimal.pow(1e255, (x || getBuyableAmount(this.layer, this.id)).div(5.67).add(1).pow(2).pow((x || getBuyableAmount(this.layer, this.id)).div(1000).max(1))) },
            effect(x) { return (+(x || getBuyableAmount(this.layer, this.id)) + buyableEffect("metaMeta", 94) +  tmp.metaMeta.effect.mFaucetUpgradeBoost) * 0.1 + 1 },
            canAfford() { return new Decimal(player[this.layer].metaFaucets[49]).gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Meta-Faucet Upgrade^3s"
            },
            display() {
                return "which are multipling the Meta-Faucet Upgrade^2 effect by ×" + format(tmp[this.layer].buyables[this.id].effect) + ". Each perfect square also award you with a bonus Meta-Faucet.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " of Meta-Faucet #50"
            },
            buy() {
                player[this.layer].metaFaucets[49] = player[this.layer].metaFaucets[49].sub(tmp[this.layer].buyables[this.id].cost)
                if (hasMilestone("metaMeta", 7)) {
                    var b = getBuyableAmount(this.layer, this.id)
                    setBuyableAmount(this.layer, this.id, b.sqrt().add(1.01).floor().pow(2))
                } else {
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
                if (Math.sqrt(getBuyableAmount(this.layer, this.id).round()) % 1 == 0) player[this.layer].metaFaucets.push(new Decimal(0))
            },
        },
        94: {
            cost(x) { 
                return Decimal.pow("e1100", (x || getBuyableAmount(this.layer, this.id)).div(3).add(1).pow(2).pow((x || getBuyableAmount(this.layer, this.id)).div(hasMilestone("metaMeta", 6) ? 100 : 10).add(1))) 
            },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).add(tmp.metaMeta.effect.mFaucetUpgrade2Boost).toNumber() ** (hasMilestone("metaMeta", 6) ? 0.9 : 0.75) },
            canAfford() { return new Decimal(player[this.layer].metaFaucets[110]).gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Meta-Faucet Upgrade^4s"
            },
            display() {
                return "which are increasing the level of each previous upgrade by +" + format(tmp[this.layer].buyables[this.id].effect) + ". Each perfect square also award you with a bonus Meta-Faucet.\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " of Meta-Faucet #111"
            },
            buy() {
                player[this.layer].metaFaucets[110] = player[this.layer].metaFaucets[110].sub(tmp[this.layer].buyables[this.id].cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                if (Math.sqrt(getBuyableAmount(this.layer, this.id).round()) % 1 == 0) player[this.layer].metaFaucets.push(new Decimal(0))
                if (hasUpgrade("metaMeta", 122)) player[this.layer].metaFaucets.push(new Decimal(0))
            },
        },
        100: {
            cost(x) { return 0 },
            effect(x) { 
                var eff = Decimal.pow(2, new Decimal(player.metaMeta.metaFaucets[0]).div("e100000").max(1).log(10).div(1000).root(hasMilestone("metaMeta", 16) ? 1.9725 : 2)).mul(buyableEffect("metaMeta", 121)) 
                if (hasMilestone("metaMeta", 31)) eff = eff.mul(applyLogapolynomialSoftcap(player.metaMeta.points.add(1).log10().add(1).pow(0.02), "ee9", 1.5))
                return eff
            },
            canAfford() { return this.effect().gte(player.metaMeta.sacrificeMulti) },
            display() {
                return "Sacrifice, which will reset your Meta-Metaness, total and unspent Overflows and Eternities, and Eternity Upgrades, while keeping your Meta-Metaness and Overflow Upgrades intact, to set your multiplier to:<br/><br/><h2>×" + format(tmp[this.layer].buyables[this.id].effect) + "</h2>"
            },
            buy() {
                player.metaMeta.sacrificeMulti = player.metaMeta.sacrificeMulti.max(this.effect());
                
                if (!hasUpgrade("metaMeta", 124)) [91, 92, 93, 94, 101, 102, 103, 104, 111, 112, 113, 114, 121, 122, 123, 124].forEach(elm => {
                    var i = player[this.layer].upgrades.indexOf(elm)
                    if (i >= 0) player[this.layer].upgrades.splice(i, 1)
                })
                
                player.points = new Decimal(10)
                player[this.layer].points = new Decimal(0)
                resetBuyables(this.layer)
                player[this.layer].aspectFaucets =  Array.from({ length: 12 }, _ => new Decimal(0))
                player[this.layer].classFaucets = Array.from({ length: 12 }, _ => new Decimal(0))
                player[this.layer].metaFaucets = []
                if (player[this.layer].metaMetaFaucets.length <= 50) player[this.layer].metaMetaFaucets = []
                doReset(this.layer, true)

                player[this.layer].meta = new Decimal(0)
                player[this.layer].overflows = player[this.layer].overflowsTotal = hasMilestone("metaMeta", 5) ? tmp.metaMeta.milestones[5].effect : new Decimal(0)
                player[this.layer].eternities = player[this.layer].eternitiesTotal = hasMilestone("metaMeta", 9) ? tmp.metaMeta.milestones[9].effect : new Decimal(0)

            },
        },
        111: {
            cost(x) { return Decimal.pow("e1500000", Decimal.pow(1.035, (x || getBuyableAmount(this.layer, this.id)))) },
            effect(x) { return 0 },
            canAfford() { return new Decimal(player.metaMeta.metaFaucets[Math.round(getBuyableAmount(this.layer, this.id).toNumber())]).gte(this.cost()) && player.metaMeta.metaMetaFaucets.length < 1000 },
            display() {
                return "Buy one with<br/>" + format(tmp[this.layer].buyables[this.id].cost) + "<br/>" +
                "Meta-Faucet #" + formatWhole(getBuyableAmount(this.layer, this.id).toNumber() + 1)
            },
            buy() {
                if (player.metaMeta.metaMetaFaucets.length < 1000) {
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    player[this.layer].metaMetaFaucets.push(new Decimal(0))
                }
            },
            style: {
                "width": "120px",
                "height": "60px",
            }
        },
        121: {
            cost(x) { 
                var cost = Decimal.pow(240000000, Decimal.pow(hasMilestone("metaMeta", 28) ? 1.035 : 1.05, (x || getBuyableAmount(this.layer, this.id)).div(5))) 
                if (hasMilestone("metaMeta", 20)) cost = cost.div(player.metaMeta.eternities.div(10).add(1))
                if (hasMilestone("metaMeta", 21)) cost = cost.div(player.metaMeta.overflows.sqrt().div(10).add(1))
                if (hasMilestone("metaMeta", 22)) cost = cost.div(player.metaMeta.meta.pow(0.2).div(10).add(1))
                if (hasMilestone("metaMeta", 24)) cost = cost.div(player.metaMeta.sacrificeMulti.add(1).log(10).mul(player.metaMeta.sacrificeMulti.add(1).log(10).sub(499).max(1)).add(1))
                if (hasMilestone("metaMeta", 27)) cost = cost.div(tmp.metaMeta.milestones[27].effect)
                return cost;
            },
            effect(x) { return Decimal.pow(10 * (hasMilestone("metaMeta", 27) ? tmp.metaMeta.milestones[27].effect : 1), (x || getBuyableAmount(this.layer, this.id))) },
            canAfford() { return new Decimal(player.metaMeta.meta).gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "‰<br/>Build Sburb."
            },
            display() {
                return "Needs " + format(tmp[this.layer].buyables[this.id].cost) + " Meta-Metaness.\n" +
                    "Each permile multiplies sacrifice multiplier by 10."
            },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                if (getBuyableAmount(this.layer, this.id).gte(1000)) {
                    player.tab = "none"
                    player.phaseTimer = 0;
                }
            },
        },
    },

    bars: {
        pointBar: {
            direction: RIGHT,
            width: 476,
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
            width: 476,
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
            width: 476,
            height: 50,
            progress() {
                return Decimal.log10(player[this.layer].points.add(1)).div(Math.log10(2)).div(262143).div(hasUpgrade("metaMeta", 44) ? player.metaMeta.meta.div(38).add(1).pow(3.5).pow(player.metaMeta.meta.max(100).div(100).pow(0.1)) : 1)
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
                        .add(hasMilestone("metaMeta", 3) ? player.metaMeta.meta.div(hasMilestone("metaMeta", 23) ? 100 : 1000).ceil() : 0)
                        .add(hasMilestone("metaMeta", 33) ? player.metaMeta.meta : 0)
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
                    player[this.layer].metaFaucets = []
                    player[this.layer].metaMetaFaucets = []

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
                if (!hasUpgrade("metaMeta", 102)) {
                    player[this.layer].points = new Decimal(0)
                    resetBuyables(this.layer)
                    player[this.layer].aspectFaucets =  Array.from({ length: 12 }, _ => new Decimal(0)),
                    player[this.layer].classFaucets = Array.from({ length: 12 }, _ => new Decimal(0)),
                    player[this.layer].metaFaucets = []
                    player[this.layer].metaMetaFaucets = []
                    doReset(this.layer, true)

                    if (hasMilestone("metaMeta", 2)) {
                        for (var a = 11; a <= 13; a++) player[this.layer].buyables[a] = new Decimal(2)
                        for (var a = 21; a <= 23; a++) player[this.layer].buyables[a] = new Decimal(3)
                    }
                }
                var inc = new Decimal(1)
                if (hasMilestone("metaMeta", 21)) inc = inc.add(player.metaMeta.overflows.div(hasMilestone("metaMeta", 23) ? 100 : 1000).ceil())
                if (hasMilestone("metaMeta", 33)) inc = inc.add(player.metaMeta.overflows)

                player[this.layer].overflows = player[this.layer].overflows.add(inc)
                player[this.layer].overflowsTotal = player[this.layer].overflowsTotal.add(inc)
            },
            style: {
                "height": "50px",
            }
        },
        13: {
            unlocked() {
                return hasUpgrade("metaMeta", 81)
            },
            display() {
                return "Dilate Time for +1 Eternity"
            },
            canClick() {
                return player.metaMeta.resetTime >= Number.MAX_VALUE
            },
            onClick() {
                if (!hasMilestone("metaMeta", 10)) {
                    player.points = new Decimal(10)
                    player[this.layer].points = new Decimal(0)
                    resetBuyables(this.layer)
                    player[this.layer].aspectFaucets =  Array.from({ length: 12 }, _ => new Decimal(0)),
                    player[this.layer].classFaucets = Array.from({ length: 12 }, _ => new Decimal(0)),
                    player[this.layer].metaFaucets = []
                    player[this.layer].metaMetaFaucets = []
                    doReset(this.layer, true)

                    if (hasMilestone("metaMeta", 8)) {
                        for (var a = 11; a <= 13; a++) player[this.layer].buyables[a] = new Decimal(2)
                        for (var a = 21; a <= 23; a++) player[this.layer].buyables[a] = new Decimal(3)
                    }
                } else {
                    player[this.layer].resetTime = 0
                }
                var inc = new Decimal(1)
                if (hasMilestone("metaMeta", 23)) inc = inc.add(player.metaMeta.eternities.div(100).ceil())
                if (hasMilestone("metaMeta", 33)) inc = inc.add(player.metaMeta.eternities)
                
                player[this.layer].eternities = player[this.layer].eternities.add(inc)
                player[this.layer].eternitiesTotal = player[this.layer].eternitiesTotal.add(inc)
            },
            style: {
                "height": "50px",
            }
        },
        21: {
            unlocked() {
                return hasUpgrade("metaMeta", 44) && (!hasUpgrade("metaMeta", 81) || (hasMilestone("metaMeta", 17) && !hasMilestone("metaMeta", 21)))
            },
            display() {
                return hasMilestone("metaMeta", 17) ? "Reset Current Dilation" : "Respec Overflow Upgrades"
            },
            canClick() {
                return true
            },
            onClick() {
                if (!hasMilestone("metaMeta", 17)) [51, 52, 53, 54, 61, 62, 63, 64, 71, 72, 73, 74, 81, 82, 83, 84].forEach(elm => {
                    var i = player[this.layer].upgrades.indexOf(elm)
                    if (i >= 0) player[this.layer].upgrades.splice(i, 1)
                })
                player[this.layer].overflows = player[this.layer].overflowsTotal

                player.points = new Decimal(10)
                player[this.layer].points = new Decimal(0)
                resetBuyables(this.layer)
                player[this.layer].aspectFaucets =  Array.from({ length: 12 }, _ => new Decimal(0)),
                player[this.layer].classFaucets = Array.from({ length: 12 }, _ => new Decimal(0)),
                player[this.layer].metaFaucets = []
                player[this.layer].metaMetaFaucets = []
                doReset(this.layer, true)

                if (hasMilestone("metaMeta", 2)) {
                    for (var a = 11; a <= 13; a++) player[this.layer].buyables[a] = new Decimal(2)
                    for (var a = 21; a <= 23; a++) player[this.layer].buyables[a] = new Decimal(3)
                }
            },
            style: {
                "height": "50px",
            }
        },
        22: {
            unlocked() {
                return hasUpgrade("metaMeta", 81)
            },
            display() {
                return "Respec Eternity Upgrades"
            },
            canClick() {
                return true
            },
            onClick() {
                if (hasUpgrade("metaMeta", 94) && !hasMilestone("metaMeta", 12)) {
                    player.metaMeta.overflows = player.metaMeta.overflowsTotal = new Decimal(0);
                    player.metaMeta.remeta = true;
                }

                [91, 92, 93, 94, 101, 102, 103, 104, 111, 112, 113, 114, 121, 122, 123, 124].forEach(elm => {
                    var i = player[this.layer].upgrades.indexOf(elm)
                    if (i >= 0) player[this.layer].upgrades.splice(i, 1)
                })
                player[this.layer].eternities = player[this.layer].eternitiesTotal

                player.points = new Decimal(10)
                player[this.layer].points = new Decimal(0)
                resetBuyables(this.layer)
                player[this.layer].aspectFaucets =  Array.from({ length: 12 }, _ => new Decimal(0)),
                player[this.layer].classFaucets = Array.from({ length: 12 }, _ => new Decimal(0)),
                player[this.layer].metaFaucets = []
                player[this.layer].metaMetaFaucets = []
                doReset(this.layer, true)

                if (hasMilestone("metaMeta", 8)) {
                    for (var a = 11; a <= 13; a++) player[this.layer].buyables[a] = new Decimal(2)
                    for (var a = 21; a <= 23; a++) player[this.layer].buyables[a] = new Decimal(3)
                }

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
            description: "×10 Meta-Aspect Accelerator and Normal Meta-Class Booster buying power.",
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
                return hasUpgrade("metaMeta", 44)
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
                ret = applyLogapolynomialSoftcap(ret, 1e10, 2.96)
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
        91: {
            title: "<p style='transform: scale(-1, -1)'><alternate>MORE METANESS</alternate>",
            description: "You can have more than 10 Meta-Meta Upgrades, but their effect past 10 is massively reduced.",
            cost: new Decimal(1),
            currencyDisplayName: "Eternities",
            currencyInternalName: "eternities",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return hasUpgrade("metaMeta", 81)
            },
        },
        92: {
            title: "<p style='transform: scale(-1, -1)'><alternate>UNDERFLOW</alternate>",
            description: "Time and Unspent Overflows boosts all Faucets.",
            cost: new Decimal(1),
            currencyDisplayName: "Eternities",
            currencyInternalName: "eternities",
            currencyLocation() { return player[this.layer] },
            effect() {
                let ret = Decimal.pow(player.metaMeta.resetTime, player.metaMeta.overflows.add(1)).add(1).pow(24)
                if (hasUpgrade("metaMeta", 121)) ret = ret.pow(upgradeEffect("metaMeta", 121))
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        93: {
            title: "<p style='transform: scale(-1, -1)'><alternate>FASTER BUYING</alternate>",
            description: "×10 all Normal Meta-Class Booster buying power",
            cost: new Decimal(1),
            currencyDisplayName: "Eternities",
            currencyInternalName: "eternities",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        94: {
            title: "<p style='transform: scale(-1, -1)'><alternate>MORE FAUCETS</alternate>",
            description: "Meta-Faucets Upgrades also gives you a Meta-Faucet for each perfect square.",
            cost: new Decimal(2),
            currencyDisplayName: "Eternities",
            currencyInternalName: "eternities",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return hasUpgrade("metaMeta", 113) 
            },
        },
        101: {
            title: "<p style='transform: scale(-1, -1)'><alternate>REAL TIME</alternate>",
            description: "Time and Eternity effect boosts all Faucets.",
            cost: new Decimal(1),
            currencyDisplayName: "Eternities",
            currencyInternalName: "eternities",
            currencyLocation() { return player[this.layer] },
            effect() {
                let ret = Decimal.pow(player.metaMeta.resetTime, tmp.metaMeta.effect.eternityNerf).add(1).pow(64)
                return ret
            },
            effectDisplay() { return "×" + format(this.effect()) },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        102: {
            title: "<p style='transform: scale(-1, -1)'><alternate>UNDERFLOW AGAIN</alternate>",
            description: "Incrementing now only resets your points.",
            cost: new Decimal(2),
            currencyDisplayName: "Eternities",
            currencyInternalName: "eternities",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        103: {
            title: "<p style='transform: scale(-1, -1)'><alternate>META AUTO FAUCETS SQUARED</alternate>",
            description: "Automatically clicks on Meta-Faucet Upgrade^2s button per tick.",
            cost: new Decimal(2),
            currencyDisplayName: "Eternities",
            currencyInternalName: "eternities",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        104: {
            title: "<p style='transform: scale(-1, -1)'><alternate>META UPGRADED</alternate>",
            description: "The “Time and <i>x</i>” upgrades also boosts the Meta-Faucet Upgrade.",
            cost: new Decimal(1),
            currencyDisplayName: "Eternities",
            currencyInternalName: "eternities",
            currencyLocation() { return player[this.layer] },
            effect() {
                let ret = upgradeEffect("metaMeta", 92).mul(upgradeEffect("metaMeta", 101)).add(1).log(10).add(1).log(10).div(10).add(1)
                return ret
            },
            effectDisplay() { return "^" + format(this.effect()) },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        111: {
            title: "<p style='transform: scale(-1, -1)'><alternate>AUTOFLOW</alternate>",
            description: "Automatically Increments for Overflows.",
            cost: new Decimal(1),
            currencyDisplayName: "Eternities",
            currencyInternalName: "eternities",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        112: {
            title: "<p style='transform: scale(-1, -1)'><alternate>META AUTO FAUCETS</alternate>",
            description: "Automatically clicks on Meta-Faucet Upgrades button per tick.",
            cost: new Decimal(1),
            currencyDisplayName: "Eternities",
            currencyInternalName: "eternities",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        113: {
            title: "<p style='transform: scale(-1, -1)'><alternate>INTERNAL FAUCETS</alternate>",
            description: "Automatically buys one of each Meta-Faucet types per tick. Also unlocks the top-right-most Eternity Upgrade.",
            cost: new Decimal(2),
            currencyDisplayName: "Eternities",
            currencyInternalName: "eternities",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        114: {
            title: "<p style='transform: scale(-1, -1)'><alternate>EXPONENTIAL BUYING</alternate>",
            description: "For all Lower Meta-Upgrades and Faucet Upgrades, buying power is increased by 1% of itself, rounded up.",
            cost: new Decimal(2),
            currencyDisplayName: "Eternities",
            currencyInternalName: "eternities",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        121: {
            title: "<p style='transform: scale(-1, -1)'><alternate>UPGRADE</alternate>",
            description: "Sacrifice Multiplier boosts the “Time and Unspent Overflows” upgrade.",
            cost: new Decimal(4),
            currencyDisplayName: "Eternities",
            currencyInternalName: "eternities",
            effect() {
                let ret = applyLogapolynomialSoftcap(player.metaMeta.sacrificeMulti.pow(1.5), 1e10, 2)
                return ret
            },
            effectDisplay() { return "^" + format(this.effect()) },
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return hasMilestone("metaMeta", 14) && hasUpgrade("metaMeta", 114)
            },
        },
        122: {
            title: "<p style='transform: scale(-1, -1)'><alternate>ANOTHER UPGRADE</alternate>",
            description: "Meta-Faucet Upgrade^4s now gives you a bonus Meta-Faucet every upgrade.",
            cost: new Decimal(1),
            currencyDisplayName: "Eternities",
            currencyInternalName: "eternities",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        123: {
            title: "<p style='transform: scale(-1, -1)'><alternate>IT IS ALMOST HERE</alternate>",
            description: "All of your Meta-Faucet Upgrade levels boosts your Meta-Meta-Faucet effects.",
            cost: new Decimal(2),
            currencyDisplayName: "Eternities",
            currencyInternalName: "eternities",
            effect() {
                let ret = new Decimal(1)
                for (var a = 91; a <= 94; a++) ret = ret.add(getBuyableAmount("metaMeta", a).div(1000))
                return ret.sqrt()
            },
            effectDisplay() { return "^" + format(this.effect()) },
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
        },
        124: {
            title: "<p style='transform: scale(-1, -1)'><alternate>ANOTHER REWRITE</alternate>",
            description: "",
            cost: new Decimal(10),
            currencyDisplayName: "Eternities",
            currencyInternalName: "eternities",
            currencyLocation() { return player[this.layer] },
            unlocked() { 
                return ((this.id - 1) % 10 == 0 || hasUpgrade(this.layer, this.id - 1)) 
                    && (this.id - 10 < 11 || hasUpgrade(this.layer, this.id - 10)) 
            },
            style: {
                "height": "160px",
                "margin-bottom": "-40px"
            }
        },
    },

    milestones: {
        0: {
            requirementDescription: "×2 Sacrifice Multiplier",
            effectDescription: "Automatically clicks on the Meta-Faucets Upgrade^3s button per tick.",
            done() { return player.metaMeta.sacrificeMulti.gte(2) }
        },
        1: {
            requirementDescription: "×4 Sacrifice Multiplier",
            effectDescription: "Automatically clicks on the Meta-Faucets Upgrade^4s button per tick.",
            done() { return player.metaMeta.sacrificeMulti.gte(4) }
        },
        2: {
            requirementDescription: "×16 Sacrifice Multiplier",
            effectDescription: "You start Overflow Increments with Meta-Transcensions' bonuses.",
            done() { return player.metaMeta.sacrificeMulti.gte(16) }
        },
        3: {
            requirementDescription: "×64 Sacrifice Multiplier",
            effectDescription: "Meta-Transcending gives an extra 0.1% of your Meta-Metaness, rounded up.",
            done() { return player.metaMeta.sacrificeMulti.gte(64) }
        },
        4: {
            requirementDescription: "×180 Sacrifice Multiplier",
            effectDescription() { return "Sacrifice Multiplier boosts Meta-Faucets." },
            done() { return player.metaMeta.sacrificeMulti.gte(180) }
        },
        5: {
            requirementDescription: "×360 Sacrifice Multiplier",
            effectDescription() { return "You start your next Sacrifices with bonus Overflows. Currently: +" + formatWhole(tmp[this.layer].milestones[this.id].effect) },
            effect() { return player.metaMeta.sacrificeMulti.slog(1.5).pow(1.75).floor() },
            done() { return player.metaMeta.sacrificeMulti.gte(360) }
        },
        6: {
            requirementDescription: "×450 Sacrifice Multiplier",
            effectDescription() { return "Reduces the cost scaling and improves the effect scaling of Meta-Meta Upgrade^4s" },
            done() { return player.metaMeta.sacrificeMulti.gte(450) }
        },
        7: {
            requirementDescription: "×640 Sacrifice Multiplier",
            effectDescription() { return "Buying Meta-Faucets, Meta-Faucet^2s, and Meta-Faucet^3s will take you to the next amount required for a bonus Meta-Faucet" },
            done() { return player.metaMeta.sacrificeMulti.gte(640) }
        },
        8: {
            requirementDescription: "×1,413 Sacrifice Multiplier",
            effectDescription: "You start Eternity Time Dilations with Meta-Transcensions' bonuses.",
            done() { return player.metaMeta.sacrificeMulti.gte(1413) }
        },
        9: {
            requirementDescription: "×4,800 Sacrifice Multiplier",
            effectDescription() { return "You start your next Sacrifices with bonus Eternities. Currently: +" + formatWhole(tmp[this.layer].milestones[this.id].effect) },
            effect() { return player.metaMeta.sacrificeMulti.slog(2).pow(1.5).floor() },
            done() { return player.metaMeta.sacrificeMulti.gte(4800) }
        },
        10: {
            requirementDescription: "×96,000 Sacrifice Multiplier",
            effectDescription() { return "Time Dilations now only reset your Meta-Ascension time." },
            done() { return player.metaMeta.sacrificeMulti.gte(96000) }
        },
        11: {
            requirementDescription: "×360,000 Sacrifice Multiplier",
            effectDescription() { return "Automates Time Dilating." },
            done() { return player.metaMeta.sacrificeMulti.gte(360000) }
        },
        12: {
            requirementDescription: "×4,000,000 Sacrifice Multiplier",
            effectDescription() { return "Your Overflows and Total Overlows no longer resets when you respec your Eternity Upgrades with the “Meta-Faucet Upgrades also gives you Meta-Faucets” upgrade." },
            done() { return player.metaMeta.sacrificeMulti.gte(4000000) }
        },
        13: {
            requirementDescription: "×32,000,000 Sacrifice Multiplier",
            effectDescription() { return "You get 1.5% of your remaining Sacrifice Multiplier per second." },
            done() { return player.metaMeta.sacrificeMulti.gte(32000000) }
        },
        14: {
            requirementDescription: "×63,200,000 Sacrifice Multiplier",
            effectDescription() { return "Unlocks the bottom-left Eternity Upgrade, but only when you've bought all previous ones." },
            done() { return player.metaMeta.sacrificeMulti.gte(63200000) }
        },
        15: {
            requirementDescription: "×160,000,000 Sacrifice Multiplier",
            effectDescription() { return "Meta-Faucets now get updated highest first instead of lowest first." },
            done() { return player.metaMeta.sacrificeMulti.gte(160000000) }
        },
        16: {
            requirementDescription: "×390,000,000 Sacrifice Multiplier",
            effectDescription() { return "Sacrifice Multiplier formula becomes better." },
            done() { return player.metaMeta.sacrificeMulti.gte(390000000) }
        },
        17: {
            requirementDescription: "×1.612e9 Sacrifice Multiplier",
            effectDescription() { return "Replaces the Respec Overflow Upgrades button to Reset Current Dilation." },
            done() { return player.metaMeta.sacrificeMulti.gte(1.612e9) }
        },
        18: {
            requirementDescription: "×1.800e11 Sacrifice Multiplier",
            effectDescription() { return "Unlocks Meta-Meta-Faucets." },
            done() { return player.metaMeta.sacrificeMulti.gte(1.800e11) }
        },
        19: {
            requirementDescription: "×2.160e14 Sacrifice Multiplier",
            unlocked() { return hasUpgrade("metaMeta", 124) },
            effectDescription() { return "Raises the Metaness effect power tower by your amount of Overflows, plus 1." },
            done() { return player.metaMeta.sacrificeMulti.gte(2.160e14) }
        },
        20: {
            requirementDescription: "×1.213e45 Sacrifice Multiplier",
            unlocked() { return hasUpgrade("metaMeta", 124) },
            effectDescription() { return "Your Sburb-building requirements gets lower based on your current Eternities." },
            done() { return player.metaMeta.sacrificeMulti.gte(1.213e40) }
        },
        21: {
            requirementDescription: "×4.137e74 Sacrifice Multiplier",
            unlocked() { return hasUpgrade("metaMeta", 124) },
            effectDescription() { return "Your Sburb-building requirements gets lower based on your current Overflows. Also Incrementing grants an extra 0.1% of your current Overflows, rounding up. Also removes the Reset Current Dilation button because it's probably useless by now." },
            done() { return player.metaMeta.sacrificeMulti.gte(4.137e74) }
        },
        22: {
            requirementDescription: "×2.160e139 Sacrifice Multiplier",
            unlocked() { return hasUpgrade("metaMeta", 124) },
            effectDescription() { return "Your Sburb-building requirements gets lower based on your current Meta-Metaness. It's getting faster..." },
            done() { return player.metaMeta.sacrificeMulti.gte(2.160e139) }
        },
        23: {
            requirementDescription: "×1.000e400 Sacrifice Multiplier",
            unlocked() { return hasUpgrade("metaMeta", 124) },
            effectDescription() { return "Increase the extra Overflows on Incrementing and Meta-Metaness on Meta-Transcensions by 1% and also apply it to Eternities." },
            done() { return player.metaMeta.sacrificeMulti.gte("e400") }
        },
        24: {
            requirementDescription: "×1.000e475 Sacrifice Multiplier",
            unlocked() { return hasUpgrade("metaMeta", 124) },
            effectDescription() { return "Your Sburb-building requirements gets lower based on your current Sacrifice Multiplier." },
            done() { return player.metaMeta.sacrificeMulti.gte("e475") }
        },
        25: {
            requirementDescription: "×1.000e510 Sacrifice Multiplier",
            effectDescription() { return "Your Sacrifice Multiplier boosts the Meta-Meta-Faucets' Meta-Meta-Faucets Boost. Currently: ^" + format(tmp[this.layer].milestones[this.id].effect)  },
            effect() { return player.metaMeta.sacrificeMulti.div("e510").add(1).slog(2).add(1).div(2) },
            done() { return player.metaMeta.sacrificeMulti.gte("e510") }
        },
        26: {
            requirementDescription: "×1.000e754 Sacrifice Multiplier",
            effectDescription() { return "Your Sburb-building process boosts the Meta-Meta-Faucets' Meta-Meta-Faucets Boost. Currently: ^" + format(tmp[this.layer].milestones[this.id].effect)  },
            effect() { return player.metaMeta.buyables[121].div(100).add(1) },
            done() { return player.metaMeta.sacrificeMulti.gte("e754") }
        },
        27: {
            requirementDescription: "×1e1234 Sacrifice Multiplier",
            effectDescription() { return "You gain more Sacrifice Multiplier per mile of Sburb-building based on current Sburb-building process. Also reduces the Sburb requirement by the same amount. Currently: ×" + format(tmp[this.layer].milestones[this.id].effect)  },
            effect() { return player.metaMeta.buyables[121].div(50).add(1).pow(2.5).pow(hasMilestone("metaMeta", 28) ? 1.8 : 1) },
            done() { return player.metaMeta.sacrificeMulti.gte("e1234") }
        },
        28: {
            requirementDescription: "×1e1503 Sacrifice Multiplier",
            effectDescription() { return "^2.5 previous milestone effect."  },
            done() { return player.metaMeta.sacrificeMulti.gte("e1503") }
        },
        29: {
            requirementDescription: "×1e1740 Sacrifice Multiplier",
            effectDescription() { return "Your Sburb-building requirements grows slower."  },
            done() { return player.metaMeta.sacrificeMulti.gte("e1740") }
        },
        30: {
            requirementDescription: "×1e2360 Sacrifice Multiplier",
            effectDescription() { return "Raises Metaness gain by 3 to the power of your current Eternity amount."  },
            done() { return player.metaMeta.sacrificeMulti.gte("e2360") }
        },
        31: {
            requirementDescription: "×1e2468 Sacrifice Multiplier",
            effectDescription() { return "Raises Metaness gain by 1.5 to the power of your current Overflow amount."  },
            done() { return player.metaMeta.sacrificeMulti.gte("e2468") }
        },
        32: {
            requirementDescription: "×1e2800 Sacrifice Multiplier",
            effectDescription() { return "Metaness increases your Sacrifice Multiplier."  },
            done() { return player.metaMeta.sacrificeMulti.gte("e2800") }
        },
        33: {
            requirementDescription: "×e1.000e10 Sacrifice Multiplier",
            effectDescription() { return "Meta-Transcending, Overflow Incrementing, and Time Dilation now doubles the related currencies."  },
            done() { return player.metaMeta.sacrificeMulti.gte("ee10") }
        },
    },

    update(delta) {
        var timeMul = new Decimal(1)
        if (hasUpgrade("metaMeta", 24)) timeMul = timeMul.mul(upgradeEffect("metaMeta", 24))
        if (hasUpgrade("metaMeta", 33)) timeMul = timeMul.mul(upgradeEffect("metaMeta", 33))
        if (hasUpgrade("metaMeta", 42)) timeMul = timeMul.mul(upgradeEffect("metaMeta", 42))
        if (hasUpgrade("metaMeta", 43)) timeMul = timeMul.mul(upgradeEffect("metaMeta", 43))
        if (hasUpgrade("metaMeta", 34)) timeMul = timeMul.mul(upgradeEffect("metaMeta", 34))
        if (hasUpgrade("metaMeta", 81)) timeMul = timeMul.mul(upgradeEffect("metaMeta", 81))
        timeMul = timeMul.mul(tmp.metaMeta.effect.timeBoost)
        timeMul = timeMul.root(tmp.metaMeta.effect.eternityNerf.div(player.metaMeta.sacrificeMulti))
        if (timeMul.gte(Number.MAX_VALUE)) timeMul = Number.MAX_VALUE

        player[this.layer].resetTime += ((buyableEffect(this.layer, 23) / 100 + 1) * timeMul - 1) * delta

        if (player[this.layer].resetTime >= Number.MAX_VALUE) player[this.layer].resetTime = Number.MAX_VALUE
        else {
            player[this.layer].points = player[this.layer].points.add(tmp[this.layer].resetGain.mul(buyableEffect(this.layer, 21)).mul(delta).div(100))
            if (!hasUpgrade("metaMeta", 44)) player[this.layer].points = player[this.layer].points.min(Decimal.pow(2, 262143)).max(0)
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
        if (hasUpgrade("metaMeta", 103)) {
            buyBuyable("metaMeta", 92)
        }
        if (hasUpgrade("metaMeta", 112)) {
            buyBuyable("metaMeta", 91)
        }
        if (hasMilestone("metaMeta", 0)) {
            buyBuyable("metaMeta", 93)
        }
        if (hasMilestone("metaMeta", 1)) {
            buyBuyable("metaMeta", 94)
        }
        if (hasUpgrade("metaMeta", 113)) for (var a = 81; a <= 84; a++) {
            buyBuyable("metaMeta", a)
        }
        if (hasUpgrade("metaMeta", 74)) clickClickable("metaMeta", 11)
        if (hasUpgrade("metaMeta", 111)) clickClickable("metaMeta", 12)
        if (hasMilestone("metaMeta", 11)) clickClickable("metaMeta", 13)
        if (hasMilestone("metaMeta", 13)) {
            player.metaMeta.sacrificeMulti = player.metaMeta.sacrificeMulti.add(buyableEffect("metaMeta", 100).sub(player.metaMeta.sacrificeMulti).max(0).mul(1 - Math.pow(0.985, +delta)))
        }

        if (hasMilestone("metaMeta", 15)) for (var a = player.metaMeta.metaFaucets.length - 1; a >= 0; a--) player.metaMeta.metaFaucets[a] = 
        Decimal.add(player.metaMeta.metaFaucets[a], new Decimal(player.metaMeta.metaFaucets[a+1]).add(1).mul(buyableEffect("metaMeta", 91)).mul(delta))
        else for (var a = 0; a < player.metaMeta.metaFaucets.length; a++) player.metaMeta.metaFaucets[a] = 
        Decimal.add(player.metaMeta.metaFaucets[a], new Decimal(player.metaMeta.metaFaucets[a+1]).add(1).mul(buyableEffect("metaMeta", 91)).mul(delta))

        for (var a = player.metaMeta.metaMetaFaucets.length - 1; a >= 0; a--) player.metaMeta.metaMetaFaucets[a] = 
        Decimal.add(player.metaMeta.metaMetaFaucets[a], new Decimal(player.metaMeta.metaMetaFaucets[a+1]).add(1).mul(tmp.metaMeta.effect.mmFaucetBoost).mul(delta))

        if (hasUpgrade("metaMeta", 62)) {
            var mul = tmp.metaMeta.buyables[71].effect.mul(tmp.metaMeta.buyables[63].effect).mul(tmp.metaMeta.effect.faucetBoost)
            if (hasUpgrade("metaMeta", 83)) mul = mul.mul(upgradeEffect("metaMeta", 83))
            if (hasUpgrade("metaMeta", 92)) mul = mul.mul(upgradeEffect("metaMeta", 92))
            if (hasUpgrade("metaMeta", 101)) mul = mul.mul(upgradeEffect("metaMeta", 101))
            for (var a = 0; a < 12; a++) player.metaMeta.aspectFaucets[a] = 
                player.metaMeta.aspectFaucets[a].add(new Decimal(player.metaMeta.aspectFaucets[a+1]).add(1).mul(player.metaMeta.buyables[a+31]).mul(mul).mul(delta))
        }
        if (hasUpgrade("metaMeta", 73)) {
            var mul = tmp.metaMeta.buyables[71].effect.mul(tmp.metaMeta.buyables[64].effect).mul(tmp.metaMeta.effect.faucetBoost)
            if (hasUpgrade("metaMeta", 71)) mul = mul.mul(upgradeEffect("metaMeta", 71))
            if (hasUpgrade("metaMeta", 92)) mul = mul.mul(upgradeEffect("metaMeta", 92))
            if (hasUpgrade("metaMeta", 101)) mul = mul.mul(upgradeEffect("metaMeta", 101))
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
            "Meta-Faucets": {
                unlocked() { 
                    return player.metaMeta.best.gte("e4.84e16")
                },
                content: [
                    ["blank", "15px"],
                    ["display-text", () => "You have <h2 style='color:#31aeb0;text-shadow:#31aeb0 0px 0px 10px;'>" + formatWhole(player.metaMeta.metaFaucets.length) + "</h2> Meta-Faucets."],
                    ["blank", "15px"],
                    ["row", [["buyable", "81"], ["buyable", "82"], ["buyable", "83"], ["buyable", "84"]]],
                    ["blank", "15px"],
                    ["display-text", (() => {
                        var ret = ""
                        var len = player.metaMeta.metaFaucets.length
                        if (len > 13) {
                            for (var a = 0; a < 6; a++) ret += 
                                "Meta-Faucet #" + (a + 1) + ": " + format(player.metaMeta.metaFaucets[a]) + "<br/>"
                            ret += "...<br/>"
                            for (var a = len - 6; a < len; a++) ret += 
                                "Meta-Faucet #" + (a + 1) + ": " + format(player.metaMeta.metaFaucets[a]) + "<br/>"
                        } else {
                        for (var a = 0; a < len; a++) ret += 
                            "Meta-Faucet #" + (a + 1) + ": " + format(player.metaMeta.metaFaucets[a]) + "<br/>"
                        }
                        return ret
                    })],
                    ["blank", "15px"],
                    ["display-text", (() => {
                        var ret = ""
                        var len = player.metaMeta.metaFaucets.length
                        if (len > 0) ret += 
                            "Meta-Faucet #1: ×" + format(tmp.metaMeta.effect.timeBoost) + " Time Boost<br/>"
                        if (len > 1) ret += 
                            "Meta-Faucet #2: ×" + format(tmp.metaMeta.effect.faucetBoost) + " Faucet Boost<br/>"
                        if (len > 3) ret += 
                            "Meta-Faucet #4: ^" + format(tmp.metaMeta.effect.powBoost, 3) + " Metaness Boost<br/>"
                        if (len > 7) ret += 
                            "Meta-Faucet #8: ^" + format(tmp.metaMeta.effect.powTowerBoost, 3) + " Power Tower Boost<br/>"
                        if (len > 23) ret += 
                            "Meta-Faucet #24: √" + format(tmp.metaMeta.effect.mmUpgradeBoost, 3) + " Meta-Meta Upgrade Cost<br/>"
                        if (len > 71) ret += 
                            "Meta-Faucet #72: √" + format(tmp.metaMeta.effect.mmSpaceTimeBoost, 3) + " Meta-(Space + Time) Upgrade Cost<br/>"
                        if (len > 215) ret += 
                            "Meta-Faucet #216: +" + format(tmp.metaMeta.effect.mFaucetUpgradeBoost, 0) + " Bonus Meta-Faucets Upgrade^(1-3)s<br/>"
                            if (len > 431) ret += 
                                "Meta-Faucet #432: +" + format(tmp.metaMeta.effect.mFaucetUpgrade2Boost, 0) + " Bonus Meta-Faucets Upgrade^4s<br/>"
                        return ret
                    })],
                    ["blank", "15px"],
                    ["row", [["buyable", "91"], ["buyable", "92"], ["buyable", "93"]]],
                    ["row", [["buyable", "94"], ["buyable", "95"], ["buyable", "96"]]],
                    ["blank", "15px"],
                ]
            },
            "Meta-Meta-Faucets": {
                unlocked() { 
                    return hasMilestone("metaMeta", 18)
                },
                content: [
                    ["blank", "15px"],
                    ["display-text", () => "You have <h2 style='color:#31aeb0;text-shadow:#31aeb0 0px 0px 10px;'>" + formatWhole(player.metaMeta.metaMetaFaucets.length) + "</h2> Meta-Meta-Faucets."],
                    ["blank", "15px"],
                    ["row", [["buyable", "111"]]],
                    ["blank", "15px"],
                    ["display-text", (() => {
                        var ret = ""
                        var len = player.metaMeta.metaMetaFaucets.length
                        if (len > 13) {
                            for (var a = 0; a < 6; a++) ret += 
                                "Meta-Meta-Faucet #" + (a + 1) + ": " + format(player.metaMeta.metaMetaFaucets[a]) + "<br/>"
                            ret += "...<br/>"
                            for (var a = len - 6; a < len; a++) ret += 
                                "Meta-Meta-Faucet #" + (a + 1) + ": " + format(player.metaMeta.metaMetaFaucets[a]) + "<br/>"
                        } else {
                        for (var a = 0; a < len; a++) ret += 
                            "Meta-Meta-Faucet #" + (a + 1) + ": " + format(player.metaMeta.metaMetaFaucets[a]) + "<br/>"
                        }
                        return ret
                    })],
                    ["blank", "15px"],
                    ["display-text", (() => {
                        var ret = ""
                        var len = player.metaMeta.metaMetaFaucets.length
                        if (len > 0) ret += 
                            "Meta-Meta-Faucet #1: ×" + format(tmp.metaMeta.effect.mFaucet1Boost) + " Meta-Faucet Upgrade Boost<br/>"
                        if (len > 7) ret += 
                            "Meta-Meta-Faucet #8: ×" + format(tmp.metaMeta.effect.mFaucet2Boost) + " Previous Boost<br/>"
                        if (len > 21) ret += 
                            "Meta-Meta-Faucet #22: ×" + format(tmp.metaMeta.effect.mFaucet3Boost) + " Previous Boost<br/>"
                        if (len > 123) ret += 
                            "Meta-Meta-Faucet #124: ×" + format(tmp.metaMeta.effect.mFaucet4Boost) + " Previous Boost<br/>"
                        if (len > 179) ret += 
                            "Meta-Meta-Faucet #180: ×" + format(tmp.metaMeta.effect.mFaucetAllBoost) + " All Previous Boosts<br/>"
                        if (len > 999) ret += 
                            "Meta-Meta-Faucet #100: ×" + format(tmp.metaMeta.effect.mmFaucetBoost) + " Meta-Meta-Faucets Boost<br/>"
                            return ret
                    })],
                    ["blank", "15px"],
                    ["display-text", () => player.metaMeta.metaMetaFaucets.length > 50 ? "<br/><h5 style='opacity:0.5'>Something has changed while you've been here.<br/>You may need to try something you think you've done with it before to continue.<br/>Something you may have not came to think about.</h5>" : ""],
                ]
            },
            "Sacrifice": {
                unlocked() { 
                    return player.metaMeta.best.gte("e1.41e30")
                },
                content: [
                    ["blank", "15px"],
                    ["display-text", () => "Your sacrifice multiplier is <h2 style='color:#31aeb0;text-shadow:#31aeb0 0px 0px 10px;'>×" + format(player.metaMeta.sacrificeMulti) + "</h2>."],
                    ["display-text", () => "Sacrifice multiplier boosts Overflow and Eternity effect, excluding nerfs."],
                    ["blank", "15px"],
                    ["buyable", "100"],
                    ["blank", "15px"],
                    "milestones",
                ]
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
                        ["display-text", () => hasUpgrade("metaMeta", 44) ? "<div style='width:" + (tmp.metaMeta.clickables[21].unlocked ? 240 : 360) + "px'>You have <h2 style='color:#ffffff;text-shadow:#ffffff 0px 0px 10px;'>" + formatWhole(player.metaMeta.overflows) + "</h2> Overflows.</div>" : ""],
                        ["clickable", "12"]]],
                    ["row", [["upgrade", 51], ["upgrade", 52], ["upgrade", 53], ["upgrade", 54]]],
                    ["row", [["upgrade", 61], ["upgrade", 62], ["upgrade", 63], ["upgrade", 64]]],
                    ["row", [["upgrade", 71], ["upgrade", 72], ["upgrade", 73], ["upgrade", 74]]],
                    ["row", [["upgrade", 81], ["upgrade", 82], ["upgrade", 83], ["upgrade", 84]]],
                    ["display-text", () => "<h5 style='width:340px;height:40px;margin-left:130px;margin-bottom:-6px;padding:3px;font-size:10px'>" + (hasUpgrade("metaMeta", 81) ? 
                        "You have " + formatWhole(player.metaMeta.eternitiesTotal) + " total Eternities, which are applying a " + format(tmp[this.layer].effect.eternityNerf, 3) + "th root to bonus Time, but are raising Metaness gain and Metaness effect power tower by the same amount." 
                        : "") + "</h5>"],
                    ["row", [
                        ["clickable", "13"],
                        ["display-text", () => hasUpgrade("metaMeta", 81) ? "<div style='width:240px'>You have <h2 style='color:#b70d0e;text-shadow:#b70d0e 0px 0px 10px;'>" + formatWhole(player.metaMeta.eternities) + "</h2> Eternities.</div>" : ""],
                        ["clickable", "22"]]],
                        ["row", [["upgrade", 91], ["upgrade", 92], ["upgrade", 93], ["upgrade", 94]]],
                        ["row", [["upgrade", 101], ["upgrade", 102], ["upgrade", 103], ["upgrade", 104]]],
                        ["row", [["upgrade", 111], ["upgrade", 112], ["upgrade", 113], ["upgrade", 114]]],
                        ["row", [["upgrade", 121], ["upgrade", 122], ["upgrade", 123], ["upgrade", 124]]],
                ]
            },
            "Sburb": {
                unlocked() { 
                    return hasUpgrade("metaMeta", 124)
                },
                content: [
                    ["blank", "15px"],
                    ["row", [["buyable", 121]]]
                ],
                buttonStyle: {
                    
                }
            },
        },
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        ["blank", "25px"],
        ["display-text", () => "You've spent " + formatTime(player.metaMeta.resetTime) + " this Meta-Ascension."],
        ["blank", "25px"],
        ["microtabs", "stuff"],
        ["display-text", () => (
            (player.metaMeta.points.gte(4e130) && !tmp.metaMeta.microtabs.stuff["Meta-Aspects"].unlocked) || 
            (player.metaMeta.points.gte("e2000000") && !tmp.metaMeta.microtabs.stuff["Meta-Classes"].unlocked) || 
            (player.metaMeta.points.gte("e4.84e16") && !tmp.metaMeta.microtabs.stuff["Meta-Faucets"].unlocked) ||
            (player.metaMeta.points.gte("e1.41e30") && !tmp.metaMeta.microtabs.stuff["Sacrifice"].unlocked) ||
            (player.metaMeta.points.gte("e10000") && !tmp.metaMeta.microtabs.stuff["Limitation"].unlocked) ||
            (hasUpgrade("metaMeta", 94) && !player.metaMeta.remeta)
            ) ? "<br/><h5 style='opacity:0.5'>Sometimes the best way to continue is to start again.</h5>" : ""],
        ["blank", "35px"],
    ],

    hotkeys: [
        { 
            key: "m", 
            description: "M: Ascend for Metaness", 
            unlocked() { return hasUpgrade("skaia", 14) }, 
            onPress() { if (canReset(this.layer)) doReset(this.layer) } 
        },
        { 
            key: "M", 
            description: "Shift+M: Meta-Transcend for Meta-Metaness", 
            unlocked() { return tmp.metaMeta.clickables[11].canClick || player.metaMeta.meta.gte(1) || hasUpgrade("metaMeta", 11) }, 
            onPress() { clickClickable("metaMeta", 11) } 
        },
        { 
            key: "I", 
            description: "Shift+I: Increment for Overflows", 
            unlocked() { return tmp.metaMeta.clickables[12].canClick || player.metaMeta.overflowsTotal.gte(1) }, 
            onPress() { clickClickable("metaMeta", 12) } 
        },
        { 
            key: "D", 
            description: "Shift+D: Dilate Time for Eternities", 
            unlocked() { return tmp.metaMeta.clickables[13].canClick || player.metaMeta.eternitiesTotal.gte(1) }, 
            onPress() { clickClickable("metaMeta", 13) } 
        },
    ],
})