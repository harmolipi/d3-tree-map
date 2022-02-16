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
}
