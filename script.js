var nodeXPosList = [];
var nodeYPosList = [];

var edgeList1 = [];
var edgeList2 = [];

var bipartiteIDs = [];

var nodeRadius = 15;

var currentlyDrawingEdge = -1;

var mouseX;
var mouseY;

setInterval(draw, 50);

function mouseMoved(e) {
	console.log("mouse moved");
	var c = document.getElementById("graphcanvas");
	var rect = c.getBoundingClientRect();
	mouseX = e.pageX - rect.left;
	mouseY = e.pageY - rect.top;
}

function setup() {
	var c = document.getElementById("graphcanvas");
	c.addEventListener("click", onClick, false);
	c.addEventListener("mousemove", mouseMoved, false);
}

function onClick(e) {
	var clickedOnNode = -1;

	for (var i = 0; i < nodeXPosList.length; i++) {
		var curX = nodeXPosList[i];
		var curY = nodeYPosList[i];

		console.log(mouseX +" " + mouseY + " " + curX + " " + curY);

		console.log(distance(mouseX, mouseY, curX, curY));

		if (distance(mouseX, mouseY, curX, curY) < nodeRadius * 1.5) {
			clickedOnNode = i;
			break;
		}
	}



	if (clickedOnNode == -1) {
		if (currentlyDrawingEdge == -1) {
			nodeXPosList.push(mouseX);
      			nodeYPosList.push(mouseY);
      			bipartiteIDs.push(0);
      		} else {
      			currentlyDrawingEdge = -1;
      		}
	} else {
		if (currentlyDrawingEdge == -1) {
			currentlyDrawingEdge = clickedOnNode;
		} else {
			if (currentlyDrawingEdge != clickedOnNode) {
				edgeList1.push(currentlyDrawingEdge);
				edgeList2.push(clickedOnNode);
			}
			currentlyDrawingEdge = -1;
		}
	}
}

function distance (x1, y1, x2, y2) {
	var squared = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
	return Math.sqrt(squared);
}

function clearGraph() {
	edgeList1 = [];
	edgeList2 = [];
	nodeXPosList = [];
	nodeYPosList = [];
	bipartiteIDs = [];
	currentlyDrawingEdge = -1;
}

function checkGraph() {

	for (var i = 0; i < nodeXPosList.length; i++) {
		bipartiteIDs[i] = 0
	}

	var totalResult = true;

	for (var i = 0; i < nodeXPosList.length; i++) {

		if (bipartiteIDs[i] == 0) {
			bipartiteIDs[i] = 1;
		}

		var result = assignIDsToConnectedNodes(i);

		if (!result) {
			totalResult = false;
		}
	}

	draw();

	if (totalResult) {
		alert("The graph is bipartite!");
	} else {
		alert("The graph is NOT bipartite!");
	}
}

function assignIDsToConnectedNodes(nodeIndex) {

	var nextID = bipartiteIDs[nodeIndex] == 1 ? 2 : 1;

	var childrenToTest = [];

	for (var i = 0; i < edgeList1.length; i++) {
		if (edgeList1[i] == nodeIndex) {
			if (bipartiteIDs[edgeList2[i]] == 0) {
				bipartiteIDs[edgeList2[i]] = nextID;
				childrenToTest.push(edgeList2[i]);
			} else if (bipartiteIDs[edgeList2[i]] != nextID) {
				bipartiteIDs[edgeList2[i]] = -1;
				return false;
			}
		}
	}

	for (var i = 0; i < edgeList2.length; i++) {
		if (edgeList2[i] == nodeIndex) {
			if (bipartiteIDs[edgeList1[i]] == 0) {
				bipartiteIDs[edgeList1[i]] = nextID;
				childrenToTest.push(edgeList1[i]);
			} else if (bipartiteIDs[edgeList1[i]] != nextID) {
				bipartiteIDs[edgeList1[i]] = -1;
				return false;
			}
		}
	}

	for (var i = 0; i < childrenToTest.length; i++) {
		if (!assignIDsToConnectedNodes(childrenToTest[i])) {
			bipartiteIDs[childrenToTest[i]] = -1;
			return false;
		}
	}

	return true;
}

function draw() {

	console.log("x: " + mouseX + " y: " + mouseY);

	var c = document.getElementById("graphcanvas");
	var ctx = c.getContext("2d");
	ctx.clearRect(0, 0, c.width, c.height);

	for (var i = 0; i < nodeXPosList.length; i++) {
		var curX = nodeXPosList[i];
		var curY = nodeYPosList[i];

		ctx.beginPath();
      		ctx.arc(curX, curY, nodeRadius, 0, 2 * Math.PI, false);

      		if (bipartiteIDs[i] == 0) {
      			ctx.fillStyle = "gray";
      		} else if (bipartiteIDs[i] == 1) {
      			ctx.fillStyle = "green";
      		} else if (bipartiteIDs[i] == 2) {
      			ctx.fillStyle = "red";
      		} else {
      			ctx.fillStyle = "orange";
      		}

      		ctx.fill();
      		ctx.lineWidth = 5;
      		ctx.strokeStyle = "#003300";
      		ctx.stroke();
	}

	if (currentlyDrawingEdge != -1) {
		var startX = nodeXPosList[currentlyDrawingEdge];
		var startY = nodeYPosList[currentlyDrawingEdge];

		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(mouseX, mouseY);
		ctx.stroke();
	}

	for (var i = 0; i < edgeList1.length; i++) {
		var startX = nodeXPosList[edgeList1[i]];
		var startY = nodeYPosList[edgeList1[i]];

		var endX = nodeXPosList[edgeList2[i]];
		var endY = nodeYPosList[edgeList2[i]];

		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(endX, endY);
		ctx.stroke();
	}
}








