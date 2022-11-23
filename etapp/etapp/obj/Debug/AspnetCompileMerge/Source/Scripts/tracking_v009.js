var isTrailHoursReady = false;
var driversList = false;
var gpsAgeAlert = 30;
var refreshLoc = 10;
var currentGroupId = '';

function loadDevicesGroupsCallback(data) {
    try {
        var a = 1;

        $.each(data, function (key, value) {
            $('#cbxGroups').append('<option value=' + value.id + '>' + value.value + '</option>');
        });

    }
    catch (err) {

    }
}

function loadDevicesGroups() {
    try{
        getBasicList('DEVICESGROUPSBYUSER', loadDevicesGroupsCallback)
    }
    catch (err) {

    }
}

function applyGroupFilter() {
    try{
        currentGroupId = $('#cbxGroups  option:selected').val();
        if (!_.isUndefined(lastRefreshOn)) {
            lastRefreshOn = false;
        }
        loadDevices();
    }
    catch (err) {
        currentGroupId = '';
    }
}

function applyAccessRights() {
    try {
        $('#trackingQuickDispatch').hide();
        $('#trackingBreadcrumbTrail').hide();
        $('#trackingFleetStatusBoard').hide();
        $('#trackingHotSpots').hide();

        if (validateUserAccess(49, false)) {
            $('#trackingQuickDispatch').show();
        }
        if (validateUserAccess(48, false)) {
            $('#trackingBreadcrumbTrail').show();
        }
        if (validateUserAccess(51, false)) {
            $('#trackingFleetStatusBoard').show();
        }
        if (validateUserAccess(50, false)) {
            $('#trackingHotSpots').show();
        }

    }
    catch (err) {
        alert('applyTrackingAccessRights: ' + err.description);
    }
}

function getAddressFromPoint(deviceId, lat, lng) {
    try {
        var jsonAddress = false;
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(lat, lng);

        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    jsonAddress = getGoogleAddressComponents(results[0]);
                    $('#infoTableCurrLocation' + deviceId).html(jsonAddress.fullAddress);
                }
            }
        });
    }
    catch (err) {
        alert('getAddressFromPoint: ' + err.description);
    }
}

// ----- PAGE MENU
function closeCtrlPanel() {
    try {
        $('#ctrlPanel').hide();
        $('#fleetLocationDiv').hide();
        $('#dispatchingDiv').hide();
        $('#breadcrumbDiv').hide();
        $('#geofencesDiv').hide();
    }
    catch (err) {
        alert('closeCtrlPanel: ' + err.description);
    }
}

function mainMenuClick(activeCtrlPanel) {
    try {
        closeCtrlPanel();
        $('#ctrlPanel').show();
        $('#' + activeCtrlPanel).show();

        //Clean the map
        clearMap();

        forceAutoZoomFeature();

        bAutoCenter = true;
        switch (activeCtrlPanel) {
            case 'fleetLocationDiv':
                //if no units are selected, select them all
                //5/25/2014: Implementing user preferences... 
                lastRefreshOn = false;
                loadDevices();

                applyToggleSwitchesPreferences();

                //addAllDevicesToMap();
                //userPreferences_showDevice();
                break;

            case 'dispatchingDiv':
                if (directionsRenderer) {
                    directionsRenderer.setMap(map);
                }
                getGeofences_All();

                bAutoCenter = false;
                break;

            case 'breadcrumbDiv':
                showBreadcrumbTrail();
                bAutoCenter = false;
                break;

            case 'geofencesDiv':
                bAutoCenter = false;
                break;
        }
    }
    catch (err) {
        alert('mainMenuClick: ' + err.description);
    }
}
//===================================================
// -- Ping devices

function pingDevice(deviceId) {
    try {
        alert('pingDevice: ' + deviceId);
    }
    catch (err) {
        alert('pingDevice:' + err.description);
    }
}

