function updateResourcesList (resourcesDiv, _callback) {
    
    var listOfResources = document.createElement("ul");

    $.ajax({
        url: '/actions/get-list-of-images.php',
        type: 'POST',
        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        processData: false, // NEEDED, DON'T OMIT THIS
        success: function (res) {
            
            res = JSON.parse(res);
            
            if(res.status != "OK"){
                console.error("An error ocurred with the 'get-list-of-images' action.");
                return;
            }

            var resources = res.message;

            for(var i = 0; i < resources.length; i++){
                var resource = resources[i];

                var item = document.createElement("li");
                var anchor = document.createElement("a");
                anchor.href = resource;
                anchor.text = resource;
		anchor.target = "_blank";

                item.appendChild(anchor);
                listOfResources.appendChild(item);
            }
        }
    }); 

    _callback(listOfResources);
}