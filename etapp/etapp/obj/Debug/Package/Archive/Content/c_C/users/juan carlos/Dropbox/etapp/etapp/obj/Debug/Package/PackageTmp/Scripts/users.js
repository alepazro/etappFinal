﻿var isUsersDlgReady = false;
var jsonUsers = false;
var jsonCarriers = false;
var jsonAccessLevels = false;

function editUser(obj) {
    try {
        if (isUsersDlgReady == false) {
            setupNewUserDlg();
            setupUserChangePWDlg();
            setupUserRemoveDlg();
            isUsersDlgReady = true;
        }
        if (validateUserAccess(15) == true) {
            var id = $(obj.target).attr('data-id');
            $('#newUserFirstName').val($('#userTR' + id).attr('data-firstName'));
            $('#newUserFirstName').attr('data-id', id);
            $('#newUserLastName').val($('#userTR' + id).attr('data-lastName'));
            $('#newUserEmail').val($('#userTR' + id).attr('data-email'));
            if ($('#userTR' + id).attr('data-isEmailAlerts') == 'true') {
                $('#newUserIsEmailAlerts').prop('checked', true);
            }
            else {
                $('#newUserIsEmailAlerts').prop('checked', false);
            }
            $('#newUserPhone').val($('#userTR' + id).attr('data-phone'));
            $('#newUserCellPhone').val($('#userTR' + id).attr('data-cellPhone'));
            if ($('#userTR' + id).attr('data-isSMSAlerts') == 'true') {
                $('#newUserIsSMSAlerts').prop('checked', true);
            }
            else {
                $('#newUserIsSMSAlerts').prop('checked', false);
            }
            $('#newUserCarrier').val($('#userTR' + id).attr('data-carrierId'));
            $('#newUserLogin').val($('#userTR' + id).attr('data-login'));
            $('#newUserPassword').val('');
            $('#newUserTimeZone').val($('#userTR' + id).attr('data-timeZoneCode'));
            if ($('#userTR' + id).attr('data-isDriver') == 'true') {
                $('#newUserIsDriver').prop('checked', true);
            }
            else {
                $('#newUserIsDriver').prop('checked', false);
            }
            $('#newUserAccessLevel').val($('#userTR' + id).attr('data-accessLevelId'));

            $('#newUserSchedules').val($('#userTR' + id).attr('data-scheduleId'));
            if ($('#userTR' + id).attr('data-isAdministrator') == 'true') {
                $('#newUserIsAdministrator').prop('checked', true);
            }
            else {
                $('#newUserIsAdministrator').prop('checked', false);
            }

            $("#newUserDlg").dialog('open')
        }
    }
    catch (err) {
        alert('editUser: ' + err.description);
    }
}

