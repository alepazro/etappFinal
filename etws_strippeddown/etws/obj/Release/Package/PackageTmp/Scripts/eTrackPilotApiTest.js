var user = false;
var devices = false;
var jobs = false;
var driverStatusList = false;
var customers = false;
var countryStates = false;
var inspectionLists = false;
var listItems = false;

function authorization() {
    try {
        var l = $('#inputLogin').val();
        var p = $('#inputPassword').val();
        var lat = 0;
        var lng = 0;
        var data = 'login=' + escape(l) + '&password=' + escape(p) + '&expDays=' + escape('14') + '&lat=' + escape(lat) + '&lng=' + escape(lng) + '&r=' + Math.random();
        $.ajax({
            type: "GET",
            url: "pilot.svc/authorization?",
            contentType: "application/json; charset=utf-8",
            data: data,
            dataType: "json",
            processdata: false,
            async: false,
            success: function (data, textStatus, jqXHR) {
                if (data.isOk === true) {
                    user = data;
                    $('#pToken').html(data.token);
                    buildHtmlTable('userData', data);
                }
                else {
                    alert(data.msg);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            }
        });
    }
    catch (err) {
        alert(err.description);
    }
}

function authorization2() {
    try {
        var l = $('#inputLogin').val();
        var p = $('#inputPassword').val();
        var lat = 0;
        var lng = 0;
        var data = 'login=' + escape(l) + '&password=' + escape(p) + '&lat=' + escape(lat) + '&lng=' + escape(lng);
        $.ajax({
            type: "GET",
            url: "pilot.svc/authorization2?",
            contentType: "application/json; charset=utf-8",
            data: data,
            dataType: "json",
            processdata: false,
            async: false,
            success: function (data, textStatus, jqXHR) {
                if (data.isOk === true) {
                    user = data;
                    $('#pToken').html(data.token);
                    buildHtmlTable('userData', data);
                }
                else {
                    alert(data.msg);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            }
        });
    }
    catch (err) {
        alert(err.description);
    }
}

function recoverCredentials() {
    try {
        var email = $('#inputEmail').val();
        var postData = {email: escape(email)};
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/recoverCredentials',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                buildHtmlTable('recoverCredentialsData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });

    }
    catch (err) {
        alert(err.description);
    }
}

