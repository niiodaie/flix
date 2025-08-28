export function VideoUploader() {
  return (
    <div className="p-4 border border-gray-700 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Upload Your Video</h2>
      <input type="file" accept="video/*" className="block w-full text-sm text-gray-400
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100
      " />
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Upload</button>
    </div>
  );
}


