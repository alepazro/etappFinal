var welcomeTitle = '';
var userFullName = '';
var isLimitedAccess = false;

function changePanel(panelId) {
    try {

        switch (panelId) {
            case 1:
                location.href = 'crmMainPanel.html';
                break
            case 2:
                location.href = 'crmCases.html';
                break
            case 3:
                location.href = 'crmConfigFiles.html';
                break
        }
    }
    catch (err) {
        alert('changePanel: ' + err.description);
    }
}

function loginIntoUser(GUID) {
    try {
        window.open('https://etwebapp.elasticbeanstalk.com/login.html?' + 'userGUID=' + GUID, target = "_blank");
    }
    catch (err) {
    }
}

function crmValidateToken() {

    var loginPage = 'crmLogin.html';

    try {
        var t = getTokenCookie('ETCRMTK');
        var ret = false;
        if ((t == null) || (t == '')) {
            if (location.pathname.toLowerCase().indexOf(loginPage.toLowerCase()) == -1) {
                location.href = loginPage;
            }
            return false;
        }
        else {
            jQuery.ajax({
                url: 'ETCRMWS.asmx/crmValidateToken',
                data: 't=' + escape(t),
                dataType: 'xml',
                type: "POST",
                success: function (xml, textStatus) {
                    if (textStatus == 'success') {

                        var objResponse = $("string", xml).text();
                        if (objResponse == '') {
                            alert('Invalid Credentials.  Please try again.');
                            return false;
                        }
                        var jsonResponse = eval('(' + objResponse + ')');
                        if (jsonResponse.isValid == true) {

                            welcomeTitle = jsonResponse.welcomeTitle;
                            userFullName = jsonResponse.fullName;
                            isLimitedAccess = jsonResponse.isLimitedAccess;

                            if (location.pathname.toLowerCase().indexOf('crmmainpanel.html') == -1 &&
                                location.pathname.toLowerCase().indexOf('crmviewcustomer.html') == -1 &&
                                location.pathname.toLowerCase().indexOf('crmdevicedata.html') == -1 &&
                                location.pathname.toLowerCase().indexOf('crmcases.html') == -1 &&
                                location.pathname.toLowerCase().indexOf('crmconfigfiles.html') == -1 &&
                                location.pathname.toLowerCase().indexOf('crmcasesopen.html') == -1) {
                                location.href = 'crmMainPanel.html';
                            }

                            ret = true;
                        }
                        else {
                            if (location.pathname.toLowerCase().indexOf('crmlogin.html') == -1) {
                                location.href = loginPage;
                            }
                            ret = false;
                        }
                    }
                    else {
                        alert('Error validating token');
                        ret = false;
                    }
                },
                error: function (result) {
                    alert('Error validating token');
                    ret = false;
                },
                async: false
            });
        }
        return ret;
    }
    catch (err) {
        if (location.pathname.toLowerCase().indexOf(loginPage.toLowerCase()) == -1) {
            location.href = loginPage;
            return false;
        }
    }
}

//***********************************************************************************************************
// Validate Credentials
//***********************************************************************************************************
function crmValidateCredentialsResponse(xml, textStatus) {
    try {
        if (textStatus == 'success') {
            if (($("string", xml).text()) == 'failure') {
                alert('Login failed.  Please try again.');
                return false;
            }
            var objResponse = $("string", xml).text();
            if (objResponse == '') {
                alert('Invalid Credentials.  Please try again.');
                return false;
            }
            var jsonResponse = eval('(' + objResponse + ')');
            if (jsonResponse.result == 'failure') {
                alert(jsonResponse.error);
                return false;
            }
            else {
                setTokenCookie(jsonResponse);

                welcomeTitle = jsonResponse.welcomeTitle;
                userFullName = jsonResponse.fullName;
                isLimitedAccess = jsonResponse.isLimitedAccess;

                document.getElementById('txtLogin').value = '';
                document.getElementById('txtPassword').value = '';

                alert('Access authorized');
                location.href = 'crmMainPanel.html';

                return true;
            }
        }
        else {
            alert('Sign in status: ' + textStatus);
            return false;
        }
    }
    catch (err) {
        alert('crmValidateCredentialsResponse: ' + err.Description);
        return false;
    }
}

function crmValidateCredentials() {
    try {
        var login = document.getElementById('txtLogin').value;
        var pw = document.getElementById('txtPassword').value;
        var reqParams = 'Login=' + escape(login) + '&pw=' + escape(pw);
        var url = "ETCRMWS.asmx/crmValidateCredentials";
        $.post(url, reqParams, function (xml, textStatus) { crmValidateCredentialsResponse(xml, textStatus); });
    }
    catch (err) {
        alert('crmValidateCredentials: ' + err.Description);
    }
}

//***********************************************************************************************************
function setTokenCookie(jsonResponse) {
    try {
        var exdate = new Date();
        var expiredays = 1;

        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = jsonResponse.tokenCookie + "=" + escape(jsonResponse.token) + "; expires=" + exdate.toUTCString();
    }
    catch (err) {
        alert('setTokenCookie: ' + err.Description);
    }
}
function getTokenCookie(c_name) {
    try {
        var t = "";
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) c_end = document.cookie.length;
                t = unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return t;
    }
    catch (err) {
        alert('getTokenCookie: ' + err.Description);
    }
}
function deleteTokenCookie(c_name) {
    try {
        if (document.cookie.length > 0) {
            document.cookie = c_name + "=";
        }
    }
    catch (err) {
        alert('deleteTokenCookie: ' + err.Description);
    }
}
//***********************************************************************************************************

function crmLogout() {
    try {
        deleteTokenCookie('ETCRMTK');
        location.href = 'crmLogin.html';
    }
    catch (err) {
        alert('Logout: ' + err.Description);
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


