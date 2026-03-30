import sa from '/sa.png';

// Data shape to keep project entries consistent.
export const projectDataStructure = {
  title: '',
  details: '',
  picture: '',   // thumbnail shown in the collapsed nav row
  images: [],    // carousel slides shown in the expanded right panel
  link: '',
  tags: [],
};

export const projects = [
  {
    ...projectDataStructure,
    title: 'IThink',
    details: 'Smart assistant interface focused on clean UX, quick interactions, and practical workflows.',
    picture: sa,
    images: [sa],   // add more image imports here for carousel slides
    link: 'https://github.com/your-repo',
    tags: ['React', 'UI', 'Assistant'],
  },
  {
    ...projectDataStructure,
    title: 'Kiloscope - Motion Tracker',
    details: 'Physics-based motion tracker built with React, Leaflet, and the Geolocation API. Tracks live location, speed, and cumulative distance.',
    picture: sa,
    images: [sa],
    link: 'https://github.com/ChadBojelador/Physics-Motion-Tracker',
    tags: ['React', 'Leaflet', 'Geolocation API', 'Physics'],
  },
  {
    ...projectDataStructure,
    title: 'Cock Clashers',
    details: 'A Java-based battle simulator game with GUI inspired by Pokémon-style combat mechanics, featuring roosters as the main battling characters.',
    picture: sa,
    images: [sa],
    link: 'https://github.com/ChadBojelador/Cock-Clashers',
    tags: ['Java', 'GUI', 'Game Development', 'Battle Simulator'],
  },
  {
    ...projectDataStructure,
    title: 'Medical Record Management System',
    details: 'A C++/Qt-based Medical Record Management System with MySQL integration, focused on core CRUD operations and strong data structure fundamentals for organized and scalable healthcare record handling.',
    picture: sa,
    images: [sa],
    link: 'https://github.com/ChadBojelador/Medical-Record-Management-System',
    tags: ['C++', 'Qt', 'MySQL', 'CRUD'],
  },
];
