import { Phone, Mail } from "lucide-react";

const ReachOut = () => {
  return (
    <div className="min-h-screen bg-orange-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-2xl w-full flex flex-col items-center p-8">
        {/* Title Section */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Contact Information</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Anuroop Anand Perli</h2>
        
        {/* Description */}
        <p className="text-lg text-gray-600 mb-6 text-center">
          Reach out to Anuroop Anand Perli regarding posting a job on our platform or any other queries.
        </p>

        {/* Contact Information with neumorphic buttons */}
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center">
            <a
              href="tel:+918328113997"
              className="rounded-full shadow-neumorphism hover:shadow-neumorphism-active transition-shadow duration-300 p-4 bg-gray-100 flex items-center text-gray-700 hover:text-orange-600"
            >
              <Phone className="text-orange-600 w-6 h-6 mr-2" />
              +91 83281 13997
            </a>
          </div>
          <div className="flex items-center justify-center">
            <a
              href="mailto:anuroopanandperli.iitkgp@gmail.com"
              className="rounded-full shadow-neumorphism hover:shadow-neumorphism-active transition-shadow duration-300 p-4 bg-gray-100 flex items-center text-gray-700 hover:text-orange-600 break-all"
            >
              <Mail className="text-orange-600 w-6 h-6 mr-2" />
              anuroop@ruthi.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReachOut;
