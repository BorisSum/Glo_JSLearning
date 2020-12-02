'use strict';

// Удалю сначала рекламу, из-за нее ничего не видно и бесит моргающий текст
const advElem = document.querySelector('div.adv');
advElem.remove();

// восстанавливаю порядок книг
const books = document.querySelectorAll('.book');

books[1].after(books[0]);
books[5].after(books[2]);
books[0].after(books[4]);

// Меняем картинку
document.body.style.backgroundImage = 'url("image/you-dont-know-js.jpg")';

// исправляем заголовок
books[4].querySelector('a').textContent = 'Книга 3. this и Прототипы Объектов';

// Порядок глав кинги 2
const paragraphs2 = books[0].querySelectorAll('li');
paragraphs2[3].after(paragraphs2[6]);
paragraphs2[6].after(paragraphs2[8]);
paragraphs2[9].after(paragraphs2[2]);

// порядок глав книги 5
const paragraphs5 = books[5].querySelectorAll('li');
paragraphs5[1].after(paragraphs5[9]);
paragraphs5[4].after(paragraphs5[2]);
paragraphs5[7].after(paragraphs5[5]);

// добавляем главу 8 в книге 6
const paragraphs6 = books[2].querySelectorAll('li');
paragraphs6[8].after(paragraphs6[8].cloneNode(true).textContent = 'Глава 8: За пределами ES6');
