![banner](https://github.com/user-attachments/assets/dea72f27-23d1-4131-bd77-6b0d4402a9a0)

An interactive star field background effect with html canvas.

[Demo playground](https://annikav9.github.io/starfield.js)

## Usage
Define a container element and an origin element with the `starfield` and `starfield-origin` classes.
```html
<div class="starfield">
  <button class="starfield-origin">Hover me!</button>
</div>
```
Size and position them as required, here's an example:
```css
.starfield {
  height: 100%;
  width: 100%;
}
.starfield-origin {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```
Source the script:
```html
<script src="starfield.js"></script>
```
Start the star field:
```html
<script>
  Starfield.setup();
</script>
```
Or import as a module:
```javascript
import Starfield from './starfield.js';

Starfield.setup();
```
You can tweak the effect with configuration options:
```javascript
Starfield.setup({
  // Default values
  numStars: 250,                    // Number of stars
  baseSpeed: 1,                     // Base speed of stars (will affect acceleration)
  trailLength: 0.8,                 // Length of star trail (0-1)
  starColor: 'rgb(230, 230, 100)',  // Color of stars (only rgb)
  canvasColor: 'rgb(0, 0, 0)',      // Canvas background color (only rgb)
  hueJitter: 0,                     // Maximum hue variation in degrees (0-360)
  maxAcceleration: 10,              // Maximum acceleration
  accelerationRate: 0.2,            // Rate of acceleration
  decelerationRate: 0.2,            // Rate of deceleration
  minSpawnRadius: 80,               // Minimum spawn distance from origin
  maxSpawnRadius: 500,              // Maximum spawn distance from origin
});
```
Use the [demo playground](https://annikav9.github.io/starfield.js) to experiment.

Set options while the star field is running through `Starfield.config`:
```javascript
Starfield.config.starColor = 'rgb(255, 99, 71)';
```
> [!NOTE]
> - If you see persistent lines on the canvas, try setting `trailLength` to a lower value.
> - The `numStars` option cannot be changed after the star field is started.

## Manual mode
If you don't want the origin to be bound to an element, use manual mode:
```js
Starfield.setup({
  auto: false,
  originX: 100,  // container width / 2 if not set
  originY: 250,  // container height / 2 if not set
});
```
In this mode, a few features are disabled:
- Acceleration on hover (not bound to an element)
- Origin element tracking (not bound to an element)
- Automatic canvas resizing

However, functions are exposed for manual control:
```javascript
/**
 * Set the origin of the starfield to a specific point.
 * @param {number} x The x-coordinate of the origin.
 * @param {number} y The y-coordinate of the origin.
 */
function setOrigin(x, y)
```
```javascript
/**
 * Set the x-coordinate of the origin of the starfield.
 * @param {number} x The x-coordinate of the origin.
 */
function setOriginX(x)
```
```javascript
/**
 * Set the y-coordinate of the origin of the starfield.
 * @param {number} y The y-coordinate of the origin.
 */
function setOriginY(y)
```
```javascript
/**
 * Resize the starfield to a new width and height.
 * @param {number} newWidth The new width of the starfield.
 * @param {number} newHeight The new height of the starfield.
 */
function resize(newWidth, newHeight)
```
```javascript
/**
 * Set the acceleration state of the starfield.
 * @param {boolean} state The acceleration state.
 */
function setAccelerate(state)
```

## Credits
Inspired by Barney Code's [Star Field Hyperdrive Light Speed Effect](https://www.youtube.com/watch?v=p0I5bNVcYP8)

## License
This project is licensed under the [MIT License](/LICENSE)
