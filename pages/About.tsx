
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Icons } from '../constants';
import { StorageService } from '../services/storageService';
import { Testimonial, StudentPerformance } from '../types';

const About: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [allStudents, setAllStudents] = useState<StudentPerformance[]>([]);
  
  // State for "Authentication" simulation
  const [currentUser, setCurrentUser] = useState<{name: string, userClass: string} | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [loginClass, setLoginClass] = useState('');
  const [loginError, setLoginError] = useState('');

  // State for New Review Form
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTestimonials(StorageService.getTestimonials());
    setAllStudents(StorageService.getPerformance());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginName || !loginClass) {
        setLoginError('Please fill in all fields.');
        return;
    }

    // Normalize inputs for case-insensitive comparison
    const normalizedLoginName = loginName.trim().toLowerCase();
    
    // Check if student exists in our performance records
    // We check if the name matches and if the year (class) matches roughly. 
    // Since user might enter "Class of 2015" or just "2015", we try to match the year.
    const match = allStudents.find(student => {
        const nameMatch = student.studentName.toLowerCase() === normalizedLoginName;
        const yearMatch = loginClass.includes(student.year.toString());
        return nameMatch && yearMatch;
    });

    if (match) {
      setCurrentUser({ name: match.studentName, userClass: loginClass }); 
      setIsLoginModalOpen(false);
      setIsWritingReview(true); // Auto open review form after login
      // Reset login fields
      setLoginName('');
      setLoginClass('');
    } else {
      setLoginError('Alumni record not found. Please ensure your name and class year match our records.');
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size too large. Please choose an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      userName: currentUser.name,
      userClass: currentUser.userClass,
      content: reviewContent,
      rating: reviewRating,
      date: new Date().toISOString(),
      userPhoto: userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random`
    };

    StorageService.addTestimonial(newTestimonial);
    setTestimonials([newTestimonial, ...testimonials]);
    
    // Reset form
    setReviewContent('');
    setReviewRating(5);
    setUserPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsWritingReview(false);
    alert("Thank you for your review!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Building a legacy of excellence, integrity, and holistic education for over 30 years.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <img 
            src="https://picsum.photos/800/600?random=about" 
            alt="School Campus" 
            loading="lazy"
            className="rounded-2xl shadow-lg w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
          <p className="text-gray-600 leading-relaxed">
            Founded in 1990, Brilliant Primary School began with a simple mission: to provide a nurturing environment where every child can flourish. From a humble beginning with just 50 students, we have grown into a premier institution known for academic rigor and character development.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our campus has expanded to include state-of-the-art science labs, a dedicated arts center, and expansive sports facilities, ensuring that our students have every opportunity to explore their passions.
          </p>
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Card className="p-8 border-t-4 border-t-blue-600">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <Icons.Academic />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
          </div>
          <p className="text-gray-600">
            To empower students with the knowledge, skills, and values necessary to become responsible global citizens and lifelong learners in a rapidly changing world.
          </p>
        </Card>

        <Card className="p-8 border-t-4 border-t-green-600">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <Icons.Sparkles />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
          </div>
          <p className="text-gray-600">
            To be a beacon of educational excellence, inspiring a community of innovators, critical thinkers, and compassionate leaders who create positive change.
          </p>
        </Card>
      </div>

      {/* Core Values */}
      <div className="bg-gray-50 rounded-3xl p-8 md:p-12 text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Core Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Excellence', desc: 'Striving for the highest standards in all endeavors.' },
            { title: 'Integrity', desc: 'Upholding honesty and strong moral principles.' },
            { title: 'Inclusivity', desc: 'Celebrating diversity and fostering a sense of belonging.' },
            { title: 'Innovation', desc: 'Embracing creativity and new ways of learning.' }
          ].map((value, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h4>
              <p className="text-gray-600 text-sm">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mb-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="text-left mb-6 md:mb-0">
            <h2 className="text-3xl font-bold text-gray-900">What Our Alumni Say</h2>
            <p className="text-gray-600 mt-2">Real stories from the students we've nurtured.</p>
          </div>
          
          {!isWritingReview && (
            <button 
              onClick={() => currentUser ? setIsWritingReview(true) : setIsLoginModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-md flex items-center gap-2"
            >
              <Icons.Pencil /> {currentUser ? 'Write a Review' : 'Alumni Login to Review'}
            </button>
          )}
        </div>

        {/* Write Review Form */}
        {isWritingReview && currentUser && (
          <Card className="p-8 mb-10 border-2 border-blue-100 bg-blue-50/50 animate-fade-in">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-xl font-bold text-gray-900">Write your testimonial as {currentUser.name}</h3>
               <button onClick={() => setIsWritingReview(false)} className="text-gray-400 hover:text-gray-600">
                 <Icons.Close />
               </button>
             </div>
             <form onSubmit={handleSubmitReview} className="space-y-4">
               <div className="grid md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
                   <div className="flex gap-1">
                     {[1, 2, 3, 4, 5].map((star) => (
                       <button
                         key={star}
                         type="button"
                         onClick={() => setReviewRating(star)}
                         className={`text-2xl focus:outline-none transition-colors ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}`}
                       >
                         ★
                       </button>
                     ))}
                   </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture (Optional)</label>
                    <div className="flex items-center gap-3">
                      {userPhoto && (
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shrink-0">
                          <img src={userPhoto} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <label className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 border-dashed rounded-md hover:bg-white text-sm font-medium text-gray-600 transition-colors bg-white/50">
                        <Icons.Photo />
                        <span className="truncate">{userPhoto ? 'Change Photo' : 'Upload Photo'}</span>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          className="hidden" 
                          accept="image/*" 
                          onChange={handlePhotoChange}
                        />
                      </label>
                      {userPhoto && (
                        <button 
                          type="button"
                          onClick={() => { setUserPhoto(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Icons.Trash />
                        </button>
                      )}
                    </div>
                 </div>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Your Story</label>
                 <textarea
                   required
                   rows={4}
                   className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                   placeholder="Share your experience with us..."
                   value={reviewContent}
                   onChange={(e) => setReviewContent(e.target.value)}
                 />
               </div>
               <div className="flex justify-end">
                 <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
                   Submit Review
                 </button>
               </div>
             </form>
          </Card>
        )}

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={testimonial.userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.userName)}&background=random`} 
                  alt={testimonial.userName} 
                  loading="lazy"
                  className="w-12 h-12 rounded-full object-cover bg-gray-200 border border-gray-100"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.userName}</h4>
                  <p className="text-sm text-blue-600 font-medium">{testimonial.userClass}</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3 text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < testimonial.rating ? '★' : '☆'}</span>
                ))}
              </div>
              <p className="text-gray-600 italic text-sm leading-relaxed flex-grow">
                "{testimonial.content}"
              </p>
              <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
                Posted on {new Date(testimonial.date).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Alumni Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-gray-900">Alumni Identification</h3>
                 <button onClick={() => setIsLoginModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                   <Icons.Close />
                 </button>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                To maintain the authenticity of our reviews, please verify your identity against our records.
              </p>
              
              {loginError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class Year</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={loginClass}
                    onChange={(e) => setLoginClass(e.target.value)}
                    placeholder="e.g. Class of 2023"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter your graduation year (e.g., 2023).</p>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 mt-2">
                  Verify & Continue
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
