'use strict';


// Declare app level module which depends on filters, and services
angular.module('ngClockworkApp',
        [
            'ngResource',
            'ngCookies',
            'ngClockworkApp.controllers',
            'ngClockworkApp.config',
            'ngClockworkApp.directives',
            'ngClockworkApp.filters',
            'ngClockworkApp.services',
            'ngClockworkApp.objectLoader',
            'ngClockworkApp.editEvents',
            'ngClockworkApp.editActions',
            'ngClockworkApp.sceneFactory',
            'ngClockworkApp.physicsFactory',
            'ngClockworkApp.boxFactory',
            'ngClockworkApp.bulletFactory',
            'ngClockworkApp.utilFactory',
            'ngClockworkApp.templateFactory',
            'ui.bootstrap'
        ]).controller('ngClockworkController', ['$scope', '$rootScope', function ngClockworkController($scope, $rootScope) {
        $rootScope.pageTitle = "ngClockwork";
    }]);
