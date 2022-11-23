etApp.controller('devicesSearchCtrl', ['$scope', '$location', 'Device', function ($scope, $location, Device) {


    $scope.searchDevice = function () {
        var token = getCookie('ETCRMTK');
        var noCache = Math.floor((Math.random() * 100000) + 1);
        Device.get({ token: token, noCache: noCache, searchKey: $scope.searchKey, keyValue: $scope.keyValue }, function (data) {
            $scope.dev = data;
        }, function (err) {
            alert('ooppss... something went wrong.  Please try again or contact Technical Support.');
        });

    }

    $scope.closeForm = function () {
        location.href = "crmMainPanel.html";
    }

}]);