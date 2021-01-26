addLayer("aspBlood", {
    name: "Blood",
    symbol: "<img src='data/blood.png' style='width:calc(80% - 2px);height:calc(80% - 2px);margin:10%'></img>",
    row: 7,
    position: 0,

    layerShown() { return (challengeCompletions("aspDoom", 12) >= 11 || player[this.layer].unlocked) && !hasUpgrade("skaia", 12) },
    resource: "Blood Essence",
    baseAmount() { return player.points },
    baseResource: "点",
    color: "#3e1601",
    resetDescription: "Absorb ",
    branches: [["aspTime", 3], ["aspSpace", 3], ["aspVoid", 3], ["aspHeart", 3], ["aspDoom", 3], ["aspRage", 3]],

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
            powerGain: applyPolynomialSoftcap(player.aspBlood.points.min(12).pow(player.aspBlood.points).mul(player.aspBreath.points.add(1)), "1e413", 2)
        }
        return effs
    },
    effectDescription() {
        eff = this.effect();
        return "which are giving " + format(eff.powerGain) + " Blood Power per second."
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
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Blood Power"
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
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(10).add(1).log(10).add(1).mul(tmp.aspBlood.buyables[28].effect) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Time Booster Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your Time Booster's effect by ^" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Blood Power"
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
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(10).add(1).log(10).add(1).mul(tmp.aspBlood.buyables[28].effect) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Time Booster^2 Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your Time Booster^2's effect by ^" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Blood Power"
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
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Blood Power"
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
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Blood Power"
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
                    "which are boosting your Space Accelerator gain by ×" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Blood Power"
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
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Heart Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your Heart Power gain by ×" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Blood Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#55142a", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        18: {
            cost(x) { return new Decimal(1e12) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(10).add(1).log(8).add(1).mul(tmp.aspBlood.buyables[28].effect) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Heart Upgrade Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your first row of Heart upgrades' effect by ^" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Blood Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#55142a", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        19: {
            cost(x) { return new Decimal(1e21) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(50).add(1).log(50).add(1).mul(tmp.aspBlood.buyables[28].effect) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Heart Upgrade^2 Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your first row of Heart upgrades' effect (again) by ^" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Blood Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#55142a", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        20: {
            cost(x) { return new Decimal(1e41) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(50).add(1).log(10).add(1).mul(tmp.aspBlood.buyables[28].effect) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Rage Challenge Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your first Rage Challenge's effect by ^" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Blood Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#520c61", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        21: {
            cost(x) { return new Decimal(1e44) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(2).add(1).log(1.2).add(1).mul(tmp.aspBlood.buyables[28].effect) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Rage Challenge^2 Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your second Rage Challenge's effect by ^" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Blood Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#520c61", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        22: {
            cost(x) { return new Decimal(1e75) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(2).add(1).log(1.2).add(1).mul(tmp.aspBlood.buyables[28].effect) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Rage Challenge^3 Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your third Rage Challenge's effect by ^" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Blood Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#520c61", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        23: {
            cost(x) { return new Decimal(1e85) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).pow(1800).pow((x || getBuyableAmount(this.layer, this.id)).max(1).log(10)) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Void Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your Void Power gain by ×" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Blood Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#104ea2", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        24: {
            cost(x) { return new Decimal(1e115) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(2).add(1).log(2).add(1).mul(tmp.aspBlood.buyables[28].effect) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Void Enhancement Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your first Void Enhancement's effect by ×" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Blood Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#104ea2", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px black" }
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
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Doom Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting your Doom Power gain by ×" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Blood Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#306800", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        26: {
            cost(x) { return new Decimal(1e160) },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(100).add(1).log(50).add(1).mul(tmp.aspBlood.buyables[28].effect) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Doom Effect Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting Doom Power's effect by ^" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Blood Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#306800", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        27: {
            cost(x) { return new Decimal(1e275) },
            effect(x) { return applyPolynomialSoftcap((x || getBuyableAmount(this.layer, this.id)).max(1).pow(0.5), 1000000, 3) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Blood Synergizer"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting all Blood Synergizers' gain by ×" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Blood Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#3e1601", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px black" }
                } else {
                    return {}
                }
            }
        },
        28: {
            cost(x) { return new Decimal("1e1111") },
            effect(x) { return (x || getBuyableAmount(this.layer, this.id)).max(1).log(500000000).add(1).log(50).add(1) },
            canAfford() { return player[this.layer].power.gte(this.cost()) && player[this.layer].buyables[this.id].lte(0) },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Blood Synergizer^2"
            },
            display() {
                return player[this.layer].buyables[this.id].gt(0) ?
                    "which are boosting all exponential effects on all Blood Synergizers by ×" + format(tmp[this.layer].buyables[this.id].effect) :
                    "Unlock for " + format(tmp[this.layer].buyables[this.id].cost) + " Blood Power"
            },
            buy() {
                player[this.layer].power = player[this.layer].power.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1))
            },
            style() {
                if (player[this.layer].buyables[this.id].gte(1)) {
                    return { "background-color": "#3e1601", "color": "var(--color)", "box-shadow": "inset 0px 0px 50px black" }
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
                    ["display-text", () => "You have <h2 style='color:#3e1601;text-shadow:#3e1601 0px 0px 10px;'>" + formatWhole(player.aspBlood.power) + "</h2> Blood Power."],
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
                        <div class="title-bar" style="background-color:#55142a">
                            <h3><img src="data/heart.png" style="height:24px;width:24px;transform:translateY(5px)" /> Heart</h3>
                        </div>
                    `],
                    ["blank", "10px"],
                    ["row", [["buyable", 17], ["buyable", 18], ["buyable", 19]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#520c61">
                            <h3><img src="data/rage.png" style="height:24px;width:24px;transform:translateY(5px)" /> Rage</h3>
                        </div>
                    `],
                    ["blank", "10px"],
                    ["row", [["buyable", 20], ["buyable", 21], ["buyable", 22]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#104ea2">
                            <h3><img src="data/void.png" style="height:24px;width:24px;transform:translateY(5px)" /> Void</h3>
                        </div>
                    `],
                    ["blank", "10px"],
                    ["row", [["buyable", 23], ["buyable", 24]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#306800">
                            <h3><img src="data/doom.png" style="height:24px;width:24px;transform:translateY(5px)" /> Doom</h3>
                        </div>
                    `],
                    ["blank", "10px"],
                    ["row", [["buyable", 25], ["buyable", 26]]],
                    ["blank", "15px"],
                    ["raw-html", `
                        <div class="title-bar" style="background-color:#3e1601">
                            <h3><img src="data/blood.png" style="height:24px;width:24px;transform:translateY(5px)" /> Blood</h3>
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
            setBuyableAmount(this.layer, a, getBuyableAmount(this.layer, a).add(tmp.aspBlood.buyables[27].effect.mul(delta)))
            if (a > 11) setBuyableAmount(this.layer, a - 1, getBuyableAmount(this.layer, a - 1).add(getBuyableAmount(this.layer, a).mul(tmp.aspBlood.buyables[27].effect).mul(delta)))
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
        { key: "b", description: "B: Absorb Blood Essence", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
})