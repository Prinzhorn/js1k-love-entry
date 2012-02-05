with(b.style){margin=0;overflow='hidden'}

var
	//Set width and height to window size
	r = c.width = innerWidth,
	s = c.height = innerHeight,

	//We use the half of width and hide some times
	j = r/2,
	k = s/2,

	//The array containing the hearts
	h = [],

	//For computing sine. Will increment over time
	t = 0,

	P = Math.PI,
	S = Math.sin;

//Now we can use b and c as usual variables, because we don't need body or canvas

setInterval(function(i, g) {
	t += .004;

	for(;h[i];i++)with(a) {
		b = h[i];
		g = b[0] *= 1.1;

		fillStyle = b[3];

		lineWidth = .2;

		beginPath();
		arc(b[1] - g, c = b[2] - g, g, P*.8, P*2);
		arc(b[1] + g, c, g, P, P*2.2);
		lineTo(b[1], b[2] + g*2);
		closePath();

		fill();
		stroke();
	}

	//var x = x/s/.02 - (h.x*50/s);
	//var y = -y/s/.02 + (h.y*50.5/s);

	//(x*x + 2 * (b = (y - .9 * Math.sqrt( x<0?-x:x ))) * b)


	//Append a new element if the array is empty OR if the last element is big enough
	(!i || g > 1.15) && h.push([1, (c=S(t)/2)*j+j, c*k+k, 'rgb(' + ((Math.random()*55+200) | 0) + ',0,0)']);

	//Remove the first element if big enough
	h[0][0]>j&&h.shift();
}, 33, 0);
