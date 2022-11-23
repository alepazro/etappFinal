function hideSettingsDivs() {
    try {
        $('#usrDiv').hide();
        $('#devDiv').hide();
        $('#devGroupsDiv').hide();
        $('#geoDiv').hide();
        $('#alertsDiv').hide();
        $('#recurrentReportsDiv').hide();
        $('#schedulesDiv').hide();
        $('#routesDiv').hide();
        $('#ibuttonsDiv').hide();
        $('#tempProfilesDiv').hide();
        $('#telemetryDiv').hide();
        $('#hourMetersDiv').hide();
        $('#mobileAppsDiv').hide();
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
            case 7:
                if (validateUserAccess(30) == true) {
                    $('#routesDiv').show();
                    loadRoutes();
                }
                break;
            case 8:
                if (validateUserAccess(31) == true) {
                    $('#ibuttonsDiv').show();
                    loadIButtons();
                }
                break;
            case 9:
                if (validateUserAccess(33) == true) {
                    $('#devGroupsDiv').show();
                    loadDevGroups();
                }
                break;
            case 10:
                if (validateUserAccess(39) == true) {
                    $('#tempProfilesDiv').show();
                    loadTempProfiles();
                }
                break;
            case 12:
                $('#mobileAppsDiv').show();
                break;
            case 13:
                if (validateUserAccess(45) == true) {
                    $('#telemetryDiv').show();
                    var dlgScope = angular.element($("#telemetryTable")).scope();
                    dlgScope.loadDevices();
                }
                break;
            case 14:
                if (validateUserAccess(46) == true) {
                    $('#hourMetersDiv').show();
                    var dlgScope = angular.element($("#hourMetersTable")).scope();
                    dlgScope.loadDevices();
                }
                break;
        }

    }
    catch (err) {
        alert('showSettingsDivs: ' + err.description);
    }
}

function accountSettings() {
    try {
        if (userIsAdmin == true) {
            window.open('https://secure.easitrack.com/account.html?t=' + getTokenCookie('ETTK'), target = "_blank");
        }
        else {
            alert('This option is only available for Administrator users');
        }
    }
    catch (err) {
        alert('accountSettings: ' + err.description);
    }
}

