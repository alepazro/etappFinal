var isDeviceDlgReady = false;
var jsonDevices = false;
var jsonDrivers = false;
var jsonIcons = false;

function modifyDeviceListRecord(id, itm) {
    try {
        var tr = document.getElementById('deviceTR' + id);
        removeAllChildNodes(tr);
        fillDeviceRecord(tr, itm);
    }
    catch (err) {
        alert('modifyDeviceListRecord: ' + err.description);
    }
}

function saveDevice() {
    try {
        tips = $(".validateTips");

        var bOk = true;

        bOk = bOk && checkLength($('#deviceUpdateName'), "Name", 3, 20);

        if (bOk == true) {
            //var id = $('#deviceUpdateDeviceId').attr('data-id');
            var id = $('#deviceUpdateName').attr('data-id');
            var name = $('#deviceUpdateName').val();
            var shortName = $('#deviceUpdateShortName').val();
            var driverId = $('#deviceUpdateDrivers').val();
            var driverName =  $('#deviceUpdateDrivers option:selected').text();
            var idleLimit = $('#deviceUpdateIdle').val();
            var speedLimit = $('#deviceUpdateSpeed').val();
            var iconId = $('#deviceUpdateIcons').val();
            var iconUrl = $('#deviceUpdateIcons option[value="' + iconId + '"]').attr('title');
            var line2 = $('#deviceUpdateLine2').val();

            data = 't=' + getTokenCookie('ETTK') + '&id=' + escape(id) + '&n=' + escape(name) + '&sn=' + escape(shortName) + '&driverId=' + escape(driverId) + '&idleLimit=' + escape(idleLimit) + '&speedLimit=' + escape(speedLimit) + '&iconId=' + escape(iconId) + '&line2=' + escape(line2);
            var tmpJson = dbReadWrite('saveDeviceChanges', data, true, false);

            //Always load a fresh version of the devices
            loadDevices();
            return true;

//            if (tmpJson == false) {
//                return false;
//            }
//            else {
//                if (tmpJson.result) {
//                    return false;
//                }
//                else {
//                    var jsonItem = eval('(' + tmpJson.device[0] + ')');
//                    modifyDeviceListRecord(id, jsonItem);
//                    return true;
//                }
//            }

        }
        else {
            return false;
        }

    }
    catch (err) {
        alert('saveDevice: ' + err.description);
    }
}

function editDevice(obj) {
    try {
        if (isDeviceDlgReady == false) {
            setupDeviceUpdateDlg();
            isDeviceDlgReady = true;
        }
        if (validateUserAccess(16) == true) {
            var id = $(obj.target).attr('data-id');
            //$('#deviceUpdateDeviceId').html($('#deviceTR' + id).attr('data-deviceId'));
            //$('#deviceUpdateDeviceId').attr('data-id', id);
            $('#deviceUpdateName').val($('#deviceTR' + id).attr('data-name'));
            $('#deviceUpdateShortName').val($('#deviceTR' + id).attr('data-shortName'));
            $('#deviceUpdateName').attr('data-id', id);
            $('#deviceUpdateDrivers').val($('#deviceTR' + id).attr('data-driverId'));
            $('#deviceUpdateIdle').val($('#deviceTR' + id).attr('data-idleThreshold'));
            $('#deviceUpdateSpeed').val($('#deviceTR' + id).attr('data-speedThreshold'));
            $('#deviceUpdateIcons').val($('#deviceTR' + id).attr('data-iconId'));
            $('#deviceUpdateLine2').val($('#deviceTR' + id).attr('data-iconLabelLine2'));
            $("#deviceUpdateDlg").dialog('open')
        }
    }
    catch (err) {
        alert('editDevice: ' + err.description);
    }
}

function fillDeviceRecord(tr, item) {
    try {
        var tbl = document.getElementById('devicesTbl');

        $(tr).attr('id', 'deviceTR' + item.id);
        $(tr).attr('data-deviceId', item.deviceId);
        $(tr).attr('data-name', item.name);
        $(tr).attr('data-shortName', item.shortName);
        $(tr).attr('data-driverId', item.driverId);
        $(tr).attr('data-driverName', item.driverName);
        $(tr).attr('data-iconId', item.iconId);
        $(tr).attr('data-iconUrl', item.iconUrl);
        $(tr).attr('data-idleThreshold', item.idleThreshold);
        $(tr).attr('data-speedThreshold', item.speedThreshold);
        $(tr).attr('data-iconLabelLine2', item.iconLabelLine2);

        if (tbl.childNodes.length % 2 == 0) {
            $(tr).addClass('devicesListOddTR');
        }

        //Icon
        var iconTd = document.createElement('td');
        $(iconTd).addClass('devicesListTD');
        tr.appendChild(iconTd);

        var iconImg = document.createElement('img');
        $(iconImg).attr('src', item.iconUrl);
        $(iconImg).attr('alt', '');
        $(iconImg).attr('width', '24');
        $(iconImg).attr('height', '24');
        iconTd.appendChild(iconImg);


        //Name
        var nameTd = document.createElement('td');
        $(nameTd).html(item.name);
        $(nameTd).addClass('devicesListTD');
        tr.appendChild(nameTd);

        //Short Name
        var shortNameTd = document.createElement('td');
        $(shortNameTd).html(item.shortName);
        $(shortNameTd).addClass('devicesListTD');
        tr.appendChild(shortNameTd);

        //Last update on
        var updateDateTd = document.createElement('td');
        $(updateDateTd).html(item.lastUpdatedOnString);
        $(updateDateTd).addClass('devicesListTD');
        tr.appendChild(updateDateTd);

        //Last event name
        var eventNameTd = document.createElement('td');
        $(eventNameTd).html(item.eventName);
        $(eventNameTd).addClass('devicesListTD');
        tr.appendChild(eventNameTd);

        //Last event date
        var eventDateTd = document.createElement('td');
        $(eventDateTd).html(item.eventDateString);
        $(eventDateTd).addClass('devicesListTD');
        tr.appendChild(eventDateTd);

        //Driver
        var driverTd = document.createElement('td');
        $(driverTd).html(item.driverName);
        $(driverTd).addClass('devicesListTD');
        tr.appendChild(driverTd);

        //Idle Threshold
        var idleSetTd = document.createElement('td');
        $(idleSetTd).html(item.idleThreshold);
        $(idleSetTd).addClass('devicesListTD devicesListCenteredTD');
        tr.appendChild(idleSetTd);

        //Speed Threshold
        var speedSetTd = document.createElement('td');
        $(speedSetTd).html(item.speedThreshold);
        $(speedSetTd).addClass('devicesListTD devicesListCenteredTD');
        tr.appendChild(speedSetTd);

        //Edit
        var editTd = document.createElement('td');
        $(editTd).addClass('devicesListTD devicesListCenteredTD');
        tr.appendChild(editTd);

        var editBtn = document.createElement('button');
        editTd.appendChild(editBtn);
        $(editBtn).attr('data-id', item.id);
        $(editBtn).click(editDevice);

        var editImg = document.createElement('img');
        $(editImg).attr('src', 'icons/edit_inline.png');
        $(editImg).attr('alt', '');
        $(editImg).attr('width', '16');
        $(editImg).attr('height', '16');
        $(editImg).attr('data-id', item.id);
        editBtn.appendChild(editImg);
    }
    catch (err) {
        alert('fillDeviceRecord: ' + err.description);
    }
}

