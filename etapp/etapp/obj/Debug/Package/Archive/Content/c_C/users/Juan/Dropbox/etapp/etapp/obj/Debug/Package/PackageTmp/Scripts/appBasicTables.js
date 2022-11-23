var companiesList = false;

function loadCompaniesList() {
    try {
        var token = getCookie('ETCRMTK');
        $.ajax({
            url: 'etrest.svc/getCompanies/' + token,
            type: "GET",
            data: 0,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                companiesList = data;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Failed to fetch Companies');
            },
            async: false
        });
    }
    catch (err) {
        alert(err.description);
    }
}

function getCompaniesList() {
    try {
        if (companiesList == false) {
            loadCompaniesList();
        }
        return companiesList;
    }
    catch (err) {
        alert(err.description);
    }
}

var suspendedReasons = false;

function loadSuspendedReasonsList() {
    try {
        var token = getCookie('ETCRMTK');
        $.ajax({
            url: 'etrest.svc/getCompaniesSuspendedReasons/' + token,
            type: "GET",
            data: 0,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                suspendedReasons = data;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Failed to fetch CompaniesSuspendedReasons');
            },
            async: false
        });
    }
    catch (err) {
        alert(err.description);
    }
}

function getSuspendedReasonsList() {
    try {
        if (suspendedReasons == false) {
            loadSuspendedReasonsList();
        }
        return suspendedReasons;
    }
    catch (err) {
        alert(err.description);
    }
}
