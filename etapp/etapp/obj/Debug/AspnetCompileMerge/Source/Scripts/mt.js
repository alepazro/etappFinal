//Multi-Tracking
var map1 = false;
var map2 = false;
var map3 = false;
var map4 = false;
var markersMap1 = [];
var markersMap2 = [];
var markersMap3 = [];
var markersMap4 = [];
var list1 = [];
var list2 = [];
var list3 = [];
var list4 = [];
var globalSelectedGroupId = 0;

function updateMT() {
    try {
        getDevices();

        if (jsonDevices) {
            if (jsonDevices.myDevices) {

                var panelId = 0;
                var marker = false;
                var bounds1 = new google.maps.LatLngBounds();
                var bounds2 = new google.maps.LatLngBounds();
                var bounds3 = new google.maps.LatLngBounds();
                var bounds4 = new google.maps.LatLngBounds();

                for (var ind = 0; ind < jsonDevices.myDevices.length; ind++) {
                    jsonDevice = eval('(' + jsonDevices.myDevices[ind] + ')');
                    $('.mapDevicesList li[data-deviceId="' + jsonDevice.deviceId + '"]').each(function () {

                        $(this).attr('style', 'background-color:' + eventColor(jsonDevice.eventCode));

                        panelId = $(this).attr('data-panelId');

                        var devLatLng = new google.maps.LatLng(jsonDevice.latitude, jsonDevice.longitude);
                        var content = jsonDevice.infoTable;

                        switch (panelId) {
                            case "1":
                                marker = new google.maps.Marker({ position: devLatLng, map: map1, title: jsonDevice.name, icon: jsonDevice.iconUrl });
                                markersMap1[jsonDevice.deviceId] = marker;

                                (function (marker, content) {
                                    google.maps.event.addListener(marker, 'click', function () {
                                        if (!infowindow) {
                                            infowindow = new google.maps.InfoWindow();
                                        }
                                        infowindow.setContent(content);
                                        infowindow.open(map1, marker);
                                    });
                                })(marker, content);

                                bounds1.extend(devLatLng);
                                marker.setMap(map1);

                                break;
                            case "2":
                                marker = new google.maps.Marker({ position: devLatLng, map: map2, title: jsonDevice.name, icon: jsonDevice.iconUrl });
                                markersMap2[jsonDevice.deviceId] = marker;

                                (function (marker, content) {
                                    google.maps.event.addListener(marker, 'click', function () {
                                        if (!infowindow) {
                                            infowindow = new google.maps.InfoWindow();
                                        }
                                        infowindow.setContent(content);
                                        infowindow.open(map2, marker);
                                    });
                                })(marker, content);

                                bounds2.extend(devLatLng);
                                marker.setMap(map2);

                                break;
                            case "3":
                                marker = new google.maps.Marker({ position: devLatLng, map: map3, title: jsonDevice.name, icon: jsonDevice.iconUrl });
                                markersMap3[jsonDevice.deviceId] = marker;

                                (function (marker, content) {
                                    google.maps.event.addListener(marker, 'click', function () {
                                        if (!infowindow) {
                                            infowindow = new google.maps.InfoWindow();
                                        }
                                        infowindow.setContent(content);
                                        infowindow.open(map3, marker);
                                    });
                                })(marker, content);

                                bounds3.extend(devLatLng);
                                marker.setMap(map3);

                                break;
                            case "4":
                                marker = new google.maps.Marker({ position: devLatLng, map: map4, title: jsonDevice.name, icon: jsonDevice.iconUrl });
                                markersMap4[jsonDevice.deviceId] = marker;

                                (function (marker, content) {
                                    google.maps.event.addListener(marker, 'click', function () {
                                        if (!infowindow) {
                                            infowindow = new google.maps.InfoWindow();
                                        }
                                        infowindow.setContent(content);
                                        infowindow.open(map4, marker);
                                    });
                                })(marker, content);

                                bounds4.extend(devLatLng);
                                marker.setMap(map4);

                                break;
                        }

                    });
                }
                map1.fitBounds(bounds1);
                google.maps.event.addListenerOnce(map1, 'idle', function () {
                    if (map1.getZoom() > 16) {
                        map1.setZoom(16);
                    }
                });

                map2.fitBounds(bounds2);
                google.maps.event.addListenerOnce(map2, 'idle', function () {
                    if (map2.getZoom() > 16) {
                        map2.setZoom(16);
                    }
                });

                map3.fitBounds(bounds3);
                google.maps.event.addListenerOnce(map3, 'idle', function () {
                    if (map3.getZoom() > 16) {
                        map3.setZoom(16);
                    }
                });

                map4.fitBounds(bounds4);
                google.maps.event.addListenerOnce(map4, 'idle', function () {
                    if (map4.getZoom() > 16) {
                        map4.setZoom(16);
                    }
                });
            }
        }

    }
    catch (err) {
        alert('updateMT: ' + err.description);
    }
}

