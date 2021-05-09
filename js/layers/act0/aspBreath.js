if (act == "0.0") addLayer("aspBreath", {
    name: "Breath",
    symbol: "<img src='data/breath.png' style='width:calc(80% - 2px);height:calc(80% - 2px);margin:10%'></img>",
    row: 7,
    position: 0,

    layerShown() { return (challengeCompletions("aspDoom", 12) >= 11 || player[this.layer].unlocked) && !hasUpgrade("skaia", 12) },
    resource: "Breath Essence",
    baseAmount() { return player.points },
    baseResource: "points",
    color: "#4379e6",
    resetDescription: "Absorb ",
    branches: [["aspTime", 3], ["aspSpace", 3], ["aspMind", 3], ["aspLight", 3], ["aspHope", 3], ["aspLife", 3]],

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            power: new Decimal(0),
            autoAbsorb: false,
        }
    },

    resetsNothing: () => hasMilestone("skaia", 7),

    effect() {
        var effs = {
            powerGain: applyPolynomialSoftcap(player.aspBreath.points.min(12).pow(player.aspBreath.points).mul(player.aspBlood.points.add(1)), "1e413", 2)
        }
        return effs
    },
    effectDescription() {
        eff = this.effect();
        return "which are giving " + format(eff.powerGain) + " Breath Power per second."
    },

    type: "static",
    requires: new Decimal("e53400000"),
    canBuyMax() { return hasMilestone("skaia", 8) },
    base: new Decimal("e3900000"),
    exponent: 1.2,
    gainMult() {
        let mult = new Decimal(1)
        return mult
    },
    gainExp() {
        let mult = new Decimal(1)
        return mult
    },

    buyables: {
        rows: 1,
        cols: 1,
        11: {
            cost(x) { return new Decimal(10) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).pow(612).pow((x || getBuyableAmount(this.layer, this.id)).max(1).log(10)) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Time Multiplier^∞ Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting all of your Time Multipliers' effects by ×" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Breath Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#b70d0e", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        12: {
            cost(x) { return new Decimal(200) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(10).add(1).log(10).add(1).mul(tmp.aspBreath.buyables[28].effect) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Time Booster Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your Time Booster's effect by ^" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Breath Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#b70d0e", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        13: {
            cost(x) { return new Decimal(500) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(10).add(1).log(10).add(1).mul(tmp.aspBreath.buyables[28].effect) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Time Booster^2 Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your Time Booster^2's effect by ^" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Breath Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#b70d0e", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        14: {
            cost(x) { return new Decimal(1500) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).pow(1413).pow((x || getBuyableAmount(this.layer, this.id)).max(1).log(10)) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Space Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your Space Power gain by ×" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Breath Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#000000", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px white" }
                } else {
                    return {}
                }
            }
        },
        15: {
            cost(x) { return new Decimal(3500) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).pow(612) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Space Generator^∞ Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting all of your Space Generators by ×" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Breath Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#000000", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px white" }
                } else {
                    return {}
                }
            }
        },
        16: {
            cost(x) { return new Decimal(20000) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).pow(413) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Space Accelerator Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your Space Accelerator effect by ×" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Breath Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#000000", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px white" }
                } else {
                    return {}
                }
            }
        },
        17: {
            cost(x) { return new Decimal(120000) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).pow(1613) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Mind Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your Mind Power gain by ×" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Breath Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#00923d", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        18: {
            cost(x) { return new Decimal(750000) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(10).add(1).log(8).add(1).mul(tmp.aspBreath.buyables[28].effect) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Mind Upgrade Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your first row of Mind upgrades' effect by ^" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Breath Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#00923d", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        19: {
            cost(x) { return new Decimal(1e21) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(2).add(1).log(5).add(1).mul(tmp.aspBreath.buyables[28].effect) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Mind Upgrade^2 Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your second row of Mind upgrades' effect by ^" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Breath Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#00923d", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        20: {
            cost(x) { return new Decimal(1e31) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(20).add(1).log(20).add(1).mul(tmp.aspBreath.buyables[28].effect) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Hope Upgrade Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your first Hope upgrade's effect by ^" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Breath Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#ffde55", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        21: {
            cost(x) { return new Decimal(1e51) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(1.2).add(1).log(1.2).add(1).mul(tmp.aspBreath.buyables[28].effect) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Hope Upgrade^3 Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting all of the third row of your Hope Upgrades' effect by ^" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Breath Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#ffde55", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        22: {
            cost(x) { return new Decimal(1e64) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(50).add(1).log(10).add(1).mul(tmp.aspBreath.buyables[28].effect) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Hope Upgrade^6 Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting all of the sixth row of your Hope Upgrades' effect by ^" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Breath Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#ffde55", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        23: {
            cost(x) { return new Decimal(1e85) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).pow(2100).pow((x || getBuyableAmount(this.layer, this.id)).max(1).log(10)) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Light Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your Light Power gain by ×" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Breath Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#f0840c", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        24: {
            cost(x) { return new Decimal(1e100) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(1.12).add(1).log(1.12).add(1).mul(tmp.aspBreath.buyables[28].effect) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Light Discoveries^∞ Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting all of your Light Discoveries effect by ^" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Breath Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#f0840c", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        25: {
            cost(x) { return new Decimal(1e130) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).pow(6130).pow((x || getBuyableAmount(this.layer, this.id)).max(1).log(10)) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Life Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your Life Power gain by ×" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Breath Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#a49787", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        26: {
            cost(x) { return new Decimal(1e200) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(100).add(1).log(50).add(1).mul(tmp.aspBreath.buyables[28].effect) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Life Effect Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your first Life effect by ^" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Breath Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#a49787", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        27: {
            cost(x) { return new Decimal(1e255) },
            effect(x) { return applyPolynomialSoftcap((x || getBuyableAmount(this.layer, this.id)).max(1).pow(0.5), 1000000, 3) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Breath Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting all Breath Synergizers' gain by ×" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Breath Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#4379e6", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        28: {
            cost(x) { return new Decimal("1e565") },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(500000000).add(1).log(10).add(1) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Breath Synergizer^2"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting all exponential effects on all Breath Synergizers by ×" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Breath Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#4379e6", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
    },

    microtabs: {
        stuff: {
            "Synergism": {
                content: [
                    ["blank", "15px"],
                    ["display-text", () => "You have <h2 style='color:#4379e6;text-shadow:#4379e6 0px 0px 10px;'>" + formatWhole(player.aspBreath.power) + "</h2> Breath Power."],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#b70d0e">
                            <h3><img src="data/time.png" style="height:24px;width:24px;transform:translateY(5px)" /> Time</h3>
                        </div>
                    `],
                    ["blank", "10px"],
                    ["row", [["buyable", 11], ["buyable", 12], ["buyable", 13]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#000000">
                            <h3><img src="data/space.png" style="height:24px;width:24px;transform:translateY(5px)" /> Space</h3>
                        </div>
                    `],
                    ["blank", "10px"],
                    ["row", [["buyable", 14], ["buyable", 15], ["buyable", 16]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#00923d">
                            <h3><img src="data/mind.png" style="height:24px;width:24px;transform:translateY(5px)" /> Mind</h3>
                        </div>
                    `],
                    ["blank", "10px"],
                    ["row", [["buyable", 17], ["buyable", 18], ["buyable", 19]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#ffde55;color:black;">
                            <h3><img src="data/hope.png" style="height:24px;width:24px;transform:translateY(5px)" /> Hope</h3>
                        </div>
                    `],
                    ["blank", "10px"],
                    ["row", [["buyable", 20], ["buyable", 21], ["buyable", 22]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#f0840c;color:black;">
                            <h3><img src="data/light.png" style="height:24px;width:24px;transform:translateY(5px)" /> Light</h3>
                        </div>
                    `],
                    ["blank", "10px"],
                    ["row", [["buyable", 23], ["buyable", 24]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#a49787;color:black;">
                            <h3><img src="data/life.png" style="height:24px;width:24px;transform:translateY(5px)" /> Life</h3>
                        </div>
                    `],
                    ["blank", "10px"],
                    ["row", [["buyable", 25], ["buyable", 26]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#4379e6;color:black;">
                            <h3><img src="data/breath.png" style="height:24px;width:24px;transform:translateY(5px)" /> Breath</h3>
                        </div>
                    `],
                    ["blank", "10px"],
                    ["row", [["buyable", 27], ["buyable", 28]]],
                    ["blank", "15px"],
                ]
            },
        },
    },

    update(delta) {
        player[this.layer].power = player[this.layer].power.add(tmp[this.layer].effect.powerGain.mul(delta))
        for (var a = 11; a <= 28; a++) if (getBuyableAmount(this.layer, a).gt(0)) {
            setBuyableAmount(this.layer, a, getBuyableAmount(this.layer, a).add(tmp.aspBreath.buyables[27].effect.mul(delta)))
            if (a > 11) setBuyableAmount(this.layer, a - 1, getBuyableAmount(this.layer, a - 1).add(getBuyableAmount(this.layer, a).mul(tmp.aspBreath.buyables[27].effect).mul(delta)))
        }
        if (player[this.layer].autoAbsorb && canReset(this.layer)) doReset(this.layer)
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        ["blank", "25px"],
        ["microtabs", "stuff"],
        ["blank", "35px"],
    ],

    hotkeys: [
        { key: "r", description: "R: Absorb Breath Essence", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
})