var jsonCustomer = false;

function loadCustomer() {
    try {
        createCustomerGrids();
        var uid = getParameterByName('uid');
        if (uid != '') {
            var data = 't=' + getTokenCookie('ETCRMTK') + '&uid=' + escape(uid);
            jsonCustomer = dbReadWrite('ETCRMWS.asmx', 'crmGetCustomerByUniqueKey', data, true, false);

            var company = eval('(' + jsonCustomer.company[0] + ')');
            document.title = company.name;
            $('#companyName').text(company.name);
            $('#newCustomerCase').html(company.newCustomerCase);

            populateUsersGrid(jsonCustomer.users);
            populateDevicesGrid(jsonCustomer.devices);
        }
    }
    catch (err) {
    }
}

function createCustomerGrids() {
    try {
        createUsersGrid();
        createDevicesGrid();
    }
    catch (err) {
    }
}

function populateUsersGrid(jsonData) {
    try {
        for (var i = 0; i <= jsonData.length; i++) {
            var user = eval('(' + jsonData[i] + ')');
            jQuery("#tblUsers").jqGrid('addRowData', i + 1, user);
        }
    }
    catch (err) {
    }
}

function populateDevicesGrid(jsonData) {
    try {
        for (var i = 0; i <= jsonData.length; i++) {
            var device = eval('(' + jsonData[i] + ')');
            jQuery("#tblDevices").jqGrid('addRowData', i + 1, device);
        }
    }
    catch (err) {
    }
}

function createUsersGrid() {
    try {
        jQuery("#tblUsers").jqGrid({
            datatype: "local",
            height: 200,
            width: 1200,
            colNames: ['guid', 'id', 'Name', 'Login', 'Email', 'Phone', 'Cell', 'Last Login', 'QtyLogins', 'Time Zone', 'Driver', 'Login', 'Case'],
            colModel: [
           		                    { name: 'guid', index: 'guid', title: false, hidden: true, width: 1 },
           		                    { name: 'id', index: 'id', width: 30 },
           		                    { name: 'name', index: 'name', width: 300 },
           		                    { name: 'userName', index: 'userName', width: 100 },
           		                    { name: 'email', index: 'email', width: 180 },
           		                    { name: 'phone', index: 'phone', width: 100 },
           		                    { name: 'cellPhone', index: 'cellPhone', width: 100 },
           		                    { name: 'lastLoginOn', index: 'lastLoginOn', width: 100 },
           		                    { name: 'qtyLogins', index: 'qtyLogins', width: 100 },
           		                    { name: 'timeZoneCode', index: 'timeZoneCode', width: 40 },
           		                    { name: 'isDriver', index: 'isDriver', width: 40 },
           		                    { name: 'userLogin', index: 'userLogin', width: 80 },
           		                    { name: 'newUserCase', index: 'newUserCase', width: 80 },
           	                    ],
            rowNum: 50,
            rowList: [10, 20, 30],
            pager: '#tblUsersPager',
            sortname: 'id',
            viewrecords: true,
            sortorder: "desc",
            caption: "Users",
            ondblClickRow: function (id) {
                var rd = $(this).getRowData(id);

                //Edit this record
                //viewUser(id, rd);

                //This is how the data is updated in the grid...
                //var result = $('#tblCustomers').jqGrid('setRowData', gr, rd, '');

            }
        });
        $("#tblUsers").jqGrid('navGrid', '#tblUsersPager', { edit: false, add: false, del: false });
    }
    catch (err) {
    }
}

function createDevicesGrid() {
    try {
        var isCarrierHidden = false;
        var isSimNumberHidden = false;
        var isSimPhoneHidden = false;

        if (isLimitedAccess == true) {
             isCarrierHidden = true;
             isSimNumberHidden = true;
             isSimPhoneHidden = true;
         }

        jQuery("#tblDevices").jqGrid({
            datatype: "local",
            height: 200,
            width: 1200,
            colNames: ['guid', 'id', 'Type', 'Dev.ID', 'Name', 'Last Update', 'Ev.Code', 'Ev.Date', 'GPSStat', 'S.N.', 'Carrier', 'SimNum', 'SimPhone', 'Note*', 'Case', 'Fee'],
            colModel: [
           		                    { name: 'guid', index: 'guid', title: false, hidden: true, width: 1 },
           		                    { name: 'id', index: 'id', width: 30 },
           		                    { name: 'deviceType', index: 'deviceType', width: 60 },
           		                    { name: 'deviceId', index: 'deviceId', width: 60 },
           		                    { name: 'name', index: 'name', width: 60 },
           		                    { name: 'lastUpdatedOn', index: 'lastUpdatedOn', width: 200 },
           		                    { name: 'eventCode', index: 'eventCode', width: 50 },
           		                    { name: 'eventDate', index: 'eventDate', width: 200 },
           		                    { name: 'gpsStatus', index: 'gpsStatus', width: 50 },
           		                    { name: 'serialNumber', index: 'serialNumber', width: 140 },
           		                    { name: 'carrier', index: 'carrier', hidden: isCarrierHidden, width: 80 },
           		                    { name: 'simNumber', index: 'simNumber', hidden: isSimNumberHidden, width: 100 },
           		                    { name: 'simPhone', index: 'simPhone', hidden: isSimPhoneHidden, width: 120 },
           		                    { name: 'note', index: 'note', width: 50 },
           		                    { name: 'newDeviceCase', index: 'newDeviceCase', width: 80 },
           		                    { name: 'monthlyFee', index: 'monthlyFee', width: 50 }
           	                    ],
            rowNum: 50,
            rowList: [10, 20, 30],
            pager: '#tblDevicesPager',
            sortname: 'id',
            viewrecords: true,
            sortorder: "desc",
            caption: "Devices",
            ondblClickRow: function (id) {
                var rd = $(this).getRowData(id);

                //Edit this record
                viewDeviceData(id, rd);

                //This is how the data is updated in the grid...
                //var result = $('#tblCustomers').jqGrid('setRowData', gr, rd, '');

            }
        });
        $("#tblDevices").jqGrid('navGrid', '#tblDevicesPager', { edit: false, add: false, del: false });

        $("#bedata").click(function () {
            // Gets the row number that has been selected...
            var gr = jQuery("#tblDevices").jqGrid('getGridParam', 'selrow');
            var rd = $("#tblDevices").getRowData(gr);

            //View this record
            viewDeviceData(gr, rd);

            //This is how the data is updated in the grid...
            //var result = $('#tblCustomers').jqGrid('setRowData', gr, rd, '');
        });
    }
    catch (err) {
    }
}

function btnViewDeviceData() {
    try {
        var gr = jQuery("#tblDevices").jqGrid('getGridParam', 'selrow');
        var rd = $("#tblDevices").getRowData(gr);

        //View this record
        viewDeviceData(gr, rd);
    }
    catch (err) {
    }
}

function viewDeviceData(rowId, data) {
    try {
        window.open('crmDeviceData.html?' + 'did=' + data.guid, target = "_blank");
    }
    catch (err) {
    }
}


