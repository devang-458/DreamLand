# ✨ DreamLand

<p align="center">
  <img src="./public/plan3d.png" alt="DreamLand Banner" width="800">
</p>

**DreamLand** is an advanced AI-powered architectural visualizer designed to bridge the gap between flat 2D floor plans and immersive, photorealistic 3D renders. Using state-of-the-art AI, it transforms sketches and architectural drawings into high-fidelity visualizations instantly.

---

## 🚀 Key Features

*   **🤖 AI-Powered Rendering**: Leverages Google Gemini 2.5 Flash (via Puter AI) to interpret architectural geometry and generate photorealistic 3D views.
*   **🌓 Interactive Comparison**: Features an intuitive side-by-side slider to compare original plans with AI-generated outputs.
*   **☁️ Puter.js Integration**: Built-in cloud persistence, authentication, and decentralized hosting provided by the Puter.js SDK.
*   **📁 Project Management**: Save, list, and manage multiple architectural designs within a sleek, modern dashboard.
*   **🖼️ High-Quality Exports**: Download your renders in high resolution for presentations or client reviews.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [React 19](https://react.dev/) + [React Router 7](https://reactrouter.com/) |
| **AI Engine** | [Puter AI](https://puter.com/docs/ai) (Google Gemini 2.5 Flash) |
| **Infrastructure** | [Puter.js](https://puter.com/) (Serverless FS, KV, Hosting) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Visualization** | [React Compare Slider](https://github.com/nerous/react-compare-slider) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 📦 Getting Started

### Prerequisites

*   **Node.js**: v18 or higher.
*   **Puter Account**: A free account at [Puter.com](https://puter.com/) is required for cloud features.

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/dreamland.git
    cd dreamland
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    VITE_PUTER_WORKER_URL=your_puter_worker_url
    ```

4.  **Launch Development Server**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

---

## 🏗️ Architecture & Workflow

1.  **Ingestion**: User uploads a 2D floor plan. The image is processed and stored via Puter's decentralized file system.
2.  **Inference**: A specialized architectural prompt (see `lib/constants.ts`) is sent to the Puter AI SDK along with the image.
3.  **Cloud Storage**: Results are automatically indexed in Puter's Key-Value store for persistence across sessions.
4.  **Visualization**: React Router 7 manages the visualizer state, providing a seamless navigation experience between the dashboard and the 3D viewer.

---

## ☁️ Deployment

DreamLand is optimized for deployment on the **Puter.com** platform.

To build for production:
```bash
npm run build
```

To deploy your worker (if modified):
Ensure `lib/puter.worker.js` is updated in your Puter dashboard to handle the backend API requests.

---

<p align="center">
  Built with ❤️ using <b>Puter</b> and <b>React Router</b>.
</p>
