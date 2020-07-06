'use strict';

angular.module('ng-clockwork.cannonControlsFactory', [])
        .factory('cannonControls', [function () {
                return {
                    velocityFactor: 0.9,
                    jumpVelocity: 20,
                    moveForward: false,
                    moveBackward: false,
                    moveLeft: false,
                    moveRight: false,
                    turnLeft: false,
                    turnRight: false,
                    lookDown: false,
                    lookUp: false,
                    shiftDown: false,

                    followMouse: false,

                    canJump: false,

                    isScrolling: false,

                    PI_2: Math.PI / 2,

                    contactNormal: null,
                    upAxis: null,

                    initControls: function (camera, sphereCannonBody) {
                        // camera is synced with these collision objects during update
                        this.pitchObject = new THREE.Object3D();
                        this.yawObject = new THREE.Object3D();
                        this.yawObject.add(this.pitchObject);
                        // start a little above ground
                        this.yawObject.position.y = 3;

                        this.quat = new THREE.Quaternion();

                        // Normal in the contact, pointing *out* of whatever the player touched
                        this.contactNormal = new CANNON.Vec3();
                        this.upAxis = new CANNON.Vec3(0, 1, 0);

                        let _this = this;

                        this.handleSphereCollide = function (e) {
                            let contact = e.contact;
                            // contact.bi and contact.bj are the colliding bodies,
                            // and contact.ni is the collision normal.
                            // We do not yet know which one is which! Let's check.
                            // bi is the player body, flip the contact normal
                            if (contact.bi.id === sphereCannonBody.id) {
                                contact.ni.negate(_this.contactNormal);
                            }
                            // bi is something else. Keep the normal as it is
                            else {
                                _this.contactNormal.copy(contact.ni);
                            }
                            // If contactNormal.dot(upAxis) is between 0 and 1,
                            // we know that the contact normal is somewhat in
                            // the up direction.
                            // Use a "good" threshold value between 0 and 1 here!
                            if (_this.contactNormal.dot(_this.upAxis) > 0.5) {
                                _this.canJump = true;
                            }
                        };

                        sphereCannonBody.addEventListener("collide", this.handleSphereCollide);
                        this.velocity = sphereCannonBody.velocity;

                        // makes scrolling work like key up/down
                        let watchScrolling = function (event) {
                            // Clear our timeout throughout the scroll
                            window.clearTimeout(_this.isScrolling);
                            // Set a timeout to run after scrolling ends
                            _this.isScrolling = setTimeout(function () {
                                // turn it off
                                _this.lookUp = _this.lookDown = false;
                            }, 66);
                        };

                        this.onMouseWheel = function (event) {
                            watchScrolling();
                            if (event.deltaY < 0)
                            {// looking and scrolling down
                                _this.lookDown = true;
                            }
                            else if (event.deltaY > 0)
                            {// looking and scrolling up
                                _this.lookUp = true;
                            }
                        };

                        this.onKeyDown = function (event) {
                            _this.shiftDown = event.shiftKey;
                            switch (event.keyCode) {
                                case 38: // up
                                case 87: // w
                                    _this.moveForward = true;
                                    break;

                                case 81: // left q
                                    _this.moveLeft = true;
                                    break;

                                case 40: // down
                                case 83: // s
                                    _this.moveBackward = true;
                                    break;

                                case 69: // right e
                                    _this.moveRight = true;
                                    break;

                                case 65: // A
                                    _this.turnLeft = true;
                                    break;

                                case 68: // D
                                    _this.turnRight = true;
                                    break;

                                case 32: // space
                                    if (_this.canJump === true) {
                                        _this.velocity.y = _this.jumpVelocity;
                                    }
                                    _this.canJump = false;
                                    break;
                            }
                        };

                        this.onKeyUp = function (event) {
                            _this.shiftDown = event.shiftKey;
                            switch (event.keyCode) {
                                case 38: // up
                                case 87: // w
                                    _this.moveForward = false;
                                    break;

                                case 81: // left q
                                    _this.moveLeft = false;
                                    break;

                                case 40: // down
                                case 83: // a
                                    _this.moveBackward = false;
                                    break;

                                case 69: // right e
                                    _this.moveRight = false;
                                    break;

                                case 65: // A
                                    _this.turnLeft = false;
                                    break;

                                case 68: // D
                                    _this.turnRight = false;
                                    break;
                            }
                        };

                        this.onMouseMove = function (event) {
                            let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                            let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

                            _this.yawObject.rotation.y -= movementX * 0.002;
                            _this.pitchObject.rotation.x -= movementY * 0.002;

                            _this.pitchObject.rotation.x = Math.max(-_this.PI_2, Math.min(_this.PI_2, _this.pitchObject.rotation.x));
                        };

                        this.onMouseButtonDown = function (event) {
                            // on scroll click, look center
                            if (event.button === 1) {
                                _this.pitchObject.rotation.x = 0.0;
                            }
                            else if (event.button === 2) {
                                window.addEventListener('mousemove', _this.onMouseMove);
                            }
                        };

                        this.onMouseButtonUp = function (event) {
                            if (event.button === 2) {
                                window.removeEventListener('mousemove', _this.onMouseMove);
                            }
                        };

                        document.addEventListener('mouseup', this.onMouseButtonUp, false);
                        // may use the wheel for something else
                        document.addEventListener('wheel', this.onMouseWheel, false);

                        this.getObject = function () {
                            return _this.yawObject;
                        };

                        this.getDirection = function (targetVec) {
                            targetVec.set(0, 0, -1);
                            _this.quat.multiplyVector3(targetVec);
                        };

                        let inputVelocity = new THREE.Vector3();
                        let euler = new THREE.Euler();

                        this.update = function (delta) {

                            delta = 1;//*= 0.1;

                            let shiftDiff = 1;

                            inputVelocity.set(0, 0, 0);

                            if (this.shiftDown) {
                                shiftDiff = 5;
                            }
                            else {
                                shiftDiff = 1;
                            }

                            if (this.moveForward) {
                                inputVelocity.z = - this.velocityFactor * shiftDiff * delta;
                            }
                            if (this.moveBackward) {
                                inputVelocity.z = this.velocityFactor * delta;
                            }

                            if (this.moveLeft) {
                                inputVelocity.x = -this.velocityFactor * delta;
                            }
                            if (this.moveRight) {
                                inputVelocity.x = this.velocityFactor * delta;
                            }

                            if (this.turnRight) {
                                this.yawObject.rotation.y -= 0.05;
                            }
                            if (this.turnLeft) {
                                this.yawObject.rotation.y += 0.05;
                            }

                            if (this.lookUp) {
                                if (this.pitchObject.rotation.x < 0.4) {
                                    this.pitchObject.rotation.x += 0.05;
                                }
                            }
                            if (this.lookDown) {
                                if (this.pitchObject.rotation.x > -0.4) {
                                    this.pitchObject.rotation.x -= 0.05;
                                }
                            }

                            // Convert velocity to world coordinates
                            euler.x = this.pitchObject.rotation.x;
                            euler.y = this.yawObject.rotation.y;
                            euler.order = "XYZ";
                            this.quat.setFromEuler(euler);
                            inputVelocity.applyQuaternion(this.quat);
                            //this.quat.multiplyVector3(inputVelocity);

                            // Add to the object
                            this.velocity.x += inputVelocity.x;
                            this.velocity.z += inputVelocity.z;

                            this.yawObject.position.copy(sphereCannonBody.position);
                            
                            camera.position.copy(this.yawObject.position);
                            //camera.rotation.y = this.yawObject.rotation.y;
                            //camera.rotation.x = this.pitchObject.rotation.x;
                            //this.camera.position
                           
                        };

                        return this;
                    }
                };
            }]);