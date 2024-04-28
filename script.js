const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'white';

let objects = [];

class object {
    constructor(x, y, xvel, yvel, mass, rad) {
        this.x = x;
        this.y = y;
        this.xvel = xvel;
        this.yvel = yvel;
        this.mass = mass;
        this.rad = calcRad(mass);
    }
}

function calcRad(mass) {
    return (3*mass/4*Math.PI)**(1/3)
}

let sun = new object(800, 500, -0, 0, 2000);
let earth = new object(800, 200, 2.5, 0, 100);
let moon = new object(760, 200, 2.5, 1.5, 10);
let mars = new object(800, 900, -2.1, 0, 100);

objects.push(sun, earth, moon, mars)

function draw(object) {
    ctx.beginPath();
    ctx.arc(object.x, object.y, object.rad, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
}

let cursor = {};

document.addEventListener('click', function(event) {
    cursor.x = event.clientX - 8;
    cursor.y = event.clientY - 8;

    objects.push(new object(cursor.x, cursor.y, Number(prompt('x velocity')), Number(prompt('y velocity')), Number(prompt('mass'))));
})

function findAngle(a, b) {
    return Math.atan2(a.y - b.y, a.x - b.x)
}

function distSqr(a, b) {
    return (a.x - b.x)**2 + (a.y - b.y)**2
}

function attraction(a, b) {
    return a.mass*b.mass/distSqr(a, b)
}

function gravity() {
    for(i in objects) {
        for(u in objects) {
            if(objects[i] != objects[u]) {
                objects[i].xvel -= attraction(objects[i], objects[u])*Math.cos(findAngle(objects[i], objects[u]))/objects[i].mass
                objects[i].yvel -= attraction(objects[i], objects[u])*Math.sin(findAngle(objects[i], objects[u]))/objects[i].mass
            }
        }
    }
}

function collision() {
    for(i in objects) {
        for(u in objects) {
            if(objects[i] != objects[u]) {
                if(Math.abs(objects[i].x - objects[u].x) < (objects[i].rad + objects[u].rad) && Math.abs(objects[i].y - objects[u].y) < (objects[i].rad + objects[u].rad)) {
                    objects.push(new object(((objects[i].x * objects[i].mass + objects[u].x * objects[u].mass)/(objects[i].mass + objects[u].mass)), (objects[i].y * objects[i].mass + objects[u].y * objects[u].mass)/(objects[i].mass + objects[u].mass), (objects[i].xvel*objects[i].mass + objects[u].xvel*objects[u].mass)/(objects[i].mass + objects[u].mass), (objects[i].yvel*objects[i].mass + objects[u].yvel*objects[u].mass)/(objects[i].mass + objects[u].mass), objects[i].mass + objects[u].mass, calcRad(objects[i].mass + objects[u].mass)))
                    objects.splice(i, 1)
                    if(u > i) {
                        u--
                    }
                    objects.splice(u, 1)
                }
            }
        }
    }
}

window.requestAnimationFrame(loop);

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gravity();

    collision();

    for(i in objects) {
        objects[i].x += objects[i].xvel
        objects[i].y += objects[i].yvel
        draw(objects[i]);
    }   

    window.requestAnimationFrame(loop);
}


