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
  location_source: "home",
  location_entity: "",
  weather_entity: "",
  location_name: "",
  latitude: null,
  longitude: null,
  hemisphere: "auto",
  card_size: 500,
  show_date: true,
  show_day_number: true,
  show_season_name: true,
  show_location: true,
  show_solstice_labels: true,
  show_equinox_labels: true,
  show_month_names: true,
  show_month_markers: true,
  show_day_ticks: true,
  show_icons: true,
  show_weather: true
};

const MONTH_NAMES = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER"
];

const CENTER = 250;
const LAYOUT = {
  arcRadius: 181,
  monthNameRadius: 181,
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
    this._userConfig = {};
    this._config = { ...DEFAULT_CONFIG };
  }

  static getConfigElement() {
    return document.createElement("season-clock-card-editor");
  }

  static getStubConfig() {
    return {
      type: "custom:season-clock-card"
    };
  }

  setConfig(config) {
    this._userConfig = config || {};
    this._config = { ...DEFAULT_CONFIG, ...config };
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

    const title = this._config.title || "";
    const model = this.getClockModel();
    this.shadowRoot.innerHTML = `
      <style>${CARD_STYLES}</style>
      <ha-card style="--season-clock-size: ${Number(this._config.card_size) || 500}px">
        ${title ? `
          <div class="header">
            <div class="title">${this.escape(title)}</div>
          </div>
        ` : ""}
        <div class="wrap">
          ${this.renderSvg(model)}
        </div>
      </ha-card>
    `;
  }

  renderSvg(model) {
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
        ${this.renderMonthNames(model)}
        ${this.renderTicks(model)}
        ${this.renderEventMarkers(model)}
        ${this.renderSeasonLabels(model)}
        <line class="hand" x1="250" y1="250" x2="${model.handPoint.x}" y2="${model.handPoint.y}"></line>
        <circle class="pivot-halo" cx="250" cy="250" r="11"></circle>
        <circle class="pivot" cx="250" cy="250" r="5.5"></circle>
        ${this.renderCenterReadout(model)}
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

  renderMonthNames(model) {
    if (!this.booleanConfig("show_month_names")) {
      return "";
    }

    const monthPaths = MONTH_NAMES.map((name, month) => {
      const start = getDayOfYear(new Date(model.year, month, 1));
      const end = month === 11 ? model.totalDays + 1 : getDayOfYear(new Date(model.year, month + 1, 1));
      const id = `season-clock-month-${month}`;
      return `
        <path id="${id}" d="${this.describeTextArc(LAYOUT.monthNameRadius, dayToAngle(start + 1.5, model.totalDays), dayToAngle(end - 1.5, model.totalDays))}"></path>
        <text class="month-name">
          <textPath href="#${id}" startOffset="50%">${name}</textPath>
        </text>
      `;
    }).join("");

    return `<g class="month-names">${monthPaths}</g>`;
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

  renderEventMarkers(model) {
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
          ${this.renderEventLabel(event, label)}
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

  renderCenterReadout(model) {
    const rows = [];
    if (this.booleanConfig("show_date")) {
      rows.push(`<text class="weekday" x="250" y="168">${model.weekday}</text>`);
      rows.push(`<text class="date" x="250" y="189">${model.dateLabel}</text>`);
    }
    if (this.booleanConfig("show_day_number")) {
      rows.push(`<text class="day-text" x="250" y="214">Day ${model.dayOfYear} of ${model.totalDays}</text>`);
    }
    if (this.booleanConfig("show_season_name")) {
      const icon = this.booleanConfig("show_icons") ? `${SEASON_ICONS[model.currentSeason.name]} ` : "";
      rows.push(`<text class="season-text" x="250" y="237" fill="${SEASON_COLORS[model.currentSeason.name]}">${icon}${model.currentSeason.name}</text>`);
    }
    if (this.booleanConfig("show_location")) {
      rows.push(`<text class="hemisphere" x="250" y="282">${model.hemisphere === "north" ? "Northern Hemisphere" : "Southern Hemisphere"}</text>`);
      rows.push(`<text class="location" x="250" y="302">${this.escape(model.locationName)}</text>`);
    }
    if (this.booleanConfig("show_weather") && model.weather) {
      rows.push(`<text class="weather" x="250" y="324">${this.escape(model.weather)}</text>`);
    }
    return `<g class="center-readout" aria-hidden="true">${rows.join("")}</g>`;
  }

  getClockModel() {
    const now = new Date();
    const year = now.getFullYear();
    const totalDays = isLeapYear(year) ? 366 : 365;
    const dayOfYear = getDayOfYear(now);
    const location = this.getLocation();
    const hemisphere = normalizeHemisphere(this._config.hemisphere, location.latitude);
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
      locationName: location.name,
      weather: this.getWeather(),
      handPoint: pointAt(CENTER, dayToAngle(dayOfYear, totalDays), LAYOUT.handLength),
      weekday: new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(now),
      dateLabel: new Intl.DateTimeFormat(undefined, { day: "numeric", month: "long", year: "numeric" }).format(now)
    };
  }

  getLatitude() {
    return this.getLocation().latitude;
  }

  getLocation() {
    const source = this._config.location_source || "home";
    if (source === "entity") {
      const entityLocation = this.getEntityLocation();
      if (entityLocation) {
        return entityLocation;
      }
    }
    if (source === "manual") {
      const manualLocation = this.getManualLocation();
      if (manualLocation) {
        return manualLocation;
      }
    }
    return this.getHomeLocation();
  }

  getHomeLocation() {
    return {
      latitude: Number(this._hass?.config?.latitude ?? DEFAULT_CONFIG.latitude ?? 37.323),
      longitude: Number(this._hass?.config?.longitude ?? DEFAULT_CONFIG.longitude ?? -122.0322),
      name: this.getConfiguredLocationName() || this._hass?.config?.location_name || "Home"
    };
  }

  getManualLocation() {
    const latitude = Number(this._config.latitude);
    const longitude = Number(this._config.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }
    return {
      latitude,
      longitude,
      name: this.getConfiguredLocationName() || "Manual location"
    };
  }

  getEntityLocation() {
    const entityId = this._config.location_entity;
    const state = entityId ? this._hass?.states?.[entityId] : null;
    if (!state) {
      return null;
    }

    const latitude = Number(state.attributes.latitude ?? state.attributes.lat);
    const longitude = Number(state.attributes.longitude ?? state.attributes.lon ?? state.attributes.lng);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }

    return {
      latitude,
      longitude,
      name: this.getConfiguredLocationName() || state.attributes.friendly_name || entityId
    };
  }

  getConfiguredLocationName() {
    const name = this._userConfig?.location_name;
    return typeof name === "string" && name.trim() ? name.trim() : "";
  }

  getWeather() {
    const entityId = this._config.weather_entity;
    const state = entityId ? this._hass?.states?.[entityId] : null;
    if (!state) {
      return "";
    }

    const attributes = state.attributes || {};
    const unit = attributes.temperature_unit || this._hass?.config?.unit_system?.temperature || "";
    const temperature = this.formatTemperature(attributes.temperature, unit);
    const forecast = Array.isArray(attributes.forecast) ? attributes.forecast[0] : null;
    const high = this.formatTemperature(
      attributes.temperature_high ?? attributes.high_temperature ?? attributes.high ?? forecast?.temperature,
      unit
    );
    const low = this.formatTemperature(
      attributes.temperature_low ?? attributes.low_temperature ?? attributes.low ?? attributes.templow ?? forecast?.templow ?? forecast?.low_temperature,
      unit
    );
    const condition = this.formatCondition(state.state);
    const parts = [condition, temperature].filter(Boolean);
    const range = high && low ? `${high}/${low}` : high || low;
    if (range) {
      parts.push(`H/L ${range}`);
    }
    return parts.join(" · ");
  }

  formatTemperature(value, unit) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
      return "";
    }
    return `${Math.round(number)}${unit}`;
  }

  formatCondition(value) {
    if (!value || value === "unknown" || value === "unavailable") {
      return "";
    }
    const labels = {
      "clear-night": "Clear Night",
      cloudy: "Cloudy",
      exceptional: "Exceptional",
      fog: "Fog",
      hail: "Hail",
      lightning: "Lightning",
      "lightning-rainy": "Thunderstorms",
      partlycloudy: "Partly Cloudy",
      pouring: "Pouring",
      rainy: "Rainy",
      snowy: "Snowy",
      "snowy-rainy": "Sleet",
      sunny: "Sunny",
      windy: "Windy",
      "windy-variant": "Windy"
    };
    return labels[value] || String(value).replaceAll("_", " ").replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  describeTextArc(radius, startAngle, endAngle) {
    const start = pointAt(CENTER, startAngle, radius);
    const end = pointAt(CENTER, endAngle, radius);
    const normalizedEnd = endAngle <= startAngle ? endAngle + 360 : endAngle;
    const largeArcFlag = normalizedEnd - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
    ].join(" ");
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