function openMTDeviceInfoWindow(panelId, deviceId) {
    try {
        var jsonDevice = getDeviceFromJson(deviceId);
        var devLatLng = new google.maps.LatLng(jsonDevice.latitude, jsonDevice.longitude);
        infowindow.setContent(jsonDevice.infoTable);
        infowindow.setPosition(devLatLng);

        switch (panelId) {
            case 1:
                infowindow.open(map1);
                break;
            case 2:
                infowindow.open(map2);
                break;
            case 3:
                infowindow.open(map3);
                break;
            case 4:
                infowindow.open(map4);
                break;
        }
    }
    catch (err) {
        alert('openMTDeviceInfoWindow: ' + err.descripion);
    }
}

function loadGroupDetInPanel(panelId, groupId, groupName, deviceId, deviceName) {
    try {
        var ul = document.getElementById('map' + panelId.toString() + 'UL');
        var li = document.createElement('li');
        ul.appendChild(li);
        $(li).attr('data-deviceId', deviceId).attr('data-panelId', panelId);

        var div = document.createElement('div');
        li.appendChild(div);
        $(div).addClass('groupItemName');
        $(div).attr("onclick", "openMTDeviceInfoWindow(" + panelId + "," + deviceId + ")");

        var span = document.createElement('span');
        div.appendChild(span);
        $(span).html(deviceName);

        eval("list" + panelId.toString() + ".push({ 'deviceId': deviceId, 'deviceName': deviceName })");
    }
    catch (err) {
        alert('loadGroupDetInPanel: ' + err.description);
    }
}

function getMTGroups() {
    try {
        var data = 't=' + getTokenCookie('ETTK');
        var jsonResult = dbReadWrite('getMTGroupsByPanel', data, true, false);
        if (jsonResult) {
            if (jsonResult.groups) {
                //Clear all groups
                for (var i = 1; i <= 4; i++) {
                    var ul = document.getElementById('map' + i.toString() + 'UL');
                    removeAllChildNodes(ul);
                }
                for (var ind = 0; ind < jsonResult.groups.length; ind++) {
                    var jsonGroup = eval('(' + jsonResult.groups[ind] + ')');
                    $('#group' + jsonGroup.panelId).html(jsonGroup.name).attr('data-groupId',jsonGroup.id).attr('data-groupName',jsonGroup.name);
                    loadGroupDetInPanel(jsonGroup.panelId, jsonGroup.id, jsonGroup.name, jsonGroup.deviceId, jsonGroup.deviceName);
                }
            }
        }
    }
    catch (err) {
        alert('getMTGroups' + err.description);
    }
}

function editGroup(groupId) {
    try {
        globalSelectedGroupId = groupId;
        $("#groupBuilderDlg").dialog('open')
    }
    catch (err) {
        alert('editGroup: ' + err.description);
    }
}

function isDeviceInList(deviceId) {
    try {
        var list = false;
        var isInList = false;
        switch (globalSelectedGroupId) {
            case 1:
                list = list1;
                break;
            case 2:
                list = list2;
                break;
            case 3:
                list = list3;
                break;
            case 4:
                list = list4;
                break;
        }
        if (list) {
            for (var ind = 0; ind < list.length; ind++) {
                if (list[ind].deviceId == deviceId) {
                    isInList = true;
                    break;
                }
            }
        }

        return isInList;
    }
    catch (err) {
        alert('findDeviceInArray' + err.description);
    }
}

