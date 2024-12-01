/**
 * @author mrdoob / http://mrdoob.com/
 * @author schteppe / https://github.com/schteppe
 */
let CannonControls = function (camera, sphereCannonBody) {

    let velocityFactor = 0.2;
    let jumpVelocity = 20;

    let pitchObject = new THREE.Object3D();
    pitchObject.add(camera);

    let yawObject = new THREE.Object3D();
    yawObject.add(pitchObject);

    yawObject.position.y = 1;

    let quat = new THREE.Quaternion();

    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let turnLeft = false;
    let turnRight = false;
    let lookDown = false;
    let lookUp = false;
    let shiftDown = false;
    let followMouse = false;

    let canJump = false;
    let isScrolling = false;

    // Normal in the contact, pointing *out* of whatever the player touched
    let contactNormal = new CANNON.Vec3();
    let upAxis = new CANNON.Vec3(0, 1, 0);

    sphereCannonBody.addEventListener("collide", function (e) {
        let contact = e.contact;

        // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
        // We do not yet know which one is which! Let's check.
        if (contact.bi.id === sphereCannonBody.id)  // bi is the player body, flip the contact normal
            contact.ni.negate(contactNormal);
        else
            contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

        // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
        if (contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
            canJump = true;
    });

    let velocity = sphereCannonBody.velocity;

    let PI_2 = Math.PI / 2;

    let watchScrolling = function (event) {
        // Clear our timeout throughout the scroll
        window.clearTimeout(isScrolling);
        // Set a timeout to run after scrolling ends
        isScrolling = setTimeout(function () {
            // turn it off
            lookUp = lookDown = false;
        }, 66);
    };

    let onMouseWheel = function (event) {
        watchScrolling();
        if (event.deltaY < 0)
        {
            // looking and scrolling down
            lookDown = true;
        }
        else if (event.deltaY > 0)
        {
            // looking and scrolling up
            lookUp = true;
        }
    };

    let onKeyDown = function (event) {
        shiftDown = event.shiftKey;
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
                moveLeft = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
                moveRight = true;
                break;

            case 65: // A
                turnLeft = true;
                break;

            case 68: // D
                turnRight = true;
                break;

            case 32: // space
                if (canJump === true) {
                    velocity.y = jumpVelocity;
                }
                canJump = false;
                break;
        }
    };

    let onKeyUp = function (event) {
        shiftDown = event.shiftKey;
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
                moveLeft = false;
                break;

            case 40: // down
            case 83: // a
                moveBackward = false;
                break;

            case 39: // right
                moveRight = false;
                break;

            case 65: // A
                turnLeft = false;
                break;

            case 68: // D
                turnRight = false;
                break;
        }
    };

    var onMouseMove = function (event) {

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x -= movementY * 0.002;

        pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
    };


    let onMouseButtonDown = function (event) {
        // on scroll click, look center
        if (event.button === 1) {
            pitchObject.rotation.x = 0.0;
        }
        else if (event.button === 2) {
            window.addEventListener('mousemove', onMouseMove);
        }
    };

    let onMouseButtonUp = function (event) {
        if (event.button === 2) {
            window.removeEventListener('mousemove', onMouseMove);
        }
    };

    //document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseButtonUp, false);
    document.addEventListener('mousedown', onMouseButtonDown, false);
    document.addEventListener('wheel', onMouseWheel, false);
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    this.enabled = true;

    this.getObject = function () {
        return yawObject;
    };

    this.getDirection = function (targetVec) {
        targetVec.set(0, 0, -1);
        quat.multiplyVector3(targetVec);
    };

    // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
    let inputVelocity = new THREE.Vector3();
    let euler = new THREE.Euler();

    this.update = function (delta) {

        delta *= 0.1;

        let shiftDiff = 1;

        inputVelocity.set(0, 0, 0);

        if (shiftDown) {
            shiftDiff = 5;
        }
        else {
            shiftDiff = 1;
        }

        if (moveForward) {
            inputVelocity.z = -velocityFactor * shiftDiff * delta;
        }
        if (moveBackward) {
            inputVelocity.z = velocityFactor * delta;
        }

        if (moveLeft) {
            inputVelocity.x = -velocityFactor * delta;
        }
        if (moveRight) {
            inputVelocity.x = velocityFactor * delta;
        }

        if (turnRight) {
            yawObject.rotation.y -= 0.05;
        }
        if (turnLeft) {
            yawObject.rotation.y += 0.05;
        }

        if (lookUp) {
            if (pitchObject.rotation.x < 0.4) {
                pitchObject.rotation.x += 0.05;
            }
        }
        if (lookDown) {
            if (pitchObject.rotation.x > -0.4) {
                pitchObject.rotation.x -= 0.05;
            }
        }

        // Convert velocity to world coordinates
        euler.x = pitchObject.rotation.x;
        euler.y = yawObject.rotation.y;
        euler.order = "XYZ";
        quat.setFromEuler(euler);
        inputVelocity.applyQuaternion(quat);
        //quat.multiplyVector3(inputVelocity);

        // Add to the object
        velocity.x += inputVelocity.x;
        velocity.z += inputVelocity.z;

        yawObject.position.copy(sphereCannonBody.position);
    };
};
