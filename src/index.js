'use strict';

import countTimer from './modules/countTimer';
import toggleMenu from './modules/toggleMenu';
import togglePopup from './modules/togglePopup';
import scrollByButton from './modules/scrollByButton';
import tabs from './modules/tabs';
import slider from './modules/slider';
import calc from './modules/calc';
import changePhoto from './modules/changePhoto';
import sendForm from './modules/sendForm';

countTimer('11 january 2021'); // Таймер обратного отсчета
toggleMenu(); // Главное меню
togglePopup(); // Всплывающее меню с формой
scrollByButton(); // Плавная прокрутка по кнопке под первой формой
tabs(); // Табы
slider(); // Слайдер
calc(100); // Калькулятор
changePhoto(); // Смена фотографий команды по наведению мыши
sendForm(); // Отправка форм с валидацией