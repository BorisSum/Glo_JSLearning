'use strict';

// --------- Функции валидаци -----------------------------------------------------------
const isNumber = argument => {
   return !isNaN(parseFloat(argument)) && isFinite(argument);
};

const validateNumbers = target => target.value = target.value.replace(/[^\d.]/g, '');
const validateText = target => target.value = target.value.replace(/[^\W.]/gi, '');

// --------------------- Получение элементов интерфейса ---------------------------------
// Месячный доход
const salaryAmountElem = document.querySelector('.salary-amount');

// Дополнительный доход Наименование
const incomeTitleElem = document.querySelector('input.income-title');

// Дополнительный доход Сумма
const incomeAmountElem = document.querySelector('.income-amount');

// Кнопка "+" для добавления доп. доходов
const btnIncomeAddElem = document.querySelector('.income_add');

// Возможный доход Наименование. Два поля
const additionalIncomeElems = document.querySelectorAll('input.additional_income-item');

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

let expensesItems = document.querySelectorAll('.expenses-items');

let incomeItems = document.querySelectorAll('.income-items');

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


const toggleInputsDisable = param => {
   salaryAmountElem.disabled = param;

   incomeItems.forEach(item => {
      item.querySelector('.income-title').disabled = param;
      item.querySelector('.income-amount').disabled = param;
   });
   additionalIncomeElems[0].disabled = param;
   additionalIncomeElems[1].disabled = param;

   expensesItems.forEach(item => {
      item.querySelector('.expenses-title').disabled = param;
      item.querySelector('.expenses-amount').disabled = param;
   });

   additionalExpensesItemElem.disabled = param;
   targetAmountElem.disabled = param;
};

