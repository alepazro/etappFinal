etApp.controller('assignUnitsController', ['$scope', '$location', 'Inventory', 'inventory', 'AssignInventory', function ($scope, $location, Inventory, inventory, AssignInventory) {

    $scope.companies = getCompaniesList();
    $scope.devices = inventory;

    $scope.save = function () {
        var token = getCookie('ETCRMTK');

        var assignInventory = new AssignInventory({ token: getCookie('ETCRMTK') });
        assignInventory.custId = $scope.companyId;
        var assigned = _.where($scope.devices, { isSelected: true });
        assigned = _.pluck(assigned, 'deviceId');
        assignInventory.inventory = assigned;

        assignInventory.$saveAssignedInventory({ token: token }, function (data) {
            location.href = "crmMainPanel.html";
        });
    };

    $scope.cancel = function () {
        delete $scope.companies;
        delete $scope.devices;
        location.href = "crmMainPanel.html";
    };

    $scope.sortListBy = function (key) {
        inventory = sortByKey(inventory, key);
        $scope.devices = inventory;
    };

}]);

function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
