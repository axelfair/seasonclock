export const CARD_STYLES = `
  :host {
    display: block;
    --season-clock-card-size: min(var(--season-clock-size, 500px), 100%);
    --season-clock-text: #f3f8fc;
    --season-clock-muted: #a7b6c1;
    --season-clock-subtle: #6f8190;
    --clock-shadow-deep: rgba(0, 0, 0, 0.72);
    --clock-shadow-soft: rgba(0, 0, 0, 0.36);
    --clock-highlight: rgba(255, 255, 255, 0.22);
    --clock-glass: rgba(255, 255, 255, 0.08);
    --clock-rim: rgba(206, 220, 229, 0.42);
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
    filter: drop-shadow(0 20px 38px var(--clock-shadow-deep));
  }

  .clock {
    display: block;
    width: 100%;
    height: 100%;
    color: var(--season-clock-text);
    font-family: var(--paper-font-body1_-_font-family, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
    text-rendering: geometricPrecision;
  }

  .clock-shadow {
    fill: transparent;
    stroke: rgba(236, 246, 252, 0.14);
    stroke-width: 1.2;
    filter: url("#dialInnerShadow");
  }

  .outer-rim-glow {
    fill: none;
    stroke: rgba(145, 183, 210, 0.16);
    stroke-width: 5;
  }

  .clock-face {
    fill: url("#dialGradient");
    stroke: rgba(230, 241, 248, 0.16);
    stroke-width: 1.2;
  }

  .dial-texture {
    fill: none;
    stroke: rgba(255, 255, 255, 0.035);
    stroke-width: 16;
    stroke-dasharray: 1 5;
    opacity: 0.45;
  }

  .season-arc {
    fill: none;
    stroke-linecap: butt;
    stroke-width: 22;
    opacity: 0.97;
    filter: url("#seasonLift");
  }

  .ring-bevel {
    fill: none;
    stroke: rgba(0, 0, 0, 0.42);
    stroke-width: 31;
    filter: url("#seasonLift");
  }

  .ring-inner-shadow,
  .ring-outer-highlight {
    fill: none;
  }

  .ring-inner-shadow {
    stroke: rgba(0, 0, 0, 0.5);
    stroke-width: 2.5;
  }

  .ring-outer-highlight {
    stroke: rgba(255, 255, 255, 0.18);
    stroke-width: 1.4;
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
    fill: rgba(255, 255, 255, 0.72);
    font-size: 7.7px;
    font-weight: 700;
    letter-spacing: 1px;
    text-anchor: middle;
    dominant-baseline: middle;
    pointer-events: none;
  }

  .event-label,
  .event-date {
    text-anchor: middle;
    dominant-baseline: middle;
    letter-spacing: 0;
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
    fill: rgba(238, 245, 249, 0.92);
    font-size: 7.8px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .event-date {
    fill: rgba(190, 210, 224, 0.94);
    font-size: 7.5px;
    font-weight: 500;
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

  .progress-tip {
    opacity: 0.9;
  }

  @keyframes pulse-halo {
    0%, 100% { opacity: 0.22; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.6); }
  }

  @keyframes glow-breathe {
    0%, 100% { opacity: 0.38; transform: scale(1); }
    50% { opacity: 0.68; transform: scale(1.4); }
  }

  @keyframes pivot-shimmer {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.72; }
  }

  .today-halo {
    fill: rgba(255, 246, 207, 0.22);
    filter: url("#progressGlow");
    transform-box: fill-box;
    transform-origin: center;
    animation: pulse-halo 2.8s ease-in-out infinite;
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

  .progress-tip-glow {
    transform-box: fill-box;
    transform-origin: center;
    animation: glow-breathe 3.4s ease-in-out infinite;
  }

  .pivot-highlight {
    fill: rgba(255, 255, 255, 0.7);
    animation: pivot-shimmer 4s ease-in-out infinite;
  }

  .hand-shadow {
    stroke: rgba(0, 0, 0, 0.68);
    stroke-width: 6.4;
    stroke-linecap: round;
    filter: blur(0.25px);
  }

  .hand {
    stroke: url("#handMetal");
    stroke-width: 4.1;
    stroke-linecap: round;
    filter: url("#handGlow");
  }

  .hand-highlight {
    stroke: rgba(255, 255, 255, 0.74);
    stroke-width: 1.05;
    stroke-linecap: round;
  }

  .hand-precision {
    stroke: rgba(255, 255, 255, 0.5);
    stroke-width: 0.85;
    stroke-linecap: round;
  }

  .moon-phase {
    pointer-events: none;
  }

  .moon-badge {
    fill: rgba(5, 12, 18, 0.84);
    stroke: rgba(255, 250, 229, 0.72);
    stroke-width: 1.2;
  }

  .moon-icon {
    font-size: 14px;
    text-anchor: middle;
    dominant-baseline: middle;
    alignment-baseline: central;
  }

  .pivot-halo {
    fill: rgba(255, 255, 255, 0.14);
    stroke: rgba(0, 0, 0, 0.38);
    stroke-width: 1;
  }

  .pivot-shadow {
    fill: rgba(0, 0, 0, 0.42);
  }

  .pivot {
    fill: url("#pivotMetal");
    stroke: rgba(5, 12, 18, 0.78);
    stroke-width: 1.2;
  }

  .center-readout {
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .complication {
    pointer-events: none;
  }

  .complication-socket {
    fill: rgba(0, 0, 0, 0.68);
    stroke: rgba(255, 255, 255, 0.08);
    stroke-width: 1;
  }

  .complication-socket-highlight {
    fill: none;
    stroke: rgba(255, 255, 255, 0.1);
    stroke-width: 1.1;
  }

  .complication-shadow {
    fill: rgba(0, 0, 0, 0.36);
  }

  .complication-face {
    fill: url("#complicationFaceGradient");
    stroke: rgba(255, 255, 255, 0.62);
    stroke-width: 1.1;
    filter: url("#complicationInset");
  }

  .complication-inner-shadow {
    fill: none;
    stroke: rgba(2, 8, 12, 0.24);
    stroke-width: 5;
  }

  .complication-ring {
    fill: none;
    stroke-width: 1.15;
    opacity: 0.76;
  }

  .complication-marker {
    stroke-width: 1.2;
    stroke-linecap: round;
    opacity: 0.9;
  }

  .complication-title,
  .complication-primary,
  .complication-secondary {
    text-anchor: middle;
    dominant-baseline: middle;
    letter-spacing: 0;
  }

  .complication-title {
    fill: rgba(8, 16, 22, 0.88);
    font-size: 8.4px;
    font-weight: 700;
    text-transform: uppercase;
    filter: drop-shadow(0 0.6px 0 rgba(255, 255, 255, 0.42));
  }

  .complication-primary {
    font-size: 13.8px;
    font-weight: 800;
  }

  .complication-secondary {
    fill: rgba(8, 16, 22, 0.76);
    font-size: 8.6px;
    font-weight: 600;
    filter: drop-shadow(0 0.5px 0 rgba(255, 255, 255, 0.32));
  }

  .place-complication .complication-primary,
  .event-complication .complication-primary {
    font-size: 11.2px;
  }

  .weather-complication .complication-primary {
    font-size: 20px;
  }

  .date-complication .complication-primary,
  .season-complication .complication-primary {
    font-size: 14px;
  }

  .clock-glass {
    fill: url("#glassGradient");
    stroke: rgba(255, 255, 255, 0.12);
    stroke-width: 1;
    pointer-events: none;
  }

  .glass-sheen {
    fill: none;
    stroke: rgba(255, 255, 255, 0.16);
    stroke-width: 7;
    stroke-linecap: round;
    opacity: 0.42;
    pointer-events: none;
  }

  .glass-sheen-2 {
    stroke: rgba(255, 255, 255, 0.08);
    stroke-width: 4;
    opacity: 0.38;
  }

  .dn-arc {
    fill: none;
    stroke: rgba(255, 255, 255, 0.2);
    stroke-width: 0.7;
    stroke-dasharray: 2 3;
  }

  .dn-horizon {
    stroke: rgba(255, 255, 255, 0.6);
    stroke-width: 1.2;
    stroke-linecap: round;
  }

  .dn-risesetdot {
    fill: rgba(255, 215, 100, 0.62);
  }

  .dn-sun-disc {
    fill: #f8d832;
    stroke: rgba(255, 220, 60, 0.5);
    stroke-width: 1.2;
  }

  .dn-sun-glow {
    fill: rgba(252, 220, 60, 0.28);
    filter: url("#progressGlow");
  }

  .dn-moon {
    font-size: 11px;
    text-anchor: middle;
    dominant-baseline: middle;
    fill: rgba(220, 235, 255, 0.9);
  }
`;
