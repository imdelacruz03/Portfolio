console.log("IT'S ALIVE!");

function $$(selector, context = document){
    return Array.from(context.querySelectorAll(selector));
}

// Below is a data structure, and it's storing the information
// on all of the pages in one place so the code below can use it
// this is so we don't have to had a nav on every html
let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact'},
  {url: 'cv/', title: 'CV'},
  {url: 'https://github.com/imdelacruz03', title: 'GitHub'}
];

let nav = document.createElement('nav'); // creates a new empty <nav> element in memory
document.body.prepend(nav); // inserts into the page at the very top of the <body>

// this loops through eveyr object in pages array and for each 
// loop it creates an <a> tag and inserts it into the nav
for (let p of pages) {
    let url = p.url;
    let title = p.title;
    nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
}

// creates an array of all the nav links on whichever page is 
// currently loaded in the braoswer at that moment
//const navLinks = $$("nav a"); 


// this gets the link to the current page we are on
// this allows us to be able to style it directly 
//let currentLink = navLinks.find(
//  (a) => a.host === location.host && a.pathname === location.pathname,
//);

// if navLinks can't find any matching links it returns underfined
// instead of an element therefore when .classList.add() is called the 
// whole script will crash with errors
//currentLink?.classList.add('current');

// currentLink? means "only continue if this isn't undefined"