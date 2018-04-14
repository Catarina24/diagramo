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
    }

    draw() {
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

function reset() {
    images = [];
    isDragging = false;
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
                    img = createImg(objClass.image.path);  // Load the image
                }
                else {
                    img = createImg(obj.image.path);  // Load the image
                }
                img.hide();

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

                if (obj.connect != null) {
                    for (let i = 0; i < obj.connect.length; i++) {
                        connections.push([obj.name, obj.connect[i]]);
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

function setup() {
    reset();
    createCanvas(windowWidth / 2, windowHeight)
        .parent('diagrama');
    //parseElementsToDraw(object);
}

function drawConnections() {

    for (let i = 0; i < connections.length; i++) {

        const src = mapNamesToImgs[connections[i][0]];
        const dest = mapNamesToImgs[connections[i][1]];

        const x = dest.x - src.x;
        const y = dest.y - src.y;

        if (y >= x && y >= -x) {
            line(dest.x + dest.width / 2, dest.y, src.x + src.width / 2, src.y + src.height + 15);
        }
        else if (y <= -x && y >= x) {
            line(dest.x + dest.width, dest.y + dest.height / 2, src.x, src.y + src.height / 2);
        }
        else if (y <= x && y <= -x) {
            line(dest.x + dest.width / 2, dest.y + dest.height + 15, src.x + src.width / 2, src.y);
        }
        else if (y >= -x && y <= x) {
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

function mouseDragged() {
    if (isDragging) {
        var newPos = createVector(mouseX - offset.x, mouseY - offset.y);
        images[dragImageIndex].updatePosition(newPos);
	updatePositionInEditor(images[dragImageIndex].name, images[dragImageIndex].x, images[dragImageIndex].y, currentEditor)
    }
}

function mouseReleased() {
    isDragging = false;
    updatePositionInEditor(images[dragImageIndex].name, images[dragImageIndex].x, images[dragImageIndex].y, currentEditor)
}