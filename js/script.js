function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

docReady(function() {
  let zindex = 10;
  const cards = document.querySelector('.cards').querySelectorAll('.card');
  const cardsOuter = document.querySelector('.cards');

  function cardToogle(e) {    
    e.preventDefault();	

    if(this.classList.contains('show')) {
      this.classList.remove('show');
      cardsOuter.classList.remove('showing');
    } else {
      this.style.zIndex = zindex;
      for(let card = 0; card < cards.length; card++){
        cards[card].classList.remove('show');
      }
      this.classList.add('show');      

      cardsOuter.classList.add('showing');
    }
    zindex++;              
  }      

  for(let card = 0; card < cards.length; card++){
    cards[card].addEventListener('click', cardToogle);    
  }  
});

window.onscroll = function() {
  changeClass();
};

function moveToPrice() {
  let elmnt = document.getElementById('price');
  elmnt.scrollIntoView();
}
moveToPrice();
function moveToBook() {
  let elmnt = document.getElementById('contact');
  elmnt.scrollIntoView();
}
moveToBook();

function changeClass() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    document.querySelector('.navbar').className = 'navbar scroll';
  } else {
    document.querySelector('.navbar').className = 'navbar';
  }
}

(function() {
  function validEmail(email) {
    let re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  }
  // get all data in form and return object
  function getFormData(form) {
    let elements = form.elements;

    let fields = Object.keys(elements).filter(function(k) {
      return (elements[k].name !== 'honeypot');
    }).map(function(k) {
      if(elements[k].name !== undefined) {
        return elements[k].name;
      // special case for Edge's html collection
      }else if(elements[k].length > 0){
        return elements[k].item(0).name;
      }
    }).filter(function(item, pos, self) {
      return self.indexOf(item) === pos && item;
    });

    let formData = {};
    fields.forEach(function(name){
      let element = elements[name];
      
      // singular form elements just have one value
      formData[name] = element.value;

      // when our element has multiple items, get their values
      if (element.length) {
        let data = [];
        for (let i = 0; i < element.length; i++) {
          let item = element.item(i);
          if (item.checked || item.selected) {
            data.push(item.value);
          }
        }
        formData[name] = data.join(', ');
      }
    });

    // add form-specific values into the data
    formData.formDataNameOrder = JSON.stringify(fields);
    formData.formGoogleSheetName = form.dataset.sheet || 'responses'; // default sheet name
    formData.formGoogleSendEmail = form.dataset.email || ''; // no email by default

    console.log(formData);
    return formData;
  }

  function handleFormSubmit(event) {  // handles form submit without any jquery
    event.preventDefault();           // we are submitting via xhr below
    let form = event.target;
    let data = getFormData(form);         // get the values submitted in the form

    /* OPTION: Remove this comment to enable SPAM prevention, see README.md
    if (validateHuman(data.honeypot)) {  //if form is filled, form will not be submitted
      return false;
    }
    */

    if( data.email && !validEmail(data.email) ) {   // if email is not valid show error
      let invalidEmail = form.querySelector('.email-invalid');
      if (invalidEmail) {
        invalidEmail.style.display = 'block';
        return false;
      }
    } else {
      disableAllButtons(form);
      let url = form.action;
      let xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      // xhr.withCredentials = true;
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange = function() {
        console.log(xhr.status, xhr.statusText);
        console.log(xhr.responseText);
        let formElements = form.querySelector('.form-elements');
        if (formElements) {
          formElements.style.display = 'none'; // hide form
        }
        let thankYouMessage = form.querySelector('.thankyou_message');
        if (thankYouMessage) {
          thankYouMessage.style.display = 'block';
        }
      };
      // url encode form data for sending as post data
      let encoded = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
      }).join('&');
      xhr.send(encoded);
    }
  }
  
  function loaded() {
    console.log('Contact form submission handler loaded successfully.');
    // bind to the submit event of our form
    let forms = document.querySelectorAll('form.gform');
    for (let i = 0; i < forms.length; i++) {
      forms[i].addEventListener('submit', handleFormSubmit, false);
    }
  }
  document.addEventListener('DOMContentLoaded', loaded, false);

  function disableAllButtons(form) {
    let buttons = form.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }
})();

/* Validation */
const pageContent = document.querySelector('#page-content');
const name = document.querySelector('#name');
const email = document.querySelector('#email');
const phone = document.querySelector('#phone');
const message = document.querySelector('#message');
const subBtn = document.querySelector('#subBtn');
const errorMes = document.querySelector('.errorMes');
const eventListeners = ['blur', 'keyup', 'change', 'input', 'focusin', 'focusout'];

for(let eventListener of eventListeners) {
  name.addEventListener(eventListener, ()=>{
    if(name.value.length > 0) {
      name.style.background = '#26de81';
      console.log(eventListener);
    } else {
      name.style.background = '#ecf0f1';
    }
  });

  phone.addEventListener(eventListener, ()=>{
    if(phone.value.length > 0) {
      phone.style.background = '#26de81';
    } else {
      phone.style.background = '#ecf0f1';
    }
  });

  email.addEventListener(eventListener, ()=>{
    if(email.value.length > 0 && email.value.includes('@') && email.value.includes('.')) {
      email.style.background = '#26de81';
      subBtn.classList.add('emailOk');
      console.log(subBtn.classList);
    } else {
      email.style.background = '#ecf0f1';
      subBtn.classList.remove('emailOk');
      console.log(subBtn.classList);
    }
  });

  message.addEventListener(eventListener, ()=>{
    if(message.value.length > 5) {
      message.style.background = '#26de81';
      subBtn.classList.add('messageOk');
    } else {
      message.style.background = '#ecf0f1';
      subBtn.classList.remove('messageOk');
    }
  });
}
subBtn.addEventListener('click', (e)=> {
  if(!subBtn.classList.contains('emailOk')) {
    e.preventDefault();
    errorMes.style.backgroundColor = ('rgba(252, 92, 101, 0.94');
    errorMes.style.display = 'block';
    errorMes.childNodes[0].innerHTML = 'Wpisz prawidłowy adres e-mail';
  } else if(!subBtn.classList.contains('messageOk')) {
    e.preventDefault();
    errorMes.style.backgroundColor = ('rgba(252, 92, 101, 0.94');
    errorMes.style.display = 'block';
    errorMes.childNodes[0].innerHTML = 'Wpisz treść wiadomości';
  } else {
    errorMes.style.backgroundColor = '#26de81';
    errorMes.style.display = 'block';
    errorMes.childNodes[0].innerHTML = 'Dziękujemy za wiadomość. Odpowiemy najszybciej jak to możliwe!';
    pageContent.style.opacity = '0.3';
    setTimeout(()=>{
      location.reload();
    },3000);
  }
  setTimeout(()=>{
    errorMes.style.display = 'none';
  }, 3000);
});





