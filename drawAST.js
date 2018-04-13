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
            "image" : "http://collagenrestores.com/wp-content/uploads/2018/01/uncategorized-actors-in-use-case-diagram-photo-fileuse-actor-people-svg-wikimedia.png"
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

function parseElementsToDraw() {
    object.objects.forEach(obj => {
        object.classes.forEach(objClass => {
            if(objClass.name == obj.parent){
                console.log(objClass.name + " " + obj.name + " " + objClass.image);
                var img = createImg(objClass.image);  // Load the image
                // Displays the image at point 
                image(img, objClass.position.x, objClass.position.y, img.width/2, img.height/2);
            }
        });
    });
}


function setup() { 
    createCanvas(windowWidth, windowHeight);
    parseElementsToDraw();
} 



function draw() {
  
}