function loadToken(target) {
    try {
        if (user.token) {
            $('#' + target).val(user.token);
        }
        else {
            alert('Please log in first');
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function loadDevices(target) {
    try {
        var isOk = false;
        if (devices) {
            if (devices.length > 0) {
                var select = $('#' + target).empty();
                for (var i = 0; i < devices.length; i++) {
                    select.append('<option value="' + devices[i].id + '">' + devices[i].name + '</option>');
                    isOk = true;
                }
            }
        }
        if (isOk === false) {
            alert('Please load first the devices in the Devices and Check In TAB of this site.');
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function getCountryStates() {
    try {
        if (user === false) {
            authorization();
        }
        var token = user.token;
        if (token.length === 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getCountryStates?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        countryStates = data;
                        buildHtmlTable('countryStatesData', data);
                    }
                    else {
                        alert('Error getting Country States List');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Country States List.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function loadCountryStates(target) {
    try {
        var isOk = false;
        if (countryStates === false) {
            getCountryStates();
        }
        if (countryStates) {
            if (countryStates.length > 0) {
                var select = $('#' + target).empty();
                for (var i = 0; i < countryStates.length; i++) {
                    select.append('<option value="' + countryStates[i].id + '">' + countryStates[i].name + '</option>');
                    isOk = true;
                }
            }
        }
        if (isOk === false) {
            alert('Please click again.');
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function generateRandomNumber(target) {
    try {
        var num = Math.floor(Math.random() * 100000000)
        $('#' + target).val(num);
    }
    catch (err) {
        alert(err.description);
    }
}

function generateRandomString(target, size) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < size; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    $('#' + target).val(text);

}

function getCustomers(target) {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length === 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getCustomers?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    customers = data;
                    var select = $('#' + target).empty();
                    for (var i = 0; i < customers.length; i++) {
                        select.append('<option value="' + customers[i].id + '">' + customers[i].name + '</option>');
                        isOk = true;
                    }
                    loadCustomerData();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching customers.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function loadCustomers(target) {
    try {
        if (customers === false) {
            getCustomers(target);
        }
        else {
            var isOk = false;
            if (customers) {
                if (customers.length > 0) {
                    var select = $('#' + target).empty();
                    for (var i = 0; i < customers.length; i++) {
                        select.append('<option value="' + customers[i].id + '">' + customers[i].name + '</option>');
                        isOk = true;
                    }
                    loadCustomerData();
                }
            }
            if (isOk === false) {
                alert('No customers found');
            }
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function loadInspectionsLists(target) {
    try {
        var isOk = false;
        if (inspectionLists === false) {
            getInspectionLists();
        }
        if (inspectionLists) {
            if (inspectionLists.length > 0) {
                var select = $('#' + target).empty();
                for (var i = 0; i < inspectionLists.length; i++) {
                    select.append('<option value="' + inspectionLists[i].id + '">' + inspectionLists[i].name + '</option>');
                    isOk = true;
                }
                loadInspectionItems();
            }
        }
        if (isOk === false) {
            alert('Please load the Inspections list first.');
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function loadCustomerData() {
    try{
        if (customers) {
            var id = $('#cbxAddJobCustomers').val();
            var cust = _.findWhere(customers, { id: id })
            $('#inputAddJobCustomerAddress').val(cust.fullAddress);
            $('#inputAddJobCustomerPhone').val(cust.phone);
            $('#inputAddJobCustomerContactName').val(cust.contactName);
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function getDevices() {
    try {
        if (user === false) {
            authorization();
        }
        var token = user.token;
        if (token.length === 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getDevices?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        devices = data;
                        buildHtmlTable('devicesData', data);
                    }
                    else {
                        alert('Error getting devices');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching devices.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function updateCheckInStatus(inOut) {
    try {
        var token = user.token;
        var deviceId = $('#cbxCheckInDevices').val();
        var odometer = $('#inputCheckInOdometer').val();
        var lat = 0;
        var lng = 0;
        var postData = {token: token, deviceId:deviceId, odometer:odometer, isCheckedIn: inOut, lat:lat, lng:lng};
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/updateCheckInStatus',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                buildHtmlTable('checkInData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });
    }
    catch (err) {
        alert(err.description);
    }
}

function getJobs() {
    try {
        if (user === false) {
            authorization();
        }
        var token = user.token;
        var lat = 0;
        var lng = 0;
        if (token.length === 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token) + '&lat=' + escape(lat) + '&lng=' + escape(lng);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getJobs?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        jobs = data;
                        buildHtmlTable('jobsData', data);
                    }
                    else {
                        alert('There are no jobs');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Jobs.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function getJob() {
    try {
        if (user === false) {
            authorization();
        }
        var token = user.token;
        var jobId = $('#inputGetJobID').val();
        var lat = 0;
        var lng = 0;
        if (jobId.length == 0) {
            alert('Please enter a Job ID');
            return;
        }
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token) + '&jobId=' + escape(jobId) + '&lat=' + escape(lat) + '&lng=' + escape(lng);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getJob?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    buildHtmlTable('oneJobData', data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Job.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function addJob() {
    try {
        var isNewCustomer = $('#rbtAddJobNewCustomer').is(':checked');

        var jobNumber = $('#inputAddJobNumber').val();

        var custId = '';
        var custName = '';
        if (isNewCustomer == false) {
            custId = $('#cbxAddJobCustomers').val();
            custName = '';
        }
        else {
            custName = $('#inputAddJobCustomer').val();
        }
        var custAddress = $('#inputAddJobCustomerAddress').val();
        var custPhone = $('#inputAddJobCustomerPhone').val();
        var custContact = $('#inputAddJobCustomerContactName').val();
        var dueDate = $('#inputAddJobDueDate').val();
        var statusId = $('#cbxAddJobStatusList').val();
        var jobDetails = $('#inputAddJobDescription').val();
        var notes = $('#inputAddJobNotes').val();

        var postData = {
            token: user.token,
            jobNumber: escape(jobNumber),
            custId: escape(custId),
            custName: escape(custName),
            custAddress: escape(custAddress),
            custPhone: escape(custPhone),
            custContact: escape(custContact),
            dueDate: escape(dueDate),
            statusId: escape(statusId),
            jobDetails: escape(jobDetails),
            notes: escape(notes),
            lat: 0,
            lng: 0
        };
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/addJob',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                buildHtmlTable('addJobData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });

    }
    catch (err) {
        alert(err.description);
    }
}

function updateJobStatus() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        var jobId = $('#inputChangeStatusJobID').val();
        var statusId = $('#cbxChangeStatusJobStatusList').val();
        var lat = 0;
        var lng = 0;
        var postData = { token: token, jobId: jobId, statusId: statusId, lat: lat, lng: lng };
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/updateJobStatus',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                buildHtmlTable('updateJobStatusData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });
    }
    catch (err) {
        alert(err.description);
    }
}

function addJobNote() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        var jobId = $('#inputAddNoteJobID').val();
        var note = $('#inputAddNoteJobNotes').val();
        var lat = 0;
        var lng = 0;
        var postData = { token: token, jobId: jobId, note: escape(note), lat: lat, lng: lng };
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/addJobNote',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                buildHtmlTable('addJobNoteData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });
    }
    catch (err) {
        alert(err.description);
    }
}

function removeJob() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        var jobId = $('#inputRemoveJobID').val();
        var lat = 0;
        var lng = 0;
        var postData = { token: token, jobId: jobId, lat: lat, lng: lng };
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/removeJob',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                buildHtmlTable('removeJobData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });
    }
    catch (err) {
        alert(err.description);
    }
}

function getMyGroup() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        var lat = 0;
        var lng = 0;

        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token) + '&lat=' + escape(lat) + '&lng=' + escape(lng);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getMyGroup?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        devices = data;
                        buildHtmlTable('myGroupData', data);
                    }
                    else {
                        alert('Error getting my group');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching my group.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function saveFuelPurchase() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        var address = $('#inputFuelAddress').val();
        var stateId = $('#cbxFuelCountryState').val();
        var postalCode = $('#inputFuelPostalCode').val();
        var deviceId = $('#cbxFuelDevices').val();
        var odometer = $('#inputFuelOdometer').val();
        var qty = $('#inputFuelQty').val();
        var amount = $('#inputFuelAmount').val();
        var eventDate = getToday();
        var lat = 0;
        var lng = 0;
        var postData = {token:token, deviceId:escape(deviceId), odometer:escape(odometer), qty:escape(qty), amount:escape(amount), address:escape(address), stateId: escape(stateId), postalCode: escape(postalCode), eventDate: eventDate, lat:escape(lat), lng:escape(lng)};
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/saveFuelPurchase',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                buildHtmlTable('fuelPurchaseData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });
    }
    catch (err) {
        alert(err.description);
    }
}

function getInspectionLists() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getInspectionLists?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        inspectionLists = data;
                        buildHtmlTable('inspListsData', data);
                    }
                    else {
                        alert('Error getting Inspections Lists');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Inspections Lists');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function getInspectionListItems() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        var listId = $('#inputListItemsListId').val();
        if (listId.length == 0) {
            alert('Please enter a list Id');
            return;
        }
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token) + '&listId=' + escape(listId);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getInspectionListItems?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        listItems = data;
                        buildHtmlTable('listItemsData', data);
                    }
                    else {
                        alert('Error getting Inspection Items');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Inspection Items');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function loadInspectionItems() {
    try {
        var listId = $('#cbxDoInspLists').val();
        $('#inputListItemsListId').val(listId);
        getInspectionListItems();
    }
    catch (err) {
        alert(err.description);
    }
}

function loadInspItems() {
    try {
        if (listItems == false) {
            alert('Please load the Inspections Lists and then load the items of one inspection list.  After that, you can load the items here');
            return;
        }
        var itemsTemplate = _.template($("#InspectionItems-template").html(), listItems);
        $('#tblInspItems').html(itemsTemplate);
    }
    catch (err) {
        alert(err.description);
    }
}

function saveInspectionItem(itemId) {
    try {
        if (user == false) {
            authorization();
        }
        // dateEventDate, data.listId, data.itemId, data.passed, data.failed, data.repaired, data.notes, lat, lng, r.transId, r.msg)
        var token = user.token;
        var deviceId = $('#cbxDoInspDevices').val();
        var odometer = $('#inputDoInspOdometer').val();
        var listId = $('#cbxDoInspLists').val();
        var passed = $('#' + itemId + ' .inspectionItemPass').is(':checked')
        var failed = $('#' + itemId + ' .inspectionItemFail').is(':checked')
        var repaired = $('#' + itemId + ' .inspectionItemFix').is(':checked')
        var notes = $('#' + itemId).find('.inspectionItemNote').val();
        var postData = { token: token, deviceId: escape(deviceId), odometer: escape(odometer), listId: listId, itemId: itemId, passed: passed, failed: failed, repaired: repaired, notes: notes, lat: 0, lng: 0 }
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/saveInspection',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                buildHtmlTable('savedInspectionItemData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });

    }
    catch (err) {
        alert(err.description);
    }
}

function getTransaction() {
    try {
        var transId = $('#inputTransactionId').val();
        if (transId.length == 0) {
            alert('Please enter a transaction id');
            return;
        }
        var data = 'transId=' + transId + '&noCache=' + Math.random();
        $.ajax({
            type: "GET",
            url: "pilot.svc/getTransactionData?",
            contentType: "application/json; charset=utf-8",
            data: data,
            dataType: "json",
            processdata: false,
            success: function (data, textStatus, jqXHR) {
                if (data.length > 0) {
                    var obj = JSON.parse(data);
                    buildHtmlTable('transactionData', obj);
                }
                else {
                    alert('Error getting transaction data');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Error fetching transaction data');
            }
        });
    }
    catch (err) {
        alert(err.description);
    }
}

function getDriverStatusList() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getDriverStatusList?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        driverStatusList = data;
                        buildHtmlTable('driverStatusListData', data);
                    }
                    else {
                        alert('Error getting Driver Status List');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Driver Status List.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function loadDriverStatusList(target) {
    try {
        var isOk = false;
        if (driverStatusList) {
            if (driverStatusList.length > 0) {
                var select = $('#' + target).empty();
                for (var i = 0; i < driverStatusList.length; i++) {
                    select.append('<option value="' + driverStatusList[i].id + '">' + driverStatusList[i].name + '</option>');
                    isOk = true;
                }
            }
        }
        if (isOk == false) {
            alert('Please load first the Driver Status List.');
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function saveDriverLog() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        var deviceId = $('#cbxDriverLogDevices').val();
        var driverStatusId = $('#cbxDriverStatusList').val();
        var startDate = $('#inputDriverLogStartDate').val();
        var endDate = $('#inputDriverLogEndDate').val();
        var durationMins = $('#inputDriverLogDuration').val();
        var address = $('#inputDriverLogAddress').val();
        var stateId = $('#cbxDriverLogCountryState').val();
        var postalCode = $('#inputDriverLogPostalCode').val();
        var odometer = $('#inputDriverLogOdometer').val();
        var lat = 0;
        var lng = 0;
        var postData = { token: token, deviceId: deviceId, driverStatus: driverStatusId, startDate: escape(startDate), endDate: escape(endDate), durationMins: durationMins, address: address, stateId: stateId, postalCode: postalCode, odometer: odometer, lat: lat, lng: lng };
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/updateDriverLog',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                buildHtmlTable('driverLogData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });

    }
    catch (err) {
        alert(err.description);
    }
}

var adsList = false;
function getFSAds() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getAdsList?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        adsList = data;
                        buildHtmlTable('FSAdsData', data);
                    }
                    else {
                        alert('Error getting Ads List');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Ads List.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function loadAds(target) {
    try {
        var isOk = false;
        if (adsList == false) {
            getFSAds();
        }
        if (adsList) {
            if (adsList.length > 0) {
                var select = $('#' + target).empty();
                for (var i = 0; i < adsList.length; i++) {
                    select.append('<option value="' + adsList[i].id + '">' + adsList[i].name + '</option>');
                    isOk = true;
                }
            }
        }
        if (isOk == false) {
            alert('Please load first the Ads List.');
        }
    }
    catch (err) {
        alert(err.description);
    }
}

var salesTaxesList = false;
function getFSSalesTaxes() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getSalesTaxesList?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        salesTaxesList = data;
                        buildHtmlTable('FSSalesTaxesData', data);
                    }
                    else {
                        alert('Error getting Sales Taxes List');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Sales Taxes List.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function loadSalesTax(target) {
    try {
        var isOk = false;
        if (salesTaxesList == false) {
            getFSSalesTaxes();
        }
        if (salesTaxesList) {
            if (salesTaxesList.length > 0) {
                var select = $('#' + target).empty();
                for (var i = 0; i < salesTaxesList.length; i++) {
                    select.append('<option value="' + salesTaxesList[i].id + '">' + salesTaxesList[i].name + '</option>');
                    isOk = true;
                }
            }
        }
        if (isOk == false) {
            alert('Please load first the Sales Tax List.');
        }
    }
    catch (err) {
        alert(err.description);
    }
}

var customerTypesList = false;
function getFSCustomerTypes() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getCustomerTypesList?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        customerTypesList = data;
                        buildHtmlTable('FSCustomerTypesData', data);
                    }
                    else {
                        alert('Error getting Customer Types List');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching CustomerTypes List.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function loadCustomerTypes(target) {
    try {
        var isOk = false;
        if (customerTypesList == false) {
            getFSCustomerTypes();
        }
        if (customerTypesList) {
            if (customerTypesList.length > 0) {
                var select = $('#' + target).empty();
                for (var i = 0; i < customerTypesList.length; i++) {
                    select.append('<option value="' + customerTypesList[i].id + '">' + customerTypesList[i].name + '</option>');
                    isOk = true;
                }
            }
        }
        if (isOk == false) {
            alert('Please load first the customerTypesList List.');
        }
    }
    catch (err) {
        alert(err.description);
    }
}

var paymentTermsList = false;
function getFSPaymentTerms() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getPaymentTermsList?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        paymentTermsList = data;
                        buildHtmlTable('FSPaymentTermsData', data);
                    }
                    else {
                        alert('Error getting Payment Terms List');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Payment Terms List.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function loadPaymentTerms(target) {
    try {
        var isOk = false;
        if (paymentTermsList == false) {
            getFSPaymentTerms();
        }
        if (paymentTermsList) {
            if (paymentTermsList.length > 0) {
                var select = $('#' + target).empty();
                for (var i = 0; i < paymentTermsList.length; i++) {
                    select.append('<option value="' + paymentTermsList[i].id + '">' + paymentTermsList[i].name + '</option>');
                    isOk = true;
                }
            }
        }
        if (isOk == false) {
            alert('Please load first the paymentTermsList List.');
        }
    }
    catch (err) {
        alert(err.description);
    }
}

var jobCategories = false;
function getFSJobCategories() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getJobCategoriesList?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        jobCategories = data;
                        buildHtmlTable('FSJobCategoriesData', data);
                    }
                    else {
                        alert('Error getting Job Categories List');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Job Categories List.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function loadJobCategories(target) {
    try {
        var isOk = false;
        if (jobCategories == false) {
            getFSJobCategories();
        }
        if (jobCategories) {
            if (jobCategories.length > 0) {
                var select = $('#' + target).empty();
                for (var i = 0; i < jobCategories.length; i++) {
                    select.append('<option value="' + jobCategories[i].id + '">' + jobCategories[i].name + '</option>');
                    isOk = true;
                }
            }
        }
        if (isOk == false) {
            alert('Please load first the jobCategories List.');
        }
    }
    catch (err) {
        alert(err.description);
    }
}

var jobPriorities = false;
function getFSJobPriorities() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getJobPrioritiesList?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        jobPriorities = data;
                        buildHtmlTable('FSJobPrioritiesData', data);
                    }
                    else {
                        alert('Error getting Job Priorities List');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Job Priorities List.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function loadJobPriorities(target) {
    try {
        var isOk = false;
        if (jobPriorities == false) {
            getFSJobPriorities();
        }
        if (jobPriorities) {
            if (jobPriorities.length > 0) {
                var select = $('#' + target).empty();
                for (var i = 0; i < jobPriorities.length; i++) {
                    select.append('<option value="' + jobPriorities[i].id + '">' + jobPriorities[i].name + '</option>');
                    isOk = true;
                }
            }
        }
        if (isOk == false) {
            alert('Please load first the jobPriorities List.');
        }
    }
    catch (err) {
        alert(err.description);
    }
}

var assetTypes = false;
function getFSAssetTypes() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getAssetTypesList?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        assetTypes = data;
                        buildHtmlTable('FSAssetTypesData', data);
                    }
                    else {
                        alert('Error getting Asset Types List');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Asset Types List.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function loadAssetTypes(target) {
    try {
        var isOk = false;
        if (assetTypes == false) {
            getFSAssetTypes();
        }
        if (assetTypes) {
            if (assetTypes.length > 0) {
                var select = $('#' + target).empty();
                for (var i = 0; i < assetTypes.length; i++) {
                    select.append('<option value="' + assetTypes[i].id + '">' + assetTypes[i].name + '</option>');
                    isOk = true;
                }
            }
        }
        if (isOk == false) {
            alert('Please load first the assetTypes List.');
        }
    }
    catch (err) {
        alert(err.description);
    }
}

var fsCustomers = false;
function getFSCustomers() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getCustomers?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        fsCustomers = data;
                        buildHtmlTable('FSCustomersData', data);
                    }
                    else {
                        alert('Error getting Customers');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Customers.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

var fsCustLocations = false;
function getFSCustLocations() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getCustLocations?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        fsCustLocations = data;
                        buildHtmlTable('FSCustLocationsData', data);
                    }
                    else {
                        alert('Error getting Locations');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Locations.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

var fsCustContacts = false;
function getFSCustContacts() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getCustContacts?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        fsCustContacts = data;
                        buildHtmlTable('FSCustContactsData', data);
                    }
                    else {
                        alert('Error getting Contacts');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Contacts.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

var fsCustAssets = false;
function getFSCustAssets() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getCustAssets?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        fsCustAssets = data;
                        buildHtmlTable('FSCustAssetsData', data);
                    }
                    else {
                        alert('Error getting Assets');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Assets.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function postCustomer() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        var custId = $('#FSCustomerID').val();
        var name = $('#FSCustomerName').val();
        var salesTaxId = $('#FSCustomerSalesTax').val();
        var adCampaignId = $('#FSCustomerAds').val();
        var customerTypeId = $('#FSCustomerTypes').val();
        var paymentTermsId = $('#FSCustomerPaymentTerms').val();
        var notes = $('#FSCustomerNotes').val();
        var postData = { token: token, custId: custId, name: name, salesTaxId: salesTaxId, adCampaignId: adCampaignId, customerTypeId: customerTypeId, paymentTermsId: paymentTermsId, notes: notes };
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/postCustomer',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                buildHtmlTable('FSCustomerData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });
    }
    catch (err) {
        alert(err.description);
    }
}

