//https://www.trirand.com/jqgridwiki/doku.php?id=wiki:events
//https://trirand.com/blog/jqgrid/jqgrid.html

var jsonCustomers = false;

function loadCustomers() {
    try {
        createCustomersGrid();
        getCustomers();
        populateCustomersGrid(jsonCustomers.customers);
    }
    catch (err) {
    }
}

function populateCustomersGrid(jsonData) {
    try {
        for (var i = 0; i <= jsonData.length; i++) {
            var customer = eval('(' + jsonData[i] + ')');
            jQuery("#tblCustomers").jqGrid('addRowData', i + 1, customer);
        }
    }
    catch (err) {
    }
}

function getCustomers() {
    try {
        var data = 't=' + getTokenCookie('ETCRMTK');
        jsonCustomers = dbReadWrite('ETCRMWS.asmx', 'crmGetCustomers', data, true, false);

    }
    catch (err) {
    }
}
//           		                    { name: 'userLogin', index: 'userLogin', width: 80 },
//           		                    { name: 'newCustomerCase', index: 'newCustomerCase', width: 80 },


function createCustomersGrid() {
    try {
        jQuery("#tblCustomers").jqGrid({
            datatype: "local",
            height: 450,
            width: 1200,
            colNames: ['uniqueKey', 'id', 'Name', 'Phone', 'Email', 'Created On', 'SalesRepID', 'Sales Rep', 'Susp.', 'T.U.', 'N.I.', 'W.U.', 'N.W.', 'Users List'],
            colModel: [
           		                    { name: 'uniqueKey', index: 'uniqueKey', title: false, hidden: true, width: 1 },
           		                    { name: 'id', index: 'id', width: 30 },
           		                    { name: 'name', index: 'name', width: 300 },
           		                    { name: 'phone', index: 'phone', width: 100 },
           		                    { name: 'email', index: 'email', width: 180 },
           		                    { name: 'createdOn', index: 'createdOn', width: 100 },
           		                    { name: 'salesRepId', index: 'salesRepId', title: false, hidden: true, width: 1 },
           		                    { name: 'salesRep', index: 'salesRep', width: 100 },
           		                    { name: 'isSuspended', index: 'isSuspended', width: 40 },
           		                    { name: 'totalUnits', index: 'totalUnits', width: 40 },
           		                    { name: 'notInstalled', index: 'notInstalled', width: 40 },
           		                    { name: 'workingUnits', index: 'workingUnits', width: 40 },
           		                    { name: 'notWorkingUnits', index: 'notWorkingUnits', width: 40 },
           		                    { name: 'usersList', index: 'usersList', width: 80 }
           	                    ],
            rowNum: 50,
            rowList: [10, 20, 30],
            pager: '#tblCustomersPager',
            sortname: 'id',
            viewrecords: true,
            sortorder: "desc",
            caption: "Customers",
            ondblClickRow: function (id) {
                var rd = $(this).getRowData(id);

                //Edit this record
                viewCustomer(id, rd);

                //This is how the data is updated in the grid...
                //var result = $('#tblCustomers').jqGrid('setRowData', gr, rd, '');

            }
        });

        $("#tblCustomers").jqGrid('navGrid', '#tblCustomersPager', { edit: false, add: false, del: false });

        $("#bedata").click(function () {
            // Gets the row number that has been selected...
            var gr = jQuery("#tblCustomers").jqGrid('getGridParam', 'selrow');
            var rd = $("#tblCustomers").getRowData(gr);

            //View this record
            viewCustomer(gr, rd);

            //This is how the data is updated in the grid...
            //var result = $('#tblCustomers').jqGrid('setRowData', gr, rd, '');
        });
    }
    catch (err) {
    }
}

function btnViewCustomer() {
    try {
        var gr = jQuery("#tblCustomers").jqGrid('getGridParam', 'selrow');
        var rd = $("#tblCustomers").getRowData(gr);

        //View this record
        viewCustomer(gr, rd);
    }
    catch (err) {
    }
}

function viewCustomer(rowId, data) {
    try {
        window.open('crmViewCustomer.html?' + 'uid=' + data.uniqueKey, target = "_blank");
    }
    catch (err) {
    }
}

