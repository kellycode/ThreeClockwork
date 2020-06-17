'use strict';

angular.module('ng-clockwork.editActions', [])
        .factory('objectEditor', ['constants', 'degreeSync', function (constants, degreeSync) {
                return {
                    constants: constants,
                    update: function (threeScene, actions) {
                        var camera = threeScene.camera;
                        var currentSelected = threeScene.selectedObject;
                        var constants = this.constants;

                        var _resetObjectRotations = function () {
                            currentSelected.degrees.x = 0;
                            currentSelected.degrees.y = 0;
                            currentSelected.degrees.z = 0;
                            degreeSync.updateRotation(currentSelected);
                        };

                        // POSITIONS
                        var _floatAdd = function (toMod, change) {
                            var toModInt = parseInt(toMod * 1000);
                            var changeInt = parseInt(change * 1000);
                            return (toModInt + changeInt) / 1000;
                        };

                        var _posSelectedX = function (change) {
                            currentSelected.position.x = _floatAdd(currentSelected.position.x, change);
                        };

                        var _posSelectedY = function (change) {
                            currentSelected.position.y = _floatAdd(currentSelected.position.y, change);
                        };

                        var _posSelectedZ = function (change) {
                            currentSelected.position.z = _floatAdd(currentSelected.position.z, change);
                        };

                        var _rotSelectedX = function (change) {
                            currentSelected.degrees.x = degreeSync.safeChange(currentSelected.degrees.x, change);
                            degreeSync.updateRotation(currentSelected);
                        };

                        var _rotSelectedY = function (change) {
                            currentSelected.degrees.y = degreeSync.safeChange(currentSelected.degrees.y, change);
                            degreeSync.updateRotation(currentSelected);
                        };

                        var _rotSelectedZ = function (change) {
                            currentSelected.degrees.z = degreeSync.safeChange(currentSelected.degrees.z, change);
                            degreeSync.updateRotation(currentSelected);
                        };

                        // MOVE BY CURRENT DIRECTION CAMERA IS FACING
                        var _getDirectionAndMove = function () {
                            var objectMoveSpeed = constants.OBJECT_MOVE_SPEED;
                            var camRY = camera.rotation.y;

                            if (camRY > constants.TWO_PI) {
                                camRY = camRY % constants.TWO_PI;
                            }
                            else if (camRY < 0) {
                                camRY = -(Math.abs(camRY) % constants.TWO_PI);
                                camRY += constants.TWO_PI;
                            }

                            if (actions.moveObjectBack || actions.moveObjectRight) {
                                objectMoveSpeed = -objectMoveSpeed;
                            }

                            if (actions.moveObjectForward || actions.moveObjectBack) {
                                if ((camRY > (1.75 * Math.PI)) || (camRY < (.25 * Math.PI)))
                                {
                                    _posSelectedZ(-objectMoveSpeed);
                                }
                                else if ((camRY > (.25 * Math.PI)) && (camRY < (.75 * Math.PI)))
                                {
                                    _posSelectedX(-objectMoveSpeed);
                                }
                                else if ((camRY > (.75 * Math.PI)) && (camRY < (1.25 * Math.PI)))
                                {
                                    _posSelectedZ(objectMoveSpeed);
                                }
                                else if ((camRY > (1.25 * Math.PI)) && (camRY < (1.75 * Math.PI)))
                                {
                                    _posSelectedX(objectMoveSpeed);
                                }
                            }

                            if (actions.moveObjectLeft || actions.moveObjectRight) {
                                if ((camRY > (1.75 * Math.PI)) || (camRY < (.25 * Math.PI)))
                                {
                                    _posSelectedX(-objectMoveSpeed);
                                }
                                else if ((camRY > (.25 * Math.PI)) && (camRY < (.75 * Math.PI)))
                                {
                                    _posSelectedZ(objectMoveSpeed);
                                }
                                else if ((camRY > (.75 * Math.PI)) && (camRY < (1.25 * Math.PI)))
                                {
                                    _posSelectedX(objectMoveSpeed);
                                }
                                else if ((camRY > (1.25 * Math.PI)) && (camRY < (1.75 * Math.PI)))
                                {
                                    _posSelectedZ(-objectMoveSpeed);
                                }
                            }
                        };

                        var _checkCollision = function () {

                            var vector = camera.position;

                            var raycaster = new THREE.Raycaster(vector, camera.getWorldDirection());

                            var intersects = raycaster.intersectObjects(threeScene.scene.children);

                            if (intersects.length > 0) {
                                for (var i = 0; i < intersects.length; i++) {
                                    console.log(intersects[i].distance);
                                }
                            }
                        };


                        // perform requested actions
                        if (actions.resetObjectRotations) {
                            if (currentSelected) {
                                _resetObjectRotations();
                                actions.resetObjectRotations = false;
                            }
                        }

                        if (actions.rollXLess) {
                            if (currentSelected) {
                                _rotSelectedX(-constants.OBJECT_ROTATE_DEGREES);
                                actions.rollXLess = false;
                            }
                        }
                        if (actions.rollXMore) {
                            if (currentSelected) {
                                _rotSelectedX(constants.OBJECT_ROTATE_DEGREES);
                                actions.rollXMore = false;
                            }
                        }

                        if (actions.rollYLess) {
                            if (currentSelected) {
                                _rotSelectedY(-constants.OBJECT_ROTATE_DEGREES);
                                actions.rollYLess = false;
                            }
                        }
                        if (actions.rollYMore) {
                            if (currentSelected) {
                                _rotSelectedY(constants.OBJECT_ROTATE_DEGREES);
                                actions.rollYMore = false;
                            }
                        }

                        if (actions.rollZLess) {
                            if (currentSelected) {
                                _rotSelectedZ(-constants.OBJECT_ROTATE_DEGREES);
                                actions.rollZLess = false;
                            }
                        }
                        if (actions.rollZMore) {
                            if (currentSelected) {
                                _rotSelectedZ(constants.OBJECT_ROTATE_DEGREES);
                                actions.rollZMore = false;
                            }
                        }

                        // Camera rotation
                        if (actions.turnLeft) {
                            camera.rotation.y += constants.USER_TURN_SPEED;
                            camera.degrees.y = camera.rotation.y * (180 / Math.PI);
                        }
                        if (actions.turnRight) {
                            camera.rotation.y -= constants.USER_TURN_SPEED;
                            camera.degrees.y = camera.rotation.y * (180 / Math.PI);
                        }

                        if (actions.lookingUp) {
                            if (camera.rotation.x < 0.45) {
                                camera.rotation.x += constants.USER_LOOK_SPEED;
                            }
                            camera.degrees.x = 0;//camera.rotation.x * (180 / Math.PI);
                        }
                        if (actions.lookingDown) {
                            if (camera.rotation.x > -0.45) {
                                camera.rotation.x -= constants.USER_LOOK_SPEED;
                            }
                            camera.degrees.x = 0;//camera.rotation.x * (180 / Math.PI);
                        }

                        if (actions.moveDown) {
                            if (currentSelected) {
                                _posSelectedY(-constants.OBJECT_MOVE_SPEED);
                                actions.moveDown = false;
                            }
                            else {

                                camera.position.y -= constants.USER_MOVE_SPEED;
                            }
                        }
                        if (actions.moveUp) {
                            if (currentSelected) {
                                _posSelectedY(constants.OBJECT_MOVE_SPEED);
                                actions.moveUp = false;
                            }
                            else {
                                camera.position.y += constants.USER_MOVE_SPEED;
                            }
                        }

                        if (actions.moveForward) {
                            _checkCollision();
                            let forwardSpeed = !actions.moveForwardFast ? constants.USER_MOVE_SPEED : constants.USER_MOVE_FAST_SPEED;
                            camera.position.z -= Math.cos(camera.rotation.y) * forwardSpeed;
                            camera.position.x -= Math.sin(camera.rotation.y) * forwardSpeed;
                        }
                        if (actions.moveObjectForward) {
                            if (currentSelected) {
                                _getDirectionAndMove();
                                actions.moveObjectForward = false;
                            }
                        }

                        if (actions.moveBack) {
                            camera.position.z += Math.cos(camera.rotation.y) * constants.USER_MOVE_SPEED;
                            camera.position.x += Math.sin(camera.rotation.y) * constants.USER_MOVE_SPEED;
                        }
                        if (actions.moveObjectBack) {
                            if (currentSelected) {
                                _getDirectionAndMove();
                                actions.moveObjectBack = false;
                            }
                        }

                        if (actions.strafeLeft) {
                            camera.position.z += Math.cos(camera.rotation.y - Math.PI / 2) * constants.USER_MOVE_SPEED;
                            camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * constants.USER_MOVE_SPEED;
                        }
                        if (actions.strafeRight) {
                            camera.position.z -= Math.cos(camera.rotation.y - Math.PI / 2) * constants.USER_MOVE_SPEED;
                            camera.position.x -= Math.sin(camera.rotation.y - Math.PI / 2) * constants.USER_MOVE_SPEED;
                        }

                        if (actions.moveObjectLeft) {
                            if (currentSelected) {
                                _getDirectionAndMove();
                                actions.moveObjectLeft = false;
                            }
                        }
                        if (actions.moveObjectRight) {
                            if (currentSelected) {
                                _getDirectionAndMove();
                                actions.moveObjectRight = false;
                            }
                        }

                    }
                };
            }]);