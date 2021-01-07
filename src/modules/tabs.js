const tabs = () => {
   const tabButtonsWrapper = document.querySelector('.service-header');
   const tabButtons = tabButtonsWrapper.querySelectorAll('.service-header-tab');
   const tabElems = document.querySelectorAll('.service-tab');

   const toggleTabContent = index => {
      for (let i = 0; i < tabElems.length; i++) {
         if (index === i) {
            tabElems[i].classList.remove('d-none');
            tabButtons[i].classList.add('active');
         } else {
            tabElems[i].classList.add('d-none');
            tabButtons[i].classList.remove('active');
         }
      }
   };

   tabButtonsWrapper.addEventListener('click', event => {
      let target = event.target.closest('.service-header-tab');

      if (target) {
         tabButtons.forEach((item, index) => {
            if (item === target) {
               toggleTabContent(index);
            }
         });
      }
   });
};

export default tabs;