
function getAllDevices() {
    try {
        jsonDevices = $.ajax({
            type: "GET",
            url: 'etrest.svc/getDevices/' + escape(token),
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
    }
}

function getOneDevice() {
    try {
        var deviceId = $('#txtDeviceId').val();
        jsonDevices = $.ajax({
            type: "GET",
            url: 'etrest.svc/getDevices/' + escape(token) + '/' + escape(deviceId),
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
    }
}

function getDeviceHistory() {
    try {
        var deviceId = $('#txtHdeviceId').val();
        var dateFrom = $('#txtHfrom').val();
        var dateTo = $('#txtHto').val();
        var data = 'dateFrom=' + dateFrom + '&dateTo=' + dateTo;

        jsonDevices = $.ajax({
            type: "GET",
            url: 'etrest.svc/getHistory/' + escape(token) + '/' + escape(deviceId),
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
        alert('getDeviceHistory: ' + err.description);
    }
}
