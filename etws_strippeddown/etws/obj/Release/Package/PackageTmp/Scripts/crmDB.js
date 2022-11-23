function dbReadWriteAsync(ws, methodName, data, success, failure) {
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
                url: ws + '/' + methodName,
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

function dbReadWrite(ws, methodName, data, alertFailure, isAsync) {
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
                url: ws + '/' + methodName,
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
