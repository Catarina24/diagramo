class MyImage {

    constructor(pos, width, height, img, label, name, text) {
        this.x = pos.x || 0;
        this.y = pos.y || 0;
        this.width = width | 100;
        this.height = height | 100;
        this.img = img;
        this.label = label || '';
        this.name = name;
	    this.text = text || '';
    }

    updatePosition(pos) {
        this.x = pos.x;
        this.y = pos.y;

        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > canvasWidth) {
            this.x = canvasWidth - this.width;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y + this.height + 50 > canvasHeight) {
            this.y = canvasHeight - this.height - 50;
        }

        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    }

    draw() {
        noStroke();
        image(this.img, this.x, this.y, this.width, this.height);
	    text(this.text, this.x + 5, this.y + 5, this.width - 10);
        text(this.label, this.x, this.y + this.height + 15, this.width);
        textAlign(CENTER);
    }

    isSame(pos) {
        if (pos.x > this.x &&
            pos.x < this.x + this.width &&
            pos.y > this.y &&
            pos.y < this.y + this.height) {
            return true;
        }
        return false;
    }
}

//images
var images;

//to update draw
var isDragging;
var dragImageIndex;
var offset;

//connections
var connections;
var mapNamesToImgs;

//canvas
var canvasWidth;
var canvasHeight;

function reset() {
    images = [];
    isDragging = false;
    dragImageIndex = -1;
    imgHoverIndex = -1;
    connections = [];
    mapNamesToImgs = [];
}

function parseElementsToDraw(object) {
    console.log("Redrawing")
    reset();
    //funcao
    object.objects.forEach(obj => {
        object.classes.forEach(objClass => {
            if (objClass.name == obj.parent) {
                var img, x, y, width, height, label, text;

                if (obj.image == null && objClass.image != null) {
                    img = loadImage(objClass.image.path);  // Load the image
                }
                else if(obj.image == null && objClass.image == null){
                    img = loadImage("https://cdn2.iconfinder.com/data/icons/image-1/64/Image-12-512.png");
                } 
                else {
                    img = loadImage(obj.image.path);  // Load the image
                }

                if (obj.position == null) {
		    if (objClass.position != null) {
			x = objClass.position.x ;
			y = objClass.position.y;
		    }
                }
                else {
                    if (obj.position.x == null) {
                        x = objClass.position.x;
                    }
                    else {
                        x = obj.position.x;
                    }
                    if (obj.position.y == null) {
                        y = objClass.position.y;
                    }
                    else {
                        y = obj.position.y;
                    }
                }

                if (obj.label == null) {
                    label = objClass.label;
                }
                else {
                    label = obj.label;
                }

		if (obj.text == null) {
		    text = objClass.text;
		} else {
		    text = obj.text;
		}

		if (obj.width == null) {
		    width = objClass.width;
		} else {
		    width = obj.width;
		}

		if (obj.height == null) {
		    height = objClass.height;
		} else {
		    height = obj.height;
		}

                if (obj.connects != null) {
                    for (let i = 0; i < obj.connects.length; i++) {
                        connections.push([obj.name, obj.connects[i]]);
                    }
                }

                createMyImage(x, y, width, height, img, label, obj.name, text);
            }
        });
    });
}

function createMyImage(x, y, width, height, img, label, name, text) {
    var pos = createVector(x, y);
    var newImg = new MyImage(pos, width, height, img, label, name, text);
    mapNamesToImgs[name] = newImg;
    images.push(newImg);
}

function setup() {
    reset();
    createCanvas(windowWidth / 2, windowHeight)
        .parent('diagrama');
    updateCanvas(windowWidth/2, windowHeight);
}

