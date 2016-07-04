# Power Tech Tools

This tools was created as a way of re-enforcing what I learned in my power technician
training with current employer around a year ago or so (2014-08-15).  
This is also my first attempt at writing an angularjs based javascript class with [MathML](https://developer.mozilla.org/en-US/docs/Web/MathML) to represent the different variations of solving for WAV [Watts, Amps, Volts] and VAR [ Volts, Amps, Resistance ].
This WebApp also uses the browsers local storage to store a history of your power calculations in JSON format.

# Warning
Please **work safe** when working with power or other hazardous tasks; This tools is only for __educational reference__ for learning about Power and the Math related to it. Thank you! 

## Testing so far

I have tested this with both Chrome and Safari on Mac OS X 10.11 and Chrome and Edge on Windows 10.
Both Chrome and Edge has some anomalies with MathML display when you move to a different page listed in $routeProvider and when you click solve.
I have also tested this with nwjs.oi as was recommended by Anton Triola on JSClasses forum for this app.
MathML also has display problems unless you reload the nwjs.oi app; I'm assuming it's a Chrome based problem.
Safari is the only browser I have tested that seems to work well all around.

There are some display anomalies with the MathML based demo, so i'm sorry about that; when I figure it out, then I'll update the code.

## Work In progress

This is a work in progress, if you have any ideas you can email me, with the project name in the subject and the power related equations and what you're looking to solve and I'll see what I can do; but my job keep me busy, so I can't promise anything.  You can also use the forum on JSClasses.org for anything related this project as well.

## Equation References
- [Ohm's Law Wikipedia](https://en.wikipedia.org/wiki/Ohm%27s_law)
- [Ohm's Law Calculator](http://www.csgnetwork.com/ohmslaw2.html)

## How to Use

For examples on howto use this class just look at the last script tag in the index.html,  it will show the class in action within the angularjs controllers.  I have seperated the angularjs display code from the powertech.js file so it can be reused in other projects; ofcourse you'll also need to have angularjs included for everything to work.

    var p = new powertool();
    var data = p.ohmslaw.solve($volt, $amp, $ohm, $watt);
