Overview

This project is a Backend MVP for visualising and analysing UK tick sightings.
It loads data from the provided tick sightings spreadsheet (converted to CSV), processes it, and exposes endpoints for searching, filtering, and generating regional/time-based insights.

This backend supports the requirements of the Elanco Placement Program technical task.

Tech Stack
- Node.js
- Express.js

Built-in Node fs for CSV parsing

In-memory data store (no external database required)

No external dependencies beyond Express.

Project Structure

src/
  server.js       → Express app and routes
  data.js         → CSV loading and cleaning logic
  filters.js      → Filtering by date range and location
  stats.js        → Aggregations: regions & trends
  ticks.csv       → Converted dataset from the provided spreadsheet

Data Handling

CSV Conversion

The original dataset was provided as an Excel file (Tick Sightings.xlsx).
For simplicity and reliability, it was exported to CSV (ticks.csv) and loaded directly.

Data Cleaning

During loading, the application:

Parses dates into JavaScript Date objects

Skips incomplete or invalid rows

Normalises fields (id, date, location, species, latinName)

Deduplicates entries based on a combination of ID + timestamp + coordinates (if available)

All cleaned sightings are stored in memory when the server starts.

Running the Project

Install dependencies:

npm install

Start the server:

npm run devStart

Default URL
http://localhost:3000

API Endpoints
GET /health

Basic health check.
Returns number of loaded sightings.

GET /sightings

Returns sightings with optional filters.

Query parameters:

start (YYYY-MM-DD)

end (YYYY-MM-DD)

location (string: exact match)

Example:
/sightings?location=Manchester&start=2019-01-01&end=2019-03-01

GET /stats/regions

Returns number of sightings per region (using “location” as the region).

Example Response:
{
  "London": 105,
  "Manchester": 42,
  "Glasgow": 18
}

GET /stats/trends

Returns aggregated counts over time.

Query:

interval=weekly (default)

interval=monthly

Example:
/stats/trends?interval=monthly


Sample output:

{
  "2019-01": 23,
  "2019-02": 45,
  "2019-03": 31
}

Architecture Decisions

Chose Node.js and Express for simplicity and familiarity.

Used CSV instead of Excel to keep data loading clear and lightweight.

Used an in-memory store because:

The dataset is small enough.

Separated logic into:

data.js → reading/cleaning

filters.js → search & filtering

stats.js → aggregations/statistics

server.js → routing

This keeps code simple, readable, and easy to extend.


Improvements (if given more time)

Add more filters:

Species

Severity

Partial region matches (e.g. “Man” → “Manchester”)

Add a database (PostgreSQL or MongoDB)

Add automated tests (Jest)

Add caching

Add error logging

On AI Assistance

Parts of the problem breakdown, file structure, and early scaffolding were guided using AI tools.
All data handling, logic understanding, testing, debugging, and final implementation decisions were made by me.