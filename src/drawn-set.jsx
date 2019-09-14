import { Component } from 'preact';
import { SongCard } from './song-card';
import styles from './drawn-set.css';

const HUE_STEP = 255 / 8 * 3;
let hue = Math.floor(Math.random() * 255);

function getRandomGradiant() {
  hue += HUE_STEP;
  return `linear-gradient(hsl(${hue}, 50%, 80%), white, white)`;
}

/**
 * Takes in a drawing that has fake draws (for animation purposes) and returns an array of arrays, where each sub-array
 * contains the real chart followed by the fakes
 * @param drawing
 */
function mergeDraws(drawing) {
  const mergedDraws = [];
  drawing.charts.forEach(function (chart, idx) {
    const mergedSingle = [];
    mergedSingle.push(chart);
    if (drawing.fakeDraws) {
      drawing.fakeDraws.forEach(function (draw) {
        if (draw.charts[idx]) mergedSingle.push(draw.charts[idx]);
      });
    }
    mergedDraws.push(mergedSingle);
  });
  return mergedDraws;
}

/**
 * Takes in an item from {@link mergeDraws} and returns it in plain chart format, but with a fakeJackets array included
 * @param mergedDrawItem
 */
function singleDraw(mergedDrawItem) {
  const singleDraw = Object.assign({ fakeJackets: [] }, mergedDrawItem[0]);
  for (let i = 1; i < mergedDrawItem.length; ++i) {
    singleDraw.fakeJackets.push(mergedDrawItem[i].jacket);
  }
  return singleDraw;
}

export class DrawnSet extends Component {
  _background = getRandomGradiant();

  render() {
    const { drawing } = this.props;
    return (
      <div key={drawing.id} className={styles.chartList} style={{ backgroundImage: this._background }}>
        {mergeDraws(drawing).map(singleDraw).map(this.renderChart)}
      </div>
    );
  }

  renderChart = (chart, j) => {
    return (
      <SongCard
        key={j}
        onVeto={this.handleVeto.bind(this, j)}
        vetoed={this.props.drawing.vetos.has(j)}
        {...chart}
      />
    );
  }

  handleVeto(j) {
    const drawing = this.props.drawing;
    if (drawing.vetos.has(j)) {
      drawing.vetos.delete(j);
    } else {
      drawing.vetos.add(j);
    }
    this.forceUpdate();
  }
}
