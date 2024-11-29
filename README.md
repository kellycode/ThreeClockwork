
# ngClockwork 

$${\color{green}20241129:}$$ Fixed save to local storage and file download but position change data isn't getting updated in the editor  

$${\color{green}20241129:}$$ Fixed position change updates and turned off file download for now, need to ability to name the save.

A THREE JS scene editor that I can make, save and load scene layout. I just want to add models and move them around and then save the layout and import it into a THREE project.  Current plan is to simplify it and update to the latest THREE.

ngClockwork uses keyboard commands and clicks to add, remove and edit world model position, scale and material, textures and attributes.

Camera movement uses W,A,S,D,Q, E and number pad +, - when a model is not selected.

Textures and DAE models to be used are loaded based on what's in the directories so they can be simply added as needed.

Model movement context is relative to the current camera direction (broken atm) when appropriate ( such as: Forward arrow always moves the model away from you )

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
 - 'ng' cause it's made with Angular and 'Clockwork' cause it's got a lot of small moving parts