//===================================================
// ----- FIRST LOAD OF DEVICES
function addDeviceToTrackingList(jsonDevice) {
    try {
        var ul = document.getElementById('fleetList');

        //<li>
        var li = document.createElement('li');
        $(li).attr('id', 'deviceId' + jsonDevice.deviceId);
        $(li).attr('data-eventCode', jsonDevice.eventCode);
        $(li).attr('data-eventDate', jsonDevice.eventDateString);
        $(li).attr('data-eventCodeStartedOn', jsonDevice.eventCodeStartedOnString);
        $(li).attr('data-gpsAge', jsonDevice.gpsAge);

        ul.appendChild(li);

        //    <div class="deviceInfo" style="background-color:#51ec51;">
        var titleDiv = document.createElement('div');
        $(titleDiv).attr('id', 'titleDiv' + jsonDevice.deviceId);
        li.appendChild(titleDiv);
        $(titleDiv).addClass('deviceInfo');
        
        if (jsonDevice.isNotWorking == true) {
            $(titleDiv).attr('style', 'background-color:#eee9e9;');
        }
        else {
            $(titleDiv).attr('style', 'background-color:' + eventColor(jsonDevice.eventCode));
        }

        $(titleDiv).attr('data-lat', jsonDevice.latitude);
        $(titleDiv).attr('data-lng', jsonDevice.longitude);

        //Street View button
        titleDiv.appendChild(getStreetViewBtn(jsonDevice.deviceId, jsonDevice.latitude, jsonDevice.longitude, jsonDevice.heading));

        //Bad Ignition Installation signal
        var badIgnitionDiv = document.createElement('div');
        $(badIgnitionDiv).attr('id', 'badIgnitionDiv' + jsonDevice.deviceId);
        $(badIgnitionDiv).attr('style', 'float:right;');
        $(badIgnitionDiv).attr("onclick", "resetBadIgnitionMsg('" + jsonDevice.deviceId + "')");
        var badIgnitionImg = document.createElement('img');
        $(badIgnitionImg).attr('src', 'icons/no_ignition.png');
        $(badIgnitionImg).attr('alt', 'Improper Installation Detected');
        $(badIgnitionImg).attr('width', '25');
        $(badIgnitionImg).attr('height', '25');
        $(badIgnitionImg).attr('title', 'Bad Ignition wire installation: The system has detected an improper installation of the Ignition wire. Please check installation of this device.  We encourage you to contact Technical Support for further assistance.');
        badIgnitionDiv.appendChild(badIgnitionImg);
        titleDiv.appendChild(badIgnitionDiv);

        if (jsonDevice.isBadIgnitionInstall == true) {
            $(badIgnitionDiv).show();
        }
        else {
            $(badIgnitionDiv).hide();
        }

        //Power Cut event
        var powerCutDiv = document.createElement('div');
        $(powerCutDiv).attr('id', 'powerCutDiv' + jsonDevice.deviceId);
        $(powerCutDiv).attr('style', 'float:right;');
        $(powerCutDiv).attr("onclick", "resetPowerCut('" + jsonDevice.deviceId + "')");
        var powerCutImg = document.createElement('img');
        $(powerCutImg).attr('src', 'icons/PowerCut.png');
        $(powerCutImg).attr('alt', 'Main power is cut');
        $(powerCutImg).attr('width', '25');
        $(powerCutImg).attr('height', '25');
        $(powerCutImg).attr('title', 'Main Power Cut: Please check installation of this device as it has lost main power and is working on internal backup battery.');
        powerCutDiv.appendChild(powerCutImg);
        titleDiv.appendChild(powerCutDiv);

        if (jsonDevice.isPowerCut == true) {
            $(powerCutDiv).show();
        }
        else {
            $(powerCutDiv).hide();
        }

        //GPS Status
        var gpsAgeDiv = document.createElement('div');
        $(gpsAgeDiv).attr('id', 'gpsAgeDiv' + jsonDevice.deviceId);
        $(gpsAgeDiv).attr('style', 'float:right;');
        $(gpsAgeDiv).attr("onclick", "gpsAgeClick('" + jsonDevice.deviceId + "')");
        var gpsAgeImg = document.createElement('img');
        $(gpsAgeImg).attr('id', 'gpsAgeImg' + jsonDevice.deviceId);
        $(gpsAgeImg).attr('src', 'icons/gpsLost.png');
        $(gpsAgeImg).attr('alt', 'GPS location is old');
        $(gpsAgeImg).attr('width', '25');
        $(gpsAgeImg).attr('height', '25');
        $(gpsAgeImg).attr('title', 'GPS Status: This address / location is ' + jsonDevice.gpsAge + ' minutes old due to lack of GPS Satalite Signal. This can occur naturally in Tunnels, Parking Garages and etc. when the signal is obstructed. Check the installation of the device if this is prolonged or frequent.');
        gpsAgeDiv.appendChild(gpsAgeImg);
        titleDiv.appendChild(gpsAgeDiv);

        if (jsonDevice.gpsAge > gpsAgeAlert) {
            $(gpsAgeDiv).show();
        }
        else {
            $(gpsAgeDiv).hide();
        }

        //Timer in current event code
        var eventTimer = document.createElement('div');
        $(eventTimer).addClass('eventTimer');
        $(eventTimer).attr('style', 'float:right;');
        titleDiv.appendChild(eventTimer);

        //        <input type="checkbox" id="unitId1234" onclick="showDevice('1234')" />
        var chk = document.createElement('input');
        $(chk).attr('type', 'checkbox');
        $(chk).attr('id', 'chk' + jsonDevice.deviceId);
        $(chk).attr("onclick", "showDevice('" + jsonDevice.deviceId + "')");
        //5/25/2014: Implementing user preferences... 
        $(chk).prop("checked", jsonDevice.showDevice);
        titleDiv.appendChild(chk);

        //        <span class="deviceName">Truck 1 (Driving)</span>
        var span1 = document.createElement('span');
        titleDiv.appendChild(span1);
        var devName = document.createElement('a');
        $(devName).attr('id', 'deviceName' + jsonDevice.deviceId);
        span1.appendChild(devName);
        $(devName).attr('href', '#');
        $(devName).addClass('deviceName');
        $(devName).text(jsonDevice.name + ' (' + jsonDevice.eventName + ')');
        //$(devName).attr("onclick", "openDeviceInfoWindow(" + jsonDevice.latitude + ", " + jsonDevice.longitude + ", '" + jsonDevice.infoTable + "')");
        $(devName).attr("onclick", "openDeviceInfoWindow('" + jsonDevice.deviceId + "')");

        //    </div>

        //    <div class="deviceInfo">
        var infoDiv = document.createElement('div');
        li.appendChild(infoDiv);
        $(infoDiv).addClass('deviceInfo');

        //        <p class="deviceInfoDet">Current address..</p>
        var p1 = document.createElement('p');
        $(p1).attr('id', 'deviceAddress' + jsonDevice.deviceId);
        infoDiv.appendChild(p1);
        $(p1).addClass('deviceInfoDet');
        $(p1).text(jsonDevice.fullAddress);

        //        <p class="deviceInfoDet">35 mph heading North at 8/4/2011 14:58</p>
        var p2 = document.createElement('p');
        $(p2).attr('id', 'deviceExtraInfo' + jsonDevice.deviceId);
        infoDiv.appendChild(p2);
        $(p2).addClass('deviceInfoDet');
        //var eventDate = dateFormat((new Date(parseInt(jsonDevice.eventDate.replace(/\/+Date\(([\d+-]+)\)\/+/, '$1')))), "m/d/yyyy h:MM TT");
        $(p2).text(jsonDevice.speed + ' mph heading ' + jsonDevice.heading + ' at ' + jsonDevice.eventDateString);
        //    </div>

        //DRIVER
        var p3 = document.createElement('p');
        $(p3).attr('id', 'deviceDriver' + jsonDevice.deviceId);
        $(p3).addClass('deviceInfoDet');
        if (jsonDevice.driverName == '') {
            if (jsonDevice.hasIButtonWithoutDriver == true) {

                var ibndDiv = document.createElement('div');

                //<div>
                //  <img style="width:auto; height:auto;vertical-align: middle;">
                //  <span>It does work on all browsers</span>
                //</div>

                var ibnd = document.createElement('span');
                $(ibnd).addClass('deviceInfoDet');
                $(ibnd).text('Driver: iButton ' + jsonDevice.iButtonRaw + ' has no driver assigned!');
                ibndDiv.appendChild(ibnd);

                var ibtnNoDriverImg = document.createElement('img');
                $(ibtnNoDriverImg).attr('id', 'ibtnNoDriverImg' + jsonDevice.deviceId);
                $(ibtnNoDriverImg).attr('src', 'img/alert_16.png');
                $(ibtnNoDriverImg).attr('alt', 'iButton with no driver assigned');
                $(ibtnNoDriverImg).attr('width', '16');
                $(ibtnNoDriverImg).attr('height', '16');
                $(ibtnNoDriverImg).attr('title', 'iButton ' + jsonDevice.iButtonRaw + ' has been linked to this vehicle but no driver is assigned to this iButton.  You can assign the driver to the iButton in the Settings module.');
                $(ibtnNoDriverImg).attr('style', 'width:16px; height:16px;vertical-align: middle;');
                ibndDiv.appendChild(ibtnNoDriverImg);

                infoDiv.appendChild(ibndDiv);
            }
            else {
                $(p3).text('Driver: N/A');
                infoDiv.appendChild(p3);
            }
        }
        else {
            $(p3).text('Driver: ' + jsonDevice.driverName);
            infoDiv.appendChild(p3);
        }

        //Icons for 4 inputs
        //<div class="inputsIcons">
        if (jsonDevice.hasInputs == true) {
            var inputsDiv = document.createElement('div');
            infoDiv.appendChild(inputsDiv);
            $(inputsDiv).attr('id', 'devInputs_' + jsonDevice.deviceId);
            $(inputsDiv).addClass('inputsIcons');

            //$(inputsDiv).hide();

            //    <div class="inputsIcon"></div>
            var input4Div = document.createElement('div')
            inputsDiv.appendChild(input4Div);
            $(input4Div).attr('id', 'devInput4_' + jsonDevice.deviceId);
            $(input4Div).addClass('inputIcon');

            var input4TitleDiv = document.createElement('div');
            inputsDiv.appendChild(input4TitleDiv);
            input4TitleDiv.innerHTML = 'Input 4';
            $(input4TitleDiv).attr('id', 'devInput4Title_' + jsonDevice.deviceId);
            $(input4TitleDiv).addClass('inputsTitle');

            //    <div class="inputsIcon"></div>
            var input3Div = document.createElement('div')
            inputsDiv.appendChild(input3Div);
            $(input3Div).attr('id', 'devInput3_' + jsonDevice.deviceId);
            $(input3Div).addClass('inputIcon');

            var input3TitleDiv = document.createElement('div');
            inputsDiv.appendChild(input3TitleDiv);
            input3TitleDiv.innerHTML = 'Input 3';
            $(input3TitleDiv).attr('id', 'devInput3Title_' + jsonDevice.deviceId);
            $(input3TitleDiv).addClass('inputsTitle');

            //    <div class="inputsIcon"></div>
            var input2Div = document.createElement('div')
            inputsDiv.appendChild(input2Div);
            $(input2Div).attr('id', 'devInput2_' + jsonDevice.deviceId);
            $(input2Div).addClass('inputIcon');

            var input2TitleDiv = document.createElement('div');
            inputsDiv.appendChild(input2TitleDiv);
            input2TitleDiv.innerHTML = 'Input 2';
            $(input2TitleDiv).attr('id', 'devInput2Title_' + jsonDevice.deviceId);
            $(input2TitleDiv).addClass('inputsTitle');

            //    <div class="inputsIcon"></div>
            var input1Div = document.createElement('div')
            inputsDiv.appendChild(input1Div);
            $(input1Div).attr('id', 'devInput1_' + jsonDevice.deviceId);
            $(input1Div).addClass('inputIcon');

            var input1TitleDiv = document.createElement('div');
            inputsDiv.appendChild(input1TitleDiv);
            input1TitleDiv.innerHTML = 'Input 1';
            $(input1TitleDiv).attr('id', 'devInput1Title_' + jsonDevice.deviceId);
            $(input1TitleDiv).addClass('inputsTitle');

            //</div>

            updateDeviceInputsStatus(jsonDevice);
        }

        //<div style="clear: both;"></div>
        var clearInputsDiv = document.createElement('div');
        infoDiv.appendChild(clearInputsDiv);
        $(clearInputsDiv).attr('style', 'clear:both;');

        //    <div class="deviceActions">
        var actionsDiv = document.createElement('div');
        li.appendChild(actionsDiv);
        $(actionsDiv).addClass('deviceActions');

        //        <a href="#" class="deviceAction" onclick="pingDevice('1234')">Ping</a>
        //var ping = document.createElement('a');
        //actionsDiv.appendChild(ping);
        //ping.setAttribute('href', '#');
        //$(ping).addClass('deviceAction');
        //ping.setAttribute('onclick', 'pingDevice("' + jsonDevice.deviceId + '")');
        //$(ping).text('Ping');

        var telemetry = document.createElement('a');
        actionsDiv.appendChild(telemetry);
        //telemetry.setAttribute('href', '#');
        $(telemetry).addClass('deviceAction');
        telemetry.setAttribute('onclick', 'setOutputs("' + jsonDevice.deviceId + '")');
        $(telemetry).text('Telemetry');

        var quickDlg = document.createElement('a');
        actionsDiv.appendChild(quickDlg);
        //quickDlg.setAttribute('href', '#');
        $(quickDlg).addClass('deviceAction');
        $(quickDlg).attr('style','padding-left:10px;')
        quickDlg.setAttribute('onclick', 'sendQuickMessage("' + jsonDevice.deviceId + '","' + '' + jsonDevice.name + '","' + jsonDevice.driverId + '")');
        $(quickDlg).text(' - Send Quick Message');

        //    </div>
        //</li>
    }
    catch (err) {
        alert('addDeviceToTrackingList: ' + err.description);
    }
}

