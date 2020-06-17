'use strict';

angular.module('ng-clockwork.sceneFactory', [])
        .factory('threeScene', [function threeSceneFactory() {
            return {
                // clickable objects
                pickerObjects: [],
                selectedObject: null,
                intersects: null,
                ready: false,
                init: function ($element) {
                    this.viewDimensions = {
                        width: $element[0].offsetWidth,
                        height: $element[0].offsetHeight
                    };
                    this.scene = new THREE.Scene();
                    // raycaster
                    this.pickerRaycaster = new THREE.Raycaster();

                    // renderer
                    this.renderer = new THREE.WebGLRenderer({antialias: true});
                    this.renderer.setPixelRatio(window.devicePixelRatio);
                    this.renderer.setClearColor(0x000000);
                    this.renderer.setSize(this.viewDimensions.width, this.viewDimensions.height);
                    $element.append(this.renderer.domElement);
                }
            };
        }]);