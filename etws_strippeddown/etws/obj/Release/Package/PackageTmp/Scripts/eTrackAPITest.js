var token = false;

function applyApiKey() {
    try {
        token = $('#txtAPIKey').val();
        alert('Thank you! Now you can use the methods below');
    }
    catch (err) {
        alert('applyApiKey: ' + err.description);
    }
}

function responseOk(data, textStatus, jqXHR) {
    try {
        var strData = JSON.stringify(data)
        var inf = '<div>' + strData + '</div>';
        var win = window.open("results.html", 'popup', 'toolbar = no, status = no scrollbars=yes');
        win.document.write(inf);
        win.document.close();
    }
    catch (err) {
    }
}

function responseError(jqXHR, textStatus, errorThrown) {
    try {
        alert(errorThrown);
    }
    catch (err) {
    }
}
