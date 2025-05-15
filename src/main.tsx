
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set the document title
document.title = 'KeyCoin - Passwords & Finance Tracker'

createRoot(document.getElementById("root")!).render(<App />);
