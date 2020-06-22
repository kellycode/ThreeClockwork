'use strict';

angular.module('ng-clockwork.editActions', [])
        .factory('objectEditor', ['constants', 'degreeSync', function (constants, degreeSync) {
                return {
                    constants: constants,
                    update: function (threeScene, actions) {
                        var camera = threeScene.camera;
                        var currentSelected = threeScene.selectedObject;
                        var constants = this.constants;;

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

                        let _canContinueForward = function (pos) {

                            // hard wired new vectors
                            let currentPositionVector = new THREE.Vector3(pos.currX, 0, pos.currZ);
                            let nextPositionVector = new THREE.Vector3(pos.nextX, 0, pos.nextZ);

                            // use those to make a direction vector
                            let directionOfMotion = new THREE.Vector3();
                            directionOfMotion.subVectors(nextPositionVector, currentPositionVector);
                            directionOfMotion.normalize();

                            let leftOfMotion = directionOfMotion.clone();
                            let lom_axis = new THREE.Vector3(0, 1, 0);
                            let lom_angle = 2 * (Math.PI / 180);
                            leftOfMotion.applyAxisAngle(lom_axis, lom_angle);

                            let rightOfMotion = directionOfMotion.clone();
                            let rom_axis = new THREE.Vector3(0, 1, 0);
                            let rom_angle = -2 * (Math.PI / 180);
                            rightOfMotion.applyAxisAngle(rom_axis, rom_angle);


                            if (false) {
                                // START FOR THE HELPER ARROWS
                                if (threeScene.scene.mArrow) {
                                    threeScene.scene.remove(threeScene.scene.mArrow);
                                }
                                // arrows start where the camera is now
                                let arrowPos = camera.position.clone();
                                // a little lower
                                arrowPos.y -= 0.15;
                                // draw the arrows
                                threeScene.scene.mArrow = new THREE.ArrowHelper(directionOfMotion, arrowPos, 5, 0x00ff00);
                                // add to the scene
                                threeScene.scene.add(threeScene.scene.mArrow);
                                // END FOR THE HELPER ARROWS
                            }

                            let forwardRaycaster = new THREE.Raycaster(currentPositionVector, directionOfMotion, 0, 2.0);
                            let forwardIntersects = forwardRaycaster.intersectObjects(threeScene.pickerObjects);

                            let leftRaycaster = new THREE.Raycaster(currentPositionVector, leftOfMotion, 0, 2.0);
                            let leftIntersects = leftRaycaster.intersectObjects(threeScene.pickerObjects);

                            let rightRaycaster = new THREE.Raycaster(currentPositionVector, rightOfMotion, 0, 2.0);
                            let rightIntersects = rightRaycaster.intersectObjects(threeScene.pickerObjects);

                            let minAllowedDistance = 1.0;
                            
                            let adjustForwardMotion = function() {
                                
                            };

                            if (forwardIntersects.length > 0 && forwardIntersects[0].distance < minAllowedDistance) {

                                let lookAngle;

                                if (leftIntersects.length > 0 && rightIntersects.length > 0) {
                                    
                                    if (rightIntersects[0].distance > forwardIntersects[0].distance && leftIntersects[0].distance < forwardIntersects[0].distance) {
                                        
                                        console.log('looking right');

                                        lookAngle = rightIntersects[0].point.angleTo(forwardIntersects[0].point);

                                        let dom = new THREE.Vector3();
                                        dom.subVectors(rightIntersects[0].point, forwardIntersects[0].point);
                                        dom.normalize();

                                        if (false) {
                                            if (threeScene.scene.jrArrow) {
                                                threeScene.scene.remove(threeScene.scene.jrArrow);
                                            }
                                            threeScene.scene.jrArrow = new THREE.ArrowHelper(dom, forwardIntersects[0].point, 5, 0xffff00);
                                            threeScene.scene.add(threeScene.scene.jrArrow);
                                        }

                                        console.log(dom.x + ' ; ' + dom.z);

                                        pos.changeX = pos.forwardSpeed * dom.x;
                                        pos.changeZ = pos.forwardSpeed * dom.z;

                                    } else if (leftIntersects[0].distance > forwardIntersects[0].distance && rightIntersects[0].distance < forwardIntersects[0].distance) {
                                        console.log('looking left');

                                        lookAngle = leftIntersects[0].point.angleTo(forwardIntersects[0].point);

                                        let dom = new THREE.Vector3();
                                        dom.subVectors(leftIntersects[0].point, forwardIntersects[0].point);
                                        dom.normalize();

                                        if (false) {
                                            if (threeScene.scene.jrArrow) {
                                                threeScene.scene.remove(threeScene.scene.jrArrow);
                                            }
                                            threeScene.scene.jrArrow = new THREE.ArrowHelper(dom, forwardIntersects[0].point, 5, 0xffff00);
                                            threeScene.scene.add(threeScene.scene.jrArrow);
                                        }

                                        console.log(dom.x + ' ; ' + dom.z);

                                        pos.changeX = pos.forwardSpeed * dom.x;
                                        pos.changeZ = pos.forwardSpeed * dom.z;
                                    } else {
                                        console.log('In a corner');
                                        
                                        pos.changeX = 0;
                                        pos.changeZ = 0;
                                    }
                                    console.log(lookAngle);
                                    
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

                            pos.nextX = camera.position.x - (Math.sin(camera.rotation.y) * pos.forwardSpeed);
                            pos.nextZ = camera.position.z - (Math.cos(camera.rotation.y) * pos.forwardSpeed);

                            pos.dom = camera.rotation.y;

                            pos.changeX = -(Math.sin(pos.dom) * pos.forwardSpeed);
                            pos.changeZ = -(Math.cos(pos.dom) * pos.forwardSpeed);

                            _canContinueForward(pos);

                            if (true) {
                                camera.position.x += pos.changeX;//= pos.nextX;//-= Math.cos(camera.rotation.y) * forwardSpeed;
                                camera.position.z += pos.changeZ;//= pos.nextZ;//-= Math.sin(camera.rotation.y) * forwardSpeed;
                            }

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