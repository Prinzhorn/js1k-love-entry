/*
 * READ BEFORE: Please don't try to understand everything. That's the code I actually handcrafted, but even after a one day break it was hard to start again. You have been warned.
 *
 * Props for the idea on how to draw a heart go to: http://www.mathematische-basteleien.de/heart.htm
 * I also had a working version using single pixels and a function (see below), but drawing arcs and lines is WAY faster.
 * The same goes for drawing text, which is WAY to slow.
 *
 * Original heart function
 * var x = x/s/.02 - (h.x*50/s);
 * var y = -y/s/.02 + (h.y*50.5/s);
 * (x*x + 2 * (b = (y - .9 * Math.sqrt( x<0?-x:x ))) * b) && (...draw red pixel...)
 *
 *
 * Each heart is stored inside an array: [size, x, y, color, time added]
 */

var
	//Set width and height to window size
	//We use the half of width and height quite some times
	j = (c.width = 999)/2,
	k = (c.height = 400)/2,

	//The array containing the hearts
	h = [],

	//t = time, d = direction of player (-1,0,+1), x = player position
	t = d = x = 0,

	//will reference the size of the current heart inside the loop
	g,

	M = Math,
	P = M.PI,
	C = M.cos;


//Give me that cinema feeling
with(c.style){display='block';margin='auto';border='solid #000';borderWidth='99px 2px'}


//Now we use b and c as usual variables, because we won't need body or canvas


onkeydown = function(e) {
	if(!d) {
		e = e.which;

		//left === 37
		e-37 || (d = -1);

		//right === 39
		e-39 || (d = 1)
	}
}

onkeyup = function() {d=0}


setInterval(function(i) {
	//Now scope everything to the canvas context, because we are doing a shitload of method calls
	with(a) {
		save(
			clearRect(0, 0, j*2, k*2)
		);

		//Iterate over all hearts
		//The translation will keep it centered around the 8th element
		for(translate(-C((h[8] && h[8][4] ||  t)/100) * j/2 + j, 0); b = h[i]; i++) {
		//for(save(); b = h[i]; i++) {

			//Make the heart bigger and keep track of the new size, because we need this value often
			//This value will also come in handy after the loop is finished, because we need the size of the last heart for removing it
			g = b[0] *= 1.1;

			/*
			 * blame @jedschmidt and @140bytes for this looking so fucked up :-D
			 * we are basically saving semicolons by nesting function calls (only makes sense if function doesn't expect ANY params).
			 * start reading from inner most expression (which is still not exactly the order it executes)!
			 */

			//At the end, fill the heart
			fill(
				//The left part (close the heart). Only needed because we are drawing a stroke! Wouldn't for just fills.
				closePath(
					//The right lower part of the "peak"
					lineTo(
						//Parameters for the line segment (x, y + size*2)
						b[1], b[2] + g * 2,

						//Right arc/curve of the heart
						arc(
							//Parameters for drawing the right (x + size, y - size, some radian, some radian)
							b[1] + g, c = b[2] - g, g, P, P * 2.2,

							//Left arc/curve of the heart
							arc(
								//Parameters for drawing the left arc (x - size, y - size, some radian, some radian)
								b[1] - g, c, g, P * .8, P * 2,

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

			//We use the 19th heart for clipping. It's no rocket science, but looks OK.
			i - 38 || clip(save())
		}

		i>38 && restore();

		c = C(t++/100) * j/2;

		b = (200 * (b = C(t/15)) * b * b * b + 50) | 0;

		//(!i || g > 1) && (h[i] = [1, c, k, 'rgb(' + b + ',0,0)', t]);

		restore(
			//Append a new heart
			h[i] = [1, c, k, 'rgb(' + b + ',0,0)', t]
		);

		fillStyle = 'rgb(0, 0, ' + b + ')';

		//The player
		//fillRect(c, k + 20, 18, 99, t++);
		save(
			c = -c*2 + j*2 - 50 + x
		);

		scale(1, .5);

		//cursive font family gives us some perspective look
		font = '150px cursive';

		save();
		//Rotate the arrow when moving left or right
		translate(j, k+50);
		rotate(.05*d);
		translate(-j, -k-50);

		restore(
			fillText('↑', c, k*2 + 150)
		);

		//Render the score
		fillText(t, 10, 150);

		//Remove the first element if big enough
		h[0][0] > j && h.shift();

		restore(
			x += d*6
		);

		if(M.abs(c - j + 50) > 200) {
			alert('DOH! You hit the wall...\nYour score: ' + t);
			d = t = x = 0;
			h = [];
		}
	}
}, 33, 0);
