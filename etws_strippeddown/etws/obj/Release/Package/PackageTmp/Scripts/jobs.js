
function generateRandomId(size) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < size; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;

}

function generateRandomString(target, size) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < size; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    $('#' + target).val(text);

}

function postJob() {
    try {
        var token = $('#token').val();
        var jobId = $('#FSJobID').val();
        var jobNumber = $('#FSJobNumber').val();
        var custId = $('#FSJobCustID').val();
        var custContact = $('#FSJobContactName').val();
        var address = $('#FSJobContactAddress').val();
        var phone = $('#FSJobContactPhone').val();
        var email = $('#FSJobContactEmail').val();
        var dueDate = $('#FSJobDueDate').val();
        var jobDetails = $('#FSJobName').val();
        var assignedToId = $('#FSJobAssignTo').val();

        if (token === '') {
            token = 'A138ED95-3479-480F-AC98-61D0F93C373D';
        }

        if (jobId === '') {
            jobId = generateRandomId(10);
        }
        if (jobNumber === '') {
            jobNumber = 100;
        }

        if (custId === '') {
            custId = 'QD2YdhiXcI';
        }

        if (custContact === '') {
            custContact = 'John Smith';
        }

        if (address === '') {
            address = '123 Main Street, Lulak, MD, 22323';
        }

        if (phone === '') {
            phone = '555-333-2345';
        }

        if (email === '') {
            email = 'John@Smith.com';
        }

        if (dueDate === '') {
            dueDate = '11/26/2014';
        }
        if (jobDetails === '') {
            jobDetails = 'Test';
        }

        if (assignedToId === '') {
            assignedToId = '1DC7E8C7-0A98-48B6-9223-9FEAF52A9B72';
        }

        var custPhone = phone;
        var custEmail = email;
        var statusId = '1';
        var priorityId = 'owqiQpXWoV';
        var categoryId = 'fdferygf45';
        var estDuration = 60;

        var postData = {
            jobId: jobId,
            jobNumber: jobNumber,
            customerId: custId,
            custContact: custContact,
            custAddress: address,
            custPhone: custPhone,
            custEmail: custEmail,
            dueDate: dueDate,
            jobDescription: jobDetails,
            userId: assignedToId,
            custLat: 0,
            custLng: 0,
            statusId: statusId,
            priorityId: priorityId,
            categoryId: categoryId,
            estDuration: estDuration
        };
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'jobs.svc/postJob/' + token,
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                alert('Job posted');
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

function jobSupportTables() {
    try {
        token = $('#jobUserToken').val();
        $.ajax({
            url: 'jobs.svc/jobSupportTables?token=' + token,
            type: "GET",
            data: 0,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
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
        alert(err.message);
    }
}

function JobCustIdName() {
    try {
        token = $('#jobUserToken2').val();
        $.ajax({
            url: 'jobs.svc/getCustomersIdName?token=' + token + '&wzId=0',
            type: "GET",
            data: 0,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            cache: false,
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
        alert(err.message);
    }
}

function jobGetCust() {
    try {
        var token = $('#jobUserToken3').val();
        var custId = $('#jobCustId').val();
        $.ajax({
            url: 'jobs.svc/getCustomer?token=' + token + '&custId=' + custId,
            type: "GET",
            data: 0,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            cache: false,
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
        alert(err.message);
    }
}

function postJobCustomer() {
    try {
        var token = $('#jobUserToken3').val();
        var name = $('#jobName').val();
        var customer = {
            id: '',
            name: name,
            street: '123 Main Street',
            streetNumber: '123',
            route: 'Main Street',
            city: 'New York',
            county: 'NY County',
            state: 'NY',
            postalCode: '00334',
            country: 'USA',
            fullAddress: '123 Main Street, New York, NY 00334',
            lat: 30.1234,
            lng: -81.1234,
            contactName: 'John Smith',
            email: 'john@smith.com',
            phone: '555-444-3333',
            notes: '',
            workZoneId: '0'
        }

        customer = JSON.stringify(customer);
        $.ajax({
            url: 'jobs.svc/postJobCustomer?token=' + token,
            type: "POST",
            data: customer,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                if (data.isOk === true) {
                    alert('Customer posted');
                }
                else {
                    alert(data.sysMsg);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });

    }
    catch (err) {
        alert(err.message);
    }
}