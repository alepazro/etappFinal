function readfile(f) {
    var reader = new FileReader(); 
    reader.readAsText(f); 
    reader.onload = function() { 
        var text = reader.result; 
        document.getElementById('uploadfilename').value = f.name;
        var out = document.getElementById("dataInput");  
        out.innerHTML = "";                          
        out.appendChild(document.createTextNode(text));
        
        document.getElementById("save").style.display = '';

    }
    reader.onerror = function(e) {
        console.log("Error", e);  
    };
}