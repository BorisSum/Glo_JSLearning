'use strict';

// -------------- 1. ------------------------------------------
let money = 100000; // Доход за месяц
const income = 'Шабашки'; // Источник дополнительного дохода
//let addExpenses = 'Еда, Бензин, Связь'; // Статьи расходов
let deposit = false;
const mission = 1000000; // Цель для накопления
const period = 10; // Период

// -------------- 2. ------------------------------------------

// ------------------- УРОК 3 ----------------------------------

money = parseFloat(prompt('Ваш месячный доход, руб.'));

const addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую');

deposit = confirm('Есть ли у Вас депозит в банке?');

const expanses1 = prompt('Введите обязательную статью расходов');
const amount1 = parseFloat(prompt('Во сколько это обойдется, руб.'));

const expanses2 = prompt('Введите обязательную статью расходов');
const amount2 = parseFloat(prompt('Во сколько это обойдется, руб.'));

// ------------------------ УРОК 4 ---------------------------------------------

function getExpensesMonth(reqPayment1, reqPayment2) {
   return reqPayment1 + reqPayment2;
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

const accumulatedMonth = getAccumulatedMonth(money, getExpensesMonth(amount1, amount2));
const budgetDay = Math.floor(accumulatedMonth / 30);

console.log(showTypeOf(money));
console.log(showTypeOf(income));
console.log(showTypeOf(deposit));
console.log('Расходы за месяц: ', getExpensesMonth(amount1, amount2));
console.log('Возможные расходы: ', addExpenses.split(', '));
console.log('Срок достижения цели: ', Math.ceil(getTargetMonth(mission, accumulatedMonth)), ' мес.');
console.log('Бюджет на день: ', budgetDay);
console.log('Статус Вашего дохода: ', getStatusIncome(budgetDay));
