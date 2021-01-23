addLayer("metaClasses", {
    name: "Classes",
    symbol: "<h3 style='color:#cfc4ff;font-size:40px'>C</h3>",
    row: 8,
    position: 1,

    layerShown() { return hasUpgrade("skaia", 31) },
    resource: "Class Points",
    color: "#020d65",
    type: "none",

    startData() {
        return {
            unlocked: true,
            points: new Decimal(1),
        }
    },
    effect() {
        var eff = {}
        eff.pointGain = player.points.max(1).log(10).max(1).log(10).mul(player[this.layer].buyables[11])
        for (var a = 12; a <= 22; a++) eff.pointGain = eff.pointGain.mul(player[this.layer].buyables[a].add(1))
        for (var a = 23; a <= 24; a++) eff.pointGain = eff.pointGain.mul(player[this.layer].buyables[a].add(1).pow(4))
        if (hasUpgrade("skaia", 32)) eff.pointGain = eff.pointGain.mul(tmp.skaia.upgrades[32].effect)
        if (hasUpgrade("skaia", 33)) eff.pointGain = eff.pointGain.mul(tmp.skaia.upgrades[33].effect)
        if (hasUpgrade("skaia", 34)) eff.pointGain = eff.pointGain.mul(tmp.skaia.upgrades[34].effect)
        eff.pointGain = applyPolynomialSoftcap(eff.pointGain, "e100", 2)
        return eff
    },

    buyables: {
        rows: 1,
        cols: 4,
        11: {
            cost(x) { return (x || getBuyableAmount(this.layer, this.id)).mul(90000).pow((x || getBuyableAmount(this.layer, this.id))) },
            effect(x) {
                var eff = {}
                var amt = applyPolynomialSoftcap(getBuyableAmount(this.layer, this.id), 6, 2)
                for (var a = 1; a <= 12; a++) {
                    eff[a] = new Decimal(1)
                    for (var b = 1; b <= 12; b++) if (a != b) {
                        eff[a] = eff[a].add(player.metaAspects.buyables[b * 10 + 1].add(1).log(10))
                    }
                    eff[a] = eff[a].pow(amt).pow(tmp.metaClasses.buyables[23].effect[this.id])
                }
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "<h5>Passive</h5>Rogue Power"
            },
            display() {
                var ret = "which are decreasing all Aspect Powers costs based on other Aspect Powers that's not themselves.<br/><br/><h3>Current effects:</h3>"
                var asps = ["Time", "Space", "Mind", "Heart", "Hope", "Rage", "Light", "Void", "Life", "Doom", "Breath", "Blood"]
                for (var a = 1; a <= 12; a++) {
                    ret += "<br/>" + asps[a - 1] + ": " + format(tmp[this.layer].buyables[this.id].effect[a]) + "√"
                }
                return ret + "<br/><br/><h3>Level " + format(player[this.layer].buyables[this.id], 0) + "</h3><br/>Cost: " + format(this.cost()) + " Class Points"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                if (this.canAfford()) {
                    return { "height": "320px", "color": "white" }
                } else {
                    return { "height": "320px" }
                }
            }
        },
        12: {
            cost(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).mul(200000).pow((x || getBuyableAmount(this.layer, this.id)).add(1)) },
            effect(x) {
                var eff = {}
                var amt = applyPolynomialSoftcap(getBuyableAmount(this.layer, this.id), 6, 2)
                for (var a = 1; a <= 12; a++) {
                    eff[a] = new Decimal(1)
                    for (var b = 1; b <= 12; b++) if (a != b) {
                        eff[a] = eff[a].add(player.metaAspects.buyables[b * 10 + 1].add(1).log(10 + a))
                    }
                    eff[a] = eff[a].pow(amt).pow(tmp.metaClasses.buyables[24].effect[this.id])
                }
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "<h5>Active</h5>Thief Power"
            },
            display() {
                var ret = "which are boosting all Aspect Powers effects based on other Aspect Powers that's not themselves, after the softcaps.<br/><br/><h3>Current effects:</h3>"
                var asps = ["Time", "Space", "Mind", "Heart", "Hope", "Rage", "Light", "Void", "Life", "Doom", "Breath", "Blood"]
                for (var a = 1; a <= 12; a++) {
                    ret += "<br/>" + asps[a - 1] + ": ×" + format(tmp[this.layer].buyables[this.id].effect[a])
                }
                return ret + "<br/><br/><h3>Level " + format(player[this.layer].buyables[this.id], 0) + "</h3><br/>Cost: " + format(this.cost()) + " Class Points"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                if (this.canAfford()) {
                    return { "height": "320px", "color": "white" }
                } else {
                    return { "height": "320px" }
                }
            }
        },
        13: {
            cost(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).mul(800000).pow((x || getBuyableAmount(this.layer, this.id)).add(1)) },
            effect(x) {
                var eff = {}
                var amt = applyPolynomialSoftcap(getBuyableAmount(this.layer, this.id), 6, 2)
                for (var a = 1; a <= 12; a++) {
                    eff[a] = new Decimal(1)
                    eff[a] = eff[a].add(player.metaAspects.buyables[a * 10 + 1].add(1).log(2 - a / 20))
                    eff[a] = eff[a].pow(1.25).pow(amt).pow(tmp.metaClasses.buyables[24].effect[this.id])
                }
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "<h5>Active</h5>Heir Power"
            },
            display() {
                var ret = "which are boosting all Aspect Powers effects based on themselves, after the softcaps.<br/><br/><h3>Current effects:</h3>"
                var asps = ["Time", "Space", "Mind", "Heart", "Hope", "Rage", "Light", "Void", "Life", "Doom", "Breath", "Blood"]
                for (var a = 1; a <= 12; a++) {
                    ret += "<br/>" + asps[a - 1] + ": ×" + format(tmp[this.layer].buyables[this.id].effect[a])
                }
                return ret + "<br/><br/><h3>Level " + format(player[this.layer].buyables[this.id], 0) + "</h3><br/>Cost: " + format(this.cost()) + " Class Points"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                if (this.canAfford()) {
                    return { "height": "320px", "color": "white" }
                } else {
                    return { "height": "320px" }
                }
            }
        },
        14: {
            cost(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).mul(450000000).pow((x || getBuyableAmount(this.layer, this.id)).add(1)) },
            effect(x) {
                var eff = {}
                var amt = applyPolynomialSoftcap(getBuyableAmount(this.layer, this.id), 6, 2)
                for (var a = 1; a <= 12; a++) {
                    eff[a] = new Decimal(1)
                    eff[a] = eff[a].add(player.metaAspects.buyables[a * 10 + 1].add(1).log(1.2 - a / 120))
                    eff[a] = eff[a].pow(2).pow(amt).pow(tmp.metaClasses.buyables[23].effect[this.id])
                }
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "<h5>Passive</h5>Maid Power"
            },
            display() {
                var ret = "which are decreasing all Aspect Powers costs based on themselves.<br/><br/><h3>Current effects:</h3>"
                var asps = ["Time", "Space", "Mind", "Heart", "Hope", "Rage", "Light", "Void", "Life", "Doom", "Breath", "Blood"]
                for (var a = 1; a <= 12; a++) {
                    ret += "<br/>" + asps[a - 1] + ": " + format(tmp[this.layer].buyables[this.id].effect[a]) + "√"
                }
                return ret + "<br/><br/><h3>Level " + format(player[this.layer].buyables[this.id], 0) + "</h3><br/>Cost: " + format(this.cost()) + " Class Points"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                if (this.canAfford()) {
                    return { "height": "320px", "color": "white" }
                } else {
                    return { "height": "320px" }
                }
            }
        },
        15: {
            cost(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).mul(750000000).pow((x || getBuyableAmount(this.layer, this.id)).add(1)) },
            effect(x) {
                var eff = {}
                var amt = applyPolynomialSoftcap(getBuyableAmount(this.layer, this.id), 6, 2)
                for (var a = 1; a <= 12; a++) {
                    eff[a] = new Decimal(1)
                    for (var b = 1; b <= 12; b++) if (a != b) {
                        eff[a] = eff[a].add(player.metaAspects.buyables[b * 10 + 2].add(1))
                    }
                    eff[a] = eff[a].pow(10 + a).pow(amt).pow(tmp.metaClasses.buyables[23].effect[this.id])
                }
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "<h5>Passive</h5>Page Power"
            },
            display() {
                var ret = "which are decreasing all Aspect Shards costs based on other Aspect Shards that's not themselves.<br/><br/><h3>Current effects:</h3>"
                var asps = ["Time", "Space", "Mind", "Heart", "Hope", "Rage", "Light", "Void", "Life", "Doom", "Breath", "Blood"]
                for (var a = 1; a <= 12; a++) {
                    ret += "<br/>" + asps[a - 1] + ": ÷" + format(tmp[this.layer].buyables[this.id].effect[a])
                }
                return ret + "<br/><br/><h3>Level " + format(player[this.layer].buyables[this.id], 0) + "</h3><br/>Cost: " + format(this.cost()) + " Class Points"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                if (this.canAfford()) {
                    return { "height": "320px", "color": "white" }
                } else {
                    return { "height": "320px" }
                }
            }
        },
        16: {
            cost(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).mul(1.2e9).pow((x || getBuyableAmount(this.layer, this.id)).add(1)) },
            effect(x) {
                var eff = {}
                var amt = applyPolynomialSoftcap(getBuyableAmount(this.layer, this.id), 6, 2)
                for (var a = 1; a <= 12; a++) {
                    eff[a] = new Decimal(1)
                    eff[a] = eff[a].add(player.metaAspects.buyables[a * 10 + 2]).pow(10)
                    eff[a] = eff[a].pow(1 + a / 3).pow(0.5).pow(amt).pow(tmp.metaClasses.buyables[24].effect[this.id])
                }
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "<h5>Active</h5>Knight Power"
            },
            display() {
                var ret = "which are boosting all Aspect Shards effects based on themselves.<br/><br/><h3>Current effects:</h3>"
                var asps = ["Time", "Space", "Mind", "Heart", "Hope", "Rage", "Light", "Void", "Life", "Doom", "Breath", "Blood"]
                for (var a = 1; a <= 12; a++) {
                    ret += "<br/>" + asps[a - 1] + ": ÷" + format(tmp[this.layer].buyables[this.id].effect[a])
                }
                return ret + "<br/><br/><h3>Level " + format(player[this.layer].buyables[this.id], 0) + "</h3><br/>Cost: " + format(this.cost()) + " Class Points"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                if (this.canAfford()) {
                    return { "height": "320px", "color": "white" }
                } else {
                    return { "height": "320px" }
                }
            }
        },
        17: {
            cost(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).mul(1e16).pow((x || getBuyableAmount(this.layer, this.id)).add(1)) },
            effect(x) {
                var eff = {}
                var amt = applyPolynomialSoftcap(getBuyableAmount(this.layer, this.id), 6, 2)
                for (var a = 1; a <= 12; a++) {
                    eff[a] = new Decimal(1)
                    for (var b = 1; b <= 12; b++) {
                        eff[a] = eff[a].mul(player.metaAspects.buyables[b * 10 + 1].pow(0.01).pow(a == b ? 3 : 1).add(1))
                    }
                    eff[a] = eff[a].pow(1 + a / 3).pow(amt).pow(tmp.metaClasses.buyables[23].effect[this.id])
                }
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "<h5>Passive</h5>Seer Power"
            },
            display() {
                var ret = "which are decreasing all Aspect Shards costs based on all Aspect Powers, with their own being thrice as effective.<br/><br/><h3>Current effects:</h3>"
                var asps = ["Time", "Space", "Mind", "Heart", "Hope", "Rage", "Light", "Void", "Life", "Doom", "Breath", "Blood"]
                for (var a = 1; a <= 12; a++) {
                    ret += "<br/>" + asps[a - 1] + ": ÷" + format(tmp[this.layer].buyables[this.id].effect[a])
                }
                return ret + "<br/><br/><h3>Level " + format(player[this.layer].buyables[this.id], 0) + "</h3><br/>Cost: " + format(this.cost()) + " Class Points"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                if (this.canAfford()) {
                    return { "height": "320px", "color": "white" }
                } else {
                    return { "height": "320px" }
                }
            }
        },
        18: {
            cost(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).mul(3.14e16).pow((x || getBuyableAmount(this.layer, this.id)).add(1)) },
            effect(x) {
                var eff = {}
                var amt = applyPolynomialSoftcap(getBuyableAmount(this.layer, this.id), 6, 2)
                for (var a = 1; a <= 12; a++) {
                    eff[a] = new Decimal(1)
                    for (var b = 1; b <= 12; b++) {
                        eff[a] = eff[a].mul(player.metaAspects.buyables[b * 10 + 1].pow(0.001).pow(a == b ? 0.5 : 1).add(1))
                    }
                    eff[a] = eff[a].pow(2 + a / 80).pow(amt).pow(tmp.metaClasses.buyables[24].effect[this.id])
                }
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "<h5>Active</h5>Mage Power"
            },
            display() {
                var ret = "which are boosting all Aspect Shards effects based on all Aspect Powers, but their own aspect is only as half as effective.<br/><br/><h3>Current effects:</h3>"
                var asps = ["Time", "Space", "Mind", "Heart", "Hope", "Rage", "Light", "Void", "Life", "Doom", "Breath", "Blood"]
                for (var a = 1; a <= 12; a++) {
                    ret += "<br/>" + asps[a - 1] + ": ÷" + format(tmp[this.layer].buyables[this.id].effect[a])
                }
                return ret + "<br/><br/><h3>Level " + format(player[this.layer].buyables[this.id], 0) + "</h3><br/>Cost: " + format(this.cost()) + " Class Points"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                if (this.canAfford()) {
                    return { "height": "320px", "color": "white" }
                } else {
                    return { "height": "320px" }
                }
            }
        },
        19: {
            cost(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).mul(6.12e16).pow((x || getBuyableAmount(this.layer, this.id)).add(1)) },
            effect(x) {
                var eff = {}
                var amt = applyPolynomialSoftcap(getBuyableAmount(this.layer, this.id), 6, 2)
                for (var a = 1; a <= 12; a++) {
                    eff[a] = new Decimal(1)
                    for (var b = 1; b <= 12; b++) {
                        eff[a] = eff[a].mul(player.metaAspects.buyables[b * 10 + 1].pow(0.0035).add(1))
                        if (a == b) eff[a] = eff[a].mul(player.metaAspects.buyables[b * 10 + 2].pow(2).add(1))
                    }
                    eff[a] = eff[a].pow(2 + a / 80).pow(amt).pow(tmp.metaClasses.buyables[23].effect[this.id])
                }
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "<h5>Passive</h5>Slyph Power"
            },
            display() {
                var ret = "which are decreasing all Aspect Essence costs based on all Aspect Powers, with their own aspect also gets a bonus based on its Aspect Shards.<br/><br/><h3>Current effects:</h3>"
                var asps = ["Time", "Space", "Mind", "Heart", "Hope", "Rage", "Light", "Void", "Life", "Doom", "Breath", "Blood"]
                for (var a = 1; a <= 12; a++) {
                    ret += "<br/>" + asps[a - 1] + ": ÷" + format(tmp[this.layer].buyables[this.id].effect[a])
                }
                return ret + "<br/><br/><h3>Level " + format(player[this.layer].buyables[this.id], 0) + "</h3><br/>Cost: " + format(this.cost()) + " Class Points"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                if (this.canAfford()) {
                    return { "height": "320px", "color": "white" }
                } else {
                    return { "height": "320px" }
                }
            }
        },
        20: {
            cost(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).mul(1e22).pow((x || getBuyableAmount(this.layer, this.id)).add(1)) },
            effect(x) {
                var eff = {}
                var amt = applyPolynomialSoftcap(getBuyableAmount(this.layer, this.id), 6, 2)
                for (var a = 1; a <= 12; a++) {
                    eff[a] = new Decimal(0)
                    for (var b = 1; b <= 12; b++) {
                        eff[a] = eff[a].add(player.metaAspects.buyables[b * 10 + 2].div(10000))
                        if (a == b) eff[a] = eff[a].add(player.metaAspects.buyables[b * 10 + 1].add(1).log(10).div(1000))
                    }
                    eff[a] = applyPolynomialSoftcap(eff[a].pow(2 + a / 80).mul(amt).add(1), 6, 2)
                    eff[a] = applyPolynomialSoftcap(eff[a], 12, 2)
                    eff[a] = applyPolynomialSoftcap(eff[a], 15, 15)
                    eff[a] = applyPolynomialSoftcap(eff[a], 18, 80)
                    eff[a] = applyPolynomialSoftcap(eff[a], 20, 500).pow(tmp.metaClasses.buyables[24].effect[this.id])
                }
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "<h5>Active</h5>Witch Power"
            },
            display() {
                var ret = "which are boosting all Aspect Essence effects based on all Aspect Shards, with their own aspect also gets a bonus based on its Aspect Power.<br/><br/><h3>Current effects:</h3>"
                var asps = ["Time", "Space", "Mind", "Heart", "Hope", "Rage", "Light", "Void", "Life", "Doom", "Breath", "Blood"]
                for (var a = 1; a <= 12; a++) {
                    ret += "<br/>" + asps[a - 1] + ": ×" + format(tmp[this.layer].buyables[this.id].effect[a])
                }
                return ret + "<br/><br/><h3>Level " + format(player[this.layer].buyables[this.id], 0) + "</h3><br/>Cost: " + format(this.cost()) + " Class Points"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                if (this.canAfford()) {
                    return { "height": "320px", "color": "white" }
                } else {
                    return { "height": "320px" }
                }
            }
        },
        21: {
            cost(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).mul(1e23).pow((x || getBuyableAmount(this.layer, this.id)).add(1)) },
            effect(x) {
                var eff = {}
                var amt = applyPolynomialSoftcap(getBuyableAmount(this.layer, this.id), 6, 2)
                for (var a = 1; a <= 12; a++) {
                    eff[a] = new Decimal(1)
                    eff[a] = eff[a].add(player.metaAspects.buyables[a * 10 + 1].pow(0.05))
                    eff[a] = eff[a].pow(Math.sin(player.timePlayed / 100 * (4.9 + a / 10) + a) + 2).pow(amt).pow(tmp.metaClasses.buyables[23].effect[this.id])
                }
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "<h5>Passive</h5>Bard Power"
            },
            display() {
                var ret = "which are decrasing all Aspect Essence costs based on their own Aspect Power, but the effect fluctuates over time.<br/><br/><h3>Current effects:</h3>"
                var asps = ["Time", "Space", "Mind", "Heart", "Hope", "Rage", "Light", "Void", "Life", "Doom", "Breath", "Blood"]
                for (var a = 1; a <= 12; a++) {
                    ret += "<br/>" + asps[a - 1] + ": ÷" + format(tmp[this.layer].buyables[this.id].effect[a])
                }
                return ret + "<br/><br/><h3>Level " + format(player[this.layer].buyables[this.id], 0) + "</h3><br/>Cost: " + format(this.cost()) + " Class Points"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                if (this.canAfford()) {
                    return { "height": "320px", "color": "white" }
                } else {
                    return { "height": "320px" }
                }
            }
        },
        22: {
            cost(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).mul(2.16e26).pow((x || getBuyableAmount(this.layer, this.id)).add(1)) },
            effect(x) {
                var eff = {}
                var amt = applyPolynomialSoftcap(getBuyableAmount(this.layer, this.id), 6, 2)
                for (var a = 1; a <= 12; a++) {
                    eff[a] = player.metaAspects.buyables[(2 * Math.floor((a + 1) / 2) - ((a + 1) % 2)) * 10 + 3].add(1).log(1000000)
                    eff[a] = eff[a].mul(amt).add(1)
                    eff[a] = applyPolynomialSoftcap(eff[a], 2, 2)
                    eff[a] = applyPolynomialSoftcap(eff[a], 3, 2)
                    eff[a] = applyPolynomialSoftcap(eff[a], 4, 15)
                    eff[a] = applyPolynomialSoftcap(eff[a], 6, 80)
                    eff[a] = applyPolynomialSoftcap(eff[a], 8, 500).pow(tmp.metaClasses.buyables[24].effect[this.id])
                }
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "<h5>Active</h5>Prince Power"
            },
            display() {
                var ret = "which are boosting all Aspect Essence effects based on the Aspect Essence of their counterpart aspect.<br/><br/><h3>Current effects:</h3>"
                var asps = ["Time", "Space", "Mind", "Heart", "Hope", "Rage", "Light", "Void", "Life", "Doom", "Breath", "Blood"]
                for (var a = 1; a <= 12; a++) {
                    ret += "<br/>" + asps[a - 1] + ": ×" + format(tmp[this.layer].buyables[this.id].effect[a])
                }
                return ret + "<br/><br/><h3>Level " + format(player[this.layer].buyables[this.id], 0) + "</h3><br/>Cost: " + format(this.cost()) + " Class Points"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                if (this.canAfford()) {
                    return { "height": "320px", "color": "white" }
                } else {
                    return { "height": "320px" }
                }
            }
        },
        23: {
            cost(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).mul(1e31).pow((x || getBuyableAmount(this.layer, this.id)).add(1).pow(3)) },
            effect(x) {
                var eff = {}
                var amt = applyPolynomialSoftcap(getBuyableAmount(this.layer, this.id), 6, 2)
                eff[11] = player.metaClasses.points.add(1).log(10).div(10).add(1).pow(2).sub(1).mul(amt).add(1)
                eff[14] = player.metaClasses.points.add(1).log(10).div(10).add(1).pow(1.85).sub(1).mul(amt).add(1)
                eff[15] = player.metaClasses.points.add(1).log(10).div(10).add(1).pow(1.5).sub(1).mul(amt).add(1)
                eff[17] = player.metaClasses.points.add(1).log(10).div(10).add(1).pow(0.5).sub(1).mul(amt).add(1)
                eff[19] = player.metaClasses.points.add(1).log(10).div(10).add(1).pow(1.2).sub(1).mul(amt).add(1)
                eff[21] = player.metaClasses.points.add(1).log(10).div(10).add(1).pow(1.4).sub(1).mul(amt).add(1)
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "Muse Power"
            },
            display() {
                var ret = "which are boosting all Passive Classes effects based on your Class Points.<br/><br/><h3>Current effects:</h3>"
                for (thing in tmp[this.layer].buyables[this.id].effect) {
                    ret += "<br/>" + tmp.metaClasses.buyables[thing].title.replace('<h5>Passive</h5>', '') + ": ^" + format(tmp[this.layer].buyables[this.id].effect[thing])
                }
                return ret + "<br/><br/><h3>Level " + format(player[this.layer].buyables[this.id], 0) + "</h3><br/>Cost: " + format(this.cost()) + " Class Points"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                if (this.canAfford()) {
                    return { "height": "320px", "width": "250px", "color": "white" }
                } else {
                    return { "height": "320px", "width": "250px" }
                }
            }
        },
        24: {
            cost(x) { return (x || getBuyableAmount(this.layer, this.id)).add(1).mul(2.16e51).pow((x || getBuyableAmount(this.layer, this.id)).add(1).pow(3)) },
            effect(x) {
                var eff = {}
                var amt = applyPolynomialSoftcap(getBuyableAmount(this.layer, this.id), 6, 2)
                eff[12] = player.metaClasses.points.add(1).log(10).div(10).add(1).pow(1.2).sub(1).mul(amt).add(1)
                eff[13] = player.metaClasses.points.add(1).log(10).div(10).add(1).pow(1.15).sub(1).mul(amt).add(1)
                eff[16] = player.metaClasses.points.add(1).log(10).div(10).add(1).pow(1.3).sub(1).mul(amt).add(1)
                eff[18] = player.metaClasses.points.add(1).log(10).div(10).add(1).pow(0.5).sub(1).mul(amt).add(1)
                eff[20] = player.metaClasses.points.add(1).log(10).div(10).add(1).log(10).mul(amt).add(1).pow(0.3)
                eff[22] = player.metaClasses.points.add(1).log(10).div(10).add(1).log(10).mul(amt).add(1).pow(0.5)
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "Lord Power"
            },
            display() {
                var ret = "which are boosting all Active Classes effects based on your Class Points.<br/><br/><h3>Current effects:</h3>"
                for (thing in tmp[this.layer].buyables[this.id].effect) {
                    ret += "<br/>" + tmp.metaClasses.buyables[thing].title.replace('<h5>Active</h5>', '') + ": " + (thing == 20 || thing == 22 ? "×" : "^") + format(tmp[this.layer].buyables[this.id].effect[thing])
                }
                return ret + "<br/><br/><h3>Level " + format(player[this.layer].buyables[this.id], 0) + "</h3><br/>Cost: " + format(this.cost()) + " Class Points"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                if (this.canAfford()) {
                    return { "height": "320px", "width": "250px", "color": "white" }
                } else {
                    return { "height": "320px", "width": "250px" }
                }
            }
        },
    },

    update(delta) {
        addPoints(this.layer, tmp[this.layer].effect.pointGain.mul(delta))
    },

    microtabs: {
        stuff: {
            "Classes": {
                content: [
                    ["blank", "15px"],
                    ["row", [["buyable", 11], ["buyable", 13], ["buyable", 15]]],
                    ["row", [["buyable", 12], ["buyable", 14], ["buyable", 16]]],
                    ["blank", "15px"],
                    ["row", [["buyable", 17], ["buyable", 19], ["buyable", 21]]],
                    ["row", [["buyable", 18], ["buyable", 20], ["buyable", 22]]],
                    ["blank", "25px"],
                    ["row", [["buyable", 23], ["buyable", 24]]],
                ]
            },
        },
    },

    tabFormat: [
        "main-display",
        ["display-text", () => "All of your Class Powers are giving you " + format(tmp[this.layer].effect.pointGain) + " Class Points per second."],
        "prestige-button",
        ["blank", "35px"],
        ["microtabs", "stuff"],
        ["blank", "35px"],
    ],
})
