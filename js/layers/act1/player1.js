if (act == 1) addLayer("player1", {
    name: "?",
    symbol: "?",
    row: 0,
    position: 0,
    branches: [],

    layerShown() { return true },
    resource: "",
    type: "none",
    color: "#ffffff",

    tooltip() {
        return ""
    },

    story: {
        1: {
            content: () => `
                <img src="data/player1/0001.gif"/>
                <br/><br/>
                Alright, yes, finally!
                <br/><br/>
                You've just finally did it!
                <br/><br/>
                You've spent your last ${formatWhole(player.timePlayed / 86400)} days playing that one game about Homestuck and
                prestige trees and you've beaten it! Now you don't need to play that monstrosity of a game anymore! Like it's
                even Homestuck related, where is my Jonh Ebgrte!?? Where is Act 1?? Why is it using like 90% of my computer's
                power usage? Did the developer add a bitcoin miner in this game? Or is this bad optimizing? You have so many
                questions about this game, so much that you know telling all of them here will be a waste of time for everyone.
                <br/><br/>
                You're just so excited about this. Might as well try to remake the Homestuck intro just to celebrate your freedom
                from that game. You don't know why, but you just feel like it. Oh, it's April 13th. That explains why.
            `,
            commands: [
                { page: 2, title: "The Prestreestuck: Act 1" }
            ]
        },
        2: {
            content: () => `
                <h2>Act 1</h2><br/>
                - The Incrementalism -
                <br/><br/>
                <img src="data/player1/0002_original.png"/>
                <br/><br/>
                A young man stands in their room. It is just so happen that today, April 13th 2021, is the day you've finished
                a game you've been playing for a long time. (if you played it for that long, oh it's also Homestuck birthday).
                This man is pretty open-minded for beating this so-called a game today, so he'll let you guess what his name is.
                <br/><br/>
                What will you think this man's name to be?
                
                <h2><br/><br/>End of content, for now</h2><br/>
                <i>Suggest a name in our discord server!</i><br/>
                <i>(or the MSPFA command section if you apparently are in my MSPFA test page)</i>
            `,
            commands: [
                // { page: 3, title: "Enter name." }
            ]
        },
    },

    tabFormat: [
        "story"
    ],

    startData() {
        return {
            points: new Decimal(0),
        }
    },
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
})
