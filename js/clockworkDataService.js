'use strict';
angular.module('clockworkApp.clockworkDataService', [])
        .factory('dataService', ['$http', 'templater', function ($http, templater) {
                return {
                    loadSceneJSON: function (sceneUrl, loadFromFile) {
                        if (loadFromFile) {
                            var promise = $http.get(sceneUrl).then(
                                    function (response) {
                                        return response;
                                    },
                                    function (response) {
                                        console.error('Server returned an error or scene data file load: ' + response.status);
                                        return response.status;
                                    });
                            return promise;
                        }
                        else {
                            return Promise.resolve().then(function () {
                                return JSON.parse(localStorage.getItem('scene_save'));
                            });
                        }
                    },
                    downloadScene: function (content, fileName, contentType) {
                        var a = document.createElement("a");
                        var file = new Blob([content], {type: contentType});
                        a.href = URL.createObjectURL(file);
                        a.download = fileName;
                        a.click();
                        console.log("Processing JSON Data Complete");
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
                    saveSceneJSON: function (scene_json) {
                        localStorage.setItem('scene_save', scene_json);
                    },
                    saveScene: function (threeScene) {
                        let json = threeScene.scene.toJSON();
                        var templateArray = [];


                        /*
                         var children = threeScene.pickerObjects;
                         for (var i = 0; i < children.length; i++) {
                         //console.log(children[i].userData.template.type)
                         templater.updateTemplateMovements(children[i]);
                         templateArray.push(children[i].userData.template);
                         }
                         */
                        
                        
                        this.saveSceneJSON(JSON.stringify(json));
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