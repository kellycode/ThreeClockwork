'use strict';

angular.module('clockworkApp.cannonShapes', [])
        .factory('cannonShapes', ['cannonPhysics', 'threeScene', function (cannonPhysics, threeScene) {
                return {

                    bodies: [],
                    meshes: [],

                    update: function () {

                        // Update box positions
                        for (var i = 0; i < this.bodies.length; i++) {
                            this.meshes[i].position.copy(this.bodies[i].position);
                            this.meshes[i].quaternion.copy(this.bodies[i].quaternion);
                        }
                    },

                    shape2mesh: function (body) {
                        let mesh;
                        let shape = body.shapes[0];

                        var geometry = new THREE.Geometry();

                        var v0 = new CANNON.Vec3();
                        var v1 = new CANNON.Vec3();
                        var v2 = new CANNON.Vec3();
                        for (var xi = 0; xi < shape.data.length - 1; xi++) {
                            for (var yi = 0; yi < shape.data[xi].length - 1; yi++) {
                                for (var k = 0; k < 2; k++) {
                                    shape.getConvexTrianglePillar(xi, yi, k === 0);
                                    v0.copy(shape.pillarConvex.vertices[0]);
                                    v1.copy(shape.pillarConvex.vertices[1]);
                                    v2.copy(shape.pillarConvex.vertices[2]);
                                    v0.vadd(shape.pillarOffset, v0);
                                    v1.vadd(shape.pillarOffset, v1);
                                    v2.vadd(shape.pillarOffset, v2);
                                    geometry.vertices.push(
                                            new THREE.Vector3(v0.x, v0.y, v0.z),
                                            new THREE.Vector3(v1.x, v1.y, v1.z),
                                            new THREE.Vector3(v2.x, v2.y, v2.z)
                                            );
                                    var i = geometry.vertices.length - 3;
                                    geometry.faces.push(new THREE.Face3(i, i + 1, i + 2));
                                }
                            }
                        }
                        geometry.computeBoundingSphere();
                        geometry.computeFaceNormals();
                        mesh = new THREE.Mesh(geometry, this.currentMaterial);

                        mesh.receiveShadow = true;
                        mesh.castShadow = true;
                        if (mesh.children) {
                            for (var i = 0; i < mesh.children.length; i++) {
                                mesh.children[i].castShadow = true;
                                mesh.children[i].receiveShadow = true;
                                if (mesh.children[i]) {
                                    for (var j = 0; j < mesh.children[i].length; j++) {
                                        mesh.children[i].children[j].castShadow = true;
                                        mesh.children[i].children[j].receiveShadow = true;
                                    }
                                }
                            }
                        }

                        var o = body.shapeOffsets[0];
                        var q = body.shapeOrientations[0];
                        mesh.position.set(o.x, o.y, o.z);
                        mesh.quaternion.set(q.x, q.y, q.z, q.w);
                        return mesh;
                    },

                    addVisual: function (body) {
                        let mesh;

                        if (body instanceof CANNON.Body) {
                            mesh = this.shape2mesh(body);
                        }
                        if (mesh) {
                            body.visualref = mesh;
                            threeScene.scene.add(mesh);
                            return mesh;
                        }

                    },

                    initCone: function () {
                        var geometry = new THREE.ConeGeometry(5, 20, 32);
                        var material = new THREE.MeshBasicMaterial({color: 0xffff00});
                        var coneMesh = new THREE.Mesh(geometry, material);
                        
                        material.side = 1;

                        var coneBody = new CANNON.Body({
                            mass: 1
                        });

                        let coneRawVerts = coneMesh.geometry.vertices;
                        let coneRawFaces = coneMesh.geometry.faces;
                        let offset = new CANNON.Vec3(0, 0, 0);

                        let coneVerts = [];
                        let coneFaces = [];

                        // Get vertices
                        for (let j = 0; j < coneRawVerts.length; j++) {
                            coneVerts.push(new CANNON.Vec3(coneRawVerts[j].x, coneRawVerts[j].y, coneRawVerts[j].z));
                        }

                        // Get faces
                        for (let j = 0; j < coneRawFaces.length; j++) {
                            coneFaces.push([coneRawFaces[j].a, coneRawFaces[j].b, coneRawFaces[j].c]);
                        }

                        var conePart = new CANNON.ConvexPolyhedron(coneVerts, coneFaces);

                        coneBody.addShape(conePart, offset);

                        coneBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
                        var z180 = new CANNON.Quaternion();
                        z180.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI);
                        coneBody.quaternion = z180.mult(coneBody.quaternion);

                        geometry.computeFaceNormals();
                        geometry.computeVertexNormals();
                        material.shading = THREE.SmoothShading;


                        coneMesh.quaternion.copy(coneBody.quaternion);

                        threeScene.scene.add(coneMesh);
                        cannonPhysics.world.addBody(coneBody);

                        this.bodies.push(coneBody);
                        this.meshes.push(coneMesh);







                    },

                    initHeightfield: function () {
                        let mesh;
                        // Create a matrix of height values
                        var matrix = [];
                        var sizeX = 150;
                        var sizeY = 150;

                        for (var i = 0; i < sizeX; i++) {
                            matrix.push([]);
                            for (var j = 0; j < sizeY; j++) {
                                var height = Math.cos(i / sizeX * Math.PI * 2) * Math.cos(j / sizeY * Math.PI * 2) + 2;
                                if (i === 0 || i === sizeX - 1 || j === 0 || j === sizeY - 1)
                                    height = 3;
                                matrix[i].push(height);
                            }
                        }

                        // Create the heightfield
                        var hfShape = new CANNON.Heightfield(matrix, {
                            elementSize: 1
                        });

                        var hfBody = new CANNON.Body({mass: 0});
                        hfBody.addShape(hfShape);
                        hfBody.position.set(0, 5, 0);
                        cannonPhysics.world.addBody(hfBody);
                        mesh = this.addVisual(hfBody);

                        //this.bulletBallMeshes[i].quaternion.copy(this.bulletBalls[i].quaternion);

                        var axis = new CANNON.Vec3(1, 0, 0);
                        var angle = -Math.PI / 2;
                        hfBody.quaternion.setFromAxisAngle(axis, angle);
                        mesh.quaternion.copy(hfBody.quaternion);

                        this.bodies.push(hfBody);
                        this.meshes.push(mesh);
                    }
                };
            }]);