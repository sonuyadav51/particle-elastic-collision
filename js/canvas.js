//Initiaing canvas

const canvas = document.querySelector('#canvas')
const c = canvas.getContext('2d')
// Settng width and height
canvas.width = innerWidth
canvas.height = innerHeight
// Creating mouse posiston
const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}
//Variables
const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

// Utility Funtion
function randomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}



 function rotate(velocity, angle) {
  const rotatedVelocities = {
      x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
      y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };

  return rotatedVelocities;
}



function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

      // Grab angle between the two colliding particles
      const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

      // Store mass in var for better readability in collision equation
      const m1 = particle.mass;
      const m2 = otherParticle.mass;

      // Velocity before equation
      const u1 = rotate(particle.velocity, angle);
      const u2 = rotate(otherParticle.velocity, angle);

      // Velocity after 1d collision equation
      const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
      const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

      // Final velocity after rotating axis back to original location
      const vFinal1 = rotate(v1, -angle);
      const vFinal2 = rotate(v2, -angle);

      // Swap particle velocities for realistic bounce effect
      particle.velocity.x = vFinal1.x;
      particle.velocity.y = vFinal1.y;

      otherParticle.velocity.x = vFinal2.x;
      otherParticle.velocity.y = vFinal2.y;
  }
}

// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init();
})

// Particle
class Particle {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.velocity = {
    x: (Math.random() - 0.5) * 3,
    y: (Math.random() - 0.5) * 3
    }
    this.radius = radius
    this.color = color
    this.mass = 1
    this.opacity = 0
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
     c.save()
    c.globalAlpha = this.opacity
    c.fillStyle = this.color
    c.fill();
    c.restore()
    c.strokeStyle = this.color
    c.stroke()
    c.closePath()
  }

  update(particles) {

    this.draw()

    for(let i=0;i<particles.length;i++){
    if(this === particles[i]) continue;

    if(distance(this.x,this.y,particles[i].x,particles[i].y) - this.radius * 2 < 0){
          resolveCollision(this,particles[i])
    }

  }
  if(this.x - this.radius < 0  || this.x + this.radius > innerWidth){
    this.velocity.x = -this.velocity.x;
  }
  if(this.y - this.radius < 0  || this.y + this.radius > innerHeight){
    this.velocity.y = -this.velocity.y;
  }
 // mouse collision detection
 if(distance(mouse.x,mouse.y,this.x,this.y) < 140 && this.opacity < 0.2){
   this.opacity += 0.02
 }else if(this.opacity > 0){
  this.opacity -= 0.02
  this.opacity = Math.max(0,this.opacity)
 }

   this.x += this.velocity.x;
   this.y += this.velocity.y
  }
}




// Implementation or Creating multiple Shapes 
let particles;
function init() {
 particles = [];
	for(let i =0; i< 300;i++){
//generating first Particle cordinate
    const radius = 16
    let x = randomIntBetween(radius,canvas.width - radius)
    let y = randomIntBetween(radius,canvas.height - radius)

    const color = randomColor(colors)

// Removing overlapping of Particles on each other
if(i !== 0){
// checking for next created  Particle overlaped or each other or not
  for(let j=0; j<particles.length;j++){
   if(distance(x,y,particles[j].x,particles[j].y) - radius * 2 < 0){
      x = randomIntBetween(radius,canvas.width - radius)
      y = randomIntBetween(radius,canvas.height - radius)
      j = -1;
}
  }
}

		particles.push(new Particle(x,y,radius,color));

	}

}



// Animation Loop for Multiple Shapes

function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)

 particles.forEach((particle) => {
	  particle.update(particles);
 })
 
}

init()
animate()
