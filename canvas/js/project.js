var button = document.getElementById('export');

button.addEventListener('click', function(event) {

    var editors = $('.editor');
    var numberOfEditors = editors.length;

    var zip = new JSZip();
    
    //Add files to folder "src"
    var i=0;
    for (var i = 0; i < editors.length; i++) {
        var content = ace.edit(editors[i]).getValue();
        zip.folder("src").file("file" + i + ".txt", content);
    }

    //Adds images to "resources"

    //generates zip
    zip.generateAsync({type:"blob"}).then(function(content) {
        saveAs(content, "project.zip");
    });
});