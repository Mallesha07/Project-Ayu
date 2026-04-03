import { Link } from "react-router-dom";
import { Leaf, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1A2E24] text-[#F9FBFA] py-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[#2D5A43] p-1.5 rounded-xl">
              <Leaf className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Project Ayu</span>
          </Link>
          <p className="text-[#5C7166] text-sm leading-relaxed max-w-xs">
            Empowering green living through medicinal plants and personalized
            garden care. Join our mission for a healthier planet.
          </p>
          <div className="flex gap-3">
            <a href="#" className="p-1.5 bg-[#2D5A43]/20 rounded-full hover:bg-[#2D5A43]/40 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-1.5 bg-[#2D5A43]/20 rounded-full hover:bg-[#2D5A43]/40 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-1.5 bg-[#2D5A43]/20 rounded-full hover:bg-[#2D5A43]/40 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-base font-bold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-[#5C7166]">
            <li><Link to="/shop" className="hover:text-white transition-colors">Shop Plants</Link></li>
            <li><Link to="/booking" className="hover:text-white transition-colors">Garden Services</Link></li>
            <li><Link to="/ai-assistant" className="hover:text-white transition-colors">AI Assistant</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-base font-bold mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-[#5C7166]">
            <li><Link to="/support" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link to="/support" className="hover:text-white transition-colors">Shipping Info</Link></li>
            <li><Link to="/support" className="hover:text-white transition-colors">Returns Policy</Link></li>
            <li><Link to="/support" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-base font-bold mb-3">Contact Us</h4>
          <ul className="space-y-2 text-sm text-[#5C7166]">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#2D5A43]" />
              <span>hello@projectayu.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#2D5A43]" />
              <span>+91 6361973240</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#2D5A43]" />
              <span>Bangalore North, Karnataka</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-[#2D5A43]/20 text-center text-[#5C7166] text-xs">
        <p>&copy; {new Date().getFullYear()} Project Ayu. All rights reserved.</p>
      </div>
    </footer>
  );
}
