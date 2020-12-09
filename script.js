'use strict';

class First {
   constructor() {

   }

   hello() {
      console.log('Привет! Я метод родителя!');
   }
}

class Second extends First {
   constructor() {
      super();
   }

   hello() {
      super.hello();
      console.log('А я наследуемый метод!');
   }
}


const second = new Second();
second.hello();


