var isMaintFuelHistoryReady = false;

function loadFuelLogHistory() {
    try {
        if (isMaintFuelHistoryReady == false) {
            if (jsonDevices == false) {
                getDevices();
            }
            if (jsonDevices) {
                var cbx = document.getElementById('cbxHFuelDevices');
                removeAllChildNodes(cbx);
                loadComboBox(jsonDevices.myDevices, cbx, 'All Devices');
            }

            $('#dtpHFuelFrom').val(getNow());
            $('#dtpHFuelTo').val(getNow());

            $("#dtpHFuelFrom").datepicker();
            $("#dtpHFuelTo").datepicker();

            isMaintFuelHistoryReady = true;
        }
    }
    catch (err) {
        alert('loadFuelLogHistory: ' + err.description);
    }
}

function getHFuelData() {
    try {
        var deviceId = $('#cbxHFuelDevices').val();
        var dateFrom = $('#dtpHFuelFrom').val();
        var dateTo = $('#dtpHFuelTo').val();

        var data = 't=' + getTokenCookie('ETTK') + '&deviceId=' + escape(deviceId) + '&dateFrom=' + escape(dateFrom) + '&dateTo=' + escape(dateTo);
        $("#waitingSpinner").show();
        getHFuel(data);
    }
    catch (err) {
        alert('getHFuelData: ' + err.description);
    }
}

function getHFuel(data) {
    try {
        dbReadWriteAsync('getHFuel', data, getHFuelSuccess, getHFuelFailure);
    }
    catch (err) {
        alert('getHFuel: ' + err.description);
    }
}

function getHFuelSuccess(data, textStatus, jqXHR) {
    try {
        var jsonObj = false;

        if (textStatus == 'success') {
            if (($("string", data).text()) == 'failure') {
                ret = false;
            }
            else {
                jsonObj = eval('(' + $("string", data).text() + ')');
                if (jsonObj.result == 'failure') {
                    if (alertFailure == true) {
                        alert(jsonObj.error);
                    }
                    ret = false;
                }
                else {

                    var jsonResult = jsonObj;
                    if (jsonResult) {
                        clearHFuel();
                        for (var ind = 0; ind < jsonResult.fueling.length; ind++) {
                            var jsonItem = eval('(' + jsonResult.fueling[ind] + ')');
                            addHFuelToList(jsonItem);
                        }
                    }
                }
            }

        }
        else {
            ret = false;
        }
        $("#waitingSpinner").hide();
    }
    catch (err) {
        alert('getHFuelSuccess: ' + err.description);
    }
}

function getHFuelFailure(jqXHR, textStatus, errorThrown) {
    try {
        alert('No data found in the selected timeframe.');
        $("#waitingSpinner").hide();
    }
    catch (err) {
        alert('Could not retrieve selected data. Try a small timeframe');
        $("#waitingSpinner").hide();
    }
}

function clearHFuel() {
    try {
        $("#maintHFuelTbl").find("tr:gt(0)").remove();
    }
    catch (err) {
        alert('clearHFuel: ' + err.description);
    }
}

function addHFuelToList(itm) {
    try {
        var tbl = document.getElementById('maintHFuelTbl');
        var tr = document.createElement('tr');
        tbl.appendChild(tr);
        fillHFuelRecord(tr, itm);
    }
    catch (err) {
        alert('addHFuelToList: ' + err.description);
    }
}

function fillHFuelRecord(tr, item) {
    try {
        var tbl = document.getElementById('maintHFuelTbl');

        if (tbl.childNodes.length % 2 == 0) {
            $(tr).addClass('maintListOddTR');
        }

        //Device
        var deviceNameTd = document.createElement('td');
        $(deviceNameTd).html(item.deviceName);
        $(deviceNameTd).addClass('maintListTD');
        tr.appendChild(deviceNameTd);

        //Fueling Date
        var fuelingOnTd = document.createElement('td');
        $(fuelingOnTd).html(item.fuelDateString);
        $(fuelingOnTd).addClass('maintListTD');
        tr.appendChild(fuelingOnTd);

        //Odometer
        var odometerTd = document.createElement('td');
        $(odometerTd).html(item.odometer);
        $(odometerTd).addClass('maintListTD maintListRightTD');
        tr.appendChild(odometerTd);

        //Gallons
        var gallonsTd = document.createElement('td');
        $(gallonsTd).html(item.gallons);
        $(gallonsTd).addClass('maintListTD maintListRightTD');
        tr.appendChild(gallonsTd);

        //Cost
        var costTd = document.createElement('td');
        $(costTd).html('$' + item.cost);
        $(costTd).addClass('maintListTD maintListRightTD');
        tr.appendChild(costTd);

        //State
        var stateTd = document.createElement('td');
        $(stateTd).html(item.stateName);
        $(stateTd).addClass('maintListTD');
        tr.appendChild(stateTd);

        //Comments
        var commentsTd = document.createElement('td');
        $(commentsTd).html(item.comments);
        $(commentsTd).addClass('maintListTD');
        tr.appendChild(commentsTd);

    }
    catch (err) {
        alert('fillHFuelRecord: ' + err.description);
    }
}