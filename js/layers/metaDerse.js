var derseSigns = [
    /*          | Time      | Space    | Mind     | Heart    | Hope       | Rage       | Light     | Void          | Life       | Doom       | Breath   | Blood      */
    /* Rust    */ "Aries",    "Arga",    "Arza",    "Aro",     "Arrius",    "Ariborn",   "Arpia",    "Arittarius",   "Arsces",    "Armini",    "Arun",    "Arcen",
    /* Bronze  */ "Tauries",  "Taurga",  "Taurza",  "Tauro",   "Taurrius",  "Tauriborn", "Taurpia",  "Taurittarius", "Taursces",  "Taurmini",  "Taurun",  "Taurcen",
    /* Gold    */ "Gemries",  "Gemga",   "Gemza",   "Gemo",    "Gemrius",   "Gemiborn",  "Gempia",   "Gemittarius",  "Gemsces",   "Gemini",    "Gemun",   "Gemcen",
    /* Lime    */ "Canries",  "Canga",   "Canza",   "Cano",    "Canrius",   "Caniborn",  "Canpia",   "Canittarius",  "Cansces",   "Camini",    "Canun",   "Cancen",
    /* Olive   */ "Leries",   "Lega",    "Leza",    "Leo",     "Lerius",    "Leiborn",   "Lepia",    "Leittarius",   "Lesces",    "Lemini",    "Leun",    "Lecen",
    /* Jade    */ "Viries",   "Virga",   "Virza",   "Viro",    "Virrius",   "Viriborn",  "Virpia",   "Virittarius",  "Virsces",   "Virmini",   "Virun",   "Vircen",
    /* Teal    */ "Libries",  "Liga",    "Libza",   "Libo",    "Librius",   "Libiborn",  "Lipia",    "Libittarius",  "Libsces",   "Limini",    "Libun",   "Licen",
    /* Blue    */ "Scories",  "Scorga",  "Scorza",  "Scoro",   "Scorrius",  "Scoriborn", "Scorpia",  "Scorittarius", "Scorsces",  "Scormini",  "Scorun",  "Scorcen",
    /* Indigo  */ "Sagiries", "Sagiga",  "Sagiza",  "Sagio",   "Sagirius",  "Sagiborn",  "Sagipia",  "Sagittarius",  "Sagisces",  "Sagimini",  "Sagiun",  "Sagicen",
    /* Purple  */ "Capries",  "Capriga", "Capriza", "Caprio",  "Capririus", "Capriborn", "Capripia", "Caprittarius", "Caprisces", "Caprimini", "Capriun", "Capricen",
    /* Violet  */ "Aquaries", "Aquaga",  "Aquaza",  "Aquo",    "Aquarius",  "Aquiborn",  "Aquapia",  "Aquittarius",  "Aquasces",  "Aquamini",  "Aquiun",  "Aquacen",
    /* Fuchsia */ "Piries",   "Piga",    "Piza",    "Pio",     "Pirius",    "Piborn",    "Pipia",    "Pittarius",    "Pisces",    "Pimini",    "Piun",    "Picen",
]