function loadFleetList() {
    try {
        var jsonDevice = false;
        var ul = document.getElementById('fleetList');
        removeAllChildNodes(ul);

        for (var ind = 0; ind < jsonDevices.myDevices.length; ind++) {
            jsonDevice = eval('(' + jsonDevices.myDevices[ind] + ')');
            addDeviceToTrackingList(jsonDevice);
        }

        loadComboBox(jsonDevices.myDevices, document.getElementById('cboBreadcrumbVehicles'), 'Select a Vehicle');

    }
    catch (err) {
        alert('loadFleetList: ' + err.description);
    }
}

function loadDevices() {
    try {
        getDevices(1, currentGroupId);

        if (jsonDevices) {
            if (!_.isUndefined(jsonDevices.result)) {
                if (jsonDevices.result == 'failure') {
                    location.href = 'login.html';
                }
            }
            else {
                if (jsonDevices.envelope) {
                    var env = eval('(' + jsonDevices.envelope + ')');
                    lastRefreshOn = env.lastFetchOn;
                }

                loadFleetList();

                //Make sure all checkmarks of fleetList are checked.  This may be redundant, but it seems in some IE versions it is not taking it when it is marked upon creation.
                $("#fleetList input:checkbox").each(function () {
                    this.checked = true;
                });

                createFleetMarkers();

                //5/25/2014: Implementing user preferences... 
                userPreferences_showDevice();

                autoCenter();

                //Initiate the recurrent refresh...
                setInterval("getLastKnowLocation()", refreshLoc * 1000);
                setInterval("calcCurrentEventTimers()", 1000);
            }
        }
    }
    catch (err) {
        alert('loadDevices: ' + err.description);
    }
}

function loadDevicesBySearchText(searchText) {
    try {
        getDeviceBySearch(1, currentGroupId, searchText);

        if (jsonDevices) {
            if (!_.isUndefined(jsonDevices.result)) {
                if (jsonDevices.result == 'failure') {
                    location.href = 'login.html';
                }
            }
            else {
                if (jsonDevices.envelope) {
                    var env = eval('(' + jsonDevices.envelope + ')');
                    lastRefreshOn = env.lastFetchOn;
                }

                loadFleetList();

                //Make sure all checkmarks of fleetList are checked.  This may be redundant, but it seems in some IE versions it is not taking it when it is marked upon creation.
                $("#fleetList input:checkbox").each(function () {
                    this.checked = true;
                });

                createFleetMarkers();

                //5/25/2014: Implementing user preferences... 
                userPreferences_showDevice();

                autoCenter();

                //Initiate the recurrent refresh...
                setInterval("getLastKnowLocation()", refreshLoc * 1000);
                setInterval("calcCurrentEventTimers()", 1000);
            }
        }
    }
    catch (err) {
        alert('loadDevices: ' + err.description);
    }
}

function userPreferences_showDevice() {
    try {
        for (var ind = 0; ind < jsonDevices.myDevices.length; ind++) {
            jsonDevice = eval('(' + jsonDevices.myDevices[ind] + ')');
            if (jsonDevice.showDevice == true) {
                addOneDeviceToMap(jsonDevice.deviceId);
                $("#chk" + jsonDevice.deviceId).prop('checked',true);
            }
            else {
                removeOneDeviceFromMap(jsonDevice.deviceId);
                $("#chk" + jsonDevice.deviceId).prop('checked', false);
            }
        }

        autoCenter();
    }
    catch (err) {
        alert('userPreferences_showDevice: ' + err.description);
    }
}

//==============================================
// Traverse all devices in fleet list and show the time the device has been in the current event
function calcCurrentEventTimers() {
    try {
        var currTime = new Date();
        var initTime = new Date();
        var lastEventTime = new Date();
        var UTCstring = (new Date()).toUTCString();

        var utc = new Date(currTime.getTime() + currTime.getTimezoneOffset() * 60000);
        var result = '';
        var eventCode = '';
        var diff = 0;
        var diff2 = 0;
        var totalSec = 0;
        var days = 0;
        var hours = 0;
        var minutes = 0;
        var seconds = 0;
        $('#fleetList li').each(function () {

            result = '';
            eventCode = $(this).attr('data-eventCode');
            initTime = $(this).attr('data-eventCodeStartedOn');
            lastEventTime = $(this).attr('data-eventDate');

            if (initTime == '1/1/1900 12:00:00 AM') {
                result = '';
            }
            else {
                diff = new Date(utc) - new Date(initTime);
                diff2 = new Date(utc) - new Date(lastEventTime);

                if (diff2 > 86400000 && (diff > 2592000000 || (eventCode == '03' && diff > 86400000))) {
                    if (eventCode == '03' && diff > 86400000) {
                        result = '(Ignition ON for more than 24 hours)';

                    } else {
                        // Last event more than 30 days ago
                        result = '(Over 30 days inactive)';
                    }
                }
                else {
                    if (diff < 0) {
                        diff = 0;
                    }
                    totalSec = diff / 1000;

                    days = parseInt(totalSec / 86400);
                    hours = parseInt(totalSec / 3600) % 24;
                    minutes = parseInt(totalSec / 60) % 60;
                    seconds = parseInt(totalSec % 60);

                    //var result = (hours < 10 ? "0" + hours : hours) + "-" + (minutes < 10 ? "0" + minutes : minutes) + "-" + (seconds < 10 ? "0" + seconds : seconds);
                    var result = '';
                    if (days > 0) {
                        result = result + days + 'd:';
                    }
                    if (hours > 0) {
                        result = result + hours + 'h:';
                    }
                    if (minutes > 0) {
                        result = result + minutes + 'm:';
                    }
                    result = '(' + result + seconds + 's)';
                }
            }

            $(this).find('.eventTimer').html(result);
        });
    }
    catch (err) {
        alert('calcCurrentEventTimers: ' + err.description);
    }
}

//==============================================
// -- GET AND UPDATE LAST KNOWN LOCATION
function updateDeviceInFleetList(jsonDevice) {
    try {
        var li = document.getElementById('deviceId' + jsonDevice.deviceId);
        if (li) {

            var currEventCode = $(li).attr('data-eventCode');
            var currGPSAge = $(li).attr('data-gpsAge');

            if (currEventCode != jsonDevice.eventCode) {
                $(li).attr('data-eventCode', jsonDevice.eventCode);
                $(li).attr('data-eventDate', jsonDevice.eventDateString);
                $(li).attr('data-eventCodeStartedOn', jsonDevice.eventCodeStartedOnString);
            }

            if (jsonDevice.isNotWorking == true) {
                $('#titleDiv' + jsonDevice.deviceId).attr('style', 'background-color:#eee9e9;');
            }
            else {
                $('#titleDiv' + jsonDevice.deviceId).attr('style', 'background-color:' + eventColor(jsonDevice.eventCode));
            }


            $('#deviceName' + jsonDevice.deviceId).text(jsonDevice.name + ' (' + jsonDevice.eventName + ')');
            $('#deviceAddress' + jsonDevice.deviceId).text(jsonDevice.fullAddress);
            //var eventDate = dateFormat((new Date(parseInt(jsonDevice.eventDate.replace(/\/+Date\(([\d+-]+)\)\/+/, '$1')))), "m/d/yyyy h:MM TT");
            var eventDate = jsonDevice.eventDateString;
            $('#deviceExtraInfo' + jsonDevice.deviceId).text(jsonDevice.speed + ' mph heading ' + jsonDevice.heading + ' at ' + eventDate);

            //Update DRIVER
            if (jsonDevice.driverName == '') {
                if (jsonDevice.hasIButtonWithoutDriver == true) {
                    $("#deviceDriver" + jsonDevice.deviceId).text('Driver: ' + 'iButton ' + jsonDevice.iButtonRaw + ' not assigned to driver!');
                }
                else {
                    $("#deviceDriver" + jsonDevice.deviceId).text('Driver: N/A');
                }
            }
            else {
                $("#deviceDriver" + jsonDevice.deviceId).text('Driver: ' + jsonDevice.driverName);
            }


            if (jsonDevice.isNotWorking == false) {
                updateStreetViewBtn(jsonDevice.deviceId, jsonDevice.latitude, jsonDevice.longitude, jsonDevice.heading);
            }

            if (jsonDevice.isPowerCut == true) {
                $('#powerCutDiv' + jsonDevice.deviceId).show();
            }
            else {
                $('#powerCutDiv' + jsonDevice.deviceId).hide();
            }

            if (jsonDevice.isBadIgnitionInstall == true) {
                $('#badIgnitionDiv' + jsonDevice.deviceId).show();
            }
            else {
                $('#badIgnitionDiv' + jsonDevice.deviceId).hide();
            }

            if (currGPSAge != jsonDevice.gpsAge) {
                $(li).attr('data-gpsAge', jsonDevice.gpsAge);
                $('#gpsAgeImg' + jsonDevice.deviceId).attr('title', 'GPS Status: This address / location is ' + jsonDevice.gpsAge + ' minutes old due to lack of GPS Satalite Signal. This can occur naturally in Tunnels, Parking Garages and etc. when the signal is obstructed. Check the installation of the device if this is prolonged or frequent.');
            }

            if (jsonDevice.gpsAge > gpsAgeAlert) {
                $('#gpsAgeDiv' + jsonDevice.deviceId).show();
            }
            else {
                $('#gpsAgeDiv' + jsonDevice.deviceId).hide();
            }

            updateDeviceInputsStatus(jsonDevice);

        }
    }
    catch (err) {
        //alert('updateFleetList: ' + err.description);
    }
}

