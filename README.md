# 🏥 Aetheris Super-Speciality Hospital — Interactive 3D Web Experience

An ultra-realistic, cinematic 3D digital twin and interactive web experience of a modern super-speciality hospital and its surrounding rural Andhra Pradesh landscape. Built with **React 18**, **Three.js**, **@react-three/fiber**, **@react-three/drei**, and **Tailwind CSS**.

🔗 **Repository:** [https://github.com/subrahmanyamsniceinteractive-max/hospital](https://github.com/subrahmanyamsniceinteractive-max/hospital)

---

## ✨ Key Features

### 1. 🏡 Authentic Village-to-Hospital Road Journey
- **Starting Scene:** Photorealistic Indian village inspired by Andhra Pradesh (traditional Manduva houses, tiffin shops, banyan tree, paddy fields, canal bridge, villagers, and auto-rickshaw).
- **Smooth Travel:** Scroll mouse wheel or use touch/keyboard (`W`/`S`/`Arrow Keys`) to drive down the highway corridor directly towards the hospital.
- **Auto-Drive & Scrubber:** Interactive HUD with telemetry, live speed, distance countdown, milestone checkpoints, and auto-pilot mode.

### 2. 🏢 Photorealistic Hospital Exterior & Interactive Entrance
- Modern multi-story architectural facade with concrete finishes, glass curtain walls, emergency bay, ambulance port, and landscaped pathways.
- Clickable automatic glass sliding doors with smooth camera transition into the central lobby.
- Realistic daylight, golden hour, night, and monsoon rain environmental cycles.

### 3. 🛋️ Interactive Lobby & Hospital Departments
- Central reception, triage desk, pharmacy, waiting lounge, and medical staff.
- Seamless camera navigation between specialised hospital departments:
  - 🩻 **Radiology & Advanced Imaging** (CT & MRI Suites)
  - 🔬 **Robotic Surgery Suite** (Advanced DaVinci-style Robot)
  - 🫀 **ICU & Critical Care Unit** (Smart Monitoring & Ventilator Beds)
  - 🚨 **Level-1 Emergency & Trauma Bay**
  - 🩺 **Cardiology Diagnostics Unit**

### 4. ⚙️ Dedicated 3D Medical Equipment Studio (Exploded View)
- Inspect high-detail 3D medical equipment in an isolated studio.
- Interactive **Exploded-View Animation** reveals internal hardware (superconducting magnets, gantry, vacuum tubes, robotic arms, sensor arrays).
- Interactive part highlights, clinical explanations, and 360° orbit inspection.

### 5. 🎬 Cinematic Facilities Walkthrough Tour
- "Explore Hospital Facilities" video-style guided tour with cinematic camera movements.
- Full video controls (Play, Pause, Scrub, Replay, Chapter Selection, Fullscreen).

---

## 🛠️ Technology Stack

- **Framework:** React 18, TypeScript, Vite
- **3D Graphics:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Animation & Physics:** GSAP, smooth delta-lerp camera director
- **Styling:** Tailwind CSS, Lucide React icons
- **Audio:** Web Audio API sound synthesis (synthesized ambient hums, clicks, cardiac telemetry)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/subrahmanyamsniceinteractive-max/hospital.git

# Navigate to project folder
cd hospital

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📄 License

This project is licensed under the MIT License.