function loadGroupList() {
    try {
        if (globalSelectedGroupId > 0) {
            var jsonDevice = false;

            if ($('#group' + globalSelectedGroupId.toString()).attr('data-groupId')) {
                $('#groupName').attr('data-groupId', $('#group' + globalSelectedGroupId.toString()).attr('data-groupId'));
            }
            else {
                $('#groupName').attr('data-groupId', '');
            }

            if ($('#group' + globalSelectedGroupId.toString()).attr('data-groupName')) {
                $('#groupName').val($('#group' + globalSelectedGroupId.toString()).attr('data-groupName'));
            }
            else {
                $('#groupName').val('Group ' + globalSelectedGroupId.toString());
            }

            var ul = document.getElementById('groupDevicesList');
            removeAllChildNodes(ul);
            for (var ind = 0; ind < jsonDevices.myDevices.length; ind++) {
                jsonDevice = eval('(' + jsonDevices.myDevices[ind] + ')');

                var li = document.createElement('li');
                ul.appendChild(li);

                var div = document.createElement('div');
                li.appendChild(div);

                var chk = document.createElement('input');
                $(chk).attr('id', 'chk' + jsonDevice.id);
                $(chk).attr('data-id', jsonDevice.id);
                $(chk).attr('data-name', jsonDevice.name);
                $(chk).attr('type', 'checkbox');
                div.appendChild(chk);

                //If the device is in the map, check it
                if (isDeviceInList(jsonDevice.id)){
                    $(chk).prop("checked", true);
                }

                var span = document.createElement('span');
                div.appendChild(span);
                $(span).attr('id', 'dev' + jsonDevice.id);
                $(span).html(jsonDevice.name);
                $(span).addClass('groupItem');
            }
        }
    }
    catch (err) {
        alert('loadGroupList: ' + err.description);
    }
}

function saveGroupList() {
    try {
        var isOk = true;
        var i = 0;
        var tmpList = [];
        var groupId = '';
        var groupName = '';

        $("#groupDevicesList input:checkbox").each(function () {
            if (this.checked) {
                i += 1;
                var deviceId = $(this).attr('data-id');
                var deviceName = $(this).attr('data-name');
                tmpList.push({ 'deviceId': deviceId, 'deviceName': deviceName });
            }
        });
        if (i > 0) {
            groupId = $('#groupName').attr('data-groupId');
            groupName = $('#groupName').val();
            if (groupName.length == 0) {
                groupName = 'Group ' + globalSelectedGroupId.toString();
            }
            var devices = JSON.stringify(tmpList);
            var data = 't=' + getTokenCookie('ETTK') + '&p=' + escape(globalSelectedGroupId.toString()) + '&id=' + escape(groupId) + '&name=' + escape(groupName) + '&devices=' + escape(devices);
            var jsonResult = dbReadWrite('saveGroup', data, true, false);

            if (jsonResult.result == 'true') {
                groupId = jsonResult.value;
                $('#group' + globalSelectedGroupId.toString()).attr('data-groupId', groupId).attr('data-groupName', groupName).html(groupName);

                eval("list" + globalSelectedGroupId.toString() + ".length=0");

                var ul = document.getElementById('map' + globalSelectedGroupId.toString() + 'UL');
                removeAllChildNodes(ul);
                for (var ind = 0; ind < tmpList.length; ind++) {
                    loadGroupDetInPanel(globalSelectedGroupId, groupId, groupName, tmpList[ind].deviceId, tmpList[ind].deviceName);
                }
            }
            else{
                isOk = false;
            }
        }

        return isOk;

    }
    catch (err) {
        isOk = false;
        alert('saveGroupList: ' + err.description);
    }
}

