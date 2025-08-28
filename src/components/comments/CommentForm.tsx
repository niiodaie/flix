export function CommentForm() {
  return (
    <div className="mt-4">
      <textarea
        className="w-full p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
        placeholder="Add a comment..."
        rows={3}
      ></textarea>
      <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Post Comment</button>
    </div>
  );
}


