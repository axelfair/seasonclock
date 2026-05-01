<p align="center">
  <img src="https://raw.githubusercontent.com/axelfair/seasonclock/main/assets/logo.svg" alt="Season Clock Card" width="520">
</p>

# Season Clock Card

Season Clock Card is a Home Assistant Lovelace card that shows a clean, location-aware seasonal year clock. It is designed to feel like a polished dashboard widget rather than an infographic.

<p align="center">
  <img src="https://raw.githubusercontent.com/axelfair/seasonclock/main/assets/preview.png" alt="Season Clock Card preview" width="500">
</p>

## Features

- Circular seasonal year clock with spring, summer, autumn, and winter segments.
- Fully configurable clock-face elements via YAML.
- Location-aware Northern/Southern Hemisphere support.
- Solstice and equinox markers.
- Daily ticks and monthly markers.
- Compact centre readout for date, day-of-year, season, hemisphere, and location.
- Configurable card size and display options.
- HACS custom dashboard repository ready.

## Installation

### HACS Custom Repository Installation

The GitHub repository URL is:

```text
https://github.com/axelfair/seasonclock
```

1. Open Home Assistant.
2. Go to HACS.
3. Open the three-dot menu.
4. Select Custom repositories.
5. Paste the GitHub repository URL.
6. Set category to Dashboard.
7. Click Add.
8. Search for Season Clock Card.
9. Install.
10. Restart Home Assistant or refresh frontend resources if required.

HACS custom repository installation should point to the GitHub repo URL above.

### Manual Installation

Copy:

```text
dist/seasonclock.js
```

to:

```text
/config/www/community/season-clock-card/seasonclock.js
```

Then add the Lovelace resource:

URL:

```text
/local/community/season-clock-card/seasonclock.js
```

Type:

```text
JavaScript module
```

## Example Lovelace YAML

```yaml
type: custom:season-clock-card
show_location: false
show_solstice_labels: false
show_equinox_labels: false
```

Fully customised example:

```yaml
type: custom:season-clock-card
title: Season Clock
location_source: home
weather_entity: weather.home
location_name: Cupertino, California
latitude: 37.323
longitude: -122.0322
hemisphere: northern
card_size: 500
show_date: true
show_day_number: true
show_season_name: true
show_location: true
show_solstice_labels: true
show_equinox_labels: true
show_month_names: true
show_month_markers: true
show_day_ticks: true
show_icons: true
show_weather: true
```

## Configuration Reference

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | string | required | Must be `custom:season-clock-card`. |
| `title` | string | empty | Optional card title shown above the clock. |
| `location_source` | string | `home` | `home`, `entity`, or `manual`. |
| `location_entity` | string | empty | Entity with `latitude` and `longitude` attributes when `location_source: entity`. |
| `weather_entity` | string | empty | Weather entity used to show current weather, temperature, and high/low when available. |
| `location_name` | string | empty | Optional label override shown when `show_location` is enabled. |
| `latitude` | number | empty | Manual latitude when `location_source: manual`. |
| `longitude` | number | empty | Manual longitude when `location_source: manual`. |
| `hemisphere` | string | `auto` | `auto`, `northern`, or `southern`. |
| `card_size` | number | `500` | Clock size in pixels. |
| `show_date` | boolean | `true` | Shows weekday and date. |
| `show_day_number` | boolean | `true` | Shows day-of-year. |
| `show_season_name` | boolean | `true` | Shows season labels and centre season. |
| `show_location` | boolean | `true` | Shows hemisphere and location. |
| `show_solstice_labels` | boolean | `true` | Shows solstice markers and labels. |
| `show_equinox_labels` | boolean | `true` | Shows equinox markers and labels. |
| `show_month_names` | boolean | `true` | Shows curved month names embedded into the season ring. |
| `show_month_markers` | boolean | `true` | Shows longer monthly tick marks. |
| `show_day_ticks` | boolean | `true` | Shows subtle daily tick marks. |
| `show_icons` | boolean | `true` | Shows compact seasonal icons. |
| `show_weather` | boolean | `true` | Shows weather from `weather_entity` when configured. |

## Location and Hemisphere Detection

The card uses the configured `hemisphere` when set to `northern` or `southern`.

When `hemisphere: auto`, it uses the selected location source. `location_source: home` uses Home Assistant's home latitude and longitude. `location_source: entity` reads an entity with `latitude` and `longitude` attributes, such as many person/device tracker style entities. `location_source: manual` uses the configured `latitude` and `longitude`.

Negative latitude selects Southern Hemisphere seasons; positive latitude selects Northern Hemisphere seasons.

The card does not request browser geolocation. For Home Assistant dashboards, configured coordinates are more predictable and avoid browser permission prompts.

## Development

Install dependencies:

```sh
npm install
```

Start the demo:

```sh
npm run dev
```

Build the HACS file:

```sh
npm run build
```

Confirm the built card exists at:

```text
dist/seasonclock.js
```

## Support

<p align="center">
  <a href="https://buymeacoffee.com/axelfair">
    <img src="https://raw.githubusercontent.com/axelfair/seasonclock/main/assets/buymeacoffee.svg" alt="Buy me a coffee" width="420">
  </a>
</p>

If you enjoy Season Clock Card and want to support future development, you can buy me a coffee:

[Buy me a coffee](https://buymeacoffee.com/axelfair)

## License

MIT
