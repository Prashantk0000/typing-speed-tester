# ⌨️ Typing Speed Tester

A simple typing speed test app built with React. Type a random paragraph within 60 seconds and see your WPM, CPM, accuracy, and mistakes in real-time.

## Features

- Random paragraph on each attempt
- 60-second countdown timer (starts when you type)
- Real-time WPM and CPM calculation
- Character-by-character highlighting (green = correct, red = wrong)
- Mistake tracking with backspace support
- Accuracy percentage bar
- Result card on completion
- Try Again button to reset with a new paragraph

## Tech Stack

- React
- Vite
- CSS

## How to Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser and start typing!

## Project Structure

```
src/
├── components/
│   ├── SpeedTypingGame.jsx   # Main game logic
│   ├── SpeedTypingGame.css   # Styles
│   ├── TypingArea.jsx        # Paragraph display
│   └── Stats.jsx             # Stats display
├── data/
│   └── paragraphs.js         # Sample paragraphs
├── App.jsx
├── main.jsx
└── index.css
```
