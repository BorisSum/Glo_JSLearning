const sendForm = () => {
   function maskPhone(selector, masked = '+7 (___) ___-__-__') {
      const elems = document.querySelectorAll(selector);

      const mask = function (event) {
         const keyCode = event.keyCode;
         const template = masked,
            def = template.replace(/\D/g, ""),
            val = this.value.replace(/\D/g, "");

         let i = 0,
            newValue = template.replace(/[_\d]/g, function (a) {
               return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
            });
         i = newValue.indexOf("_");
         if (i !== -1) {
            newValue = newValue.slice(0, i);
         }
         let reg = template.substr(0, this.value.length).replace(/_+/g,
            function (a) {
               return "\\d{1," + a.length + "}";
            }).replace(/[+()]/g, "\\$&");
         reg = new RegExp("^" + reg + "$");
         if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
            this.value = newValue;
         }
         if (event.type === "blur" && this.value.length < 5) {
            this.value = "";
         }

      };

      for (const elem of elems) {
         elem.addEventListener("input", mask);
         elem.addEventListener("focus", mask);
         elem.addEventListener("blur", mask);
      }
   }

   maskPhone('#form1-phone');
   maskPhone('#form2-phone');
   maskPhone('#form3-phone');

   // --------------------------------------------------------------------------
   const errTextColor = '#FFA6AE';

   const postData = (dataValues) => {
      return fetch('./server.php', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(dataValues),
      });
   };

   document.addEventListener('submit', event => {
      event.preventDefault();
      let target = event.target;
      let formInputText = null, timeout = 5000;

      if (!(target.matches('#form1') || target.matches('#form2') || target.matches('#form3'))) {
         return;
      }

      if (target.matches('#form2')) {
         formInputText = document.getElementById('form2-message');
      }

      if (target.matches('#form3')) {
         timeout = 1000;
      }

      const formInputName = document.getElementById(`${target.id}-name`);
      const formInputEmail = document.getElementById(`${target.id}-email`);
      const formInputPhone = document.getElementById(`${target.id}-phone`);

      let statusMessage = target.querySelector('.js-status-message');

      if (!statusMessage) {
         statusMessage = document.createElement('div');
         statusMessage.classList.add('js-status-message');
         statusMessage.style.cssText = `color:white; font-size:12px;`;
         target.append(statusMessage);
      }

      const errorMessage = 'Что-то пошло не так ...';
      const loadMessage = 'Загрузка ...';
      const successMessage = 'Спасибо! Мы скоро с вами свяжемся!';

      // Валидация полей
      // Имя

      if (!(/^[а-я ]{2,}$/i.test(formInputName.value))) {
         statusMessage.style.color = errTextColor;
         statusMessage.textContent = 'Имя должно содержать только кирилицу, пробелы и быть не короче двух символов!';
         return;
      }

      // Почта
      if (formInputEmail.value.length === 0 ||
         !(/.+@.+\..+/i.test(formInputEmail.value))) {
         statusMessage.style.color = errTextColor;
         statusMessage.textContent = 'Поле "E-mail" заполнено некорректно!';
         return;
      }

      // Сообщение
      if (target.matches('#form2')) {
         if (!(/^[а-я0-9 \.,:;\-\(\)\!\?]{1,}$/i.test(formInputText.value))) {
            statusMessage.style.color = errTextColor;
            statusMessage.textContent = 'Поле "Сообщение" может содержать только кирилицу, цифры и знаки препинания';
            return;
         }
      }

      let formDataValues = {};
      statusMessage.style.color = 'white';
      statusMessage.textContent = loadMessage;

      const formData = new FormData(target);
      formData.forEach((item, index) => {
         formDataValues[index] = item;
      });

      postData(formDataValues)
         .then((response) => {
            if (response.status !== 200) {
               throw new Error('Netwok status is not equal 200');
            }
            statusMessage.textContent = successMessage;
            setTimeout(() => {
               statusMessage.textContent = '';
               statusMessage.remove();
               if (target.matches('#form3')) {
                  document.querySelector('.popup').style.display = 'none';
               }
            }, timeout);
         })
         .catch(error => {
            statusMessage.style.color = errTextColor;
            statusMessage.textContent = `${errorMessage} (${error})`;
         });

      // очистка инпутов
      formInputName.value = '';
      formInputEmail.value = '';
      formInputPhone.value = '';
      if (formInputText) {
         formInputText.value = '';
      }

   });
};

export default sendForm;