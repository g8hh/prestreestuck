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
        // demo, content may change
        /* 3: {
            content: () => `
                <br/><br/>
                [insert a gif with a joke name then the message "not funny, dumbass" appears here]
                <br/><br/>
            `,
            pesterlog: () => [
                ["start", "pa", "cc", "15:32"],
                ["msg", "cc", "<p style='transform: scale(-1, -1)'><alternate>UMM</alternate></p>", "right"],
                ["msg", "cc", "<p style='transform: scale(-1, -1)'><alternate>I THINK I DID SOMETHING WRONG WITH MY COMPUTER</alternate></p>", "right"],
                ["msg", "cc", "<p style='transform: scale(-1, -1)'><alternate>EVERYTHING I TYPE TURNS INTO THIS KIND OF MYSTIC LANGUAGE AND I DONT KNOW HOW TO TURN IT OFF</alternate></p>", "right"],
                ["msg", "cc", "<p style='transform: scale(-1, -1)'><alternate>CAN YOU HELP ME PLEASE</alternate></p>", "right"],
                ["msg", "pa", "Uhh"],
                ["msg", "pa", "Your language looks weird"],
                ["msg", "pa", "Are you sure you didn't tamper with your computer settings?"],
                ["msg", "cc", "<p style='transform: scale(-1, -1)'><alternate>I CHECKED MY COMPUTER SETTINGS AND I DONT SEE ANYTHING WRONG WITH IT</alternate></p>", "right"],
                ["msg", "cc", "<p style='transform: scale(-1, -1)'><alternate>EVERYTHING IS SET TO ENGLISH AND I KEEP TALKING LIKE THIS</alternate></p>", "right"],
                ["msg", "cc", "<p style='transform: scale(-1, -1)'><alternate>HELP PLEASE</alternate></p>", "right"],
                ["msg", "pa", "I realized that I can select your text and copy-paste it into somewhere else and it would say your messages in English"],
                ["msg", "pa", "Have you checked your Pesterchum settings?"],
                ["msg", "cc", "<p style='transform: scale(-1, -1)'><alternate>WAIT I HAVENT TRIED THAT</alternate></p>", "right"],
                ["msg", "cc", "<p style='transform: scale(-1, -1)'><alternate>LET ME SEE</alternate></p>", "right"],
                ["msg", "cc", "is it work?", "right"],
                ["msg", "cc", "hey, it worked", "right"],
                ["msg", "cc", "thanks", "right"],
                ["msg", "pa", "No problem"],
                ["msg", "pa", "I'm glad that I could help"],
                ["msg", "cc", "it's weird though", "right"],
                ["msg", "cc", "it seems like there is one setting that they have added to it recently", "right"],
                ["msg", "cc", "it is brand new too, i have never seen it or heard of it before", "right"],
                ["msg", "cc", "it's also odd that it happened during my talk with someone else", "right"],
                ["msg", "pa", "What is it though"],
                ["msg", "pa", "I looked at my Pesterchum settings and found nothing irregular"],
                ["msg", "cc", "my pesterchum keyboard input was changed into another language", "right"],
                ["msg", "cc", "it's alternia, i think", "right"],
                ["msg", "cc", "oh what", "right"],
                ["msg", "cc", "the language's gone", "right"],
                ["msg", "pa", "I've never heard of that language in my life"],
                ["msg", "cc", "it's from the prestreestuck", "right"],
                ["msg", "pa", "That Homestuck game?"],
                ["msg", "cc", "and i heard that it is a derivative of another language", "right"],
                ["msg", "pa", "I think I know it"],
                ["msg", "cc", "know what?", "right"],
                ["msg", "pa", "I looked at your problem online and found that they are doing some beta testing for support of new languages"],
                ["msg", "pa", "And your problem seems to be that they added wrong people into the testing program"],
                ["msg", "pa", "Ah well, mistakes happen all the time"],
                ["msg", "cc", "haha", "right"],
                ["msg", "pa", "Still found it weird that they're adding support for conlangs though"],
                ["msg", "pa", "Probably they're planning for an easter egg"],
                ["msg", "pa", "Oh and by the way, do you heard of the new game that's on the news recently?"],
                ["msg", "cc", "that new sburb game?", "right"],
                ["msg", "pa", "<i class='courier'>Sburb^2: Ascension</i>, to be precise"],
                ["msg", "pa", "Apparently I've been accepted to be a beta tester of that thing"],
                ["msg", "cc", "wow, you are a tester of it?", "right"],
                ["msg", "cc", "that's cool", "right"],
                ["msg", "cc", "i wonder how sburb will be in real life", "right"],
                ["msg", "pa", "It'll be huge, otherwise it won't be on the news"],
                ["msg", "cc", "lol", "right"],
                ["msg", "cc", "you made me laughed twice", "right"],
                ["msg", "pa", "Anyways, they also told me of the people that's also in the internal testing program"],
                ["msg", "pa", "You are also in the list"],
                ["msg", "cc", "wow, really?", "right"],
                ["msg", "pa", "Yeah, as fas as I can see"],
                ["msg", "pa", "They'll probably reach out to you soon"],
                ["msg", "cc", "i'm so excited for this", "right"],
                ["msg", "cc", "first that homestuck idle game, now i got to be one of the first people to play the real sburb adaptation?", "right"],
                ["msg", "cc", "best day of my life!", "right"],
                ["msg", "cc", "hey, i've got a mail", "right"],
                ["msg", "pa", "It's probably the beta testing invite"],
                ["msg", "pa", "Go check it"],
                ["msg", "cc", "okay", "right"],
                ["msg", "cc", "i'll be back", "right"],
                ["end", "cc", "pa", "15:45"],
            ],
            commands: [
                // { page: 4, title: "Try again." }
            ]
        }, */
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
