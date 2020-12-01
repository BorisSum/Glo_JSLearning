'use strict';

let money; // Доход за месяц

const isNumber = argument => {
   return !isNaN(parseFloat(argument)) && isFinite(argument);
};

const promptForNumber = question => {
   let result;
   do {
      result = prompt(question);
   } while (!isNumber(result));
   return parseFloat(result);
};

const promptForTextValue = question => {
   let result = null;
   do {
      result = prompt(question);

      if (result) { // обрезаем пробелы с концов
         result = result.trim();
      }
      if (result === '') { // если строка пустая, переспрашиваем
         result = null;
      }
      if (/^\d+$/.test(result)) { // если только цифры, переспрашиваем
         result = null;
      }
   } while (!result);
   return result;
};

const appData = {
   // Какие-то свойства объекта, возможно на будущее
   isIncome: null, // Наличие доп заработка
   income: {}, // Дополнительный заработок в формате: Наименование источника: сумма заработка
   addIncome: {},
   expenses: {}, // Обязательные расходы в формате: Статья расходов: Сумма расходов по данной статье

   addExpenses: [], // Массив наименований статей дополнительных расходов
   deposit: false, // Наличие депозита в банке
   percentDeposit: 0, // Процент по депозиту
   moneyDeposit: 0, // Сумма депозита

   mission: 500000, // Цель накопления
   period: 3, // Период накопления
   budget: 0, // ... опять бюджет ... На самом деле это доход за месяц. 
   budgetDay: 0, // остаток денежных средств, после вычета обязательных расходов, на день
   budgetMonth: 0, // остаток денежных средств, после вычета обязательных расходов, на месяц
   expensesMonth: 0, // сумма обязательных платежей в месяц... вроде...
   monthToMission: 0, // Количество месяцев для достижения цели
   incomeStatus: '', // Статус дохода (высокий, средний, низкий)

   // Получем от пользователя данные и инициализируем объект.
   asking: function () {

      this.getInfoDeposit();

      this.isIncome = confirm('Есть ли у Вас источник дополнительного заработка');
      if (this.isIncome) {
         // Наименование источника дополнительного заработка - название свойства в income{} 
         const itemIncome = promptForTextValue('Какой у Вас дополнительный заработок?');
         // Сумма доп заработка в месяц - значение свойства в income
         const cashIncome = promptForNumber('Сколько в месяц Вы на этом зарабатываете, руб?');
         this.income[itemIncome] = cashIncome;
      }

      this.addExpenses = promptForTextValue(
         'Перечислите возможные расходы за рассчитываемый период через запятую').toLowerCase().split(', ');

      // Заполняем объект expenses
      let expName;
      for (let i = 0; i < 2; i++) {
         expName = promptForTextValue('Введите обязательную статью расходов №-' + (i + 1)).toLowerCase();
         appData.expenses[expName] = promptForNumber('Во сколько это обойдется, руб.');
      }

      // Инициализация объекта
      this.getExpensesMonth();
      this.getBudget();
      this.getTargetMonth();
      this.getStatusIncome();
   },

   // метод, возвращающий this.expensesMonth. А это сумма обязательных платежей.
   getExpensesMonth: function () {

      for (let property in this.expenses) {
         this.expensesMonth += parseFloat(this.expenses[property]);
      }
      this.expensesMonth = parseFloat(this.expensesMonth);
      return this.expensesMonth;

   },

   // Возвращает сумму денег в месяц, которая пойдет в накопление (доходы - обязательные расходы)
   getBudget: function () {
      this.budgetMonth = parseFloat(this.budget) - this.expensesMonth;
      this.budgetDay = Math.floor(this.budgetMonth / 30);
      return parseFloat(this.budgetMonth);
   },

   // Возвращает количество месяцев для достижения цели this.monthToMission
   getTargetMonth: function () {
      this.monthToMission = parseFloat(parseFloat(this.mission) / parseFloat(this.budgetMonth));
      return this.monthToMission;
   },

   // Возвращает статус дохода
   getStatusIncome: function () {

      if (this.budgetDay >= 1200) {
         this.incomeStatus = 'У Вас высокий уровень дохода';
      } else if (this.budgetDay < 1200 && this.budgetDay >= 600) {
         this.incomeStatus = 'У Вас средний уровень дохода';
      } else if (this.budgetDay < 600 && this.budgetDay > 0) {
         this.incomeStatus = 'К сожалению, Ваш уровень дохода ниже среднего';
      } else if (this.budgetDay <= 0) {
         this.incomeStatus = 'Что-то пошло не так!';
      }
      return this.incomeStatus;
   },

   // Получение информации по депозиту
   getInfoDeposit: function () {
      this.deposit = confirm('Есть ли у Вас депозит в банке?');

      if (this.deposit) {
         this.percentDeposit = promptForNumber('Введите процент по депозиту');
         this.moneyDeposit = promptForNumber('Введите сумму депозита');
      }
   },

   // Расчет суммы, которая будет накоплена за период
   calcSaveMoney: function () {
      return parseFloat(this.budgetMonth * this.period);
   },

};

