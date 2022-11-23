
function getAllGeofences() {
    try {
        jsonDevices = $.ajax({
            type: "GET",
            url: 'etrest.svc/getGeofences/' + escape(token),
            contentType: 'application/json',
            data: 0,
            dataType: "json",
            processdata: false,
            success: responseOk,
            error: responseError,
            async: true
        });
    }
    catch (err) {
        alert(err.message);
    }
}

function getOneGeofence() {
    try {
        var geofenceId = $('#txtGeofenceId').val();
        jsonDevices = $.ajax({
            type: "GET",
            url: 'etrest.svc/getGeofences/' + escape(token) + '/' + escape(geofenceId),
            contentType: 'application/json',
            data: 0,
            dataType: "json",
            processdata: false,
            success: responseOk,
            error: responseError,
            async: true
        });
    }
    catch (err) {
        alert(err.message);
    }
}

function getGeoData(){
    try {
        var isSpeedLimit = false;
        if ($('#geofenceSpeedLimitAlert').is(':checked')) {
            isSpeedLimit = true;
        }

        var data = { 'apiToken': token, 'geofenceId': $('#geofenceUpdateId').val(), 'geofenceName': $('#geofenceName').val(), 'street': $('#geofenceStreet').val(), 'city': $('#geofenceCity').val(), 'state': $('#geofenceState').val(), 'postalCode': $('#geofencePostalCode').val(), 'latitude': $('#geofenceLat').val(), 'longitude': $('#geofenceLng').val(), 'radiusFeet': $('#geofenceRadius').val(), 'alertStatusId': $('#geofenceAlertTypeId').val(), 'speedLimitAlertEnabled': isSpeedLimit, 'speedLimit': $('#geofenceSpeedLimit').val(), 'geofenceTypeId': $('#geofenceTypeId').val() };
        data = JSON.stringify(data);

        return data;
    }
    catch (err) {
        alert(err.message);
    }
}

function addGeofence() {
    try {
        var data = getGeoData();

        jsonDevices = $.ajax({
            type: "POST",
            url: 'etrest.svc/addGeofence',
            contentType: 'application/json',
            data: data,
            dataType: "json",
            processdata: false,
            success: responseOk,
            error: responseError,
            async: true
        });

    }
    catch (err) {
        alert(err.message);
    }
}

function updateGeofence() {
    try {
        var data = getGeoData();

        jsonDevices = $.ajax({
            type: "POST",
            url: 'etrest.svc/updateGeofence',
            contentType: 'application/json',
            data: data,
            dataType: "json",
            processdata: false,
            success: responseOk,
            error: responseError,
            async: true
        });

    }
    catch (err) {
        alert(err.message);
    }
}

function deleteGeofence() {
    try {
        //url: 'etrest.svc/deleteGeofence/' + escape(token) + '/' + escape(geofenceId),

        var geofenceId = $('#txtGeofenceDeleteId').val();
        var data = { 'apiToken': token, 'geofenceId': geofenceId }
        data = JSON.stringify(data);

        jsonDevices = $.ajax({
            type: "POST",
            url: 'etrest.svc/deleteGeofence',
            contentType: 'application/json',
            data: data,
            dataType: "json",
            processdata: false,
            success: responseOk,
            error: responseError,
            async: true
        });
    }
    catch (err) {
        alert(err.message);
    }
}

function getGeofenceAlertType() {
    try {
        var geofenceId = $('#getAlertTypeGeofenceId').val();
        jsonDevices = $.ajax({
            type: "GET",
            url: 'etrest.svc/getGeofenceAlertStatus/' + escape(token) + '/' + escape(geofenceId),
            contentType: 'application/json',
            data: 0,
            dataType: "json",
            processdata: false,
            success: responseOk,
            error: responseError,
            async: true
        });
    }
    catch (err) {
        alert(err.message);
    }
}

function setGeofenceAlertType() {
    try {
        var alertTypeId = $('#cbxAlertTypes').val();
        var geofenceId = $('#alertTypeGeofenceId').val();
        var data = { 'apiToken': token, 'geofenceId': geofenceId, 'alertTypeId': alertTypeId }
        data = JSON.stringify(data);

        jsonDevices = $.ajax({
            type: "POST",
            url: 'etrest.svc/setGeofenceAlertType',
            contentType: 'application/json',
            data: data,
            dataType: "json",
            processdata: false,
            success: responseOk,
            error: responseError,
            async: true
        });

    }
    catch (err) {
        alert(err.message);
    }
}

