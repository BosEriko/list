import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSteam,
  faFacebook,
  faTwitch,
  faYoutube,
  faInstagram,
  faTiktok,
  faXTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import socialLinksData from "@data/links.json";

const iconMap = {
  faSteam,
  faFacebook,
  faTwitch,
  faYoutube,
  faInstagram,
  faTiktok,
  faXTwitter,
  faLinkedin,
};

const socialLinks = socialLinksData.map((link) => ({
  ...link,
  icon: iconMap[link.icon as keyof typeof iconMap],
}));

const Footer = () => {
  return (
    <footer className="py-4 border-t border-gray-200 bg-white">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div>Bos Eriko &copy; {new Date().getFullYear()}</div>
        <div className="flex justify-center space-x-3">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#f7b43d] transition-colors"
            >
              <FontAwesomeIcon icon={social.icon} size="sm" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
