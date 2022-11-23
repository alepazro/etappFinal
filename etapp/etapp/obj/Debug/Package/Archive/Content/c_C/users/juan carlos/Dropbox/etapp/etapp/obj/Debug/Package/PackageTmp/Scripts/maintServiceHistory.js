var isMaintServiceHistoryReady = false;

function loadMaintenanceHistory() {
    try {
        if (isMaintServiceHistoryReady == false) {
            if (jsonDevices == false) {
                getDevices();
            }
            if (jsonDevices) {
                var cbx = document.getElementById('cbxHServicesDevices');
                removeAllChildNodes(cbx);
                loadComboBox(jsonDevices.myDevices, cbx, 'All Devices');
            }

            if (jsonTasks == false) {
                getTasks();
            }
            if (jsonTasks) {
                var cbx = document.getElementById('cbxHServicesTasks');
                removeAllChildNodes(cbx);
                loadComboBox(jsonTasks.tasks, cbx, 'All Tasks');
            }

            $('#dtpHServicesFrom').val(getNow());
            $('#dtpHServicesTo').val(getNow());

            $("#dtpHServicesFrom").datepicker();
            $("#dtpHServicesTo").datepicker();

            isMaintServiceHistoryReady = true;
        }
    }
    catch (err) {
        alert('loadMaintenanceHistory: ' + err.description);
    }
}

function getHServicesData() {
    try {
        var deviceId = $('#cbxHServicesDevices').val();
        var taskId = $('#cbxHServicesTasks').val();
        var dateFrom = $('#dtpHServicesFrom').val();
        var dateTo = $('#dtpHServicesTo').val();

        var data = 't=' + getTokenCookie('ETTK') + '&deviceId=' + escape(deviceId) + '&taskId=' + escape(taskId) + '&dateFrom=' + escape(dateFrom) + '&dateTo=' + escape(dateTo);
        $("#waitingSpinner").show();
        getHServices(data);
    }
    catch (err) {
        alert('getHServicesData: ' + err.description);
    }
}

function getHServices(data) {
    try {
        dbReadWriteAsync('getHServices', data, getHServicesSuccess, getHServicesFailure);
    }
    catch (err) {
        alert('runHServicesQuery: ' + err.description);
    }
}

function getHServicesSuccess(data, textStatus, jqXHR) {
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
                        clearHServices();
                        for (var ind = 0; ind < jsonResult.services.length; ind++) {
                            var jsonItem = eval('(' + jsonResult.services[ind] + ')');
                            addHServiceToList(jsonItem);
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
        alert('getHServicesSuccess: ' + err.description);
    }
}

function getHServicesFailure(jqXHR, textStatus, errorThrown) {
    try {
        alert('No data found in the selected timeframe.');
        $("#waitingSpinner").hide();
    }
    catch (err) {
        alert('Could not retrieve selected data. Try a small timeframe');
        $("#waitingSpinner").hide();
    }
}

function clearHServices() {
    try {
        $("#maintHServicesTbl").find("tr:gt(0)").remove();
    }
    catch (err) {
        alert('clearHServices: ' + err.description);
    }
}

function addHServiceToList(itm) {
    try {
        var tbl = document.getElementById('maintHServicesTbl');
        var tr = document.createElement('tr');
        tbl.appendChild(tr);
        fillHServiceRecord(tr, itm);
    }
    catch (err) {
        alert('addHServiceToList: ' + err.description);
    }
}

function fillHServiceRecord(tr, item) {
    try {
        var tbl = document.getElementById('maintHServicesTbl');

        if (tbl.childNodes.length % 2 == 0) {
            $(tr).addClass('maintListOddTR');
        }

        //Device
        var deviceNameTd = document.createElement('td');
        $(deviceNameTd).html(item.deviceName);
        $(deviceNameTd).addClass('maintListTD');
        tr.appendChild(deviceNameTd);

        //Task
        var taskNameTd = document.createElement('td');
        $(taskNameTd).html(item.taskName);
        $(taskNameTd).addClass('maintListTD');
        tr.appendChild(taskNameTd);

        //Service Date
        var serviceOnTd = document.createElement('td');
        $(serviceOnTd).html(item.serviceDateString);
        $(serviceOnTd).addClass('maintListTD');
        tr.appendChild(serviceOnTd);

        //Odometer
        var odometerTd = document.createElement('td');
        $(odometerTd).html(item.odometer);
        $(odometerTd).addClass('maintListTD maintListRightTD');
        tr.appendChild(odometerTd);

        //Cost
        var costTd = document.createElement('td');
        $(costTd).html('$' + item.cost);
        $(costTd).addClass('maintListTD maintListRightTD');
        tr.appendChild(costTd);

        //Comments
        var commentsTd = document.createElement('td');
        $(commentsTd).html(item.comments);
        $(commentsTd).addClass('maintListTD');
        tr.appendChild(commentsTd);

    }
    catch (err) {
        alert('fillHServiceRecord: ' + err.description);
    }
}

