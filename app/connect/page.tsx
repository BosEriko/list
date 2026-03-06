import Template from "@template";
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

export default function Connect() {
  return (
    <Template.Default orientation="center">
      <div className="text-center space-y-4 container mx-auto mt-4 mb-40 px-5">
        <h1 className="font-bold text-4xl">Connect with me</h1>
        <h4 className="text-gray-500">Or play with me or whatever</h4>

        <div
          className="grid gap-6 mt-8
                        grid-cols-1
                        sm:grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-4"
        >
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-6 rounded-xl shadow-md transform transition-all hover:scale-105"
              style={{
                backgroundColor: social.color,
                color: "white",
              }}
            >
              <FontAwesomeIcon icon={social.icon} size="3x" />
              <span className="mt-2 text-lg font-semibold capitalize">
                {social.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </Template.Default>
  );
}
