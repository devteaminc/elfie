var svgns = "http://www.w3.org/2000/svg";
function rectan()
{
// Set the number of circles
for (var i = 0; i < 2500; i++) {
    var x = Math.random() * 1750,
        y = Math.random() * 750;
        // Choose the max circle size
        r = Math.random() * 2;
    var circ = document.createElementNS(svgns, 'circle');
    circ.setAttributeNS(null, 'cx', x);
    circ.setAttributeNS(null, 'cy', y);
    circ.setAttributeNS(null, 'r', r);
    circ.setAttributeNS(null, 'fill', '#fff');
    //Set start and end point for x and y 
    var a = Math.floor(Math.random() * 850);
    var b = Math.floor(Math.random() * 2750);
    var str = a+';'+b;
    var c = Math.floor(Math.random() * -750);
    var d = Math.floor(Math.random() * 1750);
    var stry = c+';'+d;
    
   var anix = document.createElementNS(svgns, 'animate');
   anix.setAttributeNS(null, 'attributeName', 'cx');
   anix.setAttributeNS(null, 'values', str);
   // Set animation time for x traverse
   anix.setAttributeNS(null, 'dur', "60s");
   anix.setAttributeNS(null, 'repeatCount', "indefinite");
   var aniy = document.createElementNS(svgns, 'animate');
   aniy.setAttributeNS(null, 'attributeName', 'cy');
   aniy.setAttributeNS(null, 'values', stry);
   // Set animation time for y traverse
   aniy.setAttributeNS(null, 'dur', "60s");
   aniy.setAttributeNS(null, 'repeatCount', "indefinite");
   $(circ).append(anix, aniy);
    document.getElementById('svg').appendChild(circ);   
  }
}
rectan();
	 
  