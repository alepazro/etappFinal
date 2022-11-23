etApp.controller('inventoryViewController', ['$scope', '$location', 'inventory', 'Inventory', function ($scope, $location, inventory, Inventory) {

    $('.gridStyle').attr('style', 'height: ' + (h - 35 - 270) + 'px;');

    $scope.inventory = inventory;
    //===================================================================
    $scope.gridOptions = {
        data: 'inventory',
        showFooter: true,
        rowHeight: 25,
        columnDefs: [
            { field: 'deviceId', displayName: 'Device ID' },
            { field: 'deviceTypeName', displayName: 'Type' },
            { field: 'serialNumber', displayName: 'Serial Number' },
            { field: 'imei', displayName: 'IMEI' },
            { field: 'simNo', displayName: 'Sim Number' },
            { field: 'simAreaCode', displayName: 'Area Code' },
            { field: 'simPhoneNumber', displayName: 'Phone Number' },
            { field: 'createdOn', displayName: 'Created On' },
            { field: 'lastUpdatedOn', displayName: 'Last Updated On' },
            { field: 'eventDate', displayName: 'Last Event Date' }
            ]
    };

    //========================================================================================

} ]);
