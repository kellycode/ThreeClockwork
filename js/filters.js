'use strict';

/* Filters */
angular.module('ng-clockwork.filters', [])
        // inserts text into an element
        .filter('interpolate', ['version', function(version) {
                return function(text) {
                    return String(text).replace(/\%VERSION\%/mg, version);
                };
            }])
        // reverses the order of an object or an array
        .filter('reverse', function() {
            function toArray(list) {
                var k, out = [];
                if (list) {
                    if (angular.isArray(list)) {
                        out = list;
                    }
                    else if (typeof (list) === 'object') {
                        for (k in list) {
                            if (list.hasOwnProperty(k)) {
                                out.push(list[k]);
                            }
                        }
                    }
                }
                return out;
            }
            return function(items) {
                return toArray(items).slice().reverse();
            };
        });
