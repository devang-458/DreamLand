# ✨ DreamLand

**Transform 2D floor plans into stunning 3D visualizations instantly.**

DreamLand is an AI-powered interior design and architectural visualizer that helps homeowners, architects, and designers bridge the gap between flat 2D plans and immersive 3D renders.

![DreamLand Banner](./public/plan3d.png)

## 🚀 Key Features

- **AI-Powered Rendering**: Converts 2D floor plans or room sketches into high-quality 3D visualizations using the `gemini-2.5-flash-image-preview` model.
- **Interactive Comparison**: Seamlessly compare the original plan with the AI render using an intuitive before/after slider.
- **Cloud Persistence**: Integrated with Puter.js to save and manage your projects in the cloud.
- **High-Quality Export**: Download your rendered visualizations in high resolution for sharing or presentations.
- **Project Management**: Organize multiple designs and revisit them at any time.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [React Router 7](https://reactrouter.com/)
- **AI Engine**: [Puter AI](https://puter.com/docs/ai) (Powered by Google Gemini 2.5 Flash)
- **Backend & Storage**: [Puter.js](https://puter.com/) (Serverless FS, KV, and Hosting)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visualization**: [React Compare Slider](https://github.com/nerous/react-compare-slider)

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A [Puter.com](https://puter.com/) account (Puter.js handles authentication automatically)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/dreamland.git
   cd dreamland
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## 🏗️ How it Works

1. **Upload**: Users upload a 2D floor plan or a photo of a room.
2. **AI Inference**: The image is sent to the Puter AI SDK with a specialized architectural prompt.
3. **Visualization**: The resulting 3D render is displayed side-by-side with the original for easy comparison.
4. **Cloud Storage**: Projects are stored in Puter's decentralized file system, ensuring they are accessible from anywhere.

## ☁️ Deployment

DreamLand is designed to be hosted on **Puter.com**. The application automatically manages its own hosting configuration using the Puter Hosting API.

To build the application for production:
```bash
npm run build
```

---

Built with ❤️ using Puter and React Router.
