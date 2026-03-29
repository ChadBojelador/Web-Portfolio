import { useState } from 'react';
import BorderGlow from './BorderGlow';
import '../Styles/ProjectPanel.css';

const borderGlowProps = {
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

const ProjectPanel = ({ title, details, picture, videoSrc, link, mediaType, tags = [], projectIndex = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const mediaSrc = picture || videoSrc;
  const hasMedia = Boolean(mediaSrc);
  const isVideo = mediaType === 'video' || /\.(mp4|webm|ogg)$/i.test(mediaSrc || '');
  const hasLink = Boolean(link);
  const hasDetails = Boolean(details);
  const badgeVariant = (projectIndex % 6) + 1;
  const visibleTags = Array.isArray(tags) ? tags.slice(0, 3) : [];
  const panelId = `project-expand-${(title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <BorderGlow {...borderGlowProps} className={`project-panel-glow${isExpanded ? ' expanded' : ''}`}>
      <article className={`project-panel${isExpanded ? ' expanded' : ''}`}>
        <div className="project-nav-row">
          <span className={`project-badge project-badge-${badgeVariant}`}>Project {projectIndex + 1}</span>
          <div className="project-media">
            {hasMedia && isVideo ? (
              <video className="video-player" autoPlay loop muted playsInline>
                <source src={mediaSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : hasMedia ? (
              <img className="project-image" src={mediaSrc} alt={`${title || 'Project'} preview`} />
            ) : (
              <div className="project-media-fallback">
                <span>Media</span>
              </div>
            )}
          </div>
          <h2 className="panel-title">{title || 'Untitled Project'}</h2>
          <button
            type="button"
            className="view-button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            aria-controls={panelId}
          >
            {isExpanded ? 'Close Panel' : 'View Project'}
          </button>
        </div>

        <aside className="project-expand-panel" id={panelId} aria-hidden={!isExpanded}>
          <p className="project-description">
            {hasDetails ? details : 'No description added yet.'}
          </p>
          {visibleTags.length > 0 && (
            <div className="project-tags">
              {visibleTags.map((tag, index) => (
                <span key={`${tag}-${index}`} className={`project-tag project-badge-${((projectIndex + index) % 6) + 1}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          {hasLink ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="open-project-button">
              Open Project Link
            </a>
          ) : (
            <span className="open-project-button open-project-button-disabled">Link Not Added</span>
          )}
        </aside>
      </article>
    </BorderGlow>
  );
};

export default ProjectPanel;
