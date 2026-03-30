import ProjectPanel from '../Components/ProjectPanel';
import BorderGlow from '../Components/BorderGlow';
import CustomCursor from '../Components/CustomCursor';
import Navigation from '../Components/Navigation';
import { Link } from 'react-router-dom';
import '../Styles/Projects.css';
import { projects } from '../data/projects';

const glowStyle = {
  edgeSensitivity: 30,
  glowColor: '0 0 100',
  backgroundColor: '#121212',
  borderRadius: 28,
  glowRadius: 40,
  glowIntensity: 0.9,
  coneSpread: 25,
  animated: false,
  colors: ['#ffffff', '#d6d6d6', '#8a8a8a'],
  fillOpacity: 0,
};

function Projects() {
  const isUnderDevelopment = true;
  const hasProjects = projects.length > 0;
  const projectCount = String(projects.length).padStart(2, '0');

  return (
    <div className="project-container">
      <div className="nav">
        <Navigation />
        <CustomCursor />
      </div>

      <main className="projects-main">
        <section className="projects-toolbar" aria-label="Project Showcase">
          <h1 className="projects-title">Project Showcase</h1>
          <div className="projects-meta">
            <span className="projects-count">{projectCount} projects</span>
          </div>
        </section>

        <section className="projects-grid" aria-live="polite">
          {isUnderDevelopment ? (
            <BorderGlow {...glowStyle} className="projects-empty-glow">
              <div className="projects-empty-state projects-dev-state">
                <h2>Projects Page In Development</h2>
                <p>
                  This section is currently being refined. You can explore other parts of my portfolio while this page is being completed.
                </p>
                <div className="projects-dev-actions" role="navigation" aria-label="Explore other portfolio sections">
                  <Link to="/" className="projects-dev-link">Home</Link>
                  <Link to="/certificates" className="projects-dev-link">Certificates</Link>
                  <Link to="/about" className="projects-dev-link">About</Link>
                </div>
              </div>
            </BorderGlow>
          ) : hasProjects ? (
            projects.map((project, index) => (
              <ProjectPanel
                key={index}
                title={project.title}
                details={project.details}
                picture={project.picture}
                videoSrc={project.videoSrc}
                link={project.link}
                mediaType={project.mediaType}
                tags={project.tags}
                projectIndex={index}
              />
            ))
          ) : (
            <BorderGlow {...glowStyle} className="projects-empty-glow">
              <div className="projects-empty-state">
                <h2>No Projects Yet</h2>
              </div>
            </BorderGlow>
          )}
        </section>
      </main>
    </div>
  );
}

export default Projects;
