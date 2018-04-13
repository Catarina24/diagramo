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
  "name" : "main.dpm",
  "classes" : [
      {
          "name" : "database",
          "position" : {"x":0, "y":0},
          "image" : "http://www.prologicwebdesign.com/wp-content/uploads/2015/07/Oracle-Database-support.png",
          "label" : "This is a label!"
      },

      {
          "name" : "actor",
          "position" : {"x":10, "y":10},
          "image" : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Robustness_Diagram_Actor.svg/1024px-Robustness_Diagram_Actor.svg.png"
      }
  ],
  "objects" : [
      {
          "name" : "d1",
          "parent" : "database"
      },
      {
          "name" : "a1",
          "parent" : "actor"
      }
  ]
}

function preload() {
  //funcao
  object.objects.forEach(obj => {
      object.classes.forEach(objClass => {
          if(objClass.name == obj.parent){
              var img = createImg(objClass.image);  // Load the image
              img.hide();
              loadedImages.push([objClass.position.x, objClass.position.y, img]);
          }
      });
  });
}

function setup() {
  console.log("fds");
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

  console.log(images);
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