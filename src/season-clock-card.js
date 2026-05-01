import "./editor.js";
import { CARD_STYLES } from "./styles.js";
import {
  MONTH_SHORT,
  NORTHERN_EVENTS,
  NORTHERN_SEASON_STARTS,
  SEASON_COLORS,
  SOUTHERN_EVENTS,
  SOUTHERN_SEASON_STARTS,
  buildSeasonSegments,
  dayToAngle,
  describeArc,
  getCurrentSeason,
  getDayOfYear,
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
  show_moon_phase: true,
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
  progressRadius: 155,
  todayRadius: 207,
  moonRadius: 166,
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
          <radialGradient id="dialGradient" cx="48%" cy="42%" r="62%">
            <stop offset="0%" stop-color="#182129"></stop>
            <stop offset="58%" stop-color="#071016"></stop>
            <stop offset="100%" stop-color="#010407"></stop>
          </radialGradient>
          <radialGradient id="glassGradient" cx="32%" cy="24%" r="78%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"></stop>
            <stop offset="36%" stop-color="#ffffff" stop-opacity="0.045"></stop>
            <stop offset="70%" stop-color="#000000" stop-opacity="0.03"></stop>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.32"></stop>
          </radialGradient>
          <radialGradient id="complicationFaceGradient" cx="34%" cy="28%" r="76%">
            <stop offset="0%" stop-color="#f7fbfb"></stop>
            <stop offset="54%" stop-color="#dfe8e9"></stop>
            <stop offset="100%" stop-color="#aebabe"></stop>
          </radialGradient>
          <linearGradient id="handMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff8d8"></stop>
            <stop offset="48%" stop-color="#d5dde2"></stop>
            <stop offset="100%" stop-color="#8a969f"></stop>
          </linearGradient>
          <radialGradient id="pivotMetal" cx="35%" cy="28%" r="72%">
            <stop offset="0%" stop-color="#ffffff"></stop>
            <stop offset="44%" stop-color="#c8d0d6"></stop>
            <stop offset="100%" stop-color="#59646d"></stop>
          </radialGradient>
          <filter id="handGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.8" result="blur"></feGaussianBlur>
            <feMerge>
              <feMergeNode in="blur"></feMergeNode>
              <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
          </filter>
          <filter id="seasonLift" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.38"></feDropShadow>
            <feDropShadow dx="0" dy="-0.8" stdDeviation="0.7" flood-color="#ffffff" flood-opacity="0.18"></feDropShadow>
          </filter>
          <filter id="complicationInset" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.6" stdDeviation="1.2" flood-color="#000000" flood-opacity="0.42"></feDropShadow>
          </filter>
          <filter id="dialInnerShadow" x="-12%" y="-12%" width="124%" height="124%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#000000" flood-opacity="0.55"></feDropShadow>
          </filter>
        </defs>
        <circle class="clock-shadow" cx="250" cy="250" r="213"></circle>
        <circle class="outer-rim-glow" cx="250" cy="250" r="213"></circle>
        <circle class="clock-face" cx="250" cy="250" r="154"></circle>
        <circle class="dial-texture" cx="250" cy="250" r="153"></circle>
        ${this.renderSeasonArcs(model)}
        ${this.renderMonthNames(model)}
        ${this.renderTicks(model)}
        ${this.renderEventMarkers(model)}
        ${this.renderProgressLayer(model)}
        ${this.renderCenterReadout(model)}
        <circle class="clock-glass" cx="250" cy="250" r="207"></circle>
        <path class="glass-sheen" d="M 106 174 C 162 87 306 64 388 136"></path>
        <line class="hand-shadow" x1="250" y1="252" x2="${model.handPoint.x}" y2="${model.handPoint.y + 2}"></line>
        <line class="hand" x1="250" y1="250" x2="${model.handPoint.x}" y2="${model.handPoint.y}"></line>
        <line class="hand-highlight" x1="250" y1="250" x2="${model.handPoint.x}" y2="${model.handPoint.y}"></line>
        ${this.renderMoonPhase(model)}
        <circle class="pivot-shadow" cx="250" cy="253" r="12"></circle>
        <circle class="pivot-halo" cx="250" cy="250" r="11"></circle>
        <circle class="pivot" cx="250" cy="250" r="6.8"></circle>
        <circle class="pivot-highlight" cx="247.8" cy="247.3" r="2"></circle>
      </svg>
    `;
  }

  renderMoonPhase(model) {
    if (!this.booleanConfig("show_moon_phase")) {
      return "";
    }

    const point = pointAt(CENTER, dayToAngle(model.dayOfYear, model.totalDays), LAYOUT.moonRadius);
    return `
      <g class="moon-phase" aria-label="${this.escape(model.moonPhase.label)}">
        <circle class="moon-badge" cx="${point.x}" cy="${point.y}" r="12"></circle>
        <text class="moon-icon" x="${point.x}" y="${point.y}">${model.moonPhase.icon}</text>
      </g>
    `;
  }

  renderProgressLayer(model) {
    const progressEnd = model.currentSeason.start + ((model.currentSeason.end - model.currentSeason.start) * (model.seasonProgress / 100));
    const progressPath = describeArc(
      CENTER,
      CENTER,
      LAYOUT.progressRadius,
      dayToAngle(model.currentSeason.start, model.totalDays),
      dayToAngle(progressEnd, model.totalDays)
    );
    const today = pointAt(CENTER, dayToAngle(model.dayOfYear, model.totalDays), LAYOUT.todayRadius);
    const next = pointAt(CENTER, dayToAngle(model.nextEvent.dayOfYear, model.totalDays), LAYOUT.todayRadius);

    return `
      <g class="progress-layer">
        <circle class="progress-track" cx="250" cy="250" r="${LAYOUT.progressRadius}"></circle>
        <path class="season-progress" d="${progressPath}" stroke="${SEASON_COLORS[model.currentSeason.name]}"></path>
        <circle class="next-event-dot" cx="${next.x}" cy="${next.y}" r="3.2"></circle>
        <circle class="today-dot" cx="${today.x}" cy="${today.y}" r="4.2"></circle>
      </g>
    `;
  }

  renderSeasonArcs(model) {
    const guides = `
      <circle class="ring-bevel" cx="250" cy="250" r="${LAYOUT.arcRadius}"></circle>
      <circle class="ring-inner-shadow" cx="250" cy="250" r="${LAYOUT.arcRadius - 16}"></circle>
      <circle class="ring-outer-highlight" cx="250" cy="250" r="${LAYOUT.arcRadius + 15}"></circle>
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

  renderCenterReadout(model) {
    const complications = [];
    const showDate = this.booleanConfig("show_date");
    const showDayNumber = this.booleanConfig("show_day_number");
    const showSeason = this.booleanConfig("show_season_name");
    const showLocation = this.booleanConfig("show_location");
    const showWeather = this.booleanConfig("show_weather") && model.weatherInfo;

    if (showDate || showDayNumber) {
      complications.push(this.renderComplication({
        className: "date-complication",
        x: 250,
        y: 166,
        radius: 40,
        title: showDate ? model.weekday : "Year Day",
        primary: showDate ? model.dateShort : `Day ${model.dayOfYear}`,
        secondary: showDayNumber ? `${model.dayOfYear}/${model.totalDays}` : "",
        accent: "#f1c84e"
      }));
    }

    if (showSeason) {
      complications.push(this.renderComplication({
        className: "season-complication",
        x: 166,
        y: 250,
        radius: 40,
        title: model.currentSeason.name,
        primary: `${model.seasonProgress}%`,
        secondary: "complete",
        accent: SEASON_COLORS[model.currentSeason.name]
      }));
      complications.push(this.renderComplication({
        className: "event-complication",
        x: 334,
        y: 250,
        radius: 40,
        title: "Next",
        primary: this.formatEventShortLabel(model.nextEvent),
        secondary: `${model.nextEvent.daysUntil} ${model.nextEvent.daysUntil === 1 ? "day" : "days"}`,
        accent: SEASON_COLORS[model.nextEvent.name]
      }));
    }

    if (showWeather) {
      complications.push(this.renderComplication({
        className: "weather-complication",
        x: 250,
        y: 334,
        radius: 40,
        title: "Weather",
        primary: model.weatherInfo.icon,
        secondary: model.weatherInfo.temperature,
        accent: "#69aee8"
      }));
    } else if (showLocation) {
      const hemisphere = model.hemisphere === "north" ? "Northern" : "Southern";
      complications.push(this.renderComplication({
        className: "place-complication",
        x: 250,
        y: 334,
        radius: 40,
        title: hemisphere,
        primary: this.truncate(model.locationName, 9),
        secondary: "Hemisphere",
        accent: "#dfe8ee"
      }));
    }

    return `<g class="center-readout" aria-hidden="true">${complications.join("")}</g>`;
  }

  renderComplication({ className, x, y, radius, title, primary, secondary, accent }) {
    const safeAccent = this.escape(accent || "#dfe8ee");
    return `
      <g class="complication ${className}">
        <circle class="complication-socket" cx="${x}" cy="${y}" r="${radius + 7}"></circle>
        <circle class="complication-socket-highlight" cx="${x - 1.4}" cy="${y - 1.4}" r="${radius + 5}"></circle>
        <circle class="complication-shadow" cx="${x + 1.8}" cy="${y + 2.4}" r="${radius + 1}"></circle>
        <circle class="complication-face" cx="${x}" cy="${y}" r="${radius}"></circle>
        <circle class="complication-inner-shadow" cx="${x}" cy="${y}" r="${radius - 4}"></circle>
        <circle class="complication-ring" cx="${x}" cy="${y}" r="${radius - 3}" stroke="${safeAccent}"></circle>
        <line class="complication-marker" x1="${x}" y1="${y - radius + 8}" x2="${x}" y2="${y - radius + 15}" stroke="${safeAccent}"></line>
        <text class="complication-title emboss-shadow" x="${x}" y="${y - 14.5}">${this.escape(this.truncate(title, 10))}</text>
        <text class="complication-title" x="${x}" y="${y - 15}">${this.escape(this.truncate(title, 10))}</text>
        <text class="complication-primary emboss-shadow" x="${x}" y="${y + 3.5}" fill="${safeAccent}">${this.escape(primary)}</text>
        <text class="complication-primary" x="${x}" y="${y + 3}" fill="${safeAccent}">${this.escape(primary)}</text>
        ${secondary ? `
          <text class="complication-secondary emboss-shadow" x="${x}" y="${y + 19.5}">${this.escape(secondary)}</text>
          <text class="complication-secondary" x="${x}" y="${y + 19}">${this.escape(secondary)}</text>
        ` : ""}
      </g>
    `;
  }

  truncate(value, maxLength) {
    const text = String(value || "");
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.slice(0, Math.max(0, maxLength - 1))}…`;
  }

  formatEventShortLabel(event) {
    return event.label.toLowerCase().includes("solstice") ? "Solstice" : "Equinox";
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
    const seasonProgress = this.getSeasonProgress(currentSeason, dayOfYear, totalDays);
    const nextEvent = this.getNextEvent(events, year, dayOfYear, totalDays);

    return {
      year,
      totalDays,
      dayOfYear,
      hemisphere,
      events,
      segments,
      currentSeason,
      seasonProgress,
      nextEvent,
      moonPhase: this.getMoonPhase(now),
      locationName: location.name,
      weather: this.getWeather(),
      weatherInfo: this.getWeatherInfo(),
      handPoint: pointAt(CENTER, dayToAngle(dayOfYear, totalDays), LAYOUT.handLength),
      weekday: new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(now),
      dateShort: new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" }).format(now),
      dateLabel: new Intl.DateTimeFormat(undefined, { day: "numeric", month: "long", year: "numeric" }).format(now)
    };
  }

  getSeasonProgress(segment, dayOfYear, totalDays) {
    const wrappedDay = dayOfYear < segment.start ? dayOfYear + totalDays : dayOfYear;
    const elapsed = Math.max(0, wrappedDay - segment.start + 1);
    return Math.min(100, Math.max(1, Math.round((elapsed / (segment.end - segment.start)) * 100)));
  }

  getNextEvent(events, year, dayOfYear, totalDays) {
    const candidates = events.map((event) => {
      const eventDay = getDayOfYear(new Date(year, event.month, event.day));
      const daysUntil = eventDay >= dayOfYear ? eventDay - dayOfYear : eventDay + totalDays - dayOfYear;
      return {
        ...event,
        dayOfYear: eventDay,
        daysUntil,
        shortLabel: event.label.replace("Spring ", "").replace("Summer ", "").replace("Autumn ", "").replace("Winter ", "")
      };
    });
    candidates.sort((a, b) => a.daysUntil - b.daysUntil);
    return candidates[0];
  }

  getMoonPhase(date) {
    const phases = [
      { icon: "🌑", label: "New Moon" },
      { icon: "🌒", label: "Waxing Crescent" },
      { icon: "🌓", label: "First Quarter" },
      { icon: "🌔", label: "Waxing Gibbous" },
      { icon: "🌕", label: "Full Moon" },
      { icon: "🌖", label: "Waning Gibbous" },
      { icon: "🌗", label: "Last Quarter" },
      { icon: "🌘", label: "Waning Crescent" }
    ];
    const synodicMonth = 29.530588853;
    const referenceNewMoonJulianDay = 2451550.1;
    const julianDay = (date.getTime() / 86400000) + 2440587.5;
    const age = ((julianDay - referenceNewMoonJulianDay) % synodicMonth + synodicMonth) % synodicMonth;
    const index = Math.floor(((age / synodicMonth) * phases.length) + 0.5) % phases.length;

    return {
      ...phases[index],
      age: Math.round(age * 10) / 10,
      illumination: Math.round(((1 - Math.cos((2 * Math.PI * age) / synodicMonth)) / 2) * 100)
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

    const attributes = state.attributes || {};
    const latitude = Number(attributes.latitude ?? attributes.lat);
    const longitude = Number(attributes.longitude ?? attributes.lon ?? attributes.lng);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }

    return {
      latitude,
      longitude,
      name: this.getConfiguredLocationName() || attributes.friendly_name || entityId
    };
  }

  getConfiguredLocationName() {
    const name = this._userConfig?.location_name;
    return typeof name === "string" && name.trim() ? name.trim() : "";
  }

  getWeather() {
    const weather = this.getWeatherInfo();
    if (!weather) {
      return "";
    }
    return [weather.condition, weather.temperature].filter(Boolean).join(" · ");
  }

  getWeatherInfo() {
    const entityId = this._config.weather_entity;
    const state = entityId ? this._hass?.states?.[entityId] : null;
    if (!state) {
      return null;
    }

    const attributes = state.attributes || {};
    const unit = attributes.temperature_unit || this._hass?.config?.unit_system?.temperature || "";
    const temperature = this.formatTemperature(attributes.temperature, unit);
    const condition = this.formatCondition(state.state);
    if (!condition && !temperature) {
      return null;
    }
    return {
      condition,
      temperature,
      icon: this.getWeatherIcon(state.state)
    };
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

  getWeatherIcon(value) {
    const icons = {
      "clear-night": "☾",
      cloudy: "☁",
      exceptional: "!",
      fog: "≋",
      hail: "◌",
      lightning: "ϟ",
      "lightning-rainy": "ϟ",
      partlycloudy: "◐",
      pouring: "☔",
      rainy: "☂",
      snowy: "✻",
      "snowy-rainy": "❄",
      sunny: "☀",
      windy: "≋",
      "windy-variant": "≋"
    };
    return icons[value] || "○";
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
