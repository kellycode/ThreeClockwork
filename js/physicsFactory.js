'use strict';

angular.module('ng-clockwork.physicsFactory', [])
        .factory('cannonPhysics', [function () {
                return {

                    initPhysics: function () {
                        // Setup our world
                        this.world = new CANNON.World();
                        this.world.quatNormalizeSkip = 0;
                        this.world.quatNormalizeFast = false;

                        this.solver = new CANNON.GSSolver();

                        this.world.defaultContactMaterial.contactEquationStiffness = 1e9;
                        this.world.defaultContactMaterial.contactEquationRelaxation = 4;

                        this.solver.iterations = 7;
                        this.solver.tolerance = 0.1;

                        let split = true;

                        if (split) {
                            this.world.solver = new CANNON.SplitSolver(this.solver);
                        }
                        else {
                            this.world.solver = this.solver;
                        }


                        this.world.gravity.set(0, -20, 0);
                        this.world.broadphase = new CANNON.NaiveBroadphase();

                        // Create a slippery material (friction coefficient = 0.0)
                        this.physicsMaterial = new CANNON.Material("slipperyMaterial");

                        let options = {
                            friction: 0.3,
                            restitution: 0.3,
                            contactEquationStiffness: 1e7,
                            contactEquationRelaxation: 3,
                            frictionEquationStiffness: 1e7,
                            frictionEquationRelaxation: 3
                        };
                        var physicsContactMaterial = new CANNON.ContactMaterial(this.physicsMaterial, this.physicsMaterial, options);

                        // We must add the contact materials to the world
                        this.world.addContactMaterial(physicsContactMaterial);

                        // Create a sphere
                        var mass = 100, radius = 1.8;

//                        let scale2 = 1.8;
//                        boxBody.shapes[0].halfExtents.x = scale2;
//                        boxBody.shapes[0].halfExtents.y = scale2;
//                        boxBody.shapes[0].halfExtents.z = scale2;
//                        boxBody.shapes[0].boundingSphereRadiusNeedsUpdate = true;
//                        boxBody.shapes[0].updateConvexPolyhedronRepresentation();

                        // this will be the body that encloses the camera
                        this.sphereShape = new CANNON.Sphere(radius);
                        this.sphereCannonBody = new CANNON.Body({mass: mass});
                        this.sphereCannonBody.addShape(this.sphereShape);
                        this.sphereCannonBody.position.set(0, 5, 20);
                        this.sphereCannonBody.linearDamping = 0.9;
                        this.world.addBody(this.sphereCannonBody);

                        // Create a ground plane
                        var groundShape = new CANNON.Plane();
                        var groundBody = new CANNON.Body({mass: 0});

                        groundBody.addShape(groundShape);
                        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

                        this.world.addBody(groundBody);
                    }
                };
            }]);