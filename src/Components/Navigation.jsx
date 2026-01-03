// Navigation.jsx
import { navItems } from '../data/navigation';

const Navigation = () => {
  const handleClick = (e, path) => {
    e.preventDefault();
    const sectionId = path === '/' ? 'home' : path.substring(1);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header>
      <nav>
        <ul className="list-container">
          {navItems.map((item, index) => (
            <li className="list" key={index} title={item.label}>
              <a href={item.path} onClick={(e) => handleClick(e, item.path)}>
                <img
                  className={`icon icon-${item.className}`}
                  src={item.icon}
                  alt={item.alt}
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;