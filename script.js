'use strict';

// -------------- 1. ------------------------------------------
let money; // Доход за месяц
const income = 'Шабашки'; // Источник дополнительного дохода
let deposit = false;
const mission = 1000000; // Цель для накопления
const period = 10; // Период
let amounts = []; // Сумма обязательных расходов
let expenses = []; // Наименование статьи обязательных расходов

const isNumber = argument => {
   return !isNaN(parseFloat(argument)) && isFinite(argument);
};

const start = function () {
   do {
      money = prompt('Ваш месячный доход, руб.');
   } while (!isNumber(money));
};


const superPrompt = question => {
   let result;
   do {
      result = prompt(question);
   } while (!isNumber(result));
   return parseFloat(result);
};

money = superPrompt('Введите Ваш месячный доход, руб.');
const addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую').toLowerCase();
deposit = confirm('Есть ли у Вас депозит в банке?');

for (let i = 0; i < 2; i++) {
   expenses[i] = prompt('Введите обязательную статью расходов №-' + (i + 1)).toLowerCase();
   amounts[i] = superPrompt('Во сколько это обойдется, руб.');
}


function getExpensesMonth(reqPayment1, reqPayment2) {
   if (isNumber(reqPayment1) && isNumber(reqPayment2)) {
      return reqPayment1 + reqPayment2;
   }
   return -1;
}

function getAccumulatedMonth(income, expenditure) {
   return income - expenditure;
}

function getTargetMonth(mission, accum) {
   return mission / accum;
}

function showTypeOf(argument) {
   return typeof (argument);
}

function getStatusIncome(moneyForDay) {
   if (moneyForDay >= 1200) {
      return 'У Вас высокий уровень дохода';
   } else if (moneyForDay < 1200 && moneyForDay >= 600) {
      return 'У Вас средний уровень дохода';
   } else if (moneyForDay < 600 && moneyForDay > 0) {
      return 'К сожалению, Ваш уровень дохода ниже среднего';
   } else if (moneyForDay <= 0) {
      return 'Что-то пошло не так!';
   }
}

const accumulatedMonth = getAccumulatedMonth(money, getExpensesMonth(amounts[0], amounts[1]));
const budgetDay = Math.floor(accumulatedMonth / 30);

console.log(showTypeOf(money));
console.log(showTypeOf(income));
console.log(showTypeOf(deposit));
console.log('Расходы за месяц: ', getExpensesMonth(amounts[0], amounts[1]));
console.log('Возможные расходы: ', addExpenses.split(', '));

const monthToMission = getTargetMonth(mission, accumulatedMonth);
if (monthToMission >= 0) {
   console.log('Срок достижения цели: ', Math.ceil(monthToMission), ' мес.');
} else {
   console.log('Цель не будет достигнута');
}

console.log('Бюджет на день: ', budgetDay);
console.log('Статус Вашего дохода: ', getStatusIncome(budgetDay));
