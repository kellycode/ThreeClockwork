'use strict';

/* Controllers */
angular.module('ngClockworkApp.controllers', [])
        .controller('ClockworkController', ['$scope', '$rootScope', 'threeScene', 'editEvents',
            function ($scope, $rootScope, threeScene, editEvents) {

                $scope.handleWindowResize = function () {
                    if (threeScene.ready) {
                        threeScene.camera.aspect = window.innerWidth / window.innerHeight;
                        threeScene.camera.updateProjectionMatrix();
                        threeScene.renderer.setSize(window.innerWidth, window.innerHeight);
                    }
                };
            }])
        .controller('SceneController', ['$scope', 'dataService', '$element', 'editEvents', 'objectEditor', 'objectStore', 'threeScene', 'cannonPhysics', 'boxFactory', 'bulletFactory',
            function ($scope, dataService, $element, editEvents, objectEditor, objectStore, threeScene, cannonPhysics, boxFactory, bulletFactory) {

                let time = Date.now();
                let dt = 1 / 60;
                let areActive = true;

                cannonPhysics.initPhysics();

                let loadGround = false;
                threeScene.initScene($element, loadGround);

                let loadFromFile = true;

                dataService.loadSceneJSON("./json/scene1.json?v=12", loadFromFile).then(function (response) {
                    if (!response) {
                        console.error('File load error 1.  File could not be found. Error: ' + response.status);
                    }
                    else {
                        threeScene.sceneData = loadFromFile ? response.data : response;
                        objectStore.loadScene(threeScene, cannonPhysics);
                        threeScene.ready = true;
                        //$scope.animate();
                        //dataService.saveScene(threeScene);
                        animate();
                    }
                });

                //boxFactory.initBoxes();
                bulletFactory.initBullets();

                let updateSceneObjects = function () {

                    let toUpdate = threeScene.pickerObjects;

                    for (var i = 0; i < toUpdate.length; i++) {
                        if (toUpdate[i].userData.boxBody) {
                            let body = toUpdate[i].userData.boxBody;
                            toUpdate[i].position.copy(body.position);
                            toUpdate[i].quaternion.copy(body.quaternion);
                        }
                    }

                };

                function animate() {
                    requestAnimationFrame(animate);
                    if (areActive) {

                        updateSceneObjects();

                        cannonPhysics.world.step(dt);

                        boxFactory.update();

                        bulletFactory.update();

                        threeScene.controls.update(Date.now() - time);
                        threeScene.renderer.render(threeScene.scene, threeScene.camera);
                        time = Date.now();
                    }
                }

                window.addEventListener("click", function (e) {
                    
                    //objectStore.objectSelect(e, threeScene);
                    bulletFactory.addBullet();
                });


            }]);


