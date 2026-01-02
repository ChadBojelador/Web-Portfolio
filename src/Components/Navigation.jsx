// Navigation.jsx
import { Link } from 'react-router-dom';
import home from '../assets/homeIcon.svg';
import folderIcon from '../assets/folder.svg';
import certificateIcon from '../assets/certificates.svg';
import toolsIcon from '../assets/tools.svg';
import aboutIcon from '../assets/about.svg';

const navItems = [
  { icon: home, alt: "Home", className: "home", label: "Home", path: "/" },
  { icon: folderIcon, alt: "Projects", className: "folder", label: "Projects", path: "/projects" },
  { icon: certificateIcon, alt: "Certificates", className: "certificate", label: "Certificates", path: "/certificates" },
  { icon: toolsIcon, alt: "Tools", className: "tools", label: "Tools", path: "/Tools" },
  { icon: aboutIcon, alt: "About", className: "about", label: "About", path: "/About" },
];

const Navigation = () => (
  <header>
    <nav>
      <ul className="list-container">
        {navItems.map((item, index) => (
          <li className="list" key={index} title={item.label}>
            <Link to={item.path}>
              <img
                className={`icon icon-${item.className}`}
                src={item.icon}
                alt={item.alt}
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);

export default Navigation;