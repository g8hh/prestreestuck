var layoutInfo = {
    startTab: act == 1 ? "player1" : "none",
	showTree: () => act == 0,

    treeLayout: ""

    
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
}, 
)


addLayer("tree-tab", {
    tabFormat: [["tree", [
        act == 0 ? ["metaClasses", "aspBreath", "aspHope", "aspLife", "aspMind", "aspLight", "aspTime", "metaDerse", "skaia", "metaMeta", "aspSpace", "metaProspit", "aspVoid", "aspHeart", "aspDoom", "aspRage", "aspBlood", "metaAspects"] : 
        act == 1 ? ["player1"] :
        []
    ]]]
})