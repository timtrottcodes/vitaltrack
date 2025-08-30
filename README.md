# VitalTrack

VitalTrack is a simple, lightweight health tracking web app built with **vanilla JavaScript** and **Bootstrap**.  
It allows you to log, visualize, and export your health data locally, with no server required.

---

## ✨ Features

- 📅 Log daily health metrics:
  - Weight
  - BMI (with automatic trend line for clarity)
  - BMR
  - Muscle %
  - Water %
  - Fat %
  - Bone Mass
  - Pulse
  - Blood Pressure (systolic & diastolic)
  - Daily Steps
- 📊 Interactive charts for each metric (powered by Chart.js)
- 🎯 Target weight and goal date setting with velocity projection on charts
- 💾 Data stored in browser **LocalStorage**
- 📤 Export and 📥 Import data as JSON
- 🖨️ Print view with:
  - Table of all raw values
  - Weight & Blood Pressure progress charts
- Responsive design with Bootstrap

---

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/vitaltrack.git
cd vitaltrack
```

2. Open `index.html` in your browser.  
   No server setup is required — everything runs locally.

---

## ⚙️ Customization

- Set your **target weight** and **goal date** directly in the JavaScript configuration.  
- Adjust chart colors, moving average windows, or layout easily inside the `app.js` file.

---

## 📂 Project Structure

```
vitaltrack/
│
├── index.html       # Main app UI
├── app.js           # Core logic (data handling, charts, localstorage, etc.)
├── style.css        # Custom styles (Bootstrap + extras)
├── README.md        # Project documentation
└── /assets          # Any static assets (icons, logos, etc.)
```

---

## 🛠️ Built With

- [Bootstrap](https://getbootstrap.com/) - UI framework
- [Chart.js](https://www.chartjs.org/) - Interactive charts
- Vanilla JavaScript - Core logic

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍⚕️ Disclaimer

VitalTrack is intended for **personal health tracking** only.  
It is **not a medical device** and should not be used as a substitute for professional medical advice.

