export default function ProfilePage({ params }: { params: { username: string } }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile of {params.username}</h1>
      <p>This is the profile page for {params.username}.</p>
    </div>
  );
}


