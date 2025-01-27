# Interactive dots background <br>
A dynamic interactive dot background using HTML canvas and JavaScript. <br>
## Configuration <br>
You can customize the following parameters in the JavaScript file: <br>
- `dotMargin`: Margin for dots before interaction.
- `dotDiameter`: Diameter of the dots.
- `interactionCircleHitboxRadius`: Radius of the interaction circle hitbox.
- `interactionCircleColor`: Color of the interaction circle hitbox.
- `singleDotHitboxColor`: Color of the single dot hitbox.
- `dotColor`: Default color of dots.
- `dotTouchColor`: Color of dots when touched by the interaction circle.
- `pullStrength`: Strength of dot pull to interaction hitbox. (Negative for bulge, positive for pinch)
- `moveDistance`: Distance the dot moves when touched by the single dot hitbox.
- `singleDotHitboxRadius`: Radius for the single dot hitbox.
## Usage <br>
You can toggle the debug setting by setting debug to true or false with the following command: `isDebug = true` <br> <br>
You must add a HTML5 canvas with the dots class and the recommended CSS: `<canvas class="dots" style="position: fixed; width: 100%; height: 100%; background-color: transparent; top: 0; z-index: -10;"></canvas>` <br> 
## Example <br>
https://jsfiddle.net/yh1etzfg/8/ <br> <br>
