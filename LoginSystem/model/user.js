module.exports = class User {
  
    // Constructor
    constructor(name, surname, age, email, password) {
      // Member variables
      this.name = name;
      this.surname = surname
      this.age = age;
      this.email = email;
      this.password = password
    }

    userInfo(){
        return this.name + ' is ' + this.age + ' years old';
    }

}

