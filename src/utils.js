export const SEASON_COLORS = {
  Spring: "#7acb8b",
  Summer: "#e9bf52",
  Autumn: "#d77a4b",
  Winter: "#69aee8"
};

export const SEASON_ICONS = {
  Spring: "🌱",
  Summer: "☀️",
  Autumn: "🍂",
  Winter: "❄️"
};

export const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const NORTHERN_EVENTS = [
  { name: "Spring", label: "Spring Equinox", month: 2, day: 20 },
  { name: "Summer", label: "Summer Solstice", month: 5, day: 21 },
  { name: "Autumn", label: "Autumn Equinox", month: 8, day: 22 },
  { name: "Winter", label: "Winter Solstice", month: 11, day: 21 }
];

export const SOUTHERN_EVENTS = [
  { name: "Autumn", label: "Autumn Equinox", month: 2, day: 20 },
  { name: "Winter", label: "Winter Solstice", month: 5, day: 21 },
  { name: "Spring", label: "Spring Equinox", month: 8, day: 22 },
  { name: "Summer", label: "Summer Solstice", month: 11, day: 21 }
];

export const NORTHERN_SEASON_STARTS = [
  { name: "Spring", month: 2, day: 1 },
  { name: "Summer", month: 5, day: 1 },
  { name: "Autumn", month: 8, day: 1 },
  { name: "Winter", month: 11, day: 1 }
];

export const SOUTHERN_SEASON_STARTS = [
  { name: "Autumn", month: 2, day: 1 },
  { name: "Winter", month: 5, day: 1 },
  { name: "Spring", month: 8, day: 1 },
  { name: "Summer", month: 11, day: 1 }
];

export function isLeapYear(targetYear) {
  return (targetYear % 4 === 0 && targetYear % 100 !== 0) || targetYear % 400 === 0;
}

export function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000);
  return Math.floor(diff / 86400000);
}

export function getMonthStartDays(targetYear) {
  return Array.from({ length: 12 }, (_, month) => getDayOfYear(new Date(targetYear, month, 1)));
}

export function buildSeasonSegments(events, year, totalDays) {
  return events.map((event, index) => {
    const next = events[(index + 1) % events.length];
    const start = getDayOfYear(new Date(year, event.month, event.day));
    const nextStart = getDayOfYear(new Date(year, next.month, next.day));
    const end = nextStart > start ? nextStart : nextStart + totalDays;
    return {
      name: event.name,
      start,
      end
    };
  });
}

export function getCurrentSeason(segments, dayOfYear, totalDays) {
  const wrappedDay = dayOfYear < segments[0].start ? dayOfYear + totalDays : dayOfYear;
  return segments.find((segment) => wrappedDay >= segment.start && wrappedDay < segment.end) || segments[segments.length - 1];
}

export function getMidpointDay(start, end, totalDays) {
  const midpoint = start + ((end - start) / 2);
  return midpoint > totalDays ? midpoint - totalDays : midpoint;
}

export function normalizeHemisphere(value, latitude) {
  if (value === "northern" || value === "north") {
    return "north";
  }
  if (value === "southern" || value === "south") {
    return "south";
  }
  return Number(latitude) < 0 ? "south" : "north";
}

export function dayToAngle(day, totalDays) {
  return ((day - 1) / totalDays) * 360 - 90;
}

export function pointAt(center, angle, radius) {
  const radians = angle * Math.PI / 180;
  return {
    x: round(center + radius * Math.cos(radians)),
    y: round(center + radius * Math.sin(radians))
  };
}

export function describeArc(x, y, radius, startAngle, endAngle) {
  const normalizedEnd = endAngle <= startAngle ? endAngle + 360 : endAngle;
  const start = polarToCartesian(x, y, radius, normalizedEnd);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = normalizedEnd - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
}

export function polarToCartesian(x, y, radius, angle) {
  const radians = angle * Math.PI / 180;
  return {
    x: round(x + radius * Math.cos(radians)),
    y: round(y + radius * Math.sin(radians))
  };
}

export function round(value) {
  return Math.round(value * 100) / 100;
}
