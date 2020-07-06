'use strict';

// Declare app level module which depends on filters, and services
angular.module('ng-clockwork',
        ['ngResource',
            'ngCookies',
            'ng-clockwork.controllers',
            'ng-clockwork.config',
            'ng-clockwork.directives',
            'ng-clockwork.filters',
            'ng-clockwork.services',
            'ng-clockwork.objectStoreFactory',
            'ng-clockwork.editEvents',
            'ng-clockwork.editActions',
            'ng-clockwork.threeSceneFactory',
            'ng-clockwork.physicsFactory',
            'ng-clockwork.cannonControlsFactory',
            'ng-clockwork.boxFactory',
            'ngClockworkApp.bulletFactory',
            'ng-clockwork.utilFactory',
            'ng-clockwork.templateFactory',
            'ui.bootstrap'
        ]);
