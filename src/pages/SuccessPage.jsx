import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-teal-50 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md text-center border border-gray-100">
        <div className="flex justify-center"> ‍<span className="h-12 w-12 inline-flex items-center justify-center bg-green-500 rounded-full"><Check className="text-white stroke-2" size={35} /></span> </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Post Created Successfully!
        </h1>
        <p className="text-gray-600 mb-6">
          Your LinkedIn post has been shared successfully.
        </p>

        <Link
          to="/"
          className="px-5 py-2 font-medium text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-600 hover:to-blue-600 transition shadow-md"
        >
          Create Another Post ✨
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;