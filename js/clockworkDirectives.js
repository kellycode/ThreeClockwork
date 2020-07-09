'use strict';

angular.module('clockworkApp.clockworkDirectives', [])
        .directive('threeStats', [function () {
                return {
                    restrict: 'AE',
                    controller: 'StatsController'
                };
            }])
        .directive('objectEditPanel', [function () {
                return {
                    restrict: 'AE',
                    replace: 'true',
                    transclude: false,
                    templateUrl: './partials/object-edit-panel.html',
                    controller: 'ObjectEditController'
                };
            }])
        .directive('panelToggleTab', [function () {
                return {
                    restrict: 'AE',
                    replace: 'true',
                    scope: true,
                    transclude: false,
                    require: '^objectEditPanel',
                    template: '<div class="transform_tab" ng-class="activeTab === name ? \'active\' : \'\'" ng-click="toggleVis(name);">{{name}}</div>',
                    link: function (scope, element, attrs) {
                        scope.name = attrs.name;
                    }
                };
            }])
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
        // mouse-look attribute
        .directive('mouseLook', ['$document', 'editEvents', function ($document, editEvents) {
                return {
                    link: function (scope, element, attr) {
                        let lastY;

                        element.on('mousedown', function (event) {
                            // Prevent default dragging of selected content
                            event.preventDefault();
                            $document.on('mousemove', mousemove);
                            $document.on('mouseup', mouseup);
                        });

                        function mousemove(event) {
                            if (!lastY) {
                                lastY = event.pageY;
                                return;
                            }
                            if (event.pageY > lastY) {
                                editEvents.actions.lookingUp = false;
                                editEvents.actions.lookingDown = true;
                            }
                            else if (event.pageY < lastY) {
                                editEvents.actions.lookingUp = true;
                                editEvents.actions.lookingDown = false;
                            }
                            lastY = event.pageY;
                        }

                        function mouseup() {
                            editEvents.actions.lookingDown = editEvents.actions.lookingUp = false;
                            $document.off('mousemove', mousemove);
                            $document.off('mouseup', mouseup);
                        }
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
