import Header from '@/components/Header';

const notes = [
  { id: 1, title: 'Introduction to Python', description: 'A comprehensive guide to the basics of Python programming.' },
  { id: 2, title: 'Advanced Calculus', description: 'In-depth notes on advanced calculus topics.' },
  { id: 3, title: 'Web Development with React', description: 'Learn how to build modern web applications with React.' },
  { id: 4, title: 'Database Management Systems', description: 'An overview of database concepts and SQL.' },
  { id: 5, title: 'Machine Learning Fundamentals', description: 'A beginner-friendly introduction to machine learning.' },
  { id: 6, title: 'Data Structures and Algorithms', description: 'A deep dive into common data structures and algorithms.' },
];

const BrowseNotesPage = () => {
  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Browse Notes</h1>
          <div className="max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search for notes..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notes.map((note) => (
            <div key={note.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">{note.title}</h2>
              <p className="text-gray-600">{note.description}</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowseNotesPage;