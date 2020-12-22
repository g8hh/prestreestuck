var canvas;
var ctx;
var sDensity = 0;

window.addEventListener("resize", (_=>resizeCanvas()));

function retrieveCanvasData() {
	let treeCanv = document.getElementById("treeCanvas")
	let treeTab = document.getElementById("treeTab")
	if (treeCanv===undefined||treeCanv===null) return false;
	if (treeTab===undefined||treeTab===null) return false;
	canvas = treeCanv;
	ctx = canvas.getContext("2d");
	return true;
}

function resizeCanvas() {
	if (!retrieveCanvasData()) return
	canvas.width = 0;
    canvas.height = 0;
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
		drawTree();
}

var colors_theme

function getSpirographX(t, offset = 0) { return (17 * Math.cos(t + offset) - 7 * Math.cos(17 / 7 * (t))) }
function getSpirographY(t, offset = 0) { return (17 * Math.sin(t + offset) - 7 * Math.sin(17 / 7 * (t))) }

function drawTree() {
	if (!retrieveCanvasData()) return;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (layer in layers){
		if (tmp[layer].layerShown == true && tmp[layer].branches){
			for (branch in tmp[layer].branches)
				{
					drawTreeBranch(layer, tmp[layer].branches[branch])
				}
		}
	}

	ctx.strokeStyle = (tmp[layer].branches[branch])

	if ((player.aspHope.unlocked || player.aspRage.unlocked) && sDensity < 8) sDensity++
	else if ((hasUpgrade("aspMind", 24) || (player.aspHope.unlocked && player.aspRage.unlocked)) && sDensity < 16) sDensity++
	else if (sDensity > 0) sDensity--
	if (sDensity > 0) {
		let skaia = document.getElementById("skaia").getBoundingClientRect();
		let x = skaia.left + (skaia.width / 2) + document.body.scrollLeft;
		let y = skaia.top + (skaia.height / 2) + document.body.scrollTop;
		ctx.lineWidth = 5;
		ctx.beginPath()
		ctx.strokeStyle = colors_theme[1] + sDensity.toString(16).padStart(2, "0")
		let step = Math.PI / 21
		let offset = (player.time / 600000) % (Math.PI * 2)
		ctx.moveTo(getSpirographX(0, offset) * 25 + x, getSpirographY(0, offset) * 25 + y)
		for (var t = step; t <= Math.PI * 14; t += step) {
			ctx.lineTo(getSpirographX(t, offset) * 25 + x, getSpirographY(t, offset) * 25 + y);
		}
		ctx.stroke()
	}
}

function drawTreeBranch(num1, data) { // taken from Antimatter Dimensions & adjusted slightly
	let num2 = data
	let color_id = 1

	if (Array.isArray(data)){
		num2 = data[0]
		color_id = data[1]
	}

	if(typeof(color_id) == "number")
		color_id = colors_theme[color_id]

	if (document.getElementById(num1) == null || document.getElementById(num2) == null)
		return

	let start = document.getElementById(num1).getBoundingClientRect();
    let end = document.getElementById(num2).getBoundingClientRect();
    let x1 = start.left + (start.width / 2) + document.body.scrollLeft;
    let y1 = start.top + (start.height / 2) + document.body.scrollTop;
    let x2 = end.left + (end.width / 2) + document.body.scrollLeft;
    let y2 = end.top + (end.height / 2) + document.body.scrollTop;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.strokeStyle = color_id
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
	ctx.stroke();


}