function fillUserRecord(tr, item) {
    try {
        var tbl = document.getElementById('usersTbl');

        $(tr).attr('id', 'userTR' + item.id);
        $(tr).attr('data-firstName', item.firstName);
        $(tr).attr('data-lastName', item.lastName);
        $(tr).attr('data-email', item.email);
        $(tr).attr('data-isEmailAlerts', item.isEmailAlerts);
        $(tr).attr('data-phone', item.phone);
        $(tr).attr('data-cellPhone', item.cellPhone);
        $(tr).attr('data-isSMSAlerts', item.isSMSAlerts);
        $(tr).attr('data-carrierId', item.carrierId);
        $(tr).attr('data-login', item.login);
        $(tr).attr('data-timeZoneCode', item.timeZoneCode);
        $(tr).attr('data-isDriver', item.isDriver);
        $(tr).attr('data-accessLevelId', item.accessLevelId);
        $(tr).attr('data-accessLevelName', item.accessLevelName);
        $(tr).attr('data-scheduleId', item.scheduleId);
        $(tr).attr('data-isAdministrator', item.isAdministrator);

        if (tbl.childNodes.length % 2 == 0) {
            $(tr).addClass('usersListOddTR');
        }

        //First Name
        var firstNameTd = document.createElement('td');
        $(firstNameTd).html(item.firstName);
        $(firstNameTd).addClass('usersListTD');
        tr.appendChild(firstNameTd);

        //Last Name
        var lastNameTd = document.createElement('td');
        $(lastNameTd).html(item.lastName);
        $(lastNameTd).addClass('usersListTD');
        tr.appendChild(lastNameTd);

        //Email
        var emailTd = document.createElement('td');
        $(emailTd).html(item.email);
        $(emailTd).addClass('usersListTD');
        tr.appendChild(emailTd);

        //Is Email Alerts
        var isEmailAlertsTd = document.createElement('td');
        if (item.isEmailAlerts == true) {
            $(isEmailAlertsTd).html('Yes');
        }
        else {
            $(isEmailAlertsTd).html('No');
        }
        $(isEmailAlertsTd).addClass('usersListTD');
        tr.appendChild(isEmailAlertsTd);

        //Phone
        var phoneTd = document.createElement('td');
        $(phoneTd).html(item.phone);
        $(phoneTd).addClass('usersListTD');
        tr.appendChild(phoneTd);

        //Cell Phone
        var cellPhoneTd = document.createElement('td');
        $(cellPhoneTd).html(item.cellPhone);
        $(cellPhoneTd).addClass('usersListTD');
        tr.appendChild(cellPhoneTd);

        //Is SMS Alerts
        var isSMSAlertsTd = document.createElement('td');
        if (item.isSMSAlerts == true) {
            $(isSMSAlertsTd).html('Yes');
        }
        else {
            $(isSMSAlertsTd).html('No');
        }
        $(isSMSAlertsTd).addClass('usersListTD');
        tr.appendChild(isSMSAlertsTd);

        //Login
        var loginTd = document.createElement('td');
        $(loginTd).attr('id', 'loginTd' + item.id);
        $(loginTd).html(item.login);
        $(loginTd).addClass('usersListTD');
        tr.appendChild(loginTd);

        //Time Zone Code
        var tzcTd = document.createElement('td');
        $(tzcTd).html(item.timeZoneCode);
        $(tzcTd).addClass('usersListTD');
        tr.appendChild(tzcTd);

        //Is Driver
        var isDriverTd = document.createElement('td');
        if (item.isDriver == true) {
            $(isDriverTd).html('Yes');
        }
        else {
            $(isDriverTd).html('No');
        }
        $(isDriverTd).addClass('usersListTD');
        tr.appendChild(isDriverTd);

        //Access Level
        var alTd = document.createElement('td');
        $(alTd).html(item.accessLevelName);
        $(alTd).addClass('usersListTD');
        tr.appendChild(alTd);

        //Change Password
        var pwTd = document.createElement('td');
        $(pwTd).addClass('usersListTD usersListCenteredTD');
        tr.appendChild(pwTd);

        var pwBtn = document.createElement('button');
        pwTd.appendChild(pwBtn);
        $(pwBtn).attr('data-id', item.id);
        $(pwBtn).click(changeUserPassword);

        var pwImg = document.createElement('img');
        $(pwImg).attr('src', 'icons/bullet_key.png');
        $(pwImg).attr('alt', '');
        $(pwImg).attr('width', '16');
        $(pwImg).attr('height', '16');
        $(pwImg).attr('data-id', item.id);
        pwBtn.appendChild(pwImg);

        //Edit
        var editTd = document.createElement('td');
        $(editTd).addClass('usersListTD usersListCenteredTD');
        tr.appendChild(editTd);

        var editBtn = document.createElement('button');
        editTd.appendChild(editBtn);
        $(editBtn).attr('data-id', item.id);
        $(editBtn).click(editUser);

        var editImg = document.createElement('img');
        $(editImg).attr('src', 'icons/edit_inline.png');
        $(editImg).attr('alt', '');
        $(editImg).attr('width', '16');
        $(editImg).attr('height', '16');
        $(editImg).attr('data-id', item.id);
        editBtn.appendChild(editImg);

        //Delete user
        var delTd = document.createElement('td');
        $(delTd).addClass('usersListTD usersListCenteredTD');
        tr.appendChild(delTd);

        var delBtn = document.createElement('button');
        delTd.appendChild(delBtn);
        $(delBtn).attr('data-id', item.id);
        $(delBtn).click(deleteUser);

        var delImg = document.createElement('img');
        $(delImg).attr('src', 'icons/RedCloseX.bmp');
        $(delImg).attr('alt', '');
        $(delImg).attr('width', '16');
        $(delImg).attr('height', '16');
        $(delImg).attr('data-id', item.id);
        delBtn.appendChild(delImg);

    }
    catch (err) {
        alert('fillUserRecord: ' + err.description);
    }
}

