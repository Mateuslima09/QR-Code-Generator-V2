import { Github } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <a
        href="https://github.com/Mateuslima09"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-github-link"
        title="Mateuslima09"
      >
        <Github className="footer-github-icon" />
      </a>
    </footer>
  );
}
