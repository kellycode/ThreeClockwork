'use strict';

angular.module('ngClockworkApp.boxFactory', [])
        .factory('boxFactory', ['cannonPhysics', 'threeScene', function (cannonPhysics, threeScene) {
                return {
                    boxBodies: [],
                    boxMeshes: [],
                    g_play3Mesh: null,
                    g_playCnnBody: null,
                    moveX: 0.05,

                    update: function () {

                        // Update box positions
                        for (var i = 0; i < this.boxBodies.length; i++) {
                            this.boxMeshes[i].position.copy(this.boxBodies[i].position);
                            this.boxMeshes[i].quaternion.copy(this.boxBodies[i].quaternion);
                        }
                    },

                    initBoxes: function () {
                        // Add boxes
                        var scale = 3;
                        var halfExtents = new CANNON.Vec3(scale/2, scale/2, scale/2);
                        var boxShape = new CANNON.Box(halfExtents);
                        var mass = 10;
                        var boxGeometry = new THREE.BoxGeometry(scale, scale, scale);


                        for (var i = 0; i < 7; i++) {
                            var x = (Math.random() - 0.5) * 40;
                            var y = 1 + (Math.random() - 0.5) * 1;
                            var z = (Math.random() - 0.5) * 40;

                            var boxBody = new CANNON.Body({mass: mass});

                            boxBody.addShape(boxShape);
                            
//                            let scale2 = 3;
//                            boxBody.shapes[0].halfExtents.x = scale2;
//                            boxBody.shapes[0].halfExtents.y = scale2;
//                            boxBody.shapes[0].halfExtents.z = scale2;
//                            boxBody.shapes[0].boundingSphereRadiusNeedsUpdate = true;
//                            boxBody.shapes[0].updateConvexPolyhedronRepresentation();

                            var boxMesh = new THREE.Mesh(boxGeometry, threeScene.genericMaterial);

                            cannonPhysics.world.addBody(boxBody);

                            threeScene.scene.add(boxMesh);

                            boxBody.position.set(x, y, z);
                            boxMesh.position.set(x, y, z);

                            boxMesh.castShadow = true;
                            boxMesh.receiveShadow = true;

                            this.boxBodies.push(boxBody);
                            this.boxMeshes.push(boxMesh);

                            if (i === 1) {
                                this.g_play3Mesh = boxMesh;
                                this.g_playCnnBody = boxBody;
                            }
                        }

                        // Add linked boxes
                        var linkedBoxSize = 0.5;
                        var linkedBoxV3 = new CANNON.Vec3(linkedBoxSize, linkedBoxSize, linkedBoxSize * 0.1);
                        var linkedBoxShape = new CANNON.Box(linkedBoxV3);
                        var linkedBoxMass = 0;
                        var linkSpace = 0.1 * linkedBoxSize;
                        var linkedBoxNum = 5, last;
                        var linkBoxGeometry = new THREE.BoxGeometry(linkedBoxV3.x * 2, linkedBoxV3.y * 2, linkedBoxV3.z * 2);

                        for (var i = 0; i < linkedBoxNum; i++) {
                            var boxbody = new CANNON.Body({mass: linkedBoxMass});
                            boxbody.addShape(linkedBoxShape);
                            var boxMesh = new THREE.Mesh(linkBoxGeometry, threeScene.genericMaterial);
                            boxbody.position.set(5, (linkedBoxNum - i) * (linkedBoxSize * 2 + 2 * linkSpace) + linkedBoxSize * 2 + linkSpace, 0);
                            boxbody.linearDamping = 0.01;
                            boxbody.angularDamping = 0.01;
                            boxMesh.castShadow = true;
                            boxMesh.receiveShadow = true;
                            cannonPhysics.world.addBody(boxbody);
                            threeScene.scene.add(boxMesh);
                            this.boxBodies.push(boxbody);
                            this.boxMeshes.push(boxMesh);

                            if (i !== 0) {
                                // Connect this body to the last one
                                var c1 = new CANNON.PointToPointConstraint(boxbody, new CANNON.Vec3(-linkedBoxSize, linkedBoxSize + linkSpace, 0), last, new CANNON.Vec3(-linkedBoxSize, -linkedBoxSize - linkSpace, 0));
                                var c2 = new CANNON.PointToPointConstraint(boxbody, new CANNON.Vec3(linkedBoxSize, linkedBoxSize + linkSpace, 0), last, new CANNON.Vec3(linkedBoxSize, -linkedBoxSize - linkSpace, 0));
                                cannonPhysics.world.addConstraint(c1);
                                cannonPhysics.world.addConstraint(c2);
                            }
                            else {
                                linkedBoxMass = 0.3;
                            }
                            last = boxbody;
                        }
                    }
                };
            }]);