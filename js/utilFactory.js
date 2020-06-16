'use strict';

angular.module('ng-clockwork.utilFactory', [])
        .factory('objectUtils', [function() {
                return {
                    // from https://github.com/mrdoob/three.js/issues/581
                    calculateDimensions: function(_object) {
                        var absoluteMinX = 0, absoluteMaxX = 0, absoluteMinY = 0, absoluteMaxY = 0, absoluteMinZ = 0, absoluteMaxZ = 0;

                        for (var i = 0; i < _object.children.length; i++) {
                            _object.children[i].children[0].geometry.computeBoundingBox();
                            absoluteMinX = Math.min(absoluteMinX, _object.children[i].children[0].geometry.boundingBox.min.x);
                            absoluteMaxX = Math.max(absoluteMaxX, _object.children[i].children[0].geometry.boundingBox.max.x);
                            absoluteMinY = Math.min(absoluteMinY, _object.children[i].children[0].geometry.boundingBox.min.y);
                            absoluteMaxY = Math.max(absoluteMaxY, _object.children[i].children[0].geometry.boundingBox.max.y);
                            absoluteMinZ = Math.min(absoluteMinZ, _object.children[i].children[0].geometry.boundingBox.min.z);
                            absoluteMaxZ = Math.max(absoluteMaxZ, _object.children[i].children[0].geometry.boundingBox.max.z);
                        }

                        // set generic height and width values
                        _object.depth = (absoluteMaxX - absoluteMinX) * _object.scale.x;
                        _object.height = (absoluteMaxY - absoluteMinY) * _object.scale.y;
                        _object.width = (absoluteMaxZ - absoluteMinZ) * _object.scale.z;

                        // remember the original dimensions
                        if (_object.originalDepth === undefined)
                            _object.originalDepth = _object.depth;
                        if (_object.originalHeight === undefined)
                            _object.originalHeight = _object.height;
                        if (_object.originalWidth === undefined)
                            _object.originalWidth = _object.width;

                        console.log("Depth: " + _object.depth + ", Height: " + _object.height + ", Width: " + _object.width);
                    },
                    // from https://github.com/mrdoob/three.js/issues/581
                    // THREE.BoundingBoxHelper and THREE.Box3().setFromObject
                    // gave incorrect sizes.  the only caveat here is that the 
                    // model must be properly centered when it's made. (no offsets)
                    getCompoundBoundingBox: function(object3D) {
                        var box = null;
                        object3D.traverse(function(obj3D) {
                            var geometry = obj3D.geometry;
                            if (geometry === undefined)
                                return;
                            geometry.computeBoundingBox();
                            if (box === null) {
                                box = geometry.boundingBox;
                            } else {
                                box.union(geometry.boundingBox);
                            }
                        });

                        var dims = {
                            x: box.max.x - box.min.x,
                            y: box.max.y - box.min.y,
                            z: box.max.z - box.min.z,
                            minX: box.min.x,
                            minY: box.min.y,
                            minZ: box.min.z,
                            maxX: box.max.x,
                            maxY: box.max.y,
                            maxZ: box.max.z
                        };
                        return dims;
                    }
                };
            }])
        .factory('jqSlider', [function() {
                return {
                    init: function() {
                        $("#slider").slider(
                                {
                                    value: 50,
                                    min: 0,
                                    max: 100,
                                    slide: function(event, ui) {
                                        // do something with the value
                                        $("#slider-value").html(ui.value);
                                    }
                                }
                        );
                    }
                };
            }])
        .factory('degreeSync', [function() {
                return {
                    getDeg: function(radians) {
                        return radians * (180 / Math.PI);
                    },
                    getRad: function(degrees) {
                        return degrees * (Math.PI / 180);
                    },
                    safeChange: function(num, change) {
                        return ((num * 1000) + (change * 1000)) / 1000;
                    },
                    updateRotation: function(selected) {
                        var x = this.getRad(selected.degrees.x);
                        var y = this.getRad(selected.degrees.y);
                        var z = this.getRad(selected.degrees.z);
                        selected.rotation.set(x, y, z);
                    }
                };
            }])
        .factory('jsUtility', [function() {
                return {
                    compareGenericAsc: function(key) {
                        return function(a, b) {
                            var characters = '*!@_.()#^&%-=+01234567989abcdefghijklmnopqrstuvwxyz';
                            var index_a = characters.indexOf(a[key][0]);
                            var index_b = characters.indexOf(b[key][0]);
                            if (index_a === index_b) {
                                // same first character, sort regular
                                if (a[key] < b[key]) {
                                    return -1;
                                } else if (a[key] > b[key]) {
                                    return 1;
                                }
                                // default
                                return 0;
                            } else {
                                return index_a - index_b;
                            }
                        };
                    },
                    compareGenericDes: function(key) {
                        return function(a, b) {
                            var characters = '*!@_.()#^&%-=+01234567989abcdefghijklmnopqrstuvwxyz';
                            var index_a = characters.indexOf(a[key][0]);
                            var index_b = characters.indexOf(b[key][0]);
                            if (index_a === index_b) {
                                // same first character, sort regular
                                if (a[key] < b[key]) {
                                    return 1;
                                } else if (a[key] > b[key]) {
                                    return -1;
                                }
                                // default
                                return 0;
                            } else {
                                return index_b - index_a;
                            }
                        };
                    }
                };
            }]);