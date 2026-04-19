import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import Navbar from "../../components/Navbar";
import { ArrowRight, Clock, Layers } from "lucide-react";
import { Button } from "../../components/ui/Button";
import plan from "../../public/plan3d.png"

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="home">
      <Navbar />
      <section className="hero">

        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>
          <p>Introducing DreamLand</p>
        </div>

        <h1>Build beautiful spaces at the speed of thought with DreamLand</h1>
        <p className="subtitle">DreamLand is an AI-First design environment that helps you visualize,
          render, and ship architectural projects faster than ever.
        </p>

        <div className="actions">

          <a href="#" className="cta">
            Start Building <ArrowRight className="icon" />
          </a>

          <Button className="demo" size="lg" variant="outline">
            Watch Demo
          </Button>

        </div>
        <div className="upload-shell" id="upload">
          <div className="grid-overlay" />
          <div className="upload-card">
            <div className="upload-head">
              <div className="upload-icon">
                <Layers className="icon" />
              </div>
              <h3>Upload your floor plan</h3>
              <p>Supports JPG, PNG, formats up to 10MB</p>
            </div>
            <p>Upload images</p>

          </div>
        </div>
      </section>
      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Projects</h2>
              <p>Your latest work and shared community projects, all in one place.</p>
            </div>
          </div>
          <div className="projects-grid">
            <div className="project-card group">
              <div className="preview">
                <img src={plan} alt="Project" />
                <div className="badge">
                  <span>Community</span>
                </div>
              </div>
              <div className="card-body">
                <div>
                  <h3>Project Indore</h3>
                  <div className="meta">
                    <Clock size={12} />
                    <span>{new Date('01.03.2026').toLocaleDateString()}</span>
                    <span>By Palak Jain</span>
                  </div>
                </div>

                <div className="arrow">
                  <ArrowRight size={18} />
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
};