function updateDeviceInputsStatus(jsonDevice) {
    try{
        if (jsonDevice.hasInputs == true) {
            $('#devInputs_' + jsonDevice.deviceId).show();

            //INPUT 1
            if (jsonDevice.sw1_isConnected == true) {
                $('#devInput1Title_' + jsonDevice.deviceId).show();
                $('#devInput1_' + jsonDevice.deviceId).show();

                $('#devInput1Title_' + jsonDevice.deviceId).text(jsonDevice.input1Name);
                if (jsonDevice.sw1 == true) {
                    $('#devInput1_' + jsonDevice.deviceId).text('ON');
                    $('#devInput1_' + jsonDevice.deviceId).attr('style', 'background-color:#00ff00');
                }
                else {
                    $('#devInput1_' + jsonDevice.deviceId).text('OFF');
                    $('#devInput1_' + jsonDevice.deviceId).attr('style', 'background-color:#ff0000');
                }
            }
            else {
                $('#devInput1Title_' + jsonDevice.deviceId).hide();
                $('#devInput1_' + jsonDevice.deviceId).hide();
            }

            //INPUT 2
            if (jsonDevice.sw2_isConnected == true) {
                $('#devInput2Title_' + jsonDevice.deviceId).show();
                $('#devInput2_' + jsonDevice.deviceId).show();

                $('#devInput2Title_' + jsonDevice.deviceId).text(jsonDevice.input2Name);
                if (jsonDevice.sw2 == true) {
                    $('#devInput2_' + jsonDevice.deviceId).text('ON');
                    $('#devInput2_' + jsonDevice.deviceId).attr('style', 'background-color:#00ff00');
                }
                else {
                    $('#devInput2_' + jsonDevice.deviceId).text('OFF');
                    $('#devInput2_' + jsonDevice.deviceId).attr('style', 'background-color:#ff0000');
                }
            }
            else {
                $('#devInput2Title_' + jsonDevice.deviceId).hide();
                $('#devInput2_' + jsonDevice.deviceId).hide();
            }

            //INPUT 3
            if (jsonDevice.sw3_isConnected == true) {
                $('#devInput3Title_' + jsonDevice.deviceId).show();
                $('#devInput3_' + jsonDevice.deviceId).show();

                $('#devInput3Title_' + jsonDevice.deviceId).text(jsonDevice.input3Name);
                if (jsonDevice.sw3 == true) {
                    $('#devInput3_' + jsonDevice.deviceId).text('ON');
                    $('#devInput3_' + jsonDevice.deviceId).attr('style', 'background-color:#00ff00');
                }
                else {
                    $('#devInput3_' + jsonDevice.deviceId).text('OFF');
                    $('#devInput3_' + jsonDevice.deviceId).attr('style', 'background-color:#ff0000');
                }
            }
            else {
                $('#devInput3Title_' + jsonDevice.deviceId).hide();
                $('#devInput3_' + jsonDevice.deviceId).hide();
            }

            //INPUT 4
            if (jsonDevice.sw4_isConnected == true) {
                $('#devInput4Title_' + jsonDevice.deviceId).show();
                $('#devInput4_' + jsonDevice.deviceId).show();

                $('#devInput4Title_' + jsonDevice.deviceId).text(jsonDevice.input4Name);
                if (jsonDevice.sw4 == true) {
                    $('#devInput4_' + jsonDevice.deviceId).text('ON');
                    $('#devInput4_' + jsonDevice.deviceId).attr('style', 'background-color:#00ff00');
                }
                else {
                    $('#devInput4_' + jsonDevice.deviceId).text('OFF');
                    $('#devInput4_' + jsonDevice.deviceId).attr('style', 'background-color:#ff0000');
                }
            }
            else {
                $('#devInput4Title_' + jsonDevice.deviceId).hide();
                $('#devInput4_' + jsonDevice.deviceId).hide();
            }

        }
        else {
            $('#devInputs_' + jsonDevice.deviceId).hide();
        }
    }
    catch (err) {
        //alert('updateDeviceInputsStatus: ' + err.description);
    }
}

function updateDeviceMarkerPosition(jsonDevice) {
    try {
        if (jsonDevice.isNotWorking == false) {
            if (markersArray[jsonDevice.deviceId]) {
                var devLatLng = new google.maps.LatLng(jsonDevice.latitude, jsonDevice.longitude);
                markersArray[jsonDevice.deviceId].setPosition(devLatLng);
                markersArray[jsonDevice.deviceId].setIcon(jsonDevice.iconUrl);

                var content = jsonDevice.infoTable;
                var deviceId = jsonDevice.deviceId;
                (function (marker, content, deviceId) {
                    google.maps.event.addListener(marker, 'click', function () {
                        if (!infowindow) {
                            infowindow = new google.maps.InfoWindow();
                        }
                        infowindow.deviceId = deviceId;
                        infowindow.setContent(content);
                        infowindow.open(map, marker);
                    });
                })(markersArray[jsonDevice.deviceId], content, deviceId);

            }
        }
    }
    catch (err) {
        alert('updateDeviceMarkerPosition: ' + err.description);
    }
}

function updateActiveInfoWindow(jsonDevice) {
    try {
        if (infowindow.map != null) {
            if (infowindow.deviceId == jsonDevice.deviceId) {
                infowindow.setContent(jsonDevice.infoTable);
                var devLatLng = new google.maps.LatLng(jsonDevice.latitude, jsonDevice.longitude);
                infowindow.setPosition(devLatLng);
            }
        }
    }
    catch (err) {
        alert('updateActiveInfoWindow: ' + err.description);
    }
}

function getLastKnowLocation() {
    try {
        getDevices(2, currentGroupId);

        if (jsonDevices) {
            if (jsonDevices.envelope) {
                var env = eval('(' + jsonDevices.envelope + ')');
                lastRefreshOn = env.lastFetchOn;
            }
            if (jsonDevices.myDevices) {
                if (jsonDevices.myDevices.length > 0) {
                    for (var ind = 0; ind < jsonDevices.myDevices.length; ind++) {
                        jsonDevice = eval('(' + jsonDevices.myDevices[ind] + ')');

                        if (jsonDevice.isNotWorking == false) {
                            updateDeviceInFleetList(jsonDevice);
                            updateDeviceMarkerPosition(jsonDevice);
                            updateActiveInfoWindow(jsonDevice);
                        }
                    }
                    autoCenter();
                }
            }
        }
    }
    catch (err) {
        alert('getLastKnowLocation: ' + err.description);
    }
}

//===============================================
// -- SHOW / HIDE DEVICES FROM MAP

function showDevice(deviceId) {
    try {
        var chk = document.getElementById('chk' + deviceId);

        var jsonUserPref = { moduleName: 'TRACKING', preference: 'SHOWDEVICE', val1: deviceId, val2: chk.checked };
        updateUserPref(jsonUserPref);

        if (chk.checked == true) {
            addOneDeviceToMap(deviceId);
        }
        else {
            removeOneDeviceFromMap(deviceId);
        }
        autoCenter();
    }
    catch (err) {
        alert('showDevice: ' + err.description);
    }
}

function addAllDevicesToMap() {
    try {
        //5/25/2014: Commented because it is making it fail.. all units are selected every time..
        //var jsonUserPref = { moduleName: 'TRACKING', preference: 'SHOWDEVICE', val1: '0', val2: true };
        //updateUserPref(jsonUserPref);

        $("#fleetList input:checkbox").each(function () {
            this.checked = true;
        });

        if (markersArray) {
            for (i in markersArray) {
                if (markersArray[i].map == null) {
                    markersArray[i].setMap(map);
                }
            }
        }
        autoCenter();
    }
    catch (err) {
        alert('addAllDevicesToMap: ' + err.description);
    }
}

