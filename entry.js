/*
 * TODO:
 * +clipping (more curvy turns)
 * -remove sine/cosine in favour of heart shaped turns (maybe not, because steering on one axis is enough). BUT we could spice it up by not using the standard sine-
 * -add an arrow
 * -make it controllable
 * -collision detection
 * -highscore (t (number of ticks))
 * -tweet highscore
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
 * Each heart is stored inside an array: [size, x, y, color, time added]
 */

var
	//Set width and height to window size
	//We use the half of width and height quite some times
	j = x = (c.width = 999)/2,//x = player position
	k = (c.height = 400)/2,

	//The array containing the hearts
	h = [],

	//t = time, d = direction of player
	t = d = 0,

	//will reference the size of the current heart inside the loop
	g,

	P = Math.PI,
	C = Math.cos;


with(c.style){display='block';margin='auto';border='solid #000';borderWidth='99px 2px'}


//Now we use b and c as usual variables, because we won't need body or canvas


//Save one function keyword and instead use e.type
onkeyup = function(e) {
	e = e.which;

	d = 0;

	//left === 37
	e-37 || (d = -1);

	//right === 39
	e-39 || (d = 1);
};


setInterval(function(i) {
	//Now scope everything to the canvas context, because we are doing a shitload of method calls
	with(a) {
		//Iterate over all hearts (h[i] will be undefined at some time, which will then trigger restore())
		//The translation will keep it centered
		for(translate(-C((h[8]&&h[8][4]||t)/100)*j/2, 0, save()); b = h[i]; i++) {

			//Make the heart bigger and keep track of the new size, because we need this value often
			//This value will also come in handy after the loop is finished, because we need the size of the last heart for removing it
			g = b[0] *= 1.1;

			/*
			 * blame @jedschmidt and @140bytes for this looking so fucked up :-D
			 * we are basically saving semicolons by nesting function calls.
			 * start reading from inner most expression (which is still not exactly the order it executes)!
			 */

			//At the end, fill the heart
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
									//Some decent black thin line
									fillStyle = b[3]
								)
							)
						)
					)
				)
			);

			//We use the 18th heart for clipping. It's no rocket science, but looks OK.
			i-18 || clip()
		}


		restore();

		c = C(t/100)*j/2+j;

		//Append a new element if the array is empty OR if the last element is big enough
		(!i || g > 1.2) && (h[i]=[1, c, k, 'rgb(' + (b=(200*(b=C(t/15))*b*b*b+40)|0) + ',0,0)', t]);

		//At this point b may be undefined if no new heart was added. But that's ok, because than it will just be ignored in the rgb color.
		fillStyle = 'rgb(0, 0, ' + b + ')';

		//save();

		//translate(j, k+50);
		//rotate(.4*d);
		//translate(-j, -k-50);

		fillRect(c, k+20, 18, 99, t++);

		//restore();

		//Remove the first element if big enough
		h[0][0]>j && h.shift();

		x += d;
		d = 0;

		//restore();
	}
}, 33, 0);
