var layoutInfo = {
    startTab: act == 1 ? "player1" : "none",
	showTree: () => act.startsWith("0"),

    treeLayout: ""

    
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
}, 
)


addLayer("tree-tab", {
    tabFormat: [["tree", [
        act == "0.0" ? ["aspBreath", "aspHope", "aspLife", "aspMind", "aspLight", "aspTime", "skaia", "aspSpace", "aspVoid", "aspHeart", "aspDoom", "aspRage", "aspBlood"] : 
        act == "0.1" ? ["metaClasses", "metaDerse", "skaia", "metaProspit", "metaAspects"] : 
        act == "0.2" ? ["metaMeta"] : 
        act == 1 ? ["player1"] :
        []
    ]]]
})