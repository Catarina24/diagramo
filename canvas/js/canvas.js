class MyImage {

    constructor(pos, img, label, name) {
        this.x = pos.x || 0;
        this.y = pos.y || 0;
        this.width = 100;
        this.height = 100;
        this.img = img;
        this.label = label || '';
        this.name = name;
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
    connections = [];
    mapNamesToImgs = [];
}

function parseElementsToDraw(object) {
    reset();
    //funcao
    object.objects.forEach(obj => {
        object.classes.forEach(objClass => {
            if (objClass.name == obj.parent) {
                var img, x, y, label;

                if (obj.image == null) {
                    img = loadImage(objClass.image.path);  // Load the image
                }
                else {
                    img = loadImage(obj.image.path);  // Load the image
                }

                if (obj.position == null) {
                    x = objClass.position.x;
                    y = objClass.position.y;
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

                if (obj.connects != null) {
                    for (let i = 0; i < obj.connects.length; i++) {
                        connections.push([obj.name, obj.connects[i]]);
                    }
                }

                createMyImage(x, y, img, label, obj.name);
            }
        });
    });
}

function createMyImage(x, y, img, label, name) {
    var pos = createVector(x, y);
    var newImg = new MyImage(pos, img, label, name);
    mapNamesToImgs[name] = newImg;
    images.push(newImg);
}

var aux;

function preload() {
    aux = loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Robustness_Diagram_Actor.svg/1024px-Robustness_Diagram_Actor.svg.png');
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
            stroke(111, 107, 142); 
            strokeWeight(3);
            line(dest.x + dest.width / 2, dest.y, src.x + src.width / 2, src.y + src.height + 15);
        }
        else if (y <= -x && y >= x) {
            stroke(111, 107, 142);
            strokeWeight(3); 
            line(dest.x + dest.width, dest.y + dest.height / 2, src.x, src.y + src.height / 2);
        }
        else if (y <= x && y <= -x) {
            stroke(111, 107, 142);
            strokeWeight(3);
            line(dest.x + dest.width / 2, dest.y + dest.height + 15, src.x + src.width / 2, src.y);
        }
        else if (y >= -x && y <= x) {
            stroke(111, 107, 142);
            strokeWeight(3);
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

function mouseHoverImage() {
    var m = createVector(mouseX, mouseY);

    for (var i = 0; i < images.length; i++) {
        if (images[i].isSame(m) && !isDragging) {
            cursor(HAND);
        }
    }
}

function mouseDragged() {
    if (isDragging) {
        var newPos = createVector(mouseX - offset.x, mouseY - offset.y);
        images[dragImageIndex].updatePosition(newPos);
	    updatePositionInEditor(images[dragImageIndex].name, images[dragImageIndex].x, images[dragImageIndex].y, currentEditor);
    }
}

function mouseReleased() {
    isDragging = false;
    if (dragImageIndex != -1)
        updatePositionInEditor(images[dragImageIndex].name, images[dragImageIndex].x, images[dragImageIndex].y, currentEditor);
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
        updatePositionInEditor(images[i].name, images[i].x, images[i].y, currentEditor);
    }
    updateCanvas(windowWidth/2, windowHeight);
}

function saveDiagram() {
    save();
}