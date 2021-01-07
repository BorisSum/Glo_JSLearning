const togglePopup = () => {

   const popupMenu = document.querySelector('.popup');
   const popupButtons = document.querySelectorAll('.popup-btn');
   const popupContent = popupMenu.querySelector('.popup-content');

   let coordY = 0;
   let requestID;

   const showPopup = () => {
      requestID = requestAnimationFrame(showPopup);
      coordY++;
      if (coordY < 15) {
         popupContent.style.top = coordY * 8 + 'px';
      } else {
         cancelAnimationFrame(requestID);
         coordY = 0;
      }
   };

   popupButtons.forEach(item => item.addEventListener('click', () => {
      popupMenu.style.display = 'block';
      if (screen.width >= 768) {
         showPopup();
      }
   }));

   popupMenu.addEventListener('click', event => {
      let target = event.target;

      if (target.classList.contains('popup-close')) {
         popupMenu.style.display = 'none';
      } else {
         target = target.closest('.popup-content');
         if (!target) {
            popupMenu.style.display = 'none';
         }
      }
   });
};

export default togglePopup;