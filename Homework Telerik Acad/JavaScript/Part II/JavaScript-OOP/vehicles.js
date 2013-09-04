var vehicles = (function () {
        function vehicle(speed, propulsionUnits) {
            this.speed = speed;
            this.propulsionUnits = propulsionUnits;
        }

        Function.prototype.inherit = function (parent) {
            this.prototype = new parent();
            this.prototype.constructor = parent;
        }

        vehicle.prototype.accelerate = function () {
            //update speed by summing it with the acceleration of propulsion units
            for (var i = 0, len = this.propulsionUnits.length; i &lt; len; i++) {
                this.speed += this.propulsionUnits[i].getAcceleration();
            }
        }

        function propulsionUnit() {
        }

        propulsionUnit.prototype.getAcceleration = function () {
            return;
        }

        function wheels() {
            this.radius = radius;
            this.acceleration = 2 * Math.PI * this.radius;
        }
        wheels.inherit(propulsionUnit);

        function propellingNozzle(afterburnerSwitchOn) {
            this.power = power;
            this.afterburnerSwitchOn = afterburnerSwitchOn;
            if (this.afterburnerSwitchOn == false) {
                this.acceleration = this.power;
            }
            else {
                this.acceleration = this.power * 2;
            }
        }
        propellingNozzle.inherit(propulsionUnit);

        function propeller() {
            this.numberOfFins = numberOfFins;
            this.spinDirectionClockwise = true;
            if (spinDirectionClockwise == true) {
                this.acceleration = this.numberOfFins;
            }
            else {
                this.acceleration = -this.numberOfFins;
            }
        }
        propeller.inherit(propulsionUnit);

        function landVehicle(speed, propulsionUnits) {
            this.wheels = 4;
            vehicle.apply(this, arguments);
        }
        landVehicle.inherit(vehicle);

        function airVehicle(afterburnerSwitchOn) {
            this.propellingNozzle = 1;
            this.afterburnerSwitchOn = afterburnerSwitchOn;
            vehicle.apply(this, arguments);
        }
        airVehicle.inherit(vehicle);

        function waterVehicle(propellers, spinDirectionClockwise) {
            this.propellers = propellers;
            this.spinDirectionClockwise = spinDirectionClockwise;
        }
        waterVehicle.inherit(vehicle);

        function amphibious(wheels, waterMode, landMode) {
            this.propellers = propellers;
            this.wheels = wheels;
            this.waterMode = waterMode;
            this.landMode = landMode;
        }
        amphibious.inherit(vehicle);

        return {
            landVehicle: landVehicle,
            airVehicle: airVehicle,
            waterVehicle: waterVehicle,
            amphibious: amphibious,
        }
    })();