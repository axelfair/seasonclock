export const CARD_STYLES = `
  :host {
    display: block;
    --season-clock-card-size: min(var(--season-clock-size, 500px), 100%);
    --season-clock-text: #f3f8fc;
    --season-clock-muted: #a7b6c1;
    --season-clock-subtle: #6f8190;
  }

  ha-card {
    display: block;
    overflow: hidden;
    border-radius: var(--ha-card-border-radius, 8px);
    background: transparent;
    border: 0;
    box-shadow: none;
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
    fill: transparent;
    stroke: rgba(205, 226, 240, 0.12);
    stroke-width: 1;
  }

  .clock-face {
    fill: transparent;
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

  .month-names path {
    fill: none;
    stroke: none;
  }

  .month-name {
    fill: rgba(255, 255, 255, 0.68);
    font-size: 7.7px;
    font-weight: 850;
    letter-spacing: 1px;
    text-anchor: middle;
    dominant-baseline: middle;
    pointer-events: none;
    paint-order: stroke;
    stroke: rgba(4, 12, 18, 0.52);
    stroke-width: 1.8px;
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

  .progress-track {
    fill: none;
    stroke: rgba(255, 255, 255, 0.08);
    stroke-width: 5;
  }

  .season-progress {
    fill: none;
    stroke-linecap: round;
    stroke-width: 5;
    opacity: 0.78;
  }

  .today-dot {
    fill: #fff6cf;
    stroke: rgba(5, 12, 18, 0.82);
    stroke-width: 1.3;
  }

  .next-event-dot {
    fill: rgba(255, 255, 255, 0.72);
    stroke: rgba(5, 12, 18, 0.72);
    stroke-width: 1;
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
  .location,
  .season-progress-text,
  .next-event,
  .weather {
    fill: var(--season-clock-muted);
    font-size: 10.5px;
    font-weight: 600;
  }

  .location,
  .next-event,
  .weather {
    fill: var(--season-clock-subtle);
  }
`;
