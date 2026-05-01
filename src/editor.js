const DISPLAY_OPTIONS = [
  "show_date",
  "show_day_number",
  "show_season_name",
  "show_location",
  "show_solstice_labels",
  "show_equinox_labels",
  "show_month_names",
  "show_month_markers",
  "show_day_ticks",
  "show_moon_phase",
  "show_weather"
];

const EDITOR_DEFAULTS = {
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
  show_moon_phase: true,
  show_weather: true
};

const EDITOR_SCHEMA = [
  { name: "title", selector: { text: {} } },
  { name: "location_source", selector: { select: { options: ["home", "entity", "manual"] } } },
  { name: "location_entity", selector: { entity: {} } },
  { name: "weather_entity", selector: { entity: { domain: "weather" } } },
  { name: "location_name", selector: { text: {} } },
  { name: "hemisphere", selector: { select: { options: ["auto", "northern", "southern"] } } },
  { name: "card_size", selector: { number: { min: 280, max: 600, mode: "slider" } } },
  { type: "grid", name: "", schema: [
    { name: "latitude", selector: { number: { mode: "box" } } },
    { name: "longitude", selector: { number: { mode: "box" } } }
  ] },
  { type: "grid", name: "Clock face items", schema: DISPLAY_OPTIONS.map((name) => ({ name, selector: { boolean: {} } })) }
];

export class SeasonClockCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._updatingForm = false;
  }

  setConfig(config) {
    this._config = config || {};
    this.updateForm();
  }

  set hass(hass) {
    this._hass = hass;
    this.updateForm();
  }

  render() {
    if (!this._hass || this._rendered) {
      return;
    }

    this.innerHTML = `
      <style>
        .display-actions {
          display: flex;
          gap: 8px;
          margin: 12px 0;
        }

        .display-actions button {
          border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.28));
          border-radius: 8px;
          padding: 8px 12px;
          background: var(--secondary-background-color, transparent);
          color: var(--primary-text-color);
          cursor: pointer;
          font: inherit;
          font-size: 13px;
          font-weight: 600;
        }
      </style>
      <ha-form></ha-form>
      <div class="display-actions" aria-label="Clock face item shortcuts">
        <button type="button" data-display-action="on">Turn all items on</button>
        <button type="button" data-display-action="off">Turn all items off</button>
      </div>
    `;

    const form = this.querySelector("ha-form");
    form.schema = EDITOR_SCHEMA;
    form.computeLabel = (schema) => this.getLabel(schema);
    form.addEventListener("value-changed", (event) => {
      if (this._updatingForm) {
        return;
      }
      this.updateConfig(event.detail.value || {});
    });

    this.querySelectorAll("[data-display-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const enabled = button.dataset.displayAction === "on";
        const nextConfig = { ...(this._config || {}) };
        DISPLAY_OPTIONS.forEach((option) => {
          nextConfig[option] = enabled;
        });
        this.updateConfig(nextConfig);
      });
    });

    this._rendered = true;
    this.updateForm();
  }

  updateConfig(config) {
    this._config = { ...(this._config || {}), ...(config || {}) };
    this.updateForm();
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true,
      composed: true
    }));
  }

  updateForm() {
    if (!this._hass) {
      return;
    }
    if (!this._rendered) {
      this.render();
      return;
    }

    const form = this.querySelector("ha-form");
    if (!form) {
      return;
    }
    this._updatingForm = true;
    form.hass = this._hass;
    form.data = { ...EDITOR_DEFAULTS, ...(this._config || {}) };
    queueMicrotask(() => {
      this._updatingForm = false;
    });
  }

  getLabel(schema) {
    const labels = {
      location_source: "Location source",
      location_entity: "Location entity",
      location_name: "Location label override",
      card_size: "Card size",
      show_date: "Date",
      show_day_number: "Day number",
      show_season_name: "Season names",
      show_location: "Location",
      show_solstice_labels: "Solstice labels",
      show_equinox_labels: "Equinox labels",
      show_month_names: "Month names",
      show_month_markers: "Month markers",
      show_day_ticks: "Day ticks",
      show_moon_phase: "Moon phase",
      show_weather: "Weather",
      weather_entity: "Weather entity"
    };
    return labels[schema.name] || schema.name?.replaceAll("_", " ") || "";
  }
}

if (!customElements.get("season-clock-card-editor")) {
  customElements.define("season-clock-card-editor", SeasonClockCardEditor);
}
