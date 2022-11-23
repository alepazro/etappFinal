//et_03
var w = $(window).width();
var h = $(window).height();
var tips = false;

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function activityIndicator() {
    try {
        // Setup the ajax indicator
        $('body').append('<div id="ajaxBusy"><p><img src="images/loading.gif"></p></div>');

        $('#ajaxBusy').css({
            display: "none",
            margin: "0px",
            paddingLeft: "0px",
            paddingRight: "0px",
            paddingTop: "0px",
            paddingBottom: "0px",
            position: "absolute",
            right: "3px",
            top: "3px",
            width: "auto"
        });
    }
    catch (err) {
        alert('activityIndicator: ' + err.description);
    }
}

function getGoogleAddressFromPoint(lat, lng) {
    try {

        var jsonAddress = false;
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(lat, lng);

        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    jsonAddress = getGoogleAddressComponents(results[0]);
                }
            }
        });

        return jsonAddress;

    }
    catch (err) {
        alert('getGoogleAddressFromPoint: ' + err.description);
    }
}

function getGoogleAddressComponents(result) {
    try {
        var postalCode = '';
        var country = '';
        var state = '';
        var county = '';
        var city = '';
        var street = '';
        var route = '';
        var streetNumber = '';
        var suite = '';
        var fullAddress = result.formatted_address;
        var jsonAddress = false;

        for (var j = 0; j < result.address_components.length; j++) {
            for (var k = 0; k < result.address_components[j].types.length; k++) {
                switch (result.address_components[j].types[k]) {
                    case 'postal_code':
                        postalCode =  result.address_components[j].short_name;
                        break;
                    case 'country':
                        country = result.address_components[j].short_name;
                        break;
                    case 'administrative_area_level_1':
                        state = result.address_components[j].short_name;
                        break;
                    case 'administrative_area_level_2':
                        county = result.address_components[j].short_name;
                        break;
                    case 'locality':
                        city = result.address_components[j].short_name;
                        break;
                    case 'street_address':
                        street = result.address_components[j].short_name;
                        break;
                    case 'route':
                        route = result.address_components[j].short_name;
                        break;
                    case 'street_number':
                        streetNumber = result.address_components[j].short_name;
                        break;
                    case 'subpremise':
                        suite =  result.address_components[j].short_name;
                        break;
                }
            }
        }

        if (street == '') {
            street = streetNumber + ' ' + route;
        }

        jsonAddress = { 'fullAddress': fullAddress, 'postalCode': postalCode, 'country': country, 'state': state, 'county': county, 'city': city, 'street': street, 'route': route, 'streetNumber': streetNumber, 'suite': suite };

        return jsonAddress;

    }
    catch (err) {
        alert('getGoogleAddressComponents: ' + err.description);
    }
}

function getCurrentHour() {
    try {
        var currentTime = new Date()
        var hour = currentTime.getHours();
        return hour;
    }
    catch (err) {
        alert('getCurrentHour: ' + err.description);
    }
}

//delta should come as a negative number
function getPreviousDates(delta) {
    try {
        var theDate = new Date()
        theDate.setDate(theDate.getDate() + delta)
        var month = theDate.getMonth() + 1
        var day = theDate.getDate()
        var year = theDate.getFullYear()
        return month + "/" + day + "/" + year;
    }
    catch (err) {
        alert('getPreviousDates: ' + err.description);
    }
}

function getNow() {
    try {
        var currentTime = new Date()
        var month = currentTime.getMonth() + 1
        var day = currentTime.getDate()
        var year = currentTime.getFullYear()
        return month + "/" + day + "/" + year;
    }
    catch (err) {
        alert('getNow: ' + err.description);
    }
}

