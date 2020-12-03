'use strict';

// let money; // Доход за месяц

// --------- Функции валидаци -----------------------------------------------------------
const isNumber = argument => {
   return !isNaN(parseFloat(argument)) && isFinite(argument);
};

const validateNumbers = target => target.value = target.value.replace(/[^\d.]/g, '');

// --------------------- Конец блока функций валидации ----------------------------------
// ======================================================================================

// --------------------- Получение элементов интерфейса ---------------------------------
// Месячный доход
const salaryAmountElem = document.querySelector('.salary-amount');

// Дополнительный доход Наименование
const incomeTitleElem = document.querySelector('input.income-title');

// Дополнительный доход Сумма
const incomeAmountElem = document.querySelector('.income-amount');

const incomeItemsElem = document.querySelectorAll('.income-items');
const incomeItemsElemListener = document.getElementsByClassName('income-items');

// Кнопка "+" для добавления доп. доходов
const btnIncomeAddElem = document.querySelector('.income_add');

// Возможный доход Наименование. Два поля
const additionalIncomeElems = document.querySelectorAll('input.additional_income-item');

// Обязательные расходы Наименование
//const expensesTitleElem = document.querySelector('input.expenses-title');

// Обязательные расходы Сумма
//const expensesAmountElem = document.querySelector('input.expenses-amount');

// Кнопка "+" для добавления доп. расходов
const btnExpensesAddElem = document.querySelector('.expenses_add');

// Возможные расходы, через запятую
const additionalExpensesItemElem = document.querySelector('input.additional_expenses-item');

// Получем чекбокс "депозит"
const depositCheckElem = document.querySelector('#deposit-check');

// Цель
const targetAmountElem = document.querySelector('input.target-amount');

// Период расчета - range
const periodSelectElem = document.querySelector('input.period-select');

// Период расчета - значение
const periodAmountTitleElem = document.querySelector('div.period-amount');

// Получаем кнопку "Рассчитать" по ID
const btnCalculateElem = document.getElementById('start');

// Получаем кнопку "Отмена"
const btnCancelElem = document.getElementById('cancel');

// Поля для вывода данных ------------------------------------------------------------------
// Доход за месяц
const budgetMonthValElem = document.getElementsByClassName('budget_month-value')[0];

// Дневной бюджет
const budgetDayValElem = document.getElementsByClassName('budget_day-value')[0];

// Расходы за месяц 
const expensesMonthValElem = document.getElementsByClassName('expenses_month-value')[0];

// Возможные доходы
const additionalIncomeValElem = document.getElementsByClassName('additional_income-value')[0];

// Возможные расходы
const additionalExpensesValElem = document.getElementsByClassName('additional_expenses-value')[0];

// Накопления за период
const incomePeriodValElem = document.getElementsByClassName('income_period-value')[0];

// Срок достижения цели
const targetMonthValElem = document.getElementsByClassName('target_month-value')[0];


// --------------------- Конец блока получения элементов интерфейса ---------------------
// ======================================================================================

let expensesItems = document.querySelectorAll('.expenses-items');
let incomeItems = document.querySelectorAll('.income-items');

