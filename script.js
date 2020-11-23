'use strict';

// -------------- 1. ------------------------------------------
let money = 100000; // Доход за месяц
const income = 'Шабашки'; // Источник дополнительного дохода
let addExpenses = 'ЕДа, БеНзИн, СвЯзь'; // Статьи расходов
let deposit = false;
const mission = 1000000; // Цель для накопления
const period = 10; // Период

// -------------- 2. ------------------------------------------
console.log(typeof money);
console.log(typeof income);
console.log(typeof deposit);

console.log(addExpenses.length);
console.log('Период равен ' + period + ' месяцев');
console.log(`Цель заработать ${mission} рублей`);

console.log(addExpenses.toLowerCase().split(', '));

let budgetDay = +(money / 30).toFixed(2);
console.log(budgetDay);

// ------------------- УРОК 3 ----------------------------------
money = NaN;
let Amount1 = NaN;
let Amount2 = NaN;

while (isNaN(money)) {
   money = parseFloat(prompt('Ваш месячный доход, руб.'));
}

console.log('Месячный доход: ', money);

addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую');

deposit = confirm('Есть ли у Вас депозит в банке?');

const Expanses1 = prompt('Введите обязательную статью расходов');
while (isNaN(Amount1)) {
   Amount1 = parseFloat(prompt('Во сколько это обойдется, руб.'));
}

const Expanses2 = prompt('Введите обязательную статью расходов');
while (isNaN(Amount2)) {
   Amount2 = parseFloat(prompt('Во сколько это обойдется, руб.'));
}

// Если я правильно понял, месячный бюджет это сумма обязательных расходов,
// остальное в накопление.
const budgetMonth = Amount1 + Amount2;
console.log('Бюджет на месяц: ', budgetMonth);

const monthToMission = Math.ceil(mission / (money - budgetMonth));
console.log(`До наколения ${mission} осталось ${monthToMission} мес.`);

budgetDay = Math.floor(money / 30);
console.log('Бюджет на день: ', budgetDay);

if (budgetDay >= 1200) {
   console.log('У Вас высокий уровень дохода');
} else if (budgetDay < 1200 && budgetDay >= 600) {
   console.log('У Вас средний уровень дохода');
} else if (budgetDay < 600 && budgetDay > 0) {
   console.log('К сожалению, Ваш уровень дохода ниже среднего');
} else if (budgetDay <= 0) {
   console.log('Что-то пошло не так!');
}