function addOneDeviceToMap(deviceId) {
    try {
        if (markersArray[deviceId]) {
            markersArray[deviceId].setMap(map);
        }
    }
    catch (err) {
        alert('addOneDeviceToMap: ' + err.description);
    }
}

function removeAllDevicesFromMap() {
    try {
        //5/25/2014: Commented because it is making it fail.. all units are deselected every time..
        //var jsonUserPref = { moduleName: 'TRACKING', preference: 'SHOWDEVICE', val1: '0', val2: false };
        //updateUserPref(jsonUserPref);

        $("#fleetList input:checkbox").each(function () {
            this.checked = false;
        });

        if (markersArray) {
            for (i in markersArray) {
                markersArray[i].setMap(null);
            }
        }
    }
    catch (err) {
        alert('removeAllDevicesFromMap: ' + err.description);
    }
}

function removeOneDeviceFromMap(deviceId) {
    try {
        if (markersArray[deviceId]) {
            markersArray[deviceId].setMap(null);
        }
        infowindow.close();
    }
    catch (err) {
        alert('removeOneDeviceFromMap: ' + err.description);
    }
}

//=========================================
//---- Driving Directions

function dispatchToTypeToggle(id) {
    try {
        if (id == 1) {
            $('#cboDispatchGeofences').show();
            $('.dispatchToAddress').attr('disabled', 'disabled');
        }
        else {
            $('#cboDispatchGeofences').hide();
            $('.dispatchToAddress').removeAttr('disabled');
        }

    }
    catch (err) {
        alert('dispatchToTypeToggle: ' + err.description);
    }
}

function dispatchThisVehicle(deviceId, driverId, via) {
    try {
        if (dispatchLastLoc == null) {
            alert('Please click Find Location to resolve this location');
            return;
        }
        if (_.isUndefined(dispatchLastLoc)) {
            alert('Please click Find Location to resolve this location');
            return;
        }
        if (_.isUndefined(dispatchLastLoc.lat())) {
            alert('Please click Find Location to resolve this location');
            return;
        }
        if (!isNumber(dispatchLastLoc.lat())) {
            alert('Please click Find Location to resolve this location');
            return;
        }
        if (dispatchLastLoc.lat() == 0) {
            alert('Please click Find Location to resolve this location');
            return;
        }

        //via: 1: text; 2: email; 3: eTrack Field app
        if (_.isUndefined(via) || via == 0) {
            via = 1;
        }

        if (deviceId != '0') {
            var driverId = $('#dispatchDeviceId' + deviceId).attr('data-driverId');
            if (driverId == '0') {
                alert('This vehicle has no user/driver assigned.  You cannot send the job to this vehicle');
                return
            }
        }
        else {
            if (_.isUndefined(driverId) || driverId == '0') {
                alert('Please select a user/driver to send this job to.');
                return
            }
        }

        var results = false;
        if (!_.isUndefined(deviceId)) {
            results = directionsResultArray[deviceId];
        }

        if (_.isUndefined(driverId)) {
            driverId = 0;
        }

        var isGeofence = false;
        var geofenceId = 0;
        var dispatchTypeId = $('input[name="dispatchToType"]:checked').val();
        if (dispatchTypeId == 1) {
            isGeofence = true;
            geofenceId = $('#cboDispatchGeofences').val();
        }
        var name = $('#dispatchName').val();
        if (name == '') {
            alert('The name is mandatory. Please enter a name for this job.  Name example: Customer name');
            return
        }
        var phone = $('#dispatchJobPhone').val();
        var street = $('#dispatchStreet').val();
        var city = $('#dispatchCity').val();
        var state = $('#dispatchState').val();
        var postalCode = $('#dispatchPostalCode').val();
        var description = $('#dispatchJobDescription').val();
        var lat = dispatchLastLoc.lat();
        var lng = dispatchLastLoc.lng();

        var sendSMS = false;
        if (via <= 1) {
            sendSMS = true;
        }

        data = 't=' + getTokenCookie('ETTK') + '&deviceId=' + escape(deviceId) + '&isGeofence=' + escape(isGeofence) + '&geofenceId=' + escape(geofenceId) + '&name=' + escape(name) + '&phone=' + escape(phone) + '&street=' + escape(street) + '&city=' + escape(city) + '&state=' + escape(state) + '&postalCode=' + escape(postalCode) + '&description=' + escape(description) + '&lat=' + escape(lat) + '&lng=' + escape(lng) + '&sendSMS=' + escape(sendSMS) + '&driverId=' + driverId + '&via=' + via;
        var tmpJson = dbReadWrite('saveWorkOrder', data, true, false);

        if (tmpJson) {
            if (tmpJson.result != 'failure') {
                if (tmpJson.result == 'NOTSENT') {
                    alert('Could not send Job.  Please make sure that the device has a driver assigned and that the driver has a cellphone assigned.');
                }
                else {
                    alert('Job sent successfully');
                    clearDispatchPanel();

                }
            }
            else {
                alert('Job could not be sent.  Please try again.');
            }
        }
    }
    catch (err) {
        alert('dispatchThisVehicle: ' + err.description);
    }
}

function viewDrivingDirections(deviceId) {
    try {
        removeAllDevicesFromMap();

        //We only clean the map, not the panel...
        if (directionsRenderer) {
            directionsRenderer.setMap(null);
        }

        if (!directionsRenderer) {
            directionsRenderer = new google.maps.DirectionsRenderer();
        }

        directionsRenderer.setMap(null);

        var results = directionsResultArray[deviceId];

        directionsRenderer.setMap(map);
        directionsRenderer.setDirections(results);
        directionsRenderer.getMap();
    }
    catch (err) {
        alert('viewDrivingDirections: ' + err.description);
    }
}

function dispatchDeviceDirections(deviceId, results) {
    try {
        var targetPanel = document.getElementById('dispatchDirections' + deviceId);

        //Clean both the map and the driving directions panel
        if (directionsRenderer) {
            directionsRenderer.setMap(null);
            directionsRenderer.setPanel(null);
        }

        if (!directionsRenderer) {
            directionsRenderer = new google.maps.DirectionsRenderer();
        }

        directionsRenderer.setDirections(results);
        directionsRenderer.setPanel(targetPanel);
        directionsRenderer.getPanel();


        //Enable the possible actions to the driving directions...
        $('.directionsActionsClass').each(function () {
            $(this).hide(); 
        });
        $('#directionsActionsDiv' + deviceId).show();

    }
    catch (err) {
        alert('dispatchDeviceDirections: ' + err.description);
    }
}

function dispatchDevice(deviceId, latitude, longitude) {
    try {
        var startPoint = new google.maps.LatLng(latitude, longitude);
        var endPoint = dispatchLastLoc;

        getDirections(deviceId, startPoint, endPoint, dispatchDeviceDirections);

    }
    catch (err) {
        alert('dispatchDevice: ' + err.description);
    }
}

//via: 1: SMS; 2: Email; 3: eTrack Field
function dispatchDriver(via) {
    try {
        var driverId = getComboBoxSelectedOption($('#cbxDriversList')[0]);
        dispatchThisVehicle(0, driverId, via);
    }
    catch (err) {
        alert('dispatchDriver: ' + err.description);
    }
}

//=========================================
//---- Find Closest Device

