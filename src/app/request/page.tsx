"use client";

import Header from '@/components/Header';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const RequestNotesPage = () => {
  const { data: session, status } = useSession();
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCategory, setNoteCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (status !== 'authenticated') {
      setError('You must be logged in to submit a request.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note_title: noteTitle,
          note_category: noteCategory,
          description,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit request');
      }

      setSuccess('Request submitted successfully!');
      setNoteTitle('');
      setNoteCategory('');
      setDescription('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Request Notes</h1>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-center mb-4">{success}</p>}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="noteTitle">
                Note Title <span className="text-red-500">*</span>
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="noteTitle"
                type="text"
                placeholder="e.g., Linear Algebra"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="noteCategory">
                Note Category
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="noteCategory"
                type="text"
                placeholder="e.g., Math, Physics, Computer Science"
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Details
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                id="description"
                placeholder="Please provide any specific details about the notes you need..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                type="submit"
                disabled={loading || status !== 'authenticated'}
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
            {status !== 'authenticated' && (
              <p className="text-center text-gray-500 text-sm mt-4">Please log in to submit a request.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestNotesPage;