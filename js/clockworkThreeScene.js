'use strict';

angular.module('clockworkApp.clockworkThreeScene', [])
        .factory('threeScene', ['cannonControls', 'cannonPhysics', function (cannonControls, cannonPhysics) {
                return {
                    // clickable objects maybe
                    selectableObjects: [],
                    selectedObject: null,
                    intersects: null,
                    ready: false,
                    
                    // called near start in ClockworkControllers
                    init: function ($element) {
                        this.viewDimensions = {
                            width: $element[0].offsetWidth,
                            height: $element[0].offsetHeight
                        };

                        this.pickerRaycaster = new THREE.Raycaster();

                        this.scene = new THREE.Scene();
                        this.scene.fog = new THREE.Fog(0xc0c0c0, 0, 500);
                        
                        
                        this.scene.userData.highlightHelperBox;
                        
                        
                        // AMBIENT LIGHT
                        this.ambient = new THREE.AmbientLight('#d8e7e8');
                        this.scene.add(this.ambient);
                        
                        
                        // CAMERA
                        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
                        //var helper = new THREE.CameraHelper(this.camera);
                        //this.scene.add(helper);
                        

                        // DIRECTIONAL LIGHT
                        this.light = new THREE.DirectionalLight('#ffffff', 1);
                        this.light.position.set(50, 50, -10);
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
                        // add the light
                        this.scene.add(this.light);


                        // CANNON CONTROLS TAKES OVER CAMERA
                        this.controls = cannonControls.initControls(this.camera, cannonPhysics.playerSphereBody);
                        
                        // this is the mesh containing the camera moved by controls
                        this.cannon_camera = this.controls.getObject();
                        this.cannon_camera.name = "CannonControlledCamera";
                        this.scene.add(this.controls.getObject());


                        // material used by cannon objects (not normally seen or used)
                        this.genericMaterial = new THREE.MeshLambertMaterial({color: 0xdddddd});
                        

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
                        
                        
                        // automate the resize
                        window.addEventListener('resize', function () {
                            this.camera.aspect = window.innerWidth / window.innerHeight;
                            this.camera.updateProjectionMatrix();
                            this.renderer.setSize(window.innerWidth, window.innerHeight);
                        }, false);
                    }
                };
            }]);