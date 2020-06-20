// ROTATE A VECTOR AROUND AN AXIS
// var vector = new THREE.Vector3(1, 0, 0);
// var axis = new THREE.Vector3(0, 1, 0);
// var angle = Math.PI / 2;
// vector.applyAxisAngle(axis, angle);

//vector = camera.getWorldDirection();
//theta = Math.atan2(vector.x, vector.z);
//theta is in radians. This is how I orient my game's
//character to face the same way the camera is facing.
//The getWorldDirection() is a fairly new option on camera.


var _canContinueForward_1 = function (currX, currZ, nextX, nextZ) {

    _temp(currX, currZ, nextX, nextZ);

    var minAllowed = 1.0;

    var camPositionVector = camera.position.clone();

    var xPosRaycastDirection = new THREE.Vector3(1, 0, 0);
    var xNegRaycastDirection = new THREE.Vector3(-1, 0, 0);
    var zPosRaycastDirection = new THREE.Vector3(0, 0, 1);
    var zNegRaycastDirection = new THREE.Vector3(0, 0, -1);

    var xPosSmallestDistance = 2;
    var xNegSmallestDistance = 2;
    var zPosSmallestDistance = 2;
    var zNegSmallestDistance = 2;

    var xPosRaycaster = new THREE.Raycaster(camPositionVector, xPosRaycastDirection);
    var xNegRaycaster = new THREE.Raycaster(camPositionVector, xNegRaycastDirection);
    var zPosRaycaster = new THREE.Raycaster(camPositionVector, zPosRaycastDirection);
    var zNegRaycaster = new THREE.Raycaster(camPositionVector, zNegRaycastDirection);

    var xPosIntersects = xPosRaycaster.intersectObjects(threeScene.pickerObjects);
    var xNegIntersects = xNegRaycaster.intersectObjects(threeScene.pickerObjects);
    var zPosIntersects = zPosRaycaster.intersectObjects(threeScene.pickerObjects);
    var zNegIntersects = zNegRaycaster.intersectObjects(threeScene.pickerObjects);

    if (xPosIntersects.length > 0) {
        xPosSmallestDistance = xPosIntersects[0].distance;
        for (var i = 0; i < xPosIntersects.length; i++) {
            if (xPosIntersects[i].distance < xPosSmallestDistance) {
                xPosSmallestDistance = xPosIntersects[i].distance;
            }
        }
    }

    if (xNegIntersects.length > 0) {
        xNegSmallestDistance = xNegIntersects[0].distance;
        for (var i = 0; i < xNegIntersects.length; i++) {
            if (xNegIntersects[i].distance < xNegSmallestDistance) {
                xNegSmallestDistance = xNegIntersects[i].distance;
            }
        }
    }

    if (zPosIntersects.length > 0) {
        zPosSmallestDistance = zPosIntersects[0].distance;
        for (var i = 0; i < zPosIntersects.length; i++) {
            if (zPosIntersects[i].distance < zPosSmallestDistance) {
                zPosSmallestDistance = zPosIntersects[i].distance;
            }
        }
    }

    if (zNegIntersects.length > 0) {
        zNegSmallestDistance = zNegIntersects[0].distance;
        for (var i = 0; i < zNegIntersects.length; i++) {
            if (zNegIntersects[i].distance < zNegSmallestDistance) {
                zNegSmallestDistance = zNegIntersects[i].distance;
            }
        }
    }

    if (xPosSmallestDistance < minAllowed) {
        console.log(xPosSmallestDistance);
        camera.position.x = currX;
    }

    if (xNegSmallestDistance < minAllowed) {
        console.log(xNegSmallestDistance);
        camera.position.x = currX;
    }

    if (zPosSmallestDistance < minAllowed) {
        console.log(zPosSmallestDistance);
        camera.position.z = currZ;
    }

    if (zNegSmallestDistance < minAllowed) {
        console.log(zNegSmallestDistance);
        camera.position.z = currZ;
    }
};

