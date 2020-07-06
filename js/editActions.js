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

                        var _canContinueForward = function (pos) {

                            var camPositionVector = camera.position.clone();

                            // hard wired new vectors
                            // currentPositionVector = camPositionVector
                            var currentPositionVector = new THREE.Vector3(pos.currX, 0, pos.currZ);
                            var nextPositionVector = new THREE.Vector3(pos.nextX, 0, pos.nextZ);

                            // always at right angles to where we are
                            var nextZVector = new THREE.Vector3(0, 0, pos.nextZ);
                            var nextXVector = new THREE.Vector3(pos.nextX, 0, 0);
                            var currZVector = new THREE.Vector3(0, 0, pos.currZ);
                            var currXVector = new THREE.Vector3(pos.currX, 0, 0);

                            // CURRENT MOTION AND LEFT AND RIGHT OFFSETS
                            var directionOfMotion = new THREE.Vector3();
                            directionOfMotion.subVectors(nextPositionVector, currentPositionVector);
                            directionOfMotion.normalize();
                            // left
                            var leftOfMotion = directionOfMotion.clone();
                            var lom_axis = new THREE.Vector3(0, 1, 0);
                            var lom_angle = 2 * (Math.PI / 180);
                            leftOfMotion.applyAxisAngle(lom_axis, lom_angle);
                            // right
                            var rightOfMotion = directionOfMotion.clone();
                            var rom_axis = new THREE.Vector3(0, 1, 0);
                            var rom_angle = -2 * (Math.PI / 180);
                            rightOfMotion.applyAxisAngle(rom_axis, rom_angle);


                            // UTILITY X AND Z DIRECTION VECTORS
                            var directionOfZMotion = new THREE.Vector3();
                            directionOfZMotion.subVectors(nextZVector, currZVector);
                            directionOfZMotion.normalize();

                            var directionOfXMotion = new THREE.Vector3();
                            directionOfXMotion.subVectors(nextXVector, currXVector);
                            directionOfXMotion.normalize();


                            if (false) {
                                // START FOR THE HELPER ARROWS
                                // remove before redraw
                                if (threeScene.scene.mArrow) {
                                    threeScene.scene.remove(threeScene.scene.mArrow);
                                    threeScene.scene.remove(threeScene.scene.zArrow);
                                    threeScene.scene.remove(threeScene.scene.xArrow);
                                }
                                // arrows start where the camera is now
                                var arrowPos = camera.position.clone();
                                // a little lower
                                arrowPos.y -= 0.15;
                                // draw the arrows
                                threeScene.scene.mArrow = new THREE.ArrowHelper(directionOfMotion, arrowPos, 5, 0x00ff00);
                                threeScene.scene.zArrow = new THREE.ArrowHelper(leftOfMotion, arrowPos, 5, 0xff0000);
                                threeScene.scene.xArrow = new THREE.ArrowHelper(rightOfMotion, arrowPos, 5, 0x0000ff);
                                // add to the scene
                                threeScene.scene.add(threeScene.scene.mArrow);
                                threeScene.scene.add(threeScene.scene.zArrow);
                                threeScene.scene.add(threeScene.scene.xArrow);
                                // END FOR THE HELPER ARROWS
                            }

                            // WILL NEED 5 OF THESE
                            var forwardRaycaster = new THREE.Raycaster(camPositionVector, directionOfMotion, 0, 2.0);
                            var forwardIntersects = forwardRaycaster.intersectObjects(threeScene.pickerObjects);

                            var leftRaycaster = new THREE.Raycaster(camPositionVector, leftOfMotion, 0, 2.0);
                            var leftIntersects = leftRaycaster.intersectObjects(threeScene.pickerObjects);

                            var rightRaycaster = new THREE.Raycaster(camPositionVector, rightOfMotion, 0, 2.0);
                            var rightIntersects = rightRaycaster.intersectObjects(threeScene.pickerObjects);


                            var minAllowedDistance = 1.0;

                            let adjustForwardMotion = function (offsetIntersectPoint, mainIntersectPoint) {
                                // adjust direction based on the wall
                                let dom = new THREE.Vector3();
                                dom.subVectors(offsetIntersectPoint, mainIntersectPoint);
                                dom.normalize();

                                pos.changeX = pos.forwardSpeed * dom.x;
                                pos.changeZ = pos.forwardSpeed * dom.z;
                            };

                            if (forwardIntersects.length > 0 && forwardIntersects[0].distance < minAllowedDistance) {
                                if (leftIntersects.length > 0 && rightIntersects.length > 0) {
                                    if (rightIntersects[0].distance > forwardIntersects[0].distance && leftIntersects[0].distance < forwardIntersects[0].distance) {
                                        // sliding right
                                        adjustForwardMotion(rightIntersects[0].point, forwardIntersects[0].point);
                                    }
                                    else if (leftIntersects[0].distance > forwardIntersects[0].distance && rightIntersects[0].distance < forwardIntersects[0].distance) {
                                        // sliding left
                                        adjustForwardMotion(leftIntersects[0].point, forwardIntersects[0].point);
                                    }
                                    else {
                                        // in a corner, just stop
                                        pos.changeX = 0;
                                        pos.changeZ = 0;
                                    }
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
                            let pos = {};

                            pos.currX = camera.position.x;
                            pos.currZ = camera.position.z;

                            pos.forwardSpeed = !actions.moveForwardFast ? constants.USER_MOVE_SPEED : constants.USER_MOVE_FAST_SPEED;

                            // get the potential next position x and z
                            pos.nextX = camera.position.x - (Math.sin(camera.rotation.y) * pos.forwardSpeed);
                            pos.nextZ = camera.position.z - (Math.cos(camera.rotation.y) * pos.forwardSpeed);

                            // camera direction of motion
                            pos.dom = camera.rotation.y;

                            // get the relative changes in position
                            pos.changeX = -(Math.sin(pos.dom) * pos.forwardSpeed);
                            pos.changeZ = -(Math.cos(pos.dom) * pos.forwardSpeed);

                            // check for a collision and modify movement if needed
                            _canContinueForward(pos);

                            // ok, apply the move
                            camera.position.x += pos.changeX;
                            camera.position.z += pos.changeZ;

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