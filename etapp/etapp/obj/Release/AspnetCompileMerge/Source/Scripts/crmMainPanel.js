//https://www.trirand.com/jqgridwiki/doku.php?id=wiki:events
//https://trirand.com/blog/jqgrid/jqgrid.html

var jsonCustomers = false;

function clearCustSearch() {
    try {
        $('#customerSearch').val('');
        loadCustomers('');
    }
    catch (err) {
        alert('Error: ' + err.description);
    }
}

function searchCustomers() {
    try {

        var search = $('#customerSearch').val();

        var searchParam = '';
        if (!_.isUndefined(search)) {
            searchParam = 'search=' + search;
        }
        else {
            searchParam = 'search=0';
        }

        var data = jsonGET('crm.svc', 'customers', searchParam, true);

        $('#customersGrid').data('kendoGrid').dataSource.data(data);

    }
    catch (err) {
        alert('Error: ' + err.message);
    }
}

function loadCustomers(search) {
    try {
        var searchParam = '';
        if (!_.isUndefined(search)) {
            searchParam = 'search=' + search;
        }
        else {
            searchParam = 'search=0';
        }

        var data = []; //jsonGET('crm.svc', 'customers', searchParam, true);

        $("#customersGrid").kendoGrid({
            dataSource: {
                data: data,
                pageSize: 20
            },
            height: 650,
            groupable: true,
            sortable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [
                { command: { text: "Edit", click: viewCustomer }, title: " ", width: "70px" },
                { field: "uniqueKey", title: "uniqueKey", hidden: true },
                { field: "id", title: "ID", hidden: true },
                { field: "name", title: "Name", width: "200px"},
                { field: "phone", title: "Phone", width: "120px" },
                { field: "email", title: "Email", width: "150px" },
                { field: "createdOn", title: "Created On", width: "80px" },
                { field: "salesRep", title: "Sales Rep", width: "80px" },
                { field: "isSuspended", title: "Susp.", width: "50px" },
                { field: "totalUnits", title: "T.U.", width:"50px" },
                { field: "notInstalled", title: "N.I.", width: "50px" },
                { field: "workingUnits", title: "W.U.", width: "50px" },
                { field: "notWorkingUnits", title: "N.W.", width: "50px" },
                { field: "usersList", title: "Users List", hidden: true }
            ]
        });

    }
    catch (err) {
        alert('Error: ' + err.message);
    }
}

function viewCustomer(e) {
    try{
        e.preventDefault();
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        window.open('crmViewCustomer.html?' + 'uid=' + dataItem.uniqueKey, target = "_blank");
    }
    catch (err) {
        alert('Error: ' + err.message);
    }
}

