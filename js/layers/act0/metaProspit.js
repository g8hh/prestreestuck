var prospitSigns = [
    /*              | Time   +0 | Space +1 | Mind  +2 | Heart +3 | Hope    +4 | Rage    +5 | Light  +6 | Void       +7 | Life    +8 | Doom    +9 | Breath+10| Blood  +11 */
    /* Rust      0 */ "Arist",    "Argo",    "Arra",    "Arlo",    "Arnius",    "Aricorn",   "Arpio",    "Arittanius",   "Arsci",    "Armino",    "Arus",    "Arcer",
    /* Bronze   12 */ "Taurist",  "Taurgo",  "Taurra",  "Taurlo",  "Taurnius",  "Tauricorn", "Taurpio",  "Taurittanius", "Taursci",  "Taurmino",  "Taurus",  "Taurcer",
    /* Gold     24 */ "Gemrist",  "Gemgo",   "Gemra",   "Gemlo",   "Gemnius",   "Gemicorn",  "Gempio",   "Gemittanius",  "Gemsci",   "Gemino",    "Gemus",   "Gemcer",
    /* Lime     36 */ "Canrist",  "Cango",   "Canra",   "Canlo",   "Cannius",   "Canicorn",  "Canpio",   "Canittanius",  "Cansci",   "Camino",    "Canus",   "Cancer", // <--- hold up a sec
    /* Olive    48 */ "Lerist",   "Lego",    "Lera",    "Lelo",    "Lenius",    "Leicorn",   "Lepio",    "Leittanius",   "Lesci",    "Lemino",    "Leus",    "Lecer",
    /* Jade     60 */ "Virist",   "Virgo",   "Virra",   "Virlo",   "Virnius",   "Viricorn",  "Virpio",   "Virittanius",  "Virsci",   "Virmino",   "Virus",   "Vircer",
    /* Teal     72 */ "Librist",  "Ligo",    "Libra",   "Liblo",   "Libnius",   "Libicorn",  "Lipio",    "Libittanius",  "Libsci",   "Limino",    "Libus",   "Licer",
    /* Blue     84 */ "Scorist",  "Scorgo",  "Scorra",  "Scorlo",  "Scornius",  "Scoricorn", "Scorpio",  "Scorittanius", "Scorsci",  "Scormino",  "Scorus",  "Scorcer",
    /* Indigo   96 */ "Sagirist", "Sagigo",  "Sagira",  "Sagilo",  "Saginius",  "Sagicorn",  "Sagipio",  "Sagittanius",  "Sagisci",  "Sagimino",  "Sagius",  "Sagicer",
    /* Purple  108 */ "Caprist",  "Caprigo", "Caprira", "Caprilo", "Caprinius", "Capricorn", "Capripio", "Caprittanius", "Caprisci", "Caprimino", "Caprius", "Capricer",
    /* Violet  120 */ "Aquarist", "Aquago",  "Aquara",  "Aqualo",  "Aquanius",  "Aquicorn",  "Aquapio",  "Aquittanius",  "Aquasci",  "Aquamino",  "Aquius",  "Aquacer",
    /* Fuchsia 132 */ "Pirist",   "Pigo",    "Pira",    "Pilo",    "Pinius",    "Picorn",    "Pipio",    "Pittanius",    "Pisci",    "Pimino",    "Pius",    "Picer",
]

function getHemospectrumName(pos) {
    return ["Rust", "Bronze", "Gold", "Lime", "Olive", "Jade", "Teal", "Blue", "Indigo", "Purple", "Violet", "Fuchsia"][pos]
}

function getHemospectrum(pos) {
    return ["#f42123", "#cd7f32", "#abab1a", "#98b144", "#71a020", "#2caa6b", "#26baba", "#3796c6", "#6464ff", "#a954ff", "#a937a9", "#ae4170"][pos]
}

if (act == "0.1") addLayer("metaProspit", {
    name: "Prospit",
    symbol: "P",
    row: 10,
    position: 1,

    layerShown() { return false },
    resource: "Prospit Points",
    color: "#ffff01",

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