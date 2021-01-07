const toggleMenu = () => {

   const menuBlock = document.querySelector('menu');

   const openMenu = () => {
      menuBlock.classList.add('active-menu');
   };

   const closeMenu = () => {
      menuBlock.classList.remove('active-menu');
   };

   document.addEventListener('click', event => {
      let target = event.target;
      if (target.closest('.menu')) {
         openMenu();
      } else {
         if (!target.closest('menu')) { // кликнули мимо меню
            closeMenu();
            return;
         }
         if (target.matches('.close-btn')) { // кликнули по крестику
            closeMenu();
            return;
         }
         if (target.matches('a')) { // кликнули по пункту меню
            event.preventDefault();
            closeMenu();
            const strTraget = target.href.split("#")[1];
            const destinationView = document.querySelector(`#${strTraget}`);
            destinationView.scrollIntoView({ block: "start", behavior: "smooth" });
         }
      }
   });
};

export default toggleMenu;