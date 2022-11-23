
var fsCustomers = false;
function getFSCustomers2() {
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
                url: "pilot.svc/getCustomers2?",
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

var fsCustContacts = false;
function getFSCustContacts2() {
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
                url: "pilot.svc/getCustContacts2?",
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

function postCustomer2() {
    try {
        if (user === false) {
            authorization();
        }
        var token = user.token;
        if (token.length === 0) {
            alert('Please enter token');
            return;
        }
        var custId = $('#FSCustomerID').val();
        var name = $('#FSCustomerName').val();
        var street = $('#FSCustomerStreet').val();
        var city = $('#FSCustomerCity').val();
        var state = $('#FSCustomerState').val();
        var postalCode = $('#FSCustomerPostalCode').val();
        var country = $('#FSCustomerCountry').val();
        var notes = $('#FSCustomerNotes').val();
        var postData = { token: token, custId: custId, name: name, street: street, city: city, state: state, postalCode: postalCode, country: country, notes: notes };
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/postCustomer2',
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

function postCustContact2() {
    try {
        if (user === false) {
            authorization();
        }
        var token = user.token;
        if (token.length === 0) {
            alert('Please enter token');
            return;
        }
        var custId = $('#FSCustContactCustId').val();
        var contactId = $('#FSCustContactID').val();
        var firstName = $('#FSCustContactFirstName').val();
        var lastName = $('#FSCustContactLastName').val();
        var phone = $('#FSCustContactPhone').val();
        var email = $('#FSCustContactEmail').val();
        var isPrimary = $('#FSCustContactIsMain').is(':checked')
        var postData = { token: token, custId: custId, contactId: contactId, firstName: firstName, lastName: lastName, phone: phone, email: email, isPrimary: isPrimary };
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/postCustContact2',
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

var fsJobs = false;
function getFSJobs2() {
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
                url: "pilot.svc/getJobs2?",
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

function getFSJobs3() {
    try {
        if (user === false) {
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
                url: "pilot.svc/getJobs3?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        fsJobs = data;
                        buildHtmlTable('FSJobs3Data', data);
                    }
                    else {
                        alert('Error getting Jobs v.3');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Jobs v.3.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function postFSJob2() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length === 0) {
            alert('Please enter token');
            return;
        }
        var jobId = $('#FSJobID').val();
        var jobNumber = $('#FSJobNumber').val();
        var custId = $('#FSJobCustID').val();
        var contactId = $('#FSJobContactID').val();
        var dueDate = $('#FSJobDueDate').val();
        var statusId = $('#FSJobStatus').val();
        var priorityId = $('#FSJobPriority').val();
        var jobDescription = $('#FSjobDescription').val();
        var postData = { token: token, jobId: jobId, jobNumber: jobNumber, custId: custId, contactId: contactId, dueDate: dueDate, statusId: statusId, priorityId: priorityId, jobDescription: jobDescription };
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/postJob2',
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

function postImage() {
    try {
        if (user === false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        var jobId = $('#UIJobID').val();
        var imgType = $('#UIImgType').val();
        var imgId = $('#UIImgID').val();
        var imgName = $('#UIImgName').val();
        var fileName = $('#UIFileName').val();
        var fileType = $('#UIFileType').val();
        var eventDate = $('#UIEventDate').val();
        var lat = $('#UILat').val();
        var lng = $('#UILng').val();
        var imgData = $('#UIData').val();
        var postData = { token: token, jobId: jobId, imgType: imgType, imgId: imgId, imgName: imgName, fileName: fileName, fileType: fileType, imgData: imgData, eventDate: eventDate, lat: lat, lng: lng };
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/postImage',
            type: "POST",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                $('#UIImagePosted').text(postData);
                buildHtmlTable('UIImgData', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error');
            },
            async: true
        });
    }
    catch (err) {
        alert('Error posting Image: ' + err.description);
    }
}

function postImage2() {
    readImage($("#UIPickImg")[0]);
}

function readImage(input) {
    if (input.files && input.files[0]) {
        var FR = new FileReader();
        FR.onload = function (e) {
            $('#UIShowImg').attr("src", e.target.result);
            $('#UIImgPayload').text(e.target.result);

            $.ajax({
                url: 'pilot.svc/postImage/123/1/PNG',
                type: "POST",
                data: e.target.result,
                contentType: "image/png",
                processdata: true,
                success: function (data, textStatus, jqXHR) {
                    $('#UIImagePosted').text(postData);
                    buildHtmlTable('UIImgData', data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('error: ' + errorThrown);
                },
                async: true
            });

        };
        FR.readAsDataURL(input.files[0]);
    }
}

$("#UIPickImg").change(function () {
    readImage(this);
});

var uiImages = false;
function getUIImages() {
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
                url: "pilot.svc/getImages?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        uiImages = data;
                        buildHtmlTable('tblUIImages', data);
                    }
                    else {
                        alert('Error getting Images');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Images.');
                }
            });
        }
    }
    catch (err) {
        alert(err.description);
    }
}

function viewImage() {
    try {
        if (user === false) {
            authorization();
        }
        var token = user.token;
        if (token.length == 0) {
            alert('Please enter token');
            return;
        }
        else {
            var imageId = $('#UIViewImageID').val();
            var data = 'token=' + escape(token) + '&id=' + escape(imageId);
            $.ajax({
                type: "GET",
                url: "pilot.svc/getImage?",
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                processdata: false,
                success: function (data, textStatus, jqXHR) {
                    $('#UIShowImg').attr("src", data.imgData);
                    $('#UIImgPayload').text(data.imgData);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error fetching Images.');
                }
            });

        }
    }
    catch (err) {
        alert('viewImage: ' + err.description);
    }
}

function deleteJob() {
    try {
        if (user == false) {
            authorization();
        }
        var token = user.token;
        if (token.length === 0) {
            alert('Please enter token');
            return;
        }
        var jobId = $('#FSDelJobJobID').val();
        var eventDate = '';
        var postData = { token: token, jobId: jobId, eventDate: eventDate, lat: 0, lng: 0 };
        postData = JSON.stringify(postData);
        $.ajax({
            url: 'pilot.svc/deleteJob',
            type: "DELETE",
            data: postData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                $('#FSDelJobDataPosted').text(postData);
                buildHtmlTable('FSDelJobData', data);
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
