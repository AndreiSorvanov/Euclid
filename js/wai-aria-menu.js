/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   menu-button-links.js
 *
 *   Desc:   Creates a menu button that opens a menu of links
 */

'use strict';

class MenuButtonLinks {
  constructor(domNode) {
    this.domNode = domNode;
    this.buttonNode = domNode.querySelector('.header__burger');
    this.menuNode = domNode.querySelector('[role="menu"]');
    this.menuitemNodes = [];
    this.firstMenuitem = false;
    this.lastMenuitem = false;
    this.firstChars = [];
    this.events = false;

    var nodes = domNode.querySelectorAll('[role="menuitem"]');

    for (var i = 0; i < nodes.length; i++) {
      var menuitem = nodes[i];
      this.menuitemNodes.push(menuitem);
      menuitem.tabIndex = -1;
      this.firstChars.push(menuitem.textContent.trim()[0].toLowerCase());

      if (!this.firstMenuitem) {
        this.firstMenuitem = menuitem;
      }
      this.lastMenuitem = menuitem;
    }

    this.onButtonKeydown = this.onButtonKeydown.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onMenuitemKeydown = this.onMenuitemKeydown.bind(this);
    this.onMenuitemMouseover = this.onMenuitemMouseover.bind(this);
    this.onFocusin = this.onFocusin.bind(this);
    this.onFocusout = this.onFocusout.bind(this);
    this.onBackgroundMousedown = this.onBackgroundMousedown.bind(this);
  }

  addEvents() {
    this.buttonNode.addEventListener('keydown', this.onButtonKeydown);
    this.buttonNode.addEventListener('click', this.onButtonClick);

    var nodes = this.domNode.querySelectorAll('[role="menuitem"]');
    for (var i = 0; i < nodes.length; i++) {
      this.menuitemNodes[i].addEventListener('keydown', this.onMenuitemKeydown);

      this.menuitemNodes[i].addEventListener(
        'mouseover',
        this.onMenuitemMouseover
      );
    }

    this.domNode.addEventListener('focusin', this.onFocusin);
    this.domNode.addEventListener('focusout', this.onFocusout);

    window.addEventListener('mousedown', this.onBackgroundMousedown, true);

    this.events = true;
  }

  removeEvents() {
    this.buttonNode.removeEventListener('keydown', this.onButtonKeydown);
    this.buttonNode.removeEventListener('click', this.onButtonClick);

    var nodes = this.domNode.querySelectorAll('[role="menuitem"]');
    for (var i = 0; i < nodes.length; i++) {
      this.menuitemNodes[i].removeEventListener('keydown', this.onMenuitemKeydown);

      this.menuitemNodes[i].removeEventListener(
        'mouseover',
        this.onMenuitemMouseover
      );
    }

    this.domNode.removeEventListener('focusin', this.onFocusin);
    this.domNode.removeEventListener('focusout', this.onFocusout);

    window.removeEventListener('mousedown', this.onBackgroundMousedown);

    this.events = false;
  }

  setFocusToMenuitem(newMenuitem) {
    this.menuitemNodes.forEach(function (item) {
      if (item === newMenuitem) {
        item.tabIndex = 0;
        newMenuitem.focus();
      } else {
        item.tabIndex = -1;
      }
    });
  }

  setFocusToFirstMenuitem() {
    this.setFocusToMenuitem(this.firstMenuitem);
  }

  setFocusToLastMenuitem() {
    this.setFocusToMenuitem(this.lastMenuitem);
  }

  setFocusToPreviousMenuitem(currentMenuitem) {
    var newMenuitem, index;

    if (currentMenuitem === this.firstMenuitem) {
      newMenuitem = this.lastMenuitem;
    } else {
      index = this.menuitemNodes.indexOf(currentMenuitem);
      newMenuitem = this.menuitemNodes[index - 1];
    }

    this.setFocusToMenuitem(newMenuitem);

    return newMenuitem;
  }

  setFocusToNextMenuitem(currentMenuitem) {
    var newMenuitem, index;

    if (currentMenuitem === this.lastMenuitem) {
      newMenuitem = this.firstMenuitem;
    } else {
      index = this.menuitemNodes.indexOf(currentMenuitem);
      newMenuitem = this.menuitemNodes[index + 1];
    }
    this.setFocusToMenuitem(newMenuitem);

    return newMenuitem;
  }

  setFocusByFirstCharacter(currentMenuitem, char) {
    var start, index;

    if (char.length > 1) {
      return;
    }

    char = char.toLowerCase();

    // Get start index for search based on position of currentItem
    start = this.menuitemNodes.indexOf(currentMenuitem) + 1;
    if (start >= this.menuitemNodes.length) {
      start = 0;
    }

    // Check remaining slots in the menu
    index = this.firstChars.indexOf(char, start);

    // If not found in remaining slots, check from beginning
    if (index === -1) {
      index = this.firstChars.indexOf(char, 0);
    }

    // If match was found...
    if (index > -1) {
      this.setFocusToMenuitem(this.menuitemNodes[index]);
    }
  }

