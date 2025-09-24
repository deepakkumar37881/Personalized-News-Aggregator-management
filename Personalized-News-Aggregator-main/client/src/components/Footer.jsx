import React from "react";
import { Facebook, Instagram, Twitter, Github, Youtube } from "lucide-react";

const Footer = () => {
  const sections = [
    {
      title: "Solutions",
      links: ["Marketing", "Analytics", "Automation", "Commerce", "Insights"],
    },
    {
      title: "Support",
      links: ["Submit Ticket", "Documentation", "Guides"],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Jobs", "Press"],
    },
    {
      title: "Legal",
      links: ["Terms of Service", "Privacy Policy", "License"],
    },
  ];

  const socialLinks = [
    { Icon: Facebook, href: "#" },
    { Icon: Instagram, href: "#" },
    { Icon: Twitter, href: "#" },
    { Icon: Github, href: "#" },
    { Icon: Youtube, href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">
        {/* Logo and Social Links */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">NewsHub</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Stay updated with the latest news, trends, and insights.
          </p>
          <div className="flex space-x-4 mt-6">
            {socialLinks.map(({ Icon, href }, index) => (
              <a
                key={index}
                href={href}
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon size={24} />
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        {sections.map((section, index) => (
          <div key={index}>
            <h3 className="font-semibold text-lg mb-5 text-white">{section.title}</h3>
            <ul className="space-y-3">
              {section.links.map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Copyright */}
      <div className="mt-12 pt-8 border-t border-gray-700 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} NewsHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;