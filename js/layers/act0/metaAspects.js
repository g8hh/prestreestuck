var nodeStyle = {
    height: "70px",
    width: "70px",
    margin: "5px",
    border: "var(--hqProperty1)",
    "border-color": "rgba(0, 0, 0, 0.125)",
    "border-radius": "50%",
    "box-shadow": "var(--hqProperty2a), var(--hqProperty2b)",
    "font-size": "40px",
    "font-family": `"Courier New", "Courier Prime", "Lucida Console", monospace`,
    color: "rgba(0, 0, 0, 0.5)",
    "text-shadow": "var(--hqProperty3)",
    padding: "0",
    margin: "0 10px 0 10px",
}

var apparatusUpg = {
    fullDisplay() { 
        return `
            <h3><p style='transform: scale(-1, -1)'><alternate>${this.title}</alternate></p></h3>
            ${this.description}
            <br/>Currently: ×${format(tmp[this.layer].upgrades[this.id].effect)}
            <br/><br/>Cost: ${format(player[this.layer].aPointUpgCost.pow(this.costPow), 0)} AP & ${format(player[this.layer].aPowerUpgCost.pow(this.costPow), 0)} ${this.targetName}
        `
    }, 
    canAfford() { 
        return player[this.layer].points.gte(player[this.layer].aPointUpgCost.pow(this.costPow)) 
            && player[this.layer].buyables[this.target].gte(player[this.layer].aPowerUpgCost.pow(this.costPow)) 
    },
    pay() {
        player[this.layer].points = player[this.layer].points.sub(player[this.layer].aPointUpgCost.pow(this.costPow)) 
        player[this.layer].buyables[this.target] = player[this.layer].buyables[this.target].sub(player[this.layer].aPowerUpgCost.pow(this.costPow)) 

        player[this.layer].aPointUpgCost = player[this.layer].aPointUpgCost.mul(player[this.layer].aPointUpgPow)
        player[this.layer].aPointUpgPow = player[this.layer].aPointUpgPow.add(1)
        player[this.layer].aPowerUpgCost = player[this.layer].aPowerUpgCost.mul(player[this.layer].aPowerUpgPow).add(5)
        player[this.layer].aPowerUpgPow = player[this.layer].aPowerUpgPow.add(.15)
    },
}

