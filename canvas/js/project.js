var buttonExport = document.getElementById('export');

buttonExport.addEventListener('click', function (event) {

    var editors = $('.editor');
    var numberOfEditors = editors.length;

    let data = ""

    $("#my-editors-tabs").children(".editor-tab").each(function () {
        let editor = this.dataset.number;
        if (!editor) return;

        const name = $(this).find(".tab-name").first().text() + ".dgm"
        const content = ace.edit(document.getElementById("editor-" + editor)).getValue();
	console.log(name, content)

	data += "&" + escape(name) + "=" + escape(content);
	console.log(data);
    });

    event.preventDefault();
    window.location.href="/actions/download-folder.php?" + data;
});