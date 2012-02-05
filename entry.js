/*
 * Props for the idea on how to draw a heart go to: http://www.mathematische-basteleien.de/heart.htm
 * I also had a working version using single pixels and a function, but drawing arcs and lines is WAY faster.
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

	//For computing sine. Will increment over time.
	//And we set the bodys margin to 0 (b is now the body's style prop)
	t = b.margin= 0,

	P = Math.PI,
	S = Math.sin;

//Now we can use b and c as usual variables, because we don't need body or canvas

setInterval(function(i, g) {
	//Time is moving forward ;-)
	t += .004;

	//Now scope everything to the canvas context, because we are doing a shitload of method calls
	with(a) {
		save();

		//Rotate around center (lean into the turn)
		//translate(j, k);
		//rotate(S(t+P/2)/4);
		//translate(-j, -k);

		//Keep it centered
		translate(-S(t)*j/2, -S(t)*k/2);

		//Iterate over all hearts (h[i] will be undefined at some time)
		for(;h[i];i++) {
			//Keep track of the current heart. Saves bytes instead of writing h[i] all the time
			b = h[i];

			//Make the heart bigger and keep track of the new size, because we need this value often
			//This value will also come in handy after the loop is finished, because we need the size of the last heart for removing it
			g = b[0] *= 1.1;

			//TODO instead of hiding smal hearts, they should actually be visible depending on the curve
			//if(g < 3) {
				//continue;
			//}

			//The fourth position of a heart array is the color
			fillStyle = b[3];

			//Some decent black (=== default strokeStyle) line
			lineWidth = .2;

			beginPath();

			//Left circle part
			arc(b[1] - g, c = b[2] - g, g, P*.8, P*2);

			//Right circle part
			arc(b[1] + g, c, g, P, P*2.2);

			//The right of the lower part (the "peak")
			lineTo(b[1], b[2] + g*2);

			//Will do the left part. Only needed because we are drawing a stroke! Not for fills.
			closePath();

			fill();
			stroke();
		}

		restore();
	}


	//var x = x/s/.02 - (h.x*50/s);
	//var y = -y/s/.02 + (h.y*50.5/s);

	//(x*x + 2 * (b = (y - .9 * Math.sqrt( x<0?-x:x ))) * b)


	//Append a new element if the array is empty OR if the last element is big enough
	(!i || g > 1.15) && (h[i]=[1, (c=S(t)/2)*j+j, c*k+k, 'rgb(' + ((Math.random()*55+200) | 0) + ',0,0)']);

	//Remove the first element if big enough
	h[0][0]>j&&h.shift();
}, 33, 0);