// ------------- Главный объект нашего приложения ---------------------------------------
class AppData {
   constructor() {

      this.isIncome = null; // Наличие доп заработка
      this.income = {}; // Дополнительный заработок в формате: Наименование источника: сумма заработка
      this.addIncome = []; // Возможные дополнительные доходы в виде строк, разделенных запятой
      this.expenses = {}; // Обязательные расходы в формате: Статья расходов: Сумма расходов по данной статье
      this.addExpenses = []; // Массив наименований статей дополнительных расходов
      this.deposit = false; // Наличие депозита в банке
      this.percentDeposit = 0; // Процент по депозиту
      this.moneyDeposit = 0; // Сумма депозита
      this.incomeMonth = 0;
      this.budget = 0; // ... опять бюджет ... На самом деле это доход за месяц. 
      this.budgetDay = 0; // остаток денежных средств, после вычета обязательных расходов, на день
      this.budgetMonth = 0; // остаток денежных средств, после вычета обязательных расходов, на месяц
      this.expensesMonth = 0; // сумма обязательных платежей в месяц... вроде...
      this.incomeStatus = ''; // Статус дохода (высокий, средний, низкий)

   }
   start() {
      if (salaryAmountElem.value === '') {
         return;
      }

      this.budget = parseFloat(salaryAmountElem.value);

      this.getExpenses(); // Получаем все обязательные расходы в this.expenses{}


      // в формате "Наименование: сумма". Сумма - в виде числа.
      this.getExpensesMonth(); // Суммируем обязательные расходы из expenses{}


      // и присваиваем эту сумму в expensesMonth
      this.getIncome(); // Получаем все дополнительные доходы в this.income{}


      // в формате "Наименование: сумма". Сумма - в виде числа.
      this.getIncomeMonth(); // Суммируем все дополнительные доходы из income{}


      // и присваиваем эту сумму в incomeMonth
      this.getBudget(); // расчет budgetMonth = budget + incomeMonth - expensesMonth



      // и budgetDay = budgetMonth / 30;
      // Тут получаем текстовые данные - пока не интересно
      this.getAddExpenses();
      this.getAddIncome();

      // Показываем результат.
      this.showResult();

      // ----- Блокируем все инпуты слева (потом перенести в нормальный start) -------
      toggleInputsDisable(true);

      // Убираем кнопку Рассчитать
      btnCalculateElem.style.display = 'none';

      // Показываем кнопку сбросить
      btnCancelElem.style.display = 'block';
   }
   // Заполняем поля для вывода инфы
   showResult() {

      budgetMonthValElem.value = this.budgetMonth;
      budgetDayValElem.value = Math.ceil(this.budgetDay);
      expensesMonthValElem.value = this.expensesMonth;
      additionalExpensesValElem.value = this.addExpenses.join(', ');
      additionalIncomeValElem.value = this.addIncome.join(', ');
      targetMonthValElem.value = Math.ceil(this.getTargetMonth());
      incomePeriodValElem.value = this.calcPeriod();

      periodSelectElem.addEventListener('input', () => {
         incomePeriodValElem.value = this.calcPeriod();
      });
   }
   // Сброс в начальное состояние
   resetCalc() {
      // Разблокируем все инпуты
      toggleInputsDisable(false);

      // Очищаем их
      budgetMonthValElem.value = '';
      budgetDayValElem.value = '';
      expensesMonthValElem.value = '';
      additionalExpensesValElem.value = '';
      additionalIncomeValElem.value = '';
      targetMonthValElem.value = '';
      incomePeriodValElem.value = '';

      salaryAmountElem.value = '';

      incomeItems.forEach(item => {
         item.querySelector('.income-title').value = '';
         item.querySelector('.income-amount').value = '';
      });
      additionalIncomeElems[0].value = '';
      additionalIncomeElems[1].value = '';

      expensesItems.forEach(item => {
         item.querySelector('.expenses-title').value = '';
         item.querySelector('.expenses-amount').value = '';
      });

      additionalExpensesItemElem.value = '';
      targetAmountElem.value = '';
      depositCheckElem.checked = false;

      // Убираем лишние поля Дополнительных доходов и показываем кнопку "+"
      incomeItems.forEach((item, index) => {
         if (index !== 0) {
            item.remove();
         }
      });
      btnIncomeAddElem.style.display = '';

      // Убираем лишние поля Обязательные расходы и показываем кнопку "+"
      expensesItems.forEach((item, index) => {
         if (index !== 0) {
            item.remove();
         }
      });
      btnExpensesAddElem.style.display = '';

      // Возвращаем appData в исходное состояние
      this.isIncome = null;
      this.income = {};
      this.addIncome = [];
      this.expenses = {};
      this.addExpenses = [];
      this.deposit = false;
      this.percentDeposit = 0;
      this.moneyDeposit = 0;
      this.incomeMonth = 0;
      this.budget = 0;
      this.budgetDay = 0;
      this.budgetMonth = 0;
      this.expensesMonth = 0;
      this.incomeStatus = '';

      // Возвращаем на место range
      periodSelectElem.value = 1;
      periodAmountTitleElem.textContent = '1';

      // Показываем кнопку Рассчитать
      btnCalculateElem.style.display = 'block';

      // Убираем кнопку сбросить
      btnCancelElem.style.display = 'none';
   }
   // Получаем из поля "Возможные расходы" кривую строку, разбиваем, обрабатываем
   // и складываем в свойство addExpenses[]
   getAddExpenses() {
      let tmpAddExpenses = additionalExpensesItemElem.value.split(',');
      tmpAddExpenses.forEach(item => {
         let tmpItem = item.trim();
         if (tmpItem !== '') {
            this.addExpenses.push(tmpItem[0].toUpperCase() + tmpItem.slice(1));
         }
      });
   }
   // Получаем из полей "Возможный доход" значения и складываем в свойство addIncome[]
   // эти значения нигде в расчетах не участвуют
   getAddIncome() {
      additionalIncomeElems.forEach(item => {
         const tmpItemVal = item.value.trim();
         if (tmpItemVal !== '') {
            this.addIncome.push(tmpItemVal);
         }
      });
   }
   // добавляем поля дополнительных расходов
   addExpensesBlock() {
      const cloneExpensesItem = expensesItems[0].cloneNode(true);
      cloneExpensesItem.querySelector('.expenses-amount').value = '';
      cloneExpensesItem.querySelector('.expenses-title').value = '';
      cloneExpensesItem.querySelector('.expenses-amount').addEventListener('input', event => {
         validateNumbers(event.target);
      });
      cloneExpensesItem.querySelector('.expenses-title').addEventListener('input', event => {
         validateText(event.target);
      });
      expensesItems[0].parentNode.insertBefore(cloneExpensesItem, btnExpensesAddElem);
      expensesItems = document.querySelectorAll('.expenses-items');

      if (expensesItems.length === 3) {
         btnExpensesAddElem.style.display = 'none';
      }
   }
   // Добавляем поля дополнительных доходов
   addIncomeBlock() {
      const cloneIncomeItem = incomeItems[0].cloneNode(true);
      cloneIncomeItem.querySelector('.income-amount').value = '';
      cloneIncomeItem.querySelector('.income-title').value = '';
      cloneIncomeItem.querySelector('.income-amount').addEventListener('input', event => {
         validateNumbers(event.target);
      });
      cloneIncomeItem.querySelector('.income-title').addEventListener('input', event => {
         validateText(event.target);
      });
      incomeItems[0].parentNode.insertBefore(cloneIncomeItem, btnIncomeAddElem);
      incomeItems = document.querySelectorAll('.income-items');

      if (incomeItems.length === 3) {
         btnIncomeAddElem.style.display = 'none';
      }
   }
   // получаем из полей "Обязательные расходы" пары: Наименование расхода:Сумма расхода
   // и складываем в свойство expenses{}.
   getExpenses() {
      expensesItems.forEach(item => {
         const expTitle = item.querySelector('.expenses-title').value;
         const expAmount = item.querySelector('.expenses-amount').value;
         if (expTitle !== '' && expAmount !== '') {
            this.expenses[expTitle] = parseFloat(expAmount);
         }
      });
   }
   // получаем из полей "Дополнительные доходы" пары: Наименование дохода:Сумма
   // и складываем в свойство income{}.
   getIncome() {
      incomeItems.forEach(item => {
         const incTitle = item.querySelector('.income-title').value;
         const incAmount = item.querySelector('.income-amount').value;
         if (incTitle !== '' && incAmount !== '') {
            this.income[incTitle] = parseFloat(incAmount);
         }
      });
   }
   // метод, возвращающий this.expensesMonth. А это сумма обязательных платежей.
   getExpensesMonth() {
      for (let property in this.expenses) {

         this.expensesMonth += this.expenses[property];
      }
      return this.expensesMonth;
   }
   // Получаем доп доходы за месяц
   getIncomeMonth() {
      for (let property in this.income) {
         this.incomeMonth += this.income[property];
      }
      return this.incomeMonth;
   }
   // Возвращает сумму денег в месяц, которая пойдет в накопление (доходы - обязательные расходы)
   getBudget() {
      this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
      this.budgetDay = Math.floor(this.budgetMonth / 30);
      return this.budgetMonth;
   }
   // Возвращает количество месяцев для достижения цели this.monthToMission
   getTargetMonth() {
      if (targetAmountElem.value === '') { return 0; }
      return parseFloat(targetAmountElem.value) / this.budgetMonth;
   }
   // Возвращает статус дохода
   getStatusIncome() {
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
   // Получение информации по депозиту
   getInfoDeposit() {
      // this.deposit = confirm('Есть ли у Вас депозит в банке?');
      // if (this.deposit) {
      //    this.percentDeposit = promptForNumber('Введите процент по депозиту');
      //    this.moneyDeposit = promptForNumber('Введите сумму депозита');
      // }
   }
   // Расчет суммы, которая будет накоплена за период
   calcPeriod() {
      return this.budgetMonth * parseFloat(periodSelectElem.value);
   }
   eventHandlers() {

      btnCalculateElem.addEventListener('click', () => {
         this.start();
      });

      btnCancelElem.addEventListener('click', () => {
         this.resetCalc();
      });

      btnExpensesAddElem.addEventListener('click', () => {
         this.addExpensesBlock();
      });
      btnIncomeAddElem.addEventListener('click', () => {
         this.addIncomeBlock();
      });

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
      incomeItems[0].querySelector('.income-title').addEventListener('input', event => {
         validateText(event.target);
      });

      expensesItems[0].querySelector('.expenses-amount').addEventListener('input', event => {
         validateNumbers(event.target);
      });
      expensesItems[0].querySelector('.expenses-title').addEventListener('input', event => {
         validateText(event.target);
      });

      additionalExpensesItemElem.addEventListener('input', event => {
         validateText(event.target);
      });

      additionalIncomeElems.forEach(item => {
         item.addEventListener('input', event => {
            validateText(event.target);
         });
      });
   }
}




// -------------------------------------------------------------------------------

const appData = new AppData();
appData.eventHandlers();

// --------- Чтобы каждый раз не заполнять ------------------
salaryAmountElem.value = '45000';
incomeTitleElem.value = 'Электромонтаж';
incomeAmountElem.value = '5000';
additionalIncomeElems[0].value = 'Медь';
additionalIncomeElems[1].value = 'Найду деньги';
targetAmountElem.value = '450000';
