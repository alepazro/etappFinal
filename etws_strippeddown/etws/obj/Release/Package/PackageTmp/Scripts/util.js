var h = $(window).height();
var w = $(window).width();

function isToday(ref) {
    try {
        var refDate = new Date(ref);
        if (Date() >= refDate) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
    }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function setCookie(name, value, expDays) {
    try {
        var exdate = new Date();
        if (expDays == undefined) {
            expDays = 1;
        }

        exdate.setDate(exdate.getDate() + expDays);
        document.cookie = name + "=" + escape(value) + "; expires=" + exdate.toUTCString();
    }
    catch (err) {
        alert('setCookie: ' + err.Description);
    }
}

function getCookie(name) {
    try {
        var value = "";
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(name + "=");
            if (c_start != -1) {
                c_start = c_start + name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) c_end = document.cookie.length;
                value = unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return value;
    }
    catch (err) {
        alert('getCookie: ' + err.Description);
    }
}

function deleteCookie(name) {
    try {
        if (document.cookie.length > 0) {
            document.cookie = name + "=";
        }
    }
    catch (err) {
        alert('deleteCookie: ' + err.Description);
    }
}

function ajaxGET(method, async, successFunc, errorFunc) {
    try {
        if (async == undefined) {
            async = false;
        }
        $.ajax({
            url: 'vtAPI.svc/' + method,
            type: "GET",
            data: 0,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: successFunc,
            error: errorFunc,
            async: async
        });
    }
    catch (err) {
        alert(err.description);
    }
}

function jsonToForm(formId, jsonObj) {
    try {
        for (var i = 0; i < jsonObj.length; i++) {
            var rowHash = jsonObj[i];
            for (var key in rowHash) {
            }
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function buildHtmlTable(tableId, jsonObj) {
    try {
        if (jsonObj.length == undefined) {
            var tmp = [];
            tmp.push(jsonObj);
            jsonObj = tmp;
        }
        $("#" + tableId).empty();

        var columns = addColumnHeaders(tableId, jsonObj);
        for (var i = 0 ; i < jsonObj.length ; i++) {
            var row = $('<tr/>');
            for (var colIndex = 0 ; colIndex < columns.length ; colIndex++) {
                var cellValue = jsonObj[i][columns[colIndex]];
                if (cellValue == '') {
                    cellValue = '';
                }
                else {
                    if (cellValue == false) {
                        cellValue = 'false';
                    }
                    else {
                        if (cellValue == null) {
                            cellValue = "";
                        }
                    }
                }
                row.append($('<td/>').html(cellValue));
            }
            $("#" + tableId).append(row);
        }
    }
    catch (err) {
        alert(err);
    }
}

function addColumnHeaders(tableId, jsonObj) {
    try {
        var columnSet = [];
        var headerTr = $('<tr/>');

        for (var i = 0 ; i < jsonObj.length ; i++) {
            var rowHash = jsonObj[i];
            for (var key in rowHash) {
                if ($.inArray(key, columnSet) == -1) {
                    columnSet.push(key);
                    headerTr.append($('<th/>').html(key));
                }
            }
        }
        $("#" + tableId).append(headerTr);
        return columnSet;
    }
    catch (err) {
        alert(err);
    }
}

