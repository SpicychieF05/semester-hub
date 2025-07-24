import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative h-[600px]">
      <Image
        src="/assets/hero-image.jpg"
        alt="Hero Image"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Semester Hub</h1>
        <p className="text-xl mb-8">Your one-stop platform for sharing and finding semester notes.</p>
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600">Browse Notes</button>
          <button className="bg-gray-700 text-white px-6 py-3 rounded-md hover:bg-gray-800">Share Notes</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