function modifyUserListRecord(id, itm) {
    try {
        var tr = document.getElementById('userTR' + id);
        removeAllChildNodes(tr);
        fillUserRecord(tr, itm);
    }
    catch (err) {
        alert('modifyUserListRecord: ' + err.description);
    }
}

function addUserToList(item) {
    try {
        var tbl = document.getElementById('usersTbl');
        var tr = document.createElement('tr');
        tbl.appendChild(tr);
        fillUserRecord(tr, item);
    }
    catch (err) {
        alert('addUserToList: ' + err.description);
    }
}

function clearUserList() {
    try {
        $("#usersTbl").find("tr:gt(0)").remove();
    }
    catch (err) {
        alert('clearUserList: ' + err.description);
    }
}

function getUsers() {
    try {
        var data = 't=' + getTokenCookie('ETTK');
        jsonUsers = dbReadWrite('getUsers', data, true, false);

        return true;
    }
    catch (err) {
        alert('getUsers: ' + err.description);
    }
}

function loadUsers() {
    try {
        //Always get a fresh set of users
        getUsers();

        if (jsonUsers) {
            clearUserList();
            if (jsonUsers) {
                for (var ind = 0; ind < jsonUsers.users.length; ind++) {
                    var jsonItem = eval('(' + jsonUsers.users[ind] + ')');
                    addUserToList(jsonItem);
                }
            }
        }
    }
    catch (err) {
        alert('loadUsers: ' + err.description);
    }
}

function saveUser() {
    try {
        tips = $(".validateTips");

        var bOk = true;

        bOk = bOk && checkLength($('#newUserFirstName'), "First Name", 3, 20);
        bOk = bOk && checkLength($('#newUserLastName'), "Last Name", 3, 20);
//        bOk = bOk && checkLength($('#newUserEmail'), "Email", 3, 100);
        //        bOk = bOk && checkLength($('#newUserLogin'), "Login", 3, 20);

        if ($('#newUserEmail').val().length > 0) {
            if (!validateEmail($('#newUserEmail').val())) {
                bOk = false;
                alert('Please enter a valid email');
            }
        }

        if (bOk == true) {
            var id = $('#newUserFirstName').attr('data-id');
            var firstName = $('#newUserFirstName').val();
            var lastName = $('#newUserLastName').val();
            var email = $('#newUserEmail').val();
            var isEmailAlerts = $('#newUserIsEmailAlerts').prop('checked');
            var phone = $('#newUserPhone').val();
            var cellPhone = $('#newUserCellPhone').val();
            var isSMSAlerts = $('#newUserIsSMSAlerts').prop('checked');
            var carrierId = $('#newUserCarrier').val();
            var login = $('#newUserLogin').val();
            var password = $('#newUserPassword').val();
            var timeZoneCode = $('#newUserTimeZone').val();
            var isDriver = $('#newUserIsDriver').prop('checked');
            var accessLevelId = $('#newUserAccessLevel').val();
            var accessLevelName = $('#newUserAccessLevel option:selected').text();
            var scheduleId = $('#newUserSchedules').val();
            var isAdministrator = $('#newUserIsAdministrator').prop('checked');

            data = 't=' + getTokenCookie('ETTK') + '&id=' + escape(id) + '&fn=' + escape(firstName) + '&ln=' + escape(lastName) + '&e=' + escape(email) + '&isEmailAlerts=' + escape(isEmailAlerts) + '&p=' + escape(phone) + '&cell=' + escape(cellPhone) + '&isSMSAlerts=' + escape(isSMSAlerts) + '&carrierId=' + escape(carrierId) + '&l=' + escape(login) + '&pw=' + escape(password) + '&tz=' + escape(timeZoneCode) + '&isD=' + escape(isDriver) + '&al=' + escape(accessLevelId) + '&scheduleId=' + escape(scheduleId) + '&isAdmin=' + escape(isAdministrator);
            var tmpJson = dbReadWrite('saveUser', data, true, false);

            var itm = { 'id': tmpJson.result, 'firstName': firstName, 'lastName': lastName, 'email': email, 'isEmailAlerts': isEmailAlerts, 'phone': phone, 'cellPhone': cellPhone, 'isSMSAlerts': isSMSAlerts, 'carrierId': carrierId, 'login': login, 'password': password, 'timeZoneCode': timeZoneCode, 'isDriver': isDriver, 'accessLevelId': accessLevelId, 'accessLevelName': accessLevelName, 'scheduleId': scheduleId, 'isAdministrator': isAdministrator };

            if (id == '0') {
                addUserToList(itm);
            }
            else {
                modifyUserListRecord(id, itm);
            }

            return true;
        }
        else {
            return false;
        }

    }
    catch (err) {
        alert('saveUser: ' + err.description);
    }
}

