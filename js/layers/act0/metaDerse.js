var derseSigns = [
    /*              | Time   +0 | Space +1 | Mind  +2 | Heart +3 | Hope    +4 | Rage    +5 | Light  +6 | Void       +7 | Life    +8 | Doom    +9 | Breath+10| Blood  +11 */
    /* Rust      0 */ "Aries",    "Arga",    "Arza",    "Aro",     "Arrius",    "Ariborn",   "Arpia",    "Arittarius",   "Arsces",    "Armini",    "Arun",    "Arcen",
    /* Bronze   12 */ "Tauries",  "Taurga",  "Taurza",  "Tauro",   "Taurrius",  "Tauriborn", "Taurpia",  "Taurittarius", "Taursces",  "Taurmini",  "Taurun",  "Taurcen",
    /* Gold     24 */ "Gemries",  "Gemga",   "Gemza",   "Gemo",    "Gemrius",   "Gemiborn",  "Gempia",   "Gemittarius",  "Gemsces",   "Gemini",    "Gemun",   "Gemcen",
    /* Lime     36 */ "Canries",  "Canga",   "Canza",   "Cano",    "Canrius",   "Caniborn",  "Canpia",   "Canittarius",  "Cansces",   "Camini",    "Canun",   "Cancen",
    /* Olive    48 */ "Leries",   "Lega",    "Leza",    "Leo",     "Lerius",    "Leiborn",   "Lepia",    "Leittarius",   "Lesces",    "Lemini",    "Leun",    "Lecen",
    /* Jade     60 */ "Viries",   "Virga",   "Virza",   "Viro",    "Virrius",   "Viriborn",  "Virpia",   "Virittarius",  "Virsces",   "Virmini",   "Virun",   "Vircen",
    /* Teal     72 */ "Libries",  "Liga",    "Libza",   "Libo",    "Librius",   "Libiborn",  "Lipia",    "Libittarius",  "Libsces",   "Limini",    "Libun",   "Licen",
    /* Blue     84 */ "Scories",  "Scorga",  "Scorza",  "Scoro",   "Scorrius",  "Scoriborn", "Scorpia",  "Scorittarius", "Scorsces",  "Scormini",  "Scorun",  "Scorcen",
    /* Indigo   96 */ "Sagiries", "Sagiga",  "Sagiza",  "Sagio",   "Sagirius",  "Sagiborn",  "Sagipia",  "Sagittarius",  "Sagisces",  "Sagimini",  "Sagiun",  "Sagicen",
    /* Purple  108 */ "Capries",  "Capriga", "Capriza", "Caprio",  "Capririus", "Capriborn", "Capripia", "Caprittarius", "Caprisces", "Caprimini", "Capriun", "Capricen",
    /* Violet  120 */ "Aquaries", "Aquaga",  "Aquaza",  "Aquo",    "Aquarius",  "Aquiborn",  "Aquapia",  "Aquittarius",  "Aquasces",  "Aquamini",  "Aquiun",  "Aquacen",
    /* Fuchsia 132 */ "Piries",   "Piga",    "Piza",    "Pio",     "Pirius",    "Piborn",    "Pipia",    "Pittarius",    "Pisces",    "Pimini",    "Piun",    "Picen",
]

if (act == "0.1") addLayer("metaDerse", {
    name: "Derse",
    symbol: "D",
    row: 10,
    position: 1,

    layerShown() { return false },
    resource: "Derse Points",
    color: "#ff40fe",

    type: "static",
    baseResource: "Class Points",
    resetDescription: "Abolish your aspect and class progress to get ",
    baseAmount() { return player.metaClasses.points },
    requires() {
        var req = new Decimal(1e130)
        return req
    },
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

    startData() {
        return {
            points: new Decimal(0),
        }
    },

    
})