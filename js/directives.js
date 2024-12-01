'use strict';

angular.module('ngClockworkApp.directives', [])


        .directive('clockworkTools', ['menuBar', '$compile', function (menuBar, $compile) {
                return {
                    restrict: 'AE',
                    template: '<span class="title">ngClockwork</span>',
                    link: function (scope, element, attrs) {
                        var menuItems = menuBar.menuItems;
                        // create the wrapper element
                        var toolWrapper = angular.element('<div id="toolIcons"></div>');
                        // add the icons and dividers
                        for (var i = 0; i < menuItems.length; i++) {
                            var section = menuItems[i];

                            for (var j = 0; j < section.length; j++) {
                                var buttonClass = section[j].active ? 'menuButton on' : 'menuButton';
                                var button = '<span class="' + buttonClass + '" id="' + section[j].name + '"  ng-click="' + section[j].onclick + ';">' + section[j].text + '</span>';
                                toolWrapper.append(button);
                            }
                            if (i !== menuItems.length - 1) {
                                toolWrapper.append('<span class="sectionBreak"></span>');
                            }
                        }
                        // angular compile before appending
                        $compile(toolWrapper)(scope);
                        // add it to the view
                        element.append(toolWrapper);
                    }
                };
            }])
        .directive('appVersion', ['clockworkConfig', function (clockworkConfig) {
                return {
                    restrict: 'AE',
                    replace: 'true',
                    template: '<span id="devInfo">' + 'ngClockwork: ' + clockworkConfig.name + ' version: ' + clockworkConfig.version + '</span>'
                };
            }])
        .directive('resize', ['$window', function ($window) {
                return function (scope) {
                    var w = angular.element($window);
                    scope.getWindowDimensions = function () {
                        return {
                            'h': $window.innerHeight,
                            'w': $window.innerWidth
                        };
                    };
                    scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                        scope.handleWindowResize();
                    }, true);
                    w.bind('resize', function () {
                        scope.$apply();
                    });
                };
            }]);
