const changePhoto = () => {
   const photos = document.querySelectorAll('.command__photo');
   const photoContainer = document.querySelector('.command');

   const togglePicture = (target, selector) => {
      if (target.matches(selector)) {
         const currSrc = target.src;
         target.src = target.dataset.img;
         target.dataset.img = currSrc;
      }
   };

   photoContainer.addEventListener('mouseover', event => {
      let target = event.target;
      togglePicture(target, '.command__photo');
   });

   photoContainer.addEventListener('mouseout', event => {
      let target = event.target;
      togglePicture(target, '.command__photo');
   });
};

export default changePhoto;