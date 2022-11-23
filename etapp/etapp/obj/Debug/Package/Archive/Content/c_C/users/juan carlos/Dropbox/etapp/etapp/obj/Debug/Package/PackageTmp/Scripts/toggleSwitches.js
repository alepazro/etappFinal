var trafficLayer = false;
var geoPolyArr = []
var geoCirclesArr = []
var geoMarkersArr = []
var geoInfoWinArr = []

function forceAutoZoomFeature() {
    try {
        if (bAutoZoomFreezed == true) {
            $('#freezeAutoZoom').removeAttr("checked");
            $('#a_freezeAutoZoom').removeClass("checked");
            toggleFreezeAutoZoom(false);
        }
    }
    catch (err) {
        alert('forceAutoZoomFeature: ' + err.description);
    }
}

function toggleFreezeAutoZoom(val) {
    try {
        if (val == undefined) {
            val = false;
        }
        bAutoZoomFreezed = val;
    }
    catch (err) {
        alert('toggleFreezeAutoZoom: ' + err.description);
    }
}

function toggleGoogleTraffic(val) {
    try {
        if (trafficLayer == false) {
            trafficLayer = new google.maps.TrafficLayer();
        }

        if (val == true) {
            trafficLayer.setMap(map);
        }
        else {
            trafficLayer.setMap(null);
        }
    }
    catch (err) {
        alert('toggleGoogleTraffic: ' + err.description);
    }
}

function toggleGeofencesLayer(val) {
    try {
        if (geoCirclesArr.length == 0 && geoPolyArr.length == 0 && geoMarkersArr.length == 0) {
            if (jsonGeofences == undefined) {
                var data = 't=' + getTokenCookie('ETTK');
                jsonGeofences = dbReadWrite('getGeofences', data, true, false);
            }

            var lat = 0;
            var lng = 0;
            var radius = 0;
            var polyTXT = '';
            if (jsonGeofences) {
                for (var ind = 0; ind < jsonGeofences.geofences.length; ind++) {
                    jsonGeo = eval('(' + jsonGeofences.geofences[ind] + ')');
                    if (jsonGeo.shapeId == 1) {
                        var loc = new google.maps.LatLng(jsonGeo.latitude, jsonGeo.longitude);
                        var marker = new google.maps.Marker({ map: map, position: loc });

                        var content =jsonGeo.geofenceInfoTable;
                        (function (marker, content) {
                            google.maps.event.addListener(marker, 'click', function () {
                                if (!infowindow) {
                                    infowindow = new google.maps.InfoWindow();
                                }
                                infowindow.setContent(content);
                                infowindow.setZIndex(999);
                                infowindow.open(map, marker);
                            });
                        })(marker, content);

                        geoMarkersArr.push(marker);

//                        var circle = drawCircle(loc, jsonGeo.radius);
//                        geoCirclesArr.push(circle);
                    }
                    else {
                        var jsonVertices = eval('(' + jsonGeo.jsonPolyVerticesTXT + ')');
                        var poly = drawPoly(jsonVertices);

                        var content = jsonGeo.geofenceInfoTable;
                        (function (poly, content) {
                            google.maps.event.addListener(poly, 'click', function () {
                                if (!infowindow) {
                                    infowindow = new google.maps.InfoWindow();
                                }
                                infowindow.setContent(content);
                                infowindow.setZIndex(999);
                                infowindow.open(map, poly.polyCenter);
                            });
                        })(poly, content);

                        geoPolyArr.push(poly);
                    }
                }
            }
        }
        if (val == true) {
//            $.each(geoCirclesArr, function () {
//                this.setMap(map);
//            });
            $.each(geoMarkersArr, function () {
                this.setMap(map);
            });
            $.each(geoPolyArr, function () {
                this.setMap(map);
                this.polyCenter.setMap(map);
            });
        }
        else {
//            $.each(geoCirclesArr, function () {
//                this.setMap(null);
//            });
            $.each(geoMarkersArr, function () {
                this.setMap(null);
            });
            $.each(geoPolyArr, function () {
                this.setMap(null);
                this.polyCenter.setMap(null);
            });
        }
    }
    catch (err) {
        alert('toggleGeofencesLayer: ' + err.description);
    }
}

function drawCircle(loc, radius) {
    try {
        var geoCircle = new google.maps.Circle({
            map: map,
            center: loc,
            radius: (parseFloat(radius) * 0.3048),    // in metres
            fillColor: '#AA0000'
        });

        return geoCircle;
    }
    catch (err) {
        alert('drawCircle: ' + err.description);
    }
}

function drawPoly(jsonVertices) {
    try {
        var poly = new google.maps.Polygon({ map: map, strokeColor: "#FF0000", strokeOpacity: 0.8, strokeWeight: 2, fillColor: "#FF0000", fillOpacity: 0.35 });
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < jsonVertices.length; i++) {
            var jsonItem = jsonVertices[i];
            var loc = new google.maps.LatLng(jsonItem.lat, jsonItem.lng);
            poly.getPath().push(loc);
            bounds.extend(loc);
        }

        var ctr = new google.maps.Marker({ map: map, position: bounds.getCenter(), icon: 'http://www.easitrack.com/icons/bullet-red16x16.png'});
        poly.polyCenter = ctr;

        return poly;
    }
    catch (err) {
        alert('drawPoly: ' + err.description);
    }
}

function toggleSwitches() {
    try {
        $('body').attr('class', 'js');
        $('.checkbox').after(function () {
            if ($(this).is(":checked")) {
                return "<a href='#' class='toggle checked' ref='" + $(this).attr("id") + "' id='a_" + $(this).attr("id") + "'></a>";
            } else {
                return "<a href='#' class='toggle' ref='" + $(this).attr("id") + "' id='a_" + $(this).attr("id") + "'></a>";
            }
        });
        $('.toggle').click(function (e) {
            var checkboxID = $(this).attr("ref");
            var checkbox = $('#' + checkboxID);

            var funcName = $(checkbox).attr('data-function');

            if (checkbox.is(":checked")) {
                checkbox.removeAttr("checked");
                window[funcName](false);

            } else {
                checkbox.attr("checked", "true");
                window[funcName](true);
            }
            $(this).toggleClass("checked");

            e.preventDefault();

        });
    }
    catch (err) {
        alert('toggleSwitches: ' + err.description);
    }
}
