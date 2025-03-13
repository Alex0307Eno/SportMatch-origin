function openModal(title, content, submitUrl = null) {
    document.querySelector('#dynamicModal .modal-title').innerHTML = title;
    document.querySelector('#dynamicModal .modal-body').innerHTML = content;
    
   if(submitUrl) {
       document.querySelector('#dynamicModal .modal-title').style.display = 'flex';
       document.getElementById('modalSubmitButton').onclick = function () {
           submitForm(submitUrl);
       };
   } else {
       document.getElementById('modalSubmitButton').style.display = 'none';
   }
   
   new bootstrap.Modal(document.getElementById('dynamicModal')).show();
}