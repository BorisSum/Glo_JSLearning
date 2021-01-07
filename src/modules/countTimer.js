const countTimer = deadLine => {
   const timerHours = document.querySelector('#timer-hours'),
      timerMinutes = document.querySelector('#timer-minutes'),
      timerSeconds = document.querySelector('#timer-seconds');

   let interval;

   const zeroFill = val => val < 10 ? '0' + val : val;


   const getTimeRemaining = () => {
      const dateStop = new Date(deadLine).getTime(),
         dateNow = new Date().getTime(),
         timeRemaining = (dateStop - dateNow) / 1000,
         seconds = Math.floor(timeRemaining % 60),
         minutes = Math.floor((timeRemaining / 60) % 60),
         hours = Math.floor(timeRemaining / 3600);

      return { timeRemaining, hours, minutes, seconds };
   };

   const updateClock = () => {
      const timer = getTimeRemaining();

      if (timer.timeRemaining <= 0) {
         clearInterval(interval);
         timerHours.textContent = '00';
         timerMinutes.textContent = '00';
         timerSeconds.textContent = '00';
      } else {
         timerHours.textContent = zeroFill(timer.hours);
         timerMinutes.textContent = zeroFill(timer.minutes);
         timerSeconds.textContent = zeroFill(timer.seconds);
      }
   };
   updateClock();
   interval = setInterval(updateClock, 1000);
};

export default countTimer;