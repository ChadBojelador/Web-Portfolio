import sa from '/sa.png';

// Data shape to keep project entries consistent.
export const projectDataStructure = {
  title: '',           // project name
  description: '',     // short summary shown in collapsed view
  details: '',         // longer explanation shown in expanded view
  picture: '',         // thumbnail shown in the collapsed nav row
  images: [],          // carousel slides shown in the expanded right panel
  link: '',            // live demo / deployed URL
  githubLink: '',      // GitHub repository URL
  tags: [],
};

export const projects = [
  {
    ...projectDataStructure,
    title: 'IThink',
    description: 'Smart assistant interface focused on clean UX, quick interactions, and practical workflows.',
    details: 'IThink is a smart assistant interface built with React, designed around the idea of minimal friction and maximum clarity. It features a streamlined conversational UI, real-time responses, and intuitive navigation for practical day-to-day workflows.',
    picture: sa,
    images: [sa],
    link: '',
    githubLink: 'https://github.com/your-repo',
    tags: ['React', 'UI', 'Assistant'],
  },
  {
    ...projectDataStructure,
    title: 'Kiloscope - Motion Tracker',
    description: 'Physics-based motion tracker that tracks live location, speed, and cumulative distance.',
    details: 'Kiloscope is a physics-based motion tracker built with React, Leaflet, and the Geolocation API. It tracks live location, calculates speed in real time, and visualizes cumulative distance traveled on an interactive map — ideal for understanding real-world kinematics.',
    picture: sa,
    images: [sa],
    link: '',
    githubLink: 'https://github.com/ChadBojelador/Physics-Motion-Tracker',
    tags: ['React', 'Leaflet', 'Geolocation API', 'Physics'],
  },
  {
    ...projectDataStructure,
    title: 'Cock Clashers',
    description: 'A Java-based battle simulator game with GUI inspired by Pokémon-style combat mechanics.',
    details: 'Cock Clashers is a Java-based battle simulator game with a full GUI, inspired by Pokémon-style turn-based combat. Players select roosters with unique stats and abilities, then engage in strategic battles with animated attack sequences and health tracking.',
    picture: sa,
    images: [sa],
    link: '',
    githubLink: 'https://github.com/ChadBojelador/Cock-Clashers',
    tags: ['Java', 'GUI', 'Game Development', 'Battle Simulator'],
  },
  {
    ...projectDataStructure,
    title: 'Medical Record Management System',
    description: 'A C++/Qt Medical Record System with MySQL integration for healthcare record handling.',
    details: 'A comprehensive C++/Qt-based Medical Record Management System with MySQL integration. Focused on core CRUD operations and strong data structure fundamentals, it provides organized and scalable healthcare record handling with a clean desktop interface.',
    picture: sa,
    images: [sa],
    link: '',
    githubLink: 'https://github.com/ChadBojelador/Medical-Record-Management-System',
    tags: ['C++', 'Qt', 'MySQL', 'CRUD'],
  },
];
