var School = {
  init: function(name, town, classes){
  		this.name = name;
  		this.town = town;
    	this.classes = classes;
  }
}

if(!Object.create){
  Object.create = function(obj){
    function f(){};
    f.prototype = obj;
    return new f();    
  }
}

var Person = Object.create({
    init: function (firstName, lastName, age) {
    	this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    },
    introduce: function () {
            return "Name: " + this.firstName + " " + this.lastName + ", Age: " + this.age;
        }
});

var Student = Person.extend({
    init: function (firstName, lastName, age, grade) { 
    	this.firstName = firstName;
        this.lastName = lastName;
        this.grade = grade;
    },
    introduce: function () {
        return this.introduce() + "grade: " + this.grade;
    }
});

var Teacher = Person.extend({
    init: function (firstName, lastName, age, speciality) {
    	this.firstName = firstName;
        this.lastName = lastName;
        this.speciality = speciality;
    },
    introduce: function () {
        return this.introduce() + "speciality: " + this.speciality;
    }
});

var Classes = Object.create({
    init: function (name, capacity, studentsSet, formTeacher) {
        this.name = name;
        this.capacity = capacity;
        this.studentsSet = studentsSet;
        this.formTeacher = formTeacher;
    }
});

Object.prototype.extend = function(properties) {
  function f() {};
  f.prototype = Object.create(this);
  for (var prop in properties) {
    f.prototype[prop] = properties[prop];
  }
  f.prototype._super = this;
  return new f();
}
