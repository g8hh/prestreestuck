addLayer("metaAspects", {
    name: "Aspects",
    symbol: "A",
    row: 8,
    position: 0,

    layerShown() { return hasUpgrade("skaia", 12) },
    resource: "Aspect Points",
    color: "#e5b9ff",
    type: "none",

    effect() {
        var effs = {
            pointBoost: applyLogapolynomialSoftcap(Decimal.pow(player.metaAspects.points.min(1e9), applyLogapolynomialSoftcap(player.metaAspects.points.pow(0.5), "ee10", 2)), "ee100000", 2),
            selfGain: new Decimal(1),
            globalPowerBoost: new Decimal(1),
        }
        for (var a = 1; a <= 12; a++) effs.selfGain = effs.selfGain.mul(tmp.metaAspects.buyables[a * 10 + 1].effect)
        effs.selfGain = effs.selfGain.sub(1)

        if (hasMilestone("metaDerse", 5)) effs.selfGain = effs.selfGain.pow(tmp.metaDerse.milestones[5].effect)
        if (hasMilestone("metaProspit", 5)) effs.selfGain = effs.selfGain.pow(tmp.metaProspit.milestones[5].effect)

        if (hasUpgrade("skaia", 76)) effs.selfGain = effs.selfGain.pow(upgradeEffect("skaia", 76))

        if (hasMilestone("metaProspit", 1)) effs.globalPowerBoost = effs.globalPowerBoost.mul(tmp.metaProspit.milestones[1].effect)
        if (hasMilestone("metaDerse", 1)) effs.globalPowerBoost = effs.globalPowerBoost.mul(tmp.metaDerse.milestones[1].effect)

        return effs
    },
    effectDescription() {
        eff = this.effect();
        return "which are giving a " + format(eff.pointBoost) + "× boost to point gain."
    },

    startData() {
        return {
            unlocked: true,
            points: new Decimal(1),
            autoBuyerTime: 0,
        }
    },

    buyables: {
        rows: 1,
        cols: 1,
        11: {
            cost(x) { return new Decimal(10).pow(x || getBuyableAmount(this.layer, this.id)).mul(10).pow(buyableEffect(this.layer, this.id - 1 + 2)).root(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).root(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1) },
            effect(x) {
                var eff = new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(buyableEffect(this.layer, this.id - 1 + 3))
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (a * 7), 2)
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (100 * a ** 2), 2)
                eff = applyLogapolynomialSoftcap(eff, "e25000", 2)
                eff = applyLogapolynomialSoftcap(eff, "e500000", 4)
                return eff.mul(tmp.metaClasses.buyables[12].effect[(this.id - 1) / 10]).mul(tmp.metaClasses.buyables[13].effect[(this.id - 1) / 10]).mul(tmp.metaAspects.effect.globalPowerBoost)
            },
            canAfford() { return player.points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>时间力量"
            },
            display() {
                return "which are boosting your Aspect Point gain by ×" + format(tmp[this.layer].buyables[this.id].effect.sub(1)) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " points"
            },
            buy() {
                if (!hasUpgrade("skaia", 38)) {
                    let nerf = buyableEffect(this.layer, this.id - 1 + 2).div(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).div(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1)
                    let base = new Decimal(10)
                    let growth = new Decimal(10)
                    let max = player.points.div(base).log(growth).div(nerf).sub(getBuyableAmount(this.layer, this.id)).add(1).max(0).floor()
                    let cost = this.cost(max)
                    if (Number.isNaN(max.mag)) return;
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#b70d0e", }
                } else {
                    return {}
                }
            }
        },
        12: {
            cost(x) { return new Decimal(100).pow(x || getBuyableAmount(this.layer, this.id)).mul(100000).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(0.4).recip().div(tmp.metaClasses.buyables[16].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[18].effect[(this.id - 2) / 10] || 1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Time Shards"
            },
            display() {
                return "which are raising the cost of Time Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(100000).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1)
                let growth = 100
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "2")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#b70d0e", }
                } else {
                    return {}
                }
            }
        },
        13: {
            cost(x) { return new Decimal(100000).pow(x || getBuyableAmount(this.layer, this.id)).mul(10000000).div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1) },
            effect(x) { return new Decimal(1).add((x || getBuyableAmount(this.layer, this.id).div(2))).pow(0.4).mul(tmp.metaClasses.buyables[20].effect[(this.id - 3) / 10] || 1).mul(tmp.metaClasses.buyables[22].effect[(this.id - 3) / 10] || 1).mul(tmp.metaProspit.buyables[(this.id - 3) / 10 + 10].effect).mul(tmp.metaDerse.buyables[(this.id - 3) / 10 + 10].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Time Essence"
            },
            display() {
                return "which are raising the effect of Time Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(10000000).div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1)
                let growth = 100000
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "4")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#b70d0e", }
                } else {
                    return {  }
                }
            }
        },
        21: {
            cost(x) { return new Decimal("e10000").pow(x || getBuyableAmount(this.layer, this.id)).mul("e100000").pow(buyableEffect(this.layer, this.id - 1 + 2)).root(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).root(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1) },
            effect(x) {
                var eff = new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(buyableEffect(this.layer, this.id - 1 + 3))
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (a * 7), 2)
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (100 * a ** 2), 2)
                eff = applyLogapolynomialSoftcap(eff, "e25000", 2)
                eff = applyLogapolynomialSoftcap(eff, "e500000", 4)
                return eff.mul(tmp.metaClasses.buyables[12].effect[(this.id - 1) / 10]).mul(tmp.metaClasses.buyables[13].effect[(this.id - 1) / 10]).mul(tmp.metaAspects.effect.globalPowerBoost)
            },
            canAfford() { return player.points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Space Power"
            },
            display() {
                return "which are boosting your Aspect Point gain by ×" + format(tmp[this.layer].buyables[this.id].effect.sub(1)) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " points"
            },
            buy() {
                if (!hasUpgrade("skaia", 38)) {
                    let nerf = buyableEffect(this.layer, this.id - 1 + 2).div(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).div(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1)
                    let base = new Decimal("e100000")
                    let growth = new Decimal("e10000")
                    let max = player.points.div(base).log(growth).div(nerf).sub(getBuyableAmount(this.layer, this.id)).add(1).max(0).floor()
                    let cost = this.cost(max)
                    if (Number.isNaN(max.mag)) return;
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#000000", "color": "var(--color)" }
                } else {
                    return {}
                }
            }
        },
        22: {
            cost(x) { return new Decimal(1e6).pow(x || getBuyableAmount(this.layer, this.id)).mul(1e16).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(0.4).recip().div(tmp.metaClasses.buyables[16].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[18].effect[(this.id - 2) / 10] || 1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Space Shards"
            },
            display() {
                return "which are raising the cost of Space Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(1e16).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1)
                let growth = new Decimal(1e6)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "2")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#000000", "color": "var(--color)" }
                } else {
                    return {}
                }
            }
        },
        23: {
            cost(x) { return new Decimal(1e7).pow(x || getBuyableAmount(this.layer, this.id)).mul(1e21).div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1) },
            effect(x) { return new Decimal(1).add((x || getBuyableAmount(this.layer, this.id).div(2))).pow(0.4).mul(tmp.metaClasses.buyables[20].effect[(this.id - 3) / 10] || 1).mul(tmp.metaClasses.buyables[22].effect[(this.id - 3) / 10] || 1).mul(tmp.metaProspit.buyables[(this.id - 3) / 10 + 10].effect).mul(tmp.metaDerse.buyables[(this.id - 3) / 10 + 10].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Space Essence"
            },
            display() {
                return "which are raising the effect of Space Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(1e21).div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1)
                let growth = new Decimal(1e7)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "4")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#000000", "color": "var(--color)" }
                } else {
                    return {}
                }
            }
        },
        31: {
            cost(x) { return new Decimal("ee14").pow(x || getBuyableAmount(this.layer, this.id)).mul("ee14").pow(buyableEffect(this.layer, this.id - 1 + 2)).root(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).root(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1) },
            effect(x) {
                var eff = new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(buyableEffect(this.layer, this.id - 1 + 3))
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (a * 7), 2)
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (100 * a ** 2), 2)
                eff = applyLogapolynomialSoftcap(eff, "e25000", 2)
                eff = applyLogapolynomialSoftcap(eff, "e500000", 4)
                return eff.mul(tmp.metaClasses.buyables[12].effect[(this.id - 1) / 10]).mul(tmp.metaClasses.buyables[13].effect[(this.id - 1) / 10]).mul(tmp.metaAspects.effect.globalPowerBoost)
            },
            canAfford() { return player.points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Mind Power"
            },
            display() {
                return "which are boosting your Aspect Point gain by ×" + format(tmp[this.layer].buyables[this.id].effect.sub(1)) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " points"
            },
            buy() {
                if (!hasUpgrade("skaia", 38)) {
                    let nerf = buyableEffect(this.layer, this.id - 1 + 2).div(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).div(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1)
                    let base = new Decimal("ee14")
                    let growth = new Decimal("ee14")
                    let max = player.points.div(base).log(growth).div(nerf).sub(getBuyableAmount(this.layer, this.id)).add(1).max(0).floor()
                    let cost = this.cost(max)
                    if (Number.isNaN(max.mag)) return;
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#00923d", }
                } else {
                    return {}
                }
            }
        },
        32: {
            cost(x) { return new Decimal(1e8).pow(x || getBuyableAmount(this.layer, this.id)).mul(1e32).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(0.4).recip().div(tmp.metaClasses.buyables[16].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[18].effect[(this.id - 2) / 10] || 1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Mind Shards"
            },
            display() {
                return "which are raising the cost of Mind Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(1e32).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1)
                let growth = new Decimal(1e8)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "2")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#00923d", }
                } else {
                    return {}
                }
            }
        },
        33: {
            cost(x) { return new Decimal(1e10).pow(x || getBuyableAmount(this.layer, this.id)).mul(1e40).div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1) },
            effect(x) { return new Decimal(1).add((x || getBuyableAmount(this.layer, this.id).div(2))).pow(0.4).mul(tmp.metaClasses.buyables[20].effect[(this.id - 3) / 10] || 1).mul(tmp.metaClasses.buyables[22].effect[(this.id - 3) / 10] || 1).mul(tmp.metaProspit.buyables[(this.id - 3) / 10 + 10].effect).mul(tmp.metaDerse.buyables[(this.id - 3) / 10 + 10].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Mind Essence"
            },
            display() {
                return "which are raising the effect of Mind Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(1e40).div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1)
                let growth = new Decimal(1e10)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "4")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#00923d", }
                } else {
                    return {}
                }
            }
        },
        41: {
            cost(x) { return new Decimal("ee31").pow(x || getBuyableAmount(this.layer, this.id)).mul("ee32").pow(buyableEffect(this.layer, this.id - 1 + 2)).root(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).root(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1) },
            effect(x) {
                var eff = new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(buyableEffect(this.layer, this.id - 1 + 3))
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (a * 7), 2)
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (100 * a ** 2), 2)
                eff = applyLogapolynomialSoftcap(eff, "e25000", 2)
                eff = applyLogapolynomialSoftcap(eff, "e500000", 4)
                return eff.mul(tmp.metaClasses.buyables[12].effect[(this.id - 1) / 10]).mul(tmp.metaClasses.buyables[13].effect[(this.id - 1) / 10]).mul(tmp.metaAspects.effect.globalPowerBoost)
            },
            canAfford() { return player.points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Heart Power"
            },
            display() {
                return "which are boosting your Aspect Point gain by ×" + format(tmp[this.layer].buyables[this.id].effect.sub(1)) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " points"
            },
            buy() {
                if (!hasUpgrade("skaia", 38)) {
                    let nerf = buyableEffect(this.layer, this.id - 1 + 2).div(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).div(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1)
                    let base = new Decimal("ee32")
                    let growth = new Decimal("ee31")
                    let max = player.points.div(base).log(growth).div(nerf).sub(getBuyableAmount(this.layer, this.id)).add(1).max(0).floor()
                    let cost = this.cost(max)
                    if (Number.isNaN(max.mag)) return;
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#55142a", }
                } else {
                    return {}
                }
            }
        },
        42: {
            cost(x) { return new Decimal(1e15).pow(x || getBuyableAmount(this.layer, this.id)).mul(1e75).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(0.4).recip().div(tmp.metaClasses.buyables[16].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[18].effect[(this.id - 2) / 10] || 1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Heart Shards"
            },
            display() {
                return "which are raising the cost of Heart Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(1e75).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1)
                let growth = new Decimal(1e15)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "2")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#55142a", }
                } else {
                    return {}
                }
            }
        },
        43: {
            cost(x) { return new Decimal(1e20).pow(x || getBuyableAmount(this.layer, this.id)).mul(1e90).div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1) },
            effect(x) { return new Decimal(1).add((x || getBuyableAmount(this.layer, this.id).div(2))).pow(0.4).mul(tmp.metaClasses.buyables[20].effect[(this.id - 3) / 10] || 1).mul(tmp.metaClasses.buyables[22].effect[(this.id - 3) / 10] || 1).mul(tmp.metaProspit.buyables[(this.id - 3) / 10 + 10].effect).mul(tmp.metaDerse.buyables[(this.id - 3) / 10 + 10].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Heart Essence"
            },
            display() {
                return "which are raising the effect of Heart Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(1e90).div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1)
                let growth = new Decimal(1e20)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "4")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#55142a", }
                } else {
                    return {}
                }
            }
        },
        51: {
            cost(x) { return new Decimal("ee45").pow(x || getBuyableAmount(this.layer, this.id)).mul("ee45").pow(buyableEffect(this.layer, this.id - 1 + 2)).root(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).root(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1) },
            effect(x) {
                var eff = new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(buyableEffect(this.layer, this.id - 1 + 3))
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (a * 7), 2)
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (100 * a ** 2), 2)
                eff = applyLogapolynomialSoftcap(eff, "e25000", 2)
                eff = applyLogapolynomialSoftcap(eff, "e500000", 4)
                return eff.mul(tmp.metaClasses.buyables[12].effect[(this.id - 1) / 10]).mul(tmp.metaClasses.buyables[13].effect[(this.id - 1) / 10]).mul(tmp.metaAspects.effect.globalPowerBoost)
            },
            canAfford() { return player.points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Hope Power"
            },
            display() {
                return "which are boosting your Aspect Point gain by ×" + format(tmp[this.layer].buyables[this.id].effect.sub(1)) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " points"
            },
            buy() {
                if (!hasUpgrade("skaia", 38)) {
                    let nerf = buyableEffect(this.layer, this.id - 1 + 2).div(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).div(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1)
                    let base = new Decimal("ee45")
                    let growth = new Decimal("ee45")
                    let max = player.points.div(base).log(growth).div(nerf).sub(getBuyableAmount(this.layer, this.id)).add(1).max(0).floor()
                    let cost = this.cost(max)
                    if (Number.isNaN(max.mag)) return;
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#ffde55", }
                } else {
                    return {}
                }
            }
        },
        52: {
            cost(x) { return new Decimal(1e18).pow(x || getBuyableAmount(this.layer, this.id)).mul(1e100).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(0.4).recip().div(tmp.metaClasses.buyables[16].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[18].effect[(this.id - 2) / 10] || 1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Hope Shards"
            },
            display() {
                return "which are raising the cost of Hope Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(1e100).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1)
                let growth = new Decimal(1e18)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "2")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#ffde55", }
                } else {
                    return {}
                }
            }
        },
        53: {
            cost(x) { return new Decimal(1e25).pow(x || getBuyableAmount(this.layer, this.id)).mul(1e120).div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1) },
            effect(x) { return new Decimal(1).add((x || getBuyableAmount(this.layer, this.id).div(2))).pow(0.4).mul(tmp.metaClasses.buyables[20].effect[(this.id - 3) / 10] || 1).mul(tmp.metaClasses.buyables[22].effect[(this.id - 3) / 10] || 1).mul(tmp.metaProspit.buyables[(this.id - 3) / 10 + 10].effect).mul(tmp.metaDerse.buyables[(this.id - 3) / 10 + 10].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Hope Essence"
            },
            display() {
                return "which are raising the effect of Hope Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(1e120).div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1)
                let growth = new Decimal(1e25)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "4")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#ffde55", }
                } else {
                    return {}
                }
            }
        },
        61: {
            cost(x) { return new Decimal("ee59").pow(x || getBuyableAmount(this.layer, this.id)).mul("ee60").pow(buyableEffect(this.layer, this.id - 1 + 2)).root(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).root(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1) },
            effect(x) {
                var eff = new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(buyableEffect(this.layer, this.id - 1 + 3))
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (a * 7), 2)
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (100 * a ** 2), 2)
                eff = applyLogapolynomialSoftcap(eff, "e25000", 2)
                eff = applyLogapolynomialSoftcap(eff, "e500000", 4)
                return eff.mul(tmp.metaClasses.buyables[12].effect[(this.id - 1) / 10]).mul(tmp.metaClasses.buyables[13].effect[(this.id - 1) / 10]).mul(tmp.metaAspects.effect.globalPowerBoost)
            },
            canAfford() { return player.points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Rage Power"
            },
            display() {
                return "which are boosting your Aspect Point gain by ×" + format(tmp[this.layer].buyables[this.id].effect.sub(1)) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " points"
            },
            buy() {
                if (!hasUpgrade("skaia", 38)) {
                    let nerf = buyableEffect(this.layer, this.id - 1 + 2).div(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).div(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1)
                    let base = new Decimal("ee60")
                    let growth = new Decimal("ee59")
                    let max = player.points.div(base).log(growth).div(nerf).sub(getBuyableAmount(this.layer, this.id)).add(1).max(0).floor()
                    let cost = this.cost(max)
                    if (Number.isNaN(max.mag)) return;
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#520c61", }
                } else {
                    return {}
                }
            }
        },
        62: {
            cost(x) { return new Decimal(1e18).pow(x || getBuyableAmount(this.layer, this.id)).mul(1e140).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(0.4).recip().div(tmp.metaClasses.buyables[16].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[18].effect[(this.id - 2) / 10] || 1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Rage Shards"
            },
            display() {
                return "which are raising the cost of Rage Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(1e140).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1)
                let growth = new Decimal(1e18)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "2")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#520c61", }
                } else {
                    return {}
                }
            }
        },
        63: {
            cost(x) { return new Decimal(1e25).pow(x || getBuyableAmount(this.layer, this.id)).mul(1e160).div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1) },
            effect(x) { return new Decimal(1).add((x || getBuyableAmount(this.layer, this.id).div(2))).pow(0.4).mul(tmp.metaClasses.buyables[20].effect[(this.id - 3) / 10] || 1).mul(tmp.metaClasses.buyables[22].effect[(this.id - 3) / 10] || 1).mul(tmp.metaProspit.buyables[(this.id - 3) / 10 + 10].effect).mul(tmp.metaDerse.buyables[(this.id - 3) / 10 + 10].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Rage Essence"
            },
            display() {
                return "which are raising the effect of Heart Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(1e160).div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1)
                let growth = new Decimal(1e25)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "4")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#520c61", }
                } else {
                    return {}
                }
            }
        },
        71: {
            cost(x) { return new Decimal("ee85").pow(x || getBuyableAmount(this.layer, this.id)).mul("ee85").pow(buyableEffect(this.layer, this.id - 1 + 2)).root(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).root(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1) },
            effect(x) {
                var eff = new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(buyableEffect(this.layer, this.id - 1 + 3))
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (a * 7), 2)
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (100 * a ** 2), 2)
                eff = applyLogapolynomialSoftcap(eff, "e25000", 2)
                eff = applyLogapolynomialSoftcap(eff, "e500000", 4)
                return eff.mul(tmp.metaClasses.buyables[12].effect[(this.id - 1) / 10]).mul(tmp.metaClasses.buyables[13].effect[(this.id - 1) / 10]).mul(tmp.metaAspects.effect.globalPowerBoost)
            },
            canAfford() { return player.points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Light Power"
            },
            display() {
                return "which are boosting your Aspect Point gain by ×" + format(tmp[this.layer].buyables[this.id].effect.sub(1)) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " points"
            },
            buy() {
                if (!hasUpgrade("skaia", 38)) {
                    let nerf = buyableEffect(this.layer, this.id - 1 + 2).div(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).div(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1)
                    let base = new Decimal("ee85")
                    let growth = new Decimal("ee85")
                    let max = player.points.div(base).log(growth).div(nerf).sub(getBuyableAmount(this.layer, this.id)).add(1).max(0).floor()
                    let cost = this.cost(max)
                    if (Number.isNaN(max.mag)) return;
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#f0840c", }
                } else {
                    return {}
                }
            }
        },
        72: {
            cost(x) { return new Decimal(1e20).pow(x || getBuyableAmount(this.layer, this.id)).mul(1e185).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(0.4).recip().div(tmp.metaClasses.buyables[16].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[18].effect[(this.id - 2) / 10] || 1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Light Shards"
            },
            display() {
                return "which are raising the cost of Light Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(1e185).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1)
                let growth = new Decimal(1e20)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "2")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#f0840c", }
                } else {
                    return {}
                }
            }
        },
        73: {
            cost(x) { return new Decimal(1e25).pow(x || getBuyableAmount(this.layer, this.id)).mul(1e215).div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1) },
            effect(x) { return new Decimal(1).add((x || getBuyableAmount(this.layer, this.id).div(2))).pow(0.4).mul(tmp.metaClasses.buyables[20].effect[(this.id - 3) / 10] || 1).mul(tmp.metaClasses.buyables[22].effect[(this.id - 3) / 10] || 1).mul(tmp.metaProspit.buyables[(this.id - 3) / 10 + 10].effect).mul(tmp.metaDerse.buyables[(this.id - 3) / 10 + 10].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Light Essence"
            },
            display() {
                return "which are raising the effect of Light Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(1e215).div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1)
                let growth = new Decimal(1e25)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "4")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#f0840c", }
                } else {
                    return {}
                }
            }
        },
        81: {
            cost(x) { return new Decimal("ee101").pow(x || getBuyableAmount(this.layer, this.id)).mul("ee102").pow(buyableEffect(this.layer, this.id - 1 + 2)).root(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).root(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1) },
            effect(x) {
                var eff = new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(buyableEffect(this.layer, this.id - 1 + 3))
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (a * 7), 2)
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (100 * a ** 2), 2)
                eff = applyLogapolynomialSoftcap(eff, "e25000", 2)
                eff = applyLogapolynomialSoftcap(eff, "e500000", 4)
                return eff.mul(tmp.metaClasses.buyables[12].effect[(this.id - 1) / 10]).mul(tmp.metaClasses.buyables[13].effect[(this.id - 1) / 10]).mul(tmp.metaAspects.effect.globalPowerBoost)
            },
            canAfford() { return player.points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Void Power"
            },
            display() {
                return "which are boosting your Aspect Point gain by ×" + format(tmp[this.layer].buyables[this.id].effect.sub(1)) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " points"
            },
            buy() {
                if (!hasUpgrade("skaia", 38)) {
                    let nerf = buyableEffect(this.layer, this.id - 1 + 2).div(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).div(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1)
                    let base = new Decimal("ee102")
                    let growth = new Decimal("ee101")
                    let max = player.points.div(base).log(growth).div(nerf).sub(getBuyableAmount(this.layer, this.id)).add(1).max(0).floor()
                    let cost = this.cost(max)
                    if (Number.isNaN(max.mag)) return;
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#104ea2", }
                } else {
                    return {}
                }
            }
        },
        82: {
            cost(x) { return new Decimal(1e20).pow(x || getBuyableAmount(this.layer, this.id)).mul(1e210).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(0.4).recip().div(tmp.metaClasses.buyables[16].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[18].effect[(this.id - 2) / 10] || 1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Void Shards"
            },
            display() {
                return "which are raising the cost of Void Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(1e210).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1)
                let growth = new Decimal(1e20)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "2")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#104ea2", }
                } else {
                    return {}
                }
            }
        },
        83: {
            cost(x) { return new Decimal(1e25).pow(x || getBuyableAmount(this.layer, this.id)).mul(1e230).div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1) },
            effect(x) { return new Decimal(1).add((x || getBuyableAmount(this.layer, this.id).div(2))).pow(0.4).mul(tmp.metaClasses.buyables[20].effect[(this.id - 3) / 10] || 1).mul(tmp.metaClasses.buyables[22].effect[(this.id - 3) / 10] || 1).mul(tmp.metaProspit.buyables[(this.id - 3) / 10 + 10].effect).mul(tmp.metaDerse.buyables[(this.id - 3) / 10 + 10].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Void Essence"
            },
            display() {
                return "which are raising the effect of Void Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(1e230).div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1)
                let growth = new Decimal(1e25)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "4")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#104ea2", }
                } else {
                    return {}
                }
            }
        },
        91: {
            cost(x) { return new Decimal("ee128").pow(x || getBuyableAmount(this.layer, this.id)).mul("ee128").pow(buyableEffect(this.layer, this.id - 1 + 2)).root(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).root(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1) },
            effect(x) {
                var eff = new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(buyableEffect(this.layer, this.id - 1 + 3))
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (a * 7), 2)
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (100 * a ** 2), 2)
                eff = applyLogapolynomialSoftcap(eff, "e25000", 2)
                eff = applyLogapolynomialSoftcap(eff, "e500000", 4)
                return eff.mul(tmp.metaClasses.buyables[12].effect[(this.id - 1) / 10]).mul(tmp.metaClasses.buyables[13].effect[(this.id - 1) / 10]).mul(tmp.metaAspects.effect.globalPowerBoost)
            },
            canAfford() { return player.points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Life Power"
            },
            display() {
                return "which are boosting your Aspect Point gain by ×" + format(tmp[this.layer].buyables[this.id].effect.sub(1)) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " points"
            },
            buy() {
                if (!hasUpgrade("skaia", 38)) {
                    let nerf = buyableEffect(this.layer, this.id - 1 + 2).div(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).div(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1)
                    let base = new Decimal("ee128")
                    let growth = new Decimal("ee128")
                    let max = player.points.div(base).log(growth).div(nerf).sub(getBuyableAmount(this.layer, this.id)).add(1).max(0).floor()
                    let cost = this.cost(max)
                    if (Number.isNaN(max.mag)) return;
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#a49787", }
                } else {
                    return {}
                }
            }
        },
        92: {
            cost(x) { return new Decimal(1e24).pow(x || getBuyableAmount(this.layer, this.id)).mul(1e256).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(0.4).recip().div(tmp.metaClasses.buyables[16].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[18].effect[(this.id - 2) / 10] || 1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Life Shards"
            },
            display() {
                return "which are raising the cost of Life Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(1e256).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1)
                let growth = new Decimal(1e24)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "2")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#a49787", }
                } else {
                    return {}
                }
            }
        },
        93: {
            cost(x) { return new Decimal(1e32).pow(x || getBuyableAmount(this.layer, this.id)).mul(1e280).div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1) },
            effect(x) { return new Decimal(1).add((x || getBuyableAmount(this.layer, this.id).div(2))).pow(0.4).mul(tmp.metaClasses.buyables[20].effect[(this.id - 3) / 10] || 1).mul(tmp.metaClasses.buyables[22].effect[(this.id - 3) / 10] || 1).mul(tmp.metaProspit.buyables[(this.id - 3) / 10 + 10].effect).mul(tmp.metaDerse.buyables[(this.id - 3) / 10 + 10].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Life Essence"
            },
            display() {
                return "which are raising the effect of Life Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(1e280).div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1)
                let growth = new Decimal(1e32)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "4")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#a49787", }
                } else {
                    return {}
                }
            }
        },
        101: {
            cost(x) { return new Decimal("ee149").pow(x || getBuyableAmount(this.layer, this.id)).mul("ee150").pow(buyableEffect(this.layer, this.id - 1 + 2)).root(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).root(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1) },
            effect(x) {
                var eff = new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(buyableEffect(this.layer, this.id - 1 + 3))
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (a * 7), 2)
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (100 * a ** 2), 2)
                eff = applyLogapolynomialSoftcap(eff, "e25000", 2)
                eff = applyLogapolynomialSoftcap(eff, "e500000", 4)
                return eff.mul(tmp.metaClasses.buyables[12].effect[(this.id - 1) / 10]).mul(tmp.metaClasses.buyables[13].effect[(this.id - 1) / 10]).mul(tmp.metaAspects.effect.globalPowerBoost)
            },
            canAfford() { return player.points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Doom Power"
            },
            display() {
                return "which are boosting your Aspect Point gain by ×" + format(tmp[this.layer].buyables[this.id].effect.sub(1)) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " points"
            },
            buy() {
                if (!hasUpgrade("skaia", 38)) {
                    let nerf = buyableEffect(this.layer, this.id - 1 + 2).div(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).div(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1)
                    let base = new Decimal("ee150")
                    let growth = new Decimal("ee149")
                    let max = player.points.div(base).log(growth).div(nerf).sub(getBuyableAmount(this.layer, this.id)).add(1).max(0).floor()
                    let cost = this.cost(max)
                    if (Number.isNaN(max.mag)) return;
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#306800", }
                } else {
                    return {}
                }
            }
        },
        102: {
            cost(x) { return new Decimal(1e30).pow(x || getBuyableAmount(this.layer, this.id)).mul(1e300).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(0.4).recip().div(tmp.metaClasses.buyables[16].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[18].effect[(this.id - 2) / 10] || 1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Doom Shards"
            },
            display() {
                return "which are raising the cost of Doom Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal(1e300).div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1)
                let growth = new Decimal(1e30)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "2")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#306800", }
                } else {
                    return {}
                }
            }
        },
        103: {
            cost(x) { return new Decimal(1e35).pow(x || getBuyableAmount(this.layer, this.id)).mul("1e315").div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1) },
            effect(x) { return new Decimal(1).add((x || getBuyableAmount(this.layer, this.id).div(2))).pow(0.4).mul(tmp.metaClasses.buyables[20].effect[(this.id - 3) / 10] || 1).mul(tmp.metaClasses.buyables[22].effect[(this.id - 3) / 10] || 1).mul(tmp.metaProspit.buyables[(this.id - 3) / 10 + 10].effect).mul(tmp.metaDerse.buyables[(this.id - 3) / 10 + 10].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Doom Essence"
            },
            display() {
                return "which are raising the effect of Doom Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal("1e315").div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1)
                let growth = new Decimal(1e35)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "4")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#306800", }
                } else {
                    return {}
                }
            }
        },
        111: {
            cost(x) { return new Decimal("ee172").pow(x || getBuyableAmount(this.layer, this.id)).mul("ee172").pow(buyableEffect(this.layer, this.id - 1 + 2)).root(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).root(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1) },
            effect(x) {
                var eff = new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(buyableEffect(this.layer, this.id - 1 + 3))
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (a * 7), 2)
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (100 * a ** 2), 2)
                eff = applyLogapolynomialSoftcap(eff, "e25000", 2)
                eff = applyLogapolynomialSoftcap(eff, "e500000", 4)
                return eff.mul(tmp.metaClasses.buyables[12].effect[(this.id - 1) / 10]).mul(tmp.metaClasses.buyables[13].effect[(this.id - 1) / 10]).mul(tmp.metaAspects.effect.globalPowerBoost)
            },
            canAfford() { return player.points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Breath Power"
            },
            display() {
                return "which are boosting your Aspect Point gain by ×" + format(tmp[this.layer].buyables[this.id].effect.sub(1)) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " points"
            },
            buy() {
                if (!hasUpgrade("skaia", 38)) {
                    let nerf = buyableEffect(this.layer, this.id - 1 + 2).div(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).div(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1)
                    let base = new Decimal("ee172")
                    let growth = new Decimal("ee172")
                    let max = player.points.div(base).log(growth).div(nerf).sub(getBuyableAmount(this.layer, this.id)).add(1).max(0).floor()
                    let cost = this.cost(max)
                    if (Number.isNaN(max.mag)) return;
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#4379e6", }
                } else {
                    return {}
                }
            }
        },
        112: {
            cost(x) { return new Decimal(1e35).pow(x || getBuyableAmount(this.layer, this.id)).mul("1e350").div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(0.4).recip().div(tmp.metaClasses.buyables[16].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[18].effect[(this.id - 2) / 10] || 1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Breath Shards"
            },
            display() {
                return "which are raising the cost of Breath Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal("1e350").div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1)
                let growth = new Decimal(1e35)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "2")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#4379e6", }
                } else {
                    return {}
                }
            }
        },
        113: {
            cost(x) { return new Decimal(1e40).pow(x || getBuyableAmount(this.layer, this.id)).mul("1e370").div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1) },
            effect(x) { return new Decimal(1).add((x || getBuyableAmount(this.layer, this.id).div(2))).pow(0.4).mul(tmp.metaClasses.buyables[20].effect[(this.id - 3) / 10] || 1).mul(tmp.metaClasses.buyables[22].effect[(this.id - 3) / 10] || 1).mul(tmp.metaProspit.buyables[(this.id - 3) / 10 + 10].effect).mul(tmp.metaDerse.buyables[(this.id - 3) / 10 + 10].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Breath Essence"
            },
            display() {
                return "which are raising the effect of Breath Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal("1e370").div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1)
                let growth = new Decimal(1e40)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "4")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#4379e6", }
                } else {
                    return {}
                }
            }
        },
        121: {
            cost(x) { return new Decimal("ee197").pow(x || getBuyableAmount(this.layer, this.id)).mul("ee198").pow(buyableEffect(this.layer, this.id - 1 + 2)).root(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).root(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1) },
            effect(x) {
                var eff = new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(buyableEffect(this.layer, this.id - 1 + 3))
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (a * 7), 2)
                for (var a = 1; a <= 8; a++) eff = applyPolynomialSoftcap(eff, "e" + (100 * a ** 2), 4 ** (a ** 2))
                eff = applyLogapolynomialSoftcap(eff, "e25000", 2)
                eff = applyLogapolynomialSoftcap(eff, "e500000", 4)
                return eff.mul(tmp.metaClasses.buyables[12].effect[(this.id - 1) / 10]).mul(tmp.metaClasses.buyables[13].effect[(this.id - 1) / 10]).mul(tmp.metaAspects.effect.globalPowerBoost)
            },
            canAfford() { return player.points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Blood Power"
            },
            display() {
                return "which are boosting your Aspect Point gain by ×" + format(tmp[this.layer].buyables[this.id].effect.sub(1)) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " points"
            },
            buy() {
                if (!hasUpgrade("skaia", 38)) {
                    let nerf = buyableEffect(this.layer, this.id - 1 + 2).div(tmp.metaClasses.buyables[11].effect[(this.id - 1) / 10] || 1).div(tmp.metaClasses.buyables[14].effect[(this.id - 1) / 10] || 1)
                    let base = new Decimal("ee198")
                    let growth = new Decimal("ee197")
                    let max = player.points.div(base).log(growth).div(nerf).sub(getBuyableAmount(this.layer, this.id)).add(1).max(0).floor()
                    let cost = this.cost(max)
                    if (Number.isNaN(max.mag)) return;
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                }
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#3e1601", }
                } else {
                    return {}
                }
            }
        },
        122: {
            cost(x) { return new Decimal(1e40).pow(x || getBuyableAmount(this.layer, this.id)).mul("1e400").div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).pow(0.4).recip().div(tmp.metaClasses.buyables[16].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[18].effect[(this.id - 2) / 10] || 1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Blood Shards"
            },
            display() {
                return "which are raising the cost of Blood Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal("1e400").div(tmp.metaClasses.buyables[15].effect[(this.id - 2) / 10] || 1).div(tmp.metaClasses.buyables[17].effect[(this.id - 2) / 10] || 1)
                let growth = new Decimal(1e40)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "2")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#3e1601", }
                } else {
                    return {}
                }
            }
        },
        123: {
            cost(x) { return new Decimal(1e40).pow(x || getBuyableAmount(this.layer, this.id)).mul("1e420").div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1) },
            effect(x) { return new Decimal(1).add((x || getBuyableAmount(this.layer, this.id).div(2))).pow(0.4).mul(tmp.metaClasses.buyables[20].effect[(this.id - 3) / 10] || 1).mul(tmp.metaClasses.buyables[22].effect[(this.id - 3) / 10] || 1).mul(tmp.metaProspit.buyables[(this.id - 3) / 10 + 10].effect).mul(tmp.metaDerse.buyables[(this.id - 3) / 10 + 10].effect) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Blood Essence"
            },
            display() {
                return "which are raising the effect of Blood Power by ^" + format(tmp[this.layer].buyables[this.id].effect) + ".\n\
                    Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " Aspect Points"
            },
            buy() {
                let base = new Decimal("1e420").div(tmp.metaClasses.buyables[19].effect[(this.id - 3) / 10] || 1).div(tmp.metaClasses.buyables[21].effect[(this.id - 3) / 10] || 1)
                let growth = new Decimal(1e40)
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasUpgrade(this.layer, this.id[0] + "4")) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
            },
            style() {
                if (this.canAfford()) {
                    return { "background-color": "#3e1601", }
                } else {
                    return {}
                }
            }
        },
    },

    upgrades: {
        rows: 1,
        cols: 1,
        11: {
            description: "Automatically get Time Power.",
            cost: new Decimal("e10000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#b70d0e", }
                } else {
                    return {}
                }
            }
        },
        12: {
            description: "Getting Time Shards no longer takes your Aspect Points away.",
            cost: new Decimal("e1000000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#b70d0e", }
                } else {
                    return {}
                }
            }
        },
        13: {
            description: "Automatically get Time Shards.",
            cost: new Decimal("e100000000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#b70d0e", }
                } else {
                    return {}
                }
            }
        },
        14: {
            description: "Getting Time Essence no longer takes your Aspect Points away.",
            cost: new Decimal("e10000000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#b70d0e", }
                } else {
                    return {}
                }
            }
        },
        15: {
            description: "Automatically get Time Essence.",
            cost: new Decimal("e1000000000"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#b70d0e", }
                } else {
                    return {}
                }
            }
        },
        21: {
            description: "Automatically get Space Power.",
            cost: new Decimal("ee10"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#000000", "color": "var(--color)" }
                } else {
                    return {}
                }
            }
        },
        22: {
            description: "Getting Space Shards no longer takes your Aspect Points away.",
            cost: new Decimal("ee12"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#000000", "color": "var(--color)" }
                } else {
                    return {}
                }
            }
        },
        23: {
            description: "Automatically get Space Shards.",
            cost: new Decimal("ee16"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#000000", "color": "var(--color)" }
                } else {
                    return {}
                }
            }
        },
        24: {
            description: "Getting Space Essence no longer takes your Aspect Points away.",
            cost: new Decimal("ee14"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#000000", "color": "var(--color)" }
                } else {
                    return {}
                }
            }
        },
        25: {
            description: "Automatically get Space Essence.",
            cost: new Decimal("ee18"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#000000", "color": "var(--color)" }
                } else {
                    return {}
                }
            }
        },
        31: {
            description: "Automatically get Mind Power.",
            cost: new Decimal("ee30"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#00923d", }
                } else {
                    return {}
                }
            }
        },
        32: {
            description: "Getting Mind Shards no longer takes your Aspect Points away.",
            cost: new Decimal("ee34"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#00923d", }
                } else {
                    return {}
                }
            }
        },
        33: {
            description: "Automatically get Mind Shards.",
            cost: new Decimal("ee42"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#00923d", }
                } else {
                    return {}
                }
            }
        },
        34: {
            description: "Getting Mind Essence no longer takes your Aspect Points away.",
            cost: new Decimal("ee38"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#00923d", }
                } else {
                    return {}
                }
            }
        },
        35: {
            description: "Automatically get Mind Essence.",
            cost: new Decimal("ee46"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#00923d", }
                } else {
                    return {}
                }
            }
        },
        41: {
            description: "Automatically get Heart Power.",
            cost: new Decimal("ee50"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#55142a", }
                } else {
                    return {}
                }
            }
        },
        42: {
            description: "Getting Heart Shards no longer takes your Aspect Points away.",
            cost: new Decimal("ee56"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#55142a", }
                } else {
                    return {}
                }
            }
        },
        43: {
            description: "Automatically get Heart Shards.",
            cost: new Decimal("ee68"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#55142a", }
                } else {
                    return {}
                }
            }
        },
        44: {
            description: "Getting Heart Essence no longer takes your Aspect Points away.",
            cost: new Decimal("ee62"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#55142a", }
                } else {
                    return {}
                }
            }
        },
        45: {
            description: "Automatically get Heart Essence.",
            cost: new Decimal("ee70"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#55142a", }
                } else {
                    return {}
                }
            }
        },
        51: {
            description: "Automatically get Hope Power.",
            cost: new Decimal("ee64"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#ffde55", }
                } else {
                    return {}
                }
            }
        },
        52: {
            description: "Getting Hope Shards no longer takes your Aspect Points away.",
            cost: new Decimal("ee72"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#ffde55", }
                } else {
                    return {}
                }
            }
        },
        53: {
            description: "Automatically get Hope Shards.",
            cost: new Decimal("ee88"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#ffde55", }
                } else {
                    return {}
                }
            }
        },
        54: {
            description: "Getting Hope Essence no longer takes your Aspect Points away.",
            cost: new Decimal("ee80"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#ffde55", }
                } else {
                    return {}
                }
            }
        },
        55: {
            description: "Automatically get Hope Essence.",
            cost: new Decimal("ee96"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#ffde55", }
                } else {
                    return {}
                }
            }
        },
        61: {
            description: "Automatically get Rage Power.",
            cost: new Decimal("ee80"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#520c61", }
                } else {
                    return {}
                }
            }
        },
        62: {
            description: "Getting Rage Shards no longer takes your Aspect Points away.",
            cost: new Decimal("ee90"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#520c61", }
                } else {
                    return {}
                }
            }
        },
        63: {
            description: "Automatically get Rage Shards.",
            cost: new Decimal("ee110"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#520c61", }
                } else {
                    return {}
                }
            }
        },
        64: {
            description: "Getting Rage Essence no longer takes your Aspect Points away.",
            cost: new Decimal("ee100"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#520c61", }
                } else {
                    return {}
                }
            }
        },
        65: {
            description: "Automatically get Rage Essence.",
            cost: new Decimal("ee120"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#520c61", }
                } else {
                    return {}
                }
            }
        },
        71: {
            description: "Automatically get Light Power.",
            cost: new Decimal("ee100"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#f0840c", }
                } else {
                    return {}
                }
            }
        },
        72: {
            description: "Getting Light Shards no longer takes your Aspect Points away.",
            cost: new Decimal("ee112"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#f0840c", }
                } else {
                    return {}
                }
            }
        },
        73: {
            description: "Automatically get Light Shards.",
            cost: new Decimal("ee136"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#f0840c", }
                } else {
                    return {}
                }
            }
        },
        74: {
            description: "Getting Light Essence no longer takes your Aspect Points away.",
            cost: new Decimal("ee124"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#f0840c", }
                } else {
                    return {}
                }
            }
        },
        75: {
            description: "Automatically get Light Essence.",
            cost: new Decimal("ee148"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#f0840c", }
                } else {
                    return {}
                }
            }
        },
        81: {
            description: "Automatically get Void Power.",
            cost: new Decimal("ee125"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#104ea2", }
                } else {
                    return {}
                }
            }
        },
        82: {
            description: "Getting Void Shards no longer takes your Aspect Points away.",
            cost: new Decimal("ee140"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#104ea2", }
                } else {
                    return {}
                }
            }
        },
        83: {
            description: "Automatically get Void Shards.",
            cost: new Decimal("ee170"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#104ea2", }
                } else {
                    return {}
                }
            }
        },
        84: {
            description: "Getting Void Essence no longer takes your Aspect Points away.",
            cost: new Decimal("ee155"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#104ea2", }
                } else {
                    return {}
                }
            }
        },
        85: {
            description: "Automatically get Void Essence.",
            cost: new Decimal("ee195"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#104ea2", }
                } else {
                    return {}
                }
            }
        },
        91: {
            description: "Automatically get Life Power.",
            cost: new Decimal("ee140"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#a49787", }
                } else {
                    return {}
                }
            }
        },
        92: {
            description: "Getting Life Shards no longer takes your Aspect Points away.",
            cost: new Decimal("ee158"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#a49787", }
                } else {
                    return {}
                }
            }
        },
        93: {
            description: "Automatically get Life Shards.",
            cost: new Decimal("ee194"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#a49787", }
                } else {
                    return {}
                }
            }
        },
        94: {
            description: "Getting Life Essence no longer takes your Aspect Points away.",
            cost: new Decimal("ee176"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#a49787", }
                } else {
                    return {}
                }
            }
        },
        95: {
            description: "Automatically get Life Essence.",
            cost: new Decimal("ee212"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#a49787", }
                } else {
                    return {}
                }
            }
        },
        101: {
            description: "Automatically get Doom Power.",
            cost: new Decimal("ee170"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#306800", }
                } else {
                    return {}
                }
            }
        },
        102: {
            description: "Getting Doom Shards no longer takes your Aspect Points away.",
            cost: new Decimal("ee191"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#306800", }
                } else {
                    return {}
                }
            }
        },
        103: {
            description: "Automatically get Doom Shards.",
            cost: new Decimal("ee233"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#306800", }
                } else {
                    return {}
                }
            }
        },
        104: {
            description: "Getting Doom Essence no longer takes your Aspect Points away.",
            cost: new Decimal("ee212"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#306800", }
                } else {
                    return {}
                }
            }
        },
        105: {
            description: "Automatically get Doom Essence.",
            cost: new Decimal("ee254"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#306800", }
                } else {
                    return {}
                }
            }
        },
        111: {
            description: "Automatically get Breath Power.",
            cost: new Decimal("ee185"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#4379e6", }
                } else {
                    return {}
                }
            }
        },
        112: {
            description: "Getting Breath Shards no longer takes your Aspect Points away.",
            cost: new Decimal("ee209"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#4379e6", }
                } else {
                    return {}
                }
            }
        },
        113: {
            description: "Automatically get Breath Shards.",
            cost: new Decimal("ee257"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#4379e6", }
                } else {
                    return {}
                }
            }
        },
        114: {
            description: "Getting Breath Essence no longer takes your Aspect Points away.",
            cost: new Decimal("ee233"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#4379e6", }
                } else {
                    return {}
                }
            }
        },
        115: {
            description: "Automatically get Breath Essence.",
            cost: new Decimal("ee281"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#4379e6", }
                } else {
                    return {}
                }
            }
        },
        121: {
            description: "Automatically get Blood Power.",
            cost: new Decimal("ee210"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#3e1601", }
                } else {
                    return {}
                }
            }
        },
        122: {
            description: "Getting Blood Shards no longer takes your Aspect Points away.",
            cost: new Decimal("ee237"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#3e1601", }
                } else {
                    return {}
                }
            }
        },
        123: {
            description: "Automatically get Blood Shards.",
            cost: new Decimal("ee291"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#3e1601", }
                } else {
                    return {}
                }
            }
        },
        124: {
            description: "Getting Blood Essence no longer takes your Aspect Points away.",
            cost: new Decimal("ee264"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#3e1601", }
                } else {
                    return {}
                }
            }
        },
        125: {
            description: "Automatically get Blood Essence.",
            cost: new Decimal("ee318"),
            currencyLocation() { return player },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            unlocked() { return true },
            style() {
                if (player.points.gte(this.cost) && !hasUpgrade(this.layer, this.id)) {
                    return { "background-color": "#3e1601", }
                } else {
                    return {}
                }
            }
        },
    },

    microtabs: {
        stuff: {
            "Aspects": {
                content: [
                    ["blank", "15px"],
                    ["display-text", "<h5 style='opacity:0.5'>Note: Autobuyers only fire once per second due to performance issues.</h5>"],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#b70d0e;width:600px">
                            <h3><img src="data/time.png" style="height:24px;width:24px;transform:translateY(5px)" /> Time</h3>
                        </div>
                    `],
                    ["row", [["buyable", 11], ["buyable", 12], ["buyable", 13]]],
                    ["row", [["upgrade", 11], ["upgrade", 12], ["upgrade", 13], ["upgrade", 14], ["upgrade", 15]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#000000;width:600px">
                            <h3><img src="data/space.png" style="height:24px;width:24px;transform:translateY(5px)" /> Space</h3>
                        </div>
                    `],
                    ["row", [["buyable", 21], ["buyable", 22], ["buyable", 23]]],
                    ["row", [["upgrade", 21], ["upgrade", 22], ["upgrade", 23], ["upgrade", 24], ["upgrade", 25]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#00923d;width:600px">
                            <h3><img src="data/mind.png" style="height:24px;width:24px;transform:translateY(5px)" /> Mind</h3>
                        </div>
                    `],
                    ["row", [["buyable", 31], ["buyable", 32], ["buyable", 33]]],
                    ["row", [["upgrade", 31], ["upgrade", 32], ["upgrade", 33], ["upgrade", 34], ["upgrade", 35]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#55142a;width:600px">
                            <h3><img src="data/heart.png" style="height:24px;width:24px;transform:translateY(5px)" /> Heart</h3>
                        </div>
                    `],
                    ["row", [["buyable", 41], ["buyable", 42], ["buyable", 43]]],
                    ["row", [["upgrade", 41], ["upgrade", 42], ["upgrade", 43], ["upgrade", 44], ["upgrade", 45]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#ffde55;color:black;width:600px">
                            <h3><img src="data/hope.png" style="height:24px;width:24px;transform:translateY(5px)" /> Hope</h3>
                        </div>
                    `],
                    ["row", [["buyable", 51], ["buyable", 52], ["buyable", 53]]],
                    ["row", [["upgrade", 51], ["upgrade", 52], ["upgrade", 53], ["upgrade", 54], ["upgrade", 55]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#520c61;width:600px">
                            <h3><img src="data/rage.png" style="height:24px;width:24px;transform:translateY(5px)" /> Rage</h3>
                        </div>
                    `],
                    ["row", [["buyable", 61], ["buyable", 62], ["buyable", 63]]],
                    ["row", [["upgrade", 61], ["upgrade", 62], ["upgrade", 63], ["upgrade", 64], ["upgrade", 65]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#f0840c;color:black;width:600px">
                            <h3><img src="data/light.png" style="height:24px;width:24px;transform:translateY(5px)" /> Light</h3>
                        </div>
                    `],
                    ["row", [["buyable", 71], ["buyable", 72], ["buyable", 73]]],
                    ["row", [["upgrade", 71], ["upgrade", 72], ["upgrade", 73], ["upgrade", 74], ["upgrade", 75]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#104ea2;width:600px">
                            <h3><img src="data/void.png" style="height:24px;width:24px;transform:translateY(5px)" /> Void</h3>
                        </div>
                    `],
                    ["row", [["buyable", 81], ["buyable", 82], ["buyable", 83]]],
                    ["row", [["upgrade", 81], ["upgrade", 82], ["upgrade", 83], ["upgrade", 84], ["upgrade", 85]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#a49787;color:black;width:600px">
                            <h3><img src="data/life.png" style="height:24px;width:24px;transform:translateY(5px)" /> Life</h3>
                        </div>
                    `],
                    ["row", [["buyable", 91], ["buyable", 92], ["buyable", 93]]],
                    ["row", [["upgrade", 91], ["upgrade", 92], ["upgrade", 93], ["upgrade", 94], ["upgrade", 95]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#306800;width:600px">
                            <h3><img src="data/doom.png" style="height:24px;width:24px;transform:translateY(5px)" /> Doom</h3>
                        </div>
                    `],
                    ["row", [["buyable", 101], ["buyable", 102], ["buyable", 103]]],
                    ["row", [["upgrade", 101], ["upgrade", 102], ["upgrade", 103], ["upgrade", 104], ["upgrade", 105]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#4379e6;color:black;width:600px">
                            <h3><img src="data/breath.png" style="height:24px;width:24px;transform:translateY(5px)" /> Breath</h3>
                        </div>
                    `],
                    ["row", [["buyable", 111], ["buyable", 112], ["buyable", 113]]],
                    ["row", [["upgrade", 111], ["upgrade", 112], ["upgrade", 113], ["upgrade", 114], ["upgrade", 115]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#3e1601;width:600px">
                            <h3><img src="data/blood.png" style="height:24px;width:24px;transform:translateY(5px)" /> Blood</h3>
                        </div>
                    `],
                    ["row", [["buyable", 121], ["buyable", 122], ["buyable", 123]]],
                    ["row", [["upgrade", 121], ["upgrade", 122], ["upgrade", 123], ["upgrade", 124], ["upgrade", 125]]],
                    ["blank", "15px"],
                ]
            },
        },
    },

    update(delta) {
        if (hasUpgrade("skaia", 12)) player.metaAspects.points = player.metaAspects.points.add(tmp.metaAspects.effect.selfGain.mul(delta))

        player[this.layer].autoBuyerTime += delta
        if (player[this.layer].autoBuyerTime >= 1) {
            for (var a = 1; a <= 12; a++) {
                if (hasUpgrade("metaAspects", a * 10 + 1)) buyBuyable("metaAspects", a * 10 + 1)
                if (hasUpgrade("metaAspects", a * 10 + 3)) buyBuyable("metaAspects", a * 10 + 2)
                if (hasUpgrade("metaAspects", a * 10 + 5)) buyBuyable("metaAspects", a * 10 + 3)
            }
            player[this.layer].autoBuyerTime = 0
        }
        if (hasUpgrade("skaia", 38)) {
            for (var a = 1; a <= 12; a++) {
                var mult = tmp.metaClasses.buyables[11].effect[a].mul(tmp.metaClasses.buyables[14].effect[a]).div(tmp.metaAspects.buyables[a * 10 + 2].effect)
                player.metaAspects.buyables[a * 10 + 1] = player.metaAspects.buyables[a * 10 + 1].add(player.metaAspects.points.pow(0.512).mul(mult).mul(delta))
            }
        }
        var uniBonus = (hasUpgrade("skaia", 42) ? upgradeEffect("skaia", 42) : new Decimal(1)).mul(hasUpgrade("skaia", 62) ? upgradeEffect("skaia", 62) : new Decimal(1))
        var uniScale = hasUpgrade("skaia", 46) ? 4 : 0
        var skaia48eff = hasUpgrade("skaia", 48) ? 4 : 1
        if (hasUpgrade("skaia", 39)) {
            for (var a = 1; a <= 12; a++) {
                var bonus = tmp.metaClasses.buyables[15].effect[a].log(10).add(tmp.metaClasses.buyables[17].effect[a].log("e100"))
                player.metaAspects.buyables[a * 10 + 2] = player.metaAspects.buyables[a * 10 + 2].max(player.metaAspects.points.log(10 - uniScale).div((a + 1) / 2).add(bonus).mul(uniBonus).mul(a == 1 && hasUpgrade("skaia", 54) ? 2 : 1))
            }
        }
        if (hasUpgrade("skaia", 40)) {
            for (var a = 1; a <= 12; a++) {
                var bonus = tmp.metaClasses.buyables[19].effect[a].log("e100").add(tmp.metaClasses.buyables[21].effect[a].log("e100")).mul(skaia48eff)
                player.metaAspects.buyables[a * 10 + 3] = player.metaAspects.buyables[a * 10 + 3].max(player.metaAspects.points.log(8 - uniScale).div((a + 1) / 2).add(bonus).mul(uniBonus).mul(a == 1 && hasUpgrade("skaia", 54) ? 2 : 1))
            }
        }
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        ["blank", "25px"],
        ["display-text", () => "You are getting " + format(tmp.metaAspects.effect.selfGain) + " Aspect Points per second."],
        ["blank", "25px"],
        ["microtabs", "stuff"],
        ["blank", "35px"],
    ],
})