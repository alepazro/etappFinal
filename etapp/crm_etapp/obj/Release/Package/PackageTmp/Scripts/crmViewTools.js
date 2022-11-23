var jsonDeviceData = false;
var jsonCustomer = false;
var uid = false;
var idDevices;
var idCompany;
var listDealers = [];
var company = '';
var dealers;
var devices = '';

function getCrmDealers() {
    
    try {
        
        var token = getTokenCookie('ETCRMTK');
       

        $.ajax({
            //url: 'crm.svc/getCrmDealers?token=' + token,
            url: 'crm.svc/getCrmDealers/' + token,
            type: "POST",
            data: 0,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                ;
                listDealers = jQuery.parseJSON(data);
                for (var i = 0; i < listDealers.length; i++) {
                    $("#cmbDealers").append('<option value="' + listDealers[i].ID + '">' + listDealers[i].Name + '</option>');
                    
                    console.log(listDealers[i].ID + " -> " + listDealers[i].Name);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                ;
                listDealers = [];
            },
            cache: false,
            async: false
        });

        

    }
    catch (err) {

        alert('Error getCrmDealers: ' + err.message);
    }
}

function createDevicesGrid() {
    try {
        jQuery("#tbldevices").jqGrid({
            datatype: "local",
            height: 200,
            width: 1200,
            colNames: ['ID','DeviceID', 'Devices', 'idCompanies', 'company', 'idDealers', 'Dealers'],
            colModel: [
                { name: 'ID', index: 'ID', title: false, hidden: true, width: 100 },
                { name: 'DeviceID', index: 'DeviceID', width: 100 },
                { name: 'NameDevices', index: 'NameDevices', width: 300 },
                { name: 'idCompanies', index: 'idCompanies', hidden: true, width: 100 },
                { name: 'company', index: 'company', width: 180 },
                { name: 'idDealers', index: 'idDealers', hidden: true, width: 100 },
                { name: 'Dealers', index: 'Dealers', width: 100 },
               
            ],
            rowNum: 50,
            rowList: [10, 20, 30],
            pager: '#tbldevicesPager',
            sortname: 'ID',
            viewrecords: true,
            sortorder: "desc",
            caption: "devices result",
            autowidth: true,  // set 'true' here
            shrinkToFit: false,// well, it's 'true' by default
            onSelectRow: function (id) {                
                idDevices = '';
                var rd = $(this).getRowData(id);
                idDevices = rd.ID;
                devices = rd.NameDevices;
                //Edit this record
                //viewUser(id, rd);

                //This is how the data is updated in the grid...
                //var result = $('#tblCustomers').jqGrid('setRowData', gr, rd, '');

            }
        });
        $("#tbldevices").jqGrid('navGrid', '#tbldevicesPager', { edit: false, add: false, del: false });
    }
    catch (err) {
    }
}

function getCrmDevices() {
    debugger;
    $("#tbldevices").jqGrid("clearGridData");
    try {
        var token = getTokenCookie('ETCRMTK');
        var devidesId = $("#inputDevices").val();
        //did = getParameterByName('did');
        var listDealers = [];
            $.ajax({
                //url: 'crm.svc/getCrmDealers?token=' + token,
                url: 'crm.svc/getCrmDevices?token=' + token + "&devicesId=" + devidesId,
                type: "POST",
                data: 0,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                processdata: true,
                success: function (data, textStatus, jqXHR) {
                    debugger;
                    jsonDeviceData = jQuery.parseJSON(data);
                    if (jsonDeviceData.Devices.length>0) {
                        populatetblDeviceNameDataGrid(jsonDeviceData)
                    } else {
                        alert('Not Information Devices');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(textStatus);
                    listDealers = [];
                },
                cache: false,
                async: false
            });
        
        

        

    }
    catch (err) {

        alert('getNotes: ' + err.message);
    }
}
function populatetblDeviceNameDataGrid(jsonData) {
    try {
        for (var i = 0; i < jsonData.Devices.length; i++) {
            var row = eval('(' + jsonData.Devices[i] + ')');
            jQuery("#tbldevices").jqGrid('addRowData', i + 1, row);
            /*  //*/
        }
    }
    catch (err) {
    }
}

function assignDealers() {
    //var idDevices = '';
    var idDealers = '';
    var Dealers = '';
    try {        
        var token = getTokenCookie('ETCRMTK');
        idDealers = $("#cmbDealers").val();
        Dealers = $("#cmbDealers option:selected").text(); 
        if (idDealers == '' || idDealers == null) {
            alert('please select a dealer');
            return;
        }
        if (idDevices == '' || idDevices == null) {
            alert('please select a Devices');
            return;
        }

        $.confirm({
            title: 'Confirm!',
            content: '¿you are sure to move unit ' + devices + ' to dealer ' + Dealers+' ?',
            buttons: {
                confirm: function () {
                    
                    updateDealerts(token, idDevices, idDealers);                    
                    $.alert('update completed!');
                },
                cancel: function () {
                    $.alert('Canceled!');
                }
            }
        });

    } catch (e) {
        alert('Error '+e.message)
    }  


}

function updateDealerts(token, idDevices, idDealers) {

    $.ajax({
        //url: 'crm.svc/getCrmDealers?token=' + token,
        url: 'crm.svc/CRM_UpdateDealerDevices?token=' + token + "&idDevices=" + idDevices + "&idDealer=" + idDealers,
        type: "POST",
        data: 0,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        processdata: true,
        success: function (data, textStatus, jqXHR) {
            getCrmDevices();
            $("#cmbDealers").val('');

        },
        error: function (jqXHR, textStatus, errorThrown) {

            alert('Error Updating: ' + textStatus)
        },
        cache: false,
        async: false
    });

}

function createCompanyGrid() {
        

    try {
        jQuery("#tblcompanys").jqGrid({
            datatype: "local",
            height: 200,
            width: 1200,
            colNames: ['idCompany', 'idDealers', 'Dealers', 'Company', 'Phone', 'Email', 'CreatedOn'],
            colModel: [
                { name: 'idCompany', index: 'idCompany', title: false, hidden: true, width: 50 },
                { name: 'idDealers', index: 'idDealers', hidden: true, width: 50 },
                { name: 'nameDealers', index: 'nameDealers', width: 100 },
                { name: 'nameCompany', index: 'nameCompany', width: 200 },
                { name: 'Phone', index: 'Phone', width: 100 },
                { name: 'Email', index: 'idDEmailealers', width: 100 },
                { name: 'CreatedOn', index: 'CreatedOn', width: 150 }
               
            ],
            rowNum: 50,
            rowList: [10, 20, 30],
            pager: '#tblcompanysPager',
            sortname: 'idCompany',
            viewrecords: true,
            sortorder: "desc",
            caption: "Company result",
            autowidth: true,  // set 'true' here
            shrinkToFit: false,// well, it's 'true' by default
            onSelectRow: function (id) {                
                idCompany = '';
                var rd = $(this).getRowData(id);
                idCompany = rd.idCompany;
                company = rd.nameCompany;
                dealers = rd.nameDealers;
            }
        });
        $("#tblcompanys").jqGrid('navGrid', '#tblcompanysPager', { edit: false, add: false, del: false });
    }
    catch (err) {
    }
}

function CRM_Get_Company(search) {
    $("#tblcompanys").jqGrid("clearGridData");
    try {
        var jsonCompanys = [];
        var token = getTokenCookie('ETCRMTK');
       
        //did = getParameterByName('did');
        var listCompanys = [];
        $.ajax({
            url: 'crm.svc/CRM_GetCompanys?token=' + token + '&search=' + search,
            type: "POST",
            data: 0,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                
                jsonCompanys = jQuery.parseJSON(data);

                populatetblCompanysDataGrid(jsonCompanys)


            },
            error: function (jqXHR, textStatus, errorThrown) {

                listDealers = [];
            },
            cache: false,
            async: false
        });





    }
    catch (err) {

        alert('getNotes: ' + err.message);
    }
}
function searchCompany() {
    var input = $("#inputSearch").val();
    if (input.length>3) {
        CRM_Get_Company(input);
    }

}
function populatetblCompanysDataGrid(jsonData) {
    try {
        for (var i = 0; i < jsonData.Companys.length; i++) {
            var row = eval('(' + jsonData.Companys[i] + ')');
            jQuery("#tblcompanys").jqGrid('addRowData', i + 1, row);
            /*  //*/
        }
    }
    catch (err) {
    }
}
function getCrmDealersCompany() {

    try {

        var token = getTokenCookie('ETCRMTK');


        $.ajax({
            //url: 'crm.svc/getCrmDealers?token=' + token,
            url: 'crm.svc/getCrmDealers/' + token,
            type: "POST",
            data: 0,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            processdata: true,
            success: function (data, textStatus, jqXHR) {
                ;
                listDealers = jQuery.parseJSON(data);
                for (var i = 0; i < listDealers.length; i++) {
                    $("#cmbDealersCompany").append('<option value="' + listDealers[i].ID + '">' + listDealers[i].Name + '</option>');

                    console.log(listDealers[i].ID + " -> " + listDealers[i].Name);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                ;
                listDealers = [];
            },
            cache: false,
            async: false
        });



    }
    catch (err) {

        alert('Error getCrmDealers: ' + err.message);
    }
}


function moveCompany() {
    
    //var idDevices = '';
    var idDealersCompany = '';
    try {
        var token = getTokenCookie('ETCRMTK');
        idDealersCompany = $("#cmbDealersCompany").val();
        dealers = $("#cmbDealersCompany option:selected").text();
        if (idDealersCompany == '' || idDealersCompany == null) {
            alert('please select a dealer');
            idCompany = '';
            return;
        }
        if (idCompany == '' || idCompany == null) {
            alert('please select a company');
            return;
        }

        $.confirm({
            title: 'Confirm!',
            content: '¿you are sure to move the company ' + company + ' to dealers ' + dealers+' ?',
            buttons: {
                confirm: function () {
                    updateMoveCompany(token, idDealersCompany, idCompany);
                    searchCompany();
                    $.alert('update completed!');
                },
                cancel: function () {
                    $.alert('Canceled!');
                }
            }
        });

    } catch (e) {
        alert('error: ' + e.message);
    }


}

function updateMoveCompany(token, DealersCompany, Company) {

    $.ajax({
        //url: 'crm.svc/getCrmDealers?token=' + token,
        url: 'crm.svc/CRM_updateMoveCompany?token=' + token + "&DealersCompany=" + DealersCompany + "&Company=" + Company,
        type: "POST",
        data: 0,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        processdata: true,
        success: function (data, textStatus, jqXHR) {
            CRM_Get_Company();
            $("#cmbDealersCompany").val('');
            idCompany = '';

        },
        error: function (jqXHR, textStatus, errorThrown) {

            alert('Error Updating: ' + textStatus)
        },
        cache: false,
        async: false
    });

}

function clearGrid1() {

    $("#tbldevices").jqGrid("clearGridData");
    $("#inputDevices").val('');
}
function clearGrid2() {
    $("#tblcompanys").jqGrid("clearGridData");
    $("#inputSearch").val('');    
}