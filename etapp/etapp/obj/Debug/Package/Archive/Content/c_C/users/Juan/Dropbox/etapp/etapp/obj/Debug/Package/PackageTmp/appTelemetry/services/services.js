﻿var services = angular.module('etApp.services', ['ngResource']);

services.factory('DevOutput', ['$resource', function ($resource) {
    return $resource('etrest.svc/telemetry/:token/:noCache/:deviceId/:relNum/:relState',
        { token: '@token', noCache: '@noCache', deviceId: '@deviceId', relNum: '@relNum', relState: '@relState' },
        {
            getOutputs: { method: "GET", params: { token: 0, noCache: 0, deviceId: 0 } }
        });
}]);
