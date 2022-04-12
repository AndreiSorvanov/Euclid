$(".accordion").accordion({
  heightStyle: "content",
  header: ".accordion__header",
  icons: false,
  collapsible: true,
  active: false
});


document.querySelectorAll('.accordion__button').forEach(element => element.tabIndex = -1);
