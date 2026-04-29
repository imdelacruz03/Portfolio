console.log("IT'S ALIVE!");

function $$(selector, context = document){
    return Array.from(context.querySelectorAll(selector));
}

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"
    : "/Portfolio/";


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

    // fix url with BASE_PATH if it's an internal link
    url = !url.startsWith('http') ? BASE_PATH + url : url;

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    // highlight current page
    a.classList.toggle('current', a.host === location.host && a.pathname === location.pathname);

    // open external links in a new tab
    if (a.host !== location.host) {
        a.target = '_blank';
    }

    nav.append(a);
}

// Step 4.2 - create the switcher
document.body.insertAdjacentHTML('afterbegin', `
    <label class="color-scheme">
        Theme:
        <select>
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </label>
`);

// Step 4.4 - make it work
const select = document.querySelector('.color-scheme select');

select.addEventListener('input', function(event) {
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value;  // Step 4.5 - save preference
});

// Step 4.5 - load saved preference on page load
if ('colorScheme' in localStorage) {
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    select.value = localStorage.colorScheme;
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

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';
  for (const project of projects) {
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <div>
        <p>${project.description}</p>
        <p>${project.year}</p>
      </div>
    `;
    containerElement.appendChild(article);
  }
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}