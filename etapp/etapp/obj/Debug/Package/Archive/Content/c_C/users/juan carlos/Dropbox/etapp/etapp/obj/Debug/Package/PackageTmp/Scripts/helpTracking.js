function tooltipsSetUp() {
    try {
        $('#help_freezeZoom').tooltip();
        $('#help_showTraffic').tooltip();
        $('#help_geoLayer').tooltip();
    }
    catch (err) {
        alert('tooltipsSetUp: ' + err.description);
    }
}