'use strict';

const DomElement = function (selector, { height, width, bg, fontSize }) {
   this.selector = selector;

   styles: {
      this.height = height;
      this.width = width;
      this.bg = bg;
      this.fontSize = fontSize;
   }
};

DomElement.prototype.createElement = function () {
   let domElem;
   if (this.selector[0] === '.') {
      const className = this.selector.slice(1);
      domElem = document.createElement('div');
      domElem.classList.add(className);
      domElem.textContent = 'Это блок DIV';
   } else if (this.selector[0] === '#') {
      const parID = this.selector.slice(1);
      domElem = document.createElement('p');
      domElem.setAttribute('id', parID);
      domElem.textContent = 'Это параграф. Lorem ipsum dolor, sit amet consectetur adipisicing.';
   }
   document.body.append(domElem);
   domElem.style.cssText = `height:${this.height}; width:${this.width}; background-color:${this.bg};
      font-size:${this.fontSize}`;
};

const newElem = new DomElement('.main', { height: '100px', width: '300px', bg: '#e5e5e5', fontSize: '36px' });
newElem.createElement();
const newElem2 = new DomElement('#main', { height: '100px', width: '100%', bg: '#c5d5f5', fontSize: '14px' });
newElem2.createElement();