//---------------------------------------



// var counter = -1;
// var current = "";
// var name = "";
// var isSubmitted = false;
// var age = 0; 
// var memeSrc = "http://i2.cdn.turner.com/cnnnext/dam/assets/160927210830-tk-ah0927-exlarge-169.jpg";
// var lastMemeIndex = 0;

// var curColor = 0;
// var colorSlide = 1;

// var curNavFontSize = 52;
// var navFontSlideVar = -0.5;

// setInterval(increment, 500);
// setInterval(navFontSlide, 10);
// setInterval(colorSlideFunc, 10);


// function navFontSlide() {

// 	var element = document.getElementsByTagName("nav")[0];

// 	element.style.fontSize = curNavFontSize + "px";

// 	curNavFontSize += navFontSlideVar;

// 	if (curNavFontSize == 75 || curNavFontSize == 1) {
// 		navFontSlideVar = -navFontSlideVar;
// 	}
// }

// function colorSlideFunc() {

// 	var element = document.getElementsByTagName("nav")[0];

// 	console.log(curNavFontSize);

// 	element.style.backgroundColor = curColor;

// 	curColor += colorSlide;

// 	if (curColor == 255 || curColor == 1) {
// 		colorSlide = -colorSlide;
// 	}
// }


// function clearName() {
// 	counter = -1;
// 	current = "";
// 	isSubmitted = false;
// }


// function setName() {
// 	if (counter >= 0 && !isSubmitted) {
// 		current += String.fromCharCode(65 + counter);
// 		counter = -1;
// 	}
// }

// function submitName() {
// 	isSubmitted = true;
// }

// function increment() {

// 	var elem = document.getElementById("NameInput");
// 	counter++;
// 	counter %= 26;
// 	if (isSubmitted) {
// 		elem.innerHTML = current;
// 	} else {
// 		elem.innerHTML = current + String.fromCharCode(65 + counter);
// 	}
// }

// function newAge() {
// 	age = Math.floor(Math.random() * 100);
// 	var elem = document.getElementById("AgeInput");
// 	elem.innerHTML = age;
// }

// function newImage() {
// 	var memeList = [
// 		"http://i2.cdn.turner.com/cnnnext/dam/assets/160927210830-tk-ah0927-exlarge-169.jpg", 
// 		"https://66.media.tumblr.com/f449d8738724cd74dafc1a63671e1984/tumblr_o6j2dt3WUx1s3o4dso1_400.gif",
// 		"https://i.ytimg.com/vi/oqupUsjbpdM/maxresdefault.jpg", 
// 		"http://media.salon.com/2016/10/kenneth_bone.jpg", 
// 		"https://img.buzzfeed.com/buzzfeed-static/static/2016-06/3/14/campaign_images/buzzfeed-prod-fastlane02/primitive-spongebob-meme-2-18549-1464980143-9_dblbig.jpg",
// 		"https://img.buzzfeed.com/buzzfeed-static/static/2016-02/19/16/campaign_images/webdr05/damn-daniel-is-the-insane-new-meme-you-need-to-kn-2-3631-1455915618-4_dblbig.jpg", 
// 		"http://cdn2.swordandscale.com/files/2016/03/CcbV3jrUYAA9xQ3.jpg",
// 		"https://coedmagazine.files.wordpress.com/2015/10/hotline-bling-best-memes.jpg?quality=88&strip=all",
// 		"https://cdn0.vox-cdn.com/thumbor/Or3a4_eAKZiYr70gGI4PN-4Joyo=/0x2:928x524/1600x900/cdn0.vox-cdn.com/uploads/chorus_image/image/50263513/Screen_Shot_2016-08-01_at_12.34.21_PM.0.0.png" 
// 	];
// 	var memeIndex = lastMemeIndex;
// 	while (lastMemeIndex == memeIndex) { 
// 		memeIndex = Math.floor(Math.random() * memeList.length);
// 	}
// 	memeSrc = memeList[memeIndex];
// 	var elem = document.getElementById("MemeInput");
// 	elem.src = memeSrc;
// 	new Audio("http://niceme.me/nicememe.mp3").play();
// 	lastMemeIndex = memeIndex;
// }	 

// function submit() {
// 	if (isSubmitted) {
// 		var memeNameList = [
// 			"pepe", 
// 			"dat boi", 
// 			"harambe", 
// 			"Ken Bone", 
// 			"caveman spongebob",
// 			"damn daniel", 
// 			"Ted Cruz zodiac killer", 
// 			"Drake", 
// 			"Arthur"
// 		];
// 		localStorage.setItem('name', current);
// 		localStorage.setItem('age', age);
// 		localStorage.setItem('meme', memeNameList[lastMemeIndex]);
		
// 		window.location.href = "result1.html";

// 	} else {
// 		location.reload();
// 	}
// }