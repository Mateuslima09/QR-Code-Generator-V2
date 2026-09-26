import { Github } from 'lucide-react';
import { APP_VERSION } from '../../config/version';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <a
          href="https://github.com/Mateuslima09"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-github-link"
          title="Mateuslima09"
        >
          <Github className="footer-github-icon" />
        </a>
        <span className="footer-version">{APP_VERSION}</span>
      </div>
    </footer>
  );
}
