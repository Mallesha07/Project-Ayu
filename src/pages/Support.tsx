import { motion } from "motion/react";
import { HelpCircle, Mail, Phone, MessageCircle, FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Support() {
  const faqs = [
    {
      question: "How do I care for my medicinal plants?",
      answer: "Each plant comes with specific care instructions. Generally, ensure they get adequate sunlight, water them when the top inch of soil is dry, and use organic fertilizers.",
    },
    {
      question: "What is included in the garden setup service?",
      answer: "Our service includes a consultation, plant selection, premium pots, soil preparation, planting, and an initial care guide. Premium packages include automated watering and extended support.",
    },
    {
      question: "Do you offer refunds or replacements?",
      answer: "Yes, we offer a 7-day replacement guarantee if your plant arrives damaged or unhealthy. Please contact our support team with photos.",
    },
    {
      question: "How does the AI Assistant work?",
      answer: "Our AI Assistant is trained on extensive botanical and Ayurvedic knowledge. You can ask it about plant identification, care routines, and medicinal uses.",
    },
  ];

  return (
    <div className="pt-32 pb-20 px-6 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-[#1A2E24]">
            How can we <span className="text-[#2D5A43]">help?</span>
          </h1>
          <p className="text-[#5C7166] text-lg">
            Find answers to common questions or get in touch with our team.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#F4F9F6] p-8 rounded-[2rem] border border-[#E8F3ED] text-center space-y-4 hover:border-[#2D5A43] transition-colors">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-[#2D5A43]">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#1A2E24]">Call Us</h3>
            <p className="text-[#5C7166] text-sm">+91 1800-123-4567</p>
            <p className="text-xs text-gray-400">Mon-Fri, 9am-6pm</p>
          </div>
          <div className="bg-[#F4F9F6] p-8 rounded-[2rem] border border-[#E8F3ED] text-center space-y-4 hover:border-[#2D5A43] transition-colors">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-[#2D5A43]">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#1A2E24]">Email Us</h3>
            <p className="text-[#5C7166] text-sm">support@projectayu.com</p>
            <p className="text-xs text-gray-400">We reply within 24 hours</p>
          </div>
          <div className="bg-[#F4F9F6] p-8 rounded-[2rem] border border-[#E8F3ED] text-center space-y-4 hover:border-[#2D5A43] transition-colors">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-[#2D5A43]">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#1A2E24]">Live Chat</h3>
            <p className="text-[#5C7166] text-sm">Chat with our experts</p>
            <Link to="/ai-assistant" className="text-xs text-[#2D5A43] font-bold hover:underline">
              Try AI Assistant
            </Link>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-8 h-8 text-[#2D5A43]" />
            <h2 className="text-3xl font-bold text-[#1A2E24]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-[#F4F9F6] rounded-[2rem] border border-[#E8F3ED] [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-[#1A2E24]">
                  {faq.question}
                  <ChevronRight className="w-5 h-5 text-[#5C7166] transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-6 pb-6 text-[#5C7166] leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Policies */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="#" className="flex items-center gap-4 p-6 bg-[#F4F9F6] rounded-[2rem] hover:bg-[#E8F3ED] transition-colors border border-[#E8F3ED]">
            <FileText className="w-8 h-8 text-[#2D5A43]" />
            <div>
              <h3 className="font-bold text-[#1A2E24]">Privacy Policy</h3>
              <p className="text-sm text-[#5C7166]">Read how we protect your data</p>
            </div>
          </Link>
          <Link to="#" className="flex items-center gap-4 p-6 bg-[#F4F9F6] rounded-[2rem] hover:bg-[#E8F3ED] transition-colors border border-[#E8F3ED]">
            <FileText className="w-8 h-8 text-[#2D5A43]" />
            <div>
              <h3 className="font-bold text-[#1A2E24]">Terms of Service</h3>
              <p className="text-sm text-[#5C7166]">Our rules and guidelines</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
