function showSearchForm(searchForm) {
  searchForm.classList.remove('header-nav__search_closed');
  searchForm.classList.add('header-nav__search_opened');
}

function hideSearchForm(searchForm) {
  searchForm.classList.remove('header-nav__search_opened');
  searchForm.classList.add('header-nav__search_closed');
}

// Open search box
document.querySelector('.search__btn').addEventListener('click', function(e) {
  let searchForm = document.querySelector('.header-nav__search');

  if (searchForm.classList.contains('header-nav__search_closed')) {
    showSearchForm(searchForm);
  }
});

// Hide search box
document.querySelector('.search__close-btn').addEventListener('click', function(e) {
  let searchForm = document.querySelector('.header-nav__search');

  if (searchForm.classList.contains('header-nav__search_opened')) {
    hideSearchForm(searchForm);
  }
});

// Close search box after clicking out of it.
document.body.addEventListener('click', function(e){
  let searchForm = document.querySelector('.header-nav__search');

  if (searchForm.classList.contains('header-nav__search_opened') && !searchForm.contains(e.target)) {
    hideSearchForm(searchForm);
  }
});
