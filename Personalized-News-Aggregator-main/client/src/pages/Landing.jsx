import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Globe, BookOpen } from "lucide-react";
import bg from "../assets/landing-bg.jpeg";

function Landing() {
  const navigate = useNavigate();

  const handleLogin = () => {
    try {
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = () => {
    try {
      navigate("/register");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <div className="relative h-screen">
        {/* Background Image */}
        <img
          src={bg} // <-- Ensure the image path is correct
          alt="News Background"
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/60 -z-10" />

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between p-6">
          <div>
            <span className=" text-white font-extrabold text-6xl">News</span>
            <span className="text-yellow-600 font-bold text-6xl">Hub</span>
            <pre className="text-white font-mono font-bold text-xl">
              {" "}
              News at Your Fingertips
            </pre>
          </div>

          <div className="space-x-6">
            <button className="text-white hover:bg-yellow-600 rounded-full p-4.5 font-bold text-lg transition-colors duration-300 cursor-pointer" onClick={handleLogin}>
              Sign In
            </button>
            <button className="bg-white text-yellow-950 font-bold text-lg px-4 py-2 rounded-lg hover:bg-yellow-600 transition-transform transform hover:scale-105 cursor-pointer" onClick={handleRegister}>
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Content within Black Div */}
        <div className="relative z-10 max-w-4xl mx-auto text-center pt-32 px-4">
          <div className="bg-yellow-950 backdrop-opacity-75 p-10 rounded-lg">
            <h1 className="text-5xl font-bold text-white mb-6">
              Your World of News in One Place
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Stay informed with personalized news from thousands of sources,
              all curated just for you.
            </p>
            <div className="flex justify-center">
              <button className="bg-white text-yellow-950 font-bold px-8 py-3 rounded-lg text-xl hover:bg-yellow-600 transition-transform transform hover:scale-105 cursor-pointer" onClick={handleRegister}>
                Start Reading
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
            Why Choose NewsHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Globe className="w-8 h-8 text-yellow-950" />}
              title="Nationwide News Coverage"
              description="Access news from thousands of sources across India, all in one platform."
            />
            <FeatureCard
              icon={<Search className="w-8 h-8 text-yellow-950" />}
              title="Smart Filtering"
              description="Our AI helps you find the news that matters most to you."
            />
            <FeatureCard
              icon={<BookOpen className="w-8 h-8 text-yellow-950" />}
              title="Easy Reading"
              description="Clean, distraction-free reading experience optimized for all devices."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-yellow-950 backdrop-opacity-75 py-16 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your News Experience?
          </h2>
          <p className="mb-8">
            Join thousands of readers who trust NewsHub for their daily news
            updates.
          </p>
          <button className="bg-white text-yellow-950 font-bold px-8 py-3 rounded-lg text-lg hover:bg-yellow-600 transition-transform transform hover:scale-105 cursor-pointer" onClick={handleRegister}>
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-50 shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default Landing;
