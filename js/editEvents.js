'use strict';

angular.module('ngClockworkApp.editEvents', [])
        .factory('editEvents', function() {
            return {
                actions: {
                    moveUp: false,
                    moveDown: false,
                    moveForward: false,
                    moveForwardFast: false,
                    moveBack: false,
                    moveObjectForward: false,
                    moveObjectBack: false,
                    lookingUp: false,
                    lookingDown: false,
                    turnLeft: false,
                    turnRight: false,
                    rollLeft: false,
                    rollRight: false,
                    moveObjectLeft: false,
                    moveObjectRight: false,
                    strafeLeft: false,
                    strafeRight: false,
                    resetObjectRotations: false,
                    rollXLess: false,
                    rollXMore: false,
                    rollYLess: false,
                    rollYMore: false,
                    rollZLess: false,
                    rollZMore: false,
                    cloneObject: false,
                    deleteObject: false,
                    fileSave: false
                },
                keyDown: function(event, actions) {
                    //console.log(event.which);
                    switch (event.which) {
                        case 45: // Insert
                            actions.cloneObject = true;
                            break;
                        case 46: // Delete
                            actions.deleteObject = true;
                            break;
                        case 12: // NumPad 5
                            actions.resetObjectRotations = true;
                            break;
                        case 111: // / Forward slash
                            actions.rollXLess = true;
                            break;
                        case 106: // * Asterisk
                            actions.rollXMore = true;
                            break;
                        case 36: // Home
                            actions.rollYLess = true;
                            break;
                        case 35: // End
                            actions.rollYMore = true;
                            break;
                        case 33: // PgUp
                            actions.rollZMore = true;
                            break;
                        case 34: // PgDn
                            actions.rollZLess = true;
                            break;
                        case 87: // W
                            actions.moveForward = true;
                            break;
                        case 16: // W
                            actions.moveForwardFast = true;
                            break;
                        case 38: // Arrow Up
                            if (event.ctrlKey) {
                                event.preventDefault();
                                actions.moveUp = true;
                            } else {
                                actions.moveObjectForward = true;
                            }
                            break;
                        case 83: // S
                            if (event.ctrlKey) {
                                event.preventDefault();
                                actions.fileSave = true;
                            } else {
                                actions.moveBack = true;
                            }
                            break;
                        case 40: // Arrow Down
                            if (event.ctrlKey) {
                                event.preventDefault();
                                actions.moveDown = true;
                            } else {
                                actions.moveObjectBack = true;
                            }
                            break;
                        case 65: // A
                            actions.turnLeft = true;
                            break;
                        case 68: // D
                            actions.turnRight = true;
                            break;
                        case 81: // Q
                            actions.strafeLeft = true;
                            break;
                        case 37: // Arrow Left
                            actions.moveObjectLeft = true;
                            break;
                        case 69: // E
                            actions.strafeRight = true;
                            break;
                        case 39: // Arrow Right
                            actions.moveObjectRight = true;
                            break;
                        case 109: // Numpad -
                            actions.moveDown = true;
                            break;
                        case 107: // Numpad +
                            actions.moveUp = true;
                            break;
                    }
                },
                keyUp: function(event, actions) {
                    switch (event.which) {
                        case 45: // Insert
                            actions.cloneObject = false;
                            break;
                        case 46: // Delete
                            actions.deleteObject = false;
                            break;
                        case 12: // NumPad 5
                            actions.resetObjectRotations = false;
                            break;
                        case 111: // / Forward slash
                            actions.rollXLess = false;
                            break;
                        case 106: // * Asterisk
                            actions.rollXMore = false;
                            break;
                        case 36: // Home
                            actions.rollYLess = false;
                            break;
                        case 35: // End
                            actions.rollYMore = false;
                            break;
                        case 33: // PgUp
                            actions.rollZMore = false;
                            break;
                        case 34: // PgDn
                            actions.rollZLess = false;
                            break;
                        case 87: // W
                            actions.moveForward = false;
                            break;
                        case 16: // W
                            actions.moveForwardFast = false;
                            break;
                        case 83: // S
                            actions.moveBack = false;
                            break;
                        case 38: // Arrow Up
                            actions.moveObjectForward = false;
                            break;
                        case 40: // Arrow Down
                            actions.moveObjectBack = false;
                            break;
                        case 65: // A
                            actions.turnLeft = false;
                            break;
                        case 68: // D
                            actions.turnRight = false;
                            break;
                        case 81: // Q
                            actions.strafeLeft = false;
                            break;
                        case 37: // Arrow Left
                            actions.moveObjectLeft = false;
                            break;
                        case 69: // E
                            actions.strafeRight = false;
                            break;
                        case 39: // Arrow Right
                            actions.moveObjectRight = false;
                            break;
                        case 109: // Numpad -
                            actions.moveDown = false;
                            break;
                        case 107: // Numpad +
                            actions.moveUp = false;
                            break;
                    }
                }
            };
        });