function openMenu(){
    let menu = document.getElementById('menu');
    let nav = document.getElementById('nav')
    if(menu.classList.contains('-translate-x-full')){
        menu.classList.remove('-translate-x-full');
        menu.classList.add('-translate-x-0');
    }
    else{
        menu.classList.remove('-translate-x-0');
        menu.classList.add('-translate-x-full');
    }
    if(nav.classList.contains('bg-gray-700')){
        nav.classList.remove('bg-gray-700');
        nav.classList.add('bg-gray-800');
    }
    else{
        nav.classList.remove('bg-gray-800');
        nav.classList.add('bg-gray-700');    
    }
}

const hero_image_height = document.getElementById("hero-image").clientHeight;


const observer = new IntersectionObserver((entries) =>{
    entries.forEach((entry) =>{
        console.log(entry)
        if(entry.isIntersecting){
            entry.target.classList.add('my-show');
        } 
    });
});

const hiddenElements = document.querySelectorAll('.my-hidden');
hiddenElements.forEach((el) => observer.observe(el));

//to make the carousel work
const carouselContainer = document.getElementById("carousel-container");
const carousel = document.getElementById("carousel");
const arrowBtns = document.querySelectorAll(".buttons");
const firstCardWidth = document.getElementById("carousel-item").offsetWidth;
const carouselItems = [...carousel.children];

let isDragging = false, startX, startScrollLeft, timeoutId;

let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

carouselItems.slice(-cardPerView).reverse().forEach(card =>{
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

carouselItems.slice(0, cardPerView).forEach(card =>{
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

arrowBtns.forEach(btn=>{
    btn.addEventListener("click", ()=>
    {
        carousel.scrollLeft += btn.id === "left" ? -firstCardWidth:firstCardWidth;
        console.log(firstCardWidth);
    })
})

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) =>{
    if(!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () =>{
    isDragging = false;
    carousel.classList.remove("dragging");
}

const autoplay = () =>{
    
    timeoutId  = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2000);

}


const infiniteScroll = () =>{
    if(carousel.scrollLeft === 0){
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    } else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth){
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    clearTimeout(timeoutId);
    if(!carouselContainer.matches(":hover")) autoplay();
}

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
carouselContainer.addEventListener("mouseenter", () => clearTimeout(timeoutId));
carouselContainer.addEventListener("mouseleave", autoplay);


//To recieve messages:
let message = false;

const form = document.getElementById('form');
const result = document.getElementById('result');


form.addEventListener('submit', function(e) {
    const formData = new FormData(form);
    e.preventDefault();

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    result.innerHTML = "Please wait..."
    let name = document.getElementById('name');
    let nameValue = name.value;
    let phone = document.getElementById('phone');
    let phoneValue = phone.value;
    let email = document.getElementById('email');
    let emailValue = email.value;
    let msg = document.getElementById('message');
    let msgValue = msg.value;
    console.log(emailValue);
    
    if(nameValue != '' && emailValue != '' && msgValue != '' && phoneValue != ''){
    fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
          let json = await response.json();
          if (response.status == 200) {
            console.log(response);
            result.innerHTML = json.message;
            result.classList.remove("text-gray-500");
            result.classList.add("text-green-500");
            message = true;
            showToast();
          } else {
            console.log(response);
            result.innerHTML = json.message;
            result.classList.remove("text-gray-500");
            result.classList.add("text-red-500");
            message = false;
            showToast();
          }
        })
        .catch((error) => {
          console.log(error);
          result.innerHTML = "Something went wrong!";
          message = false;
          showToast();
        })
        .then(function() {
            form.reset();
            setTimeout(() => {
                result.style.display = "none";
            }, 3000);
        });
    }
    else{
        message = false;
        showToast();
    }
});


function getMessage(){
    return message;
}

let toastBox = document.getElementById('toastBox');
let successMsg = '<i class="fa-solid fa-circle-check" style="color: #ffffff; margin: 0 20px; font-size: 35px;"></i> Enviado correctamente!'
let errorMsg = '<i class="fa-solid fa-circle-xmark" style="color: #ffffff; margin: 0 20px; font-size: 35px;"></i> No enviado! - Por favor complete el formulario!'

function showToast(){
    let toast = document.createElement('div');
    toast.classList.add('toast');
    if(message){
        toast.innerHTML = successMsg;
    }

    else toast.innerHTML = errorMsg;
    toastBox.appendChild(toast);
    setTimeout(() =>{
        toast.remove();
    }, 3000)
}