function postCustLocation() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        var custId = $('#FSCustLocCustId').val();
        var locationId = $('#FSCustLocID').val();
        var name = $('#FSCustLocName').val();
        var address1 = $('#FSCustLocStreet').val();
        var address2 = $('#FSCustLocStreet2').val();
        var city = $('#FSCustLocCity').val();
        var stateId = $('#FSCustLocStateId').val();
        var postalCode = $('#FSCustLocPostalCode').val();
        var phone = $('#FSCustLocPhone').val();
        var postData = { token: token, custId: custId, locationId: locationId, name: name, address1: address1, address2: address2, city: city, stateId: stateId, postalCode: postalCode, phone: phone };
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/postCustLocation',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                buildHtmlTable('FSCustLocationData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });
    }
    catch (err) {
        alert(err.description);
    }
}

function postCustContact() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        var custId = $('#FSCustContactCustId').val();
        var locId = $('#FSCustContactLocId').val();
        var contactId = $('#FSCustContactID').val();
        var firstName = $('#FSCustContactFirstName').val();
        var lastName = $('#FSCustContactLastName').val();
        var phone = $('#FSCustContactPhone').val();
        var altPhone = $('#FSCustContactAltPhone').val();
        var email = $('#FSCustContactEmail').val();
        var isPointOfContact = $('#FSCustContactIsMain').is(':checked')
        var comment = $('#FSCustContactNotes').val();
        var postData = { token: token, custId: custId, locId: locId, contactId: contactId, firstName: firstName, lastName: lastName, phone: phone, altPhone: altPhone, email: email, isPointOfContact: isPointOfContact, comment: comment };
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/postCustContact',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                buildHtmlTable('FSCustContactData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });
    }
    catch (err) {
        alert(err.description);
    }
}