function setupGroupDlg() {
    try {
        $("#groupBuilderDlg").dialog({
            height: 310,
            width: 280,
            autoOpen: false,
            modal: true,
            buttons: {
                Save: function () {
                    if (saveGroupList() == true) {
                        $(this).dialog("close");
                    }
                    else {
                        alert('Failed saving group.  Please try again.');
                    }
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            },
            open: function () {
                //Actions to perform upon open
                loadGroupList();
            },
            close: function () {
                //Actions to perform upon close
            }
        });
    }
    catch (err) {
        alert('setupGroupDlg: ' + err.description);
    }
}

function setMapsHeights() {
    try {
        var h2 = ((h - 90) / 2) - 1;
        var h3 = h2 - 15;

        $(document.getElementById('box1')).attr('style', 'height:' + h2 + 'px;');
        $(document.getElementById('box2')).attr('style', 'height:' + h2 + 'px;');
        $(document.getElementById('box3')).attr('style', 'height:' + h2 + 'px;');
        $(document.getElementById('box4')).attr('style', 'height:' + h2 + 'px;');

        $(document.getElementById('map1')).attr('style', 'height:' + h3 + 'px;');
        $(document.getElementById('map1Side')).attr('style', 'height:' + h3 + 'px;');
        $(document.getElementById('map1Main')).attr('style', 'height:' + h3 + 'px;');

        $(document.getElementById('map2')).attr('style', 'height:' + h3 + 'px;');
        $(document.getElementById('map2Side')).attr('style', 'height:' + h3 + 'px;');
        $(document.getElementById('map2Main')).attr('style', 'height:' + h3 + 'px;');

        $(document.getElementById('map3')).attr('style', 'height:' + h3 + 'px;');
        $(document.getElementById('map3Side')).attr('style', 'height:' + h3 + 'px;');
        $(document.getElementById('map3Main')).attr('style', 'height:' + h3 + 'px;');

        $(document.getElementById('map4')).attr('style', 'height:' + h3 + 'px;');
        $(document.getElementById('map4Side')).attr('style', 'height:' + h3 + 'px;');
        $(document.getElementById('map4Main')).attr('style', 'height:' + h3 + 'px;');
    }
    catch (err) {
        alert('setMapsHeights: ' + err.description);
    }
}

function initializeMTMaps() {
    try {
        var bounds = false;
        var cntr = false;
        var sw = false;
        var ne = false;

        //Center in the entire USA
        sw = new google.maps.LatLng(25, -123.20);
        ne = new google.maps.LatLng(43, -75.20);

        // Create a bounding box
        bounds = new google.maps.LatLngBounds(sw, ne);
        cntr = bounds.getCenter();

        var myOptions = {
            zoom: 4,
            center: cntr,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        map1 = new google.maps.Map(document.getElementById("map1"), myOptions);
        map1.fitBounds(bounds);

        map2 = new google.maps.Map(document.getElementById("map2"), myOptions);
        map2.fitBounds(bounds);

        map3 = new google.maps.Map(document.getElementById("map3"), myOptions);
        map3.fitBounds(bounds);

        map4 = new google.maps.Map(document.getElementById("map4"), myOptions);
        map4.fitBounds(bounds);

        infowindow = new google.maps.InfoWindow();

    }
    catch (err) {
        alert('initializeMTMaps: ' + err.description);
    }
}

function initializeMT() {
    try {
        initializeMTMaps();
        getMTGroups();
        updateMT();
    }
    catch (err) {
        alert('initializeMT: ' + err.description);
    }
}

function updateMTDeviceInLists(panelId, jsonDevice) {
    try {
        $('.mapDevicesList li[data-deviceId="' + jsonDevice.deviceId + '"]').each(function () {
            $(this).attr('style', 'background-color:' + eventColor(jsonDevice.eventCode));
        });
    }
    catch (err) {
        alert('updateMTDeviceInLists: ' + err.description);
    }
}

function updateMTDeviceMarkerPosition(panelId, jsonDevice) {
    try {
        var content = jsonDevice.infoTable;

        switch (panelId) {
            case "1":
                if (markersMap1[jsonDevice.deviceId]) {
                    var devLatLng = new google.maps.LatLng(jsonDevice.latitude, jsonDevice.longitude);
                    markersMap1[jsonDevice.deviceId].setPosition(devLatLng);
                    markersMap1[jsonDevice.deviceId].setIcon(jsonDevice.iconUrl);

                    (function (marker, content) {
                        google.maps.event.addListener(marker, 'click', function () {
                            if (!infowindow) {
                                infowindow = new google.maps.InfoWindow();
                            }
                            infowindow.setContent(content);
                            infowindow.open(map1, marker);
                        });
                    })(markersMap1[jsonDevice.deviceId], content);
                }
                break;
            case "2":
                if (markersMap2[jsonDevice.deviceId]) {
                    var devLatLng = new google.maps.LatLng(jsonDevice.latitude, jsonDevice.longitude);
                    markersMap2[jsonDevice.deviceId].setPosition(devLatLng);
                    markersMap2[jsonDevice.deviceId].setIcon(jsonDevice.iconUrl);

                    (function (marker, content) {
                        google.maps.event.addListener(marker, 'click', function () {
                            if (!infowindow) {
                                infowindow = new google.maps.InfoWindow();
                            }
                            infowindow.setContent(content);
                            infowindow.open(map1, marker);
                        });
                    })(markersMap2[jsonDevice.deviceId], content);
                }
                break;
            case "3":
                if (markersMap3[jsonDevice.deviceId]) {
                    var devLatLng = new google.maps.LatLng(jsonDevice.latitude, jsonDevice.longitude);
                    markersMap3[jsonDevice.deviceId].setPosition(devLatLng);
                    markersMap3[jsonDevice.deviceId].setIcon(jsonDevice.iconUrl);

                    (function (marker, content) {
                        google.maps.event.addListener(marker, 'click', function () {
                            if (!infowindow) {
                                infowindow = new google.maps.InfoWindow();
                            }
                            infowindow.setContent(content);
                            infowindow.open(map1, marker);
                        });
                    })(markersMap3[jsonDevice.deviceId], content);
                }
                break;
            case "4":
                if (markersMap4[jsonDevice.deviceId]) {
                    var devLatLng = new google.maps.LatLng(jsonDevice.latitude, jsonDevice.longitude);
                    markersMap4[jsonDevice.deviceId].setPosition(devLatLng);
                    markersMap4[jsonDevice.deviceId].setIcon(jsonDevice.iconUrl);

                    (function (marker, content) {
                        google.maps.event.addListener(marker, 'click', function () {
                            if (!infowindow) {
                                infowindow = new google.maps.InfoWindow();
                            }
                            infowindow.setContent(content);
                            infowindow.open(map1, marker);
                        });
                    })(markersMap4[jsonDevice.deviceId], content);
                }
                break;
        }
    }
    catch (err) {
        alert('updateMTDeviceMarkerPosition: ' + err.description);
    }
}

function getMTLastKnowLocation() {
    try {
        getDevices();

        if (jsonDevices) {
            if (jsonDevices.myDevices) {
                var panelId = 0;
                for (var ind = 0; ind < jsonDevices.myDevices.length; ind++) {
                    jsonDevice = eval('(' + jsonDevices.myDevices[ind] + ')');

                    $('.mapDevicesList li[data-deviceId="' + jsonDevice.deviceId + '"]').each(function () {
                        panelId = $(this).attr('data-panelId');
                        updateMTDeviceInLists(panelId, jsonDevice);
                        updateMTDeviceMarkerPosition(panelId, jsonDevice);
                    });
                }

                MTAutoCenter();
            }
        }
    }
    catch (err) {
        alert('getMTLastKnowLocation: ' + err.description);
    }
}

function MTAutoCenter() {
    try {
        var bounds1 = new google.maps.LatLngBounds();
        for (i in markersMap1) {
            if (markersMap1[i].map != null) {
                bounds1.extend(markersMap1[i].position);
            }
        }
        map1.fitBounds(bounds1);
        google.maps.event.addListenerOnce(map1, 'idle', function () {
            if (map1.getZoom() > 16) {
                map1.setZoom(16);
            }
        });
        
        var bounds2 = new google.maps.LatLngBounds();
        for (i in markersMap2) {
            if (markersMap2[i].map != null) {
                bounds2.extend(markersMap2[i].position);
            }
        }
        map2.fitBounds(bounds2);
        google.maps.event.addListenerOnce(map2, 'idle', function () {
            if (map2.getZoom() > 16) {
                map2.setZoom(16);
            }
        });

        var bounds3 = new google.maps.LatLngBounds();
        for (i in markersMap3) {
            if (markersMap3[i].map != null) {
                bounds3.extend(markersMap3[i].position);
            }
        }
        map3.fitBounds(bounds3);
        google.maps.event.addListenerOnce(map3, 'idle', function () {
            if (map3.getZoom() > 16) {
                map3.setZoom(16);
            }
        });

        var bounds4 = new google.maps.LatLngBounds();
        for (i in markersMap4) {
            if (markersMap4[i].map != null) {
                bounds4.extend(markersMap4[i].position);
            }
        }
        map4.fitBounds(bounds4);
        google.maps.event.addListenerOnce(map4, 'idle', function () {
            if (map4.getZoom() > 16) {
                map4.setZoom(16);
            }
        });

    }
    catch (err) {
        alert('autoCenter: ' + err.Description);
    }
}

