'use strict';

class Todo {
   constructor(form, input, todoList, todoCompleted, todoContainer) {
      this.form = document.querySelector(form);
      this.input = document.querySelector(input);
      this.todoList = document.querySelector(todoList);
      this.todoCompleted = document.querySelector(todoCompleted);
      this.todoContainer = document.querySelector(todoContainer);

      this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
   }

   addToStorage() {
      localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
   }

   generateKey() {
      return `f${(+new Date()).toString(16)}`;
   }

   createElem(todoItem) {
      const li = document.createElement('li');
      li.classList.add('todo-item');
      li.key = todoItem.key;
      li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todoItem.value}</span>
				<div class="todo-buttons">
					<button class="todo-remove"></button>
					<button class="todo-complete"></button>
				</div>
      `);
      if (todoItem.completed) {
         this.todoCompleted.append(li);
      } else {
         this.todoList.append(li);
      }

   }

   render() {
      this.todoList.textContent = '';
      this.todoCompleted.textContent = '';
      this.todoData.forEach(this.createElem, this);
      this.addToStorage();
   }

   addTodo(event) {

      event.preventDefault();
      if (this.input.value.trim()) {
         const newTodo = {
            value: this.input.value,
            completed: false,
            key: this.generateKey(),
         };
         this.todoData.set(newTodo.key, newTodo);
         this.input.value = '';
         this.render();
      } else {
         alert('Пустое "дело" добавить нельзя!');
      }
   }

   deleteItem(key) {
      this.todoData.delete(key);
      this.render();
   }

   completedItem(key) {
      const currentTodo = this.todoData.get(key);
      currentTodo.completed = !currentTodo.completed;
      this.todoData.set(key, currentTodo);
      this.render();
   }

   handler() {
      // Определить на какую из кнопок кликнул пользователь (корзинка или галочка)

      this.todoContainer.addEventListener('click', event => {
         let target = event.target;
         if (target.matches('.todo-complete')) {
            const key = target.closest('.todo-item').key;
            this.completedItem(key);
         } else if (target.matches('.todo-remove')) {
            const key = target.closest('.todo-item').key;
            this.deleteItem(key);
         }
      });
   }

   init() {
      this.form.addEventListener('submit', this.addTodo.bind(this));
      this.handler();
      this.render();

   }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');

todo.init();