function postCustAsset() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        var custId = $('#FSCustAssetCustId').val();
        var locId = $('#FSCustAssetLocId').val();
        var assetId = $('#FSCustAssetId').val();
        var assetTypeId = $('#FSCustAssetTypeId').val();
        var name = $('#FSCustAssetName').val();
        var description = $('#FSCustAssetDescription').val();
        var manufacturer = $('#FSCustAssetManufacturer').val();
        var model = $('#FSCustAssetModel').val();
        var serialNumber = $('#FSCustAssetSerialNumber').val();
        var locationArea = $('#FSCustAssetArea').val();
        var locationSubArea = $('#FSCustAssetSubArea').val();
        var locationSpot = $('#FSCustAssetSpot').val();
        var postData = { token: token, custId: custId, locId: locId, assetId: assetId, assetTypeId: assetTypeId, name: name, description: description, manufacturer: manufacturer, model: model, serialNumber: serialNumber, locationArea: locationArea, locationSubArea: locationSubArea, locationSpot: locationSpot };
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/postCustAsset',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                buildHtmlTable('FSCustAssetData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });
    }
    catch (err) {
        alert(err.description);
    }
}

var jobStatusList = false;
function loadJobStatusList(target) {
    try {
        var isOk = false;
        if (jobStatusList == false) {
            getJobStatusList();
        }
        if (jobStatusList) {
            if (jobStatusList.length > 0) {
                var select = $('#' + target).empty();
                for (var i = 0; i < jobStatusList.length; i++) {
                    select.append('<option value="' + jobStatusList[i].id + '">' + jobStatusList[i].name + '</option>');
                    isOk = true;
                }
            }
        }
        if (isOk == false) {
            alert('Please click again to load the list from the server');
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function getJobStatusList() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getJobStatusList?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        jobStatusList = data;
                        buildHtmlTable('jobStatusListData', data);
                    }
                    else {
                        alert('Error getting Job Status List');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Job Status List.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

var fsJobs = false;
function getFSJobs() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getJobs?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        fsJobs = data;
                        buildHtmlTable('FSJobsData', data);
                    }
                    else {
                        alert('Error getting Jobs');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Jobs.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

var fsJobsAssets = false;
function getFSJobsAssets() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + escape(token);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getJobAssets?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        fsJobsAssets = data;
                        buildHtmlTable('FSJobsAssetsData', data);
                    }
                    else {
                        alert('No jobs assets found');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Jobs Assets.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function postFSJob() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        var jobId = $('#FSJobID').val();
        var jobNumber = $('#FSJobNumber').val();
        var custId = $('#FSJobCustID').val();
        var contactId = $('#FSJobContactID').val();
        var locationId = $('#FSJobLocationID').val();
        var dueDate = $('#FSJobDueDate').val();
        var statusId = $('#FSJobStatus').val();
        var categoryId = $('#FSJobCategory').val();
        var priorityId = $('#FSJobPriority').val();
        var jobName = $('#FSJobName').val();
        var details = $('#FSJobDetails').val();
        var notes = $('#FSJobNotes').val();
        var postData = { token: token, jobId: jobId, jobNumber: jobNumber, custId: custId, contactId: contactId, locationId: locationId, dueDate: dueDate, statusId: statusId, categoryId: categoryId, priorityId: priorityId, jobName: jobName, details: details, notes: notes };
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/postJob',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                $('#FSJobDataPosted').text(postData);
                buildHtmlTable('FSJobData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });
    }
    catch (err) {
        alert('Error posting Job: ' + err.description);
    }
}

function postFSJobAsset() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        var jobId = $('#FSJAJobID').val();
        var assetId = $('#FSJAAssetID').val();
        var categoryId = $('#FSJACategory').val();
        var details = $('#FSJADetails').val();
        var postData = { token: token, jobId: jobId, assetId: assetId, categoryId: categoryId, details: details }
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/postJobAsset',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                $('#FSJADataPosted').text(postData);
                buildHtmlTable('FSJAData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });
    }
    catch (err) {
        alert(err.description);
    }
}

function postFSJSLog() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        var jobId = $('#FSJSLJobID').val();
        var statusId = $('#FSJSLStatus').val();
        var eventDate = $('#FSJSLDueDate').val();
        var postData = { token: token, jobId: jobId, statusId: statusId, eventDate: eventDate, lat: 0, lng: 0 };
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/postJobStatusLog',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                $('#FSJSLDataPosted').text(postData);
                buildHtmlTable('FSJSLData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });
    }
    catch (err) {
        alert(err.description);
    }
}

