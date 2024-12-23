"use strict";

angular.module("clockworkApp.clockworkEditActions", []).factory("editActions", [
    "constants",
    "degreeSync",
    function (constants, degreeSync) {
        return {
            constants: constants,
            update: function (threeScene, actions) {
                var currentSelected = threeScene.selectedObject;
                var constants = this.constants;

                var syncObjectTemplate = function () {
                    currentSelected.userData.template.movements.degX = currentSelected.rotation.x * (180 / Math.PI);
                    currentSelected.userData.template.movements.degY = currentSelected.rotation.y * (180 / Math.PI);
                    currentSelected.userData.template.movements.degZ = currentSelected.rotation.z * (180 / Math.PI);

                    currentSelected.userData.template.movements.posX = currentSelected.position.x;
                    currentSelected.userData.template.movements.posY = currentSelected.position.y;
                    currentSelected.userData.template.movements.posZ = currentSelected.position.z;

                    currentSelected.userData.template.movements.scaX = currentSelected.scale.x;
                    currentSelected.userData.template.movements.scaY = currentSelected.scale.y;
                    currentSelected.userData.template.movements.scaZ = currentSelected.scale.z;
                };

                var _resetObjectRotations = function () {
                    currentSelected.degrees.x = 0;
                    currentSelected.degrees.y = 0;
                    currentSelected.degrees.z = 0;
                    degreeSync.updateRotation(currentSelected);
                    syncObjectTemplate();
                };

                // POSITIONS
                var _floatAdd = function (toMod, change) {
                    var toModInt = parseInt(toMod * 1000);
                    var changeInt = parseInt(change * 1000);
                    return (toModInt + changeInt) / 1000;
                };

                var _posSelectedX = function (change) {
                    //currentSelected.position.x = _floatAdd(currentSelected.position.x, change);
                    currentSelected.translateX(change);
                    syncObjectTemplate();
                };

                var _posSelectedY = function (change) {
                    //currentSelected.position.y = _floatAdd(currentSelected.position.y, change);
                    currentSelected.translateY(change);
                    syncObjectTemplate();
                };

                var _posSelectedZ = function (change) {
                    //currentSelected.position.z = _floatAdd(currentSelected.position.z, change);
                    currentSelected.translateZ(change);
                    syncObjectTemplate();
                };

                var _rotSelectedX = function (change) {
                    currentSelected.degrees.x = degreeSync.safeChange(currentSelected.degrees.x, change);
                    degreeSync.updateRotation(currentSelected);
                    syncObjectTemplate();
                };

                var _rotSelectedY = function (change) {
                    currentSelected.degrees.y = degreeSync.safeChange(currentSelected.degrees.y, change);
                    degreeSync.updateRotation(currentSelected);
                    syncObjectTemplate();
                };

                var _rotSelectedZ = function (change) {
                    currentSelected.degrees.z = degreeSync.safeChange(currentSelected.degrees.z, change);
                    degreeSync.updateRotation(currentSelected);
                };

                // MOVE BY CURRENT DIRECTION CAMERA IS FACING
                var _getDirectionAndMove = function () {
                    var objectMoveSpeed = constants.OBJECT_MOVE_SPEED;
                    // the camera is contained in cannon camera controller 
                    var camRY = threeScene.cannon_camera.rotation.y;

                    if (camRY > constants.TWO_PI) {
                        camRY = camRY % constants.TWO_PI;
                    } else if (camRY < 0) {
                        camRY = -(Math.abs(camRY) % constants.TWO_PI);
                        camRY += constants.TWO_PI;
                    }

                    if (actions.moveObjectBack || actions.moveObjectRight) {
                        objectMoveSpeed = -objectMoveSpeed;
                    }

                    if (actions.moveObjectForward || actions.moveObjectBack) {
                        if (camRY > 1.75 * Math.PI || camRY < 0.25 * Math.PI) {
                            _posSelectedZ(-objectMoveSpeed);
                        } else if (camRY > 0.25 * Math.PI && camRY < 0.75 * Math.PI) {
                            _posSelectedX(-objectMoveSpeed);
                        } else if (camRY > 0.75 * Math.PI && camRY < 1.25 * Math.PI) {
                            _posSelectedZ(objectMoveSpeed);
                        } else if (camRY > 1.25 * Math.PI && camRY < 1.75 * Math.PI) {
                            _posSelectedX(objectMoveSpeed);
                        }
                    }

                    if (actions.moveObjectLeft || actions.moveObjectRight) {
                        if (camRY > 1.75 * Math.PI || camRY < 0.25 * Math.PI) {
                            _posSelectedX(-objectMoveSpeed);
                        } else if (camRY > 0.25 * Math.PI && camRY < 0.75 * Math.PI) {
                            _posSelectedZ(objectMoveSpeed);
                        } else if (camRY > 0.75 * Math.PI && camRY < 1.25 * Math.PI) {
                            _posSelectedX(objectMoveSpeed);
                        } else if (camRY > 1.25 * Math.PI && camRY < 1.75 * Math.PI) {
                            _posSelectedZ(-objectMoveSpeed);
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
                if (actions.moveDown) {
                    if (currentSelected) {
                        _posSelectedY(-constants.OBJECT_MOVE_SPEED);
                        actions.moveDown = false;
                    }
                }
                if (actions.moveUp) {
                    if (currentSelected) {
                        _posSelectedY(constants.OBJECT_MOVE_SPEED);
                        actions.moveUp = false;
                    }
                }
                if (actions.moveObjectForward) {
                    if (currentSelected) {
                        _getDirectionAndMove();
                        actions.moveObjectForward = false;
                    }
                }
                if (actions.moveObjectBack) {
                    if (currentSelected) {
                        _getDirectionAndMove();
                        actions.moveObjectBack = false;
                    }
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
            },
        };
    },
]);
