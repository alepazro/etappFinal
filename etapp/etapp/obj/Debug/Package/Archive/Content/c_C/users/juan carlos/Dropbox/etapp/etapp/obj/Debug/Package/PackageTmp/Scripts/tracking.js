var isTrailHoursReady = false;

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
                addAllDevicesToMap();
                break;

            case 'dispatchingDiv':
                if (directionsRenderer) {
                    directionsRenderer.setMap(map);
                }
                getGeofences();

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
        ul.appendChild(li);

        //    <div class="deviceInfo" style="background-color:#51ec51;">
        var titleDiv = document.createElement('div');
        $(titleDiv).attr('id', 'titleDiv' + jsonDevice.deviceId);
        li.appendChild(titleDiv);
        $(titleDiv).addClass('deviceInfo');
        $(titleDiv).attr('style', 'background-color:' + eventColor(jsonDevice.eventCode));
        $(titleDiv).attr('data-lat', jsonDevice.latitude);
        $(titleDiv).attr('data-lng', jsonDevice.longitude);

        //Street View button
        titleDiv.appendChild(getStreetViewBtn(jsonDevice.deviceId, jsonDevice.latitude, jsonDevice.longitude, jsonDevice.heading));

        //        <input type="checkbox" id="unitId1234" onclick="showDevice('1234')" />
        var chk = document.createElement('input');
        $(chk).attr('type', 'checkbox');
        $(chk).attr('id', 'chk' + jsonDevice.deviceId);
        $(chk).attr("onclick", "showDevice('" + jsonDevice.deviceId + "')");
        $(chk).prop("checked", true);
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

        //    <div class="deviceActions">
        //var actionsDiv = document.createElement('div');
        //li.appendChild(actionsDiv);
        //$(actionsDiv).addClass('deviceActions');

        //        <a href="#" class="deviceAction" onclick="pingDevice('1234')">Ping</a>
        //var ping = document.createElement('a');
        //actionsDiv.appendChild(ping);
        //ping.setAttribute('href', '#');
        //$(ping).addClass('deviceAction');
        //ping.setAttribute('onclick', 'pingDevice("' + jsonDevice.deviceId + '")');
        //$(ping).text('Ping');

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
        getDevices();
        loadFleetList();

        //Make sure all checkmarks of fleetList are checked.  This may be redundant, but it seems in some IE versions it is not taking it when it is marked upon creation.
        $("#fleetList input:checkbox").each(function () {
            this.checked = true;
        });

        createFleetMarkers();
        autoCenter();
    }
    catch (err) {
        alert('loadDevices: ' + err.Description);
    }
}

//==============================================
// -- GET AND UPDATE LAST KNOWN LOCATION
function updateDeviceInFleetList(jsonDevice) {
    try {
        var li = document.getElementById('deviceId' + jsonDevice.deviceId);
        if (li) {
            $('#titleDiv' + jsonDevice.deviceId).attr('style', 'background-color:' + eventColor(jsonDevice.eventCode));
            $('#deviceName' + jsonDevice.deviceId).text(jsonDevice.name + ' (' + jsonDevice.eventName + ')');
            $('#deviceAddress' + jsonDevice.deviceId).text(jsonDevice.fullAddress);
            //var eventDate = dateFormat((new Date(parseInt(jsonDevice.eventDate.replace(/\/+Date\(([\d+-]+)\)\/+/, '$1')))), "m/d/yyyy h:MM TT");
            var eventDate = jsonDevice.eventDateString;
            $('#deviceExtraInfo' + jsonDevice.deviceId).text(jsonDevice.speed + ' mph heading ' + jsonDevice.heading + ' at ' + eventDate);
            updateStreetViewBtn(jsonDevice.deviceId, jsonDevice.latitude, jsonDevice.longitude, jsonDevice.heading);
        }
    }
    catch (err) {
        alert('updateFleetList: ' + err.description);
    }
}

function updateDeviceMarkerPosition(jsonDevice) {
    try {
        if (markersArray[jsonDevice.deviceId]) {
            var devLatLng = new google.maps.LatLng(jsonDevice.latitude, jsonDevice.longitude);
            markersArray[jsonDevice.deviceId].setPosition(devLatLng);
            markersArray[jsonDevice.deviceId].setIcon(jsonDevice.iconUrl);

            var content = jsonDevice.infoTable;
            (function (marker, content) {
                google.maps.event.addListener(marker, 'click', function () {
                    if (!infowindow) {
                        infowindow = new google.maps.InfoWindow();
                    }
                    infowindow.setContent(content);
                    infowindow.open(map, marker);
                });
            })(markersArray[jsonDevice.deviceId], content);

        }
    }
    catch (err) {
        alert('updateDeviceMarkerPosition: ' + err.description);
    }
}