const start = function () {
   do {
      appData.budget = parseFloat(prompt('Ваш месячный доход, руб.'));
   } while (!isNumber(appData.budget));
};

//start();

//appData.asking();


// console.log('Расходы за месяц: ', appData.expensesMonth);

// if (appData.monthToMission >= 0) {
//    console.log('Срок достижения цели: ', Math.ceil(appData.monthToMission), ' мес.');
// } else {
//    console.log('Цель не будет достигнута');
// }

// console.log('Уровень дохода: ', appData.incomeStatus);

// if (appData.deposit) {
//    console.log(`Процент по депозиту: ${appData.percentDeposit}%`);
//    console.log(`Сумма депозита: ${appData.moneyDeposit} руб.`);
// }

// // -------- Обработка массива возможных расходов addExpenses --------------------------
// let addExpensesStr = '';
// appData.addExpenses.forEach((item, index, array) => {
//    array[index] = item[0].toUpperCase() + item.slice(1);
//    addExpensesStr += array[index] + ', ';
// });
// addExpensesStr = addExpensesStr.slice(0, -2);
// // ------------------------------------------------------------------------------------
// console.log(addExpensesStr);

// if (appData.isIncome) {
//    for (let property in appData.income) {
//       console.log(`Мой доп. заработок - ${property}`);
//       console.log(`Он составляет: ${appData.income[property]} руб.`);
//    }
// }

// console.log('----------------------------------------------------------------');
// console.log('Наша программа включает в себя данные:');
// for (let property in appData) {
//    console.log(property, ' = ', appData[property]);
// }




// =========================== УРОК 9 ==================================================

// Получаем кнопку "Рассчитать" по ID
const btnCalculateElem = document.getElementById('start');

// Получаем кнопки +, каждую в свою переменную... зачем так сложно?
let buttons = document.getElementsByTagName('button');
buttons = Array.from(buttons);

let btnIncomeAddElem; // Кнопка + для добавления доп.доходов
let btnExpensesAddElem; // Кнопка + для добавления до.расходов

buttons.forEach(item => {
   if (item.classList.contains('income_add')) {
      btnIncomeAddElem = item;
   }
   if (item.classList.contains('expenses_add')) {
      btnExpensesAddElem = item;
   }
});

// Получем чекбокс "депозит"
const depositCheckElem = document.querySelector('#deposit-check');

// Поля ввода возможных доходов
const additionalIncomeElems = document.querySelectorAll('.additional_income-item');

// Элементы в правой части программы
const budgetMonthValElem = document.getElementsByClassName('budget_month-value')[0];
const budgetDayValElem = document.getElementsByClassName('budget_day-value')[0];
const expensesMonthValElem = document.getElementsByClassName('expenses_month-value')[0];
const additionalIncomeValElem = document.getElementsByClassName('additional_income-value')[0];
const additionalExpensesValElem = document.getElementsByClassName('additional_expenses-value')[0];
const incomePeriodValElem = document.getElementsByClassName('income_period-value')[0];
const targetMonthValElem = document.getElementsByClassName('target_month-value')[0];

// Остальные элементы
const salaryAmountElem = document.querySelector('.salary-amount');
const incomeTitleElem = document.querySelector('input.income-title');
const incomeAmountElem = document.querySelector('.income-amount');
const additionalIncomeElem1 = document.querySelector('input.additional_income-item');
const additionalIncomeElem2 = document.querySelector('input.additional_income-item:last-child');
const expensesTitleElem = document.querySelector('input.expenses-title');
const expensesAmountElem = document.querySelector('input.expenses-amount');
const additionalExpensesItemElem = document.querySelector('input.additional_expenses-item');
const targetAmountElem = document.querySelector('input.target-amount');
const periodSelectElem = document.querySelector('input.period-select');
const periodAmountTitleElem = document.querySelector('div.period-amount');
const btnCancelElem = document.getElementById('cancel');
