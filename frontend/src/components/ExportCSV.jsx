import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
const API_URL = import.meta.env.VITE_API_URL;

const ExportCSV = ({ request_id }) => {

    console.log("Received request_id:", request_id);

    const [csvData, setCsvData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Reset CSV data and error when request_id changes
    useEffect(() => {
        setCsvData([]);
        setError("");
    }, [request_id]);

    const fetchAndPrepareCSV = async () => {
        if (!request_id?.trim()) {
            setError("Request ID is required. Please upload a valid CSV.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // console.log(API_URL);

            const response = await fetch(`${API_URL}/api/request-status/${request_id}`)
            if (!response.ok) {
                throw new Error("Request not found or failed.");
            }

            const data = await response.json();
            console.log("Fetched product data:", data);

            const formattedData = data.products.map((item) => ({
                "Request ID": item.request_id,
                "Product Name": item.product_name,
                "Input Image Urls": item.input_images_urls.join(" | "),
                "Output Image Urls": item.output_images.join(" | "),
                "Status": item.status,
            }));

            setCsvData(formattedData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {csvData.length > 0 ? (
                <CSVLink
                    data={csvData}
                    filename="exported_data.csv"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Download CSV
                </CSVLink>
            ) : (
                <button
                    onClick={fetchAndPrepareCSV}
                    disabled={!request_id || loading}
                    className={`px-6 py-3 rounded ${loading || !request_id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                >
                    {loading ? "Fetching..." : "Prepare & Download CSV"}
                </button>
            )}

            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default ExportCSV;
