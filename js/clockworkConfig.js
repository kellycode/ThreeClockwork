"use strict";
angular.module("clockworkApp.clockworkConfig", [])
        .constant("constants", {
            EIGHTH_PI: Math.PI / 8,
            TWELFTH_PI: Math.PI / 12,
            TWO_PI: Math.PI * 2,
            FLOOR_HEIGHT: 0.2,
            GRID_SPACING: 1.0,
            OBJECT_SCALE_CHANGE: 0.1,
            OBJECT_OFFSET_CHANGE: 0.1,
            OBJECT_REPEAT_CHANGE: 1.0,
            OBJECT_MOVE_SPEED: 0.5,
            OBJECT_ROTATE_RADIANS: Math.PI / 12,
            OBJECT_ROTATE_DEGREES: 15.0,
            USER_MOVE_SPEED: 0.05,
            USER_MOVE_FAST_SPEED: 0.15,
            USER_TURN_SPEED: 0.05,
            USER_HEIGHT: 0.1,
            USER_LOOK_SPEED: 0.01
        })
        .constant("clockworkConfig", {
            "name": "Development",
            "version": (function() {
                var mil = new Date() - new Date("3/24/2015"); // work on this begins
                var weeks = Math.abs(mil) / (7 * 24 * 60 * 60 * 1000);
                var rnd = parseInt(weeks * 10) / 10;
                return '0.0.' + rnd;
            }()),
            "restUrl": "./json/",
            "enableLogging": false
        });