var _temp = function (pos) {

    // THE POINT OF ALL OF THIS IS WE WANT TO CHECK
    // COLLISIONS USING THE DIRECTION WE JUST MOVED IN
    // ANY DIRECTION AND THEN MAKE CORRECTIONS BASED ON
    // COLLISIONS - WHY? - BECAUSE THIS MEANS WE GET TO
    // KEEP ANY VALID CHANGES AND DISCARD COLLISIONS
    // (SLIDING)

    // USE CURRENT CAMERA TO GET DIRECTION - THE PREVIOUS
    // WAS TO GET THE HYPOTHETICAL DIRECTION - THE ACTUAL
    // CAMERA STARTING POSITION IS GOOD AS IT IS
    var camPositionVector = camera.position.clone();


    // USE THE CURRENT PLAYER/CAMERA POSITION AND
    // POTENTIAL POSITION TO CREATE POSITION VECTORS
    var currentPositionVector = new THREE.Vector3(pos.currX, 0, pos.currZ);
    var nextPositionVector = new THREE.Vector3(pos.nextX, 0, pos.nextZ);


    var nextZVector = new THREE.Vector3(0, 0, pos.nextZ);
    var nextXVector = new THREE.Vector3(pos.nextX, 0, 0);
    var currZVector = new THREE.Vector3(0, 0, pos.currZ);
    var currXVector = new THREE.Vector3(pos.currX, 0, 0);


    // Make a direction Vector out of the before and
    // after positions
    var directionOfMotion = new THREE.Vector3();
    directionOfMotion.subVectors(nextPositionVector, currentPositionVector);
    directionOfMotion.normalize();


    var directionOfZMotion = new THREE.Vector3();
    directionOfZMotion.subVectors(nextZVector, currZVector);
    directionOfZMotion.normalize();


    var directionOfXMotion = new THREE.Vector3();
    directionOfXMotion.subVectors(nextXVector, currXVector);
    directionOfXMotion.normalize();

    // START FOR THE HELPER ARROWS
    // once the helperArrows are defined, remove them before redraw
    if (threeScene.scene.arrow1 && threeScene.scene.arrow2 && threeScene.scene.arrow3) {
        threeScene.scene.remove(threeScene.scene.arrow1);
        threeScene.scene.remove(threeScene.scene.arrow2);
        threeScene.scene.remove(threeScene.scene.arrow3);
    }

    // arrows start where the camera is now
    var arrowPos = camera.position.clone();
    // a little lower
    arrowPos.y -= 0.15;
    // draw the arrows
    threeScene.scene.arrow1 = new THREE.ArrowHelper(directionOfMotion, arrowPos, 5, 0x00ff00);
    threeScene.scene.arrow2 = new THREE.ArrowHelper(directionOfZMotion, arrowPos, 5, 0xff0000);
    threeScene.scene.arrow3 = new THREE.ArrowHelper(directionOfXMotion, arrowPos, 5, 0x0000ff);

    threeScene.scene.add(threeScene.scene.arrow1);
    threeScene.scene.add(threeScene.scene.arrow2);
    threeScene.scene.add(threeScene.scene.arrow3);
    // END FOR THE HELPER ARROWS



    // WILL NEED 5 OF THESE
    var forwardRaycaster = new THREE.Raycaster(camPositionVector, directionOfMotion);
    var forwardIntersects = forwardRaycaster.intersectObjects(threeScene.pickerObjects);

    var zRaycaster = new THREE.Raycaster(camPositionVector, directionOfZMotion);
    var zIntersects = zRaycaster.intersectObjects(threeScene.pickerObjects);

    var xRaycaster = new THREE.Raycaster(camPositionVector, directionOfXMotion);
    var xIntersects = xRaycaster.intersectObjects(threeScene.pickerObjects);

    var smallestDistance = 4;
    let lastIntersect;
    var minAllowedDistance = 1.0;


    if (forwardIntersects.length > 0 && forwardIntersects[0].distance < minAllowedDistance) {

        let getPositionAlongTheLine = function (percentage) {
            let x1 = pos.currX;
            let z1 = pos.currZ;
            let x2 = forwardIntersects[0].point.x;
            let z2 = forwardIntersects[0].point.z;

            let x = x1 * (1.0 - percentage) + x2 * percentage;
            let z = z1 * (1.0 - percentage) + z2 * percentage;

            pos.nextX = x;
            pos.nextZ = z;
        };

        getPositionAlongTheLine(minAllowedDistance / forwardIntersects[0].distance);

        console.log('d ' + forwardIntersects[0].distance);
    }
    if (zIntersects.length > 0 && zIntersects[0].distance < minAllowedDistance) {



        //console.log('z ' + zIntersects[0].distance);
        //let fix = zIntersects[0].distance * (minAllowedDistance / zIntersects[0].distance);
        //console.log('.............zFix ' + fix);
    }
    if (xIntersects.length > 0 && xIntersects[0].distance < minAllowedDistance) {
        console.log('x ' + xIntersects[0].distance);
    }

};

var fSaves = function () {
    // FOR THE HELPER ARROWS
    var axis = new THREE.Vector3(0, 1, 0);
    // shift the angle left 45 degrees
    var newangle = Math.PI / 4;
    // clone the movement direction vector
    var direction2 = directionOfMotion.clone();
    // and then apply the rotation left
    direction2.applyAxisAngle(axis, newangle);
    // normalize
    direction2.normalize();
};