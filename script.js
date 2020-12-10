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
const depositBank = document.querySelector('.deposit-bank');
const depositAmount = document.querySelector('.deposit-amount');
const depositPercent = document.querySelector('.deposit-percent');
const validatePercent = () => {
   depositPercent.value = depositPercent.value.replace(/[^\d]/g, '');
   if (+depositPercent.value > 100) {
      alert('Процент по депозиту должен находиться в диапазоне от 0 до 100!');
      depositPercent.value = '';
   }
};

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
      this.inputsIncExp = {
         expenses: 1,
         income: 1
      };

   }
   start() {
      if (salaryAmountElem.value === '') {
         alert('Не заполнено обязательное поле "Месячный доход"');
         return;
      }

      if (this.deposit && depositPercent.value === '') {
         alert('Не заполнено поле "Процент по депозиту"');
         return;
      }
      if (this.deposit && depositAmount.value === '') {
         alert('Не заполнено поле "Сумма депозита"');
         return;
      }

      this.budget = parseFloat(salaryAmountElem.value);

      expensesItems = document.querySelectorAll('.expenses-items');
      incomeItems = document.querySelectorAll('.income-items');

      this.getExpInc(); // Комбинированная функция для получения расходов и доходов
      this.getIncExpMonth('income'); // Суммируем доходы за месяц -> this.incomeMonth
      this.getIncExpMonth('expenses'); // Суммируем расходы за месяц -> this.expensesMonth
      this.getInfoDeposit();

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
      this.inputsIncExp = {
         expenses: 1,
         income: 1
      };

      // Возвращаем на место range
      periodSelectElem.value = 1;
      periodAmountTitleElem.textContent = '1';

      // Показываем кнопку Рассчитать
      btnCalculateElem.style.display = 'block';

      // Убираем кнопку сбросить
      btnCancelElem.style.display = 'none';

      // Возвращаем Депозит в исходное состояние
      this.deposit = false;
      depositPercent.style.display = 'none';
      depositPercent.value = '';
      depositAmount.value = '';
      depositAmount.style.display = 'none';
      depositBank.style.display = 'none';
      depositBank.value = '';
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

   // Универсальная (типа) функция для добавления полей на страницу
   addInputsBlock(blockType) {
      let elems = null;
      let buttonPlus = null;
      if (blockType === 'income') {
         elems = incomeItems;
         buttonPlus = btnIncomeAddElem;
      } else if (blockType === 'expenses') {
         elems = expensesItems;
         buttonPlus = btnExpensesAddElem;
      } else { return; }

      const cloneElem = elems[0].cloneNode(true);
      const amountElem = cloneElem.querySelector(`.${blockType}-amount`);
      const titleElem = cloneElem.querySelector(`.${blockType}-title`);
      amountElem.value = '';
      titleElem.value = '';
      amountElem.addEventListener('input', event => {
         validateNumbers(event.target);
      });
      titleElem.addEventListener('input', event => {
         validateText(event.target);
      });
      elems[0].parentNode.insertBefore(cloneElem, buttonPlus);
      this.inputsIncExp[blockType]++;
      if (this.inputsIncExp[blockType] === 3) {
         buttonPlus.style.display = 'none';
      }
   }

   // Получаем данные из полей расходов и доходов
   getExpInc() {
      const count = item => {
         const startStr = item.className.split('-')[0];
         const itemTitle = item.querySelector(`.${startStr}-title`).value;
         const itemAmount = item.querySelector(`.${startStr}-amount`).value;
         if (itemTitle !== '' && itemAmount !== '') {
            this[startStr][itemTitle] = parseFloat(itemAmount);
         }
      };

      expensesItems.forEach(count);
      incomeItems.forEach(count);
   }

   // Универсальная функция суммирования всех доп расходов и всех доп доходов
   getIncExpMonth(moneyType) {
      for (let property in this[moneyType]) {
         this[moneyType + 'Month'] += this[moneyType][property];
      }
   }

   // Возвращает сумму денег в месяц, которая пойдет в накопление (доходы - обязательные расходы)
   getBudget() {

      const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);

      this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
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

   calcPeriod() {
      return this.budgetMonth * parseFloat(periodSelectElem.value);
   }

   // Получение информации по депозиту
   getInfoDeposit() {
      if (this.deposit) {
         this.percentDeposit = depositPercent.value;
         this.moneyDeposit = depositAmount.value;
      }
   }

   changePercent() {
      const valueSelect = this.value;
      if (valueSelect === 'other') {
         depositPercent.value = '';
         depositPercent.style.display = 'inline-block';
         depositPercent.addEventListener('input', validatePercent);
      } else {
         depositPercent.value = valueSelect;
         depositPercent.style.display = 'none';
         depositPercent.removeEventListener('input', validatePercent);
      }

   }
   // Расчет суммы, которая будет накоплена за период

   depositHandler() {
      if (depositCheckElem.checked) {
         depositBank.style.display = 'inline-block';
         depositAmount.style.display = 'inline-block';
         this.deposit = true;
         depositBank.addEventListener('change', this.changePercent);
      } else {
         depositBank.style.display = 'none';
         depositAmount.style.display = 'none';
         depositBank.value = '';
         depositAmount.value = '';
         this.deposit = false;
         depositBank.removeEventListener('change', this.changePercent);
         depositPercent.style.display = 'none';
      }
   }

   eventHandlers() {

      depositCheckElem.addEventListener('change', this.depositHandler.bind(this));

      btnCalculateElem.addEventListener('click', () => {
         this.start();
      });

      btnCancelElem.addEventListener('click', () => {
         this.resetCalc();
      });

      btnExpensesAddElem.addEventListener('click', () => {
         this.addInputsBlock('expenses');
      });
      btnIncomeAddElem.addEventListener('click', () => {
         this.addInputsBlock('income');
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
// salaryAmountElem.value = '45000';
// incomeTitleElem.value = 'Электромонтаж';
// incomeAmountElem.value = '5000';
// additionalIncomeElems[0].value = 'Медь';
// additionalIncomeElems[1].value = 'Найду деньги';
// targetAmountElem.value = '450000';
