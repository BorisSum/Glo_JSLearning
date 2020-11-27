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

const appData = {
   // Какие-то свойства объекта, возможно на будущее
   income: {},
   addIncome: {},
   expenses: {}, // Обязательные расходы в формате: Статья расходов: Сумма расходов по данной статье

   addExpenses: [], // Массив наименований статей дополнительных расходов
   // reqExpenses: [], // Массив наименований статей ОБЯЗАТЕЛЬНЫХ расходов
   // reqAmounts: [], // Массив сумм ОБЯЗАТЕЛЬНЫХ расходов
   deposit: false, // Наличие депозита в банке


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
      this.deposit = confirm('Есть ли у Вас депозит в банке?');
      this.addExpenses = prompt(
         'Перечислите возможные расходы за рассчитываемый период через запятую').toLowerCase().split(', ');

      // Заполняем объект expenses
      let expName;
      for (let i = 0; i < 2; i++) {
         expName = prompt('Введите обязательную статью расходов №-' + (i + 1)).toLowerCase();
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
   }

};

const start = function () {
   do {
      appData.budget = +prompt('Ваш месячный доход, руб.');
   } while (!isNumber(appData.budget));
};

start();

appData.asking();


console.log('Расходы за месяц: ', appData.expensesMonth);

if (appData.monthToMission >= 0) {
   console.log('Срок достижения цели: ', Math.ceil(appData.monthToMission), ' мес.');
} else {
   console.log('Цель не будет достигнута');
}

console.log('Уровень дохода: ', appData.incomeStatus);

console.log('Наша программа включает в себя данные:');
for (let property in appData) {
   console.log(property, ' = ', appData[property]);
}

