# SSP Pilot Monitoring System

**Sustainable Sand Protocol — River Guardian Network**  
Surma River Basin, Sylhet, Bangladesh  
Built by: Sustainable Resource Innovation Lab, SUST × Millennium Fellowship

---

## Purpose

A lightweight pilot web system to support the Sustainable Sand Protocol (SSP) — a three-pillar initiative addressing unsustainable river sand mining in Sylhet, Bangladesh.

This tool enables:
- **River Guardians** to submit community observations of illegal mining activity
- **Coordinators** to review, verify, and export reports as CSV
- **Engineers** to record M-Sand (manufactured sand) demonstration results
- **Stakeholders** to view an auto-generated Pilot Phase Summary Report

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/your-username/ssp-pilot-system
cd ssp-pilot-system
npm install

# Run locally
npm start
# Opens at http://localhost:3000
```

---

## Project Structure

```
ssp-pilot-system/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx       # All components (Dashboard, ReportForm, ReportTable, MSand, PilotReport)
│   ├── App.css       # Full stylesheet
│   └── index.js      # React entry point
├── package.json
└── README.md
```

---

## Features

| Section | Description |
|---|---|
| Dashboard | Live stats, progress bars, recent reports |
| Submit Report | Community observation form with safety acknowledgment |
| All Reports | Filterable table, status management, CSV export |
| M-Sand Demo | Batch test records with comparison data |
| Pilot Report | Auto-generated summary with findings & roadmap |

---

## Tech Stack

- **React 18** — component-based UI
- **localStorage** — persistent demo storage (no backend required)
- **Pure CSS** — no UI library dependency
- **CSV export** — built-in download function

---

## Future Improvements

- [ ] Firebase / Supabase backend for real multi-user data
- [ ] GPS map view using Leaflet.js
- [ ] Drone/satellite image attachment support
- [ ] Bengali language (বাংলা) toggle
- [ ] Sentinel-2 change detection API integration
- [ ] Dashboard charts (Chart.js or Recharts)
- [ ] Role-based access (Guardian / Coordinator / Admin)
- [ ] Mobile PWA for offline field use

---

## SSP Three Pillars

1. **Innovation** — M-Sand from quarry waste as river sand alternative  
2. **Accountability** — Community monitoring with drones + satellite  
3. **Market Transformation** — Sustainable Sourcing Charter for industry

---

## License

MIT — open for adaptation by river communities and researchers worldwide.