// ------------- Главный объект нашего приложения ---------------------------------------
const appData = {

   isIncome: null, // Наличие доп заработка
   income: {}, // Дополнительный заработок в формате: Наименование источника: сумма заработка
   addIncome: [],
   expenses: {}, // Обязательные расходы в формате: Статья расходов: Сумма расходов по данной статье

   addExpenses: [], // Массив наименований статей дополнительных расходов
   deposit: false, // Наличие депозита в банке
   percentDeposit: 0, // Процент по депозиту
   moneyDeposit: 0, // Сумма депозита
   incomeMonth: 0,
   budget: 0, // ... опять бюджет ... На самом деле это доход за месяц. 
   budgetDay: 0, // остаток денежных средств, после вычета обязательных расходов, на день
   budgetMonth: 0, // остаток денежных средств, после вычета обязательных расходов, на месяц
   expensesMonth: 0, // сумма обязательных платежей в месяц... вроде...
   incomeStatus: '', // Статус дохода (высокий, средний, низкий)

   start: function () {

      appData.budget = parseFloat(salaryAmountElem.value);
      appData.getExpenses();
      appData.getIncome();
      appData.getExpensesMonth();
      appData.getAddExpenses();
      appData.getAddIncome();
      appData.getBudget();

      appData.showResult();
   },

   // Заполняем поля для вывода инфы
   showResult: function () {
      budgetMonthValElem.value = appData.budgetMonth;
      budgetDayValElem.value = Math.ceil(appData.budgetDay);
      expensesMonthValElem.value = appData.expensesMonth;
      additionalExpensesValElem.value = appData.addExpenses.join(', ');
      additionalIncomeValElem.value = appData.addIncome.join(', ');
      targetMonthValElem.value = Math.ceil(appData.getTargetMonth());
      incomePeriodValElem.value = appData.calcPeriod();

      periodSelectElem.addEventListener('input', event => {
         incomePeriodValElem.value = appData.calcPeriod();
      });
   },

   // Получаем из поля "Возможные расходы" кривую строку, разбиваем, обрабатываем
   // и складываем в свойство addExpenses[]
   getAddExpenses: function () {
      let tmpAddExpenses = additionalExpensesItemElem.value.split(',');
      tmpAddExpenses.forEach(item => {
         let tmpItem = item.trim();
         if (tmpItem !== '') {
            appData.addExpenses.push(tmpItem[0].toUpperCase() + tmpItem.slice(1));
         }
      });
   },

   // Получаем из полей "Возможный доход" значения и складываем в свойство addIncome[]
   getAddIncome: function () {
      additionalIncomeElems.forEach(item => {
         const tmpItemVal = item.value.trim();
         if (tmpItemVal !== '') {
            appData.addIncome.push(tmpItemVal);
         }
      });
   },

   // добавляем поля дополнительных расходов
   addExpensesBlock: function () {
      const cloneExpensesItem = expensesItems[0].cloneNode(true);
      cloneExpensesItem.querySelector('.expenses-amount').value = '';
      cloneExpensesItem.querySelector('.expenses-amount').addEventListener('input', event => {
         validateNumbers(event.target);
      });
      expensesItems[0].parentNode.insertBefore(cloneExpensesItem, btnExpensesAddElem);
      expensesItems = document.querySelectorAll('.expenses-items');

      if (expensesItems.length === 3) {
         btnExpensesAddElem.style.display = 'none';
      }
   },

   addIncomeBlock: function () {
      const cloneIncomeItem = incomeItems[0].cloneNode(true);
      cloneIncomeItem.querySelector('.income-amount').value = '';
      cloneIncomeItem.querySelector('.income-amount').addEventListener('input', event => {
         validateNumbers(event.target);
      });
      incomeItems[0].parentNode.insertBefore(cloneIncomeItem, btnIncomeAddElem);
      incomeItems = document.querySelectorAll('.income-items');

      if (incomeItems.length === 3) {
         btnIncomeAddElem.style.display = 'none';
      }
   },

   // получаем из полей "Обязательные расходы" пары: Наименование расхода:Сумма расхода
   // и складываем в свойство expenses{}.
   getExpenses: function () {
      expensesItems.forEach(item => {
         const expTitle = item.querySelector('.expenses-title').value;
         const expAmount = item.querySelector('.expenses-amount').value;
         if (expTitle !== '' && expAmount !== '') {
            appData.expenses[expTitle] = parseFloat(expAmount);
         }
      });
   },

   getIncome: function () {
      incomeItems.forEach(item => {
         const incTitle = item.querySelector('.income-title').value;
         const incAmount = item.querySelector('.income-amount').value;
         if (incTitle !== '' && incAmount !== '') {
            appData.income[incTitle] = parseFloat(incAmount);
         }
      });

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
      this.budgetMonth = parseFloat(this.budget + this.incomeMonth - this.expensesMonth);
      this.budgetDay = Math.floor(this.budgetMonth / 30);
      return parseFloat(this.budgetMonth);
   },

   // Возвращает количество месяцев для достижения цели this.monthToMission
   getTargetMonth: function () {
      return parseFloat(targetAmountElem.value) / parseFloat(this.budgetMonth);
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
   calcPeriod: function () {
      return parseFloat(this.budgetMonth * parseFloat(periodSelectElem.value));
   },

};


btnCalculateElem.addEventListener('click', event => {
   // Добавил и проверку цели, т.к. если ее не ввести, то все плохо.
   if (salaryAmountElem.value === '' || targetAmountElem.value === '') {
      return;
   }
   appData.start();
});

btnExpensesAddElem.addEventListener('click', appData.addExpensesBlock);
btnIncomeAddElem.addEventListener('click', appData.addIncomeBlock);

periodSelectElem.addEventListener('input', event => {
   periodAmountTitleElem.textContent = event.target.value;
});



salaryAmountElem.addEventListener('input', event => {
   validateNumbers(event.target);
});

targetAmountElem.addEventListener('input', event => {
   validateNumbers(event.target);
});

incomeItems[0].querySelector('.income-amount').addEventListener('input', event => {
   validateNumbers(event.target);
});

expensesItems[0].querySelector('.expenses-amount').addEventListener('input', event => {
   validateNumbers(event.target);
});
