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

                        var _canContinueForward = function (lastX, lastZ) {

                            var minAllowed = 1.0;

                            var camPositionVector = camera.position.clone();

                            var xPosRaycastDirection = new THREE.Vector3(1, 0, 0);
                            var xNegRaycastDirection = new THREE.Vector3(-1, 0, 0);
                            var zPosRaycastDirection = new THREE.Vector3(0, 0, 1);
                            var zNegRaycastDirection = new THREE.Vector3(0, 0, -1);

                            var xPosSmallestDistance = 2;
                            var xNegSmallestDistance = 2;
                            var zPosSmallestDistance = 2;
                            var zNegSmallestDistance = 2;

                            var xPosRaycaster = new THREE.Raycaster(camPositionVector, xPosRaycastDirection);
                            var xNegRaycaster = new THREE.Raycaster(camPositionVector, xNegRaycastDirection);
                            var zPosRaycaster = new THREE.Raycaster(camPositionVector, zPosRaycastDirection);
                            var zNegRaycaster = new THREE.Raycaster(camPositionVector, zNegRaycastDirection);

                            var xPosIntersects = xPosRaycaster.intersectObjects(threeScene.scene.children);
                            var xNegIntersects = xNegRaycaster.intersectObjects(threeScene.scene.children);
                            var zPosIntersects = zPosRaycaster.intersectObjects(threeScene.scene.children);
                            var zNegIntersects = zNegRaycaster.intersectObjects(threeScene.scene.children);

                            if (xPosIntersects.length > 0) {
                                xPosSmallestDistance = xPosIntersects[0].distance;
                                for (var i = 0; i < xPosIntersects.length; i++) {
                                    if (xPosIntersects[i].distance < xPosSmallestDistance) {
                                        xPosSmallestDistance = xPosIntersects[i].distance;
                                    }
                                }
                            }

                            if (xNegIntersects.length > 0) {
                                xNegSmallestDistance = xNegIntersects[0].distance;
                                for (var i = 0; i < xNegIntersects.length; i++) {
                                    if (xNegIntersects[i].distance < xNegSmallestDistance) {
                                        xNegSmallestDistance = xNegIntersects[i].distance;
                                    }
                                }
                            }

                            if (zPosIntersects.length > 0) {
                                zPosSmallestDistance = zPosIntersects[0].distance;
                                for (var i = 0; i < zPosIntersects.length; i++) {
                                    if (zPosIntersects[i].distance < zPosSmallestDistance) {
                                        zPosSmallestDistance = zPosIntersects[i].distance;
                                    }
                                }
                            }

                            if (zNegIntersects.length > 0) {
                                zNegSmallestDistance = zNegIntersects[0].distance;
                                for (var i = 0; i < zNegIntersects.length; i++) {
                                    if (zNegIntersects[i].distance < zNegSmallestDistance) {
                                        zNegSmallestDistance = zNegIntersects[i].distance;
                                    }
                                }
                            }

                            if (xPosSmallestDistance < minAllowed) {
                                console.log(xPosSmallestDistance);
                                camera.position.x = lastX;
                            }

                            if (xNegSmallestDistance < minAllowed) {
                                console.log(xNegSmallestDistance);
                                camera.position.x = lastX;
                            }

                            if (zPosSmallestDistance < minAllowed) {
                                console.log(zPosSmallestDistance);
                                camera.position.z = lastZ;
                            }

                            if (zNegSmallestDistance < minAllowed) {
                                console.log(zNegSmallestDistance);
                                camera.position.z = lastZ;
                            }
                            ;
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
                            let lastX = camera.position.x;
                            let lastZ = camera.position.z;

                            let forwardSpeed = !actions.moveForwardFast ? constants.USER_MOVE_SPEED : constants.USER_MOVE_FAST_SPEED;

                            camera.position.z -= Math.cos(camera.rotation.y) * forwardSpeed;
                            camera.position.x -= Math.sin(camera.rotation.y) * forwardSpeed;

                            _canContinueForward(lastX, lastZ);

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