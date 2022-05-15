'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////
//scrolling
btnScrollTo.addEventListener('click', (e) => {
  //const slcoords = section1.getBoundingClientRect();

  //scrolling
  // window.scrollTo(
  //   slcoords.left + window.pageXOffset,
  //   slcoords.top + window.pageYOffset
  // );

  //Scroll smooth
  // window.scrollTo({
  //   left: slcoords.left + window.pageXOffset,
  //   top: slcoords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Easy solution work with mordren browsers
  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////////////
//Page Navigation
//solution 1

// document.querySelectorAll('.nav__link').forEach((el) => {
//   //If we use the getAttribute here arrow funcions is not working
//   //If you want to use arrow function.... in pleases of this use e.target
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//solution 2
// 1. add event listiner to comman parrent element
//2. determine what elemnt originated the event
document.querySelector('.nav__links').addEventListener('click', (e) => {
  e.preventDefault();
  console.log(e.target);

  //Match strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

////////////////////////////////////
//Tabbed components

tabsContainer.addEventListener('click', (e) => {
  //Now in button there is sub element is span when we click on it it woll give the span... but we need the button element
  const clicked = e.target.closest('.operations__tab');

  //gaurd clause ... as event listner was at conteriner of buttons .. paart from buttons if we click on other area it will give null so to not execute next code we can do like below
  if (!clicked) return;

  //one tab is move up other tabs should be down... so before activate remove all active
  tabs.forEach((t) => t.classList.remove('operations__tab--active'));

  //Also remove the content if other tab is click and active the content of clicked button
  tabsContent.forEach((tc) =>
    tc.classList.remove('operations__content--active')
  );
  clicked.classList.add('operations__tab--active');

  //Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

////////////////////////////////////////
//Menu fade animations

const handleHover = function (e) {
  //console.log(this, e.currentTarget);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//Refractor code
// nav.addEventListener('mouseover', (e) => handleHover(e, 0.5));
// nav.addEventListener('mouseout', (e) => handleHover(e, 1));

//Instead calling function other function ... use bind but above you cannot use the arrow functions
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

////////////////////////////////////////
//Sticky naviagation (even if you scroll the page the menu show show)

//Solution 1:
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
// });

//Solution 2: best way using Intersections Observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach((entry) => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const obeserver = new IntersectionObserver(obsCallback, obsOptions);
// obeserver.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  //console.log(entry);
  //if isIntersecting is false then need to get the menu
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObesever = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObesever.observe(header);

//////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observe) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observe.unobserve(entry.target);
};
const sectionObesever = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

//as we are having multiple sections we are using foreach
allSections.forEach(function (section) {
  sectionObesever.observe(section);
  //first hide all sections or manaully add the call in html best is do it via js only
  //section.classList.add('section--hidden');
});

/////////////////////////////////
//Lazy loading image

const imgTargets = document.querySelectorAll('img[data-src]');
//console.log(imgTargets);

const loadImage = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src = entry.target.dataset.src;

  //if you direcly use remove, it will load the image but it will be blur
  //entry.target.classList.remove('lazy-img');

  //only once image is completlry load then remove lazy-img: remove blur
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
    observer.unobserve(entry.target);
  });
};
const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
});

imgTargets.forEach((img) => imgObserver.observe(img));

////////////////////////////////
//Slider at bottom

const sliders = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
const maxSlide = sliders.length;
let curSlide = 0;
// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.5)';
// slider.style.overflow = 'visible';

//sliders.style.transform = 'transform 4s';
const goToSlide = function (slide) {
  sliders.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
    //In CSS value set to 1 sec ... can override with below
    //s.style.transition = 'transform 5s';
  });
};

//set 0% 100% 200% 300% initially
goToSlide(0);

const nextSlide = function () {
  //console.log(e.target);
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function () {
  //console.log(e.target);
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

//Even keyboard need to scroll the slide

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

//even using dots need to scroll the slide

const createDots = function () {
  //usin slides just ofr that many dots to create
  sliders.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

//activate the dot to show hilight

const activateDot = function (slide) {
  document.querySelectorAll('.dots__dot').forEach((dot) => {
    dot.classList.remove('dots__dot--active');
  });

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
activateDot(0);

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
/////////////////////////////////// Pratices ////////
// const header = document.querySelector('.header');

// //create element
// const message = document.createElement('div');
// message.classList.add('cookie-message');

// message.innerHTML =
//   'we use cookied for improvement functionlity and analytics .<button class ="btn btn--close-cookie">got it!</button>';

// header.prepend(message);
// header.append(message);

// //delete element
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', () => message.remove());

// //styles
// message.style.background = '#37383d';
// message.style.width = '120%';

// console.log(message.style.color); //this is not an inline style you will get noting
// console.log(message.style.background);

// //to  get the inline style values
// console.log(getComputedStyle(message).color);

// //Other event listners
// const h1 = document.querySelector('h1');
// h1.addEventListener('mouseenter', (e) => {
//   alert('addEventListener: You are reading the header :D');
// });

// //Other way of calling event listner
// h1.onmouseenter = (e) => {
//   alert('addEventListener: You are reading the header :D');
// };

// const randamInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randamColor = () =>
//   `rgb(${randamInt(0, 255)},${randamInt(0, 255)}, ${randamInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randamColor();

//   //stop propagation
//   //e.stopPropagation();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   console.log(randamColor());
//   this.style.backgroundColor = randamColor();
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   console.log(randamColor());
//   this.style.backgroundColor = randamColor();
// });

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('page fully loaded', e);
});
