'use strict';

angular.module('ng-clockwork.threeSceneFactory', [])
        .factory('threeScene', ['cannonControls', 'cannonPhysics', function (cannonControls, cannonPhysics) {
                return {
                    // clickable objects
                    pickerObjects: [],
                    selectedObject: null,
                    intersects: null,
                    ready: false,
                    init: function ($element, loadControls) {
                        this.viewDimensions = {
                            width: $element[0].offsetWidth,
                            height: $element[0].offsetHeight
                        };

                        this.pickerRaycaster = new THREE.Raycaster();

                        this.scene = new THREE.Scene();
                        this.scene.fog = new THREE.Fog(0xff0000, 0, 500);

                        this.ambient = new THREE.AmbientLight('#d8e7e8');
                        this.scene.add(this.ambient);

                        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
                        var helper = new THREE.CameraHelper(this.camera);
                        this.scene.add(helper);

                        //light = new THREE.SpotLight(0xffffff);
                        this.light = new THREE.DirectionalLight('#ffffff', 1);

                        this.light.position.set(50, 50, -10);
                        //light.target.position.set(0, 0, 0);

                        // do we want shadows
                        if (true) {
                            this.light.castShadow = true;

                            this.light.shadow.mapSize.width = 2048;
                            this.light.shadow.mapSize.height = 2048;
                            this.light.shadow.camera.near = 0.5;    // default
                            this.light.shadow.camera.far = 500;     // default

                            this.light.shadow.camera.left = -50;
                            this.light.shadow.camera.right = 50;
                            this.light.shadow.camera.top = 50;
                            this.light.shadow.camera.bottom = -50;
                        }

                        this.scene.add(this.light);

                        //var helper = new THREE.CameraHelper(light.shadow.camera);
                        //dscene.add(helper);

                        if (loadControls) {
                            this.controls = cannonControls.initControls(this.camera, cannonPhysics.sphereCannonBody);
                            //this.controls = new CannonControls(this.camera, cannonPhysics.sphereCannonBody);
                            this.scene.add(this.controls.getObject());
                        }

                        // floor
//                        this.geometry = new THREE.PlaneBufferGeometry(300, 300, 50, 50);
//                        this.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
//
                        this.genericMaterial = new THREE.MeshLambertMaterial({color: 0xdddddd});
//
//                        if (loadGround) {
//                            this.groundMesh = new THREE.Mesh(this.geometry, this.genericMaterial);
//                            this.groundMesh.castShadow = false;
//                            this.groundMesh.receiveShadow = true;
//                            this.scene.add(this.groundMesh);
//                        }


                        // renderer
                        this.renderer = new THREE.WebGLRenderer({antialias: true});
                        this.renderer.shadowMap.enabled = true;
                        this.renderer.setPixelRatio(window.devicePixelRatio);
                        this.renderer.setClearColor(this.scene.fog.color, 1);
                        this.renderer.setSize(this.viewDimensions.width, this.viewDimensions.height);

                        $element.append(this.renderer.domElement);

                        this.renderer.domElement.addEventListener('contextmenu', function (e) {
                            e.preventDefault();
                        });

                        window.addEventListener('resize', function () {
                            this.camera.aspect = window.innerWidth / window.innerHeight;
                            this.camera.updateProjectionMatrix();
                            this.renderer.setSize(window.innerWidth, window.innerHeight);
                        }, false);
                    }
                };
            }]);