function getLastKnowLocation() {
    try {
        getDevices();

        if (jsonDevices) {
            if (jsonDevices.myDevices) {
                for (var ind = 0; ind < jsonDevices.myDevices.length; ind++) {
                    jsonDevice = eval('(' + jsonDevices.myDevices[ind] + ')');
                    updateDeviceInFleetList(jsonDevice);
                    updateDeviceMarkerPosition(jsonDevice);
                }

                autoCenter();
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

function emailDrivingDirections(deviceId) {
    try {
        var results = directionsResultArray[deviceId];
        //var jsonObjTXT = JSON.stringify(results);

        var name = $('#dispatchName').val();
        var phone = $('#dispatchJobPhone').val();
        var street = $('#dispatchStreet').val();
        var city = $('#dispatchCity').val();
        var state = $('#dispatchState').val();
        var postalCode = $('#dispatchPostalCode').val();
        var description = $('#dispatchJobDescription').val();

        //data = 't=' + getTokenCookie('ETTK') + '&deviceId=' + escape(deviceId) + '&dd=' + escape(jsonObjTXT) + '&name=' + escape(name) + '&phone=' + escape(phone) + '&street=' + escape(street) + '&city=' + escape(city) + '&state=' + escape(state) + '&postalCode=' + escape(postalCode) + '&description=' + escape(description);
        data = 't=' + getTokenCookie('ETTK') + '&deviceId=' + escape(deviceId) + '&name=' + escape(name) + '&phone=' + escape(phone) + '&street=' + escape(street) + '&city=' + escape(city) + '&state=' + escape(state) + '&postalCode=' + escape(postalCode) + '&description=' + escape(description);
        var tmpJson = dbReadWrite('sendJobViaSMS', data, true, false);

        if (tmpJson) {
            if (tmpJson.result != 'failure') {
                alert('Job sent successfully');
            }
            else {
                alert('Job could not be sent.  Please try again.');
            }
        }
    }
    catch (err) {
        alert('emailDrivingDirections: ' + err.description);
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

//=========================================
//---- Find Closest Device

function addDeviceToDispatchList(jsonDevice, listName) {
    try {
        //var ul = document.getElementById('devicesByDistanceList');
        var ul = document.getElementById(listName);

        //<li>
        var li = document.createElement('li');
        $(li).attr('id', 'dispatchDeviceId' + jsonDevice.deviceId);
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
        $(emailAnchor).attr("onclick", "emailDrivingDirections('" + jsonDevice.deviceId + "')");
        $(emailAnchor).text('Send Text Message to Driver');

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

            for (ind = 0; ind < jsonDevices.myDevices.length; ind++) {
                jsonDevice = eval('(' + jsonDevices.myDevices[ind] + ')');
                deviceLoc = new google.maps.LatLng(jsonDevice.latitude, jsonDevice.longitude);
                d = distanceTo(destinationLoc, deviceLoc);
                devices.push({ "deviceId": jsonDevice.deviceId, "name": jsonDevice.name, "eventCode": jsonDevice.eventCode, "distanceTo": d, "latitude": jsonDevice.latitude, "longitude": jsonDevice.longitude, "infoTable": jsonDevice.infoTable });
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
        dbReadWriteAsync('getTrail', data, breadCrumbLoadSuccess, breadCrumbLoadFailure);
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
            switch (dev.eventCode) { case '01': x = 28; y = 28; break; case '02': x = 14; y = 28; break; case '03': switch (dev.heading) { case 'N': x = 0; y = 0; break; case 'NE': x = 14; y = 0; break; case 'E': x = 28; y = 0; break; case 'SE': x = 42; y = 0; break; case 'S': x = 0; y = 14; break; case 'SW': x = 14; y = 14; break; case 'W': x = 28; y = 14; break; case 'NW': x = 42; y = 14; break; } break; case '04': x = 42; y = 28; break; case '05': x = 0; y = 28; case '08': x = 28; y = 28; case '09': x = 42; y = 28; break; }
            var image = new google.maps.MarkerImage('images/TrailSprite.png', new google.maps.Size(14, 14), new google.maps.Point(x, y), new google.maps.Point(7, 7)
            );
            var marker = new google.maps.Marker({ position: devLatLng, map: map, title: dev.fullAddress, icon: image });

            var content = dev.infoTable;
            (function (marker, content) {
                google.maps.event.addListener(marker, 'click', function () {
                    if (!infowindow) {
                        infowindow = new google.maps.InfoWindow();
                    }
                    infowindow.setContent(content);
                    infowindow.open(map, marker);
                });
            })(marker, content);

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
            if (map.getZoom() > 18) {
                map.setZoom(18);
                getCurrentZoomLevel();
            }
        });

    }
    catch (err) {
        alert('mapBreadcrumbTrail: ' + err.description);
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
        $(devName).text(jsonItem.eventName + ' (' + jsonItem.speed + ' mph at ' + jsonItem.eventDateString + ')');

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
            infowindow.setContent(jsonItem.infoTable);
            infowindow.setPosition(devLatLng);
            infowindow.open(map);
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