function newUser() {
    try {
        if (isUsersDlgReady == false) {
            setupNewUserDlg();
            setupUserChangePWDlg();
            setupUserRemoveDlg();
            isUsersDlgReady = true;
        }

        //Validate access to this feature
        if (validateUserAccess(6) == true) {
            $('#newUserFirstName').val('');
            $('#newUserFirstName').attr('data-id', 0);
            $('#newUserLastName').val('');
            $('#newUserEmail').val('');
            $('#newUserIsEmailAlerts').prop('checked', false);
            $('#newUserPhone').val('');
            $('#newUserCellPhone').val('');
            $('#newUserIsSMSAlerts').prop('checked', false);
            $('#newUserCarrier').val('');
            $('#newUserLogin').val('');
            $('#newUserPassword').val('');
            $('#newUserTimeZone').val('');
            $('#newUserIsDriver').prop('checked', false);
            $('#newUserAccessLevel').val('');
            $('#newUserSchedules').val('');
            $('#newUserIsAdministrator').prop('checked', false);

            $("#newUserDlg").dialog('open')
        }
    }
    catch (err) {
        alert('newUser: ' + err.description);
    }
}

function loadUsersSchedules() {
    try {
        if (jsonSchedules == false) {
            var data = 't=' + getTokenCookie('ETTK');
            jsonSchedules = dbReadWrite('getSchedules', data, true, false);
        }
        if (jsonSchedules) {
            var cbx = document.getElementById('newUserSchedules');
            removeAllChildNodes(cbx);
            loadComboBox(jsonSchedules.schedules, cbx, 'Pick a schedule');
        }
    }
    catch (err) {
        alert('loadSchedules: ' + err.description);
    }
}

function loadCarriers() {
    try {
        if (jsonCarriers == false) {
            var data = 't=' + getTokenCookie('ETTK');
            jsonCarriers = dbReadWrite('getSMSGateways', data, true, false);
            if (jsonCarriers) {
                var cbx = document.getElementById('newUserCarrier');
                removeAllChildNodes(cbx);
                loadComboBox(jsonCarriers.smsGateways, cbx, 'Pick a carrier');
            }
        }
    }
    catch (err) {
        alert('loadCarriers: ' + err.description);
    }
}

function loadAccessLevels() {
    try {
        if (jsonAccessLevels == false) {
            var data = 't=' + getTokenCookie('ETTK');
            jsonAccessLevels = dbReadWrite('getAccessLevels', data, true, false);
            if (jsonAccessLevels) {
                var cbx = document.getElementById('newUserAccessLevel');
                removeAllChildNodes(cbx);
                loadComboBox(jsonAccessLevels.levels, cbx, 'Pick a level');
            }
        }
    }
    catch (err) {
        alert('loadAccessLevels: ' + err.description);
    }
}

