import { useState } from "react";

const RequestStatus = () => {
  const [requestId, setRequestId] = useState("");
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRequestStatus = async () => {
    if (!requestId.trim()) {
      setError("Request ID cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");
    setStatusData(null);

    try {
      const response = await fetch(`http://localhost:5000/api/request-status/${requestId}`);

      if (!response.ok) {
        throw new Error("Request not found or failed.");
      }

      const data = await response.json();
      console.log("this is product data:" ,data);
      
      setStatusData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Check Request Status</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Request ID"
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
          className="p-2 border rounded-md w-64"
        />
        <button
          onClick={fetchRequestStatus}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Check Status
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {statusData && (
        <div className="bg-white p-4 rounded-md shadow-md w-80">
          <h3 className="text-lg font-semibold">Request Details</h3>
          <p><strong>Request ID:</strong> {statusData.request_id}</p>
          <p><strong>Status:</strong> {statusData.status}</p>

          {statusData.products && (
            <div>
              <h4 className="font-semibold mt-2">Products:</h4>
              <ul className="list-disc pl-5">
                {statusData.products.map((product, index) => (
                  <li key={index}>
                    {product.product_name} - {product.status}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestStatus;
