'use strict';
angular.module('ng-clockwork.services', [])
        .factory('dataService', ['$http', '$httpParamSerializerJQLike', 'templater', function ($http, $httpParamSerializerJQLike, templater) {
                return {
                    loadSceneJSON: function (sceneUrl) {
// TODO scene load can come from a json file, a firebase db or localstorage
//                        var promise = $http.get(sceneUrl).then(
//                                function (response) {
//                                    return response;
//                                },
//                                function (response) {
//                                    console.error('Server returned an error or scene data file load: ' + response.status);
//                                    return response.status;
//                        });
//                        return promise;
                        
                        
                        // my original code was a php call so promise
                        return Promise.resolve().then(function () {
                            return JSON.parse(localStorage.getItem('scene_save'));
                        });
                    },
                    saveSceneJSON: function (scene_json) {
                        localStorage.setItem('scene_save', scene_json);
                    },
                    getAvailableTextures: function () {
                        var serviceUrl = "./textures/textureList.json";
                        var promise = $http.get(serviceUrl).then(
                                function (response) {
                                    return response;
                                },
                                function (response) {
                                    console.error('Server returned an error on texture fetch: ' + response.status);
                                    return response.status;
                                });
                        return promise;
                    },
                    getAvailableModels: function () {
                        var serviceUrl = "./models/modelList.json";
                        var promise = $http.get(serviceUrl).then(
                                function (response) {
                                    let values = Object.values(response.data);
                                    let modelArray = [];

                                    // arrange the data properly
                                    for (const key of values) {
                                        let url = key.split("/");
                                        let name = url[url.length - 1].split(".")[0];
                                        modelArray.push({'path': key, 'name': name});
                                    }
                                    
                                    return modelArray;
                                },
                                function (response) {
                                    console.error('Server returned an error on texture fetch: ' + response.status);
                                    return response.status;
                                });
                        return promise;
                    },
                    arrayRemoveIndex: function (array, index) {
                        var newArray = [];
                        for (var i = 0; i < array.length; i++) {
                            if (i !== index) {
                                newArray.push(array[i]);
                            }
                        }
                        return newArray;
                    },
                    saveScene: function (threeScene) {
                        var scene = threeScene.scene;
                        var templateArray = [];
                        var children = scene.children;
                        for (var i = 0; i < children.length; i++) {
                            //console.log(children[i])

                            templater.updateTemplateMovements(children[i]);
                            
                            if(scene.userData.background) {
                                templateArray.push(scene.userData.background);
                            }
                            
                            // handle clockwork specials
                            if (children[i].userData.template.type === 'ShaderSkybox') {
                                templater.updateShaderSkybox(children[i]);
                            }
                            else if (children[i].userData.template.type === 'SimpleSkybox') {
                                console.log('SimpleSkybox');
                            }
                            else if (children[i].userData.template.type === 'ClockworkGround') {
                                templater.updateMeshGeometry(children[i]);
                                templater.updateMeshTemplateMaterial(children[i]);
                                templater.updateMeshTemplateTexture(children[i]);
                            }
                            else {
                                if (children[i].type === 'Mesh') {
                                    templater.updateMeshGeometry(children[i]);
                                    templater.updateMeshTemplateMaterial(children[i]);
                                    templater.updateMeshTemplateTexture(children[i]);
                                }

                                if (children[i].type === 'PerspectiveCamera') {
                                    templater.updatePerspectiveCameraTemplate(children[i]);
                                }

                                if (children[i].type === 'AmbientLight') {
                                    templater.updateAmbientLightTemplate(children[i]);
                                }
                            }
                            templateArray.push(children[i].userData.template);
                        }

                        this.saveSceneJSON(JSON.stringify(templateArray));
                    },
                    jsonStringifyDebug: function (stringifiedObject) {
                        var cache = [];
                        var stringified = JSON.stringify(stringifiedObject, function (key, value) {
                            if (typeof value === 'object' && value !== null) {
                                if (cache.indexOf(value) !== -1) {
                                    // Circular reference found, discard key
                                    return;
                                }
                                // Store value in our collection
                                cache.push(value);
                            }
                            return value;
                        });
                        cache = null;
                        return stringified;
                    }
                };
            }]);