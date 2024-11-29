'use strict';

angular.module('clockworkApp.cannonBullets', [])
        .factory('cannonBullet', ['cannonPhysics', 'threeScene', function (cannonPhysics, threeScene) {
                return {
                    bulletBalls: [],
                    bulletBallMeshes: [],
                    ballShape: new CANNON.Sphere(0.5),
                    ballGeometry: null,
                    shootDirection: new THREE.Vector3(),
                    shootVelo: 60,
                    
                    cof: function () {
                        console.log('cof');
                    },

                    initBullets: function () {
                        this.ballGeometry = new THREE.SphereGeometry(this.ballShape.radius, 32, 32);
                    },

                    update: function () {
                        for (var i = 0; i < this.bulletBalls.length; i++) {
                            this.bulletBallMeshes[i].position.copy(this.bulletBalls[i].position);
                            this.bulletBallMeshes[i].quaternion.copy(this.bulletBalls[i].quaternion);
                        }
                    },

                    addBullet: function (position) {
                        var x = position.x;
                        var y = position.y;
                        var z = position.z;

                        var ballBody = new CANNON.Body({mass: 4, linearDamping: 0.5});
                        ballBody.addShape(this.ballShape)

                        var ballMesh = new THREE.Mesh(this.ballGeometry, threeScene.genericMaterial);

                        cannonPhysics.world.addBody(ballBody);
                        threeScene.scene.add(ballMesh);

                        ballMesh.castShadow = true;
                        ballMesh.receiveShadow = true;

                        this.bulletBalls.push(ballBody);
                        this.bulletBallMeshes.push(ballMesh);

                        this.shootDirection = new THREE.Vector3();
                        threeScene.camera.getWorldDirection(this.shootDirection);

                        ballBody.velocity.set(this.shootDirection.x * this.shootVelo,
                                this.shootDirection.y * this.shootVelo,
                                this.shootDirection.z * this.shootVelo);

                        // Move the ball outside the player sphere
                        x += this.shootDirection.x * (cannonPhysics.sphereShape.radius * 1.02 + this.ballShape.radius);
                        y += this.shootDirection.y * (cannonPhysics.sphereShape.radius * 1.02 + this.ballShape.radius);
                        z += this.shootDirection.z * (cannonPhysics.sphereShape.radius * 1.02 + this.ballShape.radius);

                        ballBody.position.set(x, y, z);
                        ballMesh.position.set(x, y, z);
                    }
                };
            }]);