function drawConnections() {

    for (let i = 0; i < connections.length; i++) {

        const src = mapNamesToImgs[connections[i][0]];
        const dest = mapNamesToImgs[connections[i][1]];

        const x = (dest.x + dest.width/2) - (src.x + src.width/2);
        const y = (dest.y + dest.height/2) - (src.y + src.height/2);

        let notDraggedImage;
        let imageDragged;

        if (dragImageIndex == 0) {
            imageDragged = 0;
            notDraggedImage = 1;
        } else {
            imageDragged = 1;
            notDraggedImage = 0;
        }

        if(Math.abs(x) <= 10 || Math.abs(y) <= 10){
            if(Math.abs(x) <=10){
                mapNamesToImgs[connections[i][notDraggedImage]].x = mapNamesToImgs[connections[i][imageDragged]].x;
            }
            else{
                mapNamesToImgs[connections[i][notDraggedImage]].y = mapNamesToImgs[connections[i][imageDragged]].y;
            }
        }
        if (y >= x && y >= -x) {
	    stroke(100, 100, 100);
            strokeWeight(1);
            line(dest.x + dest.width / 2, dest.y, src.x + src.width / 2, src.y + src.height + 15);
        }
        else if (y <= -x && y >= x) {
	    stroke(100, 100, 100);
            strokeWeight(1); 
            line(dest.x + dest.width, dest.y + dest.height / 2, src.x, src.y + src.height / 2);
        }
        else if (y <= x && y <= -x) {
	    stroke(100, 100, 100);
            strokeWeight(1);
            line(dest.x + dest.width / 2, dest.y + dest.height + 15, src.x + src.width / 2, src.y);
        }
        else if (y >= -x && y <= x) {
	    stroke(100, 100, 100);
            strokeWeight(1);
            line(dest.x, dest.y + dest.height / 2, src.x + src.width, src.y + src.height / 2);
        }
    }
}

function draw() {
    clear();
    for (let i = 0; i < images.length; i++) {
        images[i].draw();
    }
    updateCursor();
    drawConnections();
    mouseHoverImage();
}

function updateCursor() {
    if (isDragging) {
        cursor(MOVE);
    }
    else {
        cursor(ARROW);
    }
}

function mousePressed() {
    var m = createVector(mouseX, mouseY);

    for (var i = 0; i < images.length; i++) {
        if (images[i].isSame(m)) {
            isDragging = true;
            dragImageIndex = i;
            offset = createVector(mouseX - images[i].x, mouseY - images[i].y);
        }
    }
}

function getCurrentEditor() {
    result = null;
    $("#my-editors-tabs").children(".editor-tab").each(function() {
        let editor = this.dataset.number;
        if (!editor) return;

	if ($(this).hasClass("active")) {
	    result = document.getElementById("editor-" + editor);
	}
    });
    return result;
}

function mouseHoverImage() {
    var m = createVector(mouseX, mouseY);
    var bool = false;

    for (var i = 0; i < images.length; i++) {
        if (images[i].isSame(m) && !isDragging) {
            cursor(HAND);
            bool = true;
            highlightText(images[i].name, getCurrentEditor(), 1);
            imgHoverIndex = i;
        }
    }
    if (!bool && imgHoverIndex != -1 && dragImageIndex == -1) {
        highlightText(images[imgHoverIndex].name, getCurrentEditor(), 0);
    }
}

function mouseDragged() {
    if (isDragging) {
        var newPos = createVector(mouseX - offset.x, mouseY - offset.y);
        images[dragImageIndex].updatePosition(newPos);
	updatePositionInProject(images[dragImageIndex].name, images[dragImageIndex].x, images[dragImageIndex].y);
    }
}

function mouseReleased() {
    isDragging = false;
    if (dragImageIndex != -1)
        updatePositionInProject(images[dragImageIndex].name, images[dragImageIndex].x, images[dragImageIndex].y);
    dragImageIndex = -1;
}

function updateCanvas(x, y) {
    canvasWidth = x;
    canvasHeight = y;
}

function windowResized() {
    resizeCanvas(windowWidth/2, windowHeight);
    for (var i=0; i <  images.length; i++) {
        let x = images[i].x * (windowWidth/2) / canvasWidth;
        let y = images[i].y * windowHeight / canvasHeight;
        images[i].updatePosition(createVector(x, y));
        updatePositionInProject(images[i].name, images[i].x, images[i].y);
    }
    updateCanvas(windowWidth/2, windowHeight);
}

function saveDiagram() {
    save();
}
