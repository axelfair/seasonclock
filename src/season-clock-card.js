import "./editor.js";
import { CARD_STYLES } from "./styles.js";
import {
  MONTH_SHORT,
  NORTHERN_EVENTS,
  NORTHERN_SEASON_STARTS,
  SEASON_COLORS,
  SEASON_ICONS,
  SOUTHERN_EVENTS,
  SOUTHERN_SEASON_STARTS,
  buildSeasonSegments,
  dayToAngle,
  describeArc,
  getCurrentSeason,
  getDayOfYear,
  getMidpointDay,
  getMonthStartDays,
  isLeapYear,
  normalizeHemisphere,
  pointAt
} from "./utils.js";

const DEFAULT_CONFIG = {
  view_mode: "detailed",
  show_mode_toggle: false,
  location_name: "Cupertino, California",
  latitude: 37.323,
  longitude: -122.0322,
  hemisphere: "auto",
  card_size: 500,
  show_date: true,
  show_day_number: true,
  show_season_name: true,
  show_location: true,
  show_solstice_labels: true,
  show_equinox_labels: true,
  show_month_markers: true,
  show_day_ticks: true,
  show_icons: true
};

const CENTER = 250;
const LAYOUT = {
  arcRadius: 181,
  tickOuter: 194,
  dayTickInner: 187,
  monthTickInner: 174,
  eventInner: 168,
  eventOuter: 202,
  eventLabel: 224,
  seasonLabel: 136,
  handLength: 166
};

class SeasonClockCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = { ...DEFAULT_CONFIG };
    this._mode = DEFAULT_CONFIG.view_mode;
  }

  static getConfigElement() {
    return document.createElement("season-clock-card-editor");
  }

  static getStubConfig() {
    return {
      type: "custom:season-clock-card",
      view_mode: "detailed",
      show_mode_toggle: true
    };
  }

  setConfig(config) {
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._mode = this._config.view_mode === "basic" ? "basic" : "detailed";
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  getCardSize() {
    return Math.ceil((Number(this._config.card_size) || 500) / 50);
  }

  render() {
    if (!this.shadowRoot) {
      return;
    }

    const model = this.getClockModel();
    const showToggle = this.booleanConfig("show_mode_toggle");
    const title = this._config.title || "";
    this.shadowRoot.innerHTML = `
      <style>${CARD_STYLES}</style>
      <ha-card style="--season-clock-size: ${Number(this._config.card_size) || 500}px">
        ${title || showToggle ? `
          <div class="header">
            ${title ? `<div class="title">${this.escape(title)}</div>` : "<span></span>"}
            ${showToggle ? this.renderModeToggle() : ""}
          </div>
        ` : ""}
        <div class="wrap">
          ${this.renderSvg(model)}
        </div>
      </ha-card>
    `;

    this.shadowRoot.querySelectorAll("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        this._mode = button.dataset.mode;
        this.render();
      });
    });
  }

  renderModeToggle() {
    return `
      <div class="mode-toggle" role="group" aria-label="Season clock mode">
        <button type="button" data-mode="basic" class="${this._mode === "basic" ? "active" : ""}">Basic</button>
        <button type="button" data-mode="detailed" class="${this._mode === "detailed" ? "active" : ""}">Detailed</button>
      </div>
    `;
  }

  renderSvg(model) {
    const isDetailed = this._mode === "detailed";
    return `
      <svg class="clock" viewBox="0 0 500 500" role="img" aria-label="Season clock">
        <defs>
          <filter id="handGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.8" result="blur"></feGaussianBlur>
            <feMerge>
              <feMergeNode in="blur"></feMergeNode>
              <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
          </filter>
        </defs>
        <circle class="clock-shadow" cx="250" cy="250" r="213"></circle>
        <circle class="clock-face" cx="250" cy="250" r="154"></circle>
        ${this.renderSeasonArcs(model)}
        ${this.renderTicks(model)}
        ${this.renderEventMarkers(model, isDetailed)}
        ${this.renderSeasonLabels(model)}
        <line class="hand" x1="250" y1="250" x2="${model.handPoint.x}" y2="${model.handPoint.y}"></line>
        <circle class="pivot-halo" cx="250" cy="250" r="11"></circle>
        <circle class="pivot" cx="250" cy="250" r="5.5"></circle>
        ${this.renderCenterReadout(model, isDetailed)}
      </svg>
    `;
  }

  renderSeasonArcs(model) {
    const guides = `
      <circle class="ring-guide" cx="250" cy="250" r="${LAYOUT.arcRadius + 12}"></circle>
      <circle class="ring-guide" cx="250" cy="250" r="${LAYOUT.arcRadius - 12}"></circle>
    `;
    const arcs = model.segments.map((segment) => `
      <path class="season-arc" d="${describeArc(CENTER, CENTER, LAYOUT.arcRadius, dayToAngle(segment.start, model.totalDays), dayToAngle(segment.end, model.totalDays))}" stroke="${SEASON_COLORS[segment.name]}"></path>
    `).join("");
    return `<g class="season-arcs">${guides}${arcs}</g>`;
  }

  renderTicks(model) {
    const showDayTicks = this.booleanConfig("show_day_ticks");
    const showMonthMarkers = this.booleanConfig("show_month_markers");
    if (!showDayTicks && !showMonthMarkers) {
      return "";
    }

    const monthStartDays = new Set(getMonthStartDays(model.year));
    const ticks = [];
    for (let day = 1; day <= model.totalDays; day += 1) {
      const isMonth = monthStartDays.has(day);
      if ((isMonth && !showMonthMarkers) || (!isMonth && !showDayTicks)) {
        continue;
      }
      const angle = dayToAngle(day, model.totalDays);
      const inner = isMonth ? LAYOUT.monthTickInner : LAYOUT.dayTickInner;
      const start = pointAt(CENTER, angle, inner);
      const end = pointAt(CENTER, angle, LAYOUT.tickOuter);
      ticks.push(`<line class="tick${isMonth ? " month" : ""}" x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}"></line>`);
    }
    return `<g class="ticks">${ticks.join("")}</g>`;
  }

  renderEventMarkers(model, isDetailed) {
    const markers = model.events
      .filter((event) => this.shouldShowEvent(event))
      .map((event) => {
        const eventDay = getDayOfYear(new Date(model.year, event.month, event.day));
        const angle = dayToAngle(eventDay, model.totalDays);
        const inner = pointAt(CENTER, angle, LAYOUT.eventInner);
        const outer = pointAt(CENTER, angle, LAYOUT.eventOuter);
        const label = pointAt(CENTER, angle, LAYOUT.eventLabel);
        return `
          <line class="event-line" x1="${inner.x}" y1="${inner.y}" x2="${outer.x}" y2="${outer.y}"></line>
          <circle class="event-dot" cx="${outer.x}" cy="${outer.y}" r="3"></circle>
          ${isDetailed ? this.renderEventLabel(event, label) : ""}
        `;
      }).join("");
    return `<g class="event-markers">${markers}</g>`;
  }

  renderEventLabel(event, point) {
    const words = event.label.toUpperCase().split(" ");
    return `
      <text class="event-label" x="${point.x}" y="${point.y - 4}">
        ${words.map((word, index) => `<tspan x="${point.x}" dy="${index === 0 ? 0 : 8.2}">${word}</tspan>`).join("")}
        <tspan class="event-date" x="${point.x}" dy="9">${event.day} ${MONTH_SHORT[event.month].toUpperCase()}</tspan>
      </text>
    `;
  }

  renderSeasonLabels(model) {
    if (!this.booleanConfig("show_season_name")) {
      return "";
    }

    const labels = model.segments.map((segment) => {
      const midpoint = getMidpointDay(segment.start, segment.end, model.totalDays);
      const point = pointAt(CENTER, dayToAngle(midpoint, model.totalDays), LAYOUT.seasonLabel);
      const icon = this.booleanConfig("show_icons") ? `<tspan class="season-icon">${SEASON_ICONS[segment.name]} </tspan>` : "";
      return `
        <text class="season-label" x="${point.x}" y="${point.y}" fill="${SEASON_COLORS[segment.name]}">
          ${icon}<tspan>${segment.name}</tspan>
        </text>
      `;
    }).join("");
    return `<g class="season-labels">${labels}</g>`;
  }

  renderCenterReadout(model, isDetailed) {
    const rows = [];
    if (this.booleanConfig("show_date")) {
      rows.push(`<text class="weekday" x="250" y="184">${model.weekday}</text>`);
      rows.push(`<text class="date" x="250" y="205">${model.dateLabel}</text>`);
    }
    if (this.booleanConfig("show_day_number")) {
      rows.push(`<text class="day-text" x="250" y="231">Day ${model.dayOfYear} of ${model.totalDays}</text>`);
    }
    if (this.booleanConfig("show_season_name")) {
      const icon = this.booleanConfig("show_icons") ? `${SEASON_ICONS[model.currentSeason.name]} ` : "";
      rows.push(`<text class="season-text" x="250" y="${isDetailed ? 286 : 300}" fill="${SEASON_COLORS[model.currentSeason.name]}">${icon}${model.currentSeason.name}</text>`);
    }
    if (isDetailed && this.booleanConfig("show_location")) {
      rows.push(`<text class="hemisphere" x="250" y="314">${model.hemisphere === "north" ? "Northern Hemisphere" : "Southern Hemisphere"}</text>`);
      rows.push(`<text class="location" x="250" y="334">${this.escape(model.locationName)}</text>`);
    }
    return `<g class="center-readout" aria-hidden="true">${rows.join("")}</g>`;
  }

  getClockModel() {
    const now = new Date();
    const year = now.getFullYear();
    const totalDays = isLeapYear(year) ? 366 : 365;
    const dayOfYear = getDayOfYear(now);
    const latitude = this.getLatitude();
    const hemisphere = normalizeHemisphere(this._config.hemisphere, latitude);
    const events = hemisphere === "north" ? NORTHERN_EVENTS : SOUTHERN_EVENTS;
    const starts = hemisphere === "north" ? NORTHERN_SEASON_STARTS : SOUTHERN_SEASON_STARTS;
    const segments = buildSeasonSegments(starts, year, totalDays);
    const currentSeason = getCurrentSeason(segments, dayOfYear, totalDays);

    return {
      year,
      totalDays,
      dayOfYear,
      hemisphere,
      events,
      segments,
      currentSeason,
      locationName: this.getLocationName(),
      handPoint: pointAt(CENTER, dayToAngle(dayOfYear, totalDays), LAYOUT.handLength),
      weekday: new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(now),
      dateLabel: new Intl.DateTimeFormat(undefined, { day: "numeric", month: "long", year: "numeric" }).format(now)
    };
  }

  getLatitude() {
    if (this._config.latitude !== undefined && this._config.latitude !== null) {
      return Number(this._config.latitude);
    }
    return Number(this._hass?.config?.latitude || DEFAULT_CONFIG.latitude);
  }

  getLocationName() {
    if (this._config.location_name) {
      return this._config.location_name;
    }
    return this._hass?.config?.location_name || DEFAULT_CONFIG.location_name;
  }

  shouldShowEvent(event) {
    const isSolstice = event.label.toLowerCase().includes("solstice");
    const isEquinox = event.label.toLowerCase().includes("equinox");
    return (isSolstice && this.booleanConfig("show_solstice_labels")) || (isEquinox && this.booleanConfig("show_equinox_labels"));
  }

  booleanConfig(key) {
    return this._config[key] !== false;
  }

  escape(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }
}

customElements.define("season-clock-card", SeasonClockCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "season-clock-card",
  name: "Season Clock Card",
  description: "A location-aware seasonal year clock for Home Assistant dashboards."
});
