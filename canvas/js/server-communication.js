function sendRequest(url, name, entry, content){

    var data = {};
    data.name = name;
    data.entry = entry;
    data.content = content;

    var request = $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function() {
        }
      });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        console.log("Hooray, it worked!");
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        // Log the error to the console
        console.error(
            "The following error occurred: "+
            textStatus, errorThrown
        );
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
        // Reenable the inputs
        console.log(data);
    });
}