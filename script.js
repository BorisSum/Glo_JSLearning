
// -------------- 1. ------------------------------------------
const money = 100000; // Доход за месяц
const income = 'Шабашки'; // Источник дополнительного дохода
const addExpenses = 'ЕДа, БеНзИн, СвЯзь'; // Статьи расходов
const deposit = false;
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

const budgetDay = +(money / 30).toFixed(2);
console.log(budgetDay);
