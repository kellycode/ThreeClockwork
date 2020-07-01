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
            'ng-clockwork.objectLoader',
            'ng-clockwork.editEvents',
            'ng-clockwork.editActions',
            'ng-clockwork.sceneFactory',
            'ng-clockwork.physicsFactory',
            'ng-clockwork.utilFactory',
            'ng-clockwork.templateFactory',
            //'monospaced.mousewheel',
            //'colorpicker.module',
            'ui.bootstrap'
        ]);
