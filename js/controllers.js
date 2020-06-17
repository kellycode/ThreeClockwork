'use strict';

/* Controllers */
angular.module('ng-clockwork.controllers', [])
        .controller('ClockworkController', ['$scope', '$rootScope', 'threeScene', 'editEvents',
            function ($scope, $rootScope, threeScene, editEvents) {
                // shows up in the browser tab
                $rootScope.pageTitle = "ngClockwork";
                $scope.selectedObject = null;
                $scope.speedStatus = '';
                $scope.editorVisible = true;

                $scope.handleKeydown = function (event) {
                    editEvents.keyDown(event, editEvents.actions);
                };

                $scope.handleKeyup = function (event) {
                    editEvents.keyUp(event, editEvents.actions);
                };

                $scope.saveScene = function () {
                    $scope.$broadcast('saveScene');
                };

                $scope.toggleGrid = function () {
                    console.log('toggleGrid');
                };

                // just opens/closes the editing tabs
                $scope.toggleEditingInterface = function (event) {
                    $scope.editorVisible = !$scope.editorVisible;
                };

                $scope.handleWindowResize = function () {
                    if (threeScene.ready) {
                        threeScene.camera.aspect = window.innerWidth / window.innerHeight;
                        threeScene.camera.updateProjectionMatrix();
                        threeScene.renderer.setSize(window.innerWidth, window.innerHeight);
                    }
                };
            }])
        .controller('SceneController', ['$scope', 'dataService', '$element', 'editEvents', 'objectEditor', 'objectStore', 'threeScene',
            function ($scope, dataService, $element, editEvents, objectEditor, objectStore, threeScene) {

                $scope.handleMousedown = function (event) {
                    if ($scope.editorVisible) {
                        $scope.intersects = objectStore.objectSelect(event, threeScene);
                    }
                };

                $scope.$on('saveScene', function (e) {
                    editEvents.actions.fileSave = true;
                });

                // start the scene and load it
                threeScene.init($element);
                dataService.loadSceneJSON("./json/scene1.json?v=12").then(function (response) {
                    if (!response) {
                        console.error('File load error 1.  File could not be found. Error: ' + response.status);
                    }
                    else {
                        threeScene.sceneData = response;
                        threeScene.camera = objectStore.loadScene(threeScene);
                        threeScene.ready = true;
                        $scope.animate();
                    }
                });

                // the render and update section
                $scope.animate = function () {
                    $scope.stats.update();
                    objectEditor.update(threeScene, editEvents.actions);
                    objectStore.update(threeScene, editEvents.actions);
                    if (editEvents.actions.fileSave) {
                        editEvents.actions.fileSave = false;
                        dataService.saveScene(threeScene);
                    }
                    requestAnimationFrame($scope.animate);
                    $scope.render();
                };

                $scope.render = function () {
                    threeScene.renderer.render(threeScene.scene, threeScene.camera);
                };
            }])
        .controller('ObjectEditController', ['$scope', 'threeScene', 'dataService', 'constants',
            function ($scope, threeScene, dataService, constants) {
                $scope.textureList = [];
                $scope.modelList = [];
                $scope.modelNames = [];
                $scope.const = constants;
                $scope.selected = threeScene.selectedObject;
                // selectedType used to hide/show buttons
                $scope.hasMap = false;
                $scope.selectedType = '';
                $scope.defaultTexture = null;
                $scope.testTexture = '';
                $scope.activeTab = 'MOVEMENT';

                $scope.toggleVis = function (name) {
                    $scope.activeTab = name;
                };

                // object is showing a trial texture, we 
                // want to remove that and replace the original
                $scope.cancelTexture = function () {
                    if ($scope.hasMap) {
                        var tTexture = $scope.selected.userData.template.texture.path;
                        var map = $scope.selected.material.map;
                        var x = map.repeat.x;
                        var y = map.repeat.y;
                        var loader = new THREE.TextureLoader();
                        $scope.selected.material.map = loader.load(tTexture);
                        ;
                        $scope.selected.material.map.wrapS = $scope.selected.material.map.wrapT = THREE.RepeatWrapping;
                        $scope.selected.material.map.repeat.set(x, y);
                        $scope.selected.material.needsUpdate = true;
                        $scope.testTexture = '';
                    }
                    else {
                        $scope.selected.material.map = null;
                        $scope.selected.material.needsUpdate = true;
                        $scope.testTexture = '';
                    }
                };

//                var map = $scope.selected.material.map;
//                map.wrapS = map.wrapT = THREE.RepeatWrapping;
//                map.repeat.set(map.repeat.x, map.repeat.y);
//                map.needsUpdate = true;

                // try out a texture on this model, user can only try one at a time 
                // required to remove the previous before trying out the next
                $scope.applyTexture = function (newTexture) {
                    if ($scope.selected.type === 'Mesh') {
                        var map, x, y;
                        if ($scope.selected.material.map) {
                            map = $scope.selected.material.map;
                            x = map.repeat.x;
                            y = map.repeat.y;
                        }
                        else {
                            x = 1;
                            y = 1;
                        }
                        var loader = new THREE.TextureLoader();
                        $scope.selected.material.map = loader.load(newTexture);
                        $scope.selected.material.map.wrapS = $scope.selected.material.map.wrapT = THREE.RepeatWrapping;
                        $scope.selected.material.map.repeat.set(x, y);
                        $scope.selected.material.needsUpdate = true;
                        $scope.testTexture = newTexture;
                    }
                };

                // go ahead and save this texture to the template for 
                // file save, this is now the default texture for this object
                $scope.confirmTexture = function (newTexture) {
                    var template = $scope.selected.userData.template;
                    if ('texture' in template) {
                        template.texture.path = newTexture;
                    }
                    else {
                        template.texture = {
                            anisotropy: 16,
                            path: newTexture,
                            repeat: {
                                height: 1,
                                width: 1
                            }
                        };
                    }
                    $scope.testTexture = '';
                };

                dataService.getAvailableTextures().then(function (response) {
                    if (!response) {
                        console.error('Get Available Textures error.');
                    }
                    else {
                        $scope.textureList = response.data;
                    }
                });

                dataService.getAvailableModels().then(function (response) {
                    if (!response) {
                        console.error('Get Available Models error.');
                    }
                    else {
                        $scope.modelList = response;
                    }
                });

                // should we show the remove texture button
                $scope.showRemoveTexture = function (media) {
                    return ($scope.testTexture === media && $scope.selectedType !== 'Group');
                };

                // should we show the confirm (save) texture button
                $scope.showConfirmTexture = function (media) {
                    return ($scope.testTexture === media && $scope.selectedType !== 'Group');
                };

                // are we able to apply a texture?  Not possible on DAE models and other groups
                $scope.applyIsDisabled = function () {
                    return (!$scope.selected || $scope.selectedType === 'Group');
                };

                // we just want to see if the current selection is an 
                // object with a texture that can be edited
                $scope.enableTextureChange = function () {
                    $scope.selected = threeScene.selectedObject;

                    // set our defaults first
                    $scope.hasMap = false;
                    $scope.defaultTexture = null;
                    $scope.selectedType = '';
                    $scope.testTexture = '';

                    // only intercept if it's not null
                    // otherwise our defaults stay unchanged
                    if ($scope.selected) {
                        $scope.selectedType = $scope.selected.type;
                        if ($scope.selected.material) {
                            if ($scope.selected.material.map) {
                                $scope.hasMap = true;
                                $scope.defaultTexture = $scope.selected.material.map.sourceFile;
                            }
                            else {
                                $scope.hasMap = false;
                                $scope.defaultTexture = null;
                            }
                        }
                    }
                };

                // make some updates when the selected object changes
                $scope.$watch(function () {
                    return threeScene.selectedObject;
                },
                        function () {
                            $scope.enableTextureChange();
                        }
                );
            }])
        .controller('MeshEditScaleController', ['$scope', 'constants',
            function ($scope, constants) {
                $scope.dec = function (num) {
                    return ((num * 1000) - (constants.OBJECT_SCALE_CHANGE * 1000)) / 1000;
                };
                $scope.inc = function (num) {
                    return ((num * 1000) + (constants.OBJECT_SCALE_CHANGE * 1000)) / 1000;
                };
                $scope.incScaleX = function () {
                    $scope.selected.scale.x = $scope.inc($scope.selected.scale.x);
                };
                $scope.decScaleX = function () {
                    $scope.selected.scale.x = $scope.dec($scope.selected.scale.x);
                };
                $scope.incScaleY = function () {
                    $scope.selected.scale.y = $scope.inc($scope.selected.scale.y);
                };
                $scope.decScaleY = function () {
                    $scope.selected.scale.y = $scope.dec($scope.selected.scale.y);
                };
                $scope.incScaleZ = function () {
                    $scope.selected.scale.z = $scope.inc($scope.selected.scale.z);
                };
                $scope.decScaleZ = function () {
                    $scope.selected.scale.z = $scope.dec($scope.selected.scale.z);
                };
            }])
        .controller('MeshEditPositionController', ['$scope', 'constants',
            function ($scope, constants) {
                $scope.dec = function (num) {
                    return ((num * 1000) - (constants.OBJECT_MOVE_SPEED * 1000)) / 1000;
                };
                $scope.inc = function (num) {
                    return ((num * 1000) + (constants.OBJECT_MOVE_SPEED * 1000)) / 1000;
                };
                $scope.incPosX = function () {
                    $scope.selected.position.x = $scope.inc($scope.selected.position.x);
                };
                $scope.decPosX = function () {
                    $scope.selected.position.x = $scope.dec($scope.selected.position.x);
                };
                $scope.incPosY = function () {
                    $scope.selected.position.y = $scope.inc($scope.selected.position.y);
                };
                $scope.decPosY = function () {
                    $scope.selected.position.y = $scope.dec($scope.selected.position.y);
                };
                $scope.incPosZ = function () {
                    $scope.selected.position.z = $scope.inc($scope.selected.position.z);
                };
                $scope.decPosZ = function () {
                    $scope.selected.position.z = $scope.dec($scope.selected.position.z);
                };
            }])
        .controller('MeshEditRotationController', ['$scope', 'constants', 'degreeSync',
            function ($scope, constants, degreeSync) {
                $scope.degX = 0;
                $scope.degY = 0;
                $scope.degZ = 0;

                $scope.updateRotation = function () {
                    degreeSync.updateRotation($scope.selected);
                };

                $scope.incDegX = function () {
                    $scope.selected.degrees.x = degreeSync.safeChange($scope.selected.degrees.x, constants.OBJECT_ROTATE_DEGREES);
                    degreeSync.updateRotation($scope.selected);
                };
                $scope.decDegX = function () {
                    $scope.selected.degrees.x = degreeSync.safeChange($scope.selected.degrees.x, -constants.OBJECT_ROTATE_DEGREES);
                    degreeSync.updateRotation($scope.selected);
                };
                $scope.incDegY = function () {
                    $scope.selected.degrees.y = degreeSync.safeChange($scope.selected.degrees.y, constants.OBJECT_ROTATE_DEGREES);
                    degreeSync.updateRotation($scope.selected);
                };
                $scope.decDegY = function () {
                    $scope.selected.degrees.y = degreeSync.safeChange($scope.selected.degrees.y, -constants.OBJECT_ROTATE_DEGREES);
                    degreeSync.updateRotation($scope.selected);
                };
                $scope.incDegZ = function () {
                    $scope.selected.degrees.z = degreeSync.safeChange($scope.selected.degrees.z, constants.OBJECT_ROTATE_DEGREES);
                    degreeSync.updateRotation($scope.selected);
                };
                $scope.decDegZ = function () {
                    $scope.selected.degrees.z = degreeSync.safeChange($scope.selected.degrees.z, -constants.OBJECT_ROTATE_DEGREES);
                    degreeSync.updateRotation($scope.selected);
                };
            }])
        .controller('MaterialEditController', ['$scope', 'threeScene',
            function ($scope, threeScene) {
                $scope.onlyOneOpen = true;
                $scope.openTop = true;
                $scope.selected = null;
                $scope.material = null;
                $scope.colors = {
                    color: '#ffffff',
                    emissive: '#ffffff',
                    specular: '#ffffff'
                };
                $scope.shadings = [
                    {value: 0, label: 'NoShading'},
                    {value: 1, label: 'FlatShading'},
                    {value: 2, label: 'SmoothShading'}
                ];
                $scope.sidings = [
                    {value: 0, label: 'FrontSide'},
                    {value: 1, label: 'BackSide'},
                    {value: 2, label: 'DoubleSide'}
                ];
                $scope.vertexColors = [
                    {value: 0, label: 'NoColors'},
                    {value: 1, label: 'FaceColors'},
                    {value: 2, label: 'VertexColors'}
                ];

                $scope.boolToStr = function (arg) {
                    return arg ? 'true' : 'false';
                };

                $scope.invertColor = function (hexTripletColor) {
                    var color = hexTripletColor;
                    color = color.substring(1);           // remove #
                    color = parseInt(color, 16);          // convert to integer
                    color = 0xFFFFFF ^ color;             // invert three bytes
                    color = color.toString(16);           // convert to hex
                    color = ("000000" + color).slice(-6); // pad with leading zeros
                    color = "#" + color;                  // prepend #
                    return color;
                };

                // all colors are converted to css 
                // style values on object selection change and 
                // the colorpicker background and color is set to that color
                $scope.getHexColors = function () {
                    $scope.colors.color = '#' + $scope.material.color.getHexString();
                    $scope.colors.emissive = '#' + $scope.material.emissive.getHexString();
                    $scope.colors.specular = '#' + $scope.material.specular.getHexString();
                };

                // if no object is selected, reset the 
                // color values to the default of #fff 
                // because the input background adapts the
                // available color
                $scope.clearHexColors = function () {
                    $scope.colors.color = '#ffffff';
                    $scope.colors.emissive = '#ffffff';
                    $scope.colors.specular = '#ffffff';
                };

                $scope.getRandomHexColor = function () {
                    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                };

                // on change, set THREE color from the css 
                // style color the input and colorpicker uses
                $scope.setColor = function () {
                    $scope.material.color.setStyle($scope.colors.color);
                };
                $scope.setEmissive = function () {
                    $scope.material.emissive.setStyle($scope.colors.emissive);
                };
                $scope.setSpecular = function () {
                    $scope.material.specular.setStyle($scope.colors.emissive);
                };

                // make some updates when the selected object changes
                $scope.$watch(function () {
                    return threeScene.selectedObject;
                },
                        function () {
                            if (threeScene.selectedObject) {
                                if (threeScene.selectedObject.type !== 'Group') {
                                    $scope.selected = threeScene.selectedObject;
                                    $scope.material = threeScene.selectedObject.material;
                                    //console.log($scope.material);
                                    $scope.getHexColors();
                                }
                            }
                            else {
                                $scope.selected = null;
                                $scope.material = null;
                                $scope.clearHexColors();
                            }
                        }
                );
            }])
        .controller('MeshEditTextureOffsetController', ['$scope', 'constants',
            function ($scope, constants) {
                $scope.dec = function (num) {
                    return ((num * 1000) - (constants.OBJECT_OFFSET_CHANGE * 1000)) / 1000;
                };
                $scope.inc = function (num) {
                    return ((num * 1000) + (constants.OBJECT_OFFSET_CHANGE * 1000)) / 1000;
                };

                $scope.incOffsetX = function () {
                    $scope.selected.material.map.offset.x = $scope.inc($scope.selected.material.map.offset.x);
                    $scope.selected.material.map.needsUpdate = true;
                };
                $scope.decOffsetX = function () {
                    $scope.selected.material.map.offset.x = $scope.dec($scope.selected.material.map.offset.x);
                    $scope.selected.material.map.needsUpdate = true;
                };
                $scope.incOffsetY = function () {
                    $scope.selected.material.map.offset.y = $scope.inc($scope.selected.material.map.offset.y);
                    $scope.selected.material.map.needsUpdate = true;
                };
                $scope.decOffsetY = function () {
                    $scope.selected.material.map.offset.y = $scope.dec($scope.selected.material.map.offset.y);
                    $scope.selected.material.map.needsUpdate = true;
                };
            }])
        .controller('MeshEditTextureRepeatController', ['$scope', 'constants',
            function ($scope, constants) {
                $scope.dec = function (num) {
                    return ((num * 1000) - (constants.OBJECT_REPEAT_CHANGE * 1000)) / 1000;
                };
                $scope.inc = function (num) {
                    return ((num * 1000) + (constants.OBJECT_REPEAT_CHANGE * 1000)) / 1000;
                };

                $scope.updateRepeat = function () {
                    var map = $scope.selected.material.map;
                    map.wrapS = map.wrapT = THREE.RepeatWrapping;
                    map.repeat.set(map.repeat.x, map.repeat.y);
                    map.needsUpdate = true;
                };

                $scope.incRepeatX = function () {
                    $scope.selected.material.map.repeat.x = $scope.inc($scope.selected.material.map.repeat.x);
                    $scope.updateRepeat();
                };
                $scope.decRepeatX = function () {
                    $scope.selected.material.map.repeat.x = $scope.dec($scope.selected.material.map.repeat.x);
                    $scope.updateRepeat();
                };
                $scope.incRepeatY = function () {
                    $scope.selected.material.map.repeat.y = $scope.inc($scope.selected.material.map.repeat.y);
                    $scope.updateRepeat();
                };
                $scope.decRepeatY = function () {
                    $scope.selected.material.map.repeat.y = $scope.dec($scope.selected.material.map.repeat.y);
                    $scope.updateRepeat();
                };
            }])
        .controller('MeshEditCreateController', ['$scope', 'objectStore', 'templater',
            function ($scope, objectStore, templater) {
                $scope.onlyOneOpen = true;
                $scope.openTop = true;
                $scope.selectedModel = $scope.modelList[0];

                $scope.displayChanged = function (selection) {
                    $scope.selectedModel = selection;
                };

                $scope.createNewObject = function (type) {
                    switch (type) {
                        case 'box':
                            objectStore.createNewObject(templater.boxTemplate);
                            break;
                        case 'circle':
                            objectStore.createNewObject(templater.circleTemplate);
                            break;
                        case 'cylinder':
                            objectStore.createNewObject(templater.cylinderTemplate);
                            break;
                        case 'dodecahedron':
                            objectStore.createNewObject(templater.dodecahedronTemplate);
                            break;
                        case 'icosahedron':
                            objectStore.createNewObject(templater.icosahedronTemplate);
                            break;
                        case 'octahedron':
                            objectStore.createNewObject(templater.octahedronTemplate);
                            break;
                        case 'plane':
                            objectStore.createNewObject(templater.planeTemplate);
                            break;
                        case 'ring':
                            objectStore.createNewObject(templater.ringTemplate);
                            break;
                        case 'sphere':
                            objectStore.createNewObject(templater.sphereTemplate);
                            break;
                        case 'tetrahedron':
                            objectStore.createNewObject(templater.tetrahedronTemplate);
                            break;
                        case 'text':
                            objectStore.createNewObject(templater.textTemplate);
                            break;
                        case 'collada':
                            templater.colladaTemplate.path = $scope.selectedModel.path;
                            objectStore.createNewObject(templater.colladaTemplate);
                            break;
                    }
                };

                // watch for the model list arriving
                $scope.$watch(function () {
                    return $scope.modelList;
                },
                        function () {
                            $scope.selectedModel = $scope.modelList[0];
                        }
                );
            }])
        .controller('StatsController', ['$scope', '$element',
            function ($scope, $element) {
                $scope.stats = new Stats();
                $element.append($scope.stats.domElement);
            }])
        .controller('EditPanelAccordionController', ['$scope',
            function ($scope) {
                $scope.onlyOneOpen = true;
                $scope.openTop = true;
//                $scope.groups = [
//                    {
//                        title: 'Geometry',
//                        content: 'Geometry Stuff'
//                    },
//                    {
//                        title: 'Extremes',
//                        content: 'Extreme Stuff'
//                    }
//                ];
            }]);


