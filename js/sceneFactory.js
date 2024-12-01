'use strict';

angular.module('ngClockworkApp.sceneFactory', [])
        .factory('threeScene', ['cannonPhysics', function (cannonPhysics) {
                return {
                    ready: false,
                    pickerObjects: [],
                    initScene: function ($element, loadGround) {

                        this.viewDimensions = {
                            width: $element[0].offsetWidth,
                            height: $element[0].offsetHeight
                        };
                        
                        this.pickerRaycaster = new THREE.Raycaster();

                        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

                        this.scene = new THREE.Scene();
                        this.scene.fog = new THREE.Fog(0x000000, 0, 500);

                        this.ambient = new THREE.AmbientLight(0x111111);
                        this.scene.add(this.ambient);

                        //light = new THREE.SpotLight(0xffffff);
                        this.light = new THREE.DirectionalLight(0xffffff);

                        this.light.position.set(100, 100, 50);
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

                        this.controls = new CannonControls(this.camera, cannonPhysics.sphereCannonBody);
                        this.scene.add(this.controls.getObject());

                        // floor
                        this.geometry = new THREE.PlaneBufferGeometry(300, 300, 50, 50);
                        this.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

                        this.genericMaterial = new THREE.MeshLambertMaterial({color: 0xdddddd});

                        if (loadGround) {
                            this.groundMesh = new THREE.Mesh(this.geometry, this.genericMaterial);
                            this.groundMesh.castShadow = false;
                            this.groundMesh.receiveShadow = true;
                            this.scene.add(this.groundMesh);
                        }

                        this.renderer = new THREE.WebGLRenderer();

                        this.renderer.shadowMap.enabled = true;
                        //drenderer.shadowMap.type = THREE.PCFSoftShadowMap; // options are THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap

                        this.renderer.setSize(window.innerWidth, window.innerHeight);
                        this.renderer.setClearColor(this.scene.fog.color, 1);

                        $element.append(this.renderer.domElement);

                        // prevent the save as image popup menu on right click
                        // as we're using that for mouselook
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