
function HudDraw(sprite) 
{
  var canvas = document.getElementById('hud');
  var context = canvas.getContext('2d');

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.fillStyle = '#00BF10';
  context.rect(canvas.width*0.049, canvas.height*0.897, 206, 46);
  context.lineWidth = '6';
  context.stroke();
  context.fillRect(canvas.width*0.05, canvas.height*0.9, sprite.health*2, 40);
}