function addDeviceToDispatchList(jsonDevice, listName) {
    try {
        //var ul = document.getElementById('devicesByDistanceList');
        var ul = document.getElementById(listName);

        //<li>
        var li = document.createElement('li');
        $(li).attr('id', 'dispatchDeviceId' + jsonDevice.deviceId);
        $(li).attr('data-driverId', jsonDevice.driverId);
        ul.appendChild(li);

        //    <div class="deviceInfo" style="background-color:#51ec51;">
        var titleDiv = document.createElement('div');
        $(titleDiv).attr('id', 'dispatchTitleDiv' + jsonDevice.deviceId);
        li.appendChild(titleDiv);
        $(titleDiv).addClass('deviceInfo');
        $(titleDiv).attr('style', 'background-color:' + eventColor(jsonDevice.eventCode));

        //        <span class="deviceName">Truck 1 (Driving)</span>
        var span1 = document.createElement('span');
        titleDiv.appendChild(span1);
        var devName = document.createElement('a');
        $(devName).attr('id', 'dispatchDeviceName' + jsonDevice.deviceId);
        span1.appendChild(devName);
        $(devName).attr('href', '#');
        $(devName).addClass('deviceName');
        $(devName).text(jsonDevice.name + ' (' + jsonDevice.distanceTo + ' miles)');
        //$(devName).attr("onclick", "openDeviceInfoWindow(" + jsonDevice.latitude + ", " + jsonDevice.longitude + ", '" + jsonDevice.infoTable + "')");
        $(devName).attr("onclick", "openDeviceInfoWindow('" + jsonDevice.deviceId + "')");

        //    </div>

        //    <div class="deviceActions">
        var actionsDiv = document.createElement('div');
        titleDiv.appendChild(actionsDiv);
        $(actionsDiv).attr('style', 'float:right;padding-top:5px; padding-right:3px;');

        //        <a href="#" class="deviceAction" onclick="pingDevice('1234')">Ping</a>
        var dispatch = document.createElement('a');
        actionsDiv.appendChild(dispatch);
        $(dispatch).attr('href', '#');
        $(dispatch).addClass('deviceAction');
        $(dispatch).attr("onclick", "dispatchDevice('" + jsonDevice.deviceId + "', " + jsonDevice.latitude + ", " + jsonDevice.longitude + ")");
        $(dispatch).text('Select');

        var span2 = document.createElement('span');
        titleDiv.appendChild(span2);
        var devDriver = document.createElement('p');
        span2.appendChild(devDriver);
        $(devDriver).text('Driver: ' + jsonDevice.driverName);

        //    </div>

        var directionsDiv = document.createElement('div');
        $(directionsDiv).attr('id', 'dispatchDirections' + jsonDevice.deviceId);
        li.appendChild(directionsDiv);

        var directionsActionsDiv = document.createElement('div');
        $(directionsActionsDiv).attr('id', 'directionsActionsDiv' + jsonDevice.deviceId);
        $(directionsActionsDiv).addClass('directionsActionsClass');
        $(directionsActionsDiv).attr('style', 'width:100%;text-align:right;');
        directionsDiv.appendChild(directionsActionsDiv);

        //View Driving Directions in map
        var mapViewAnchor = document.createElement('a');
        $(mapViewAnchor).attr('href', '#');
        directionsActionsDiv.appendChild(mapViewAnchor);
        $(mapViewAnchor).addClass('deviceAction');
        $(mapViewAnchor).attr('style', 'padding-right:5px;');
        $(mapViewAnchor).attr("onclick", "viewDrivingDirections('" + jsonDevice.deviceId + "')");
        $(mapViewAnchor).text('View in map');

        //Send email to driver with driving directions
        var emailAnchor = document.createElement('a');
        $(emailAnchor).attr('href', '#');
        directionsActionsDiv.appendChild(emailAnchor);
        $(emailAnchor).addClass('deviceAction');
        $(emailAnchor).attr("onclick", "dispatchThisVehicle('" + jsonDevice.deviceId + "')");
        $(emailAnchor).text('Dispatch this vehicle');

        $(directionsActionsDiv).hide();

        //</li>
    }
    catch (err) {
        alert('addDeviceToDispatchList: ' + err.description);
    }
}

function findClosestDevice(destinationLoc) {
    try {

        $('#dispatchFleetListDiv').show();

        if (destinationLoc == undefined) {
            destinationLoc = dispatchLastLoc;
        }

        if (destinationLoc) {
            var d = null;
            var deviceLoc = null;
            var devices = [];
            var ind = 0;

            getDevices(3);
            if (jsonDevices.envelope) {
                var env = eval('(' + jsonDevices.envelope + ')');
                lastRefreshOn = env.lastFetchOn;
            }

            for (ind = 0; ind < jsonDevices.myDevices.length; ind++) {
                jsonDevice = eval('(' + jsonDevices.myDevices[ind] + ')');
                deviceLoc = new google.maps.LatLng(jsonDevice.latitude, jsonDevice.longitude);
                d = distanceTo(destinationLoc, deviceLoc);
                devices.push({ "deviceId": jsonDevice.deviceId, "name": jsonDevice.name, "driverId":jsonDevice.driverId, "driverName": jsonDevice.driverName, "driverPhone": jsonDevice.driverPhone, "eventCode": jsonDevice.eventCode, "distanceTo": d, "latitude": jsonDevice.latitude, "longitude": jsonDevice.longitude, "infoTable": jsonDevice.infoTable });
            }

            //Sort the array (see www.javascriptkit.com/javatutors/arraysort2.shtml)
            devices.sort(function (a, b) { return a.distanceTo - b.distanceTo });

            var jsonDevice = false;
            var ul = document.getElementById('devicesByDistanceList');
            removeAllChildNodes(ul);

            addAllDevicesToMap();
            autoCenter();

            for (ind = 0; ind < devices.length; ind++) {
                addDeviceToDispatchList(devices[ind], 'devicesByDistanceList');
            }
        }
    }
    catch (err) {
        alert('findClosestDevice: ' + err.description);
    }
}
//===============================================================
//-- Enable Drivers list for dispatching

function getDrivers() {
    try {
        var data = 't=' + getTokenCookie('ETTK');
        driversList = dbReadWrite('getDrivers', data, true, false);

        return driversList;
    }
    catch (err) {
        alert('getDrivers: ' + err.description);
    }
}

function enableDriversList() {
    try {
        if (driversList == false) {
            getDrivers();
            var cbx = document.getElementById('cbxDriversList');
            if (_.isObject(driversList)) {
                loadComboBox(driversList.drivers, cbx, 'Select a Driver');
            }
        }
        $('#dispatchNoticeDiv').show();
        $('#dispatchDriversListDiv').show();
    }
    catch (err) {
        alert('enableDriversList: ' + err.description);
    }
}

//================================================================================
//-------- SAVE NEW LOCATION

function updateGeofencesCbx() {
    try {
        //alert('Under Construction');
    }
    catch (err) {
        alert('updateGeofencesCbx: ' + err.description);
    }
}

function saveNewDispatchLocation() {
    try {
        var name = $('#dispatchName').val();
        var phone = $('#dispatchJobPhone').val();
        var street = $('#dispatchStreet').val();
        var city = $('#dispatchCity').val();
        var state = $('#dispatchState').val();
        var postalCode = $('#dispatchPostalCode').val();
        var lat = dispatchLastLoc.lat();
        var lng = dispatchLastLoc.lng();

        data = 't=' + getTokenCookie('ETTK') + '&name=' + escape(name) + '&phone=' + escape(phone) + '&street=' + escape(street) + '&city=' + escape(city) + '&state=' + escape(state) + '&postalCode=' + escape(postalCode) + '&lat=' + lat + '&lng=' + lng;
        var tmpJson = dbReadWrite('saveGeofence', data, true, false);

        //tmpJson.result
        geofencesArray[tmpJson.result] = {'id': tmpJson.result, 'name': name};

        //Update the Geofences combo box...
        updateGeofencesCbx();

        alert(name + ' saved');

        $('#saveDispatchLocation').hide();
    }
    catch (err) {
        alert('saveNewLocation: ' + err.description);
    }
}

//================================================================================
//-------- CLEAR MAP

function clearMap() {
    try {

        //Hide all devices from map
        removeAllDevicesFromMap();

        //Clear driving directions in the map, if any...
        if (directionsRenderer) {
            directionsRenderer.setMap(null);
        }

        if (dispatchLastMarker) {
            dispatchLastMarker.setMap(null);
        }

        if (infowindow != undefined) {
            infowindow.close();
        }

        hideBreadcrumbTrail();

    }
    catch (err) {
        alert('clearMap: ' + err.description);
    }
}

//================================================================================
//-------- CLEAR DISPATCH PANEL

function clearDispatchPanel() {
    try {
        var ul = document.getElementById('devicesByDistanceList');
        removeAllChildNodes(ul);

        $('#dispatchFleetListDiv').hide();
        $('#saveDispatchLocation').hide();

//        var street = $('#dispatchStreet').attr('value', '');
//        var city = $('#dispatchCity').attr('value', '');
//        var state = $('#dispatchState').attr('value', '');
//        var postalCode = $('#dispatchPostalCode').attr('value', '');

        $('#dispatchName').attr('value', '');
        $('#dispatchJobPhone').attr('value', '');
        $('#dispatchStreet').attr('value', '');
        $('#dispatchCity').attr('value', '');
        $('#dispatchState').attr('value', '');
        $('#dispatchPostalCode').attr('value', '');
        $('#dispatchJobDescription').attr('value', '');
        $("#cboDispatchGeofences").prop('selectedIndex', 0);

        //Clear the global variables too
        dispatchLastAddress = null;
        dispatchLastLoc = null;
        if (directionsRenderer) {
            directionsRenderer.setMap(null);
        }
        directionsRenderer = null;
        dispatchGoogleResults = null;



        //        if (dispatchLastMarker) {
        //            dispatchLastMarker.setMap(null);
        //            dispatchLastMarker = null;
        //        }

        //        if (infowindow != undefined) {
        //            infowindow.close();
        //        }

        //        //Clear driving directions in the map, if any...
        //        directionsRenderer.setMap(null);
        clearMap();

    }
    catch (err) {
        alert('clearDispatchPanel: ' + err.description);
    }
}

