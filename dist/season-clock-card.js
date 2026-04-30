//#region src/editor.js
var e = [
	{
		name: "title",
		selector: { text: {} }
	},
	{
		name: "location_name",
		selector: { text: {} }
	},
	{
		name: "latitude",
		selector: { number: { mode: "box" } }
	},
	{
		name: "longitude",
		selector: { number: { mode: "box" } }
	},
	{
		name: "hemisphere",
		selector: { select: { options: [
			"auto",
			"northern",
			"southern"
		] } }
	},
	{
		name: "card_size",
		selector: { number: {
			min: 280,
			max: 600,
			mode: "slider"
		} }
	},
	{
		name: "show_date",
		selector: { boolean: {} }
	},
	{
		name: "show_day_number",
		selector: { boolean: {} }
	},
	{
		name: "show_season_name",
		selector: { boolean: {} }
	},
	{
		name: "show_location",
		selector: { boolean: {} }
	},
	{
		name: "show_solstice_labels",
		selector: { boolean: {} }
	},
	{
		name: "show_equinox_labels",
		selector: { boolean: {} }
	},
	{
		name: "show_month_markers",
		selector: { boolean: {} }
	},
	{
		name: "show_day_ticks",
		selector: { boolean: {} }
	},
	{
		name: "show_icons",
		selector: { boolean: {} }
	}
], t = class extends HTMLElement {
	setConfig(e) {
		this._config = e, this.render();
	}
	set hass(e) {
		this._hass = e, this.render();
	}
	render() {
		if (!this._hass) return;
		this.innerHTML = "";
		let t = document.createElement("ha-form");
		t.hass = this._hass, t.data = this._config || {}, t.schema = e, t.computeLabel = (e) => e.name.replaceAll("_", " "), t.addEventListener("value-changed", (e) => {
			this.dispatchEvent(new CustomEvent("config-changed", {
				detail: { config: e.detail.value },
				bubbles: !0,
				composed: !0
			}));
		}), this.appendChild(t);
	}
};
customElements.define("season-clock-card-editor", t);
//#endregion
//#region src/styles.js
var n = "\n  :host {\n    display: block;\n    --season-clock-card-size: min(var(--season-clock-size, 500px), 100%);\n    --season-clock-text: #f3f8fc;\n    --season-clock-muted: #a7b6c1;\n    --season-clock-subtle: #6f8190;\n  }\n\n  ha-card {\n    display: block;\n    overflow: hidden;\n    border-radius: var(--ha-card-border-radius, 8px);\n    background: transparent;\n    border: 0;\n    box-shadow: none;\n  }\n\n  .header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 12px;\n    padding: 14px 16px 0;\n  }\n\n  .title {\n    color: var(--primary-text-color, var(--season-clock-text));\n    font-size: 15px;\n    font-weight: 700;\n    line-height: 1.2;\n  }\n\n  .wrap {\n    width: var(--season-clock-card-size);\n    max-width: 100%;\n    aspect-ratio: 1;\n    margin: 0 auto;\n  }\n\n  .clock {\n    display: block;\n    width: 100%;\n    height: 100%;\n    color: var(--season-clock-text);\n    font-family: var(--paper-font-body1_-_font-family, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif);\n  }\n\n  .clock-shadow {\n    fill: transparent;\n    stroke: rgba(205, 226, 240, 0.12);\n    stroke-width: 1;\n  }\n\n  .clock-face {\n    fill: transparent;\n    stroke: rgba(211, 228, 239, 0.16);\n    stroke-width: 1;\n  }\n\n  .season-arc {\n    fill: none;\n    stroke-linecap: butt;\n    stroke-width: 22;\n    opacity: 0.94;\n  }\n\n  .ring-guide {\n    fill: none;\n    stroke: rgba(218, 234, 244, 0.14);\n    stroke-width: 1;\n  }\n\n  .tick {\n    stroke: rgba(231, 241, 248, 0.18);\n    stroke-width: 0.7;\n    stroke-linecap: round;\n  }\n\n  .tick.month {\n    stroke: rgba(245, 249, 252, 0.76);\n    stroke-width: 1.7;\n  }\n\n  .season-label,\n  .event-label,\n  .event-date {\n    text-anchor: middle;\n    dominant-baseline: middle;\n    letter-spacing: 0;\n  }\n\n  .season-label {\n    font-size: 9px;\n    font-weight: 760;\n  }\n\n  .season-label .season-icon {\n    font-size: 11px;\n    font-weight: 600;\n  }\n\n  .event-line {\n    stroke: rgba(244, 248, 251, 0.72);\n    stroke-width: 1.3;\n    stroke-linecap: round;\n  }\n\n  .event-dot {\n    fill: #f7fbff;\n    stroke: rgba(4, 12, 18, 0.78);\n    stroke-width: 1;\n  }\n\n  .event-label {\n    fill: rgba(238, 245, 249, 0.9);\n    font-size: 7.2px;\n    font-weight: 760;\n    text-transform: uppercase;\n  }\n\n  .event-date {\n    fill: var(--season-clock-muted);\n    font-size: 7px;\n    font-weight: 650;\n  }\n\n  .hand {\n    stroke: rgba(255, 250, 229, 0.82);\n    stroke-width: 2.2;\n    stroke-linecap: round;\n    filter: url(\"#handGlow\");\n  }\n\n  .pivot-halo {\n    fill: rgba(255, 255, 255, 0.12);\n  }\n\n  .pivot {\n    fill: #f7fbff;\n    stroke: rgba(5, 12, 18, 0.75);\n    stroke-width: 1.2;\n  }\n\n  .center-readout {\n    text-anchor: middle;\n    dominant-baseline: middle;\n  }\n\n  .weekday {\n    fill: var(--season-clock-muted);\n    font-size: 11px;\n    font-weight: 650;\n  }\n\n  .date {\n    fill: var(--season-clock-text);\n    font-size: 15px;\n    font-weight: 760;\n  }\n\n  .day-text {\n    fill: #f1c84e;\n    font-size: 17px;\n    font-weight: 850;\n  }\n\n  .season-text {\n    font-size: 17px;\n    font-weight: 780;\n  }\n\n  .hemisphere,\n  .location {\n    fill: var(--season-clock-muted);\n    font-size: 10.5px;\n    font-weight: 600;\n  }\n\n  .location {\n    fill: var(--season-clock-subtle);\n  }\n", r = {
	Spring: "#7acb8b",
	Summer: "#e9bf52",
	Autumn: "#d77a4b",
	Winter: "#69aee8"
}, i = {
	Spring: "🌱",
	Summer: "☀️",
	Autumn: "🍂",
	Winter: "❄️"
}, a = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
], o = [
	{
		name: "Spring",
		label: "Spring Equinox",
		month: 2,
		day: 20
	},
	{
		name: "Summer",
		label: "Summer Solstice",
		month: 5,
		day: 21
	},
	{
		name: "Autumn",
		label: "Autumn Equinox",
		month: 8,
		day: 22
	},
	{
		name: "Winter",
		label: "Winter Solstice",
		month: 11,
		day: 21
	}
], s = [
	{
		name: "Autumn",
		label: "Autumn Equinox",
		month: 2,
		day: 20
	},
	{
		name: "Winter",
		label: "Winter Solstice",
		month: 5,
		day: 21
	},
	{
		name: "Spring",
		label: "Spring Equinox",
		month: 8,
		day: 22
	},
	{
		name: "Summer",
		label: "Summer Solstice",
		month: 11,
		day: 21
	}
], c = [
	{
		name: "Spring",
		month: 2,
		day: 1
	},
	{
		name: "Summer",
		month: 5,
		day: 1
	},
	{
		name: "Autumn",
		month: 8,
		day: 1
	},
	{
		name: "Winter",
		month: 11,
		day: 1
	}
], l = [
	{
		name: "Autumn",
		month: 2,
		day: 1
	},
	{
		name: "Winter",
		month: 5,
		day: 1
	},
	{
		name: "Spring",
		month: 8,
		day: 1
	},
	{
		name: "Summer",
		month: 11,
		day: 1
	}
];
function u(e) {
	return e % 4 == 0 && e % 100 != 0 || e % 400 == 0;
}
function d(e) {
	let t = new Date(e.getFullYear(), 0, 0), n = e - t + (t.getTimezoneOffset() - e.getTimezoneOffset()) * 6e4;
	return Math.floor(n / 864e5);
}
function f(e) {
	return Array.from({ length: 12 }, (t, n) => d(new Date(e, n, 1)));
}
function p(e, t, n) {
	return e.map((r, i) => {
		let a = e[(i + 1) % e.length], o = d(new Date(t, r.month, r.day)), s = d(new Date(t, a.month, a.day)), c = s > o ? s : s + n;
		return {
			name: r.name,
			start: o,
			end: c
		};
	});
}
function m(e, t, n) {
	let r = t < e[0].start ? t + n : t;
	return e.find((e) => r >= e.start && r < e.end) || e[e.length - 1];
}
function h(e, t, n) {
	let r = e + (t - e) / 2;
	return r > n ? r - n : r;
}
function g(e, t) {
	return e === "northern" || e === "north" ? "north" : e === "southern" || e === "south" || Number(t) < 0 ? "south" : "north";
}
function _(e, t) {
	return (e - 1) / t * 360 - 90;
}
function v(e, t, n) {
	let r = t * Math.PI / 180;
	return {
		x: x(e + n * Math.cos(r)),
		y: x(e + n * Math.sin(r))
	};
}
function y(e, t, n, r, i) {
	let a = i <= r ? i + 360 : i, o = b(e, t, n, a), s = b(e, t, n, r), c = a - r <= 180 ? "0" : "1";
	return [
		"M",
		o.x,
		o.y,
		"A",
		n,
		n,
		0,
		c,
		0,
		s.x,
		s.y
	].join(" ");
}
function b(e, t, n, r) {
	let i = r * Math.PI / 180;
	return {
		x: x(e + n * Math.cos(i)),
		y: x(t + n * Math.sin(i))
	};
}
function x(e) {
	return Math.round(e * 100) / 100;
}
//#endregion
//#region src/season-clock-card.js
var S = {
	location_name: "Cupertino, California",
	latitude: 37.323,
	longitude: -122.0322,
	hemisphere: "auto",
	card_size: 500,
	show_date: !0,
	show_day_number: !0,
	show_season_name: !0,
	show_location: !0,
	show_solstice_labels: !0,
	show_equinox_labels: !0,
	show_month_markers: !0,
	show_day_ticks: !0,
	show_icons: !0
}, C = 250, w = {
	arcRadius: 181,
	tickOuter: 194,
	dayTickInner: 187,
	monthTickInner: 174,
	eventInner: 168,
	eventOuter: 202,
	eventLabel: 224,
	seasonLabel: 136,
	handLength: 166
}, T = class extends HTMLElement {
	constructor() {
		super(), this.attachShadow({ mode: "open" }), this._config = { ...S };
	}
	static getConfigElement() {
		return document.createElement("season-clock-card-editor");
	}
	static getStubConfig() {
		return { type: "custom:season-clock-card" };
	}
	setConfig(e) {
		this._config = {
			...S,
			...e
		}, this.render();
	}
	set hass(e) {
		this._hass = e, this.render();
	}
	getCardSize() {
		return Math.ceil((Number(this._config.card_size) || 500) / 50);
	}
	render() {
		if (!this.shadowRoot) return;
		let e = this._config.title || "", t = this.getClockModel();
		this.shadowRoot.innerHTML = `
      <style>${n}</style>
      <ha-card style="--season-clock-size: ${Number(this._config.card_size) || 500}px">
        ${e ? `
          <div class="header">
            <div class="title">${this.escape(e)}</div>
          </div>
        ` : ""}
        <div class="wrap">
          ${this.renderSvg(t)}
        </div>
      </ha-card>
    `;
	}
	renderSvg(e) {
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
        ${this.renderSeasonArcs(e)}
        ${this.renderTicks(e)}
        ${this.renderEventMarkers(e)}
        ${this.renderSeasonLabels(e)}
        <line class="hand" x1="250" y1="250" x2="${e.handPoint.x}" y2="${e.handPoint.y}"></line>
        <circle class="pivot-halo" cx="250" cy="250" r="11"></circle>
        <circle class="pivot" cx="250" cy="250" r="5.5"></circle>
        ${this.renderCenterReadout(e)}
      </svg>
    `;
	}
	renderSeasonArcs(e) {
		return `<g class="season-arcs">${`
      <circle class="ring-guide" cx="250" cy="250" r="${w.arcRadius + 12}"></circle>
      <circle class="ring-guide" cx="250" cy="250" r="${w.arcRadius - 12}"></circle>
    `}${e.segments.map((t) => `
      <path class="season-arc" d="${y(C, C, w.arcRadius, _(t.start, e.totalDays), _(t.end, e.totalDays))}" stroke="${r[t.name]}"></path>
    `).join("")}</g>`;
	}
	renderTicks(e) {
		let t = this.booleanConfig("show_day_ticks"), n = this.booleanConfig("show_month_markers");
		if (!t && !n) return "";
		let r = new Set(f(e.year)), i = [];
		for (let a = 1; a <= e.totalDays; a += 1) {
			let o = r.has(a);
			if (o && !n || !o && !t) continue;
			let s = _(a, e.totalDays), c = v(C, s, o ? w.monthTickInner : w.dayTickInner), l = v(C, s, w.tickOuter);
			i.push(`<line class="tick${o ? " month" : ""}" x1="${c.x}" y1="${c.y}" x2="${l.x}" y2="${l.y}"></line>`);
		}
		return `<g class="ticks">${i.join("")}</g>`;
	}
	renderEventMarkers(e) {
		return `<g class="event-markers">${e.events.filter((e) => this.shouldShowEvent(e)).map((t) => {
			let n = _(d(new Date(e.year, t.month, t.day)), e.totalDays), r = v(C, n, w.eventInner), i = v(C, n, w.eventOuter), a = v(C, n, w.eventLabel);
			return `
          <line class="event-line" x1="${r.x}" y1="${r.y}" x2="${i.x}" y2="${i.y}"></line>
          <circle class="event-dot" cx="${i.x}" cy="${i.y}" r="3"></circle>
          ${this.renderEventLabel(t, a)}
        `;
		}).join("")}</g>`;
	}
	renderEventLabel(e, t) {
		let n = e.label.toUpperCase().split(" ");
		return `
      <text class="event-label" x="${t.x}" y="${t.y - 4}">
        ${n.map((e, n) => `<tspan x="${t.x}" dy="${n === 0 ? 0 : 8.2}">${e}</tspan>`).join("")}
        <tspan class="event-date" x="${t.x}" dy="9">${e.day} ${a[e.month].toUpperCase()}</tspan>
      </text>
    `;
	}
	renderSeasonLabels(e) {
		return this.booleanConfig("show_season_name") ? `<g class="season-labels">${e.segments.map((t) => {
			let n = v(C, _(h(t.start, t.end, e.totalDays), e.totalDays), w.seasonLabel), a = this.booleanConfig("show_icons") ? `<tspan class="season-icon">${i[t.name]} </tspan>` : "";
			return `
        <text class="season-label" x="${n.x}" y="${n.y}" fill="${r[t.name]}">
          ${a}<tspan>${t.name}</tspan>
        </text>
      `;
		}).join("")}</g>` : "";
	}
	renderCenterReadout(e) {
		let t = [];
		if (this.booleanConfig("show_date") && (t.push(`<text class="weekday" x="250" y="184">${e.weekday}</text>`), t.push(`<text class="date" x="250" y="205">${e.dateLabel}</text>`)), this.booleanConfig("show_day_number") && t.push(`<text class="day-text" x="250" y="231">Day ${e.dayOfYear} of ${e.totalDays}</text>`), this.booleanConfig("show_season_name")) {
			let n = this.booleanConfig("show_icons") ? `${i[e.currentSeason.name]} ` : "";
			t.push(`<text class="season-text" x="250" y="286" fill="${r[e.currentSeason.name]}">${n}${e.currentSeason.name}</text>`);
		}
		return this.booleanConfig("show_location") && (t.push(`<text class="hemisphere" x="250" y="314">${e.hemisphere === "north" ? "Northern Hemisphere" : "Southern Hemisphere"}</text>`), t.push(`<text class="location" x="250" y="334">${this.escape(e.locationName)}</text>`)), `<g class="center-readout" aria-hidden="true">${t.join("")}</g>`;
	}
	getClockModel() {
		let e = /* @__PURE__ */ new Date(), t = e.getFullYear(), n = u(t) ? 366 : 365, r = d(e), i = this.getLatitude(), a = g(this._config.hemisphere, i), f = a === "north" ? o : s, h = p(a === "north" ? c : l, t, n);
		return {
			year: t,
			totalDays: n,
			dayOfYear: r,
			hemisphere: a,
			events: f,
			segments: h,
			currentSeason: m(h, r, n),
			locationName: this.getLocationName(),
			handPoint: v(C, _(r, n), w.handLength),
			weekday: new Intl.DateTimeFormat(void 0, { weekday: "long" }).format(e),
			dateLabel: new Intl.DateTimeFormat(void 0, {
				day: "numeric",
				month: "long",
				year: "numeric"
			}).format(e)
		};
	}
	getLatitude() {
		return this._config.latitude !== void 0 && this._config.latitude !== null ? Number(this._config.latitude) : Number(this._hass?.config?.latitude || S.latitude);
	}
	getLocationName() {
		return this._config.location_name ? this._config.location_name : this._hass?.config?.location_name || S.location_name;
	}
	shouldShowEvent(e) {
		let t = e.label.toLowerCase().includes("solstice"), n = e.label.toLowerCase().includes("equinox");
		return t && this.booleanConfig("show_solstice_labels") || n && this.booleanConfig("show_equinox_labels");
	}
	booleanConfig(e) {
		return this._config[e] !== !1;
	}
	escape(e) {
		return String(e).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
	}
};
customElements.define("season-clock-card", T), window.customCards = window.customCards || [], window.customCards.push({
	type: "season-clock-card",
	name: "Season Clock Card",
	description: "A location-aware seasonal year clock for Home Assistant dashboards."
});
//#endregion
