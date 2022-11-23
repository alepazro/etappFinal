function hideSettingsDivs() {
    try {
        $('#usrDiv').hide();
        $('#devDiv').hide();
        $('#geoDiv').hide();
        $('#alertsDiv').hide();
        $('#recurrentReportsDiv').hide();
        $('#schedulesDiv').hide();
    }
    catch (err) {
        alert('hideSettingsDivs: ' + err.description);
    }
}

function showSettingsDivs(id) {
    try {
        hideSettingsDivs();

        switch (id) {
            case 1:
                if (validateUserAccess(5) == true) {
                    $('#usrDiv').show();
                    loadUsers();
                }
                break;
            case 2:
                if (validateUserAccess(10) == true) {
                    $('#devDiv').show();
                    loadDevices();
                }
                break;
            case 3:
                if (validateUserAccess(11) == true) {
                    $('#geoDiv').show();
                    loadGeofences();
                }
                break;
            case 4:
                if (validateUserAccess(13) == true) {
                    $('#alertsDiv').show();
                    loadAlerts();
                }
                break;
            case 5:
                if (validateUserAccess(14) == true) {
                    $('#recurrentReportsDiv').show();
                    loadRecurrentReports();
                }
                break;
            case 6:
                if (validateUserAccess(29) == true) {
                    $('#schedulesDiv').show();
                    loadSchedules();
                }
                break;

        }

    }
    catch (err) {
        alert('showSettingsDivs: ' + err.description);
    }
}

