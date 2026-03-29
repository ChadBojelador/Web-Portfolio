import BorderGlow from './BorderGlow';
import '../Styles/ProjectPanel.css';
import '../Styles/certificates.css';

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

const CertificatePanel = ({ cert, index }) => {
  const badgeVariant = (index % 6) + 1;
  const visibleTags = Array.isArray(cert.tags) ? cert.tags : [];
  
  return (
    <BorderGlow {...borderGlowProps} className="cert-panel-glow">
      <article className="cert-panel">
        
        {/* Left pane: Details */}
        <div className="cert-details-pane">
          <div className="cert-nav-row">
            <span className={`project-badge project-badge-${badgeVariant}`}>
              Cert {String(index + 1).padStart(2, '0')}
            </span>
            <div className="cert-media-thumb">
              <img src={cert.image} alt={cert.title} />
            </div>
            <div className="cert-headers">
              <h2 className="panel-title">{cert.title}</h2>
              <span className="cert-issuer-meta">
                {cert.issuer} • Issued {cert.date}
              </span>
            </div>
          </div>

          <div className="cert-content-body">
            <p className="project-description">
              {cert.description || 'No description provided.'}
            </p>

            {visibleTags.length > 0 && (
              <div className="project-tags">
                {visibleTags.map((tag, tIndex) => (
                  <span
                    key={`${tag}-${tIndex}`}
                    className={`project-tag project-badge-${((index + tIndex) % 6) + 1}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="cert-footer-actions">
              {cert.link && (
                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="open-project-button">
                  Validate Certificate
                </a>
              )}
              {cert.id && <span className="cert-id-label">ID: {cert.id}</span>}
            </div>
          </div>
        </div>

        {/* Right pane: Large Image display */}
        <aside className="cert-media-pane">
          <div className="cert-image-wrapper">
             <img src={cert.image} alt={`${cert.title} Full`} className="cert-full-image" />
          </div>
        </aside>

      </article>
    </BorderGlow>
  );
};

export default CertificatePanel;
