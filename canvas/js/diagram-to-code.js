function updatePositionInEditor(element, x, y, editor){

    var code = editor.getValue();

    var str = element;

    var objectDeclarationRegex = new RegExp("object " + element + "[\\s\\S]*end");
    var objectDeclarationMatch = code.match(objectDeclarationRegex); 

    if(objectDeclarationMatch == null){
        console.error("There is no object '" + element + "'.");
        return;
    }

    var objectCode = objectDeclarationMatch[0]; // only first match

    ChangeObjectPosition(objectCode, x, y, function(newObjectCode) {
        var newCode = code.replace(objectCode, newObjectCode);
        editor.setValue(newCode, -1); // -1 moves the cursor to begining, 1 moves cursor to end
    });
}

function ChangeObjectPosition(objectCode, newPositionX, newPositionY, _callback){
    
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
            _callback(newObjectCode);
        }
}

let marker;
function highlightText(element, editor, set) {
    var code = editor.getValue();

    var str = element;

    var objectDeclarationRegex = new RegExp("object " + element + "[\\s\\S]*?end");
    var objectDeclarationMatch = code.match(objectDeclarationRegex); 
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
        console.log(objectCode);
        marker = editor.session.addMarker(new Range(numLines, 0, objectCode.length, 1), "myMarker", "fullLine");
    }
    else if (set == 0) {
        editor.session.removeMarker(marker);
        marker = null;
    }
}