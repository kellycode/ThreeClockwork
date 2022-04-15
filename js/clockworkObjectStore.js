'use strict';

angular.module('clockworkApp.clockworkObjectStore', [])
        .factory('objectStore', ['objectUtils', function (objectUtils) {
                return {
                    objectSelect: function (event, threeScene) {
                        var camera = threeScene.camera;
                        var intersects = [];
                        var mouse = {x: 0, y: 0};

                        mouse.x = ((event.clientX - threeScene.renderer.domElement.offsetLeft) / threeScene.renderer.domElement.width) * 2 - 1;
                        mouse.y = -((event.clientY - threeScene.renderer.domElement.offsetTop) / threeScene.renderer.domElement.height) * 2 + 1;

                        threeScene.pickerRaycaster.setFromCamera(mouse, camera);
                        intersects = threeScene.pickerRaycaster.intersectObjects(threeScene.scene.children, true);
                        threeScene.selectedObject = this.select(intersects, threeScene.selectedObject, threeScene.scene);
                    },
                    update: function (threeScene, actions) {
                        var currentSelected = threeScene.selectedObject;
                        var self = this;

                        var _cloneSelected = function () {
                            // we explicitly set it to null when it is
                            if (currentSelected === null) {
                                return;
                            }

                            var syncTemplate = function (template) {
                                template.movements.degX = currentSelected.rotation.x * (180 / Math.PI);
                                template.movements.degY = currentSelected.rotation.y * (180 / Math.PI);
                                template.movements.degZ = currentSelected.rotation.z * (180 / Math.PI);

                                template.movements.posX = currentSelected.position.x;
                                template.movements.posY = currentSelected.position.y;
                                template.movements.posZ = currentSelected.position.z;

                                template.movements.scaX = currentSelected.scale.x;
                                template.movements.scaY = currentSelected.scale.y;
                                template.movements.scaZ = currentSelected.scale.z;
                            };
                            // copy the template, don't use a reference
                            var template = angular.extend({}, currentSelected.userData.template);

                            // always need to update template positions before copying
                            syncTemplate(template);

                            // a choice of two types
                            switch (template.type) {
                                case 'ThreeMesh':
                                    self._loadThreeType(template);//**********************
                                    actions.moveObjectForward = true;
                                    actions.moveObjectRight = true;
                                    break;
                                case 'Collada':
                                    self._loadCollada(template);//**********************
                                    actions.moveObjectForward = true;
                                    actions.moveObjectRight = true;
                                    break;
                            }
                        };

                        if (this.scene.userData.box) {
                            this.scene.userData.box.update();
                        }

                        if (actions.cloneObject) {
                            _cloneSelected();
                            actions.cloneObject = false;
                        }
                        if (actions.deleteObject) {

                            // we explicitly set it to null elsewhere when should be
                            if (currentSelected === null) {
                                return;
                            }
                            else {
                                // don't leave the wrapper hanging
                                this._removeSelectionWrapper(currentSelected);
                                // remove the object
                                this.scene.remove(currentSelected);
                            }
                            actions.deleteObject = false;
                        }
                    },
                    _applyMatrix: function (sceneObject, template) {
                        // get and set positions from the saved template
                        sceneObject.position.set(template.movements.posX, template.movements.posY, template.movements.posZ);
                        // get rotations from the saved template, convert to radians and set
                        var rotX = template.movements.degX * (Math.PI / 180);
                        var rotY = template.movements.degY * (Math.PI / 180);
                        var rotZ = template.movements.degZ * (Math.PI / 180);

                        sceneObject.rotation.set(rotX, rotY, rotZ);

                        // get and set scale from the saved template
                        sceneObject.scale.set(template.movements.scaX, template.movements.scaY, template.movements.scaZ);
                    },
                    _addSceneObject: function (sceneObject, canSelect) {
                        // all objects pass through here so it's a 
                        // good place to install the custom degrees item
                        sceneObject.degrees = new THREE.Vector3(
                                sceneObject.userData.template.movements.degX,
                                sceneObject.userData.template.movements.degY,
                                sceneObject.userData.template.movements.degZ);


                        // add it to the scene
                        this.scene.add(sceneObject);

                        sceneObject.updateMatrixWorld();
                    },
                    // SELECTABLE OBJECTS
                    _loadMeshMaterial: function (material, textureParams) {
                        var tempMat = {};

                        // we don't want to corrupt the template, it's what's saved
                        for (var param in material) {
                            tempMat[param] = material[param];
                        }

                        // material
                        if (textureParams) {
                            var loader = new THREE.TextureLoader();
                            var texture = loader.load(textureParams.path);
                            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                            texture.repeat.set(textureParams.repeat.width, textureParams.repeat.height);
                            texture.magFilter = THREE.LinearFilter;  //THREE.NearestFilter
                            tempMat.map = texture;
                        }

                        if (material.type === 'MeshLambertMaterial') {
                            return new THREE.MeshLambertMaterial(tempMat);
                        }
                        else {
                            return new THREE.MeshPhongMaterial(tempMat);
                        }
                    },
                    _loadPlaneGeometry: function (template) {
                        // create the Mesh
                        var sceneObject = new THREE.Mesh(
                                new THREE.PlaneGeometry(
                                        template.geometry.width,
                                        template.geometry.height,
                                        template.geometry.widthSegments,
                                        template.geometry.heightSegments),
                                this._loadMeshMaterial(template.material, template.texture));
                        this._applyMatrix(sceneObject, template);
                        // store the builder objects
                        sceneObject.userData.template = template;
                        // add as appropriate
                        this._addSceneObject(sceneObject, true);
                    },
                    _loadBoxGeometry: function (template) {
                        // create the Mesh
                        var boxGeometry = new THREE.BoxGeometry(
                                template.geometry.width,
                                template.geometry.height,
                                template.geometry.depth,
                                template.geometry.widthSegments,
                                template.geometry.heightSegments,
                                template.geometry.depthSegments);

                        var sceneObject = new THREE.Mesh(
                                boxGeometry,
                                this._loadMeshMaterial(template.material, template.texture));

                        sceneObject.castShadow = true;
                        sceneObject.receiveShadow = true;

                        this._applyMatrix(sceneObject, template);
                        // store the builder objects
                        sceneObject.userData.template = template;
                        // add as appropriate
                        this._addSceneObject(sceneObject, true);
                    },
                    _loadSphereGeometry: function (template) {
                        // create the Mesh
                        var sphereGeometry = new THREE.SphereGeometry(
                                template.geometry.radius,
                                template.geometry.widthSegments,
                                template.geometry.heightSegments);
                        var sceneObject = new THREE.Mesh(
                                sphereGeometry,
                                this._loadMeshMaterial(template.material, template.texture));

                        this._applyMatrix(sceneObject, template);
                        // store the builder objects
                        sceneObject.userData.template = template;
                        // add as appropriate
                        this._addSceneObject(sceneObject, true);
                    },
                    _loadCircleGeometry: function (template) {
                        // create the Mesh
                        var sceneObject = new THREE.Mesh(
                                new THREE.CircleGeometry(
                                        template.geometry.radius,
                                        template.geometry.segments,
                                        template.geometry.thetaStart,
                                        template.geometry.thetaLength),
                                this._loadMeshMaterial(template.material, template.texture));

                        this._applyMatrix(sceneObject, template);
                        // store the builder objects
                        sceneObject.userData.template = template;
                        // add as appropriate
                        this._addSceneObject(sceneObject, true);
                    },
                    _loadRingGeometry: function (template) {
                        // create the Mesh
                        var sceneObject = new THREE.Mesh(
                                new THREE.RingGeometry(
                                        template.geometry.innerRadius,
                                        template.geometry.outerRadius,
                                        template.geometry.thetaSegments,
                                        template.geometry.phiSegments,
                                        template.geometry.thetaStart,
                                        template.geometry.thetaLength),
                                this._loadMeshMaterial(template.material, template.texture));

                        this._applyMatrix(sceneObject, template);
                        // store the builder objects
                        sceneObject.userData.template = template;
                        // add as appropriate
                        this._addSceneObject(sceneObject, true);
                    },
                    _loadCylinderGeometry: function (template) {
                        // create the Mesh
                        var sceneObject = new THREE.Mesh(
                                new THREE.CylinderGeometry(
                                        template.geometry.radiusTop,
                                        template.geometry.radiusBottom,
                                        template.geometry.height,
                                        template.geometry.radiusSegments,
                                        template.geometry.heightSegments,
                                        template.geometry.openEnded,
                                        template.geometry.thetaStart,
                                        template.geometry.thetaLength),
                                this._loadMeshMaterial(template.material, template.texture));

                        this._applyMatrix(sceneObject, template);
                        // store the builder objects
                        sceneObject.userData.template = template;
                        // add as appropriate
                        this._addSceneObject(sceneObject, true);
                    },
                    _loadOctahedronGeometry: function (template) {
                        var octaGeo = new THREE.OctahedronGeometry(template.geometry.radius, template.geometry.detail);
                        var sceneObject = new THREE.Mesh(octaGeo, this._loadMeshMaterial(template.material, template.texture));

                        this._applyMatrix(sceneObject, template);
                        // store the builder objects
                        sceneObject.userData.template = template;
                        /// add as appropriate
                        this._addSceneObject(sceneObject, true);
                    },
                    _loadDodecahedronGeometry: function (template) {
                        var dodeGeo = new THREE.OctahedronGeometry(template.geometry.radius, template.geometry.detail);
                        var sceneObject = new THREE.Mesh(dodeGeo, this._loadMeshMaterial(template.material, template.texture));

                        this._applyMatrix(sceneObject, template);
                        // store the builder objects
                        sceneObject.userData.template = template;
                        /// add as appropriate
                        this._addSceneObject(sceneObject, true);
                    },
                    _loadIcosahedronGeometry: function (template) {
                        var icosGeo = new THREE.IcosahedronGeometry(template.geometry.radius, template.geometry.detail);
                        var sceneObject = new THREE.Mesh(icosGeo, this._loadMeshMaterial(template.material, template.texture));

                        this._applyMatrix(sceneObject, template);
                        // store the builder objects
                        sceneObject.userData.template = template;
                        // add as appropriate
                        this._addSceneObject(sceneObject, true);
                    },
                    _loadTetrahedronGeometry: function (template) {
                        var icosGeo = new THREE.TetrahedronGeometry(template.geometry.radius, template.geometry.detail);
                        var sceneObject = new THREE.Mesh(icosGeo, this._loadMeshMaterial(template.material, template.texture));

                        this._applyMatrix(sceneObject, template);
                        // store the builder objects
                        sceneObject.userData.template = template;
                        // add as appropriate
                        this._addSceneObject(sceneObject, true);
                    },
                    _loadTextGeometry: function (template) {
                        var icosGeo = new THREE.TextGeometry(template.text, template.parameters);
                        var sceneObject = new THREE.Mesh(icosGeo, this._loadMeshMaterial(template.material, template.texture));

                        this._applyMatrix(sceneObject, template);
                        // store the builder objects
                        sceneObject.userData.template = template;
                        // add as appropriate
                        this._addSceneObject(sceneObject, true);
                    },
                    _loadCollada: function (model) {
                        var self = this;

                        var dae_model;
                        var loader = new THREE.ColladaLoader();

                        var template = {
                            type: 'Collada',
                            path: model.path,
                            scale: model.scale,
                            //positions: model.positions,
                            movements: model.movements
                        };

                        loader.load(model.path, function (collada) {
                            // we only use models with one child
                            // so child[0] is the mesh we want
                            dae_model = collada.scene.children[0];

                            // build the template for clones
                            dae_model.userData.template = template;
                            dae_model.userData.isCollada = true;
                            dae_model.scale.x = dae_model.scale.y = dae_model.scale.z = model.scale;

                            self._applyMatrix(dae_model, model);
                            dae_model.updateMatrix();

                            // add as appropriate
                            self._addSceneObject(dae_model, true);
                            dae_model.updateMatrix();
                        });
                    },
                    _loadShaderSkybox: function (template) {
                        // experiment

                        // fog color
                        this.scene.background = new THREE.Color(0x1b280b);
                        
                        // add the fog
                        this.scene.fog = new THREE.Fog(this.scene.background, 1, 250);
                        
                        // img order fr bk up dn lf rt
                        this.scene.background = new THREE.CubeTextureLoader()
                                .setPath('assets/skybox/meadow/')
                                .load(['meadow_ft.jpg', 'meadow_bk.jpg', 'meadow_up.jpg', 'meadow_dn.jpg', 'meadow_rt.jpg', 'meadow_lf.jpg']);
                        // others
                        //.load(['dark-s_px.jpg', 'dark-s_nx.jpg', 'dark-s_py.jpg', 'dark-s_ny.jpg', 'dark-s_pz.jpg', 'dark-s_nz.jpg']);
                        //.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
                    },
                    // CALLED AS DEFAULT, WILL LIKELY BUILD A GROUND FACTORY
                    _loadGround: function () {
                        let template = {
                            "geometry": {
                                "width": 500,
                                "height": 500,
                                "type": "PlaneBufferGeometry"
                            },
                            "material": {
                                "color": "#333333",
                                "emissive": "#000000",
                                "fog": true,
                                "name": "",
                                "opacity": 1,
                                "reflectivity": 1,
                                "refractionRatio": 0.98,
                                "side": 0,
                                "transparent": false,
                                "type": "MeshLambertMaterial",
                                "vertexColors": 0,
                                "visible": true
                            },
                            "texture": {
                                "anisotropy": 1,
                                "path": "./textures/grasslight-big.jpg",
                                "repeat": {
                                    "height": 100,
                                    "width": 100
                                }
                            },
                            "type": "ClockworkGround",
                            "movements": {
                                "posX": 0,
                                "posY": 0,
                                "posZ": 0,
                                "degX": -90,
                                "degY": 0,
                                "degZ": 0,
                                "scaX": 1,
                                "scaY": 1,
                                "scaZ": 1
                            }
                        };

                        var groundGeometry = new THREE.PlaneBufferGeometry(template.geometry.width, template.geometry.height);
                        var ground = new THREE.Mesh(groundGeometry, this._loadMeshMaterial(template.material, template.texture));

                        ground.position.y = 0;
                        ground.castShadow = false;
                        ground.receiveShadow = true;
                        ground.rotation.x = -Math.PI / 2;
                        ground.userData.clockworkType = 'ClockworkGround';
                        ground.userData.template = template;

                        this._addSceneObject(ground, false);
                    },
                    _loadThreeType: function (mesh) {
                        switch (mesh.geometry.type) {
                            case 'PlaneGeometry':
                                this._loadPlaneGeometry(mesh);
                                break;
                            case 'BoxGeometry':
                                this._loadBoxGeometry(mesh);
                                break;
                            case 'SphereGeometry':
                                this._loadSphereGeometry(mesh);
                                break;
                            case 'CircleGeometry':
                                this._loadCircleGeometry(mesh);
                                break;
                            case 'CylinderGeometry':
                                this._loadCylinderGeometry(mesh);
                                break;
                            case 'OctahedronGeometry':
                                this._loadOctahedronGeometry(mesh);
                                break;
                            case 'DodecahedronGeometry':
                                this._loadDodecahedronGeometry(mesh);
                                break;
                            case 'IcosahedronGeometry':
                                this._loadIcosahedronGeometry(mesh);
                                break;
                            case 'TetrahedronGeometry':
                                this._loadTetrahedronGeometry(mesh);
                                break;
                            case 'TextGeometry':
                                this._loadTextGeometry(mesh);
                                break;
                            case 'RingGeometry':
                                this._loadRingGeometry(mesh);
                                break;
                            case 'PlaneBufferGeometry':
                                console.log("THREE.PlaneBufferGeometry is not used at this time as it doesn't support textures");
                                break;
                            default:
                                console.log("No handler for: " + mesh.geometry.type);
                        }
                    },
                    createNewObject: function (template) {
                        if (template.geometry) {
                            this._loadThreeType(template);
                        }
                        else if (template.type === "Collada") {
                            this._loadCollada(template);
                        }
                    },
                    loadScene: function (threeScene) {
                        this.sceneData = threeScene.sceneData;
                        this.scene = threeScene.scene;

                        // loading static ground here atm
                        this._loadGround();

                        this._loadShaderSkybox();

                        // basic items
                        for (var i = 0; i < this.sceneData.length; i++) {
                            if (this.sceneData[i] === null) {
                                continue;
                            }
                            switch (this.sceneData[i].type) {
                                case 'ThreeMesh':
                                    this._loadThreeType(this.sceneData[i]);
                                    break;
                                case 'Collada':
                                    this._loadCollada(this.sceneData[i]);
                                    break;
                                default:
                                    console.log("No handler for: " + this.sceneData[i].type);
                            }
                        }
                    },
                    select: function (intersects, currentSelected, scene) {
                        if (intersects.length > 0)
                        {
                            var selectedObject = intersects[ 0 ].object;

                            // is the selection is not our saved 
                            // (saved could be an object or null)
                            if (currentSelected !== selectedObject)
                            {
                                // if we have an existing selected object
                                if (currentSelected)
                                {
                                    // remove highlight
                                    this._removeSelectionWrapper(currentSelected);
                                    //and erase saved
                                    currentSelected = null;
                                }

                                // and then save our new selected object info
                                currentSelected = selectedObject;

                                // add the highlight
                                this._addSelectionWrapper(currentSelected);
                            }
                            else {
                                // here we know the user clicked on the same object
                                // remove the highlight
                                this._removeSelectionWrapper(currentSelected);
                                //and erase our saved info
                                currentSelected = null;
                            }
                        }
                        else {
                            // if the click was not on an object
                            // unselect the previous selection
                            if (currentSelected)
                            {
                                this._removeSelectionWrapper(currentSelected);
                            }
                            //and erase our saved info
                            currentSelected = null;
                        }
                        //console.log(currentSelected);
                        return currentSelected;
                    },
                    _addSelectionWrapper: function (currentSelected) {
                        this.scene.userData.box = new THREE.BoxHelper(currentSelected, 0xffff00);
                        this.scene.userData.box.name = 'selectionWrapper';
                        this.scene.add(this.scene.userData.box);
                    },
                    _removeSelectionWrapper: function (currentSelected) {
                        var wrapper = this.scene.getObjectByName('selectionWrapper')
                        this.scene.remove(wrapper);
                    },
                    _addSelectionHighlight: function (currentSelected) {
                        if (currentSelected.type === "Group") {
                            var children = currentSelected.children;
                            $.each(children, function (index, value) {
                                value.children[0].userData.emissive = value.children[0].material.emissive;
                                value.children[0].material.emissive = new THREE.Color(0x40ff40);
                            });

                        }
                        else {
                            // save the current emissive property
                            currentSelected.userData.emissive = currentSelected.material.emissive;
                            // set the highlight emissive property
                            currentSelected.material.emissive = new THREE.Color(0x40ff40);
                        }
                    },
                    _remSelectionHighlight: function (currentSelected) {
                        if (currentSelected.type === "Group") {
                            var children = currentSelected.children;
                            $.each(children, function (index, value) {
                                if (typeof value.children[0] !== 'undefined') {
                                    value.children[0].material.emissive = value.children[0].userData.emissive;
                                }
                            });
                        }
                        else {
                            currentSelected.material.emissive = currentSelected.userData.emissive;
                        }
                    },
                    _unselectObject: function (selected, currentSelected) {
                        // remove highlight
                        this._removeSelectionWrapper(selected);
                        //and erase saved
                        currentSelected = null;
                    },
                    _selectObject: function (newSelection, currentSelected) {
                        // first deselect the existing selection
                        // and reset the emissive light
                        if (currentSelected) {
                            this._removeSelectionWrapper(currentSelected);
                            currentSelected = null;
                        }
                        currentSelected = newSelection;
                        // add the highlight
                        this._addSelectionWrapper();

                    },
                    _selectClone: function (clone) {
                        this.parent.ClockworkController._selectObject(clone);
                    }
                };
            }]);