/*
 * TODO:
 * -clipping (more curvy turns)
 * -remove sine/cosine in favour of heart shaped turns
 * -music?
 */

/*
 * Props for the idea on how to draw a heart go to: http://www.mathematische-basteleien.de/heart.htm
 * I also had a working version using single pixels and a function (see below), but drawing arcs and lines is WAY faster.
 *
 * Original heart function
 * var x = x/s/.02 - (h.x*50/s);
 * var y = -y/s/.02 + (h.y*50.5/s);
 * (x*x + 2 * (b = (y - .9 * Math.sqrt( x<0?-x:x ))) * b) && (...draw red pixel...)
 *
 * Each heart is stored inside an array: [size, x, y, color]
 */

//"with" isn't worth it for two properties
b=b.style;
b.overflow='hidden';

var
	//Set width and height to window size
	//We use the half of width and height quite some times
	j = (c.width = innerWidth)/2,
	k = (c.height = innerHeight)/2,

	//The array containing the hearts
	h = [],

	//The array containing the audio
	m = [],

	//For computing sine. Will increment over time.
	//And a counter for the audio index
	//And we set the bodys margin to 0 (b is now the body's style prop)
	t = l = b.margin = 0,

	M = Math,
	P = M.PI,
	C = M.cos;


//Now we can use b and c as usual variables, because we won't need body or canvas


//Prepare audio (more bytes, but faster than on the fly)
for(b = 0; b < 25; b++) {
	var
		D = '\0\0',
		//'KNPNK_KNPNK_KOPOK_KOPOK_KNPNKJ_KNPNK_I_JNPNJ_JNPNJ__JKPKJ_JKMKJ'
		K = 'KNPNK_KNPNK_KOPOK_KOPOK_'.charCodeAt(b),
		v;

	for(c = 0; K < 95 && c < 6e3;) D += String.fromCharCode((v = M.max(-1e4,M.min(1e4,1e6*M.sin(c*M.pow(2,K/12)/695)))/M.exp(c++/3e3)) & 255, v >> 8 & 255);

	console.log(D.length);

	m[b] = new Audio('data:audio/wav;base64,UklGRgAAAABXQVZFZm10IBAAAAABAAEAwF0AAIC7AAACABAAZGF0YSBO' + btoa(D));
}

setInterval(function(i, g) {
	//Now scope everything to the canvas context, because we are doing a shitload of method calls
	with(a)
		//Iterate over all hearts (h[i] will be undefined at some time, which will then trigger restore())
		//The translation will keep it centered
		for(save() || translate(-C(t++/250)*j/2, 0); b = h[i] || restore(); i++) {

			//Make the heart bigger and keep track of the new size, because we need this value often
			//This value will also come in handy after the loop is finished, because we need the size of the last heart for removing it
			g = b[0] *= 1.1;

			/*
			 * blame @jedschmidt for this looking so fucked up
			 * we are basically saving semicolons by nesting function calls
			 * start reading from inner most expression (which is still not exactly the order it executes)!
			 */

			//At the end, fill the heart and add a stroke
			stroke(
				fill(
					//The left part (close the heart). Only needed because we are drawing a stroke! Wouldn't for just fills.
					closePath(
						//The right lower part of the "peak"
						lineTo(
							//Parameters for the line segment (x, y + size*2)
							b[1], b[2] + g*2,

							//Right arc/curve of the heart
							arc(
								//Parameters for drawing the right (x + size, y - size, some radian, some radian)
								b[1] + g, c = b[2] - g, g, P, P*2.2,

								//Left arc/curve of the heart
								arc(
									//Parameters for drawing the left arc (x - size, y - size, some radian, some radian)
									b[1] - g, c, g, P*.8, P*2,

									//Start a new path for our heart
									beginPath(
										//Some decent black (=== default strokeStyle) thin line
										fillStyle = b[3], lineWidth = .2
									)
								)
							)
						)
					)
				)
			)
		}


	//Append a new element if the array is empty OR if the last element is big enough
	(!i || g > 1.2) && (h[i]=[1, (c=C(t/250)/2)*j+j, k, 'rgb(' + ((Math.random()*55+200) | 0) + ',0,0)']);

	//Remove the first element if big enough
	h[0][0]>j&&h.shift();

	//Play next tone if enough time past by
	(t%6) || m[l++%24].play();
}, 33, 0);
