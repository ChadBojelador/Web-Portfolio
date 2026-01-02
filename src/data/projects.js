import pasyentrack from '../assets/pasyentrack.mp4';
import smw from '../assets/smw.mp4';

export const projects = [
  {
    title: "Medical Record Management System Using C++ and Qt Framework",
    details: "The Medical Record Management System, developed using C++ with a graphical user interface, features a stacked widget design that allows smooth navigation between login, patient data entry, and record viewing sections. It combines a MySQL database for persistent data storage with a Binary Search Tree (BST) for efficient in-memory operations such as searching, insertion, and deletion of patient records.",
    videoSrc: pasyentrack,
    link: "https://github.com/ChadBojelador/Medical-Record-Management-System"
  },
  {
    title: "Smart Waste Bin with Plastic Shredder",
    details: "Powered by Arduino Uno R3 components, the system detects and shreds plastic while it records the shredding process and logs data in real-time to Google Sheets via Google Apps Script. Notably, this system has been tested and validated by 10 engineers from diverse fields, ensuring its interdisciplinary applicability.",
    videoSrc: smw,
    link: "https://drive.google.com/file/d/1CuGlOQnRn8RLUau6sRM7JuAmdNSCld7J/view?usp=drive_link"
  }
];
