var services = angular.module('etApp.services', ['ngResource']);

services.factory('DevOutput', ['$resource', function ($resource) {
    return $resource('etrest.svc/telemetry/:token/:noCache/:deviceId/:relNum/:relState',
        { token: '@token', noCache: '@noCache', deviceId: '@deviceId', relNum: '@relNum', relState: '@relState' },
        {
            getOutputs: { method: "GET", params: { token: 0, noCache: 0, deviceId: 0 } },
            getAllDevices: { method: "GET", isArray: true, params: { token: 0, noCache: 0 } }
    });
}]);

services.factory('HourMeter', ['$resource', function ($resource) {
    return $resource('etrest.svc/hourMeters/:token/:noCache/:deviceId',
        { token: '@token', noCache: '@noCache', deviceId: '@deviceId' },
        {
            getHourMeters: { method: "GET", params: { token: 0, noCache: 0, deviceId: 0 } },
            getAllDevices: { method: "GET", isArray: true, params: { token: 0, noCache: 0 } },
            saveHourMeter: { method: "POST", params: { token: 0 } }
        });
}]);