function addDeviceToList(item) {
    try {
        var tbl = document.getElementById('devicesTbl');
        var tr = document.createElement('tr');
        tbl.appendChild(tr);
        fillDeviceRecord(tr, item);
    }
    catch (err) {
        alert('addDeviceToList: ' + err.description);
    }
}

function clearDevicesList() {
    try {
        $("#devicesTbl").find("tr:gt(0)").remove();
//        var tbl = document.getElementById('devicesTbl');
//        for (var ind = ($("#devicesTbl tr").length - 1); ind > 0; ind--) {
//            tbl.deleteRow(ind);
//        }
    }
    catch (err) {
        alert('clearDevicesList: ' + err.description);
    }
}

function getDevices() {
    try {
        var data = 't=' + getTokenCookie('ETTK');
        jsonDevices = dbReadWrite('getDevices', data, true, false);

        return true;
    }
    catch (err) {
        alert('getDevices: ' + err.description);
    }
}

function loadDevices() {
    try {
        //Always get a fresh version of the devices set
        getDevices();

        if (jsonDevices) {
            clearDevicesList();
            for (var ind = 0; ind < jsonDevices.myDevices.length; ind++) {
                var jsonItem = eval('(' + jsonDevices.myDevices[ind] + ')');
                addDeviceToList(jsonItem);
            }
        }
    }
    catch (err) {
        alert('loadDevices: ' + err.description);
    }
}

function loadDrivers() {
    try {
        if (jsonDrivers == false) {
            var data = 't=' + getTokenCookie('ETTK');
            jsonDrivers = dbReadWrite('getDrivers', data, true, false);
            if (jsonDrivers) {
                var cbx = document.getElementById('deviceUpdateDrivers');
                removeAllChildNodes(cbx);
                loadComboBox(jsonDrivers.drivers, cbx, 'Pick a driver');
            }
        }
    }
    catch (err) {
        alert('loadDrivers: ' + err.description);
    }
}

function loadIcons() {
    try {
        if (jsonIcons == false) {
            var data = 't=' + getTokenCookie('ETTK');
            jsonIcons = dbReadWrite('getDeviceIcons', data, true, false);
            if (jsonIcons) {
                var cbx = document.getElementById('deviceUpdateIcons');
                removeAllChildNodes(cbx);
                for (var ind = 0; ind < jsonIcons.icons.length; ind++) {
                    var jsonItem = eval('(' + jsonIcons.icons[ind] + ')');
                    var cbxOption = document.createElement('option');
                    $(cbxOption).attr('value', jsonItem.id);
                    $(cbxOption).attr('title', jsonItem.url);
                    $(cbxOption).html(jsonItem.name);
                    cbx.appendChild(cbxOption);
                }
            }
            $('#deviceUpdateIcons').msDropDown();
        }
    }
    catch (err) {
        alert('loadIcons: ' + err.description);
    }
}

function setupDeviceUpdateDlg() {
    try {
        loadDrivers();
        loadIcons();
        $("#deviceUpdateDlg").dialog({
            height: 300,
            width: 400,
            autoOpen: false,
            modal: true,
            buttons: {
                Save: function () {
                    if (saveDevice() == true) {
                        $(this).dialog("close");
                    }
                    else {
                        alert('Failed saving device.  Please try again.');
                    }
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            },
            open: function () {
                //Actions to perform upon open
            },
            close: function () {
                //Actions to perform upon close
                //$('#deviceUpdateDeviceId').val('');
                $('#deviceUpdateName').val('');
                $('#deviceUpdateShortName').val('');
                $('#deviceUpdateIdle').val('');
                $('#deviceUpdateSpeed').val('');
                $('#deviceUpdateLine2').val('');
            }
        });
    }
    catch (err) {
        alert('setupDeviceUpdateDlg: ' + err.description);
    }
}