function getGeofenceSpeedLimitStatus() {
    try {
        var geofenceId = $('#getSpeedAlertStatusGeofenceId').val();
        jsonDevices = $.ajax({
            type: "GET",
            url: 'etrest.svc/GetGeofenceSpeedLimitStatus/' + escape(token) + '/' + escape(geofenceId),
            contentType: 'application/json',
            data: 0,
            dataType: "json",
            processdata: false,
            success: responseOk,
            error: responseError,
            async: true
        });
    }
    catch (err) {
        alert(err.message);
    }
}

function setGeofenceSpeedLimitStatus() {
    try {
        var geofenceId = $('#setSpeedLimitGeofenceId').val();
        var isEnabled = false;
        if ($('#chkIsEnabled').is(':checked')) {
            isEnabled = true;
        }
        var speedLimit = $('#txtSpeedLimit').val();
        var data = { 'apiToken': token, 'geofenceId': geofenceId, 'isEnabled': isEnabled, 'speedLimit': speedLimit }
        data = JSON.stringify(data);

        jsonDevices = $.ajax({
            type: "POST",
            url: 'etrest.svc/setGeofenceSpeedLimitStatus',
            contentType: 'application/json',
            data: data,
            dataType: "json",
            processdata: false,
            success: responseOk,
            error: responseError,
            async: true
        });

    }
    catch (err) {
        alert(err.message);
    }
}

function getGeofenceTypes() {
    try {
        jsonDevices = $.ajax({
            type: "GET",
            url: 'etrest.svc/getGeofenceTypes/' + escape(token),
            contentType: 'application/json',
            data: 0,
            dataType: "json",
            processdata: false,
            success: responseOk,
            error: responseError,
            async: true
        });
    }
    catch (err) {
        alert(err.message);
    }
}

function addGeofenceType() {
    try {
        var name = $('#txtGeofenceTypeName').val();
        var data = { 'apiToken': token, 'id': '', 'name': name }
        data = JSON.stringify(data);

        jsonDevices = $.ajax({
            type: "POST",
            url: 'etrest.svc/addGeofenceType',
            contentType: 'application/json',
            data: data,
            dataType: "json",
            processdata: false,
            success: responseOk,
            error: responseError,
            async: true
        });
    }
    catch (err) {
        alert(err.message);
    }
}

function updateGeofenceType() {
    try {
        var id = $('#txtGeofenceTypeId').val();
        var name = $('#txtGeofenceTypeName2').val();
        var data = { 'apiToken': token, 'id': id, 'name': name }
        data = JSON.stringify(data);

        jsonDevices = $.ajax({
            type: "POST",
            url: 'etrest.svc/updateGeofenceType',
            contentType: 'application/json',
            data: data,
            dataType: "json",
            processdata: false,
            success: responseOk,
            error: responseError,
            async: true
        });
    }
    catch (err) {
        alert(err.message);
    }
}

function deleteGeofenceType() {
    try {
        var id = $('#txtDeleteGeofenceTypeID').val();

        jsonDevices = $.ajax({
            type: "POST",
            url: 'etrest.svc/deleteGeofenceType/' + escape(token) + '/' + escape(id),
            contentType: 'application/json',
            data: 0,
            dataType: "json",
            processdata: false,
            success: responseOk,
            error: responseError,
            async: true
        });
    }
    catch (err) {
        alert(err.message);
    }
}

function validatePointInsideGeofence() {
    try{
        var lat = $('#txtInsideLat').val();
        var lng = $('#txtInsideLng').val();

        jsonResult = $.ajax({
            type: "GET",
            url: 'etrest.svc/isPointInGeofence/' + escape(token) + '/' + lat + '/' + lng,
            contentType: 'application/json',
            data: 0,
            dataType: "json",
            processdata: false,
            success: responseOk,
            error: responseError,
            async: true
        });

    }
    catch (err) {
        alert('validatePointInsideGeofence: ' + err.message);
    }
}
