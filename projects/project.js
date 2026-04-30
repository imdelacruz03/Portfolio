import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

let query = '';
let selectedIndex = -1;
let searchInput = document.querySelector('.searchbar');
let currentData = [];


function renderPieChart(projectsGiven) {
  d3.select('#projects-pie-chart svg').selectAll('path').remove();
  d3.select('.legend').selectAll('li').remove();

  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  currentData = newData;

  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));

  let svg = d3.select('#projects-pie-chart svg');
  let legend = d3.select('.legend');

  newArcs.forEach((arc, idx) => {
    svg.append('path')
      .attr('d', arc)
      .attr('fill', colors(idx))
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;

        svg.selectAll('path')
          .attr('class', (_, i) => i === selectedIndex ? 'selected' : '');

        legend.selectAll('li')
          .attr('class', (_, i) => i === selectedIndex ? 'legend-item selected' : 'legend-item');

        if (selectedIndex === -1) {
            renderProjects(projectsGiven, projectsContainer, 'h2');
          } else {
            let selectedYear = newData[selectedIndex].label;
            let filtered = projectsGiven.filter((p) => {
              let values = Object.values(p).join('\n').toLowerCase();
              return p.year === selectedYear && values.includes(query.toLowerCase());
            });
            renderProjects(filtered, projectsContainer, 'h2');
          }
      });
  });

  newData.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} (${d.value})`);
  });
}


renderPieChart(projects);

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    query = event.target.value;

    let filteredProjects = projects.filter((project) => {
      let values = Object.values(project).join('\n').toLowerCase();
      return values.includes(query.toLowerCase());
    });

    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects); // pie chart reflects search
  });
}

