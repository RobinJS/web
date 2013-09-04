var Class.create = function(properties) {
  var theClass = function() {
    this.init.apply(this, arguments);
  }
  theClass.prototype = {};
  for (var prop in properties) {
    theClass.prototype[prop] = properties[prop];
  }
  if (!theClass.prototype.init) {
    theClass.prototype.init = function() {}
  }
  return theClass;
}


var School = Class.create({
    init: function(name, town, classes) {
        this.name = name;
        this.town = town;
        this.classes = classes;
    }
});

var Person = Class.create({
    init: function (firstName, lastName, age) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    },
    introduce: function () {
        return this.firstName + " " + this.lastName + ", ";
    }
});

var Student = Class.create({
    init: function (firstName, lastName, age, grade) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.grade = grade;
    },
    introduce: function () {
        return this._super.introduce() + "grade: " + this.grade;
    }
});

Student.inherit(Person);

var Teacher = Class.create({
    init: function (firstName, lastName, age, speciality) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.speciality = speciality;
    },
    introduce: function () {
        return this._super.introduce() + "speciality: " + this.speciality;
    }
});
