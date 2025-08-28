interface Comment {
  id: string;
  username: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
}

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2 text-white">Comments</h2>
      {comments.length === 0 ? (
        <p className="text-gray-400">No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="flex items-start space-x-3 mb-4">
            <img src={comment.avatarUrl} alt={comment.username} className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-white font-semibold">{comment.username} <span className="text-gray-500 text-sm">{comment.createdAt}</span></p>
              <p className="text-gray-300">{comment.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}


