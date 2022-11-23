etApp.controller('invoicesController', ['$scope', '$location', 'invoices', 'Invoice', function ($scope, $location, invoices, Invoice) {
        var a = 1;

    $('.gridStyle').attr('style', 'height: ' + (h - 35 - 270) + 'px;');

    $scope.companies = getCompaniesList();

    //===================================================================
    $scope.gridOptions = {
        data: 'invoices',
        showFooter: true,
        rowHeight: 25,
        columnDefs: [
            { field: 'invoiceNumber', displayName: 'Inv. No.' },
            { field: 'invoiceDate', displayName: 'Date' },
            { field: 'total', displayName: 'Total Amount' },
            { field: 'paid', displayName: 'Total Paid' },
            { field: 'balance', displayName: 'Balance' }
        ]
    };
    //========================================================================================

    $scope.queryInvoices = function () {
        var token = getCookie('ETCRMTK');
        var custId = $scope.companyId;
        var noCache = Math.floor((Math.random() * 100000) + 1);
        Invoice.query({ token: token, custId: custId, noCache: noCache }, function (data) {
            $scope.invoices = data;
        });

    }

}]);
