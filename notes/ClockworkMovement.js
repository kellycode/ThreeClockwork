var _canContinueForward = function (pos) {

    var camPositionVector = camera.position.clone();

    // hard wired new vectors
    // currentPositionVector = camPositionVector
    var currentPositionVector = new THREE.Vector3(pos.currX, 0, pos.currZ);
    var nextPositionVector = new THREE.Vector3(pos.nextX, 0, pos.nextZ);

    // always at right angles to where we are
    var nextZVector = new THREE.Vector3(0, 0, pos.nextZ);
    var nextXVector = new THREE.Vector3(pos.nextX, 0, 0);
    var currZVector = new THREE.Vector3(0, 0, pos.currZ);
    var currXVector = new THREE.Vector3(pos.currX, 0, 0);



    // CURRENT MOTION AND LEFT AND RIGHT OFFSETS
    var directionOfMotion = new THREE.Vector3();
    directionOfMotion.subVectors(nextPositionVector, currentPositionVector);
    directionOfMotion.normalize();
    // left
    var leftOfMotion = directionOfMotion.clone();
    var lom_axis = new THREE.Vector3(0, 1, 0);
    var lom_angle = 2 * (Math.PI / 180);
    leftOfMotion.applyAxisAngle(lom_axis, lom_angle);
    // right
    var rightOfMotion = directionOfMotion.clone();
    var rom_axis = new THREE.Vector3(0, 1, 0);
    var rom_angle = -2 * (Math.PI / 180);
    rightOfMotion.applyAxisAngle(rom_axis, rom_angle);


    // UTILITY X AND Z DIRECTION VECTORS
    var directionOfZMotion = new THREE.Vector3();
    directionOfZMotion.subVectors(nextZVector, currZVector);
    directionOfZMotion.normalize();

    var directionOfXMotion = new THREE.Vector3();
    directionOfXMotion.subVectors(nextXVector, currXVector);
    directionOfXMotion.normalize();


    if (false) {
        // START FOR THE HELPER ARROWS
        // remove before redraw
        if (threeScene.scene.mArrow) {
            //threeScene.scene.remove(threeScene.scene.jrArrow);
            //threeScene.scene.remove(threeScene.scene.jlArrow);
            threeScene.scene.remove(threeScene.scene.mArrow);
            threeScene.scene.remove(threeScene.scene.zArrow);
            threeScene.scene.remove(threeScene.scene.xArrow);
        }
        // arrows start where the camera is now
        var arrowPos = camera.position.clone();
        // a little lower
        arrowPos.y -= 0.15;
        // draw the arrows
        //threeScene.scene.jlArrow = new THREE.ArrowHelper(leftOfMotion, arrowPos, 5, 0x00ffff);
        threeScene.scene.mArrow = new THREE.ArrowHelper(directionOfMotion, arrowPos, 5, 0x00ff00);
        //threeScene.scene.jrArrow = new THREE.ArrowHelper(rightOfMotion, arrowPos, 5, 0xffff00);
        //threeScene.scene.zArrow = new THREE.ArrowHelper(left45DegOfMotion, arrowPos, 5, 0xff0000);
        //threeScene.scene.xArrow = new THREE.ArrowHelper(offsetRightOfLeft45, arrowPos, 5, 0x0000ff);
        // add to the scene
        //threeScene.scene.add(threeScene.scene.jlArrow);
        threeScene.scene.add(threeScene.scene.mArrow);
        //threeScene.scene.add(threeScene.scene.jrArrow);
        threeScene.scene.add(threeScene.scene.zArrow);
        threeScene.scene.add(threeScene.scene.xArrow);
        // END FOR THE HELPER ARROWS
    }




    // WILL NEED 5 OF THESE
    var forwardRaycaster = new THREE.Raycaster(camPositionVector, directionOfMotion, 0, 2.0);
    var forwardIntersects = forwardRaycaster.intersectObjects(threeScene.pickerObjects);

    var leftRaycaster = new THREE.Raycaster(camPositionVector, leftOfMotion, 0, 2.0);
    var leftIntersects = leftRaycaster.intersectObjects(threeScene.pickerObjects);

    var rightRaycaster = new THREE.Raycaster(camPositionVector, rightOfMotion, 0, 2.0);
    var rightIntersects = rightRaycaster.intersectObjects(threeScene.pickerObjects);





    var minAllowedDistance = 1.0;

    let adjustForwardMotion = function (offsetIntersectPoint, mainIntersectPoint) {

        let dom = new THREE.Vector3();
        dom.subVectors(offsetIntersectPoint, mainIntersectPoint);
        dom.normalize();

        if (false) {
            if (threeScene.scene.jrArrow) {
                threeScene.scene.remove(threeScene.scene.jrArrow);
            }
            threeScene.scene.jrArrow = new THREE.ArrowHelper(dom, mainIntersectPoint, 5, 0xffff00);
            threeScene.scene.add(threeScene.scene.jrArrow);
        }

        pos.changeX = pos.forwardSpeed * dom.x;
        pos.changeZ = pos.forwardSpeed * dom.z;

    };


    if (forwardIntersects.length > 0 && forwardIntersects[0].distance < minAllowedDistance) {
        if (leftIntersects.length > 0 && rightIntersects.length > 0) {
            if (rightIntersects[0].distance > forwardIntersects[0].distance && leftIntersects[0].distance < forwardIntersects[0].distance) {
                //console.log('looking right');
                adjustForwardMotion(rightIntersects[0].point, forwardIntersects[0].point);
            }
            else if (leftIntersects[0].distance > forwardIntersects[0].distance && rightIntersects[0].distance < forwardIntersects[0].distance) {
                //console.log('looking left');
                adjustForwardMotion(leftIntersects[0].point, forwardIntersects[0].point);
            }
            else {
                //console.log('In a corner');
                pos.changeX = 0;
                pos.changeZ = 0;
            }
        }

    }
};



if (actions.moveForward) {
    let pos = {};
    pos.currX = camera.position.x;
    pos.currZ = camera.position.z;

    pos.forwardSpeed = !actions.moveForwardFast ? constants.USER_MOVE_SPEED : constants.USER_MOVE_FAST_SPEED;

    pos.nextX = camera.position.x - (Math.sin(camera.rotation.y) * pos.forwardSpeed);
    pos.nextZ = camera.position.z - (Math.cos(camera.rotation.y) * pos.forwardSpeed);

    pos.dom = camera.rotation.y;

    pos.changeX = -(Math.sin(pos.dom) * pos.forwardSpeed);
    pos.changeZ = -(Math.cos(pos.dom) * pos.forwardSpeed);

    _canContinueForward(pos);

    if (true) {
        camera.position.x += pos.changeX;//= pos.nextX;//-= Math.cos(camera.rotation.y) * forwardSpeed;
        camera.position.z += pos.changeZ;//= pos.nextZ;//-= Math.sin(camera.rotation.y) * forwardSpeed;
    }

}