export function TipDialog() {
  return (
    <div className="p-4 border border-gray-700 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Send a Tip to Creator</h2>
      <input
        type="number"
        placeholder="Amount (e.g., 5.00)"
        className="w-full p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
      />
      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Send Tip</button>
    </div>
  );
}


