
# ThreeClockwork 

![ThreeClockwork view](https://kellycode.github.io/ThreeClockwork/readme_img.jpg)

$${\color{green}20241129:}$$ Fixed save to local storage and file download but position change data isn't getting updated in the editor  

$${\color{green}20241129:}$$ Fixed position change updates and turned off file download for now, need to ability to name the save.  

$${\color{green}20241129:}$$ Objects now move on a grid and relative to camera direction. Texture changes need to sync to save.

A THREE scene builder for designing a scene to save and load into a THREE project.  There's much to do and not ready for use yet.

ThreeClockwork uses keyboard commands and clicks to add, remove and edit position, scale, material, textures and attributes.

Textures and models to be used are loaded based on what's in the directory list generated by GULP so they can be simply added as needed.

Model movement context is relative to the current camera direction when appropriate ( such as: Forward arrow always moves the model away from you )  

Camera movement uses W,A,S,D,Q, E and number pad +, - when a model is not selected

### Requires Nothing
 - It's all basic javascript. There are a few GULP commands for creating lists and minification but "npm install" isn't required.
 - It's designed to be used in a development environment along with THREE projects and not an online tool.

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

 - Currently there's no validation of saves other than a console log.

### The code oddities at this time are:

 - It switches between degrees and radians simply because degrees are easier to visualize.
 - There's no collision detection or ability to change the camera
 - I added cannon.js in a moment of sure, why not and it's not used much
 
