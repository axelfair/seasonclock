const EDITOR_SCHEMA = [
  { name: "title", selector: { text: {} } },
  { name: "view_mode", selector: { select: { options: ["basic", "detailed"] } } },
  { name: "show_mode_toggle", selector: { boolean: {} } },
  { name: "location_name", selector: { text: {} } },
  { name: "latitude", selector: { number: { mode: "box" } } },
  { name: "longitude", selector: { number: { mode: "box" } } },
  { name: "hemisphere", selector: { select: { options: ["auto", "northern", "southern"] } } },
  { name: "card_size", selector: { number: { min: 280, max: 600, mode: "slider" } } },
  { name: "show_date", selector: { boolean: {} } },
  { name: "show_day_number", selector: { boolean: {} } },
  { name: "show_season_name", selector: { boolean: {} } },
  { name: "show_location", selector: { boolean: {} } },
  { name: "show_solstice_labels", selector: { boolean: {} } },
  { name: "show_equinox_labels", selector: { boolean: {} } },
  { name: "show_month_markers", selector: { boolean: {} } },
  { name: "show_day_ticks", selector: { boolean: {} } },
  { name: "show_icons", selector: { boolean: {} } }
];

export class SeasonClockCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  render() {
    if (!this._hass) {
      return;
    }

    this.innerHTML = "";
    const form = document.createElement("ha-form");
    form.hass = this._hass;
    form.data = this._config || {};
    form.schema = EDITOR_SCHEMA;
    form.computeLabel = (schema) => schema.name.replaceAll("_", " ");
    form.addEventListener("value-changed", (event) => {
      this.dispatchEvent(new CustomEvent("config-changed", {
        detail: { config: event.detail.value },
        bubbles: true,
        composed: true
      }));
    });
    this.appendChild(form);
  }
}

customElements.define("season-clock-card-editor", SeasonClockCardEditor);
