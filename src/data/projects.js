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
];
