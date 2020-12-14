document.addEventListener('DOMContentLoaded', () => {
   'use strict';

   const weekDay = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];


   const zeroFill = val => {
      if (val < 10) {
         return '0' + val;
      } else {
         return val;
      }
   };

   const helloEl = document.querySelector('.hello'),
      todayEl = document.querySelector('.today'),
      timeEl = document.querySelector('.time'),
      newYearEl = document.querySelector('.new-year');

   const getNewYearDate = new Date('1 jan 2021').getTime();
   const currDate = new Date();
   const daysRemaining = Math.ceil((getNewYearDate - currDate.getTime()) / 3600 / 24000);
   newYearEl.textContent = daysRemaining;

   todayEl.textContent = weekDay[currDate.getDay()];
   timeEl.textContent = currDate.toLocaleTimeString('en');

   const currHours = currDate.getHours();
   if ((currHours >= 0 && currHours < 6) || (currHours >= 23)) {
      helloEl.textContent = 'Доброй ночи!';
   } else if (currHours >= 6 && currHours < 10) {
      helloEl.textContent = 'Доброе утро!';
   } else if (currHours >= 10 && currHours < 17) {
      helloEl.textContent = 'Добрый день!';
   } else {
      helloEl.textContent = 'Добрый вечер!';
   }

});