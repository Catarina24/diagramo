var buttonExport = document.getElementById('export');

buttonExport.addEventListener('click', function (event) {

    var editors = $('.editor');
    var numberOfEditors = editors.length;

    let data = ""

    $("#my-editors-tabs").children(".editor-tab").each(function () {
        let editor = this.dataset.number;
        if (!editor) return;

        const name = $(this).find(".tab-name").first().text() + ".dgm"
        const content = ace.edit(editors[editor - 1]).getValue();

	data += "&" + encodeURI(name) + "=" + encodeURI(content);
    });

    event.preventDefault();
    window.location.href="/actions/download-folder.php?" + data;
});