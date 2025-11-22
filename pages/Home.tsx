
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Icons } from '../constants';
import { StorageService } from '../services/storageService';
import { SiteSettings } from '../types';

const staffMembers = [
  {
    id: 1,
    name: 'Mr. John Doe',
    role: 'Senior Math Teacher',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'Inspiring students to love numbers for over 15 years.'
  },
  {
    id: 2,
    name: 'Ms. Jane Smith',
    role: 'Music & Arts Director',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'Creativity is intelligence having fun.'
  },
  {
    id: 3,
    name: 'Mr. Alan Brown',
    role: 'Head Sports Coach',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'Champions are made when no one is watching.'
  },
  {
    id: 4,
    name: 'Mrs. Emily White',
    role: 'School Librarian',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'Opening worlds through books.'
  },
  {
    id: 5,
    name: 'Dr. Michael Ross',
    role: 'Science Dept. Head',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'Curiosity is the engine of achievement.'
  },
  {
    id: 6,
    name: 'Ms. Sarah Lee',
    role: 'Language Arts',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'Words have the power to change the world.'
  }
];

const Home: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Auto-play slider
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % (settings.heroImages.length || 1));
    }, 5000); // 5 seconds per slide
    return () => clearInterval(interval);
  }, [settings.heroImages.length]);

  return (
    <div className="pb-12 animate-fade-in">
      {/* Hero Section with Slider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section className="relative bg-gray-900 text-white h-[500px] flex items-center justify-center group rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 overflow-hidden">
             {settings.heroImages.length > 0 ? (
               settings.heroImages.map((img, index) => (
                  <img 
                    key={index}
                    src={img} 
                    alt={`Hero ${index}`} 
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-60' : 'opacity-0'}`} 
                  />
               ))
             ) : (
               <div className="w-full h-full bg-blue-800 opacity-60"></div>
             )}
             {/* Gradient Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 text-center z-10 pb-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-md">{settings.schoolName}</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto mb-8 drop-shadow-sm">
              Empowering the next generation of leaders, thinkers, and innovators through holistic education.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/news" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition shadow-lg">
                Latest News
              </Link>
              <Link to="/performance" className="bg-blue-600 border border-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition shadow-lg">
                Academic Results
              </Link>
            </div>
          </div>

          {/* Marquee Announcement - Bottom of Hero */}
          {settings.marqueeText && (
            <div className="absolute bottom-0 left-0 w-full bg-blue-900/90 backdrop-blur-sm text-white py-3 overflow-hidden z-20 border-t border-white/10">
               <div className="whitespace-nowrap animate-marquee text-sm font-medium tracking-wide">
                 {settings.marqueeText}
               </div>
            </div>
          )}
        </section>
      </div>

      {/* Administration Profiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center mb-10">
           <h2 className="text-3xl font-bold text-gray-900">School Administration</h2>
           <p className="text-gray-600 mt-2">Meet the leaders guiding our vision and excellence.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Director */}
          <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition duration-300">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-blue-100 shadow-md">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Director" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Dr. James Anderson</h3>
            <span className="text-blue-600 font-medium text-sm mb-6 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">School Director</span>
            <div className="relative bg-gray-50 p-4 rounded-xl mt-2">
               <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-blue-200 bg-white rounded-full p-1">
                  <Icons.Quote />
               </div>
               <p className="text-gray-600 italic text-sm relative z-10 pt-2">
                 "Our mission is to foster an environment where every child discovers their potential. We are building not just a school, but a legacy of excellence for generations to come."
               </p>
            </div>
          </Card>

          {/* Headteacher */}
          <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition duration-300">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-green-100 shadow-md">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Headteacher" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Mrs. Sarah Jenkins</h3>
            <span className="text-green-600 font-medium text-sm mb-6 uppercase tracking-wider bg-green-50 px-3 py-1 rounded-full">Headteacher</span>
             <div className="relative bg-gray-50 p-4 rounded-xl mt-2">
               <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-green-200 bg-white rounded-full p-1">
                  <Icons.Quote />
               </div>
               <p className="text-gray-600 italic text-sm relative z-10 pt-2">
                 "Discipline, integrity, and hard work are the cornerstones of success. We strive to mold students who are not only academically brilliant but also morally upright."
               </p>
            </div>
          </Card>

          {/* D.o.S */}
          <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition duration-300">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-purple-100 shadow-md">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="D.o.S" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Mr. Robert Chen</h3>
            <span className="text-purple-600 font-medium text-sm mb-6 uppercase tracking-wider bg-purple-50 px-3 py-1 rounded-full">Director of Studies</span>
             <div className="relative bg-gray-50 p-4 rounded-xl mt-2">
               <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-purple-200 bg-white rounded-full p-1">
                  <Icons.Quote />
               </div>
               <p className="text-gray-600 italic text-sm relative z-10 pt-2">
                 "Academic rigor is our priority. We ensure a curriculum that challenges the mind and prepares our students for the competitive global landscape."
               </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Dedicated Staff Marquee Section */}
      <section className="bg-gray-50 py-16 border-y border-gray-200 mt-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center mb-10">
           <h2 className="text-3xl font-bold text-gray-900">Our Dedicated Staff</h2>
           <p className="text-gray-600 mt-2">The passionate educators inspiring excellence every day.</p>
        </div>
        
        <div className="relative flex overflow-x-hidden">
           <div className="py-4 animate-marquee whitespace-nowrap flex gap-8">
             {/* Duplicate list for seamless loop */}
             {[...staffMembers, ...staffMembers].map((staff, index) => (
                <div key={`${staff.id}-${index}`} className="inline-block w-72 whitespace-normal">
                 <Card className="h-full p-6 flex flex-col items-center text-center bg-white hover:shadow-lg transition-shadow duration-300 border-gray-200">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-blue-100">
                      <img src={staff.photo} alt={staff.name} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">{staff.name}</h4>
                    <span className="text-blue-600 text-sm font-medium mb-3">{staff.role}</span>
                    <p className="text-gray-500 text-sm leading-relaxed italic">"{staff.bio}"</p>
                 </Card>
               </div>
             ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
