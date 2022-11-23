//et_01_1.0.js
var jsonDevices = false;

function getDevices() {
    try {
        var t = getTokenCookie('ETTK');
        var ret = false;
        if ((t == null) || (t == '')) {
            if (location.pathname.toLowerCase().indexOf('index.html') == -1) {
                location.href = 'index.html';
            }
            ret = false;
        }
        else {
            jQuery.ajax({
                url: 'ETWS.asmx/getDevices',
                data: 't=' + escape(t),
                dataType: 'xml',
                type: "POST",
                success: function (xml, textStatus) {
                    if (textStatus == 'success') {
                        if (($("string", xml).text()) == 'failure') {
                            // alert('Error loading devices');
                            ret = false;
                        }

                        jsonDevices = eval('(' + $("string", xml).text() + ')');
                        if (jsonDevices.result == 'failure') {
                            //alert(jsonDevices.error);
                            if (jsonDevices.error = 'LOGOUT') {
                                logout();
                            }
                            else {
                                ret = false;
                            }
                        }
                        else {
                            ret = true;
                        }
                    }
                    else {
                        //alert('Error loading devices');
                        ret = false;
                    }
                },
                error: function (result) {
                    //alert('Error loading devices');
                    ret = false;
                },
                async: false
            });
        }
        return ret;
    }
    catch (err) {
        //alert('Error loading devices');
        return false;
    }
}

function dbReadWriteAsync(methodName, data, success, failure) {
    try {
        var ret = true;
        if (methodName == undefined || methodName == null) {
            alert('Invalid method name');
            ret = false;
        }
        else {
            if (data == undefined || data == null) {
                data = '';
            }

            jQuery.ajax({
                url: 'ETWS.asmx/' + methodName,
                data: data,
                dataType: 'xml',
                type: "POST",
                success: success,
                error: failure,
                async: true
            });
        }
    }
    catch (err) {
        alert('dbReadWriteAsync: ' + err.description);
    }
}

function dbReadWrite(methodName, data, alertFailure, isAsync) {
    var ret = true;
    var jsonObj = false;

    if (isAsync == undefined) {
        isAsync = true;
    }

    if (alertFailure == undefined) {
        alertFailure = true;
    }

    try {
        if (methodName == undefined || methodName == null) {
            alert('Invalid method name');
            ret = false;
        }
        else {
            if (data == undefined || data == null) {
                data = '';
            }

            jQuery.ajax({
                url: 'ETWS.asmx/' + methodName,
                data: data,
                dataType: 'xml',
                type: "POST",
                success: function (xml, textStatus) {
                    if (textStatus == 'success') {
                        if (($("string", xml).text()) == 'failure') {
                            ret = false;
                        }
                        else {
                            jsonObj = eval('(' + $("string", xml).text() + ')');
                            if (jsonObj.result == 'failure') {
                                if (alertFailure == true) {
                                    alert(jsonObj.error);
                                }
                                if (jsonObj.error = 'LOGOUT') {
                                    logout();
                                }
                                else {
                                    ret = false;
                                }
                            }
                            else {
                                ret = true;
                            }
                        }
                    }
                    else {
                        ret = false;
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    //alert(errorThrown);
                    ret = false;
                },
                async: isAsync
            });
        }

        return jsonObj;

    }
    catch (err) {
        alert('dbReadWrite: Error loading ' + methodName);
        return false;
    }
}
