const dotMargin = 20; // Margin for dots before interaction
const dotDiameter = 2; // Dots diameter
const interactionCircleHitboxRadius = 60; // Radius of interaction circle hitbox
const interactionCircleColor = 'rgba(255, 0, 0, 0.5)'; // Color of the interaction circle hitbox
const singleDotHitboxColor = 'rgba(0, 0, 255, 0.5)'; // Color of the single dot hitbox
const dotColor = 'rgb(40,32,46)'; // Color of dots
const dotTouchColor = 'rgb(49,31,46)'; // Color of dots when touched by interaction circle
const pullStrength = -0.5; // Strength of dot pull to interaction hitbox (Negative is bulge, Positive is pinch)
const moveDistance = 15; // Distance the dot moves when touched by single dot hitbox 
const singleDotHitboxRadius = 20; // Radius for the single dot hitbox

const canvas = document.querySelector('canvas.dots');
if (!canvas) {
    console.error('Canvas element with class "dots" not found.');
}
const context = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas(); 

window.addEventListener('resize', function() {
    resizeCanvas();
    dots = createDots(); 
});

function calculateDimensions() {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const numCols = Math.floor(canvasWidth / (dotDiameter + dotMargin));
    const numRows = Math.floor(canvasHeight / (dotDiameter + dotMargin));
    const dotRadius = dotDiameter * 0.5;
    return { numCols, numRows, dotMargin, dotDiameter, dotRadius };
}

function createDots() {
    const dimensions = calculateDimensions();
    const dots = [];
    const xMargin = (canvas.width - (2 * dimensions.dotMargin + dimensions.numCols * dimensions.dotDiameter)) / dimensions.numCols;
    const yMargin = (canvas.height - (2 * dimensions.dotMargin + dimensions.numRows * dimensions.dotDiameter)) / dimensions.numRows;

    for (let i = 0; i < dimensions.numRows; i++) {
        for (let j = 0; j < dimensions.numCols; j++) {
            const x = j * (dimensions.dotDiameter + xMargin) + dimensions.dotMargin + xMargin / 2 + dimensions.dotRadius;
            const y = i * (dimensions.dotDiameter + yMargin) + dimensions.dotMargin + yMargin / 2 + dimensions.dotRadius;
            dots.push({ x, y, originalX: x, originalY: y, radius: dimensions.dotRadius, targetX: x, targetY: y });
        }
    }
    return dots;    
}

function drawDots() {
    dots.forEach(dot => {
        context.beginPath();
        context.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI, false);
        context.fillStyle = dot.color || dotColor;
        context.fill();
    });
}

let isDebug = false;

function drawHitboxes() {
    if (!isDebug) {
        interactionCircleFinalColor = 'transparent';
        singleDotHitboxFinalColor = 'transparent';
    } else {
        interactionCircleFinalColor = interactionCircleColor;
        singleDotHitboxFinalColor = singleDotHitboxColor;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.arc(mouseX, mouseY, interactionCircleHitboxRadius, 0, 2 * Math.PI, false);
    context.fillStyle = interactionCircleFinalColor;
    context.fill();

    dots.forEach(dot => {
        const dx = mouseX - dot.originalX;
        const dy = mouseY - dot.originalY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < singleDotHitboxRadius) {
            context.beginPath();
            context.arc(dot.x, dot.y, 10, 0, 2 * Math.PI, false);
            context.fillStyle = singleDotHitboxFinalColor;
            context.fill();
        }
    });

    
}

let dots = createDots();

let mouseX = 0, mouseY = 0;
let lastMouseMoveTime = 0;

document.addEventListener('mousemove', function(event) {
    const currentTime = Date.now();
    if (currentTime - lastMouseMoveTime > 0) {
        mouseX = event.clientX;
        mouseY = event.clientY;

        dots.forEach(dot => {
            const dx = mouseX - dot.originalX;
            const dy = mouseY - dot.originalY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < singleDotHitboxRadius) {
                const angle = Math.atan2(dy, dx);
                dot.targetX = dot.originalX + Math.cos(angle) * (moveDistance * -1);
                dot.targetY = dot.originalY + Math.sin(angle) * (moveDistance * -1);
                dot.color = dotTouchColor;
            } else if (distance < interactionCircleHitboxRadius) {
                const adjustedPullStrength = pullStrength * (1 - distance / interactionCircleHitboxRadius);
                dot.targetX = dot.originalX + dx * adjustedPullStrength;
                dot.targetY = dot.originalY + dy * adjustedPullStrength;
            } else {
                dot.targetX = dot.originalX;
                dot.targetY = dot.originalY;
                dot.color = dotColor;
            }
        });
        drawHitboxes(); 
        lastMouseMoveTime = currentTime;
    }
});

function updateDots() {
    dots.forEach(dot => {
        dot.x += (dot.targetX - dot.x) * 0.1;
        dot.y += (dot.targetY - dot.y) * 0.1;
    });
    drawDots();
    requestAnimationFrame(updateDots);
}

updateDots();
