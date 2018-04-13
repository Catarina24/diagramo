class MyImage {

  constructor (pos, width, height, img) {
      this.x = pos.x || 0;
      this.y = pos.y || 0;
      this.width = width || 100;
      this.height = height || 100;
      this.img = img;
  }

  updatePosition(pos) {
      this.x = pos.x;
      this.y = pos.y;
  }

  draw() {
    //image(this.img, this.x, this.y, this.width, this.height);
    image(this.img, this.x, this.y, this.width, this.height);
  }

  isSame(pos) {
    if(pos.x > this.x && 
    pos.x < this.x + this.width && 
    pos.y > this.y && 
    pos.y < this.y + this.height) {
      return true;
    }
    return false;
  }
}

//alterar
var loadedImages = [];
var isDraggable = false;
var images = [];
var dragImageIndex;
var offset;
const size = 100;

const object = {
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
                "x": 10,
                "y": 20
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
                "x": 10,
                "y": 20
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
  };

function preload() {
  //funcao
  object.objects.forEach(obj => {
      object.classes.forEach(objClass => {
          if(objClass.name == obj.parent){
            var img;
            if(obj.image == null){
              img = createImg(objClass.image.path);  // Load the image
            }
            else{
              img = createImg(obj.image.path);  // Load the image
            }
            img.hide();
            var x;
            var y;
            if(obj.position == null){
              x = objClass.position.x;
              y = objClass.position.y;
            }
            else{
              if(obj.position.x == null){
                x = objClass.position.x;
              }
              else{
                x = obj.position.x;
              }
              if(obj.position.y == null){
                y = objClass.position.y;
              }
              else{
                y = obj.position.y;
              }
            }
            loadedImages.push([x, y, img]);
          }
      });
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
  //parseElementsToDraw();
  placeImages();
}

function placeImages() {

  for (let i=0; i < loadedImages.length; i++) {
    var pos = createVector(loadedImages[i][0], loadedImages[i][1]);
    images.push(new MyImage(pos, loadedImages[i][2].width, loadedImages[i][2].height, loadedImages[i][2]));
  }

}

function draw() {
  clear();
  for (let i=0; i < images.length; i++) {
    images[i].draw();
  }
}

function mousePressed() {
  var m = createVector(mouseX, mouseY);

  for (var i=0; i<images.length; i++) {
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
}