function resizeMenu(menu) {
  let header = document.querySelector('.header');
  let headerHeight = header.clientHeight;

  let hero = document.querySelector('.hero-section');
  let heroHeight = hero.clientHeight;

  menu.style.height = `${headerHeight + heroHeight}px`;
}

function openMenu(button, menu) {
  resizeMenu(menu);

  button.classList.remove('header__burger_closed');
  button.classList.add('header__burger_opened');

  menu.classList.remove('burger-menu_closed');
  menu.classList.add('burger-menu_opened');
}

function closeMenu(button, menu) {
  button.classList.remove('header__burger_opened')
  button.classList.add('header__burger_closed');

  menu.classList.remove('burger-menu_opened');
  menu.classList.add('burger-menu_closed');
}

// Resize the height of menu if the window has been resized.
window.addEventListener('resize', function(e) {
  let menu = document.querySelector('.header-nav__list');

  if (menu.classList.contains('burger-menu_opened')) {
    if (window.innerWidth <= 1024) {
      resizeMenu(menu);
    }
  }
});

// Close the menu if the width of the window is more tham 1024px.
window.matchMedia('(max-width: 1024px)').addEventListener('change', function(e) {
  if (!e.matches) {
    let menu = document.querySelector('.header-nav__list');
    let menubutton = document.querySelector('.header__burger');

    closeMenu(menubutton, menu);
    menu.style.height = 'auto';
  }
});

// Change tabindices for burger menu.
window.matchMedia('(max-width: 1024px)').addEventListener('change', function(e) {
  let menuitemNodes = document.querySelectorAll('.header-nav__link');
  if (e.matches) {
    menuitemNodes.forEach(element => element.tabIndex = -1);
  }
  else {
    menuitemNodes.forEach(element => element.tabIndex = 0);
  }
});
