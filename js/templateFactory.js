'use strict';
angular.module('ngClockworkApp.templateFactory', [])
        .factory('templater', function() {
            return {
                boxTemplate: {
                    "geometry": {
                        "width": 1,
                        "height": 1,
                        "depth": 1,
                        "widthSegments": 1,
                        "heightSegments": 1,
                        "depthSegments": 1,
                        "type": "BoxGeometry"
                    },
                    "material": {
                        "color": "#ffffff",
                        "emissive": "#000000",
                        "fog": true,
                        "name": "",
                        "opacity": 1,
                        "flatShading": true,
                        "shininess": 1,
                        "side": 2,
                        "specular": "#000000",
                        "transparent": false,
                        "type": "MeshPhongMaterial",
                        "vertexColors": 0,
                        "visible": true
                    },
                    "type": "ThreeMesh",
                    "movements": {
                        "posX": 0,
                        "posY": 0,
                        "posZ": 0,
                        "degX": 0,
                        "degY": 0,
                        "degZ": 0,
                        "scaX": 1,
                        "scaY": 1,
                        "scaZ": 1
                    }
                },
                circleTemplate: {
                    "geometry": {
                        "radius": 1,
                        "segments": 32,
                        "thetaStart": 0,
                        "thetaLength": 2 * Math.PI,
                        "type": "CircleGeometry"
                    },
                    "material": {
                        "color": "#ffffff",
                        "emissive": "#000000",
                        "fog": true,
                        "name": "",
                        "opacity": 1,
                        "flatShading": true,
                        "shininess": 1,
                        "side": 2,
                        "specular": "#000000",
                        "transparent": false,
                        "type": "MeshPhongMaterial",
                        "vertexColors": 0,
                        "visible": true
                    },
                    "type": "ThreeMesh",
                    "movements": {
                        "posX": 0,
                        "posY": 0,
                        "posZ": 0,
                        "degX": 0,
                        "degY": 0,
                        "degZ": 0,
                        "scaX": 1,
                        "scaY": 1,
                        "scaZ": 1
                    }
                },
                cylinderTemplate: {
                    "geometry": {
                        "radiusTop": 1,
                        "radiusBottom": 1,
                        "height": 1,
                        "radiusSegments": 16,
                        "heightSegments": 32,
                        "openEnded": false,
                        "thetaStart": 0,
                        "thetaLength": 2 * Math.PI,
                        "type": "CylinderGeometry"
                    },
                    "material": {
                        "color": "#ffffff",
                        "emissive": "#000000",
                        "fog": true,
                        "name": "",
                        "opacity": 1,
                        "flatShading": true,
                        "shininess": 1,
                        "side": 2,
                        "specular": "#000000",
                        "transparent": false,
                        "type": "MeshPhongMaterial",
                        "vertexColors": 0,
                        "visible": true
                    },
                    "type": "ThreeMesh",
                    "movements": {
                        "posX": 0,
                        "posY": 0,
                        "posZ": 0,
                        "degX": 0,
                        "degY": 0,
                        "degZ": 0,
                        "scaX": 1,
                        "scaY": 1,
                        "scaZ": 1
                    }
                },
                dodecahedronTemplate: {
                    "geometry": {
                        "radius": 1,
                        "detail": 0,
                        "type": "DodecahedronGeometry"
                    },
                    "material": {
                        "color": "#ffffff",
                        "emissive": "#000000",
                        "fog": true,
                        "name": "",
                        "opacity": 1,
                        "flatShading": true,
                        "shininess": 1,
                        "side": 2,
                        "specular": "#000000",
                        "transparent": false,
                        "type": "MeshPhongMaterial",
                        "vertexColors": 0,
                        "visible": true
                    },
                    "type": "ThreeMesh",
                    "movements": {
                        "posX": 0,
                        "posY": 0,
                        "posZ": 0,
                        "degX": 0,
                        "degY": 0,
                        "degZ": 0,
                        "scaX": 1,
                        "scaY": 1,
                        "scaZ": 1
                    }
                },
                icosahedronTemplate: {
                    "geometry": {
                        "radius": 1,
                        "detail": 1,
                        "type": "IcosahedronGeometry"
                    },
                    "material": {
                        "color": "#ffffff",
                        "emissive": "#000000",
                        "fog": true,
                        "name": "",
                        "opacity": 1,
                        "flatShading": true,
                        "shininess": 1,
                        "side": 2,
                        "specular": "#000000",
                        "transparent": false,
                        "type": "MeshPhongMaterial",
                        "vertexColors": 0,
                        "visible": true
                    },
                    "type": "ThreeMesh",
                    "movements": {
                        "posX": 0,
                        "posY": 0,
                        "posZ": 0,
                        "degX": 0,
                        "degY": 0,
                        "degZ": 0,
                        "scaX": 1,
                        "scaY": 1,
                        "scaZ": 1
                    }
                },
                octahedronTemplate: {
                    "geometry": {
                        "radius": 1,
                        "detail": 0,
                        "type": "OctahedronGeometry"
                    },
                    "material": {
                        "color": "#ffffff",
                        "emissive": "#000000",
                        "fog": true,
                        "name": "",
                        "opacity": 1,
                        "flatShading": true,
                        "shininess": 1,
                        "side": 2,
                        "specular": "#000000",
                        "transparent": false,
                        "type": "MeshPhongMaterial",
                        "vertexColors": 0,
                        "visible": true
                    },
                    "type": "ThreeMesh",
                    "movements": {
                        "posX": 0,
                        "posY": 0,
                        "posZ": 0,
                        "degX": 0,
                        "degY": 0,
                        "degZ": 0,
                        "scaX": 1,
                        "scaY": 1,
                        "scaZ": 1
                    }
                },
                planeTemplate: {
                    "geometry": {
                        "width": 1,
                        "height": 1,
                        "widthSegments": 1,
                        "heightSegments": 1,
                        "type": "PlaneGeometry"
                    },
                    "material": {
                        "color": "#ffffff",
                        "emissive": "#000000",
                        "fog": true,
                        "name": "",
                        "opacity": 1,
                        "flatShading": true,
                        "shininess": 1,
                        "side": 2,
                        "specular": "#000000",
                        "transparent": false,
                        "type": "MeshPhongMaterial",
                        "vertexColors": 0,
                        "visible": true
                    },
                    "type": "ThreeMesh",
                    "movements": {
                        "posX": 0,
                        "posY": 0,
                        "posZ": 0,
                        "degX": 0,
                        "degY": 0,
                        "degZ": 0,
                        "scaX": 1,
                        "scaY": 1,
                        "scaZ": 1
                    }
                },
                ringTemplate: {
                    "geometry": {
                        "innerRadius": 1,
                        "outerRadius": 2,
                        "thetaSegments": 32,
                        "phiSegments": 8,
                        "thetaStart": 0,
                        "thetaLength": 2 * Math.PI,
                        "type": "RingGeometry"
                    },
                    "material": {
                        "color": "#ffffff",
                        "emissive": "#000000",
                        "fog": true,
                        "name": "",
                        "opacity": 1,
                        "flatShading": true,
                        "shininess": 1,
                        "side": 2,
                        "specular": "#000000",
                        "transparent": false,
                        "type": "MeshPhongMaterial",
                        "vertexColors": 0,
                        "visible": true
                    },
                    "type": "ThreeMesh",
                    "movements": {
                        "posX": 0,
                        "posY": 0,
                        "posZ": 0,
                        "degX": 0,
                        "degY": 0,
                        "degZ": 0,
                        "scaX": 1,
                        "scaY": 1,
                        "scaZ": 1
                    }
                },
                sphereTemplate: {
                    "geometry": {
                        "radius": 1,
                        "widthSegments": 8,
                        "heightSegments": 6,
                        "phiStart": 0,
                        "phiLength": 2 * Math.PI,
                        "theteStart": 0,
                        "thetaLength": 2 * Math.PI,
                        "type": "SphereGeometry"
                    },
                    "material": {
                        "color": "#ffffff",
                        "emissive": "#000000",
                        "fog": true,
                        "name": "",
                        "opacity": 1,
                        "flatShading": true,
                        "shininess": 1,
                        "side": 2,
                        "specular": "#000000",
                        "transparent": false,
                        "type": "MeshPhongMaterial",
                        "vertexColors": 0,
                        "visible": true
                    },
                    "type": "ThreeMesh",
                    "movements": {
                        "posX": 0,
                        "posY": 0,
                        "posZ": 0,
                        "degX": 0,
                        "degY": 0,
                        "degZ": 0,
                        "scaX": 1,
                        "scaY": 1,
                        "scaZ": 1
                    }
                },
                tetrahedronTemplate: {
                    "geometry": {
                        "radius": 1,
                        "detail": 0,
                        "type": "TetrahedronGeometry"
                    },
                    "material": {
                        "color": "#ffffff",
                        "emissive": "#000000",
                        "fog": true,
                        "name": "",
                        "opacity": 1,
                        "flatShading": true,
                        "shininess": 1,
                        "side": 2,
                        "specular": "#000000",
                        "transparent": false,
                        "type": "MeshPhongMaterial",
                        "vertexColors": 0,
                        "visible": true
                    },
                    "type": "ThreeMesh",
                    "movements": {
                        "posX": 0,
                        "posY": 0,
                        "posZ": 0,
                        "degX": 0,
                        "degY": 0,
                        "degZ": 0,
                        "scaX": 1,
                        "scaY": 1,
                        "scaZ": 1
                    }
                },
                textTemplate: {
                    "text": 'hello',
                    "geometry": {
                        "type": "TextGeometry"
                    },
                    "parameters": {
                        "size": 1,
                        "height": 1,
                        "curveSegments": 12,
                        "font": 'titilliumtext22l',
                        "weight": 'normal',
                        "style": 'normal',
                        "bevelEnabled": false,
                        "bevelThickness": 10,
                        "bevelSize": 8
                    },
                    "material": {
                        "color": "#ffffff",
                        "emissive": "#000000",
                        "fog": true,
                        "name": "",
                        "opacity": 1,
                        "flatShading": true,
                        "shininess": 1,
                        "side": 2,
                        "specular": "#000000",
                        "transparent": false,
                        "type": "MeshPhongMaterial",
                        "vertexColors": 0,
                        "visible": true
                    },
                    "type": "ThreeMesh",
                    "movements": {
                        "posX": 0,
                        "posY": 0,
                        "posZ": 0,
                        "degX": 0,
                        "degY": 0,
                        "degZ": 0,
                        "scaX": 1,
                        "scaY": 1,
                        "scaZ": 1
                    }
                },
                colladaTemplate: {
                    "type": "Collada",
                    "path": "./models/camping/na-tent5.dae",
                    "movements": {
                        "posX": 0,
                        "posY": 0,
                        "posZ": 0,
                        "degX": 0,
                        "degY": 0,
                        "degZ": 0,
                        "scaX": 1,
                        "scaY": 1,
                        "scaZ": 1
                    }
                },
                // Mesh Geometry
                updateMeshGeometry: function(obj) {
                    obj.userData.template.geometry = {};
                    obj.userData.template.geometry = obj.geometry.parameters;
                    obj.userData.template.geometry.type = obj.geometry.type;
                },
                //PerspectiveCamera
                updatePerspectiveCameraTemplate: function(obj) {
                    obj.userData.template.type = "PerspectiveCamera";
                    obj.userData.template.aspect = obj.aspect;
                    obj.userData.template.castShadow = obj.castShadow;
                    obj.userData.template.far = obj.far;
                    obj.userData.template.fov = obj.fov;
                    obj.userData.template.frustumCulled = obj.frustumCulled;
                    obj.userData.template.name = obj.name;
                    obj.userData.template.near = obj.near;
                    obj.userData.template.zoom = obj.zoom;
                    obj.userData.template.visible = obj.visible;
                },
                // AmbientLight
                updateAmbientLightTemplate: function(obj) {
                    obj.userData.template.type = "AmbientLight";
                    obj.userData.template.castShadow = obj.castShadow;
                    obj.userData.template.color = '#' + obj.color.getHexString();
                    obj.userData.template.frustumCulled = obj.frustumCulled;
                    obj.userData.template.name = obj.name;
                    obj.userData.template.visible = obj.visible;
                },
                // Mesh texture
                // currently, only a Mesh can have a texture, we 
                // don't want to go down the road of being a modal editor
                updateMeshTemplateTexture: function(obj) {
                    if (obj.material.map) {
                        obj.userData.template.texture = {
                            "anisotropy": obj.material.map.anisotropy,
                            //"path": obj.material.map.sourceFile,
                            "path": obj.userData.template.texture.path,
                            "repeat": {
                                "height": obj.material.map.repeat.y,
                                "width": obj.material.map.repeat.x
                            }
                        }
                    }
                },
                // Mesh material
                updateMeshTemplateMaterial: function(obj) {
                    if (obj.material.type === "MeshLambertMaterial") {
                        obj.userData.template.material = {};
                        // order directly from object dump
                        // alphaMap ncs
                        // alphaTest ncs
                        // blendDst ncs
                        // blendDstAlpha ncs
                        // blendEquation ncs
                        // blendEquationAlpha ncs
                        // blendSrc ncs
                        // blendSrcAlpha ncs
                        // blending ncs
                        obj.userData.template.material.color = '#' + obj.material.color.getHexString();
                        // colorWrite ncs
                        // combine ncs
                        // depthTest ncs
                        // depthWrite ncs
                        obj.userData.template.material.emissive = '#' + obj.material.emissive.getHexString();
                        // envMap ncs
                        obj.userData.template.material.fog = obj.material.fog;
                        // lightMap ncs
                        // map stored outside of material
                        // morphNormals ncs
                        // morphTargets ncs
                        obj.userData.template.material.name = obj.material.name;
                        obj.userData.template.material.opacity = obj.material.opacity;
                        // overdraw ncs
                        // polygonOffset ncs
                        // polygonOffsetFactor ncs
                        // polygonOffsetUnits ncs
                        obj.userData.template.material.reflectivity = obj.material.reflectivity;
                        obj.userData.template.material.refractionRatio = obj.material.refractionRatio;
                        obj.userData.template.material.flatShading = obj.material.flatShading;
                        obj.userData.template.material.side = obj.material.side;
                        // skinning ncs
                        // specularMap ncs
                        obj.userData.template.material.transparent = obj.material.transparent;
                        obj.userData.template.material.type = obj.material.type;
                        // uniformsList ncs
                        obj.userData.template.material.vertexColors = obj.material.vertexColors;
                        obj.userData.template.material.visible = obj.material.visible;
                        // wireframe ncs
                        // wireframeLinecap ncs
                        // wireframeLinejoin ncs
                        // wireframeLinewidth ncs
                        // wrapAround ncs
                        // wrapRGB ncs
                    }
                    if (obj.material.type === "MeshPhongMaterial") {
                        obj.userData.template.material = {};
                        // order directly from object dump
                        // alphaMap ncs
                        // alphaTest ncs
                        // blendDst ncs
                        // blendDstAlpha ncs
                        // blendEquation ncs
                        // blendEquationAlpha ncs
                        // blendSrc ncs
                        // blendSrcAlpha ncs
                        // blending ncs
                        // bumpMap ncs
                        // bumpScale ncs
                        obj.userData.template.material.color = '#' + obj.material.color.getHexString();
                        // colorWrite ncs
                        // combine ncs
                        // depthTest ncs
                        // depthWrite ncs
                        obj.userData.template.material.emissive = '#' + obj.material.emissive.getHexString();
                        // envMap ncs
                        obj.userData.template.material.fog = obj.material.fog;
                        // lightMap ncs
                        // map stored outside of material
                        // metal ncs
                        // morphNormals ncs
                        // morphTargets ncs
                        obj.userData.template.material.name = obj.material.name;
                        // normalMap ncs
                        // normalScale ncs
                        obj.userData.template.material.opacity = obj.material.opacity;
                        // overdraw ncs
                        // polygonOffset ncs
                        // polygonOffsetFactor ncs
                        // polygonOffsetUnits ncs
                        // obj.userData.template.material.reflectivity = obj.material.reflectivity;
                        // obj.userData.template.material.refractionRatio = obj.material.refractionRatio;
                        obj.userData.template.material.flatShading = obj.material.flatShading;
                        obj.userData.template.material.shininess = obj.material.shininess;
                        obj.userData.template.material.side = obj.material.side;
                        // skinning ncs
                        obj.userData.template.material.specular = '#' + obj.material.specular.getHexString();
                        // specularMap ncs
                        obj.userData.template.material.transparent = obj.material.transparent;
                        obj.userData.template.material.type = obj.material.type;
                        // uniformsList ncs
                        obj.userData.template.material.vertexColors = obj.material.vertexColors;
                        obj.userData.template.material.visible = obj.material.visible;
                        // wireframe ncs
                        // wireframeLinecap ncs
                        // wireframeLinejoin ncs
                        // wireframeLinewidth ncs
                        // wrapAround ncs
                        // wrapRGB ncs
                    }
                },
                // Movements (position and scale)
                // no checks here, every template has a position
                updateTemplateMovements: function(obj) {
                    obj.userData.template.movements = {};
                    obj.userData.template.movements = {
                        posX: obj.position.x,
                        posY: obj.position.y,
                        posZ: obj.position.z,
                        degX: obj.degrees.x,
                        degY: obj.degrees.y,
                        degZ: obj.degrees.z,
                        scaX: obj.scale.x,
                        scaY: obj.scale.y,
                        scaZ: obj.scale.z
                    };
                },
                updateShaderSkybox: function(obj) {
                    //template.geometry.width,
                    //template.geometry.height,
                    //template.geometry.depth,
                    //template.geometry.widthSegments,
                    //template.geometry.heightSegments,
                    //template.geometry.depthSegments
                    obj.userData.template.geometry.width = obj.geometry.parameters.width;
                    obj.userData.template.geometry.height = obj.geometry.parameters.height;
                    obj.userData.template.geometry.depth = obj.geometry.parameters.depth;
                    obj.userData.template.geometry.widthSegments = obj.geometry.parameters.widthSegments;
                    obj.userData.template.geometry.heightSegments = obj.geometry.parameters.heightSegments;
                    obj.userData.template.geometry.depthSegments = obj.geometry.parameters.depthSegments;
                    //obj.userData.template.geometry = obj.geometry.parameters;
                },
                updateSimpleSkybox: function(obj) {

                },
                updateClockworkGround: function(obj) {

                }
            };
        });