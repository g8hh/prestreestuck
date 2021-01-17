var layoutInfo = {
    startTab: "none",
	showTree: true,

    treeLayout: ""

    
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
}, 
)


addLayer("tree-tab", {
    tabFormat: [["tree", [
        ["metaClasses", "aspBreath", "aspHope", "aspLife", "aspMind", "aspLight", "aspTime", "skaia", "aspSpace", "aspVoid", "aspHeart", "aspDoom", "aspRage", "aspBlood", "metaAspects"],
    ]]]
})