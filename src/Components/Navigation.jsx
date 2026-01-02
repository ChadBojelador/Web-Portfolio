// Navigation.jsx
import { Link } from 'react-router-dom';
import { navItems } from '../data/navigation';

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