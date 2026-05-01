//#region src/editor.js
var e = [
	"show_date",
	"show_day_number",
	"show_season_name",
	"show_location",
	"show_solstice_labels",
	"show_equinox_labels",
	"show_month_names",
	"show_month_markers",
	"show_day_ticks",
	"show_icons",
	"show_moon_phase",
	"show_weather"
], t = {
	location_source: "home",
	location_entity: "",
	weather_entity: "",
	location_name: "",
	latitude: null,
	longitude: null,
	hemisphere: "auto",
	card_size: 500,
	show_date: !0,
	show_day_number: !0,
	show_season_name: !0,
	show_location: !0,
	show_solstice_labels: !0,
	show_equinox_labels: !0,
	show_month_names: !0,
	show_month_markers: !0,
	show_day_ticks: !0,
	show_icons: !0,
	show_moon_phase: !0,
	show_weather: !0
}, n = [
	{
		name: "title",
		selector: { text: {} }
	},
	{
		name: "location_source",
		selector: { select: { options: [
			"home",
			"entity",
			"manual"
		] } }
	},
	{
		name: "location_entity",
		selector: { entity: {} }
	},
	{
		name: "weather_entity",
		selector: { entity: { domain: "weather" } }
	},
	{
		name: "location_name",
		selector: { text: {} }
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
		type: "grid",
		name: "",
		schema: [{
			name: "latitude",
			selector: { number: { mode: "box" } }
		}, {
			name: "longitude",
			selector: { number: { mode: "box" } }
		}]
	},
	{
		type: "grid",
		name: "Clock face items",
		schema: e.map((e) => ({
			name: e,
			selector: { boolean: {} }
		}))
	}
], r = class extends HTMLElement {
	constructor() {
		super(), this._config = {}, this._updatingForm = !1;
	}
	setConfig(e) {
		this._config = e || {}, this.updateForm();
	}
	set hass(e) {
		this._hass = e, this.updateForm();
	}
	render() {
		if (!this._hass || this._rendered) return;
		this.innerHTML = "\n      <style>\n        .display-actions {\n          display: flex;\n          gap: 8px;\n          margin: 12px 0;\n        }\n\n        .display-actions button {\n          border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.28));\n          border-radius: 8px;\n          padding: 8px 12px;\n          background: var(--secondary-background-color, transparent);\n          color: var(--primary-text-color);\n          cursor: pointer;\n          font: inherit;\n          font-size: 13px;\n          font-weight: 600;\n        }\n      </style>\n      <ha-form></ha-form>\n      <div class=\"display-actions\" aria-label=\"Clock face item shortcuts\">\n        <button type=\"button\" data-display-action=\"on\">Turn all items on</button>\n        <button type=\"button\" data-display-action=\"off\">Turn all items off</button>\n      </div>\n    ";
		let t = this.querySelector("ha-form");
		t.schema = n, t.computeLabel = (e) => this.getLabel(e), t.addEventListener("value-changed", (e) => {
			this._updatingForm || this.updateConfig(e.detail.value || {});
		}), this.querySelectorAll("[data-display-action]").forEach((t) => {
			t.addEventListener("click", () => {
				let n = t.dataset.displayAction === "on", r = { ...this._config || {} };
				e.forEach((e) => {
					r[e] = n;
				}), this.updateConfig(r);
			});
		}), this._rendered = !0, this.updateForm();
	}
	updateConfig(e) {
		this._config = {
			...this._config || {},
			...e || {}
		}, this.updateForm(), this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: this._config },
			bubbles: !0,
			composed: !0
		}));
	}
	updateForm() {
		if (!this._hass) return;
		if (!this._rendered) {
			this.render();
			return;
		}
		let e = this.querySelector("ha-form");
		e && (this._updatingForm = !0, e.hass = this._hass, e.data = {
			...t,
			...this._config || {}
		}, queueMicrotask(() => {
			this._updatingForm = !1;
		}));
	}
	getLabel(e) {
		return {
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
			show_icons: "Icons",
			show_moon_phase: "Moon phase",
			show_weather: "Weather",
			weather_entity: "Weather entity"
		}[e.name] || e.name?.replaceAll("_", " ") || "";
	}
};
customElements.define("season-clock-card-editor", r);
//#endregion
//#region src/styles.js
var i = "\n  :host {\n    display: block;\n    --season-clock-card-size: min(var(--season-clock-size, 500px), 100%);\n    --season-clock-text: #f3f8fc;\n    --season-clock-muted: #a7b6c1;\n    --season-clock-subtle: #6f8190;\n    --clock-shadow-deep: rgba(0, 0, 0, 0.72);\n    --clock-shadow-soft: rgba(0, 0, 0, 0.36);\n    --clock-highlight: rgba(255, 255, 255, 0.22);\n    --clock-glass: rgba(255, 255, 255, 0.08);\n    --clock-rim: rgba(206, 220, 229, 0.42);\n  }\n\n  ha-card {\n    display: block;\n    overflow: hidden;\n    border-radius: var(--ha-card-border-radius, 8px);\n    background: transparent;\n    border: 0;\n    box-shadow: none;\n  }\n\n  .header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 12px;\n    padding: 14px 16px 0;\n  }\n\n  .title {\n    color: var(--primary-text-color, var(--season-clock-text));\n    font-size: 15px;\n    font-weight: 700;\n    line-height: 1.2;\n  }\n\n  .wrap {\n    width: var(--season-clock-card-size);\n    max-width: 100%;\n    aspect-ratio: 1;\n    margin: 0 auto;\n    filter:\n      drop-shadow(0 24px 42px var(--clock-shadow-deep))\n      drop-shadow(0 0 22px rgba(105, 174, 232, 0.08));\n  }\n\n  .clock {\n    display: block;\n    width: 100%;\n    height: 100%;\n    color: var(--season-clock-text);\n    font-family: var(--paper-font-body1_-_font-family, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif);\n  }\n\n  .clock-shadow {\n    fill: transparent;\n    stroke: rgba(236, 246, 252, 0.14);\n    stroke-width: 1.2;\n    filter: url(\"#dialInnerShadow\");\n  }\n\n  .outer-rim-glow {\n    fill: none;\n    stroke: rgba(145, 183, 210, 0.16);\n    stroke-width: 5;\n  }\n\n  .clock-face {\n    fill: url(\"#dialGradient\");\n    stroke: rgba(230, 241, 248, 0.16);\n    stroke-width: 1.2;\n  }\n\n  .dial-texture {\n    fill: none;\n    stroke: rgba(255, 255, 255, 0.035);\n    stroke-width: 16;\n    stroke-dasharray: 1 5;\n    opacity: 0.45;\n  }\n\n  .season-arc {\n    fill: none;\n    stroke-linecap: butt;\n    stroke-width: 22;\n    opacity: 0.97;\n    filter: url(\"#seasonLift\");\n  }\n\n  .ring-bevel {\n    fill: none;\n    stroke: rgba(0, 0, 0, 0.42);\n    stroke-width: 31;\n    filter: url(\"#seasonLift\");\n  }\n\n  .ring-inner-shadow,\n  .ring-outer-highlight {\n    fill: none;\n  }\n\n  .ring-inner-shadow {\n    stroke: rgba(0, 0, 0, 0.5);\n    stroke-width: 2.5;\n  }\n\n  .ring-outer-highlight {\n    stroke: rgba(255, 255, 255, 0.18);\n    stroke-width: 1.4;\n  }\n\n  .ring-guide {\n    fill: none;\n    stroke: rgba(218, 234, 244, 0.14);\n    stroke-width: 1;\n  }\n\n  .tick {\n    stroke: rgba(231, 241, 248, 0.18);\n    stroke-width: 0.7;\n    stroke-linecap: round;\n  }\n\n  .tick.month {\n    stroke: rgba(245, 249, 252, 0.76);\n    stroke-width: 1.7;\n  }\n\n  .month-names path {\n    fill: none;\n    stroke: none;\n  }\n\n  .month-name {\n    fill: rgba(255, 255, 255, 0.68);\n    font-size: 7.7px;\n    font-weight: 850;\n    letter-spacing: 1px;\n    text-anchor: middle;\n    dominant-baseline: middle;\n    pointer-events: none;\n    paint-order: stroke;\n    stroke: rgba(4, 12, 18, 0.52);\n    stroke-width: 1.8px;\n  }\n\n  .event-label,\n  .event-date {\n    text-anchor: middle;\n    dominant-baseline: middle;\n    letter-spacing: 0;\n  }\n\n  .event-line {\n    stroke: rgba(244, 248, 251, 0.72);\n    stroke-width: 1.3;\n    stroke-linecap: round;\n  }\n\n  .event-dot {\n    fill: #f7fbff;\n    stroke: rgba(4, 12, 18, 0.78);\n    stroke-width: 1;\n  }\n\n  .event-label {\n    fill: rgba(238, 245, 249, 0.9);\n    font-size: 7.2px;\n    font-weight: 760;\n    text-transform: uppercase;\n  }\n\n  .event-date {\n    fill: var(--season-clock-muted);\n    font-size: 7px;\n    font-weight: 650;\n  }\n\n  .progress-track {\n    fill: none;\n    stroke: rgba(255, 255, 255, 0.08);\n    stroke-width: 5;\n  }\n\n  .season-progress {\n    fill: none;\n    stroke-linecap: round;\n    stroke-width: 5;\n    opacity: 0.78;\n  }\n\n  .today-dot {\n    fill: #fff6cf;\n    stroke: rgba(5, 12, 18, 0.82);\n    stroke-width: 1.3;\n  }\n\n  .next-event-dot {\n    fill: rgba(255, 255, 255, 0.72);\n    stroke: rgba(5, 12, 18, 0.72);\n    stroke-width: 1;\n  }\n\n  .hand-shadow {\n    stroke: rgba(0, 0, 0, 0.68);\n    stroke-width: 6.4;\n    stroke-linecap: round;\n    filter: blur(0.25px);\n  }\n\n  .hand {\n    stroke: url(\"#handMetal\");\n    stroke-width: 4.1;\n    stroke-linecap: round;\n    filter: url(\"#handGlow\");\n  }\n\n  .hand-highlight {\n    stroke: rgba(255, 255, 255, 0.74);\n    stroke-width: 1.05;\n    stroke-linecap: round;\n  }\n\n  .moon-phase {\n    pointer-events: none;\n  }\n\n  .moon-badge {\n    fill: rgba(5, 12, 18, 0.84);\n    stroke: rgba(255, 250, 229, 0.72);\n    stroke-width: 1.2;\n  }\n\n  .moon-icon {\n    font-size: 14px;\n    text-anchor: middle;\n    dominant-baseline: middle;\n    alignment-baseline: central;\n  }\n\n  .pivot-halo {\n    fill: rgba(255, 255, 255, 0.14);\n    stroke: rgba(0, 0, 0, 0.38);\n    stroke-width: 1;\n  }\n\n  .pivot-shadow {\n    fill: rgba(0, 0, 0, 0.42);\n  }\n\n  .pivot {\n    fill: url(\"#pivotMetal\");\n    stroke: rgba(5, 12, 18, 0.78);\n    stroke-width: 1.2;\n  }\n\n  .pivot-highlight {\n    fill: rgba(255, 255, 255, 0.7);\n  }\n\n  .center-readout {\n    text-anchor: middle;\n    dominant-baseline: middle;\n  }\n\n  .complication {\n    pointer-events: none;\n  }\n\n  .complication-socket {\n    fill: rgba(0, 0, 0, 0.68);\n    stroke: rgba(255, 255, 255, 0.08);\n    stroke-width: 1;\n  }\n\n  .complication-socket-highlight {\n    fill: none;\n    stroke: rgba(255, 255, 255, 0.1);\n    stroke-width: 1.1;\n  }\n\n  .complication-shadow {\n    fill: rgba(0, 0, 0, 0.36);\n  }\n\n  .complication-face {\n    fill: url(\"#complicationFaceGradient\");\n    stroke: rgba(255, 255, 255, 0.62);\n    stroke-width: 1.1;\n    filter: url(\"#complicationInset\");\n  }\n\n  .complication-inner-shadow {\n    fill: none;\n    stroke: rgba(2, 8, 12, 0.24);\n    stroke-width: 5;\n  }\n\n  .complication-ring {\n    fill: none;\n    stroke-width: 1.15;\n    opacity: 0.76;\n  }\n\n  .complication-marker {\n    stroke-width: 1.2;\n    stroke-linecap: round;\n    opacity: 0.9;\n  }\n\n  .complication-title,\n  .complication-primary,\n  .complication-secondary {\n    text-anchor: middle;\n    dominant-baseline: middle;\n    letter-spacing: 0;\n  }\n\n  .complication-title {\n    fill: rgba(10, 20, 28, 0.8);\n    font-size: 7.8px;\n    font-weight: 820;\n    text-transform: uppercase;\n  }\n\n  .complication-primary {\n    font-size: 12.8px;\n    font-weight: 900;\n    paint-order: stroke;\n    stroke: rgba(239, 245, 246, 0.95);\n    stroke-width: 1px;\n  }\n\n  .complication-secondary {\n    fill: rgba(10, 20, 28, 0.68);\n    font-size: 8px;\n    font-weight: 720;\n  }\n\n  .emboss-shadow {\n    fill: rgba(255, 255, 255, 0.58);\n    stroke: none;\n  }\n\n  .place-complication .complication-primary,\n  .event-complication .complication-primary {\n    font-size: 10.4px;\n  }\n\n  .weather-complication .complication-primary {\n    font-size: 19px;\n    stroke-width: 0.7px;\n  }\n\n  .date-complication .complication-primary,\n  .season-complication .complication-primary {\n    font-size: 13.1px;\n  }\n\n  .clock-glass {\n    fill: url(\"#glassGradient\");\n    stroke: rgba(255, 255, 255, 0.12);\n    stroke-width: 1;\n    pointer-events: none;\n  }\n\n  .glass-sheen {\n    fill: none;\n    stroke: rgba(255, 255, 255, 0.16);\n    stroke-width: 7;\n    stroke-linecap: round;\n    opacity: 0.42;\n    pointer-events: none;\n  }\n", a = {
	Spring: "#7acb8b",
	Summer: "#e9bf52",
	Autumn: "#d77a4b",
	Winter: "#69aee8"
}, o = [
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
], s = [
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
], c = [
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
], l = [
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
], u = [
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
function d(e) {
	return e % 4 == 0 && e % 100 != 0 || e % 400 == 0;
}
function f(e) {
	let t = new Date(e.getFullYear(), 0, 0), n = e - t + (t.getTimezoneOffset() - e.getTimezoneOffset()) * 6e4;
	return Math.floor(n / 864e5);
}
function p(e) {
	return Array.from({ length: 12 }, (t, n) => f(new Date(e, n, 1)));
}
function m(e, t, n) {
	return e.map((r, i) => {
		let a = e[(i + 1) % e.length], o = f(new Date(t, r.month, r.day)), s = f(new Date(t, a.month, a.day)), c = s > o ? s : s + n;
		return {
			name: r.name,
			start: o,
			end: c
		};
	});
}
function h(e, t, n) {
	let r = t < e[0].start ? t + n : t;
	return e.find((e) => r >= e.start && r < e.end) || e[e.length - 1];
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
	location_source: "home",
	location_entity: "",
	weather_entity: "",
	location_name: "",
	latitude: null,
	longitude: null,
	hemisphere: "auto",
	card_size: 500,
	show_date: !0,
	show_day_number: !0,
	show_season_name: !0,
	show_location: !0,
	show_solstice_labels: !0,
	show_equinox_labels: !0,
	show_month_names: !0,
	show_month_markers: !0,
	show_day_ticks: !0,
	show_icons: !0,
	show_moon_phase: !0,
	show_weather: !0
}, C = [
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
], w = 250, T = {
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
}, E = class extends HTMLElement {
	constructor() {
		super(), this.attachShadow({ mode: "open" }), this._userConfig = {}, this._config = { ...S };
	}
	static getConfigElement() {
		return document.createElement("season-clock-card-editor");
	}
	static getStubConfig() {
		return { type: "custom:season-clock-card" };
	}
	setConfig(e) {
		this._userConfig = e || {}, this._config = {
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
      <style>${i}</style>
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
        ${this.renderSeasonArcs(e)}
        ${this.renderMonthNames(e)}
        ${this.renderTicks(e)}
        ${this.renderEventMarkers(e)}
        ${this.renderProgressLayer(e)}
        ${this.renderCenterReadout(e)}
        <circle class="clock-glass" cx="250" cy="250" r="207"></circle>
        <path class="glass-sheen" d="M 106 174 C 162 87 306 64 388 136"></path>
        <line class="hand-shadow" x1="250" y1="252" x2="${e.handPoint.x}" y2="${e.handPoint.y + 2}"></line>
        <line class="hand" x1="250" y1="250" x2="${e.handPoint.x}" y2="${e.handPoint.y}"></line>
        <line class="hand-highlight" x1="250" y1="250" x2="${e.handPoint.x}" y2="${e.handPoint.y}"></line>
        ${this.renderMoonPhase(e)}
        <circle class="pivot-shadow" cx="250" cy="253" r="12"></circle>
        <circle class="pivot-halo" cx="250" cy="250" r="11"></circle>
        <circle class="pivot" cx="250" cy="250" r="6.8"></circle>
        <circle class="pivot-highlight" cx="247.8" cy="247.3" r="2"></circle>
      </svg>
    `;
	}
	renderMoonPhase(e) {
		if (!this.booleanConfig("show_moon_phase")) return "";
		let t = v(w, _(e.dayOfYear, e.totalDays), T.moonRadius);
		return `
      <g class="moon-phase" aria-label="${this.escape(e.moonPhase.label)}">
        <circle class="moon-badge" cx="${t.x}" cy="${t.y}" r="12"></circle>
        <text class="moon-icon" x="${t.x}" y="${t.y}">${e.moonPhase.icon}</text>
      </g>
    `;
	}
	renderProgressLayer(e) {
		let t = e.currentSeason.start + (e.currentSeason.end - e.currentSeason.start) * (e.seasonProgress / 100), n = y(w, w, T.progressRadius, _(e.currentSeason.start, e.totalDays), _(t, e.totalDays)), r = v(w, _(e.dayOfYear, e.totalDays), T.todayRadius), i = v(w, _(e.nextEvent.dayOfYear, e.totalDays), T.todayRadius);
		return `
      <g class="progress-layer">
        <circle class="progress-track" cx="250" cy="250" r="${T.progressRadius}"></circle>
        <path class="season-progress" d="${n}" stroke="${a[e.currentSeason.name]}"></path>
        <circle class="next-event-dot" cx="${i.x}" cy="${i.y}" r="3.2"></circle>
        <circle class="today-dot" cx="${r.x}" cy="${r.y}" r="4.2"></circle>
      </g>
    `;
	}
	renderSeasonArcs(e) {
		return `<g class="season-arcs">${`
      <circle class="ring-bevel" cx="250" cy="250" r="${T.arcRadius}"></circle>
      <circle class="ring-inner-shadow" cx="250" cy="250" r="${T.arcRadius - 16}"></circle>
      <circle class="ring-outer-highlight" cx="250" cy="250" r="${T.arcRadius + 15}"></circle>
      <circle class="ring-guide" cx="250" cy="250" r="${T.arcRadius + 12}"></circle>
      <circle class="ring-guide" cx="250" cy="250" r="${T.arcRadius - 12}"></circle>
    `}${e.segments.map((t) => `
      <path class="season-arc" d="${y(w, w, T.arcRadius, _(t.start, e.totalDays), _(t.end, e.totalDays))}" stroke="${a[t.name]}"></path>
    `).join("")}</g>`;
	}
	renderMonthNames(e) {
		return this.booleanConfig("show_month_names") ? `<g class="month-names">${C.map((t, n) => {
			let r = f(new Date(e.year, n, 1)), i = n === 11 ? e.totalDays + 1 : f(new Date(e.year, n + 1, 1)), a = `season-clock-month-${n}`;
			return `
        <path id="${a}" d="${this.describeTextArc(T.monthNameRadius, _(r + 1.5, e.totalDays), _(i - 1.5, e.totalDays))}"></path>
        <text class="month-name">
          <textPath href="#${a}" startOffset="50%">${t}</textPath>
        </text>
      `;
		}).join("")}</g>` : "";
	}
	renderTicks(e) {
		let t = this.booleanConfig("show_day_ticks"), n = this.booleanConfig("show_month_markers");
		if (!t && !n) return "";
		let r = new Set(p(e.year)), i = [];
		for (let a = 1; a <= e.totalDays; a += 1) {
			let o = r.has(a);
			if (o && !n || !o && !t) continue;
			let s = _(a, e.totalDays), c = v(w, s, o ? T.monthTickInner : T.dayTickInner), l = v(w, s, T.tickOuter);
			i.push(`<line class="tick${o ? " month" : ""}" x1="${c.x}" y1="${c.y}" x2="${l.x}" y2="${l.y}"></line>`);
		}
		return `<g class="ticks">${i.join("")}</g>`;
	}
	renderEventMarkers(e) {
		return `<g class="event-markers">${e.events.filter((e) => this.shouldShowEvent(e)).map((t) => {
			let n = _(f(new Date(e.year, t.month, t.day)), e.totalDays), r = v(w, n, T.eventInner), i = v(w, n, T.eventOuter), a = v(w, n, T.eventLabel);
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
        <tspan class="event-date" x="${t.x}" dy="9">${e.day} ${o[e.month].toUpperCase()}</tspan>
      </text>
    `;
	}
	renderCenterReadout(e) {
		let t = [], n = this.booleanConfig("show_date"), r = this.booleanConfig("show_day_number"), i = this.booleanConfig("show_season_name"), o = this.booleanConfig("show_location"), s = this.booleanConfig("show_weather") && e.weatherInfo;
		if ((n || r) && t.push(this.renderComplication({
			className: "date-complication",
			x: 250,
			y: 166,
			radius: 40,
			title: n ? e.weekday : "Year Day",
			primary: n ? e.dateShort : `Day ${e.dayOfYear}`,
			secondary: r ? `${e.dayOfYear}/${e.totalDays}` : "",
			accent: "#f1c84e"
		})), i && (t.push(this.renderComplication({
			className: "season-complication",
			x: 166,
			y: 250,
			radius: 40,
			title: e.currentSeason.name,
			primary: `${e.seasonProgress}%`,
			secondary: "complete",
			accent: a[e.currentSeason.name]
		})), t.push(this.renderComplication({
			className: "event-complication",
			x: 334,
			y: 250,
			radius: 40,
			title: "Next",
			primary: this.formatEventShortLabel(e.nextEvent),
			secondary: `${e.nextEvent.daysUntil} ${e.nextEvent.daysUntil === 1 ? "day" : "days"}`,
			accent: a[e.nextEvent.name]
		}))), s) t.push(this.renderComplication({
			className: "weather-complication",
			x: 250,
			y: 334,
			radius: 40,
			title: "Weather",
			primary: e.weatherInfo.icon,
			secondary: e.weatherInfo.temperature,
			accent: "#69aee8"
		}));
		else if (o) {
			let n = e.hemisphere === "north" ? "Northern" : "Southern";
			t.push(this.renderComplication({
				className: "place-complication",
				x: 250,
				y: 334,
				radius: 40,
				title: n,
				primary: this.truncate(e.locationName, 9),
				secondary: "Hemisphere",
				accent: "#dfe8ee"
			}));
		}
		return `<g class="center-readout" aria-hidden="true">${t.join("")}</g>`;
	}
	renderComplication({ className: e, x: t, y: n, radius: r, title: i, primary: a, secondary: o, accent: s }) {
		let c = this.escape(s || "#dfe8ee");
		return `
      <g class="complication ${e}">
        <circle class="complication-socket" cx="${t}" cy="${n}" r="${r + 7}"></circle>
        <circle class="complication-socket-highlight" cx="${t - 1.4}" cy="${n - 1.4}" r="${r + 5}"></circle>
        <circle class="complication-shadow" cx="${t + 1.8}" cy="${n + 2.4}" r="${r + 1}"></circle>
        <circle class="complication-face" cx="${t}" cy="${n}" r="${r}"></circle>
        <circle class="complication-inner-shadow" cx="${t}" cy="${n}" r="${r - 4}"></circle>
        <circle class="complication-ring" cx="${t}" cy="${n}" r="${r - 3}" stroke="${c}"></circle>
        <line class="complication-marker" x1="${t}" y1="${n - r + 8}" x2="${t}" y2="${n - r + 15}" stroke="${c}"></line>
        <text class="complication-title emboss-shadow" x="${t}" y="${n - 14.5}">${this.escape(this.truncate(i, 10))}</text>
        <text class="complication-title" x="${t}" y="${n - 15}">${this.escape(this.truncate(i, 10))}</text>
        <text class="complication-primary emboss-shadow" x="${t}" y="${n + 3.5}" fill="${c}">${this.escape(a)}</text>
        <text class="complication-primary" x="${t}" y="${n + 3}" fill="${c}">${this.escape(a)}</text>
        ${o ? `
          <text class="complication-secondary emboss-shadow" x="${t}" y="${n + 19.5}">${this.escape(o)}</text>
          <text class="complication-secondary" x="${t}" y="${n + 19}">${this.escape(o)}</text>
        ` : ""}
      </g>
    `;
	}
	truncate(e, t) {
		let n = String(e || "");
		return n.length <= t ? n : `${n.slice(0, Math.max(0, t - 1))}…`;
	}
	formatEventShortLabel(e) {
		return e.label.toLowerCase().includes("solstice") ? "Solstice" : "Equinox";
	}
	getClockModel() {
		let e = /* @__PURE__ */ new Date(), t = e.getFullYear(), n = d(t) ? 366 : 365, r = f(e), i = this.getLocation(), a = g(this._config.hemisphere, i.latitude), o = a === "north" ? s : c, p = m(a === "north" ? l : u, t, n), y = h(p, r, n);
		return {
			year: t,
			totalDays: n,
			dayOfYear: r,
			hemisphere: a,
			events: o,
			segments: p,
			currentSeason: y,
			seasonProgress: this.getSeasonProgress(y, r, n),
			nextEvent: this.getNextEvent(o, t, r, n),
			moonPhase: this.getMoonPhase(e),
			locationName: i.name,
			weather: this.getWeather(),
			weatherInfo: this.getWeatherInfo(),
			handPoint: v(w, _(r, n), T.handLength),
			weekday: new Intl.DateTimeFormat(void 0, { weekday: "long" }).format(e),
			dateShort: new Intl.DateTimeFormat(void 0, {
				day: "numeric",
				month: "short"
			}).format(e),
			dateLabel: new Intl.DateTimeFormat(void 0, {
				day: "numeric",
				month: "long",
				year: "numeric"
			}).format(e)
		};
	}
	getSeasonProgress(e, t, n) {
		let r = t < e.start ? t + n : t, i = Math.max(0, r - e.start + 1);
		return Math.min(100, Math.max(1, Math.round(i / (e.end - e.start) * 100)));
	}
	getNextEvent(e, t, n, r) {
		let i = e.map((e) => {
			let i = f(new Date(t, e.month, e.day)), a = i >= n ? i - n : i + r - n;
			return {
				...e,
				dayOfYear: i,
				daysUntil: a,
				shortLabel: e.label.replace("Spring ", "").replace("Summer ", "").replace("Autumn ", "").replace("Winter ", "")
			};
		});
		return i.sort((e, t) => e.daysUntil - t.daysUntil), i[0];
	}
	getMoonPhase(e) {
		let t = [
			{
				icon: "🌑",
				label: "New Moon"
			},
			{
				icon: "🌒",
				label: "Waxing Crescent"
			},
			{
				icon: "🌓",
				label: "First Quarter"
			},
			{
				icon: "🌔",
				label: "Waxing Gibbous"
			},
			{
				icon: "🌕",
				label: "Full Moon"
			},
			{
				icon: "🌖",
				label: "Waning Gibbous"
			},
			{
				icon: "🌗",
				label: "Last Quarter"
			},
			{
				icon: "🌘",
				label: "Waning Crescent"
			}
		], n = 29.530588853, r = ((e.getTime() / 864e5 + 2440587.5 - 2451550.1) % n + n) % n;
		return {
			...t[Math.floor(r / n * t.length + .5) % t.length],
			age: Math.round(r * 10) / 10,
			illumination: Math.round((1 - Math.cos(2 * Math.PI * r / n)) / 2 * 100)
		};
	}
	getLatitude() {
		return this.getLocation().latitude;
	}
	getLocation() {
		let e = this._config.location_source || "home";
		if (e === "entity") {
			let e = this.getEntityLocation();
			if (e) return e;
		}
		if (e === "manual") {
			let e = this.getManualLocation();
			if (e) return e;
		}
		return this.getHomeLocation();
	}
	getHomeLocation() {
		return {
			latitude: Number(this._hass?.config?.latitude ?? S.latitude ?? 37.323),
			longitude: Number(this._hass?.config?.longitude ?? S.longitude ?? -122.0322),
			name: this.getConfiguredLocationName() || this._hass?.config?.location_name || "Home"
		};
	}
	getManualLocation() {
		let e = Number(this._config.latitude), t = Number(this._config.longitude);
		return !Number.isFinite(e) || !Number.isFinite(t) ? null : {
			latitude: e,
			longitude: t,
			name: this.getConfiguredLocationName() || "Manual location"
		};
	}
	getEntityLocation() {
		let e = this._config.location_entity, t = e ? this._hass?.states?.[e] : null;
		if (!t) return null;
		let n = t.attributes || {}, r = Number(n.latitude ?? n.lat), i = Number(n.longitude ?? n.lon ?? n.lng);
		return !Number.isFinite(r) || !Number.isFinite(i) ? null : {
			latitude: r,
			longitude: i,
			name: this.getConfiguredLocationName() || n.friendly_name || e
		};
	}
	getConfiguredLocationName() {
		let e = this._userConfig?.location_name;
		return typeof e == "string" && e.trim() ? e.trim() : "";
	}
	getWeather() {
		let e = this.getWeatherInfo();
		return e ? [e.condition, e.temperature].filter(Boolean).join(" · ") : "";
	}
	getWeatherInfo() {
		let e = this._config.weather_entity, t = e ? this._hass?.states?.[e] : null;
		if (!t) return null;
		let n = t.attributes || {}, r = n.temperature_unit || this._hass?.config?.unit_system?.temperature || "", i = this.formatTemperature(n.temperature, r), a = this.formatCondition(t.state);
		return !a && !i ? null : {
			condition: a,
			temperature: i,
			icon: this.getWeatherIcon(t.state)
		};
	}
	formatTemperature(e, t) {
		let n = Number(e);
		return Number.isFinite(n) ? `${Math.round(n)}${t}` : "";
	}
	formatCondition(e) {
		return !e || e === "unknown" || e === "unavailable" ? "" : {
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
		}[e] || String(e).replaceAll("_", " ").replaceAll("-", " ").replace(/\b\w/g, (e) => e.toUpperCase());
	}
	getWeatherIcon(e) {
		return {
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
		}[e] || "○";
	}
	describeTextArc(e, t, n) {
		let r = v(w, t, e), i = v(w, n, e), a = (n <= t ? n + 360 : n) - t <= 180 ? "0" : "1";
		return [
			"M",
			r.x,
			r.y,
			"A",
			e,
			e,
			0,
			a,
			1,
			i.x,
			i.y
		].join(" ");
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
customElements.define("season-clock-card", E), window.customCards = window.customCards || [], window.customCards.push({
	type: "season-clock-card",
	name: "Season Clock Card",
	description: "A location-aware seasonal year clock for Home Assistant dashboards."
});
//#endregion