function postFSJNLog() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        var jobId = $('#FSJNLJobID').val();
        var noteId = $('#FSJNLNoteID').val();
        var note = $('#FSJNLNotes').val();
        var eventDate = $('#FSJNLEventDate').val();
        var postData = { token: token, jobId: jobId, noteId: noteId, note: note, eventDate: eventDate, lat: 0, lng: 0 };
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/postJobNotesLog',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                $('#FSJNLDataPosted').text(postData);
                buildHtmlTable('FSJNLData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });
    }
    catch (err) {
        alert(err.description);
    }
}

function postFSDA() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        var jobId = $('#FSDAJobID').val();
        var fieldId = $('#FSDAFieldID').val();
        var answer = $('#FSDAAnswer').val();
        var eventDate = $('#FSDAEventDate').val();
        var postData = [];
        postData.push({ token: token, jobId: jobId, fieldId: fieldId, answer: answer, eventDate: eventDate });

        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/saveDynamicAnswers',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                $('#FSDADataPosted').text(postData);
                buildHtmlTable('FSDAData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });
    }
    catch (err) {
        alert(err.description);
    }
}

function postAllData() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        var postData = $('#FSAllDataJson').val();
        $.ajax({
            url: 'pilot.svc/postAllData',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                $('#FSAllDataPosted').text(postData);
                $('#FSPostAllDataRaw').text(JSON.stringify(data));
                buildHtmlTable('FSPostAllData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });
    }
    catch (err) {
        alert('postAllData: ' + err.description);
    }
}

var fsAlerts = false;
function getAlerts() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var data = 'token=' + token + '&isFullSync=1';
            var url = "pilot.svc/alerts?" + data;
            $.ajax({
                type: "GET",
                url: url,
                contentType: "application/json; charset=utf-8",
                data: 0,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        fsAlerts = data;
                        buildHtmlTable('AlertsTable', data);
                    }
                    else {
                        alert('No alerts found');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Alerts.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function setRegId() {
    try {
        var data = { sourceId: 1, token: 'E4023977-F57D-4312-92EA-A8C261E7AA85', regId: '65857A2A-2C48-4D44-BA6F-4497EC6E8EE2', appName: 'eTrack Locate' };
        data = JSON.stringify(data);
        $.ajax({
            url: 'pilot.svc/postRegId',
            type: "POST",
            data: data,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                buildHtmlTable('PushNotifRegIDTable', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });

    }
    catch (err) {
        alert('erro: ' + err.message);
    }
}

function sendPushNotification_APNS() {
    try{
        var regToken = $('#txtRegToken').val();
        var msg = $('#txtMessage').val();

        var data = {
            data:{
                message: msg
            },
            to: regToken
        };

        data = JSON.stringify(data);
        $.ajax({
            url: 'https://gcm-http.googleapis.com/gcm/send',
            type: "POST",
            data: data,
            dataType: 'json',
            contentType: "application/json;",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "key=AIzaSyAp5pDJ-J4EFfOL_BfP41OqaPvff7y0Sqk");
                //APNS Server key: AIzaSyAp5pDJ-J4EFfOL_BfP41OqaPvff7y0Sqk  / SenderID: 464634666975
                //Server key: AIzaSyDh0wRP6jK6ds-vT-4-IytKAE43NpnLBig

            },
            success: function (data, textStatus, jqXHR) {
                var a= 1;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: false
        });



        //Authorization:key=AIzaSyZ-1u...0GBYzPu7Udno5aA

 

        var a = 1;
    }
    catch (err) {

    }
}

//[{
//    id: /id/,
//    isCheckedIn: /isCheckedIn/,
//    lastCheckInOutChange: /lastCheckInOutChange/,
//    reasonId: /reasonId/,
//    comments: /comments/,
//    lat: /lat/,
//    lng: /lng/,
//    isDeleted: /isDeleted/,
//    deletedOn: /deletedOn/
//}]

function checkIn() {
    try {
        var token = 'B33A0411-79DE-4616-91A5-5E0128178F5E';
        var data = { id: 123, isCheckedIn: true, lastCheckInOutChange: '6/11/2016', reasonId: 0, comments: 'test', lat: 0, lng: 0, isDeleted: false, deletedOn: '1/1/1900' };
        var arrData = [];
        arrData.push(data);

        var strData = JSON.stringify(arrData);
        $.ajax({
            url: 'pilot.svc/postCheckInLog?token=' + token,
            type: "POST",
            data: strData,
            dataType: 'json',
            contentType: "application/json;",
            success: function (data, textStatus, jqXHR) {
                var a = 1;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: false
        });


    }
    catch (err) {

    }
}