//==================================================================
//----- Breadcrumb Trail

function createBreadcrumbTrail() {
    try {
        var deviceId = getComboBoxSelectedOption(document.getElementById('cboBreadcrumbVehicles'));

        if (deviceId == "0") {
            alert("Please select a device");
        }
        else {
            $("#waitingSpinner").show();
            breadCrumbLoad(deviceId);
        }
    }
    catch (err) {
        alert('createBreadcrumbTrail: ' + err.description);
    }
}

function breadCrumbLoadFailure(jqXHR, textStatus, errorThrown) {
    try {
        alert('No data found in the selected timeframe.');
        $("#waitingSpinner").hide();

    }
    catch (err) {
        alert('breadCrumbLoadFailure: ' + err.description);
    }
}

function breadCrumbLoadSuccess(data, textStatus, jqXHR) {
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
                    breadcrumbResult = jsonObj;
                    if (breadcrumbResult.trail.length > 0) {
                        mapBreadcrumbTrail();
                        //Now load the details in the panel...
                        $('#trailDetailDiv').show();
                        removeAllChildNodes(document.getElementById('trailDetailsList'));
                        for (var ind = 0; ind < breadcrumbResult.trail.length; ind++) {
                            var jsonItem = eval('(' + breadcrumbResult.trail[ind] + ')');
                            addItemToTrailList(jsonItem, 'trailDetailsList', ind);
                        }
                    }
                    else {
                        alert('No data found in the selected timeframe');
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
        alert('breadCrumbLoadSuccess: ' + err.description);
    }
}

function breadCrumbLoad(deviceId) {
    try {
        var dateFrom = $('#breadcrumbDatepicker').val();
        var hourFrom = getComboBoxSelectedOption(document.getElementById('cboHourFrom'));
        var hourTo = getComboBoxSelectedOption(document.getElementById('cboHourTo'));

        clearMap();

        data = 't=' + getTokenCookie('ETTK') + '&deviceId=' + escape(deviceId) + '&dateFrom=' + escape(dateFrom) + '&hourFrom=' + escape(hourFrom) + '&hourTo=' + escape(hourTo);
        dbReadWriteAsync('getTrail2', data, breadCrumbLoadSuccess, breadCrumbLoadFailure);
    }
    catch (err) {
        alert('loadBreadCrumbTrail: ' + err.description);
    }
}

function mapBreadcrumbTrail() {
    try {
        //Reset the path, if any...
        if (!breadcrumbPath) {
            breadcrumbPath = new google.maps.MVCArray();
        }

        if (polyline) {
            clearBreadcrumbTrail();
        }
        polyline = new google.maps.Polyline();

        var bounds = new google.maps.LatLngBounds();
        var x, y = 0;

        for (var devInd = 0; devInd < breadcrumbResult.trail.length; devInd++) {
            var dev = eval('(' + breadcrumbResult.trail[devInd] + ')');
            var devLatLng = new google.maps.LatLng(dev.latitude, dev.longitude);
            breadcrumbPath.push(devLatLng);
            switch (dev.eventCode) { case '01': x = 28; y = 28; break; case '02': x = 14; y = 28; break; case '03': switch (dev.heading) { case 'N': x = 0; y = 0; break; case 'NE': x = 14; y = 0; break; case 'E': x = 28; y = 0; break; case 'SE': x = 42; y = 0; break; case 'S': x = 0; y = 14; break; case 'SW': x = 14; y = 14; break; case 'W': x = 28; y = 14; break; case 'NW': x = 42; y = 14; break; } break; case '04': x = 42; y = 28; break; case '05': x = 0; y = 28; case '08': x = 28; y = 28; case '09': x = 42; y = 28; break; default: x = 42; y = 28; break; }
            //var image = new google.maps.MarkerImage('images/TrailSprite.png', new google.maps.Size(14, 14), new google.maps.Point(x, y), new google.maps.Point(7, 7)
            var image = false;
            var spriteFile = 'images/TrailSprite.png';
            if (dev.sw1 || dev.sw2 || dev.sw3 || dev.sw4) {
                spriteFile = 'images/TrailSpriteSW.png';
            }
            image = new google.maps.MarkerImage(spriteFile, new google.maps.Size(14, 14), new google.maps.Point(x, y), new google.maps.Point(7, 7));

            var marker = new google.maps.Marker({ position: devLatLng, map: map, title: dev.fullAddress, icon: image });

            //var content = dev.infoTable;
            //(function (marker, content) {
            //    google.maps.event.addListener(marker, 'click', function () {
            //        if (!infowindow) {
            //            infowindow = new google.maps.InfoWindow();
            //        }
            //        infowindow.setContent(content);
            //        infowindow.open(map, marker);
            //    });
            //})(marker, content);
            var hId = dev.id;
            (function (marker, hId) {
                google.maps.event.addListener(marker, 'click', function () {
                    if (!infowindow) {
                        infowindow = new google.maps.InfoWindow();
                    }
                    var data = 't=' + getTokenCookie('ETTK') + '&id=' + hId;
                    var infoWin = dbReadWrite('getHDevices_InfoWindow', data, true, false);
                    if (_.has(infoWin, 'error')) {

                    }
                    else{
                        jsonInfoWin = eval('(' + infoWin.hist[0] + ')');
                        if (_.isObject(jsonInfoWin)) {
                            infowindow.setContent(jsonInfoWin.histInfoTable);
                            infowindow.setZIndex(999);
                            infowindow.open(map, marker);
                        }
                    }
                });
            })(marker, hId);

            polylineMarkers.push(marker);
            bounds.extend(devLatLng);
        }

        polyline.setPath(breadcrumbPath);
        polyline.setOptions({
            strokeColor: "#ff0000",
            strokeWeight: 1
        });
        polyline.setMap(map);

        map.fitBounds(bounds);
        google.maps.event.addListenerOnce(map, 'idle', function () {
            if (map.getZoom() > 19) {
                map.setZoom(19);
                getCurrentZoomLevel();
            }
        });

    }
    catch (err) {
        alert('mapBreadcrumbTrail: ' + err.description);
    }
}

function addItemToTrailList_old(jsonItem, listName, id) {
    try {
        var uniqueId = jsonItem.id + "_" + id;

        polylineDet[uniqueId] = jsonItem;

        var ul = document.getElementById(listName);
        var li = document.createElement('li');
        $(li).attr('id', 'trailDetId' + uniqueId);
        ul.appendChild(li);

        var titleDiv = document.createElement('div');
        $(titleDiv).attr('id', 'trailTitleDiv' + uniqueId);
        li.appendChild(titleDiv);
        $(titleDiv).addClass('trailInfo');
        $(titleDiv).attr('style', 'background-color:' + eventColor(jsonItem.eventCode));
        $(titleDiv).attr("onclick", "openTrailInfoWindow('" + uniqueId + "')");

        var span1 = document.createElement('span');
        titleDiv.appendChild(span1);
        var devName = document.createElement('a');
        $(devName).attr('id', 'trailDetName' + uniqueId);
        span1.appendChild(devName);
        $(devName).attr('href', '#');
        $(devName).addClass('trailInfoDet');
        //var eventDate = dateFormat((new Date(parseInt(jsonItem.eventDate.replace(/\/+Date\(([\d+-]+)\)\/+/, '$1')))), "m/d/yyyy h:MM TT");
        $(devName).text((id + 1) + ': ' + jsonItem.eventName + ' (' + jsonItem.speed + ' mph at ' + jsonItem.eventDateString + ')');

        var infoDiv = document.createElement('div');
        li.appendChild(infoDiv);
        $(infoDiv).addClass('trailInfo');
        $(infoDiv).attr("onclick", "openTrailInfoWindow('" + uniqueId + "')");

        var p1 = document.createElement('p');
        $(p1).attr('id', 'trailDetAddress' + uniqueId);
        infoDiv.appendChild(p1);
        $(p1).addClass('trailInfoDet');
        $(p1).text(jsonItem.fullAddress);
    }
    catch (err) {
        alert('addItemToTrailList: ' + err.description);
    }
}

