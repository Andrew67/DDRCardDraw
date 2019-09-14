import classNames from 'classnames';
import { Component } from 'preact';
import styles from './song-card.css';

export class SongCard extends Component {
  render() {
    const {
      name,
      nameTranslation,
      artist,
      artistTranslation,
      bpm,
      difficulty,
      level,
      hasShock,
      vetoed,
      abbreviation,
      jacket,
      fakeJackets,
    } = this.props;

    const rootClassname = classNames(
      styles.chart,
      styles[difficulty],
      {
        [styles.vetoed]: vetoed,
      },
    );

    let jacketBg = {};
    let fakeJacketBgs = [];
    let fadeInDelay = 0;
    if (jacket) {
      jacketBg = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url("jackets/${jacket}")`,
      };
      fakeJacketBgs = fakeJackets.map((jacket, idx) => { return {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url("jackets/${jacket}")`,
        animationDelay: `${-125 + 63*idx}ms`,
        animationIterationCount: `${5 + this.__key * 3}`,
      }});
    }
    if (fakeJacketBgs.length > 0) fadeInDelay = 2 + this.__key;
    const fadeInStyle = { animationDuration: `${fadeInDelay}s` };

    return (
      <div className={rootClassname} onClick={this.props.onVeto}>
        <div className={styles.cardCenter} style={jacketBg}>
          {fakeJacketBgs.map(this.renderFakeJacket)}
          <div className={styles.name} title={nameTranslation}>
            {name}
          </div>
          <div className={styles.nameTranslation}>
            {nameTranslation}
          </div>
          <div className={styles.artist} title={artistTranslation}>
            {artist}
          </div>
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.bpm} style={fadeInStyle}>{bpm} BPM</div>
          {hasShock && (
            <div className={styles.shockBadge} style={fadeInStyle} title="Shock Arrows">
              <svg height="100%" className="octicon octicon-zap" viewBox="0 0 10 16" version="1.1" ariaHidden="true">
                <path fillRule="evenodd" d="M10 7H6l3-7-9 9h4l-3 7 9-9z" />
              </svg>
            </div>
          )}
          <div className={styles.difficulty} style={fadeInStyle}>{abbreviation} {level}</div>
        </div>
      </div>
    );
  }

  toggleVeto = () => {
    this.setState((prevState) => ({
      vetoed: !prevState.vetoed,
    }));
  }

  renderFakeJacket = (fakeJacketBg) => {
    return (<div className={styles.fakeJacket} style={fakeJacketBg}/>);
  };
}
