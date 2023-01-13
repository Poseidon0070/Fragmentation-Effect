let canvas = document.getElementById("canvas");
const gui = new dat.GUI();
canvas.style.backgroundColor = "rgba(0,0,0,1)";

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var c = canvas.getContext("2d");

// --------------------- UTILITY FUNCTIONS --------------------------------------------------

function randomInt(min,max){
    return Math.floor((Math.random() * (max-min+1)) + min); 
}
const colorArray = ["#363432","#196774","#90A19D","#F0941F","#EF6024"];
function randomColor(colorArray){
    var x = Math.floor(Math.random()*colorArray.length);
    return colorArray[x];
};
window.addEventListener('resize',function(){
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    init();
})
function getDistance(x1,y1,x2,y2){
    var xDistance = x2-x1;
    var yDistance = y2-y1;
    return Math.sqrt(Math.pow(xDistance,2)+Math.pow(yDistance,2));
}
var mouse = {
    x:innerWidth/2,
    y:innerHeight/2
}
window.addEventListener('mousemove',function(event){
    mouse.x = event.x;
    mouse.y = event.y;
})

// ---------------------------------------------------------------------------------------------

var gravity = 0.005;
var friction = 0.98;
function particle(x,y,dx,dy,radii){
    this.x = x;
    this.y = y;
    this.radius = radii;
    this.alpha = 1;
    this.color = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
    // this.color = `hsl(${Math.random()*360},${Math.random()*100}%,${Math.random()*100}%)`;

    this.velocity = {
        x : dx,
        y : dy
    }

    this.draw = function(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fillStyle = this.color;
        c.fill();
    }
    //when alpha becomes less than 0 particle get removed
    // this.update = function(){
    //         this.x += this.velocity.x*friction;
    //         this.y += this.velocity.y*friction;
    //         this.velocity.y += gravity;
    //         this.alpha -= 0.003;
    //         this.draw();
    //     }
    //Fading effect
    this.update = function(){
        c.save();
        c.globalAlpha = this.alpha;
        this.x += this.velocity.x*friction;
        this.y += this.velocity.y*friction;
        this.velocity.y += gravity;
        this.alpha -= 0.003;
        this.draw();
        c.restore();
    }
    }
const properties = {
    particleNos : 400,
    particlePower : 4
}
const propertyFolder = gui.addFolder("Properties");
propertyFolder.add(properties,'particleNos',0,1000);
propertyFolder.add(properties,'particlePower',1,15);
propertyFolder.open();
var particles;
var radius = 5;
mouse = {
    x : innerWidth/2,
    y : innerHeight/2
}
function init(){
    particles = [];
}
$(window).on("click", (event) =>{ 
    if(!(mouse.x >= window.innerWidth-200 && mouse.y <= 100)){  
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        var increment = Math.PI*2/properties.particleNos;
        for(let i=0;i<properties.particleNos;i++){
            particles.push(new particle(mouse.x,mouse.y,Math.sin(increment*i)*properties.particlePower*Math.random(),Math.cos(increment*i)*properties.particlePower*Math.random(),radius));
        }
    }
})
//ha
function animate(){
    requestAnimationFrame(animate);
    c.fillStyle = `rgba(0,0,0,0.05)`;
    c.fillRect(0,0,innerWidth,innerHeight);
    particles.forEach((particle,i) => {
        if(particle.alpha > 0){
            particle.update();
        }else{
            particles.splice(i,1);
        }
    });
}
init();
animate();

