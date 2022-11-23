var apiToken = '18821EF6-7C1A-4B86-A1B1-F532946D1483';
var data = false;

function geoOk(data) {
    try {
        var a = 1;
    }
    catch (err) {
    }
}

function geoNok(msg, url, line) {
    try {
        var a = 1;
    }
    catch (err) {
    }
}

function postGeofence() {
    try {
        data = { 'id': 0, 'name': 'test geofence' };
        data = 'test';
        //data = JSON.stringify(data);
        $.ajax({
            type: "GET",
            url: "etAPI.svc/postGeofence?data=" + data,
            contentType: "application/json",
            data: 0,
            dataType: "json",
            processdata: false,
            success: geoOk,
            error: geoNok
        });
    }
    catch (err) {
        alert('postGeofence: ' + err.description);
    }
}


function getDevicesAPI() {
    try {
        $.ajax({
            type: "GET",
            url: "etAPI.svc/getDevices/" + apiToken,
            contentType: "application/json; charset=utf-8",
            data: 0,
            dataType: "json",
            processdata: false,
            success: geoOk,
            error: geoNok
        });
    }
    catch (err) {
        alert('getDevicesAPI: ' + err.description);
    }
}