import { Phone, Mail } from "lucide-react";
import Ruthi_Founder from "../assets/Ruthi_Founder.png";

const ReachOut = () => {
  return (
    <div className="min-h-screen bg-orange-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2 h-64 md:h-auto">
          <img
            src={Ruthi_Founder}
            alt="Anuroop Perli"
            className="w-full h-full object-contain"
          />
        </div>
        {/* Text Section */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Anuroop Anand Perli</h1>
          <p className="text-lg text-gray-600 mb-6">
            Reach out to Anuroop Anand Perli regarding posting a job on our platform or any other queries.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="text-orange-600 w-6 h-6" />
              <a
                href="tel:+918328113997"
                className="text-gray-700 hover:text-orange-600 transition-colors"
              >
                +91 83281 13997
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="text-orange-600 w-6 h-6" />
              <a
                href="mailto:anuroopanandperli.iitkgp@gmail.com"
                className="text-gray-700 hover:text-orange-600 transition-colors break-all"
              >
                anuroopanandperli.iitkgp@gmail.com
              </a>
            </div>
          </div>
          <button className="mt-8 bg-orange-600 text-white py-2 px-6 rounded-full hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50">
            Contact Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReachOut;
