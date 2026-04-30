export const CARD_STYLES = `
  :host {
    display: block;
    --season-clock-card-size: min(var(--season-clock-size, 500px), 100%);
    --season-clock-bg: #050b12;
    --season-clock-card: #0a141d;
    --season-clock-edge: rgba(210, 230, 245, 0.18);
    --season-clock-text: #f3f8fc;
    --season-clock-muted: #a7b6c1;
    --season-clock-subtle: #6f8190;
  }

  ha-card {
    display: block;
    overflow: hidden;
    border-radius: var(--ha-card-border-radius, 8px);
    background:
      radial-gradient(circle at 50% 48%, rgba(31, 52, 66, 0.42), transparent 53%),
      linear-gradient(150deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
      var(--season-clock-card);
    border: 1px solid var(--season-clock-edge);
    box-shadow: var(--ha-card-box-shadow, 0 24px 70px rgba(0, 0, 0, 0.42));
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px 0;
  }

  .title {
    color: var(--primary-text-color, var(--season-clock-text));
    font-size: 15px;
    font-weight: 700;
    line-height: 1.2;
  }

  .mode-toggle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    padding: 3px;
    border: 1px solid rgba(220, 242, 255, 0.16);
    border-radius: 8px;
    background: rgba(4, 12, 19, 0.56);
  }

  .mode-toggle button {
    border: 0;
    border-radius: 6px;
    padding: 6px 9px;
    background: transparent;
    color: rgba(239, 248, 255, 0.7);
    font: inherit;
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
  }

  .mode-toggle button.active {
    background: rgba(224, 240, 255, 0.15);
    color: #fff;
  }

  .wrap {
    width: var(--season-clock-card-size);
    max-width: 100%;
    aspect-ratio: 1;
    margin: 0 auto;
  }

  .clock {
    display: block;
    width: 100%;
    height: 100%;
    color: var(--season-clock-text);
    font-family: var(--paper-font-body1_-_font-family, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
  }

  .clock-shadow {
    fill: rgba(3, 8, 13, 0.48);
    stroke: rgba(205, 226, 240, 0.12);
    stroke-width: 1;
  }

  .clock-face {
    fill: rgba(4, 14, 22, 0.86);
    stroke: rgba(211, 228, 239, 0.16);
    stroke-width: 1;
  }

  .season-arc {
    fill: none;
    stroke-linecap: butt;
    stroke-width: 22;
    opacity: 0.94;
  }

  .ring-guide {
    fill: none;
    stroke: rgba(218, 234, 244, 0.14);
    stroke-width: 1;
  }

  .tick {
    stroke: rgba(231, 241, 248, 0.18);
    stroke-width: 0.7;
    stroke-linecap: round;
  }

  .tick.month {
    stroke: rgba(245, 249, 252, 0.76);
    stroke-width: 1.7;
  }

  .season-label,
  .event-label,
  .event-date {
    text-anchor: middle;
    dominant-baseline: middle;
    letter-spacing: 0;
  }

  .season-label {
    font-size: 9px;
    font-weight: 760;
  }

  .season-label .season-icon {
    font-size: 11px;
    font-weight: 600;
  }

  .event-line {
    stroke: rgba(244, 248, 251, 0.72);
    stroke-width: 1.3;
    stroke-linecap: round;
  }

  .event-dot {
    fill: #f7fbff;
    stroke: rgba(4, 12, 18, 0.78);
    stroke-width: 1;
  }

  .event-label {
    fill: rgba(238, 245, 249, 0.9);
    font-size: 7.2px;
    font-weight: 760;
    text-transform: uppercase;
  }

  .event-date {
    fill: var(--season-clock-muted);
    font-size: 7px;
    font-weight: 650;
  }

  .hand {
    stroke: rgba(255, 250, 229, 0.82);
    stroke-width: 2.2;
    stroke-linecap: round;
    filter: url("#handGlow");
  }

  .pivot-halo {
    fill: rgba(255, 255, 255, 0.12);
  }

  .pivot {
    fill: #f7fbff;
    stroke: rgba(5, 12, 18, 0.75);
    stroke-width: 1.2;
  }

  .center-readout {
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .weekday {
    fill: var(--season-clock-muted);
    font-size: 11px;
    font-weight: 650;
  }

  .date {
    fill: var(--season-clock-text);
    font-size: 15px;
    font-weight: 760;
  }

  .day-text {
    fill: #f1c84e;
    font-size: 17px;
    font-weight: 850;
  }

  .season-text {
    font-size: 17px;
    font-weight: 780;
  }

  .hemisphere,
  .location {
    fill: var(--season-clock-muted);
    font-size: 10.5px;
    font-weight: 600;
  }

  .location {
    fill: var(--season-clock-subtle);
  }
`;