  // Utilities

  getIndexFirstChars(startIndex, char) {
    for (var i = startIndex; i < this.firstChars.length; i++) {
      if (char === this.firstChars[i]) {
        return i;
      }
    }
    return -1;
  }

  // Popup menu methods

  openPopup() {
    openMenu(this.buttonNode, this.menuNode)
    this.buttonNode.setAttribute('aria-expanded', 'true');
  }

  closePopup() {
    if (this.isOpen()) {
      closeMenu(this.buttonNode, this.menuNode)
      this.buttonNode.removeAttribute('aria-expanded');

      this.menuitemNodes.forEach(menuitem => menuitem.tabIndex = -1);
    }
  }

  isOpen() {
    return this.buttonNode.getAttribute('aria-expanded') === 'true';
  }

  // Menu event handlers

  onFocusin() {
    this.domNode.classList.add('focus');
  }

  onFocusout() {
    this.domNode.classList.remove('focus');
  }

  onButtonKeydown(event) {
    var key = event.key,
      flag = false;

    switch (key) {
      case ' ':
      case 'Enter':
      case 'ArrowDown':
      case 'Down':
        this.openPopup();
        this.setFocusToFirstMenuitem();
        flag = true;
        break;

      case 'Esc':
      case 'Escape':
        this.closePopup();
        this.buttonNode.focus();
        flag = true;
        break;

      case 'Up':
      case 'ArrowUp':
        this.openPopup();
        this.setFocusToLastMenuitem();
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  onButtonClick(event) {
    if (this.isOpen()) {
      this.closePopup();
      this.buttonNode.focus();
    } else {
      this.openPopup();
      this.setFocusToFirstMenuitem();
    }

    event.stopPropagation();
    event.preventDefault();
  }

  onMenuitemKeydown(event) {
    if (window.innerWidth > 1024) {
      return;
    }

    var tgt = event.currentTarget,
      key = event.key,
      flag = false;

    function isPrintableCharacter(str) {
      return str.length === 1 && str.match(/\S/);
    }

    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    if (event.shiftKey) {
      if (isPrintableCharacter(key)) {
        this.setFocusByFirstCharacter(tgt, key);
        flag = true;
      }

      if (event.key === 'Tab') {
        this.buttonNode.focus();
        this.closePopup();
        flag = true;
      }
    } else {
      switch (key) {
        case ' ':
          window.location.href = tgt.href;
          break;

        case 'Esc':
        case 'Escape':
          this.closePopup();
          this.buttonNode.focus();
          flag = true;
          break;

        case 'Up':
        case 'ArrowUp':
          this.setFocusToPreviousMenuitem(tgt);
          flag = true;
          break;

        case 'ArrowDown':
        case 'Down':
          this.setFocusToNextMenuitem(tgt);
          flag = true;
          break;

        case 'Home':
        case 'PageUp':
          this.setFocusToFirstMenuitem();
          flag = true;
          break;

        case 'End':
        case 'PageDown':
          this.setFocusToLastMenuitem();
          flag = true;
          break;

        case 'Tab':
          this.buttonNode.focus();
          this.closePopup();
          break;

        default:
          if (isPrintableCharacter(key)) {
            this.setFocusByFirstCharacter(tgt, key);
            flag = true;
          }
          break;
      }
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  onMenuitemMouseover(event) {
    var tgt = event.currentTarget;
    tgt.focus();
  }

  onBackgroundMousedown(event) {
    if (!this.domNode.contains(event.target)) {
      if (this.isOpen()) {
        this.closePopup();
        this.buttonNode.focus();
      }
    }
  }
}


var menuContainer = document.querySelector('.header__container');
var menu = new MenuButtonLinks(menuContainer);

// Initialize menu button
document.addEventListener("DOMContentLoaded", function() {
  if (window.innerWidth <= 1024) {
    if (!menu.events) {
      menu.addEvents();
    }
  }
});

window.matchMedia('(max-width: 1024px)').addEventListener('change', function(e) {
  if (e.matches) {
    if (!menu.events) {
      menu.addEvents();
    }
  }
  else {
    menu.removeEvents();
  }
});

// Close the menu if the width of the window is more tham 1024px.
window.matchMedia('(max-width: 1024px)').addEventListener('change', function(e){
  if (!e.matches) {
    menu.closePopup();
  }
});

// Change tabindices for burger menu if current width is less than 1024px.
document.addEventListener("DOMContentLoaded", function() {
  let menuitemNodes = document.querySelectorAll('.header-nav__link');

  if (window.innerWidth <= 1024) {
    menuitemNodes.forEach(element => element.tabIndex = -1);
  }
  else {
    menuitemNodes.forEach(element => element.tabIndex = 0);
  }
});