function addItemToTrailList(jsonItem, listName, id) {
    try {
        var uniqueId = jsonItem.id + "_" + id;

        polylineDet[uniqueId] = jsonItem;

        var ul = document.getElementById(listName);
        var li = document.createElement('li');
        $(li).attr('id', 'trailDetId' + uniqueId);
        ul.appendChild(li);

        var titleDiv = document.createElement('div');
        $(titleDiv).attr('id', 'trailTitleDiv' + uniqueId);
        li.appendChild(titleDiv);
        $(titleDiv).addClass('trailInfo');
        $(titleDiv).attr('style', 'background-color:' + eventColor(jsonItem.eventCode));
        $(titleDiv).attr("onclick", "openTrailInfoWindow('" + uniqueId + "')");

        var span1 = document.createElement('span');
        titleDiv.appendChild(span1);
        var devName = document.createElement('a');
        $(devName).attr('id', 'trailDetName' + uniqueId);
        span1.appendChild(devName);
        $(devName).attr('href', '#');
        $(devName).addClass('trailInfoDet');
        //var eventDate = dateFormat((new Date(parseInt(jsonItem.eventDate.replace(/\/+Date\(([\d+-]+)\)\/+/, '$1')))), "m/d/yyyy h:MM TT");
        $(devName).text((id + 1) + ': ' + jsonItem.eventName + ' (' + jsonItem.speed + ' mph at ' + jsonItem.eventDateString + ')');

        var infoDiv = document.createElement('div');
        li.appendChild(infoDiv);
        $(infoDiv).addClass('trailInfo');
        $(infoDiv).attr("onclick", "openTrailInfoWindow('" + uniqueId + "')");

        var p1 = document.createElement('p');
        $(p1).attr('id', 'trailDetAddress' + uniqueId);
        infoDiv.appendChild(p1);
        $(p1).addClass('trailInfoDet');
        $(p1).text(jsonItem.fullAddress);
    }
    catch (err) {
        alert('addItemToTrailList: ' + err.description);
    }
}

function openTrailInfoWindow(id) {
    try {
        var jsonItem = polylineDet[id];
        if (jsonItem) {
            var devLatLng = new google.maps.LatLng(jsonItem.latitude, jsonItem.longitude);
            //infowindow.setContent(jsonItem.infoTable);
            //infowindow.setPosition(devLatLng);
            //infowindow.open(map);

            var data = 't=' + getTokenCookie('ETTK') + '&id=' + jsonItem.id;
            var infoWin = dbReadWrite('getHDevices_InfoWindow', data, true, false);
            if (_.has(infoWin, 'error')) {

            }
            else {
                var jsonInfoWin = eval('(' + infoWin.hist[0] + ')');
                if (_.isObject(jsonInfoWin)) {
                    infowindow.setContent(jsonInfoWin.histInfoTable);
                    infowindow.setPosition(devLatLng);
                    infowindow.setZIndex(999);
                    infowindow.open(map);
                }
            }


        }
    }
    catch (err) {
        alert('openDeviceInfoWindow: ' + err.description);
    }
}

function hideBreadcrumbTrail() {
    try {
        if (polyline) {
            polyline.setMap(null);
            if (polylineMarkers) {
                for (i in polylineMarkers) {
                    polylineMarkers[i].setMap(null);
                }
            }
        }
    }
    catch (err) {
        alert('hideBreadcrumbTrail: ' + err.description);
    }
}

function showBreadcrumbTrail() {
    try {
        if (isTrailHoursReady == false) {
            loadTrailHours();
            isTrailHoursReady = true;
        }
        if (polyline) {
            polyline.setMap(map);
            centerBreadcrumbTrail();
            if (polylineMarkers) {
                for (i in polylineMarkers) {
                    polylineMarkers[i].setMap(map);
                }
            }
        }
    }
    catch (err) {
        alert('showBreadcrumbTrail: ' + err.description);
    }
}

function clearBreadcrumbTrail() {
    try {
        if (breadcrumbPath) {
            breadcrumbPath.clear();
        }

        hideBreadcrumbTrail();
        polyline = null;
        if (polylineMarkers) {
            polylineMarkers.length = 0;
        }
        removeAllChildNodes(document.getElementById('traildetailsList'));
        $('#trailDetailDiv').hide();
    }
    catch (err) {
        alert('clearBreadcrumbTrail: ' + err.description);
    }
}

function centerBreadcrumbTrail() {
    try {
        if (polyline) {
            var tmpPath = polyline.getPath();
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < tmpPath.length; i++) {
                bounds.extend(tmpPath.b[i]);
            }
            map.fitBounds(bounds);
        }

    }
    catch (err) {
        alert('centerBreadcrumbTrail: ' + err.description);
    }
}

function setQuickTrailCustom() {
    try {
        $('input[name="quickTrailSpan"]').filter("[value=0]").prop('checked', true);
    }
    catch (err) {
        alert('setQuickTrailCustom: ' + err.description);
    }
}

function quickTrailChange(id) {
    try {
        $('#breadcrumbDatepicker').val(getNow());
        var endHour = getCurrentHour() + 1;
        if (endHour > 24) {
            endHour = 24;
        }
        var startHour = endHour;

        switch (id) {
            case 0:
                startHour = endHour - 1;
                break;
            case 1:
                startHour = endHour - 3;
                break;
            case 2:
                startHour = endHour - 6;
                break;
            case 3:
                startHour = 1;
                break;
            case 4:
                startHour = 1;
                endHour = 24;
                $('#breadcrumbDatepicker').val(getPreviousDates(-1));
                break;
        }

        if (startHour < 0) {
            startHour = 0;
        }

        $('#cboHourFrom').val(startHour);
        $('#cboHourTo').val(endHour);

    }
    catch (err) {
        alert('quickTrailChange: ' + err.description);
    }
}

function loadTrailHours() {
    try {
        var ampm = '';
        var i = 0;
        var j = 0;
        var jsonHours = [];
        for (i = 1; i <= 2; i++) { if (i == 1) { ampm = 'AM'; } else { ampm = 'PM'; } for (j = 1; j <= 12; j++) { if (i == 1 && j == 12) { jsonHours.push({ 'id': (j + (12 * (i - 1))), 'name': 'Noon' }); } else { jsonHours.push({ 'id': (j + (12 * (i - 1))), 'name': (j.toString() + ' ' + ampm) }); } } }
        loadComboBox(jsonHours, document.getElementById('cboHourFrom'), '12 AM');
        loadComboBox(jsonHours, document.getElementById('cboHourTo'), '12 AM');

        quickTrailChange(0);

    }
    catch (err) {
        alert('loadTrailHours: ' + err.description);
    }
}


//==================================================================
//----- Reset Power Cut
var resetDevId = '';
function resetPowerCutOK(data, textStatus, jqXHR) {
    try {
        $('#powerCutDiv' + resetDevId).hide();
        alert('Power Cut status has been reset.');
        resetDevID = '';
    }
    catch (err) {
        alert('resetPowerCutOK: ' + err.description);
    }
}

function resetPowerCutFailed(data) {
    try {
        alert('Power Cut status update has failed.  Please try again or contact Customer Support.');
    }
    catch (err) {
        alert('resetPowerCutFailed: ' + err.description);
    }
}

function resetPowerCut(deviceId) {
    try {
        resetDevId = deviceId;
        //Main Power Cut: Please check installation of this device as it has lost main power and is working on internal backup battery.
        if (confirm('The Power Cut Signal is ON, indicating that the device is/was disconnected from main power.  Please check the installation of this device.  Do you want to reset the Power Cut signal?')) {
            // Yes
            var data = { t: getTokenCookie('ETTK'), deviceId: deviceId };
            dbReadWriteAsync('resetPowerCut', data, resetPowerCutOK, resetPowerCutFailed);
        } else {
            // Do nothing!
        }
    }
    catch (err) {
        alert('resetPowerCut: ' + err.description);
    }
}

//==================================================================
//----- GPS Age Click
function gpsAgeClick(deviceId) {
    try {
        var msg = $('#gpsAgeImg' + deviceId).attr('title');
        alert(msg);
    }
    catch (err) {
        alert('gpsAgeClick: ' + err.description);
    }
}
//==================================================================
//----- Reset Bad Installation Msg
function resetBadIgnitionMsgOK(data, textStatus, jqXHR) {
    try {
        $('#badIgnitionDiv' + resetDevId).hide();
        alert('Bad Ignition Wire Installation status has been hidden.  It will show up again in 7 days if problem persists.');
        resetDevID = '';
    }
    catch (err) {
        alert('resetBadIgnitionMsgOK: ' + err.description);
    }
}

function resetBadIgnitionMsgFailed(data) {
    try {
        alert('Improper Installation status update has failed.  Please try again or contact Customer Support.');
    }
    catch (err) {
        alert('resetBadIgnitionMsgFailed: ' + err.description);
    }
}

function resetBadIgnitionMsg(deviceId) {
    try {
        resetDevId = deviceId;
        if (confirm('The Improper Ignition Wire Installation signal is ON, indicating that the Ignition wire of the device is not properly installed.  Please check the installation of this device.  We encourage you to contact our Technical Support Specialists.  Do you want to hide this message?')) {
            // Yes
            var data = { t: getTokenCookie('ETTK'), deviceId: deviceId };
            dbReadWriteAsync('resetBadInstallMsg', data, resetBadIgnitionMsgOK, resetBadIgnitionMsgFailed);
        } else {
            // Do nothing!
        }
    }
    catch (err) {
        alert('resetBadIgnitionMsg: ' + err.description);
    }
}

