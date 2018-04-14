var buttonExport = document.getElementById('export');

buttonExport.addEventListener('click', function (event) {

    var editors = $('.editor');
    var numberOfEditors = editors.length;

    var zip = new JSZip();

    //Add files to folder "src"

    $("#my-editors-tabs").children(".editor-tab").each(function () {
        let editor = this.dataset.number;
        if (!editor) return;

        var data = {};
        data.name = $(this).find(".tab-name").first().text() + ".dgm"
        data.content = ace.edit(editors[editor - 1]).getValue();

        zip.folder("src").file(data.name, data.content);
    });

    //Adds images to "resources"

    //Generates zip
    zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "project.zip");
    });
});


$('#folder-upload-form').on("submit", function (event) {
    event.preventDefault();

    $.ajax({
        url: 'actions/upload-folder.php',
        type: 'POST',
        data: new FormData(this),
        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        processData: false, // NEEDED, DON'T OMIT THIS
        success: function (msgJson) {
            msg = JSON.parse(msgJson);
            console.log(msg);
            if (msg.status == "OK") {
                
                //call function 
            }
        },
        error: function (error) {
            console.log(error);
        }
    })
});