function setupNewUserDlg() {
    try {
        loadCarriers();
        loadAccessLevels();
        loadUsersSchedules();
        $("#newUserDlg").dialog({
            height: 500,
            width: 400,
            autoOpen: false,
            modal: true,
            buttons: {
                Save: function () {
                    if (saveUser() == true) {
                        $(this).dialog("close");
                    }
                    else {
                        alert('Failed saving user.  Please try again.');
                    }
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            },
            open: function () {
                //Actions to perform upon open
            },
            close: function () {
                //Actions to perform upon close
                $('#newFirstName').val('');
                $('#newLastName').val('');
                $('#newEmail').val('');
                $('#newPhone').val('');
                $('#newCellPhone').val('');
                $('#newCarrierId').val('');
                $('#newLogin').val('');
                $('#newPassword').val('');
                $('#newUserAccessLevel').val('');
                //$('#newTimeZone').val('');
                //$('#newIsDriver').val('');
            }
        });
    }
    catch (err) {
        alert('setupNewUserDlg: ' + err.description);
    }
}

/*=============================================================*/
/* CHANGE USER CREDENTIALS */

function saveNewCredentials() {
    try {
        tips = $(".validateTips");

        var bOk = true;

        bOk = bOk && checkLength($('#userChangeLogin'), "Login", 3, 20);
        bOk = bOk && checkLength($('#userChangePW1'), "Password", 3, 20);
        bOk = bOk && checkLength($('#userChangePW2'), "Password Copy", 3, 20);

        if ($('#userChangePW1').val() != $('#userChangePW2').val()) {
            bOk = false;
            alert("Passwords don't match. Please try again.");
        }

        if (bOk == true) {
            var id = $('#userChangeLogin').attr('data-id');
            var login = $('#userChangeLogin').val();
            var pw = $('#userChangePW1').val();

            data = 't=' + getTokenCookie('ETTK') + '&id=' + escape(id) + '&login=' + escape(login) + '&pw=' + escape(pw);
            var tmpJson = dbReadWrite('changeUserCredentials', data, true, false);

            $('#userTR' + id).attr('data-login', login);
            $('#loginTd' + id).html(login);

            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        alert('saveNewCredentials: ' + err.description);
    }
}

function changeUserPassword(obj) {
    try {
        if (isUsersDlgReady == false) {
            setupNewUserDlg();
            setupUserChangePWDlg();
            setupUserRemoveDlg();
            isUsersDlgReady = true;
        }
        if (validateUserAccess(7) == true) {
            var id = $(obj.target).attr('data-id');
            $('#userChangeLogin').val($('#userTR' + id).attr('data-login'));
            $('#userChangeLogin').attr('data-id', id);
            $("#userChangePWDlg").dialog('open')
        }
    }
    catch (err) {
        alert('changeUserPassword: ' + err.description);
    }
}

function setupUserChangePWDlg() {
    try {
        $("#userChangePWDlg").dialog({
            height: 190,
            width: 400,
            autoOpen: false,
            modal: true,
            buttons: {
                Save: function () {
                    if (saveNewCredentials() == true) {
                        $(this).dialog("close");
                    }
                    else {
                        alert('Failed saving new credentials.  Please try again.');
                    }
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            },
            open: function () {
                //Actions to perform upon open
            },
            close: function () {
                //Actions to perform upon close
                $('#userChangeLogin').val('');
                $('#userChangePW1').val('');
                $('#userChangePW2').val('');
            }
        });
    }
    catch (err) {
        alert('setupUserChangePWDlg: ' + err.description);
    }
}

/*=============================================================*/
/* DELETE USER */

function deleteUserCommit() {
    try {
        var id = $('#userRemoveName').attr('data-id');

        data = 't=' + getTokenCookie('ETTK') + '&id=' + escape(id);
        var tmpJson = dbReadWrite('removeUser', data, true, false);

        var tbl = document.getElementById('usersTbl');
        var tr = document.getElementById('userTR' + id);
        tbl.removeChild(tr);

        return true;
    }
    catch (err) {
        alert('deleteUserCommit: ' + err.description);
    }
}

function deleteUser(obj) {
    try {
        if (isUsersDlgReady == false) {
            setupNewUserDlg();
            setupUserChangePWDlg();
            setupUserRemoveDlg();
            isUsersDlgReady = true;
        }
        if (validateUserAccess(9) == true) {
            var id = $(obj.target).attr('data-id');
            var name = $('#userTR' + id).attr('data-firstName') + ' ' + $('#userTR' + id).attr('data-lastName');
            $('#userRemoveName').html(name);
            $('#userRemoveName').attr('data-id', id);
            $("#userRemoveDlg").dialog('open')
        }
    }
    catch (err) {
        alert('deleteUser: ' + err.description);
    }
}

function setupUserRemoveDlg() {
    try {
        $("#userRemoveDlg").dialog({
            height: 160,
            width: 300,
            autoOpen: false,
            modal: true,
            buttons: {
                Cancel: function () {
                    $(this).dialog("close");
                },
                Yes: function () {
                    if (deleteUserCommit() == true) {
                        $(this).dialog("close");
                    }
                    else {
                        alert('Failed removing user.  Please try again.');
                    }
                }
            },
            open: function () {
                //Actions to perform upon open
            },
            close: function () {
                //Actions to perform upon close
                $('#userRemoveName').html('');
            }
        });
    }
    catch (err) {
        alert('setupUserRemoveDlg: ' + err.description);
    }
}

