
var token = '';

function authOk(data) {
    try {
        token = data.authorizationResult.token;
    }
    catch (err) {
        alert(err);
    }
}

function authOk2(data) {
    try {
        token = data.authorization2Result.token;
    }
    catch (err) {
        alert(err);
    }
}

function resultOk(data) {
    var result = 'Ok';
}
function resultNok(msg, url, line) {
    var result = 'Not ok';
}

function auth() {
    try {
        var l = $('#txtLogin').val();
        var p = $('#txtPassword').val();
        var data = 'login=' + escape(l) + '&password=' + escape(p) + '&expDays=' + escape('14');
        $.ajax({
            type: "GET",
            url: "etrest.svc/authorization?",
            contentType: "application/json; charset=utf-8",
            data: data,
            dataType: "json",
            processdata: false,
            success: authOk,
            error: resultNok
        });
    }
    catch (err) {
        alert(err.message);
    }
}

function auth2() {
    try {
        var l = $('#txtLogin').val();
        var p = $('#txtPassword').val();
        var s = '2';
        var sExt = 'iOS4.0';
        var data = 'login=' + escape(l) + '&password=' + escape(p) + '&expDays=' + escape('14') + '&sourceId=' + escape(s) + '&sourceExt=' + escape(sExt);
        $.ajax({
            type: "GET",
            url: "etrest.svc/authorization2?",
            contentType: "application/json; charset=utf-8",
            data: data,
            dataType: "json",
            processdata: false,
            success: authOk2,
            error: resultNok
        });
    }
    catch (err) {
        alert(err.message);
    }
}

function getList() {
    try {
        var data = escape(token);
        $.ajax({
            type: "GET",
            url: "etrest.svc/devList/" + data,
            contentType: "application/json; charset=utf-8",
            data: 0,
            dataType: "json",
            processdata: false,
            success: resultOk,
            error: resultNok
        });
    }
    catch (err) {
        alert(err);
    }
}

function getList2() {
    try {
        var data = escape(token);
        var sourceId = '1';
        $.ajax({
            type: "GET",
            url: "etrest.svc/devList2/" + data + '/' + sourceId,
            contentType: "application/json; charset=utf-8",
            data: 0,
            dataType: "json",
            processdata: false,
            success: resultOk,
            error: resultNok
        });
    }
    catch (err) {
        alert(err);
    }
}

function getDeviceInfo() {
    try {
        var data = 'F3B90383-731A-4215-BE30-20174719B422';
        $.ajax({
            type: "GET",
            url: "etrest.svc/device/" + data,
            contentType: "application/json; charset=utf-8",
            data: 0,
            dataType: "json",
            processdata: false,
            success: resultOk,
            error: resultNok
        });
    }
    catch (err) {
        alert(err);
    }
}

function getDeviceInfo2() {
    try {
        var data = 'F3B90383-731A-4215-BE30-20174719B422';
        var sourceId = '1';
        $.ajax({
            type: "GET",
            url: "etrest.svc/device2/" + data + "/" + sourceId,
            contentType: "application/json; charset=utf-8",
            data: 0,
            dataType: "json",
            processdata: false,
            success: resultOk,
            error: resultNok
        });
    }
    catch (err) {
        alert(err);
    }
}

function getTrail() {
    try {
        var data = 'id=' + escape('A1F926EA-8262-448B-8B7D-925BDBF5576C') + '&trailDate=' + escape('11/16/2012');
        $.ajax({
            type: "GET",
            url: "etrest.svc/trail?",
            contentType: "application/json; charset=utf-8",
            data: data,
            dataType: "json",
            processdata: false,
            success: resultOk,
            error: resultNok
        });
    }
    catch (err) {
        alert(err);
    }
}

$(document).ready(function () {
    var credentials = { 'login': 'jco', 'pw': 'test' };
    var res = JSON.stringify(credentials);
    var data = escape(res);
});

function sendCommandToDevice() {
    try {
        var did = $('#txtDeviceId').val();
        var cmd = $('#txtCommand').val();
        if (cmd == '') {
            alert('Please enter a command');
            return;
        }

        var data = { deviceId: did, cmd: cmd };
        data = JSON.stringify(data);

        var res = postDb('sendDeviceCommand', data, '');

    }
    catch (err) {
        alert(err.message);
    }
}

function getDb(method, data) {
    try {
        var result = false;
        var url = 'https://etrack.ws/ws.svc/' + method;
        if (data.length > 0) {
            url = url + '?' + data;
        }
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            data: 0,
            dataType: "json",
            processdata: false,
            success: function (data) {
                result = data;
            },
            error: function (err) {

            },
            async: false
        });

        return result;

    }
    catch (err) {
        alert(err.message);
    }
}

function postDb(method, data, params) {
    try {
        var result = false;
        var url = 'ws.svc/' + method;
        if (!_.isUndefined(params)) {
            if (params.length > 0) {
                url = url + '?' + params;
            }
        }
        $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json",
            data: data,
            dataType: "json",
            processdata: false,
            success: function (data) {
                result = data;
            },
            error: function (err) {
                var a = 1;
            },
            async: false
        });

        return result;

    }
    catch (err) {
        alert(err.message);
    }
}

