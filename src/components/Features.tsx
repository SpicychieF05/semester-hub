import Image from 'next/image';

const Features = () => {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <Image
              src="/images/browse-notes.png"
              alt="Browse Notes"
              width={150}
              height={150}
              className="mx-auto mb-6"
            />
            <h3 className="text-xl font-bold mb-2">Browse Notes</h3>
            <p className="text-gray-600">Find the notes you need from a vast collection shared by students.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <Image
              src="/images/share-notes.png"
              alt="Share Notes"
              width={150}
              height={150}
              className="mx-auto mb-6"
            />
            <h3 className="text-xl font-bold mb-2">Share Notes</h3>
            <p className="text-gray-600">Contribute to the community by uploading your own notes.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <Image
              src="/images/request-notes.png"
              alt="Request Notes"
              width={150}
              height={150}
              className="mx-auto mb-6"
            />
            <h3 className="text-xl font-bold mb-2">Request Notes</h3>
            <p className="text-gray-600">Request specific notes that you can't find in the collection.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
