/**
 * Created by Karl on 2014-08-15.
 */
var ptt = angular.module('PowerTech', [
    "ngRoute",
    "ngTouch",
    "mobile-angular-ui"
]);
ptt.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {templateUrl: "tmpl/power/ohm.html"});
    $routeProvider.when('/ohm', {templateUrl: "tmpl/power/ohm.html"});
//    $routeProvider.when('/curcuits', {templateUrl: "tmpl/power/curcuits.html"});
    $routeProvider.when('/gennie', {templateUrl: "tmpl/power/gennorator.html"});
});
var $scope = {};

$scope.title = "";


ptt.controller('powertools', ['$scope', function($scope) {
        // calc values

    }]);

ptt.controller('curcuits', ['$scope', function($scope) {
        // values for form
        var items = 'devices';
        var p = new powertool();

        $scope.pitem = p.ohmslaw.forms.curcuit_items;



        $scope.powered_items = dbh5.getPage(items);

        $scope.addItem = function() {
            if ($scope.pitem.id.new !== "" && $scope.pitem.pgroup.new !== '' && $scope.pitem.volt.new > 0 && $scope.pitem.amp.new > 0 && $scope.pitem.watt.new >= 0) {
                var update = {
                    id: $scope.pitem.id.new,
                    pgroup: $scope.pitem.pgroup.new,
                    volt: $scope.pitem.volt.new,
                    amp: $scope.pitem.amp.new,
                    watt: $scope.pitem.watt.new,
                    delete: false
                };
                $scope.powered_items.push(update);

                $scope.pitem.id.new = "";
                $scope.pitem.pgroup.new = "";
                $scope.pitem.volt.new = 0;
                $scope.pitem.amp.new = 0;
                $scope.pitem.watt.new = 0;

                dbh5.setPage(items, $scope.powered_items);
            }
        };
        $scope.deleteItem = function() {
            var update = [];
            angular.forEach($scope.powered_items, function(i) {
                if (!i.delete) {
                    update.push(i);
                }
            });

            dbh5.setPage(items, update);
            $scope.powered_items = update;
        };

        ///
    }]);


ptt.controller('ohmslaw', ['$scope', function($scope) {
        // calc values


        var p = new powertool();
        $scope.history = dbh5.getPage("ohmslaw");

        $scope.update_form = function(data) {
            $scope.volt = data.volt;
            $scope.amp = data.amp;
            $scope.watt = data.watt;
            $scope.ohm = data.ohm;
            return true;
        };
        $scope.zero_calc = function() {
            $scope.work = false;
            p.reset();
            $scope.update_form(p.data());
            return true;
        };

        $scope.zero_calc();
        $scope.solve = false;
        $scope.unit = p.units;


        $scope.check_num = function() {
            $scope.volt = p.check($scope.volt);
            $scope.amp = p.check($scope.amp);
            $scope.watt = p.check($scope.watt);
            $scope.ohm = p.check($scope.ohm);
        };

        $scope.deleteHist = function() {
            var update = [];
            angular.forEach($scope.history, function(c) {
                if (!c.delete) {
                    update.push(c);
                }
            });

            dbh5.setPage("ohmslaw", update);
            $scope.history = update;
            return true;
        };

        $scope.solve = function() {
            $scope.work = true;

            var data = p.ohmslaw.solve($scope.volt, $scope.amp, $scope.ohm, $scope.watt);

            var update = {
                volt: data.volt,
                amp: data.amp,
                watt: data.watt,
                ohm: data.ohm,
                delete: false
            };
            $scope.history.push(update);

            dbh5.setPage("ohmslaw", $scope.history);
            $scope.zero_calc();

            return true;
        };
        
    }]);




ptt.controller('gennie', ['$scope', function($scope) {
        // calc values

        var p = new powertool();
        $scope.history = dbh5.getPage("gennie");

        $scope.update_form = function(data) {
            $scope.volt = data.volt;
            $scope.amp = data.amp;
            $scope.kva = data.kva;
            $scope.note = data.note;
            return true;
        };
        $scope.zero_calc = function() {
            $scope.work = false;
            p.reset();
            $scope.note="";
            $scope.update_form(p.data());
            return true;
        };

        $scope.zero_calc();
        $scope.solve = false;
        $scope.unit = p.units;


        $scope.check_num = function() {
            $scope.volt = p.check($scope.volt);
            $scope.amp = p.check($scope.amp);
        };

        $scope.deleteHist = function() {
            var update = [];
            angular.forEach($scope.history, function(c) {
                if (!c.delete) {
                    update.push(c);
                }
            });

            dbh5.setPage("gennie", update);
            $scope.history = update;
            return true;
        };

        $scope.solve = function() {
            $scope.work = true;
            p.volt = $scope.volt;
            p.amp = $scope.amp;
            p.ppgen.solve();
            var data = p.data();

            var update = {
                volt: data.volt,
                amp: data.amp,
                kva: data.kva,
                note: $scope.note,
                delete: false
            };
            $scope.history.push(update);
            dbh5.setPage("gennie", $scope.history);
            $scope.zero_calc();
            return true;
        };

    }]);



/**
 * Power Tools javascript class
 * -part of the gig tools webapps
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
            volt: self.volt,
            amp: self.amp,
            ohm: self.ohm,
            watt: self.watt,
            kva: self.kva
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
}
;
