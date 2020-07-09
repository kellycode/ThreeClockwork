'use strict';

// Declare app level module which depends on filters, and services
angular.module('clockworkApp',
        ['ngResource',
            'ngCookies',
            'clockworkApp.clockworkControllers',
            'clockworkApp.clockworkConfig',
            'clockworkApp.clockworkDirectives',
            'clockworkApp.clockworkFilters',
            'clockworkApp.clockworkDataService',
            'clockworkApp.clockworkObjectStore',
            'clockworkApp.clockworkEditEvents',
            'clockworkApp.clockworkEditActions',
            'clockworkApp.clockworkThreeScene',
            'clockworkApp.clockworkUtilities',
            'clockworkApp.clockworkTemplater',
            'clockworkApp.cannonPhysics',
            'clockworkApp.cannonControls',
            'clockworkApp.cannonBoxes',
            'clockworkApp.cannonBullets',
            'ui.bootstrap'
        ]);
