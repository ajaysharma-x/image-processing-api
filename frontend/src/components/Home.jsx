import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExportCSV from "./ExportCSV";

const Home = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [requestid, setRequestId] = useState(null)
    const [csd, setCsd] = useState(null);

    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError(null)
    };

    const handleUpload = async (e) => {

        e.preventDefault();
        setError(null);
        setMessage(null);

        if (!file) {
            alert("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("csvFile", file);

        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/upload-csv", {
                method: "POST",
                body: formData,
            });

            console.log(response);

            const data = await response.json();
            setRequestId(data.request_id);
            if (!response.ok) {
                throw new Error(data.error || "Upload failed");
            }

            if (data.failedImages && data.failedImages.length > 0) {
                console.warn("Some images failed to compress:", data.failedImages);
                setError(`Make sure the URL is an actual image. Some images failed to compress: ${data.failedImages.map(f => f.imageUrl).join(", ")}`);
            } else {
                setMessage("Image upload successfully.");
                console.log("Upload successful:", data);
            }

        } catch (err) {
            console.error("Error uploading CSV:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mt-6 mb-9">
    🚀 Image Processing System  
    <span className="block text-lg text-gray-600 mt-2">Optimize, Compress & Enhance Effortlessly</span>
</h1>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    
                    <h2 className="text-2xl font-bold mb-4">Upload CSV File</h2>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <label className="border border-gray-300 p-2 rounded w-full flex items-center justify-between cursor-pointer bg-white hover:bg-gray-100">
                            <span className="text-gray-700">Choose a CSV file</span>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="border p-2 rounded w-full"
                            />
                        </label>
                        <div className="flex justify-center items-center mt-4">
    <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 w-60 rounded hover:bg-blue-600 
                   disabled:bg-gray-400 disabled:cursor-not-allowed text-center"
        disabled={loading}
    >
        {loading ? "Processing File. Please Wait..." : "Upload CSV"}
    </button>
</div>



                    </form>
                </div>

                {error && (
                    <p className="mt-4 text-lg text-red-500">
                        Upload failed. Request ID: {requestid} <br />
                        {error} <br />
                    </p>
                )}

                {message && !error && (
                    <p className="mt-4 text-lg text-green-600">
                        {message} <br />
                        This is your Request ID: {requestid}
                    </p>
                )}

                <div className="bg-white mt-20 ml-6 p-6 rounded-lg shadow-lg flex flex-col items-center">
                    <div className="flex gap-4">
                        {/* <button
                            onClick={() => navigate("/export-csv")}
                            className={`px-6 py-3 rounded-lg transition duration-300 ${message
                                    ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                                }`}
                            disabled={!message} // Button disabled when message is null
                        >
                            Download CSV
                        </button> */}
                        <ExportCSV request_id={requestid} />

                        <button
                            onClick={() => navigate("/request-status")}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Check Request Status
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Home;