addLayer("metaDerse", {
    name: "Derse",
    symbol: "D",
    row: 10,
    position: 1,

    layerShown() { return hasUpgrade("skaia", 31) && hasUpgrade("skaia", 50) },
    resource: "Derse Points",
    color: "#ff40fe",

    type: "static",
    baseResource: "Class Points",
    resetDescription: "Abolish your aspect and class progress to get ",
    baseAmount() { return player.metaClasses.points },
    requires: new Decimal(1e130),
    canBuyMax() { return false },
    base: 1e6,
    exponent: 1.4,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },

    effect() {
        var e = {
            popGain: player[this.layer].points.pow(player[this.layer].points.mul(3).sqrt()),
        }

        if (hasUpgrade("skaia", 56)) e.popGain = e.popGain.mul(player.metaProspit.population.add(1).log(10).add(1))
        if (hasUpgrade("skaia", 57)) e.popGain = e.popGain.mul(player.metaProspit.points.add(1).pow(2.5))
        if (hasUpgrade("skaia", 59)) e.popGain = e.popGain.mul(player[this.layer].population.add(1).log(10).add(1).pow(1.2))
        if (hasUpgrade("skaia", 61)) e.popGain = e.popGain.mul(tmp.skaia.upgrades[61].effect)

        return e
    },
    effectDescription() {
        eff = this.effect();
        return "which are giving you " + format(eff.popGain) + " Dersites per second."
    },

    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            population: new Decimal(0),
        }
    },

    buyables: (() => {
        var c = { rows: 12, cols: 12, }
        var cost = new Decimal(25)
        for (var sign in prospitSigns) {
            var index = 11 + (sign - 0)
            c[index] = {}
            c[index].title = function () {
                return format(getBuyableAmount("metaDerse", this.id), 0) + "<br/>" + derseSigns[this.id - 11]
            }
            c[index].display = function () {
                var bought = getBuyableAmount("metaDerse", this.id).gt(0)
                return bought ? "which are giving a<br/>" + format(buyableEffect(this.layer, this.id), 2) + "×<br/>boost to<br/>" +
                    (this.id < 23 ? ["Time", "Space", "Mind", "Heart", "Hope", "Rage", "Light", "Void", "Life", "Doom", "Breath", "Blood"][this.id - 11] + " Essence" : derseSigns[this.id - 23] + " gain") + "."
                    : "Cost: " + format(this.cost) + " Dersites"
            }
            c[index].cost = cost
            c[index].style = function () {
                var bought = getBuyableAmount("metaDerse", this.id).gt(0)
                var hc = this.id == 58 ? "#adabac" : getHemospectrum(Math.floor((this.id - 11) / 12))
                return {
                    "width": "100px", "height": "100px", "margin": "0", "font-size": "50%",
                    "color": bought ? hc : "",
                    "background-color": bought ? "black" : "",
                    "border": bought ? "2px solid " + hc + "3f" : "",
                    "box-shadow": bought ? "inset 0 0 25px " + hc : "",
                }
            }
            c[index].canAfford = function () {
                return player[this.layer].buyables[this.id].lte(0) && player[this.layer].population.gte(this.cost)
            }
            c[index].buy = function () {
                player[this.layer].population = player[this.layer].population.sub(this.cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
            c[index].effect = function (x) {
                if (this.id - 0 < 23) return (x || getBuyableAmount(this.layer, this.id)).add(1).log(10).pow(1.25).add(1)
                else return (x || getBuyableAmount(this.layer, this.id)).mul(2.5).pow(0.85).add(1)
            }

            cost = cost.mul(1.5 ** (Math.floor(sign / 12 + 1) ** 1.6))
            if (((sign - -1) % 12) == 0) cost = cost.div(1.5 ** (Math.floor(sign / 12 + 1) ** 2.25))
        }

        var cost = new Decimal(1e9)

        for (var a = 0; a < 12; a++) {
            var index = 156 + a
            c[index] = {}
            c[index].unlocked = () => hasUpgrade("skaia", 60)
            c[index].title = function () {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/>Abolishments"
            }
            c[index].display = function () {
                var obj = tmp[this.layer].buyables[this.id]
                return"which are giving a<br/>" + format(buyableEffect(this.layer, this.id), 2) + "×<br/>boost to all<br/>" +
                    getHemospectrumName(this.id - 156) + " sign gains<br/>Requires: " + format(this.cost()) + " Dersites"
            }
            c[index].baseCost = cost
            c[index].cost = function () {
                return this.baseCost.pow(getBuyableAmount(this.layer, this.id).add(1).pow(1.2))
            }
            c[index].effect = function () {
                return Decimal.pow(10, getBuyableAmount(this.layer, this.id))
            }
            c[index].canAfford = function () {
                return player[this.layer].population.gte(tmp[this.layer].buyables[this.id].cost)
            }
            c[index].buy = function () {
                doReset(this.layer, true)
                player[this.layer].population = new Decimal(0)
                for (var a = 11; a < (this.id - 155) * 12 + 11; a++) setBuyableAmount(this.layer, a, new Decimal(0))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
            c[index].style = function () {
                var buyable = tmp[this.layer].buyables[this.id].canAfford
                var hc = getHemospectrum(this.id - 156)
                return {
                    "width": "100px", "height": "100px", "border-radius": "0", "margin": "0", "font-size": "50%",
                    "border": buyable ? "2px solid " + hc + "3f" : "2px solid #0000002f",
                    "background-color": buyable ? hc : "",
                }
            }

            cost = cost.mul(1.5 ** ((a + 1) ** 2.25 * 6))
        }
        return c;
    })(),
    milestones: (() => {
        var m = {}
        var cost = new Decimal(25)
        for (var index = 0; index < 12; index++) {
            m[index] = {}
            m[index].unlocked = () => hasUpgrade("skaia", 55)
            m[index].requirementDescription = function () {
                return "<h3 style='font-size:12px'>Dersite " + getHemospectrumName(this.id) + " Symphony</h3>"
            }
            m[index].done = function () {
                for (var a = this.id * 12 + 11; a < this.id * 12 + 23; a++) if (getBuyableAmount(this.layer, a).lte(0)) return false
                return true
            }
            m[index].effectDescription = function () {
                return [
                    "All Rust sign effects boosts Class Point gain.<br/>Currently: ×" + format(tmp[this.layer].milestones[this.id].effect),
                    "All Bronze sign effects boosts all Aspect Point effects.<br/>Currently: ×" + format(tmp[this.layer].milestones[this.id].effect),
                    "<i>Not yet implemented.</i>",
                    "<i>Not yet implemented.</i>",
                    "<i>Not yet implemented.</i>",
                    "<i>Not yet implemented.</i>",
                    "<i>Not yet implemented.</i>",
                    "<i>Not yet implemented.</i>",
                    "<i>Not yet implemented.</i>",
                    "<i>Not yet implemented.</i>",
                    "<i>Not yet implemented.</i>",
                    "<i>Not yet implemented.</i>",
                ][this.id]
            }
            m[index].effect = function () {
                var eff = new Decimal(1)
                for (var a = this.id * 12 + 11; a < this.id * 12 + 23; a++) eff = eff.mul(buyableEffect(this.layer, a))
                eff = [
                    eff.pow(0.5),
                    Decimal.pow(10, eff.add(1).pow(2).log(10).pow(2.5)),
                    new Decimal(1),
                    new Decimal(1),
                    new Decimal(1),
                    new Decimal(1),
                    new Decimal(1),
                    new Decimal(1),
                    new Decimal(1),
                    new Decimal(1),
                    new Decimal(1),
                    new Decimal(1),
                ][this.id]
                return eff
            },
                m[index].style = function () {
                    var owned = hasMilestone(this.layer, this.id)
                    var hc = getHemospectrum(this.id)
                    return {
                        "width": "296px", "height": "96px", "margin": "0", "padding": "0", "border-radius": "25px 0 0 25px", "font-size": "60%", "vertical-align": "middle",
                        "border": owned ? "2px solid " + hc + "3f" : "2px solid #0000002f",
                        "color": owned ? "#000000af" : "",
                        "background-color": owned ? hc + "af" : "",
                        "box-shadow": owned ? "inset 0 0 25px " + hc : "",
                    }
                }
        }
        return m;
    })(),


    microtabs: {
        stuff: {
            "Signs Viewer": {
                content: (() => {
                    var m = [
                    ]
                    for (var a = 0; a < 12; a++) {
                        var r = []
                        for (var b = 0; b < 12; b++) {
                            r.push(["buyable", a * 12 + b + 11]);
                        }
                        r.push(["milestone", a])
                        r.push(["buyable", a + 156]);
                        m.push(["row", r])
                    }
                    return [
                        ["blank", "15px"],
                        ["signs-holder", m],
                    ]
                })(),
            },
        },
    },

    update(delta) {
        player[this.layer].population = player[this.layer].population.add(tmp[this.layer].effect.popGain.mul(delta));
        if (player[this.layer].points.gt(0)) for (var a = 11; a < 155; a++) {
            if (getBuyableAmount(this.layer, a).gt(0)) {
                var gain = new Decimal(1).mul(a < 143 ? buyableEffect(this.layer, a + 12) : 1).mul(buyableEffect(this.layer, Math.floor((a - 11) / 12 + 156)))
                setBuyableAmount(this.layer, a, getBuyableAmount(this.layer, a).add(gain.mul(delta)))
            }
        }
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        ["blank", "15px"],
        ["display-text", () => "Derse is currently having <h2 style='color:#ff40fe;text-shadow:#ff40fe 0 0 10px'>" + formatWhole(player.metaDerse.population) + "</h2> Dersites."],
        ["blank", "15px"],
        ["microtabs", "stuff"],
        ["blank", "35px"],
    ],


    // oh my god update teaser

})