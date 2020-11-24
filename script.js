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
// Не забывай называть переменные в camelCase, у тебя появились Expanses1 и Expanses2, Amount1 и Amount2.

// Бюджет на месяц это месячный доход (money) минус сумма обязательных расходов, 
// при его объявлении сразу же можно посчитать, а потом уже использовать в переменной "monthToMission".
// Бюджет на день соответственно тоже надо пересчитать: 
// "Поправить budgetDay учитывая бюджет на месяц, а не месячный доход"


money = parseFloat(prompt('Ваш месячный доход, руб.'));
console.log('Месячный доход: ', money);

addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую');

deposit = confirm('Есть ли у Вас депозит в банке?');

const expanses1 = prompt('Введите обязательную статью расходов');
const amount1 = parseFloat(prompt('Во сколько это обойдется, руб.'));

const expanses2 = prompt('Введите обязательную статью расходов');
const amount2 = parseFloat(prompt('Во сколько это обойдется, руб.'));

// Если я правильно понял, месячный бюджет это сумма обязательных расходов,
// остальное в накопление.
const budgetMonth = money - amount1 - amount2;
console.log('Бюджет на месяц: ', budgetMonth);

const monthToMission = Math.ceil(mission / budgetMonth);
console.log(`До наколения ${mission} осталось ${monthToMission} мес.`);

budgetDay = Math.floor(budgetMonth / 30);
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


