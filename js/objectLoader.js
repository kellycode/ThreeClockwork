'use strict';

angular.module('ngClockworkApp.objectLoader', [])
        .factory('objectStore', ['objectUtils', function (objectUtils) {
                return {
                    objectSelect: function (event, threeScene) {
                        var camera = threeScene.camera;
                        var pickerObjects = threeScene.pickerObjects;

                        var vector = new THREE.Vector3();
                        vector.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
                        vector.unproject(camera);

                        threeScene.pickerRaycaster.ray.set(camera.position, vector.sub(camera.position).normalize());
                        var intersects = threeScene.pickerRaycaster.intersectObjects(pickerObjects, true);
                        
                        console.log(intersects);

                        threeScene.selectedObject = this.select(intersects, threeScene.selectedObject, threeScene.scene);
                    },
                    update: function (threeScene, actions) {
                        var currentSelected = threeScene.selectedObject;
                        var scene = threeScene.scene;
                        var pickerObjects = threeScene.pickerObjects;
                        var constants = this.constants;
                        var self = this;

                        var _removeObject = function () {
                            // we explicitly set it to null when it is
                            if (currentSelected === null) {
                                return;
                            }
                            else {
                                _removePickerObjects(pickerObjects);
                                scene.remove(currentSelected);
                            }
                        };

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

                        var _removePickerObjects = function (pickerObjects) {
                            if (currentSelected.type === "Group") {
                                var children = currentSelected.children;
                                for (var i = 0; i < pickerObjects.length; i++) {
                                    for (var j = 0; j < children.length; j++) {
                                        if (pickerObjects[i] === children[j].children[0]) {
                                            pickerObjects.splice(i, 1);
                                        }
                                    }
                                }
                                ;
                            }
                            else {
                                for (var i = 0; i < pickerObjects.length; i++) {
                                    if (pickerObjects[i] === currentSelected) {
                                        pickerObjects.splice(i, 1);
                                    }
                                }
                                ;
                            }
                        };

                        if (actions.cloneObject) {
                            _cloneSelected();
                            actions.cloneObject = false;
                        }
                        if (actions.deleteObject) {
                            _removeObject();
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
                        // and add it to the collision list
                        if (canSelect) {
                            this.pickerObjects.push(sceneObject);
                        }
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
                    _loadBoxGeometry: function (template, cannonPhysics) {

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

                        this._applyMatrix(sceneObject, template);

                        // store the builder objects
                        sceneObject.userData.template = template;
                        
//
//                        let dim = {
//                            x: template.geometry.width * template.movements.scaX,
//                            y: template.geometry.height * template.movements.scaY,
//                            z: template.geometry.depth * template.movements.scaZ
//                        };
//                        
//                        let halfExtents = new CANNON.Vec3(dim.x/2, dim.y/2, dim.z/2);
//                        let boxShape = new CANNON.Box(halfExtents);
//                        
//                        let body_mass = 2000;
//
//                        sceneObject.userData.boxBody = new CANNON.Body({mass: body_mass});
//                        sceneObject.userData.boxBody.addShape(boxShape);
//
//                        cannonPhysics.world.addBody(sceneObject.userData.boxBody);
//                        
//                        sceneObject.userData.boxBody.position.set(sceneObject.position.x, sceneObject.position.y, sceneObject.position.z);
//                        
//                        sceneObject.phys = true;

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
                        var parent = this.parent;

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
                            dae_model = collada.scene;

                            // build the template for clones
                            dae_model.userData.template = template;
                            dae_model.scale.x = dae_model.scale.y = dae_model.scale.z = model.scale;

                            self._applyMatrix(dae_model, model);
                            dae_model.updateMatrix();

                            for (var i = 0; i < dae_model.children.length; i++) {
                                // to catch when we have a group selected by a group mesh
                                // save a reference to the group parent id
                                dae_model.children[i].userData.isCollada = true;
                                dae_model.children[i].material.transparent = true;
                                dae_model.children[i].material.side = THREE.DoubleSide;
                                dae_model.children[i].userData.id = dae_model.id;
                                // and add this child to the picker, groups are selected by children
                                self.pickerObjects.push(dae_model.children[i]);
                            }
                            // add as appropriate
                            self._addSceneObject(dae_model, false);
                        });
                    },
                    // STATIS OBJECTS
                    _loadPerspectiveCamera: function (template) {
                        var perspectiveCamera = new THREE.PerspectiveCamera(
                                template.fov,
                                template.aspect,
                                template.near,
                                template.far);

                        //template.movements.degY = 0;

                        this._applyMatrix(perspectiveCamera, template);

                        perspectiveCamera.userData.template = template;
                        this.camera = perspectiveCamera;
                        //this.camera.rotation.order = "YXZ";
                        // add as appropriate
                        this._addSceneObject(perspectiveCamera, false);
                    },
                    _loadAmbientLight: function (template) {
                        var ambLight = new THREE.AmbientLight(template.color);
                        ambLight.userData.template = template;
                        // add as appropriate
                        this._addSceneObject(ambLight, false);
                    },
                    _loadDirectionalLight: function (template) {
                        var directionalLight = new THREE.DirectionalLight(template.color, template.intensity);
                        directionalLight.userData.template = template;
                        directionalLight.position.set(template.posX, template.posY, template.posZ);
                        this._addSceneObject(directionalLight, false);
                    },
                    _loadSimpleSkybox: function (template) {
                        var skyGeometry = new THREE.BoxGeometry(
                                template.geometry.width,
                                template.geometry.height,
                                template.geometry.depth);

                        var materialArray = [];
                        for (var i = 0; i < 6; i++)
                            var loader = new THREE.TextureLoader();
                        materialArray.push(new THREE.MeshBasicMaterial({
                            map: loader.load(template.images[i]),
                            side: THREE.BackSide
                        }));

                        var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
                        var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);

                        skyBox.userData.template = template;

                        this._addSceneObject(skyBox, false);
                    },
                    // img order fr bk up dn lf rt
                    _loadShaderSkybox: function (template) {

                        this.scene.background = new THREE.CubeTextureLoader()
                                .setPath('assets/skybox/meadow/')
                                .load(['meadow_ft.jpg', 'meadow_bk.jpg', 'meadow_up.jpg', 'meadow_dn.jpg', 'meadow_rt.jpg', 'meadow_lf.jpg']);
                        //.load(['dark-s_px.jpg', 'dark-s_nx.jpg', 'dark-s_py.jpg', 'dark-s_ny.jpg', 'dark-s_pz.jpg', 'dark-s_nz.jpg']);
                        //.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);


                        this.scene.userData.background = template;
                    },
                    _loadGround: function (template) {
                        var groundGeometry = new THREE.PlaneBufferGeometry(template.geometry.width, template.geometry.height);
                        var ground = new THREE.Mesh(groundGeometry, this._loadMeshMaterial(template.material, template.texture));
                        ground.position.y = 0;
                        ground.rotation.x = -Math.PI / 2;
                        ground.userData.clockworkType = 'ClockworkGround';
                        ground.userData.template = template;
                        this._addSceneObject(ground, false);
                    },
                    _loadThreeType: function (mesh, cannonPhysics) {
                        switch (mesh.geometry.type) {
                            case 'PlaneGeometry':
                                this._loadPlaneGeometry(mesh, cannonPhysics);
                                break;
                            case 'BoxGeometry':
                                this._loadBoxGeometry(mesh, cannonPhysics);
                                break;
                            case 'SphereGeometry':
                                this._loadSphereGeometry(mesh, cannonPhysics);
                                break;
                            case 'CircleGeometry':
                                this._loadCircleGeometry(mesh, cannonPhysics);
                                break;
                            case 'CylinderGeometry':
                                this._loadCylinderGeometry(mesh, cannonPhysics);
                                break;
                            case 'OctahedronGeometry':
                                this._loadOctahedronGeometry(mesh, cannonPhysics);
                                break;
                            case 'DodecahedronGeometry':
                                this._loadDodecahedronGeometry(mesh, cannonPhysics);
                                break;
                            case 'IcosahedronGeometry':
                                this._loadIcosahedronGeometry(mesh, cannonPhysics);
                                break;
                            case 'TetrahedronGeometry':
                                this._loadTetrahedronGeometry(mesh, cannonPhysics);
                                break;
                            case 'TextGeometry':
                                this._loadTextGeometry(mesh, cannonPhysics);
                                break;
                            case 'RingGeometry':
                                this._loadRingGeometry(mesh, cannonPhysics);
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
                    loadScene: function (threeScene, cannonPhysics) {
                        this.sceneData = threeScene.sceneData;
                        this.scene = threeScene.scene;
                        this.pickerObjects = threeScene.pickerObjects;
                        // first load all of the THREE items
                        for (var i = 0; i < this.sceneData.length; i++) {
                            switch (this.sceneData[i].type) {
                                case 'ThreeMesh':
                                    this._loadThreeType(this.sceneData[i], cannonPhysics);
                                    break;
                                case 'PerspectiveCamera':
                                    //this._loadPerspectiveCamera(this.sceneData[i], cannonPhysics);
                                    break;
                                case 'AmbientLight':
                                    //this._loadAmbientLight(this.sceneData[i], cannonPhysics);
                                    break;
                                case 'Collada':
                                    this._loadCollada(this.sceneData[i], cannonPhysics);
                                    break;
                                case 'DirectionalLight':
                                    //this._loadDirectionalLight(this.sceneData[i], cannonPhysics);
                                    break;
                                case 'ShaderSkybox':
                                    this._loadShaderSkybox(this.sceneData[i], cannonPhysics);
                                    break;
                                case 'SimpleSkybox':
                                    this._loadSimpleSkybox(this.sceneData[i], cannonPhysics);
                                    break;
                                case 'ClockworkGround':
                                    this._loadGround(this.sceneData[i], cannonPhysics);
                                    break;
                                default:
                                    console.log("No handler for: " + this.sceneData[i].type);
                            }
                        }
                        //return this.camera;
                    },
                    select: function (intersects, currentSelected, scene) {
                        if (intersects.length > 0)
                        {
                            var selectedObject = intersects[ 0 ].object;

                            if (selectedObject.userData.isCollada) {
                                selectedObject = scene.getObjectById(selectedObject.userData.id, false);
                            }
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
                        var dims = objectUtils.getCompoundBoundingBox(currentSelected);
                        var geometry = new THREE.BoxGeometry(dims.x, dims.y, dims.z);
                        var material = new THREE.MeshBasicMaterial({wireframe: true});
                        var wrapper = new THREE.Mesh(geometry, material);
                        wrapper.name = 'wrap';
                        wrapper.position.set(0, 0, 0);
                        currentSelected.add(wrapper);
                    },
                    _removeSelectionWrapper: function (currentSelected) {
                        var wrap = currentSelected.getObjectByName('wrap');
                        currentSelected.remove(wrap);
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