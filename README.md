
# ngClockwork 

$${\color{green}20241129:}$$ Fixed world save to local storage and file download but mesh change data isn't getting updated in the editor  
$${\color{green}20241129:}$$ Fixed object moved updates and turned off file download for now, need to ability to name the save.

Building a world editor, slow but sure

Built because it makes editing scenes extremely easy and it's fun to play with.

An Angular(1) and [Three.JS](https://github.com/mrdoob/three.js) based  scene editor built for my own amusement back in 2015 and no longer developed as **it uses a custom save file format and it would be more useful to use the format that Three.JS uses and simply move the features I like over to the [ThreeJS Editor](https://threejs.org/editor/) or to use [PlayCanvas](https://github.com/playcanvas/engine) or [nunuStudio](https://github.com/tentone/nunuStudio)

ngClockwork uses keyboard commands and clicks to add, remove and edit world model position, scale and material, textures and attributes.  It's otherwise tedious building scenes with code and the ThreeJS editor at the time didn't save texture data.  Other than updating it to the latest ThreeJS revision 98, I no longer work on this but it does have some useful ideas in it so keep it around and I may build a deployment alternative into the config file.

Camera movement uses W,A,S,D,Q, E and number pad +, - when a model is not selected.

Textures and DAE models to be used are loaded based on what's in the directories so they can be simply added as needed.

Model movement context is relative to the current camera direction when appropriate ( such as: Forward arrow always moves the model away from you )

### Requires
 - It sn't necessary to run but "npm install" will add grunt dependencies for minimized build if you plan to do a deployable version.

### Model keyboard commands:

 - Insert duplicates a model 1 click towards camera and to the right
 - Delete
 - Number pad 5 resets rotations
 - Number pad - lowers
 - Number pad + raises
 - Forward slash / rolls backward
 - Asterisk * rolls forward
 - Home rotate Y axis -
 - End rotate Y axis +
 - Page Up Z axis +
 - Page Down Z axis -
 - Control W, Down Arrow or + raises
 - Control S, Up Arrow or - lowers
 
### Textures:
 - Can't texture DAE models, just primitives.

### Saving

 - There's no validation of saves other than a console log

### The code oddities needed at the time are:

 - It maintains texture and position data in the model userData object.
 - It switches between degrees and radians simply because degrees are easier to visualize.
 - There's no collision detection or ability to change the camera
 
### ngClockwork?
 - 'ng' cause it's made with AngularJS and 'Clockwork' cause it has a lot of small moving parts
