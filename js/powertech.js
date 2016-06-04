/**
 * Created by Karl on 2014-08-15.
 */



/**
 * Power Tools javascript class
 */
function powertool() {
    var self = this;
    // units used with power
    // volt, amp, ohm and watt are used by Ohm's law
    self.volt = 0;
    self.amp = 0;
    self.ohm = 0;
    self.watt = 0;
    self.kva = 0;

    self.data = function() {
        return {
            volt: Math.round(self.volt * 100) / 100,
            amp: Math.round(self.amp * 100) / 100,
            ohm: Math.round(self.ohm * 100) / 100,
            watt: Math.round(self.watt * 100) / 100,
            kva: Math.round(self.kva * 100) / 100
        };
    };
    self.reset = function() {
        self.volt = 0;
        self.amp = 0;
        self.ohm = 0;
        self.watt = 0;
        self.kva = 0;
        return true;
    };
    /**
     * Checks that value is both a number and not negative
     * @param n
     * @returns {*}
     */
    self.check = function(n) {
        if (!angular.isNumber(n) || n < 0)
            return 0;
        return n;
    };

    self.units = {
        volt: {label: 'Volts ( V )', suffux: 'V', id: 'volt'},
        amp: {label: 'Amps ( I )', suffux: 'A', id: 'amp'},
        ohm: {label: 'Ohms ( R )', suffux: 'Ω', id: 'ohm'},
        watt: {label: 'Watts ( W )', suffux: 'W', id: 'watt'},
        kva: {label: 'Kilovolt-Ampers ( KVA )', suffux: 'KVA', id: 'kva'}
    };
    /*
     Ohm's Law Calculator functions, it has been divided by elements of the equation and what to solve for
     */

    this.ohmslaw = {
        forms: {

            curcuit_items: {
                id: {
                    label: 'ID',
                    new : 'cable01'
                },
                pgroup: {
                    label: 'Group',
                    new : 'curcuit01'
                },
                volt: {
                    label: 'Volts',
                    new : 120
                },
                amp: {
                    label: 'Amps',
                    new : 2
                },
                watt: {
                    label: 'Watts',
                    new : 0
                }
            }
        },
        var : {
            v: function() {
                self.volt = self.amp * self.ohm;
            },
            a: function() {
                self.amp = self.volt / self.ohm;
            },
            r: function() {
                self.ohm = self.volt / self.amp;
            }
        },
        wav: {
            w: function() {
                self.watt = self.amp * self.volt;
            },
            a: function() {
                self.amp = self.watt / self.volt;
            },
            v: function() {
                self.volt = self.watt / self.amp;
            }
        },
        /**
         * Solves for Ohm's law
         * @param v Voltage
         * @param a Amps
         * @param r Resistance (Ohm'a)
         * @param w Watts
         * @returns javascript array defined in the data function
         */
        solve: function(v, a, r, w) {
            self.amp = a;
            self.volt = v;
            self.ohm = r;
            self.watt = w;

            if (self.watt === 0 && self.ohm === 0) {
                this.var.r();
                this.wav.w();
                return self.data();
            } else if (self.watt === 0 && self.ohm > 0) {
                if (self.amp === 0 && self.volt > 0) {
                    this.var.a();
                } else if (self.volt === 0 && self.amp > 0) {
                    this.var.v();
                }
                this.wav.w();
                return self.data();
            } else if (self.watt > 0 && self.ohm === 0) {
                if (self.amp === 0 && self.volt > 0) {
                    this.wav.a();
                } else if (self.volt === 0 && self.amp > 0) {
                    this.wav.v();
                }
                this.var.r();
                return self.data();
            }
            alert('Can not solve!! At least two values needs to be 0, one has to be watt or ohm');

            return self.data();
        }
    };

    /*
     * Portable Power Generatiors
     *
     * this function will help you solve for Kilovolt-Amperes
     *
     */

    this.ppgen = {
        solve: function() {
            self.kva = (self.volt * self.amp * 1.73) / 1000;
            return self.data();
        },
        form: {
            solve: {
                volt: {
                    label: "Volts",
                    new : 0
                },
                amp: {
                    label: "Amps",
                    new : 0
                },
                kva: {
                    label: "Kilovolt-Ampers",
                    new : 0
                }
            }
        }
    };

    /**
     * circuits
     */
    this.circuits = {
        dc: {
            solve: function( ) {
                var work = 0;
                if (self.volt === 0) {
                    if (self.amp === 0 && self.watt > 0 && self.ohm > 0) {
                        work = self.watt * self.ohm;
                        self.volt = Math.sqrt(work);
                    } else if (self.watt === 0 && self.ohm > 0 && self.amp > 0) {
                        self.volt = self.ohm * self.amp;
                    }
                } else if (self.ohm === 0 && self.volt > 0 && self.amp > 0) {
                    self.ohm = self.volt / self.amp;
                }
            }
        },
        ac: {
            /**
             *
             * not including the
             *
             * V = sqr(Power (P) * Impedance (Z)) / sqr(cos(120))
             *
             * equation since i'm not accepting this value in my forms
             */
            solve: function() {
                if (self.watt > 0 && self.amp > 0) {
                    self.volt = self.watt / (self.amp * Math.cos(120));
                } else if (self.ohm > 0 && self.amp > 0) {
                    self.volt = (self.amp * self.ohm) / Math.cos(120);
                }

            }
        }
    };

    /*
     Will need to add other calculators functions
     */


    /**
     * MathML stuff, not using MathML then don't worry about it

     based on
     https://github.com/yonibaciu/ngMathJax/blob/master/ngMathJax.js.coffee
     ngMathJax
     Renders MathML using an AngularJS direcive

     Just add the directive to your project and then in any element that
     contains MathML add the ng-math-jax property.

     The directive option didn't work for me
     */
    this.math = {
      view: function() {
        m = document.getElementsByTagName("math");
        if (m.length > 0)
          if (!window.MathJax)
            getScript('https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML', function() {
              angular.forEach(m, function(e) { MathJax.Hub.Queue(["Typeset",MathJax.Hub, e]) });
            });
          else
            angular.forEach(m, function(e) { MathJax.Hub.Queue(["Typeset",MathJax.Hub, e])
        });
      }
    }

}
;
