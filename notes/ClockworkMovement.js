ClockworkMovement: function(sceneObject) {
    // these become our movements object saved to the template, 
    // all updates rotation, position and scale of scene objects 
    // are maintained here.
    // 
    // position
    this.posX = sceneObject.position.x;
    this.posY = sceneObject.position.y;
    this.posZ = sceneObject.position.z;
    // degrees is loaded from radian rotations
    this.degX = sceneObject.rotation.x * (180 / Math.PI);
    this.degY = sceneObject.rotation.y * (180 / Math.PI);
    this.degZ = sceneObject.rotation.z * (180 / Math.PI);
    // scale
    this.scaX = sceneObject.scale.x;
    this.scaY = sceneObject.scale.y;
    this.scaZ = sceneObject.scale.z;
    // unique scene object
    this.sceneObject = sceneObject;

    // TODO move below into prototype later when 
    // ClockworkMovement is moved out into a factory

    // POSITIONS
    this.modPosX = function(change) {
        this.posX = this.safeChange(this.posX, change);
        this.sceneObject.position.x = this.posX;
    };
    this.modPosY = function(change) {
        this.posY = this.safeChange(this.posY, change);
        this.sceneObject.position.y = this.posY;
    };
    this.modPosZ = function(change) {
        this.posZ = this.safeChange(this.posZ, change);
        this.sceneObject.position.z = this.posZ;
    };
    this.syncPosX = function() {
        this.sceneObject.position.x = this.posX;
    };
    this.syncPosY = function() {
        this.sceneObject.position.y = this.posY;
    };
    this.syncPosZ = function() {
        this.sceneObject.position.z = this.posZ;
    };

    // ROTATIONS
    this.updateRotations = function() {
        var rotX = this.degToRad(this.degX);
        var rotY = this.degToRad(this.degY);
        var rotZ = this.degToRad(this.degZ);
        this.sceneObject.rotation.set(rotX, rotY, rotZ);
    };
    this.resetRotations = function() {
        this.degX = 0;
        this.degY = 0;
        this.degZ = 0;
        this.updateRotations();
    };
    this.modDegX = function(change) {
        this.degX = this.safeChange(this.degX, change);
        this.sceneObject.rotation.x = this.degToRad(this.degX);
    };
    this.modDegY = function(change) {
        this.degY = this.safeChange(this.degY, change);
        this.sceneObject.rotation.y = this.degToRad(this.degY);
    };
    this.modDegZ = function(change) {
        this.degZ = this.safeChange(this.degZ, change);
        this.sceneObject.rotation.z = this.degToRad(this.degZ);
    };
    this.setDegX = function(value) {
        this.degX = value;
        this.sceneObject.rotation.x = this.degToRad(this.degX);
    };
    this.setDegY = function(value) {
        this.degY = value;
        this.sceneObject.rotation.y = this.degToRad(this.degY);
    };
    this.setDegZ = function(value) {
        this.degZ = value;
        this.sceneObject.rotation.z = this.degToRad(this.degZ);
    };
    this.syncDegX = function() {
        this.sceneObject.rotation.x = this.degToRad(this.degX);
    };
    this.syncDegY = function() {
        this.sceneObject.rotation.y = this.degToRad(this.degY);
    };
    this.syncDegZ = function() {
        this.sceneObject.rotation.z = this.degToRad(this.degZ);
    };

    // UTILITIES
    this.safeChange = function(num, change) {
        return ((num * 1000) + (change * 1000)) / 1000;
    };
    this.radToDeg = function(rad) {
        return rad * (180 / Math.PI);
    };
    this.degToRad = function(deg) {
        return deg * (Math.PI / 180);
    };
}