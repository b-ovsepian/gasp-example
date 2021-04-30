import $ from 'jquery';
import './styles.css';

import { gsap, TweenLite, TweenMax } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const cursorOuter = document.querySelector('.cursor--large');
const cursorInner = document.querySelector('.cursor--small');
let isStuck = false;
let mouse = {
  x: -100,
  y: -100,
};

// Just in case you need to scroll
let scrollHeight = 0;
window.addEventListener('scroll', function (e) {
  scrollHeight = window.scrollY;
});

let cursorOuterOriginalState = {
  width: cursorOuter.getBoundingClientRect().width,
  height: cursorOuter.getBoundingClientRect().height,
};
const buttons = document.querySelectorAll('.item a');

buttons.forEach(button => {
  button.addEventListener('pointerenter', handleMouseEnter);
  button.addEventListener('pointerleave', handleMouseLeave);
});

document.body.addEventListener('pointermove', updateCursorPosition);
document.body.addEventListener('pointerdown', () => {
  gsap.to(cursorInner, 0.15, {
    scale: 2,
  });
});
document.body.addEventListener('pointerup', () => {
  gsap.to(cursorInner, 0.15, {
    scale: 1,
  });
});

function updateCursorPosition(e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
}

function updateCursor() {
  gsap.set(cursorInner, {
    x: mouse.x,
    y: mouse.y,
  });

  if (!isStuck) {
    gsap.to(cursorOuter, {
      duration: 0.15,
      x: mouse.x - cursorOuterOriginalState.width / 2,
      y: mouse.y - cursorOuterOriginalState.height / 2,
    });
  }

  requestAnimationFrame(updateCursor);
}

updateCursor();

function handleMouseEnter(e) {
  isStuck = true;
  const targetBox = e.currentTarget.getBoundingClientRect();
  gsap.to(cursorOuter, 0.2, {
    x: targetBox.left,
    y: targetBox.top + scrollHeight,
    width: targetBox.width,
    height: targetBox.width,
    borderRadius: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  });
}

function handleMouseLeave(e) {
  isStuck = false;
  gsap.to(cursorOuter, 0.2, {
    width: cursorOuterOriginalState.width,
    height: cursorOuterOriginalState.width,
    borderRadius: '50%',
    backgroundColor: 'transparent',
  });
}

$(function () {
  var $dragMe = $('#dragme');
  var $beforeAfter = $('#before-after');
  var $viewAfter = $('.view-after');

  Draggable.create($dragMe, {
    type: 'left',
    bounds: $beforeAfter,
    onDrag: updateImages,
  });

  function updateImages() {
    TweenLite.set($viewAfter, { width: $dragMe.css('left') }); //or this.x if only dragging
  }

  //Intro Animation
  animateTo(300);

  function animateTo(_left) {
    TweenLite.to($dragMe, 1, { left: _left, onUpdate: updateImages });
  }

  //V2 Click added
  $beforeAfter.on('click', function (event) {
    var eventLeft = event.clientX - $beforeAfter.offset().left;
    animateTo(eventLeft);
  });
}); //end jQuery wrapper
