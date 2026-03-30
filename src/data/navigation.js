import home from '../assets/homeIcon.svg';
import folderIcon from '../assets/folder.svg';
import certificateIcon from '../assets/certificates.svg';

import aboutIcon from '../assets/about.svg';

export const navItems = [
  { icon: home, alt: "Home", className: "home", label: "Home", path: "/" },
  { icon: folderIcon, alt: "Projects", className: "folder", label: "Projects", path: "/projects" },
  { icon: certificateIcon, alt: "Certificates", className: "certificate", label: "Certificates", path: "/certificates" },

  { icon: aboutIcon, alt: "About", className: "about", label: "About", path: "/about" },
];