function loadHoursCombo(obj) {
    try {
        var ampm = '';
        var i = 0;
        var j = 0;
        var jsonHours = [];
        for (i = 1; i <= 2; i++) { if (i == 1) { ampm = 'AM'; } else { ampm = 'PM'; } for (j = 1; j <= 12; j++) { if (i == 1 && j == 12) { jsonHours.push({ 'id': (j + (12 * (i - 1))), 'name': 'Noon' }); } else { jsonHours.push({ 'id': (j + (12 * (i - 1))), 'name': (j.toString() + ' ' + ampm) }); } } }
        loadComboBox(jsonHours,obj, 'Pick Hour');
    }
    catch (err) {
        alert('loadHoursCombo: ' + err.description);
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

function moveTo(e, objTargetId) {
    try {
        var evt = e || window.event;
        var keyPressed = evt.which || evt.keyCode;

        if (keyPressed == 13) {
            document.getElementById(objTargetId.id).focus();
        }
    }
    catch (err) {
        alert('moveTo: ' + err.Description);
    }
}

function checkLength(o, n, min, max) {
    if (o.val().length > max || o.val().length < min) {
        o.addClass("ui-state-error");
        updateTips("Length of " + n + " must be between " +
					min + " and " + max + ".");
        return false;
    } else {
        return true;
    }
}

function updateTips(t) {
    tips
				.text(t)
				.addClass("ui-state-highlight");
    setTimeout(function () {
        tips.removeClass("ui-state-highlight", 1500);
    }, 500);
}

function removeAllChildNodes(node) {
    if (node && node.hasChildNodes && node.removeChild) {
        while (node.hasChildNodes()) {
            node.removeChild(node.firstChild);
        }
    }
} // removeAllChildNodes()

function validateEmail(email) {
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
}

function setComboBoxOption(cbx, selectedValue) {
    try {
        for (var ind = 0; ind < cbx.length; ind++) {
            var tmpId = cbx[ind].getAttribute('data-id');
            if (selectedValue == tmpId) {
                cbx.selectedIndex = ind;
                break;
            }
        }
    }
    catch (err) {
        alert('setComboBoxOption: ' + err.description);
    }
}

function getComboBoxSelectedOption(cbx) {
    try {
        var selectedIndex = cbx.selectedIndex;
        var id = cbx[selectedIndex].getAttribute('data-id');

        return id;
    }
    catch (err) {
        alert('getComboBoxSelectedOption: ' + itmName);
    }
}

function getJsonRecord(jsonLst, id) {
    try {
        var tmpJson = null;

        for (var ind = 0; ind < jsonLst.length; ind++) {
            var jsonItm = eval('(' + jsonLst[ind] + ')');
            if (jsonItm.id == id) {
                tmpJson = jsonItm;
                break;
            }
        }

        return tmpJson;
    }
    catch (err) {
        alert('getJsonRecord: ' + err.description);
    }
}

function loadComboBox(jsonLst, cbx, defaultOptionName) {
    try {
        //alert(defaultOptionName);
        removeAllChildNodes(cbx);

        var opt0 = document.createElement('option');
        $(opt0).attr('data-id', 0);
        $(opt0).attr('value', 0);
        cbx.appendChild(opt0);
        var opt0TXT = document.createTextNode('[' + defaultOptionName + ']');
        
        opt0.appendChild(opt0TXT);

        for (var ind = 0; ind < jsonLst.length; ind++) {
            var jsonItm = '';
            try {
                jsonItm = eval('(' + jsonLst[ind] + ')');
            }
            catch (err) {
                jsonItm = jsonLst[ind];
            }
            var cbxOption = document.createElement('option');
            cbx.appendChild(cbxOption);
            $(cbxOption).attr('value', jsonItm.id);
            $(cbxOption).attr('data-id', jsonItm.id);
            var cbxOptionTxt = document.createTextNode(jsonItm.name);
            cbxOption.appendChild(cbxOptionTxt);
        }

        return cbx;
    }
    catch (err) {
        alert('loadComboBox: ' + err.description);
    }
}

function getDeviceFromJson(deviceId) {
    try {
        var jsonDevice = null;

        for (var ind = 0; ind < jsonDevices.myDevices.length; ind++) {
            jsonDevice = eval('(' + jsonDevices.myDevices[ind] + ')');

            if (deviceId == jsonDevice.deviceId) {
                break;
            }
        }

        return jsonDevice;
    }
    catch (err) {
        alert('getDeviceFromJson: ' + err.description);
    }
}

function eventColor(eventCode) {
    try {
        var clr = '#ffffff';

        switch (eventCode) {
            case '01':
                clr = '#7bccfb';
                break;
            case '02':
                clr = '#fc655a';
                break;
            case '03':
                clr = '#51ec51';
                break;
            case '04':
                clr = '#ffff00';
                break;
            case '05':
                clr = '#fc655a';
                break;
        }

        return clr;
    }
    catch (err) {
        alert('eventColor: ' + err.description);
    }
}

function setWelcomeTitle() {
    try {
        $('#welcomeTitleSpan').text(welcomeTitle);
    }
    catch (err) {
        alert('setWelcomeTitle: ' + err.description);
    }
}

//Points are given in Google LatLng format
function distanceTo(point1, point2) {
    try {
        //return haversineDistanceTo(point1, point2);
        //We'll use for now this faster routine
        return equirectangularDistanceTo(point1, point2);
    }
    catch (err) {
        alert('distanceTo: ' + err.description);
    }
}

//Haversine formula
function haversineDistanceTo(point1, point2) {
    try {
        var R = 6371;
        var lat1 = point1.x.toRad(), lon1 = point1.y.toRad();
        var lat2 = point2.x.toRad(), lon2 = point2.y.toRad();
        var dLat = lat2 - lat1;
        var dLon = lon2 - lon1;

        var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
        var y = (lat2 - lat1);
        var d = Math.sqrt(x * x + y * y) * R;

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1) * Math.cos(lat2) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        return d.toPrecisionFixed(4);
    }
    catch (err) {
        alert('haversineDistanceTo: ' + err.description);
    }
}

//Equirectangular formula, based on Pythagoras theorem.  Faster/less calculations/less accuracy too, but good enough in small places
function equirectangularDistanceTo(point1, point2) {
    try {
        var R = 6371;
        var lat1 = point1.lat().toRad(), lon1 = point1.lng().toRad();
        var lat2 = point2.lat().toRad(), lon2 = point2.lng().toRad();
        var dLat = lat2 - lat1;
        var dLon = lon2 - lon1;

        var x = dLon * Math.cos((lat1 + lat2) / 2);
        var y = dLat;
        //Distance converted to miles
        var d = Math.sqrt(x * x + y * y) * R * 0.621371192;

        return d.toFixed(2);
    }
    catch (err) {
        alert('equirectangularDistanceTo: ' + err.description);
    }
}

/** Converts numeric degrees to radians */
if (typeof (Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
}

//============================================================================

function buildAddress(street, city, state, postalCode) {
    try {
        var address = '';

        //Street
        if (street != null) {
            if (street.length > 0) {
                address = street;
            }
        }
        //City
        if (city != null) {
            if (city.length > 0) {
                if (address.length == 0) {
                    address = city;
                }
                else {
                    address = address + ', ' + city;
                }
            }
        }
        //State
        if (state != null) {
            if (state.length > 0) {
                if (address.length == 0) {
                    address = state;
                }
                else {
                    address = address + ', ' + state;
                }
            }
        }
        //Postal Code
        if (postalCode != null) {
            if (postalCode.length > 0) {
                if (address.length == 0) {
                    address = postalCode;
                }
                else {
                    address = address + ', ' + postalCode;
                }
            }
        }

        return address;
    }
    catch (err) {
        alert('buildAddress: ' + err.description);
    }
}

function buildDispatchAddress() {
    try {
        var street = $('#dispatchStreet').attr('value');
        var city = $('#dispatchCity').attr('value');
        var state = $('#dispatchState').attr('value');
        var postalCode = $('#dispatchPostalCode').attr('value');

        return buildAddress(street, city, state, postalCode);
    }
    catch (err) {
        alert('buildDispatchAddress: ' + err.description);
    }
}

function buildGeofenceFormAddress() {
    try {
        var street = $('#geoFormStreet').attr('value');
        var city = $('#geoFormCity').attr('value');
        var state = $('#geoFormState').attr('value');
        var postalCode = $('#geoFormPostalCode').attr('value');

        return buildAddress(street, city, state, postalCode);
    }
    catch (err) {
        alert('buildDispatchAddress: ' + err.description);
    }
}



