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
			show_weather: "Weather",
			weather_entity: "Weather entity"
		}[e.name] || e.name?.replaceAll("_", " ") || "";
	}
};
customElements.define("season-clock-card-editor", r);
//#endregion
//#region src/styles.js
var i = "\n  :host {\n    display: block;\n    --season-clock-card-size: min(var(--season-clock-size, 500px), 100%);\n    --season-clock-text: #f3f8fc;\n    --season-clock-muted: #a7b6c1;\n    --season-clock-subtle: #6f8190;\n  }\n\n  ha-card {\n    display: block;\n    overflow: hidden;\n    border-radius: var(--ha-card-border-radius, 8px);\n    background: transparent;\n    border: 0;\n    box-shadow: none;\n  }\n\n  .header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 12px;\n    padding: 14px 16px 0;\n  }\n\n  .title {\n    color: var(--primary-text-color, var(--season-clock-text));\n    font-size: 15px;\n    font-weight: 700;\n    line-height: 1.2;\n  }\n\n  .wrap {\n    width: var(--season-clock-card-size);\n    max-width: 100%;\n    aspect-ratio: 1;\n    margin: 0 auto;\n  }\n\n  .clock {\n    display: block;\n    width: 100%;\n    height: 100%;\n    color: var(--season-clock-text);\n    font-family: var(--paper-font-body1_-_font-family, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif);\n  }\n\n  .clock-shadow {\n    fill: transparent;\n    stroke: rgba(205, 226, 240, 0.12);\n    stroke-width: 1;\n  }\n\n  .clock-face {\n    fill: transparent;\n    stroke: rgba(211, 228, 239, 0.16);\n    stroke-width: 1;\n  }\n\n  .season-arc {\n    fill: none;\n    stroke-linecap: butt;\n    stroke-width: 22;\n    opacity: 0.94;\n  }\n\n  .ring-guide {\n    fill: none;\n    stroke: rgba(218, 234, 244, 0.14);\n    stroke-width: 1;\n  }\n\n  .tick {\n    stroke: rgba(231, 241, 248, 0.18);\n    stroke-width: 0.7;\n    stroke-linecap: round;\n  }\n\n  .tick.month {\n    stroke: rgba(245, 249, 252, 0.76);\n    stroke-width: 1.7;\n  }\n\n  .month-names path {\n    fill: none;\n    stroke: none;\n  }\n\n  .month-name {\n    fill: rgba(255, 255, 255, 0.68);\n    font-size: 7.7px;\n    font-weight: 850;\n    letter-spacing: 1px;\n    text-anchor: middle;\n    dominant-baseline: middle;\n    pointer-events: none;\n    paint-order: stroke;\n    stroke: rgba(4, 12, 18, 0.52);\n    stroke-width: 1.8px;\n  }\n\n  .season-label,\n  .event-label,\n  .event-date {\n    text-anchor: middle;\n    dominant-baseline: middle;\n    letter-spacing: 0;\n  }\n\n  .season-label {\n    font-size: 9px;\n    font-weight: 760;\n  }\n\n  .season-label .season-icon {\n    font-size: 11px;\n    font-weight: 600;\n  }\n\n  .event-line {\n    stroke: rgba(244, 248, 251, 0.72);\n    stroke-width: 1.3;\n    stroke-linecap: round;\n  }\n\n  .event-dot {\n    fill: #f7fbff;\n    stroke: rgba(4, 12, 18, 0.78);\n    stroke-width: 1;\n  }\n\n  .event-label {\n    fill: rgba(238, 245, 249, 0.9);\n    font-size: 7.2px;\n    font-weight: 760;\n    text-transform: uppercase;\n  }\n\n  .event-date {\n    fill: var(--season-clock-muted);\n    font-size: 7px;\n    font-weight: 650;\n  }\n\n  .progress-track {\n    fill: none;\n    stroke: rgba(255, 255, 255, 0.08);\n    stroke-width: 5;\n  }\n\n  .season-progress {\n    fill: none;\n    stroke-linecap: round;\n    stroke-width: 5;\n    opacity: 0.78;\n  }\n\n  .today-dot {\n    fill: #fff6cf;\n    stroke: rgba(5, 12, 18, 0.82);\n    stroke-width: 1.3;\n  }\n\n  .next-event-dot {\n    fill: rgba(255, 255, 255, 0.72);\n    stroke: rgba(5, 12, 18, 0.72);\n    stroke-width: 1;\n  }\n\n  .hand {\n    stroke: rgba(255, 250, 229, 0.82);\n    stroke-width: 2.2;\n    stroke-linecap: round;\n    filter: url(\"#handGlow\");\n  }\n\n  .pivot-halo {\n    fill: rgba(255, 255, 255, 0.12);\n  }\n\n  .pivot {\n    fill: #f7fbff;\n    stroke: rgba(5, 12, 18, 0.75);\n    stroke-width: 1.2;\n  }\n\n  .center-readout {\n    text-anchor: middle;\n    dominant-baseline: middle;\n  }\n\n  .weekday {\n    fill: var(--season-clock-muted);\n    font-size: 11px;\n    font-weight: 650;\n  }\n\n  .date {\n    fill: var(--season-clock-text);\n    font-size: 15px;\n    font-weight: 760;\n  }\n\n  .day-text {\n    fill: #f1c84e;\n    font-size: 17px;\n    font-weight: 850;\n  }\n\n  .season-text {\n    font-size: 17px;\n    font-weight: 780;\n  }\n\n  .hemisphere,\n  .location,\n  .season-progress-text,\n  .next-event,\n  .weather {\n    fill: var(--season-clock-muted);\n    font-size: 10.5px;\n    font-weight: 600;\n  }\n\n  .location,\n  .next-event,\n  .weather {\n    fill: var(--season-clock-subtle);\n  }\n", a = {
	Spring: "#7acb8b",
	Summer: "#e9bf52",
	Autumn: "#d77a4b",
	Winter: "#69aee8"
}, o = {
	Spring: "🌱",
	Summer: "☀️",
	Autumn: "🍂",
	Winter: "❄️"
}, s = [
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
], c = [
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
], l = [
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
], u = [
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
], d = [
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
function f(e) {
	return e % 4 == 0 && e % 100 != 0 || e % 400 == 0;
}
function p(e) {
	let t = new Date(e.getFullYear(), 0, 0), n = e - t + (t.getTimezoneOffset() - e.getTimezoneOffset()) * 6e4;
	return Math.floor(n / 864e5);
}
function m(e) {
	return Array.from({ length: 12 }, (t, n) => p(new Date(e, n, 1)));
}
function h(e, t, n) {
	return e.map((r, i) => {
		let a = e[(i + 1) % e.length], o = p(new Date(t, r.month, r.day)), s = p(new Date(t, a.month, a.day)), c = s > o ? s : s + n;
		return {
			name: r.name,
			start: o,
			end: c
		};
	});
}
function g(e, t, n) {
	let r = t < e[0].start ? t + n : t;
	return e.find((e) => r >= e.start && r < e.end) || e[e.length - 1];
}
function _(e, t, n) {
	let r = e + (t - e) / 2;
	return r > n ? r - n : r;
}
function v(e, t) {
	return e === "northern" || e === "north" ? "north" : e === "southern" || e === "south" || Number(t) < 0 ? "south" : "north";
}
function y(e, t) {
	return (e - 1) / t * 360 - 90;
}
function b(e, t, n) {
	let r = t * Math.PI / 180;
	return {
		x: C(e + n * Math.cos(r)),
		y: C(e + n * Math.sin(r))
	};
}
function x(e, t, n, r, i) {
	let a = i <= r ? i + 360 : i, o = S(e, t, n, a), s = S(e, t, n, r), c = a - r <= 180 ? "0" : "1";
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
function S(e, t, n, r) {
	let i = r * Math.PI / 180;
	return {
		x: C(e + n * Math.cos(i)),
		y: C(t + n * Math.sin(i))
	};
}
function C(e) {
	return Math.round(e * 100) / 100;
}
//#endregion
//#region src/season-clock-card.js
var w = {
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
	show_weather: !0
}, T = [
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
], E = 250, D = {
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
	handLength: 166
}, O = class extends HTMLElement {
	constructor() {
		super(), this.attachShadow({ mode: "open" }), this._userConfig = {}, this._config = { ...w };
	}
	static getConfigElement() {
		return document.createElement("season-clock-card-editor");
	}
	static getStubConfig() {
		return { type: "custom:season-clock-card" };
	}
	setConfig(e) {
		this._userConfig = e || {}, this._config = {
			...w,
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
        ${this.renderMonthNames(e)}
        ${this.renderTicks(e)}
        ${this.renderEventMarkers(e)}
        ${this.renderSeasonLabels(e)}
        ${this.renderProgressLayer(e)}
        <line class="hand" x1="250" y1="250" x2="${e.handPoint.x}" y2="${e.handPoint.y}"></line>
        <circle class="pivot-halo" cx="250" cy="250" r="11"></circle>
        <circle class="pivot" cx="250" cy="250" r="5.5"></circle>
        ${this.renderCenterReadout(e)}
      </svg>
    `;
	}
	renderProgressLayer(e) {
		let t = e.currentSeason.start + (e.currentSeason.end - e.currentSeason.start) * (e.seasonProgress / 100), n = x(E, E, D.progressRadius, y(e.currentSeason.start, e.totalDays), y(t, e.totalDays)), r = b(E, y(e.dayOfYear, e.totalDays), D.todayRadius), i = b(E, y(e.nextEvent.dayOfYear, e.totalDays), D.todayRadius);
		return `
      <g class="progress-layer">
        <circle class="progress-track" cx="250" cy="250" r="${D.progressRadius}"></circle>
        <path class="season-progress" d="${n}" stroke="${a[e.currentSeason.name]}"></path>
        <circle class="next-event-dot" cx="${i.x}" cy="${i.y}" r="3.2"></circle>
        <circle class="today-dot" cx="${r.x}" cy="${r.y}" r="4.2"></circle>
      </g>
    `;
	}
	renderSeasonArcs(e) {
		return `<g class="season-arcs">${`
      <circle class="ring-guide" cx="250" cy="250" r="${D.arcRadius + 12}"></circle>
      <circle class="ring-guide" cx="250" cy="250" r="${D.arcRadius - 12}"></circle>
    `}${e.segments.map((t) => `
      <path class="season-arc" d="${x(E, E, D.arcRadius, y(t.start, e.totalDays), y(t.end, e.totalDays))}" stroke="${a[t.name]}"></path>
    `).join("")}</g>`;
	}
	renderMonthNames(e) {
		return this.booleanConfig("show_month_names") ? `<g class="month-names">${T.map((t, n) => {
			let r = p(new Date(e.year, n, 1)), i = n === 11 ? e.totalDays + 1 : p(new Date(e.year, n + 1, 1)), a = `season-clock-month-${n}`;
			return `
        <path id="${a}" d="${this.describeTextArc(D.monthNameRadius, y(r + 1.5, e.totalDays), y(i - 1.5, e.totalDays))}"></path>
        <text class="month-name">
          <textPath href="#${a}" startOffset="50%">${t}</textPath>
        </text>
      `;
		}).join("")}</g>` : "";
	}
	renderTicks(e) {
		let t = this.booleanConfig("show_day_ticks"), n = this.booleanConfig("show_month_markers");
		if (!t && !n) return "";
		let r = new Set(m(e.year)), i = [];
		for (let a = 1; a <= e.totalDays; a += 1) {
			let o = r.has(a);
			if (o && !n || !o && !t) continue;
			let s = y(a, e.totalDays), c = b(E, s, o ? D.monthTickInner : D.dayTickInner), l = b(E, s, D.tickOuter);
			i.push(`<line class="tick${o ? " month" : ""}" x1="${c.x}" y1="${c.y}" x2="${l.x}" y2="${l.y}"></line>`);
		}
		return `<g class="ticks">${i.join("")}</g>`;
	}
	renderEventMarkers(e) {
		return `<g class="event-markers">${e.events.filter((e) => this.shouldShowEvent(e)).map((t) => {
			let n = y(p(new Date(e.year, t.month, t.day)), e.totalDays), r = b(E, n, D.eventInner), i = b(E, n, D.eventOuter), a = b(E, n, D.eventLabel);
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
        <tspan class="event-date" x="${t.x}" dy="9">${e.day} ${s[e.month].toUpperCase()}</tspan>
      </text>
    `;
	}
	renderSeasonLabels(e) {
		return this.booleanConfig("show_season_name") ? `<g class="season-labels">${e.segments.map((t) => {
			let n = b(E, y(_(t.start, t.end, e.totalDays), e.totalDays), D.seasonLabel), r = this.booleanConfig("show_icons") ? `<tspan class="season-icon">${o[t.name]} </tspan>` : "";
			return `
        <text class="season-label" x="${n.x}" y="${n.y}" fill="${a[t.name]}">
          ${r}<tspan>${t.name}</tspan>
        </text>
      `;
		}).join("")}</g>` : "";
	}
	renderCenterReadout(e) {
		let t = [];
		if (this.booleanConfig("show_date") && (t.push({
			className: "weekday",
			text: e.weekday
		}), t.push({
			className: "date",
			text: e.dateLabel
		})), this.booleanConfig("show_day_number") && t.push({
			className: "day-text",
			text: `Day ${e.dayOfYear} of ${e.totalDays}`
		}), this.booleanConfig("show_season_name")) {
			let n = this.booleanConfig("show_icons") ? `${o[e.currentSeason.name]} ` : "";
			t.push({
				className: "season-text",
				fill: a[e.currentSeason.name],
				text: `${n}${e.currentSeason.name}`
			}), t.push({
				className: "season-progress-text",
				text: `${e.seasonProgress}% through ${e.currentSeason.name}`
			}), t.push({
				className: "next-event",
				text: `${e.nextEvent.shortLabel} in ${e.nextEvent.daysUntil} ${e.nextEvent.daysUntil === 1 ? "day" : "days"}`
			});
		}
		this.booleanConfig("show_location") && (t.push({
			className: "hemisphere",
			text: e.hemisphere === "north" ? "Northern Hemisphere" : "Southern Hemisphere"
		}), t.push({
			className: "location",
			text: e.locationName
		})), this.booleanConfig("show_weather") && e.weather && t.push({
			className: "weather",
			text: e.weather
		});
		let n = t.length > 7 ? 18.5 : 21, r = 250 - (t.length - 1) * n / 2;
		return `<g class="center-readout" aria-hidden="true">${t.map((e, t) => {
			let i = e.fill ? ` fill="${e.fill}"` : "";
			return `<text class="${e.className}" x="250" y="${r + t * n}"${i}>${this.escape(e.text)}</text>`;
		}).join("")}</g>`;
	}
	getClockModel() {
		let e = /* @__PURE__ */ new Date(), t = e.getFullYear(), n = f(t) ? 366 : 365, r = p(e), i = this.getLocation(), a = v(this._config.hemisphere, i.latitude), o = a === "north" ? c : l, s = h(a === "north" ? u : d, t, n), m = g(s, r, n);
		return {
			year: t,
			totalDays: n,
			dayOfYear: r,
			hemisphere: a,
			events: o,
			segments: s,
			currentSeason: m,
			seasonProgress: this.getSeasonProgress(m, r, n),
			nextEvent: this.getNextEvent(o, t, r, n),
			locationName: i.name,
			weather: this.getWeather(),
			handPoint: b(E, y(r, n), D.handLength),
			weekday: new Intl.DateTimeFormat(void 0, { weekday: "long" }).format(e),
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
			let i = p(new Date(t, e.month, e.day)), a = i >= n ? i - n : i + r - n;
			return {
				...e,
				dayOfYear: i,
				daysUntil: a,
				shortLabel: e.label.replace("Spring ", "").replace("Summer ", "").replace("Autumn ", "").replace("Winter ", "")
			};
		});
		return i.sort((e, t) => e.daysUntil - t.daysUntil), i[0];
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
			latitude: Number(this._hass?.config?.latitude ?? w.latitude ?? 37.323),
			longitude: Number(this._hass?.config?.longitude ?? w.longitude ?? -122.0322),
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
		let e = this._config.weather_entity, t = e ? this._hass?.states?.[e] : null;
		if (!t) return "";
		let n = t.attributes || {}, r = n.temperature_unit || this._hass?.config?.unit_system?.temperature || "", i = this.formatTemperature(n.temperature, r), a = Array.isArray(n.forecast) ? n.forecast[0] : null, o = this.formatTemperature(n.temperature_high ?? n.high_temperature ?? n.high ?? a?.temperature, r), s = this.formatTemperature(n.temperature_low ?? n.low_temperature ?? n.low ?? n.templow ?? a?.templow ?? a?.low_temperature, r), c = [this.formatCondition(t.state), i].filter(Boolean), l = o && s ? `${o}/${s}` : o || s;
		return l && c.push(`H/L ${l}`), c.join(" · ");
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
	describeTextArc(e, t, n) {
		let r = b(E, t, e), i = b(E, n, e), a = (n <= t ? n + 360 : n) - t <= 180 ? "0" : "1";
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
customElements.define("season-clock-card", O), window.customCards = window.customCards || [], window.customCards.push({
	type: "season-clock-card",
	name: "Season Clock Card",
	description: "A location-aware seasonal year clock for Home Assistant dashboards."
});
//#endregion
