function updatePositionInProject(element, x, y){

    // ASSUMES variable 'editors' as being the set of all editors as well as 'ace' from index.html
    var foundObject = false;

    var itemsProcessed = 0;

    /** FALAR COM O ZÉ ANTES DE MEXER AQUI. ISTO ESTÁ UMA MISTELA BRUTAL! */
    for(var i = 0; i < numberOfEditors; i++){
        itemsProcessed++;

        var editor = ace.edit(editors[i]);
        var code = editor.getValue();
        
        var str = element;

        var objectDeclarationRegex = new RegExp("object " + element + "[\\s\\S]*end");
        var objectDeclarationMatch = code.match(objectDeclarationRegex); 

        if(objectDeclarationMatch == null){
            continue; // object not in current editor
        }

        var objectCode = objectDeclarationMatch[0]; // only first match

        /** This next function is complete cancer. I'm so sorry. */
        ChangeObjectPosition(editor, code, objectCode, x, y, function (editor, code, objectCode, newObjectCode) {
            var newCode = code.replace(objectCode, newObjectCode);

            // get previous cursor position
            var cursorPosition = editor.selection.getCursor();
            editor.setValue(newCode, -1); // -1 moves the cursor to begining, 1 moves cursor to end
            //move to previous position
            editor.selection.moveCursorToPosition(cursorPosition);
        });
    }
}

function ChangeObjectPosition(editor, code, objectCode, newPositionX, newPositionY, _callback){
    
    var newPositionCode = "position: " + newPositionX + ", " + newPositionY;

    var positionDeclarationRegex = new RegExp("position: .*");
    
    var newObjectCode = null;

    if(objectCode.match(positionDeclarationRegex)){
        newObjectCode = objectCode.replace(positionDeclarationRegex, newPositionCode);
    }
    else {  // if there was no match for the regex, i.e., if there is no position attribute
        var endKeywordRegex = /(end)/;
        var appendPositionAndEnd = "\t" + newPositionCode + "\n" + "end";
        newObjectCode = objectCode.replace(endKeywordRegex, appendPositionAndEnd);
    }

    // Make sure the callback is a function​
    if (typeof _callback === "function") {
        // Call it, since we have confirmed it is callable​
            _callback(editor, code, objectCode, newObjectCode);
        }
}

let marker;
function highlightText(element, editor, set) {
    var code = editor.getValue();

    var str = element;

    var objectDeclarationRegex = new RegExp("object " + element + "[\\s\\S]*end");
    var objectDeclarationMatch = code.match(objectDeclarationRegex); 

    // Does not match current editor
    if(objectDeclarationMatch == null){
        return;
    }

    var begin = code.match(objectDeclarationRegex).index;
    var numLines = 0;
    for(var i = 0; i <= begin; i++){
        if(code[i] == '\n'){
            numLines++;
        }
    }
    var objectCode = objectDeclarationMatch[0]; // only first match
    var Range = ace.require('ace/range').Range;
    if(set == 1 && !marker){
        console.log(marker);
        marker = editor.session.addMarker(new Range(numLines, 0, objectCode.length, 1), "myMarker", "fullLine");
    }
    else if (set == 0) {
        console.log(marker);
        editor.session.removeMarker(marker);
        marker = null;
    }
}