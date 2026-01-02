import React, { useEffect } from 'react';
import '../Styles/certificates.css';
import Navigation from '../Components/Navigation';
import CustomCursor from '../Components/CustomCursor';
import Experiences from '../Components/Experiences';

const Certificates = () => {
  useEffect(() => {
    // Certificate card animation on scroll
    const certCards = document.querySelectorAll('.cert-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    
    certCards.forEach(card => {
      card.style.opacity = 0;
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(card);
    });
    
    return () => {
      certCards.forEach(card => observer.unobserve(card));
    };
  }, []);

  return (
    <div className="cert-container">
      {/* Floating decorative elements */}
      <div className="floating">{'{ }'}</div>
      <div className="floating">;</div>
      <div className="floating">( )</div>
      <div className="floating">[ ]</div>
      <CustomCursor></CustomCursor>
      <section className="hero">
        <Navigation></Navigation>
        <h1>My Certificates</h1>
        <p>Professional certifications and achievements demonstrating expertise across various technologies</p>
      </section>
      
      <div className="cert-grid">
        {/* Certificate 1 */}
        <div className="cert-card">
          <div className="cert-header">
            <h2>Cloud Support Associate Professional Certificate</h2>
            <div className="cert-issuer">Amazon Web Services</div>
            <div className="cert-date">Issued: June 2025</div>
          </div>
          <div className="cert-body">
            <p className="cert-desc">
The Cloud Support Associate Professional Certificate is a credential that validates foundational skills in cloud computing and technical support for cloud-based services.</p>
            <div className="cert-tags">
              <span className="cert-tag box-1">AWS</span>
              <span className="cert-tag box-2">Lambda</span>
              <span className="cert-tag box-3">EC2</span>
              <span className="cert-tag box-4">Cloud Computing</span>
            </div>
          </div>
          <div className="cert-footer">
            <a   target="_blank"  href="https://coursera.org/share/fd015331f34ec11cab574fe2bd568a02" className="cert-link">View Certificate ↗</a>
            <span className="cert-id">ID: VUKTCP8KRWZK</span>
          </div>
        </div>
        
        {/* Certificate 2 */}
        <div className="cert-card">
          <div className="cert-header">
            <h2>Developing Front-End Apps with React</h2>
            <div className="cert-issuer">IBM</div>
            <div className="cert-date">Issued: June 2025</div>
          </div>
          <div className="cert-body">
            <p className="cert-desc">Professional certification demonstrating expertise in designing distributed systems on AWS.</p>
            <div className="cert-tags">
              <span className="cert-tag box-5">AWS</span>
              <span className="cert-tag box-6">CloudFormation</span>
              <span className="cert-tag box-7">S3</span>
              <span className="cert-tag box-8">Lambda</span>
              <span className="cert-tag box-9">EC2</span>
            </div>
          </div>
          <div className="cert-footer">
            <a   target="_blank"  href="https://www.coursera.org/account/accomplishments/records/DWTAT3K7YJ8E" className="cert-link">View Certificate ↗</a>
            <span className="cert-id">ID: DWTAT3K7YJ8E</span>
          </div>
        </div>
        
        {/* Certificate 3 */}
        <div className="cert-card">
          <div className="cert-header">
            <h2>Developing Back-End Apps with Node.js and Express</h2>
            <div className="cert-issuer">IBM</div>
            <div className="cert-date">Issued: June 2025</div>
          </div>
          <div className="cert-body">
            <p className="cert-desc">Mastery of modern JavaScript concepts including ES6+, asynchronous programming, and design patterns.</p>
            <div className="cert-tags">
              <span className="cert-tag box-10">JavaScript</span>
              <span className="cert-tag box-11">ES6+</span>
              <span className="cert-tag box-1">Async/Await</span>
              <span className="cert-tag box-2">Design Patterns</span>
            </div>
          </div>
          <div className="cert-footer">
            <a   target="_blank"  href="https://www.coursera.org/account/accomplishments/records/3WEPSCSJ3FFM" className="cert-link">View Certificate ↗</a>
            <span className="cert-id">ID: 3WEPSCSJ3FFM</span>
          </div>
        </div>
        
        {/* Certificate 4 */}
        <div className="cert-card">
          <div className="cert-header">
            <h2>Graphic Design with AI Powered Canva for Beginners</h2>
            <div className="cert-issuer">Department of Information and Communications Technology</div>
            <div className="cert-date">Issued: May 2025</div>
          </div>
          <div className="cert-body">
            <p className="cert-desc">Comprehensive training in user-centered design principles, prototyping, and usability testing.</p>
            <div className="cert-tags">
              <span className="cert-tag box-3">Figma</span>
              <span className="cert-tag box-4">Canva</span>
              <span className="cert-tag box-5">Prototyping</span>
              <span className="cert-tag box-6">Accessibility</span>
            </div>
          </div>
          <div className="cert-footer">
            <a   target="_blank"  href="https://drive.google.com/file/d/1P9iKYYxwQNajj5BNW2kAyOxqan6UojBc/view?usp=drive_link" className="cert-link">View Certificate ↗</a>
            <span className="cert-id"></span>
          </div>
        </div>
        
        {/* Certificate 5 */}
        <div className="cert-card">
          <div className="cert-header">
            <h2>Data Analyst Specialist Open House Mentoring Program</h2>
            <div className="cert-issuer">Datasense Analytics</div>
            <div className="cert-date">Issued: May 2025</div>
          </div>
          <div className="cert-body">
            <p className="cert-desc">An interactive Q&A session connecting aspiring data analysts with industry professionals. Participants gain insights, career guidance, and practical advice to support their growth in the data analytics field.</p>
            <div className="cert-tags">
              <span className="cert-tag box-9">Zoom</span>
              <span className="cert-tag box-10">Q&A</span>
            </div>
          </div>
          <div className="cert-footer">
            <a target="_blank" href="https://drive.google.com/file/d/19OvZGUKBf7YWaIL9I3OaerSbcWr-ypoi/view?usp=sharing" className="cert-link">View Certificate ↗</a>
            <span className="cert-id">ID: STF-25-4587428</span>
          </div>
        </div>
        
        {/* Certificate 6 */}
        <div className="cert-card">
          <div className="cert-header">
            <h2>Mastering Programming and Data Analysis:Leveraging LMS Tools and Power BI</h2>
            <div className="cert-issuer">Batangas State University - Alangilan</div>
            <div className="cert-date">Issued: October 2024</div>
          </div>
          <div className="cert-body">
            <p className="cert-desc">This mentoring event explores the integration of programming and data analysis through the use of LMS tools and Microsoft Power BI. It highlights how these technologies enhance data-driven decision-making, improve learner engagement, and support efficient monitoring and evaluation in digital education environments.</p>
            <div className="cert-tags">
              <span className="cert-tag box-11">Power BI</span>
              <span className="cert-tag box-1">Excel</span>
              <span className="cert-tag box-2">Google Drive</span>
              <span className="cert-tag box-3">Problem Solving</span>
            </div>
          </div>
          <div className="cert-footer">
            <a href="#" className="cert-link">View Certificate ↗</a>
            <span className="cert-id"></span>
          </div>
        </div>
      </div>
      <Experiences/>
    </div>
  );
};

export default Certificates;