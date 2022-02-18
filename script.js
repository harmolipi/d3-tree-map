const VIDEO_GAME_SALES_URL =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

const getVideoGameSalesData = () => d3.json(VIDEO_GAME_SALES_URL);

const WIDTH = 960;
const HEIGHT = 600;

const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .attr('id', 'tooltip')
  .html(function (d) {
    return d;
  })
  .offset([-10, 0]);

const svg = d3
  .select('#container')
  .append('svg')
  .attr('id', 'main-svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .call(tip);

const legend = svg
  .append('g')
  .attr('id', 'legend')
  .attr('transform', 'translate(20, 20)');

const fader = (color) => d3.interpolateRgb(color, '#fff')(0.2);

const color = d3
  .scaleOrdinal()
  .range(
    [
      '#1f77b4',
      '#aec7e8',
      '#ff7f0e',
      '#ffbb78',
      '#2ca02c',
      '#98df8a',
      '#d62728',
      '#ff9896',
      '#9467bd',
      '#c5b0d5',
      '#8c564b',
      '#c49c94',
      '#e377c2',
      '#f7b6d2',
      '#7f7f7f',
      '#c7c7c7',
      '#bcbd22',
      '#dbdb8d',
      '#17becf',
      '#9edae5',
    ].map(fader)
  );

const treemap = d3.treemap().size([WIDTH, HEIGHT]).paddingInner(1);

getData();

async function getData() {
  try {
    const videoGameSalesData = await getVideoGameSalesData();
    callback(videoGameSalesData);
  } catch (err) {
    console.log(err);
  }
}

function callback(videoGameSalesData) {
  console.log(videoGameSalesData);

  const root = d3.hierarchy(videoGameSalesData).sum((d) => d.value);
  console.log(root);

  treemap(root);

  const cell = svg
    .selectAll('g')
    .data(root.leaves())
    .enter()
    .append('g')
    .attr('class', 'group')
    .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`);

  cell
    .append('rect')
    .attr('id', (d) => d.data.id)
    .attr('class', 'tile')
    .attr('width', (d) => d.x1 - d.x0)
    .attr('height', (d) => d.y1 - d.y0)
    .attr('data-name', (d) => d.data.name)
    .attr('data-category', (d) => d.data.category)
    .attr('data-value', (d) => d.data.value)
    .attr('fill', (d) => color(d.data.category))
    .on('mouseover', function (event, d) {
      tip.html(`${d.data.name}<br>${d.data.category}<br>${d.data.value}`);
      tip.attr('data-value', d.data.value);
      tip.show(d, this);
      d3.select(this).style('opacity', 0.5);
    })
    .on('mouseout', function () {
      tip.hide();
      d3.select(this).style('opacity', 1);
    });

  cell
    .append('text')
    .attr('class', 'tile-text')
    .selectAll('tspan')
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append('tspan')
    .attr('x', 4)
    .attr('y', (d, i) => 13 + i * 15)
    .text((d) => d);

  const legend = d3
    .select('#legend-container')
    .append('svg')
    .attr('id', 'legend')
    .attr('width', 500)
    .attr('y', 100)
    .style('display', 'block')
    .style('margin', '0 auto');

  const categories = root
    .leaves()
    .map((node) => node.data.category)
    .filter((category, i, self) => self.indexOf(category) === i);

  const legendElem = legend
    .append('g')
    .attr('transform', 'translate(60, 20)')
    .selectAll('g')
    .data(categories)
    .enter()
    .append('g')
    .attr(
      'transform',
      (d, i) =>
        `translate(${(i % 4) * 150}, ${
          Math.floor(i / 4) * 15 + 10 * Math.floor(i / 4)
        })`
    );

  legendElem
    .append('rect')
    .attr('width', 15)
    .attr('height', 15)
    .attr('class', 'legend-item')
    .attr('fill', (d) => color(d));

  legendElem
    .append('text')
    .attr('x', 20)
    .attr('y', 12)
    .text((d) => d);
}
