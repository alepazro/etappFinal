
function getToday() {
    try {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;//January is 0!
        var yyyy = today.getFullYear();
        var hours = today.getHours();
        var minutes = today.getMinutes();
        var seconds = today.getSeconds();
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        var d = mm + '/' + dd + '/' + yyyy + ' ' + hours + ':' + minutes + ':' + seconds

        return d;
    }
    catch (err) {
        alert(err.description);
    }
}

function buildHtmlTable(tableId, jsonObj) {
    try {
        if (jsonObj.length === undefined) {
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
                if (cellValue === '') {
                    if (cellValue !== 0) {
                        cellValue = '';
                    }
                }
                else {
                    if (cellValue === false) {
                        cellValue = 'false';
                    }
                    else {
                        if (cellValue === null) {
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
                if ($.inArray(key, columnSet) === -1) {
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

function smsReplyTest() {
    try {
        data = { message: 'test 7', to:'3217109996', from:'7137143678' };
        data = JSON.stringify(data);

        var msg = 'test 10';
        var toNumber = '3217109996';
        var fromNumber = '7137143678';
        $.ajax({
            type: "GET",
            url: "etrack.svc/smsReply?from_number=" + fromNumber + "&message=" + msg + "&to_number=" + toNumber,
            contentType: "application/json",
            data: 0,
            dataType: "json",
            processdata: false,
            success: function (a, b, c) {
                var x = 1;
            },
            error: function (a, b, c) {
                var x = 1;
            }
        });
    }
    catch (err) {
        alert(err);
    }
}

function fdtContact() {
    try{
        var data = {
            formId: '94DDB199-85EC-4BF9-AF47-003372126540',
            name: 'Joe',
            email: 'jdoe@doe.com',
            phone: '555-222-3333',
            msg: 'Test of FDT Contact #2'
        }
        data = JSON.stringify(data);

        var url = 'https://etrack.ws/etrest.svc/fdtContact';

        $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json",
            data: data,
            dataType: "json",
            processdata: false,
            success: function (data) {
                var a = 1;
            },
            error: function (a, b, c) {
                var x = 1;
            }
        });

    }
    catch (err) {
        alert(err.message);
    }
}

function quickContact() {
    try {
        var data = {
            formId: 'A1364C60-CCCE-4035-86CB-8661C71F641D',
            name: 'MD',
            email: 'mark.dale@easitrack.com',
            phone: '555-222-3333',
            msg: 'Test of ET Contact #1'
        }
        data = JSON.stringify(data);

        var url = 'etrest.svc/quickContact';

        $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json",
            data: data,
            dataType: "json",
            processdata: false,
            success: function (data) {
                var a = 1;
            },
            error: function (a, b, c) {
                var x = 1;
            }
        });

    }
    catch (err) {
        alert(err.message);
    }
}