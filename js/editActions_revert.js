'use strict';

angular.module('ng-clockwork.editActions', [])
        .factory('objectEditor', ['constants', 'degreeSync', function (constants, degreeSync) {
                return {
                    constants: constants,
                    update: function (threeScene, actions) {
                        var camera = threeScene.camera;
                        var currentSelected = threeScene.selectedObject;
                        var constants = this.constants;
                        var count = 0;
                        var arrow1;
                        var arrow2;
                        var arrow3;

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

                            // THE POINT OF ALL OF THIS IS WE WANT TO CHECK
                            // COLLISIONS USING THE DIRECTION WE JUST MOVED IN
                            // ANY DIRECTION AND THEN MAKE CORRECTIONS BASED ON
                            // COLLISIONS - WHY? - BECAUSE THIS MEANS WE GET TO
                            // KEEP ANY VALID CHANGES AND DISCARD COLLISIONS
                            // (SLIDING)


                            // USE CURRENT CAMERA TO GET DIRECTION - THE PREVIOUS
                            // WAS TO GET THE HYPOTHETICAL DIRECTION - THE ACTUAL
                            // CAMERA STARTING POSITION IS GOOD AS IT IS
                            var camPositionVector = camera.position.clone();


                            // USE THE CURRENT PLAYER/CAMERA POSITION AND
                            // POTENTIAL POSITION TO CREATE POSITION VECTORS
                            var currentPositionVector = new THREE.Vector3(pos.currX, 0, pos.currZ);
                            var nextPositionVector = new THREE.Vector3(pos.nextX, 0, pos.nextZ);


                            var nextZVector = new THREE.Vector3(0, 0, pos.nextZ);
                            var nextXVector = new THREE.Vector3(pos.nextX, 0, 0);
                            var currZVector = new THREE.Vector3(0, 0, pos.currZ);
                            var currXVector = new THREE.Vector3(pos.currX, 0, 0);


                            // Make a direction Vector out of the before and
                            // after positions
                            var directionOfMotion = new THREE.Vector3();
                            directionOfMotion.subVectors(nextPositionVector, currentPositionVector);
                            directionOfMotion.normalize();


                            var directionOfZMotion = new THREE.Vector3();
                            directionOfZMotion.subVectors(nextZVector, currZVector);
                            directionOfZMotion.normalize();


                            var directionOfXMotion = new THREE.Vector3();
                            directionOfXMotion.subVectors(nextXVector, currXVector);
                            directionOfXMotion.normalize();

                            // START FOR THE HELPER ARROWS
                            // once the helperArrows are defined, remove them before redraw
                            if (threeScene.scene.arrow1 && threeScene.scene.arrow2 && threeScene.scene.arrow3) {
                                threeScene.scene.remove(threeScene.scene.arrow1);
                                threeScene.scene.remove(threeScene.scene.arrow2);
                                threeScene.scene.remove(threeScene.scene.arrow3);
                            }

                            // arrows start where the camera is now
                            var arrowPos = camera.position.clone();
                            // a little lower
                            arrowPos.y -= 0.15;
                            // draw the arrows
                            threeScene.scene.arrow1 = new THREE.ArrowHelper(directionOfMotion, arrowPos, 5, 0x00ff00);
                            threeScene.scene.arrow2 = new THREE.ArrowHelper(directionOfZMotion, arrowPos, 5, 0xff0000);
                            threeScene.scene.arrow3 = new THREE.ArrowHelper(directionOfXMotion, arrowPos, 5, 0x0000ff);

                            threeScene.scene.add(threeScene.scene.arrow1);
                            threeScene.scene.add(threeScene.scene.arrow2);
                            threeScene.scene.add(threeScene.scene.arrow3);
                            // END FOR THE HELPER ARROWS



                            // WILL NEED 5 OF THESE
                            var forwardRaycaster = new THREE.Raycaster(camPositionVector, directionOfMotion);
                            var forwardIntersects = forwardRaycaster.intersectObjects(threeScene.pickerObjects);

                            var zRaycaster = new THREE.Raycaster(camPositionVector, directionOfZMotion);
                            var zIntersects = zRaycaster.intersectObjects(threeScene.pickerObjects);

                            var xRaycaster = new THREE.Raycaster(camPositionVector, directionOfXMotion);
                            var xIntersects = xRaycaster.intersectObjects(threeScene.pickerObjects);

                            var smallestDistance = 4;
                            let lastIntersect;
                            var minAllowedDistance = 1.0;

                            var forwardSpeeds = {
                                x: constants.USER_MOVE_SPEED,
                                z: constants.USER_MOVE_SPEED
                            };


                            if (forwardIntersects.length > 0 && forwardIntersects[0].distance < minAllowedDistance) {
                                // distance camera is about to move
                                let dXMove = pos.currX - pos.nextX;
                                
                                let xDif = forwardIntersects[0].point.x - pos.currX;
                                let zDif = forwardIntersects[0].point.z - pos.currZ;

                                let tooCloseBy = minAllowedDistance - forwardIntersects[0].distance;
                                
                                // we've moved too far, need to determine how much too far
                                let allowedMoveSpeed = pos.forwardSpeed - tooCloseBy;
                            }
                            if (zIntersects.length > 0 && zIntersects[0].distance < minAllowedDistance) {
                                //console.log('z ' + zIntersects[0].distance);
                            }
                            if (xIntersects.length > 0 && xIntersects[0].distance < minAllowedDistance) {
                                //console.log('x ' + xIntersects[0].distance);
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

                            pos.forwardSpeedX = !actions.moveForwardFast ? constants.USER_MOVE_SPEED : constants.USER_MOVE_FAST_SPEED;
                            pos.forwardSpeedZ = !actions.moveForwardFast ? constants.USER_MOVE_SPEED : constants.USER_MOVE_FAST_SPEED;

                            pos.nextX = camera.position.x - (Math.sin(camera.rotation.y) * pos.forwardSpeedX);
                            pos.nextZ = camera.position.z - (Math.cos(camera.rotation.y) * pos.forwardSpeedZ);
                            
                            _canContinueForward(pos);

                            pos.changeX = (Math.sin(camera.rotation.y) * pos.forwardSpeedX);
                            pos.changeZ = (Math.cos(camera.rotation.y) * pos.forwardSpeedZ);

                            camera.position.x -= pos.changeX;//= pos.nextX;//-= Math.cos(camera.rotation.y) * forwardSpeed;
                            camera.position.z -= pos.changeZ;//= pos.nextZ;//-= Math.sin(camera.rotation.y) * forwardSpeed;
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