if (act == "0.1") addLayer("metaAspects", {
    name: "Aspects",
    symbol: "A",
    row: 8,
    position: 0,

    layerShown() { return true },
    resource: "Aspect Points",
    color: "#e5b9ff",
    type: "none",

    effect() {
        var effs = {
            pointBoost: Decimal.pow(player.metaAspects.points.min(100), player.metaAspects.points.div(100)),
            selfGain: new Decimal(1),
            globalGain: new Decimal(1),
        }

        for (let a = 11; a <= 22; a++) {
            effs.selfGain = effs.selfGain.mul(tmp.metaAspects.buyables[a].effect)
        }
        effs.selfGain = effs.selfGain.sub(1)

        if (hasUpgrade("metaAspects", 12)) effs.globalGain = effs.globalGain.mul(upgradeEffect("metaAspects", 12))
        if (hasUpgrade("metaAspects", 13)) effs.globalGain = effs.globalGain.mul(upgradeEffect("metaAspects", 13))
        if (hasUpgrade("metaAspects", 14)) effs.globalGain = effs.globalGain.mul(upgradeEffect("metaAspects", 14))
        if (hasUpgrade("metaAspects", 15)) effs.globalGain = effs.globalGain.mul(upgradeEffect("metaAspects", 15))
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
            apAllocated: [],
            apMax: 1,
            aPointUpgCost: new Decimal(100000000),
            aPointUpgPow: new Decimal(4),
            aPowerUpgCost: new Decimal(10),
            aPowerUpgPow: new Decimal(1.1),
        }
    },

    buyables: {
        showRespec: true,
        respec() { 
            player[this.layer].upgrades = player[this.layer].upgrades.filter(x => x < 20 || x > 139)
            doReset(this.layer, true)
            player.metaAspects.aPointUpgCost = new Decimal(100000000)
            player.metaAspects.aPointUpgPow = new Decimal(4)
            player.metaAspects.aPowerUpgCost = new Decimal(10)
            player.metaAspects.aPowerUpgPow = new Decimal(1.1)
        },
        respecText: "Respec Aspect Upgrades",
        respecMessage: "Are you sure to respec non-Apparatus Aspect Upgrades? You'll need to wait at least 1 minute to respec again!",

        rows: 1,
        cols: 1,
        0: {
            canAfford() { return false },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).sqrt() },
            style() {
                return {
                    ...nodeStyle,
                    position: "absolute", left: "-37.50px", top: "112.50px",
                    "box-shadow": "0 0 150px 50px #e5b9ff",
                }
            },
        },
        10: {
            display() { return player.metaAspects.apMax - player.metaAspects.apAllocated.length },
            tooltip() { 
                return format(player[this.layer].buyables[this.id], 0) + " Apparatus Power<br/><h5>" + 
                    (player.metaAspects.apMax - player.metaAspects.apAllocated.length) + " / " + (player.metaAspects.apMax) + " available" + 
                    (player[this.layer].apAllocated.includes(this.id) ? `<br/>×${format(tmp[this.layer].buyables[this.id].selfBoost)}` : "") 
            },
            canAfford() { return player.metaAspects.apMax > player.metaAspects.apAllocated.length || player[this.layer].apAllocated.includes(this.id) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).sqrt() },
            selfBoost() {
                let eff = new Decimal(1)
                if (hasUpgrade("metaAspects", 22)) eff = eff.mul(upgradeEffect("metaAspects", 22))
                if (hasUpgrade("metaAspects", 32)) eff = eff.mul(upgradeEffect("metaAspects", 32))
                if (hasUpgrade("metaAspects", 101)) eff = eff.mul(upgradeEffect("metaAspects", 101))
                if (hasUpgrade("metaAspects", 111)) eff = eff.mul(upgradeEffect("metaAspects", 111))
                return eff
            },
            buy() {
                let index = player[this.layer].apAllocated.indexOf(this.id)
                if (index >= 0) player[this.layer].apAllocated.splice(index, 1)
                else player[this.layer].apAllocated.push(this.id)
            },
            style() {
                return {
                    ...nodeStyle,
                    position: "absolute", left: "-37.50px", top: "112.50px",
                    "box-shadow": player[this.layer].apAllocated.includes(this.id) ? 
                        "var(--hqProperty2a), 0 0 0 2px var(--background), 0 0 0 3px #ffffff" : 
                        "var(--hqProperty2a), var(--hqProperty2b)",
                }
            },
        },
        11: {
            display: "<img src='data/time.png' style='width:calc(80% - 2px);height:calc(80% - 2px);margin:10%'></img>",
            tooltip() { 
                return format(player[this.layer].buyables[this.id], 0) + " Time Power" + 
                    (player[this.layer].apAllocated.includes(this.id) ? `<br/><h5>×${format(tmp[this.layer].buyables[this.id].selfBoost)}` : "") 
            },
            canAfford() { return player.metaAspects.apMax > player.metaAspects.apAllocated.length || player[this.layer].apAllocated.includes(this.id) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).sqrt() },
            selfBoost() {
                let eff = new Decimal(1)
                if (hasUpgrade("metaAspects", 31)) eff = eff.mul(upgradeEffect("metaAspects", 31))
                if (hasUpgrade("metaAspects", 81)) eff = eff.mul(upgradeEffect("metaAspects", 81))
                if (hasUpgrade("metaAspects", 25)) eff = eff.mul(upgradeEffect("metaAspects", 25))
                return eff
            },
            buy() {
                let index = player[this.layer].apAllocated.indexOf(this.id)
                if (index >= 0) player[this.layer].apAllocated.splice(index, 1)
                else player[this.layer].apAllocated.push(this.id)
            },
            style() {
                return {
                    ...nodeStyle,
                    position: "absolute", left: "112.50px", top: "112.50px",
                    background: tmp[this.layer].buyables[this.id].canAfford ? "#b70d0e" : "",
                    "box-shadow": player[this.layer].apAllocated.includes(this.id) ? 
                        "var(--hqProperty2a), 0 0 0 2px var(--background), 0 0 0 3px #ffffff" : 
                        "var(--hqProperty2a), var(--hqProperty2b)",
                }
            },
        },
        12: {
            display: "<img src='data/space.png' style='width:calc(80% - 2px);height:calc(80% - 2px);margin:10%'></img>",
            tooltip() { 
                return format(player[this.layer].buyables[this.id], 0) + " Space Power" + 
                    (player[this.layer].apAllocated.includes(this.id) ? `<br/><h5>×${format(tmp[this.layer].buyables[this.id].selfBoost)}` : "") 
            },
            canAfford() { return player.metaAspects.apMax > player.metaAspects.apAllocated.length || player[this.layer].apAllocated.includes(this.id) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).sqrt() },
            selfBoost() {
                let eff = new Decimal(1)
                if (hasUpgrade("metaAspects", 21)) eff = eff.mul(upgradeEffect("metaAspects", 21))
                if (hasUpgrade("metaAspects", 41)) eff = eff.mul(upgradeEffect("metaAspects", 41))
                if (hasUpgrade("metaAspects", 51)) eff = eff.mul(upgradeEffect("metaAspects", 51))
                if (hasUpgrade("metaAspects", 81)) eff = eff.mul(upgradeEffect("metaAspects", 82))
                if (hasUpgrade("metaAspects", 35)) eff = eff.mul(upgradeEffect("metaAspects", 35))
                return eff
            },
            buy() {
                let index = player[this.layer].apAllocated.indexOf(this.id)
                if (index >= 0) player[this.layer].apAllocated.splice(index, 1)
                else player[this.layer].apAllocated.push(this.id)
            },
            style() {
                return {
                    ...nodeStyle,
                    position: "absolute", left: "-187.50px", top: "112.50px",
                    background: tmp[this.layer].buyables[this.id].canAfford ? "#000000" : "",
                    "box-shadow": player[this.layer].apAllocated.includes(this.id) ? 
                        "var(--hqProperty2a), 0 0 0 2px var(--background), 0 0 0 3px #ffffff" : 
                        "var(--hqProperty2a), var(--hqProperty2b)",
                }
            },
        },
        13: {
            display: "<img src='data/heart.png' style='width:calc(80% - 1px);height:calc(80% - 1px);margin:10%'></img>",
            tooltip() { 
                return format(player[this.layer].buyables[this.id], 0) + " Heart Power" + 
                    (player[this.layer].apAllocated.includes(this.id) ? `<br/><h5>×${format(tmp[this.layer].buyables[this.id].selfBoost)}` : "") 
            },
            canAfford() { return player.metaAspects.apMax > player.metaAspects.apAllocated.length || player[this.layer].apAllocated.includes(this.id) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).sqrt() },
            selfBoost() {
                let eff = new Decimal(1)
                if (hasUpgrade("metaAspects", 131)) eff = eff.mul(upgradeEffect("metaAspects", 131))
                if (hasUpgrade("metaAspects", 45)) eff = eff.mul(upgradeEffect("metaAspects", 45))
                return eff
            },
            buy() {
                let index = player[this.layer].apAllocated.indexOf(this.id)
                if (index >= 0) player[this.layer].apAllocated.splice(index, 1)
                else player[this.layer].apAllocated.push(this.id)
            },
            style() {
                return {
                    ...nodeStyle,
                    position: "absolute", left: "92.40px", top: "187.50px",
                    background: tmp[this.layer].buyables[this.id].canAfford ? "#55142a" : "",
                    "box-shadow": player[this.layer].apAllocated.includes(this.id) ? 
                        "var(--hqProperty2a), 0 0 0 2px var(--background), 0 0 0 3px #ffffff" : 
                        "var(--hqProperty2a), var(--hqProperty2b)",
                }
            },
        },
        14: {
            display: "<img src='data/mind.png' style='width:calc(80% - 3px);height:calc(80% - 3px);margin:10%'></img>",
            tooltip() { 
                return format(player[this.layer].buyables[this.id], 0) + " Mind Power" + 
                    (player[this.layer].apAllocated.includes(this.id) ? `<br/><h5>×${format(tmp[this.layer].buyables[this.id].selfBoost)}` : "") 
                },
            canAfford() { return player.metaAspects.apMax > player.metaAspects.apAllocated.length || player[this.layer].apAllocated.includes(this.id) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).sqrt() },
            selfBoost() {
                let eff = new Decimal(1)
                if (hasUpgrade("metaAspects", 121)) eff = eff.mul(upgradeEffect("metaAspects", 121))
                if (hasUpgrade("metaAspects", 55)) eff = eff.mul(upgradeEffect("metaAspects", 55))
                return eff
            },
            buy() {
                let index = player[this.layer].apAllocated.indexOf(this.id)
                if (index >= 0) player[this.layer].apAllocated.splice(index, 1)
                else player[this.layer].apAllocated.push(this.id)
            },
            style() {
                return {
                    ...nodeStyle,
                    position: "absolute", left: "-167.40px", top: "37.50px",
                    background: tmp[this.layer].buyables[this.id].canAfford ? "#00923d" : "",
                    "box-shadow": player[this.layer].apAllocated.includes(this.id) ? 
                        "var(--hqProperty2a), 0 0 0 2px var(--background), 0 0 0 3px #ffffff" : 
                        "var(--hqProperty2a), var(--hqProperty2b)",
                }
            },
        },
        15: {
            display: "<img src='data/hope.png' style='width:calc(80% - 0px);height:calc(80% - 0px);margin:10%'></img>",
            tooltip() { 
                return format(player[this.layer].buyables[this.id], 0) + " Hope Power" + 
                    (player[this.layer].apAllocated.includes(this.id) ? `<br/><h5>×${format(tmp[this.layer].buyables[this.id].selfBoost)}` : "") 
                },
            canAfford() { return player.metaAspects.apMax > player.metaAspects.apAllocated.length || player[this.layer].apAllocated.includes(this.id) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).sqrt() },
            selfBoost() {
                let eff = new Decimal(1)
                if (hasUpgrade("metaAspects", 61)) eff = eff.mul(upgradeEffect("metaAspects", 61))
                if (hasUpgrade("metaAspects", 122)) eff = eff.mul(upgradeEffect("metaAspects", 122))
                if (hasUpgrade("metaAspects", 65)) eff = eff.mul(upgradeEffect("metaAspects", 65))
                return eff
            },
            buy() {
                let index = player[this.layer].apAllocated.indexOf(this.id)
                if (index >= 0) player[this.layer].apAllocated.splice(index, 1)
                else player[this.layer].apAllocated.push(this.id)
            },
            style() {
                return {
                    ...nodeStyle,
                    position: "absolute", left: "-112.50px", top: "-17.40px",
                    background: tmp[this.layer].buyables[this.id].canAfford ? "#ffde55" : "",
                    "box-shadow": player[this.layer].apAllocated.includes(this.id) ? 
                        "var(--hqProperty2a), 0 0 0 2px var(--background), 0 0 0 3px #ffffff" : 
                        "var(--hqProperty2a), var(--hqProperty2b)",
                }
            },
        },
        16: {
            display: "<img src='data/rage.png' style='width:calc(80% - 0px);height:calc(80% - 0px);margin:10%'></img>",
            tooltip() { 
                return format(player[this.layer].buyables[this.id], 0) + " Rage Power" + 
                    (player[this.layer].apAllocated.includes(this.id) ? `<br/><h5>×${format(tmp[this.layer].buyables[this.id].selfBoost)}` : "") 
                },
            canAfford() { return player.metaAspects.apMax > player.metaAspects.apAllocated.length || player[this.layer].apAllocated.includes(this.id) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).sqrt() },
            selfBoost() {
                let eff = new Decimal(1)
                if (hasUpgrade("metaAspects", 71)) eff = eff.mul(upgradeEffect("metaAspects", 71))
                if (hasUpgrade("metaAspects", 132)) eff = eff.mul(upgradeEffect("metaAspects", 132))
                if (hasUpgrade("metaAspects", 75)) eff = eff.mul(upgradeEffect("metaAspects", 75))
                return eff
            },
            buy() {
                let index = player[this.layer].apAllocated.indexOf(this.id)
                if (index >= 0) player[this.layer].apAllocated.splice(index, 1)
                else player[this.layer].apAllocated.push(this.id)
            },
            style() {
                return {
                    ...nodeStyle,
                    position: "absolute", left: "37.50px", top: "242.40px",
                    background: tmp[this.layer].buyables[this.id].canAfford ? "#520c61" : "",
                    "box-shadow": player[this.layer].apAllocated.includes(this.id) ? 
                        "var(--hqProperty2a), 0 0 0 2px var(--background), 0 0 0 3px #ffffff" : 
                        "var(--hqProperty2a), var(--hqProperty2b)",
                }
            },
        },
        17: {
            display: "<img src='data/light.png' style='width:calc(80%);height:calc(80%);margin:10%'></img>",
            tooltip() { 
                return format(player[this.layer].buyables[this.id], 0) + " Light Power" + 
                    (player[this.layer].apAllocated.includes(this.id) ? `<br/><h5>×${format(tmp[this.layer].buyables[this.id].selfBoost)}` : "") 
                },
            canAfford() { return player.metaAspects.apMax > player.metaAspects.apAllocated.length || player[this.layer].apAllocated.includes(this.id) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).sqrt() },
            selfBoost() {
                let eff = new Decimal(1)
                if (hasUpgrade("metaAspects", 123)) eff = eff.mul(upgradeEffect("metaAspects", 123))
                if (hasUpgrade("metaAspects", 85)) eff = eff.mul(upgradeEffect("metaAspects", 85))
                return eff
            },
            buy() {
                let index = player[this.layer].apAllocated.indexOf(this.id)
                if (index >= 0) player[this.layer].apAllocated.splice(index, 1)
                else player[this.layer].apAllocated.push(this.id)
            },
            style() {
                return {
                    ...nodeStyle,
                    position: "absolute", left: "92.40px", top: "37.50px",
                    background: tmp[this.layer].buyables[this.id].canAfford ? "#f0840c" : "",
                    "box-shadow": player[this.layer].apAllocated.includes(this.id) ? 
                        "var(--hqProperty2a), 0 0 0 2px var(--background), 0 0 0 3px #ffffff" : 
                        "var(--hqProperty2a), var(--hqProperty2b)",
                }
            },
        },
        18: {
            display: "<img src='data/void.png' style='width:calc(80%);height:calc(80%);margin:10%'></img>",
            tooltip() { 
                return format(player[this.layer].buyables[this.id], 0) + " Void Power" + 
                    (player[this.layer].apAllocated.includes(this.id) ? `<br/><h5>×${format(tmp[this.layer].buyables[this.id].selfBoost)}` : "") 
                },
            canAfford() { return player.metaAspects.apMax > player.metaAspects.apAllocated.length || player[this.layer].apAllocated.includes(this.id) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).sqrt() },
            selfBoost() {
                let eff = new Decimal(1)
                if (hasUpgrade("metaAspects", 133)) eff = eff.mul(upgradeEffect("metaAspects", 133))
                if (hasUpgrade("metaAspects", 95)) eff = eff.mul(upgradeEffect("metaAspects", 95))
                return eff
            },
            buy() {
                let index = player[this.layer].apAllocated.indexOf(this.id)
                if (index >= 0) player[this.layer].apAllocated.splice(index, 1)
                else player[this.layer].apAllocated.push(this.id)
            },
            style() {
                return {
                    ...nodeStyle,
                    position: "absolute", left: "-167.40px", top: "187.50px",
                    background: tmp[this.layer].buyables[this.id].canAfford ? "#104ea2" : "",
                    "box-shadow": player[this.layer].apAllocated.includes(this.id) ? 
                        "var(--hqProperty2a), 0 0 0 2px var(--background), 0 0 0 3px #ffffff" : 
                        "var(--hqProperty2a), var(--hqProperty2b)",
                }
            },
        },
        19: {
            display: "<img src='data/life.png' style='width:calc(80%);height:calc(80%);margin:10%'></img>",
            tooltip() { 
                return format(player[this.layer].buyables[this.id], 0) + " Life Power" + 
                    (player[this.layer].apAllocated.includes(this.id) ? `<br/><h5>×${format(tmp[this.layer].buyables[this.id].selfBoost)}` : "") 
                },
            canAfford() { return player.metaAspects.apMax > player.metaAspects.apAllocated.length || player[this.layer].apAllocated.includes(this.id) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).sqrt() },
            selfBoost() {
                let eff = new Decimal(1)
                if (hasUpgrade("metaAspects", 124)) eff = eff.mul(upgradeEffect("metaAspects", 124))
                if (hasUpgrade("metaAspects", 105)) eff = eff.mul(upgradeEffect("metaAspects", 105))
                return eff
            },
            buy() {
                let index = player[this.layer].apAllocated.indexOf(this.id)
                if (index >= 0) player[this.layer].apAllocated.splice(index, 1)
                else player[this.layer].apAllocated.push(this.id)
            },
            style() {
                return {
                    ...nodeStyle,
                    position: "absolute", left: "37.50px", top: "-17.40px",
                    background: tmp[this.layer].buyables[this.id].canAfford ? "#a49787" : "",
                    "box-shadow": player[this.layer].apAllocated.includes(this.id) ? 
                        "var(--hqProperty2a), 0 0 0 2px var(--background), 0 0 0 3px #ffffff" : 
                        "var(--hqProperty2a), var(--hqProperty2b)",
                }
            },
        },
        20: {
            display: "<img src='data/doom.png' style='width:calc(80%);height:calc(80%);margin:10%'></img>",
            tooltip() { 
                return format(player[this.layer].buyables[this.id], 0) + " Doom Power" + 
                    (player[this.layer].apAllocated.includes(this.id) ? `<br/><h5>×${format(tmp[this.layer].buyables[this.id].selfBoost)}` : "") 
                },
            canAfford() { return player.metaAspects.apMax > player.metaAspects.apAllocated.length || player[this.layer].apAllocated.includes(this.id) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).sqrt() },
            selfBoost() {
                let eff = new Decimal(1)
                if (hasUpgrade("metaAspects", 134)) eff = eff.mul(upgradeEffect("metaAspects", 134))
                if (hasUpgrade("metaAspects", 115)) eff = eff.mul(upgradeEffect("metaAspects", 115))
                return eff
            },
            buy() {
                let index = player[this.layer].apAllocated.indexOf(this.id)
                if (index >= 0) player[this.layer].apAllocated.splice(index, 1)
                else player[this.layer].apAllocated.push(this.id)
            },
            style() {
                return {
                    ...nodeStyle,
                    position: "absolute", left: "-112.50px", top: "242.40px",
                    background: tmp[this.layer].buyables[this.id].canAfford ? "#306800" : "",
                    "box-shadow": player[this.layer].apAllocated.includes(this.id) ? 
                        "var(--hqProperty2a), 0 0 0 2px var(--background), 0 0 0 3px #ffffff" : 
                        "var(--hqProperty2a), var(--hqProperty2b)",
                }
            },
        },
        21: {
            display: "<img src='data/breath.png' style='width:calc(80% - 2px);height:calc(80% - 2px);margin:10%'></img>",
            tooltip() { 
                return format(player[this.layer].buyables[this.id], 0) + " Breath Power" + 
                    (player[this.layer].apAllocated.includes(this.id) ? `<br/><h5>×${format(tmp[this.layer].buyables[this.id].selfBoost)}` : "") 
                },
            canAfford() { return player.metaAspects.apMax > player.metaAspects.apAllocated.length || player[this.layer].apAllocated.includes(this.id) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).sqrt() },
            selfBoost() {
                let eff = new Decimal(1)
                if (hasUpgrade("metaAspects", 125)) eff = eff.mul(upgradeEffect("metaAspects", 125))
                return eff
            },
            buy() {
                let index = player[this.layer].apAllocated.indexOf(this.id)
                if (index >= 0) player[this.layer].apAllocated.splice(index, 1)
                else player[this.layer].apAllocated.push(this.id)
            },
            style() {
                return {
                    ...nodeStyle,
                    position: "absolute", left: "-37.50px", top: "-37.50px",
                    background: tmp[this.layer].buyables[this.id].canAfford ? "#4379e6" : "",
                    "box-shadow": player[this.layer].apAllocated.includes(this.id) ? 
                        "var(--hqProperty2a), 0 0 0 2px var(--background), 0 0 0 3px #ffffff" : 
                        "var(--hqProperty2a), var(--hqProperty2b)",
                }
            },
        },
        22: {
            display: "<img src='data/blood.png' style='width:calc(80% - 2px);height:calc(80% - 2px);margin:10%'></img>",
            tooltip() { 
                return format(player[this.layer].buyables[this.id], 0) + " Blood Power" + 
                    (player[this.layer].apAllocated.includes(this.id) ? `<br/><h5>×${format(tmp[this.layer].buyables[this.id].selfBoost)}` : "") 
                },
            canAfford() { return player.metaAspects.apMax > player.metaAspects.apAllocated.length || player[this.layer].apAllocated.includes(this.id) },
            effect(x) { return new Decimal(1).add(x || getBuyableAmount(this.layer, this.id)).sqrt() },
            selfBoost() {
                let eff = new Decimal(1)
                if (hasUpgrade("metaAspects", 135)) eff = eff.mul(upgradeEffect("metaAspects", 135))
                return eff
            },
            buy() {
                let index = player[this.layer].apAllocated.indexOf(this.id)
                if (index >= 0) player[this.layer].apAllocated.splice(index, 1)
                else player[this.layer].apAllocated.push(this.id)
            },
            style() {
                return {
                    ...nodeStyle,
                    position: "absolute", left: "-37.50px", top: "262.50px",
                    background: tmp[this.layer].buyables[this.id].canAfford ? "#3e1601" : "",
                    "box-shadow": player[this.layer].apAllocated.includes(this.id) ? 
                        "var(--hqProperty2a), 0 0 0 2px var(--background), 0 0 0 3px #ffffff" : 
                        "var(--hqProperty2a), var(--hqProperty2b)",
                }
            },
        },
    },

    upgrades: {
        rows: 13,
        cols: 9,
        11: {
            title: "<p style='transform: scale(-1, -1)'><alternate>EXTRA APPARATUS</alternate>",
            description: "Get an extra Apparatus.",
            cost: () => Decimal.pow(9 + player.metaAspects.apMax, player.metaAspects.apMax),
            currencyLocation() { return player[this.layer].buyables },
            currencyDisplayName: "Apparatus Power",
            currencyInternalName: 10,
            onPurchase() {
                player[this.layer].apMax++
                if (player[this.layer].apMax < 13) 
                    player[this.layer].upgrades.splice(player[this.layer].upgrades.indexOf("11"), 1)
            },
            unlocked() { return player.metaAspects.apAllocated.includes("10") },
        },
        12: {
            title: "<p style='transform: scale(-1, -1)'><alternate>GLOBAL BOOSTER</alternate>",
            description: "Apparatus Power boosts all power gain.",
            cost: new Decimal(1000),
            effect() {
                return player.metaAspects.buyables["10"].add(10).log10()
            },
            effectDisplay() { return "×" + format(tmp[this.layer].upgrades[this.id].effect) },
            currencyLocation() { return player[this.layer].buyables },
            currencyDisplayName: "Apparatus Power",
            currencyInternalName: 10,
            unlocked() { return player.metaAspects.apAllocated.includes("10") },
        },
        13: {
            title: "<p style='transform: scale(-1, -1)'><alternate>ECHELADDER BONUS</alternate>",
            description: "Skaia Level boosts all power gain.",
            cost: new Decimal(1000000),
            effect() {
                return player.skaia.level
            },
            effectDisplay() { return "×" + format(tmp[this.layer].upgrades[this.id].effect) },
            currencyLocation() { return player[this.layer].buyables },
            currencyDisplayName: "Apparatus Power",
            currencyInternalName: 10,
            unlocked() { return player.metaAspects.apAllocated.includes("10") },
        },
        14: {
            title: "<p style='transform: scale(-1, -1)'><alternate>RETURN TO SENDER</alternate>",
            description: "Aspect Power boosts all power gain.",
            cost: new Decimal(1000000000),
            effect() {
                return player.metaAspects.points.add(10).log10()
            },
            effectDisplay() { return "×" + format(tmp[this.layer].upgrades[this.id].effect) },
            currencyLocation() { return player[this.layer].buyables },
            currencyDisplayName: "Apparatus Power",
            currencyInternalName: 10,
            unlocked() { return player.metaAspects.apAllocated.includes("10") },
        },
        15: {
            title: "<p style='transform: scale(-1, -1)'><alternate>ECHELADDER BONUS</alternate>",
            description: "Active Aspparata count boosts all power gain.",
            cost: new Decimal(1e12),
            effect() {
                let len = player.metaAspects.apAllocated.length
                return Decimal.pow(len + 1, len / 20 + 1)
            },
            effectDisplay() { return "×" + format(tmp[this.layer].upgrades[this.id].effect) },
            currencyLocation() { return player[this.layer].buyables },
            currencyDisplayName: "Apparatus Power",
            currencyInternalName: 10,
            unlocked() { return player.metaAspects.apAllocated.includes("10") },
        },
        21: {
            ...apparatusUpg,
            title: "SPACE TIME REBOOT",
            description: "Time Power boosts Space Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("11")) return new Decimal(1)
                return player.metaAspects.buyables["11"].add(10).log10()
            },
            target: "12",
            targetName: "Space Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("11") },
        },
        22: {
            ...apparatusUpg,
            title: "SPEED UP",
            description: "Time Power boosts Apparatus Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("11")) return new Decimal(1)
                return player.metaAspects.buyables["11"].add(1).pow(.2)
            },
            target: "10",
            targetName: "Apparatus Power",
            costPow: 1.2,
            unlocked() { return player.metaAspects.apAllocated.includes("11") },
        },
        25: {
            ...apparatusUpg,
            title: "TIME SYNERGY",
            description: "Time Power boosts itself.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("11")) return new Decimal(1)
                return player.metaAspects.buyables["11"].add(10).ln()
            },
            target: "11",
            targetName: "Time Power",
            costPow: 1.5,
            unlocked() { return player.metaAspects.apAllocated.includes("11") },
        },
        31: {
            ...apparatusUpg,
            title: "OF TIME AND SPACE",
            description: "Space Power boosts Time Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("12")) return new Decimal(1)
                return player.metaAspects.buyables["12"].add(10).log10()
            },
            target: "11",
            targetName: "Time Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("12") },
        },
        32: {
            ...apparatusUpg,
            title: "EXPANSION",
            description: "Space Power boosts Apparatus Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("12")) return new Decimal(1)
                return player.metaAspects.buyables["12"].add(1).pow(.2)
            },
            target: "10",
            targetName: "Apparatus Power",
            costPow: 1.2,
            unlocked() { return player.metaAspects.apAllocated.includes("12") },
        },
        35: {
            ...apparatusUpg,
            title: "SPACE SYNERGY",
            description: "Space Power boosts itself.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("12")) return new Decimal(1)
                return player.metaAspects.buyables["12"].add(10).ln()
            },
            target: "12",
            targetName: "Space Power",
            costPow: 1.5,
            unlocked() { return player.metaAspects.apAllocated.includes("12") },
        },
        41: {
            ...apparatusUpg,
            title: "HEART BOOSTS SPACE",
            description: "Heart Power boosts Space Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("13")) return new Decimal(1)
                return player.metaAspects.buyables["13"].add(10).log10()
            },
            target: "12",
            targetName: "Space Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("13") },
        },
        45: {
            ...apparatusUpg,
            title: "HEART SYNERGY",
            description: "Heart Power boosts itself.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("13")) return new Decimal(1)
                return player.metaAspects.buyables["13"].add(10).ln()
            },
            target: "13",
            targetName: "Heart Power",
            costPow: 1.5,
            unlocked() { return player.metaAspects.apAllocated.includes("13") },
        },
        51: {
            ...apparatusUpg,
            title: "MIND BOOSTS SPACE",
            description: "Mind Power boosts Space Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("14")) return new Decimal(1)
                return player.metaAspects.buyables["14"].add(10).log10()
            },
            target: "12",
            targetName: "Space Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("14") },
        },
        55: {
            ...apparatusUpg,
            title: "MIND SYNERGY",
            description: "Mind Power boosts itself.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("14")) return new Decimal(1)
                return player.metaAspects.buyables["14"].add(10).ln()
            },
            target: "14",
            targetName: "Mind Power",
            costPow: 1.5,
            unlocked() { return player.metaAspects.apAllocated.includes("14") },
        },
        61: {
            ...apparatusUpg,
            title: "HOPE BOOSTS HEART",
            description: "Hope Power boosts Heart Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("15")) return new Decimal(1)
                return player.metaAspects.buyables["15"].add(10).log10()
            },
            target: "13",
            targetName: "Heart Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("15") },
        },
        65: {
            ...apparatusUpg,
            title: "HOPE SYNERGY",
            description: "Hope Power boosts itself.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("15")) return new Decimal(1)
                return player.metaAspects.buyables["15"].add(10).ln()
            },
            target: "15",
            targetName: "Hope Power",
            costPow: 1.5,
            unlocked() { return player.metaAspects.apAllocated.includes("15") },
        },
        71: {
            ...apparatusUpg,
            title: "RAGE BOOSTS MIND",
            description: "Rage Power boosts Mind Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("16")) return new Decimal(1)
                return player.metaAspects.buyables["16"].add(10).log10()
            },
            target: "14",
            targetName: "Mind Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("16") },
        },
        75: {
            ...apparatusUpg,
            title: "RAGE SYNERGY",
            description: "Rage Power boosts itself.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("16")) return new Decimal(1)
                return player.metaAspects.buyables["16"].add(10).ln()
            },
            target: "16",
            targetName: "Rage Power",
            costPow: 1.5,
            unlocked() { return player.metaAspects.apAllocated.includes("16") },
        },
        81: {
            ...apparatusUpg,
            title: "LIGHT BOOSTS TIME",
            description: "Light Power boosts Time Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("17")) return new Decimal(1)
                return player.metaAspects.buyables["17"].add(10).log10()
            },
            target: "11",
            targetName: "Time Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("17") },
        },
        82: {
            ...apparatusUpg,
            title: "LIGHT BOOSTS SPACE",
            description: "Light Power boosts Space Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("17")) return new Decimal(1)
                return player.metaAspects.buyables["17"].add(10).log10()
            },
            target: "12",
            targetName: "Space Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("17") },
        },
        85: {
            ...apparatusUpg,
            title: "LIGHT SYNERGY",
            description: "Light Power boosts itself.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("17")) return new Decimal(1)
                return player.metaAspects.buyables["17"].add(10).ln()
            },
            target: "17",
            targetName: "Light Power",
            costPow: 1.5,
            unlocked() { return player.metaAspects.apAllocated.includes("17") },
        },
        91: {
            ...apparatusUpg,
            title: "VOID BOOSTS LIGHT",
            description: "Void Power boosts Light Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("18")) return new Decimal(1)
                return player.metaAspects.buyables["18"].add(10).log10()
            },
            target: "17",
            targetName: "Light Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("18") },
        },
        95: {
            ...apparatusUpg,
            title: "VOID SYNERGY",
            description: "Void Power boosts itself.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("18")) return new Decimal(1)
                return player.metaAspects.buyables["18"].add(10).ln()
            },
            target: "18",
            targetName: "Void Power",
            costPow: 1.5,
            unlocked() { return player.metaAspects.apAllocated.includes("18") },
        },
        101: {
            ...apparatusUpg,
            title: "LIFE BLESSINGS",
            description: "Life Power boosts Apparatus Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("19")) return new Decimal(1)
                return player.metaAspects.buyables["19"].add(10).log10()
            },
            target: "10",
            targetName: "Apparatus Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("19") },
        },
        105: {
            ...apparatusUpg,
            title: "LIFE SYNERGY",
            description: "Life Power boosts itself.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("19")) return new Decimal(1)
                return player.metaAspects.buyables["19"].add(10).ln()
            },
            target: "19",
            targetName: "Life Power",
            costPow: 1.5,
            unlocked() { return player.metaAspects.apAllocated.includes("19") },
        },
        111: {
            ...apparatusUpg,
            title: "DOOM WRATHS",
            description: "Doom Power boosts Apparatus Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("20")) return new Decimal(1)
                return player.metaAspects.buyables["20"].add(10).log10()
            },
            target: "10",
            targetName: "Apparatus Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("20") },
        },
        115: {
            ...apparatusUpg,
            title: "DOOM SYNERGY",
            description: "Doom Power boosts itself.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("20")) return new Decimal(1)
                return player.metaAspects.buyables["20"].add(10).ln()
            },
            target: "20",
            targetName: "Doom Power",
            costPow: 1.5,
            unlocked() { return player.metaAspects.apAllocated.includes("20") },
        },
        121: {
            ...apparatusUpg,
            title: "BREATH BOOSTS MIND",
            description: "Breath Power boosts Mind Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("21")) return new Decimal(1)
                return player.metaAspects.buyables["21"].add(10).log10()
            },
            target: "14",
            targetName: "Mind Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("21") },
        },
        122: {
            ...apparatusUpg,
            title: "BREATH BOOSTS HOPE",
            description: "Breath Power boosts Hope Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("21")) return new Decimal(1)
                return player.metaAspects.buyables["21"].add(10).log10()
            },
            target: "15",
            targetName: "Hope Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("21") },
        },
        123: {
            ...apparatusUpg,
            title: "BREATH BOOSTS LIGHT",
            description: "Breath Power boosts Light Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("21")) return new Decimal(1)
                return player.metaAspects.buyables["21"].add(10).log10()
            },
            target: "17",
            targetName: "Light Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("21") },
        },
        124: {
            ...apparatusUpg,
            title: "BREATH BOOSTS LIFE",
            description: "Breath Power boosts Life Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("21")) return new Decimal(1)
                return player.metaAspects.buyables["21"].add(10).log10()
            },
            target: "19",
            targetName: "Life Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("21") },
        },
        125: {
            ...apparatusUpg,
            title: "BREATH SYNERGY",
            description: "Breath Power boosts itself.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("21")) return new Decimal(1)
                return player.metaAspects.buyables["21"].add(10).ln()
            },
            target: "21",
            targetName: "Breath Power",
            costPow: 1.5,
            unlocked() { return player.metaAspects.apAllocated.includes("21") },
        },
        131: {
            ...apparatusUpg,
            title: "BLOOD BOOSTS HEART",
            description: "Breath Power boosts Heart Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("22")) return new Decimal(1)
                return player.metaAspects.buyables["22"].add(10).log10()
            },
            target: "13",
            targetName: "Heart Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("22") },
        },
        132: {
            ...apparatusUpg,
            title: "BLOOD BOOSTS RAGE",
            description: "Breath Power boosts Rage Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("22")) return new Decimal(1)
                return player.metaAspects.buyables["22"].add(10).log10()
            },
            target: "16",
            targetName: "Rage Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("22") },
        },
        133: {
            ...apparatusUpg,
            title: "BLOOD BOOSTS VOID",
            description: "Breath Power boosts Void Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("22")) return new Decimal(1)
                return player.metaAspects.buyables["22"].add(10).log10()
            },
            target: "18",
            targetName: "Void Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("22") },
        },
        134: {
            ...apparatusUpg,
            title: "BLOOD BOOSTS DOOM",
            description: "Breath Power boosts Doom Power.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("22")) return new Decimal(1)
                return player.metaAspects.buyables["22"].add(10).log10()
            },
            target: "20",
            targetName: "Doom Power",
            costPow: 1,
            unlocked() { return player.metaAspects.apAllocated.includes("22") },
        },
        135: {
            ...apparatusUpg,
            title: "BLOOD SYNERGY",
            description: "Blood Power boosts itself.",
            effect() {
                if (!player.metaAspects.apAllocated.includes("22")) return new Decimal(1)
                return player.metaAspects.buyables["22"].add(10).ln()
            },
            target: "22",
            targetName: "Blood Power",
            costPow: 1.5,
            unlocked() { return player.metaAspects.apAllocated.includes("22") },
        },
    },

    update(delta) {
        player.metaAspects.points = player.metaAspects.points.add(tmp.metaAspects.effect.selfGain.mul(delta))
        for (let a of player.metaAspects.apAllocated) {
            player.metaAspects.buyables[a] = player.metaAspects.buyables[a].add(tmp.metaAspects.buyables[a].selfBoost.mul(tmp.metaAspects.effect.globalGain).mul(delta))
        }
    },
    
    microtabs: {
        stuff: {
            "Aspects": {
                content: [
                    ["blank", "25px"],
                    ["display-text", () => `Your aspects are giving you ${format(tmp.metaAspects.effect.selfGain)} Aspect Points per second.`],
                    ["display-text", `<h5 style='opacity:0.5'>Click on a node to toggle producing its resource.<br/>
                                        Upgrades are only active when visible, except for Apparatus Upgrades.<br/>
                                        Most upgrades will increase the price of each other when bought, so choose wisely!</h5>`],
                                        ["display-text", () => tmp.metaAspects.effect.globalGain.gt(1) ? `Global power multiplier: ×${format(tmp.metaAspects.effect.globalGain)}.` : ""],
                    ["blank", "25px"],
                    "respec-button",
                    ["blank", "60px"],
                    ["row", [
                        ["row", [
                            ["buyable", "0"], 
                            ["buyable", "21"], ["buyable", "15"], ["buyable", "19"], ["buyable", "14"], 
                            ["buyable", "17"], ["buyable", "12"], ["buyable", "10"], ["buyable", "11"], ["buyable", "18"], 
                            ["buyable", "13"], ["buyable", "20"], ["buyable", "16"], ["buyable", "22"], 
                            
                        ], {position: "relative"}],
                    ], {"margin-right": "15px"}],
                    ["blank", "350px"],
                    "upgrades",
                ]
            },
        },
    },
    
    tabFormat: [
        "main-display",
        ["blank", "25px"],
        ["microtabs", "stuff"],
    ],
})