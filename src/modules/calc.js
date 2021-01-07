const calc = (price = 100) => {

   const clacBlock = document.querySelector('.calc-block');
   const objectType = document.querySelector('.calc-type'); // Select
   const objectSquare = document.querySelector('.calc-square'); // Площадь
   const premisesCount = document.querySelector('.calc-count'); // кол-во помещений
   const daysCount = document.querySelector('.calc-day'); // кол-во дней
   const result = document.getElementById('total');

   const validateNumbers = target => target.value = target.value.replace(/[^\d]/g, '');

   const countSum = () => {
      let total = 0;
      let premisesCountVal = 1;
      let daysCountVal = 1;

      const objectTypeVal = objectType.options[objectType.selectedIndex].value;
      const objectSquareVal = +objectSquare.value;

      if (premisesCount.value > 1) {
         premisesCountVal += (premisesCount.value - 1) / 10;
      }

      if (daysCount.value && daysCount.value < 5) {
         daysCountVal *= 2;
      } else if (daysCount.value && daysCount.value < 10) {
         daysCountVal *= 1.5;
      }

      if (objectTypeVal && objectSquareVal) {
         total = price * objectTypeVal * objectSquareVal * premisesCountVal * daysCountVal;
      } else {
         total = 0;
         result.textContent = total;
         return;
      }

      // Выводим результат

      let tempResult = 0;

      tempResult = total - 1000;
      if (tempResult < 0) {
         tempResult = 0;
      }

      const interval = setInterval(() => {
         if (tempResult < total) {
            result.textContent = tempResult += 25;
         } else {
            result.textContent = Math.round(total);
            clearInterval(interval);
         }
      }, 5);
   };

   clacBlock.addEventListener('input', event => {
      let target = event.target;
      if (target.matches('input')) {
         validateNumbers(target);
      }
   });

   clacBlock.addEventListener('change', event => {
      let target = event.target;
      if (target.matches('input') || target.matches('select')) {
         countSum();
      }
   });
};

export default calc;