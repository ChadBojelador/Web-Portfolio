import sa from '/sa.png';

// Data shape to keep project entries consistent.
export const projectDataStructure = {
  title: '',
  details: '',
  picture: '',
  link: '',
  tags: [],
};

export const projects = [
  {
    ...projectDataStructure,
    title: 'IThink',
    details: 'Smart assistant interface focused on clean UX, quick interactions, and practical workflows.',
    picture: sa,
    link: 'https://github.com/your-repo',
    tags: ['React', 'UI', 'Assistant'],
  },
];
