class MyImage {

  constructor (pos, width, height, img, label, connections, name) {
      this.x = pos.x || 0;
      this.y = pos.y || 0;
      this.width = width || 100;
      this.height = height || 100;
      this.img = img;
      this.label = label || '';
      this.connections = connections;
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

function parseElementsToDraw() {
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

              if (obj.label == null) {
                loadedImages.push([objClass.position.x, objClass.position.y, img, objClass.label, obj.connects, obj.name]);  
              }
              else if (obj.label != null) {
                loadedImages.push([objClass.position.x, objClass.position.y, img, obj.label, obj.connects, obj.name]);
              }
              else {}
          }
      });
  });
}

function setup() {
  createCanvas(windowWidth/2, windowHeight)
    .parent('diagrama')
    .style('display', 'block');
  parseElementsToDraw();
  placeImages();
}

function placeImages() {

  for (let i=0; i < loadedImages.length; i++) {
    var pos = createVector(loadedImages[i][0], loadedImages[i][1]);
    images.push(new MyImage(pos, loadedImages[i][2].width, loadedImages[i][2].height, loadedImages[i][2], loadedImages[i][3], loadedImages[i][4], loadedImages[i][5]));
  }
}

function placeConnections() {

  //solucao trolha
  for (let i=0; i < images.length; i++) {
    var connections =  images[i]["connections"];

    if (connections != null){
      for (let j=0; j < connections.length; j++) {
        for (let k=0; k < images.length; k++) {
          if (connections[j] == images[k].name) {
            //line(images[i].x + images[i].width/2, images[i].y + images[i].height/2, images[k].x + + images[k].width/2, images[k].y + images[k].height/2);
            /*if (images[i].x > images[k].x) {
              line(images[i].x, images[i].y + images[i].height/2, images[k].x + images[k].width, images[k].y + images[k].height/2);
            }
            else {
              line(images[i].x + images[i].width, images[i].y + images[i].height/2, images[k].x, images[k].y + images[k].height/2);
            }
            if(images[i].x >= images[k].x-15 && images[i].y <= images[k].x+15){
              if(images[i].y >= images[k].y){
                line(images[i].x + images[i].width/2, images[i].y + images[i].height, images[k].x + images[k].width/2, images[k].y);
              }
              else{
                line(images[i].x + images[i].width/2, images[i].y, images[k].x + images[k].width/2, images[k].y + images[k].height);                
              }
            }*/


            const src = images[k];
            const dest = images[i]; 

            const x = dest.x - src.x;
            const y = dest.y - src.y;

            if (y >= x && y >= -x) {
              line(dest.x + dest.width/2, dest.y, src.x + src.width/2, src.y + src.height);
            }
            else if (y <= -x && y >= x ) {
              line(dest.x + dest.width, dest.y + dest.height/2, src.x, src.y + src.height/2);
            }
            else if (y <= x && y <= -x) {
              line(dest.x + dest.width/2, dest.y + dest.height, src.x + src.width/2, src.y);
            }
            else if (y >= -x && y <= x){
              line(dest.x, dest.y + dest.height/2, src.x + src.width, src.y + src.height/2);
            }

          }
        }
      }
    }
  }
}

function draw() {
  clear();
  for (let i=0; i < images.length; i++) {
    images[i].draw();
  }
  placeConnections();
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