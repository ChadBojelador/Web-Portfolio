import '../Styles/ProjectPanel.css'
const ProjectPanel = ({ title, details, videoSrc, link }) => {
    return (
        <div className='container'>
        <div className="project-panel">
            <div className="details-tab">
                <h2 className="panel-title">{title}</h2>
                <div className="title-underline"></div>
                <p className="details-content">{details}</p>
                <a href={link} target='_blank'>
                <button className="view-button">VIEW PROJECT</button>
                </a>
            </div>
            
            <div className="video-tab">
                <video 
                    className="video-player"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
        </div>
    );
};

export default ProjectPanel;