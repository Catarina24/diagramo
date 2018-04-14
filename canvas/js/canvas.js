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
    dragImageIndex = -1;
    connections = [];
    mapNamesToImgs = [];
}

/*const object = {
    "classes": [
        {
            "connects": [
                "adf"
            ],
            "image": {
                "path": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Robustness_Diagram_Actor.svg/1024px-Robustness_Diagram_Actor.svg.png"
            },
            "label": "I am an actor mate",
            "name": "actor",
            "position": {
                "x": 10,
                "y": 20
            }
        },
        {
            "connects": [
                "adf"
            ],
            "image": {
                "path": "http://www.prologicwebdesign.com/wp-content/uploads/2015/07/Oracle-Database-support.png"
            },
            "label": "I am an db mate",
            "name": "database",
            "position": {
                "x": 10,
                "y": 20
            }
        },
        {
            "connects": [
                "adf"
            ],
            "image": {
                "path": "https://cdn0.iconfinder.com/data/icons/cloud-data-technology-1-3/63/47-512.png"
            },
            "label": "I am an server mate",
            "name": "server",
            "position": {
                "x": 150,
                "y": 250
            }
        },
        {
            "connects": [
                "adf"
            ],
            "image": {
                "path": "path/to/image.png"
            },
            "label": "I am an machine mate",
            "name": "machine",
            "position": {
                "x": 40,
                "y": 40
            }
        },
        {
            "connects": [],
            "image": {
                "path": "image/of/a/database.png"
            },
            "label": "Database",
            "name": "system",
            "position": {
                "x": 0,
                "y": 0
            }
        }
    ],
    "objects": [
        {
            "connects": [
                "d1"
            ],
            "label": "I am so smart",
            "name": "a1",
            "parent": "actor",
            "position": {
                "x": 100,
                "y": 100
            }
        },
        {
            "connects": [],
            "label": "I am so smart",
            "name": "d1",
            "parent": "database",
            "position": {
                "x": 200,
                "y": 100
            }
        },
        {
            "connects": [
                "d1"
            ],
            "label": "I am so smart",
            "name": "s1",
            "parent": "server",
            "position": {
                "x": 200,
                "y": 200
            }
        },
        {
            "connects": [
                "s1"
            ],
            "image": {
                "path": "https://www.shareicon.net/download/2015/12/26/693394_monitor.svg"
            },
            "label": "I am so smart",
            "name": "m1",
            "parent": "machine",
            "position": {
                "x": 200,
                "y": 100
            }
        }
    ]
};*/

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
    }
}

function mouseReleased() {
    isDragging = false;
    dragImageIndex = -1;
}