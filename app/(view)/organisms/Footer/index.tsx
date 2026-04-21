"use client";
import { useEffect, useState } from "react";
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

type SocialLink = {
  name: string;
  url: string;
  icon: keyof typeof iconMap;
};

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState<
    (SocialLink & { iconComponent: any })[]
  >([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/BosEriko/gh-data/master/links.json"
        );
        const data: SocialLink[] = await res.json();

        const mapped = data.map((link) => ({
          ...link,
          iconComponent: iconMap[link.icon],
        }));

        setSocialLinks(mapped);
      } catch (err) {
        console.error("Failed to load social links:", err);
      }
    };

    fetchLinks();
  }, []);

  return (
    <footer className="py-6 border-t border-gray-200 bg-white">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="text-sm text-gray-600 text-center md:text-left">
          Bos Eriko List &copy; {new Date().getFullYear()}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#f7b43d] transition-colors"
            >
              <FontAwesomeIcon icon={social.iconComponent} size="sm" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
