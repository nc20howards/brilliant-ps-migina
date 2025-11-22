
import React, { useState, useEffect, useRef } from 'react';
import { StorageService } from '../../services/storageService';
import { GeminiService } from '../../services/geminiService';
import { BlogPost, PostCategory, StudentPerformance, SiteSettings } from '../../types';
import { Card } from '../../components/ui/Card';
import { Icons } from '../../constants';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'performance' | 'settings'>('posts');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [performances, setPerformances] = useState<StudentPerformance[]>([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  
  // Site Settings State - Initialize lazily to read from storage once
  const [settings, setSettings] = useState<SiteSettings>(() => StorageService.getSettings());
  
  // Initialize temp state from settings once, then let user control it
  const [tempMarquee, setTempMarquee] = useState(settings.marqueeText);
  const [tempSchoolName, setTempSchoolName] = useState(settings.schoolName);

  // Admin Credentials State
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Post Form State
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<PostCategory>(PostCategory.NEWS);
  const [postImage, setPostImage] = useState<string | null>(null);
  const [drafting, setDrafting] = useState(false);
  const postFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Post State
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState<PostCategory>(PostCategory.NEWS);
  const [editImage, setEditImage] = useState<string | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Performance Form State
  const [perfYear, setPerfYear] = useState(new Date().getFullYear());
  const [perfName, setPerfName] = useState('');
  const [perfAgg, setPerfAgg] = useState('');
  const [perfAchievement, setPerfAchievement] = useState('');
  const [perfImage, setPerfImage] = useState<string | null>(null);
  const perfFileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Edit Performance State
  const [editPerfModalOpen, setEditPerfModalOpen] = useState(false);
  const [editingPerf, setEditingPerf] = useState<StudentPerformance | null>(null);
  const [editPerfYear, setEditPerfYear] = useState(0);
  const [editPerfName, setEditPerfName] = useState('');
  const [editPerfAgg, setEditPerfAgg] = useState(0);
  const [editPerfAchievement, setEditPerfAchievement] = useState('');
  const [editPerfImage, setEditPerfImage] = useState<string | null>(null);
  const editPerfFileInputRef = useRef<HTMLInputElement>(null);

  // Settings Refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const sliderInputRef = useRef<HTMLInputElement>(null);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'post' | 'performance';
    id: string | null;
  }>({
    isOpen: false,
    type: 'post',
    id: null
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setPosts(StorageService.getPosts());
    setPerformances(StorageService.getPerformance());
    setSettings(StorageService.getSettings());
    
    // Load current admin creds
    const creds = StorageService.getAdminCreds();
    setAdminUsername(creds.username);
    setAdminPassword(creds.password);
  };

  const notifySettingsChange = () => {
    window.dispatchEvent(new Event('schola-settings-changed'));
  };

  const handlePostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size too large. Please choose an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size too large. Please choose an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePerfImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size too large. Please choose an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPerfImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditPerfImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size too large. Please choose an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPerfImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newSettings = { 
            ...settings, 
            schoolName: tempSchoolName,
            marqueeText: tempMarquee,
            logoUrl: reader.result as string 
        };
        StorageService.saveSettings(newSettings);
        setSettings(newSettings);
        notifySettingsChange();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSliderImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...settings.heroImages, reader.result as string];
        const newSettings = { 
            ...settings, 
            schoolName: tempSchoolName,
            marqueeText: tempMarquee,
            heroImages: newImages 
        };
        StorageService.saveSettings(newSettings);
        setSettings(newSettings);
        notifySettingsChange();
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSliderImage = (index: number) => {
    const newImages = settings.heroImages.filter((_, i) => i !== index);
    const newSettings = { 
        ...settings, 
        schoolName: tempSchoolName,
        marqueeText: tempMarquee,
        heroImages: newImages 
    };
    StorageService.saveSettings(newSettings);
    setSettings(newSettings);
    notifySettingsChange();
  };

  const saveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const newSettings = { 
        ...settings, 
        schoolName: tempSchoolName, 
        marqueeText: tempMarquee 
    };
    StorageService.saveSettings(newSettings);
    setSettings(newSettings);
    notifySettingsChange();
    alert("Settings saved successfully!");
  };
  
  const saveAdminCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername && adminPassword) {
      StorageService.saveAdminCreds({ username: adminUsername, password: adminPassword });
      alert("Admin credentials updated successfully! You will use these to login next time.");
    } else {
      alert("Username and password cannot be empty.");
    }
  };

  const handleAIDraft = async () => {
    if (!postTitle) {
      alert("Please enter a title/topic first so AI knows what to write about.");
      return;
    }
    setDrafting(true);
    try {
      const draft = await GeminiService.draftPost(postTitle, postCategory);
      setPostContent(draft);
    } catch (e) {
      alert("Failed to generate draft. Check API Key or console.");
    } finally {
      setDrafting(false);
    }
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: postTitle,
      content: postContent,
      category: postCategory,
      date: new Date().toISOString(),
      author: 'Admin',
      imageUrl: postImage || `https://picsum.photos/800/400?random=${Date.now()}`
    };
    StorageService.addPost(newPost);
    setPostTitle('');
    setPostContent('');
    setPostImage(null);
    if (postFileInputRef.current) postFileInputRef.current.value = '';
    refreshData();
    setCurrentPage(1); // Go to first page to see new post
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category);
    setEditImage(post.imageUrl || null);
    setEditModalOpen(true);
  };

  const handleUpdatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    const updatedPost: BlogPost = {
      ...editingPost,
      title: editTitle,
      content: editContent,
      category: editCategory,
      imageUrl: editImage || undefined
    };

    StorageService.updatePost(updatedPost);
    setEditModalOpen(false);
    setEditingPost(null);
    refreshData();
  };

  const openEditPerfModal = (perf: StudentPerformance) => {
    setEditingPerf(perf);
    setEditPerfYear(perf.year);
    setEditPerfName(perf.studentName);
    setEditPerfAgg(perf.agg);
    setEditPerfAchievement(perf.achievements);
    setEditPerfImage(perf.photoUrl || null);
    setEditPerfModalOpen(true);
  };

  const handleUpdatePerformance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPerf) return;

    const yearNum = Number(editPerfYear);
    const aggNum = Number(editPerfAgg);

    if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      alert("Please enter a valid year.");
      return;
    }
    if (isNaN(aggNum) || aggNum < 0) {
      alert("Please enter a valid AGG.");
      return;
    }

    const updatedPerf: StudentPerformance = {
      ...editingPerf,
      year: yearNum,
      studentName: editPerfName,
      agg: aggNum,
      achievements: editPerfAchievement,
      photoUrl: editPerfImage || undefined
    };

    StorageService.updatePerformance(updatedPerf);
    setEditPerfModalOpen(false);
    setEditingPerf(null);
    refreshData();
  };

  const promptDeletePost = (id: string) => {
    setDeleteModal({ isOpen: true, type: 'post', id });
  };

  const promptDeletePerf = (id: string) => {
    setDeleteModal({ isOpen: true, type: 'performance', id });
  };

  const executeDelete = () => {
    if (!deleteModal.id) return;

    if (deleteModal.type === 'post') {
      StorageService.deletePost(deleteModal.id);
      // Check if current page becomes empty
      if (currentPosts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } else {
      StorageService.deletePerformance(deleteModal.id);
    }
    
    refreshData();
    setDeleteModal({ ...deleteModal, isOpen: false });
  };

  const handleAddPerformance = (e: React.FormEvent) => {
    e.preventDefault();

    const yearNum = Number(perfYear);
    const aggNum = Number(perfAgg);

    if (!perfYear || isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      alert("Please enter a valid year between 1900 and 2100.");
      return;
    }

    if (!perfAgg || isNaN(aggNum) || aggNum < 0) {
      alert("Please enter a valid positive number for Aggregate (AGG).");
      return;
    }

    const newPerf: StudentPerformance = {
      id: Date.now().toString(),
      year: yearNum,
      studentName: perfName,
      agg: aggNum,
      grade: '12th Grade',
      achievements: perfAchievement,
      photoUrl: perfImage || `https://picsum.photos/200/200?random=${Date.now()}`
    };
    StorageService.addPerformance(newPerf);
    setPerfName('');
    setPerfAgg('');
    setPerfAchievement('');
    setPerfImage(null);
    if (perfFileInputRef.current) perfFileInputRef.current.value = '';
    refreshData();
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split('\n');
      const newPerfs: StudentPerformance[] = [];
      let successCount = 0;

      // Assume headers are in the first row, skip it if it contains "Year"
      const startIndex = lines[0].toLowerCase().includes('year') ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Expected format: Year, Name, AGG, Achievements
        const parts = line.split(',').map(p => p.trim());
        if (parts.length >= 3) {
          const year = parseInt(parts[0]);
          const name = parts[1];
          const agg = parseFloat(parts[2]);
          const achievements = parts.slice(3).join(', '); // Join remaining parts as achievements

          if (!isNaN(year) && name && !isNaN(agg)) {
            newPerfs.push({
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              year: year,
              studentName: name,
              agg: agg,
              grade: '12th Grade',
              achievements: achievements || '',
              // No photo in CSV, user can add later via Edit
              photoUrl: `https://picsum.photos/200/200?random=${Date.now() + i}`
            });
            successCount++;
          }
        }
      }

      if (newPerfs.length > 0) {
        StorageService.addBulkPerformance(newPerfs);
        refreshData();
        alert(`Successfully imported ${successCount} student records.`);
      } else {
        alert("No valid records found in file. Please ensure format is: Year, Name, AGG, Achievements");
      }
      
      if (csvInputRef.current) csvInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200 w-full sm:w-auto justify-center overflow-x-auto">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${activeTab === 'posts' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Manage Posts
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${activeTab === 'performance' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Manage Performance
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${activeTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Site Appearance
          </button>
        </div>
      </div>

      {activeTab === 'settings' && (
        <div className="space-y-8">
          {/* General Settings */}
          <Card className="p-6">
             <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
               <Icons.Settings /> General Settings
             </h2>
             <form onSubmit={saveGeneralSettings} className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={tempSchoolName}
                    onChange={(e) => setTempSchoolName(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Marquee Announcement Text</label>
                   <textarea
                    rows={2}
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={tempMarquee}
                    onChange={(e) => setTempMarquee(e.target.value)}
                    placeholder="Scrolling text at the top of the homepage..."
                   />
                </div>
                <div className="md:col-span-2">
                   <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
                      Save General Settings
                   </button>
                </div>
             </form>
          </Card>
          
          {/* Security Settings (New) */}
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-700">
              <Icons.Admin /> Admin Security
            </h2>
            <form onSubmit={saveAdminCreds} className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Username</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
                <input
                  type="password"
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-medium">
                  Update Credentials
                </button>
              </div>
            </form>
          </Card>

          {/* Logo Upload */}
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Icons.Photo /> School Logo
            </h2>
            <div className="flex items-center gap-6">
               <div className="w-24 h-24 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {settings.logoUrl ? (
                     <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                     <span className="text-gray-400 text-xs">No Logo</span>
                  )}
               </div>
               <div>
                  <input 
                    type="file" 
                    ref={logoInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleLogoChange} 
                  />
                  <button 
                    onClick={() => logoInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700"
                  >
                    <Icons.Upload /> Upload New Logo
                  </button>
                  <p className="text-xs text-gray-500 mt-2">Recommended size: Square or 1:1 aspect ratio.</p>
               </div>
            </div>
          </Card>

          {/* Hero Slider */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Icons.Slider /> Homepage Slider Images
              </h2>
              <input 
                type="file" 
                ref={sliderInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleSliderImageAdd} 
              />
              <button 
                onClick={() => sliderInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
              >
                <Icons.Plus /> Add Slide
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {settings.heroImages.map((img, idx) => (
                 <div key={idx} className="group relative h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={img} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeSliderImage(idx)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Slide"
                    >
                       <Icons.Trash />
                    </button>
                 </div>
               ))}
               {settings.heroImages.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500 italic">
                     No images in slider. Default styling will be used.
                  </div>
               )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Post Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold mb-4">Create New Post</h2>
              <form onSubmit={handleAddPost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title / Topic</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="e.g., Class of 1990 Reunion"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value as PostCategory)}
                  >
                    {Object.values(PostCategory).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                  <div className="flex items-center gap-4">
                    {postImage && (
                      <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden border border-gray-200">
                        <img src={postImage} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => { setPostImage(null); if (postFileInputRef.current) postFileInputRef.current.value = ''; }}
                          className="absolute top-0 right-0 bg-black/50 hover:bg-black/70 text-white p-0.5 rounded-bl"
                        >
                          <div className="w-3 h-3 flex items-center justify-center"><Icons.Close /></div>
                        </button>
                      </div>
                    )}
                    <label className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 border-dashed rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                      <Icons.Photo />
                      <span>{postImage ? 'Change Image' : 'Upload Image'}</span>
                      <input 
                        type="file" 
                        ref={postFileInputRef}
                        className="hidden" 
                        accept="image/*" 
                        onChange={handlePostImageChange}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <button
                      type="button"
                      onClick={handleAIDraft}
                      disabled={drafting}
                      className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium disabled:opacity-50"
                    >
                      <Icons.Sparkles /> {drafting ? 'Drafting...' : 'AI Draft'}
                    </button>
                  </div>
                  <textarea
                    required
                    rows={6}
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Write content here..."
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-medium flex items-center justify-center gap-2">
                  <Icons.Plus /> Publish Post
                </button>
              </form>
            </Card>
          </div>

          {/* List Posts */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Recent Posts</h2>
              <span className="text-sm text-gray-500">Page {currentPage} of {totalPages || 1}</span>
            </div>
            
            {currentPosts.map(post => (
              <Card key={post.id} className="overflow-hidden flex flex-col sm:flex-row group hover:shadow-md transition-shadow">
                {post.imageUrl && (
                  <div className="sm:w-48 h-48 sm:h-auto shrink-0 bg-gray-200 relative">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-3 mb-2">
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${post.category === PostCategory.ANNOUNCEMENT ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                            {post.category}
                          </span>
                          <span className="text-xs text-gray-400">{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{post.title}</h3>
                     </div>
                     <div className="flex items-center gap-1">
                       <button 
                          onClick={() => openEditModal(post)}
                          className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-all"
                          aria-label="Edit post"
                       >
                         <Icons.Pencil />
                       </button>
                       <button 
                          onClick={() => promptDeletePost(post.id)} 
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-all"
                          aria-label="Delete post"
                       >
                         <Icons.Trash />
                       </button>
                     </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
                </div>
              </Card>
            ))}
            
            {posts.length === 0 && <div className="text-gray-500 italic">No posts found.</div>}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icons.ChevronLeft />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`w-8 h-8 rounded-md text-sm font-medium ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icons.ChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Performance Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 lg:sticky lg:top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Add Student Record</h2>
              </div>
              
              {/* Bulk CSV Upload */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bulk Import (CSV)</label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 border-dashed rounded-md hover:bg-gray-50 text-sm font-medium text-gray-600 transition-colors">
                    <Icons.FileText />
                    <span>Select CSV File</span>
                    <input 
                      type="file" 
                      ref={csvInputRef}
                      className="hidden" 
                      accept=".csv" 
                      onChange={handleBulkUpload}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Format: Year, Name, AGG, Achievements
                </p>
              </div>

              <form onSubmit={handleAddPerformance} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    required
                    min="1900"
                    max="2100"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={perfYear}
                    onChange={(e) => setPerfYear(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={perfName}
                    onChange={(e) => setPerfName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Photo</label>
                  <div className="flex items-center gap-4">
                    {perfImage && (
                      <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden border border-gray-200">
                        <img src={perfImage} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => { setPerfImage(null); if (perfFileInputRef.current) perfFileInputRef.current.value = ''; }}
                          className="absolute top-0 right-0 bg-black/50 hover:bg-black/70 text-white p-0.5 rounded-full"
                        >
                          <div className="w-3 h-3 flex items-center justify-center"><Icons.Close /></div>
                        </button>
                      </div>
                    )}
                    <label className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 border-dashed rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                      <Icons.Photo />
                      <span>{perfImage ? 'Change Photo' : 'Upload Photo'}</span>
                      <input 
                        type="file" 
                        ref={perfFileInputRef}
                        className="hidden" 
                        accept="image/*" 
                        onChange={handlePerfImageChange}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">AGG</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={perfAgg}
                    onChange={(e) => setPerfAgg(e.target.value)}
                    placeholder="e.g. 8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Achievements</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={perfAchievement}
                    onChange={(e) => setPerfAchievement(e.target.value)}
                    placeholder="e.g. Best in Math, Valedictorian"
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-medium flex items-center justify-center gap-2">
                  <Icons.Plus /> Add Record
                </button>
              </form>
            </Card>
          </div>

          {/* List Performance */}
          <div className="lg:col-span-2 space-y-4">
             <h2 className="text-lg font-bold mb-4">Performance Records</h2>
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AGG</th>
                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {performances.map((perf) => (
                       <tr key={perf.id}>
                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{perf.year}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           <div className="flex items-center gap-3">
                             <img src={perf.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover bg-gray-200" />
                             {perf.studentName}
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{perf.agg}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                           <div className="flex justify-end gap-2">
                             <button 
                                onClick={() => openEditPerfModal(perf)} 
                                className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-2 py-1 rounded"
                                title="Edit Record"
                             >
                               <Icons.Pencil />
                             </button>
                             <button 
                                onClick={() => promptDeletePerf(perf.id)} 
                                className="text-red-600 hover:text-red-900 hover:bg-red-50 px-2 py-1 rounded"
                                title="Delete Record"
                             >
                               <Icons.Trash />
                             </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
             {performances.length === 0 && <div className="text-gray-500 italic">No records found.</div>}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">
            <div className="p-6">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                 <div className="bg-red-100 p-2 rounded-full">
                    <Icons.Trash /> 
                 </div>
                 <h3 className="text-lg font-bold text-gray-900">Confirm Deletion</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to permanently delete this {deleteModal.type === 'post' ? 'post' : 'record'}? 
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeDelete}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all scale-100">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-gray-900">Edit Post</h3>
                 <button onClick={() => setEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                   <Icons.Close />
                 </button>
              </div>
              
              <form onSubmit={handleUpdatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title / Topic</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as PostCategory)}
                  >
                    {Object.values(PostCategory).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                  <div className="flex items-center gap-4">
                    {editImage && (
                      <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden border border-gray-200">
                        <img src={editImage} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => { setEditImage(null); if (editFileInputRef.current) editFileInputRef.current.value = ''; }}
                          className="absolute top-0 right-0 bg-black/50 hover:bg-black/70 text-white p-0.5 rounded-bl"
                        >
                          <div className="w-3 h-3 flex items-center justify-center"><Icons.Close /></div>
                        </button>
                      </div>
                    )}
                    <label className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 border-dashed rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                      <Icons.Photo />
                      <span>{editImage ? 'Change Image' : 'Upload Image'}</span>
                      <input 
                        type="file" 
                        ref={editFileInputRef}
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleEditImageChange}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    required
                    rows={6}
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                   <button 
                     type="button"
                     onClick={() => setEditModalOpen(false)}
                     className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit" 
                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                   >
                     Save Changes
                   </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Performance Modal */}
      {editPerfModalOpen && editingPerf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-gray-900">Edit Student Record</h3>
                 <button onClick={() => setEditPerfModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                   <Icons.Close />
                 </button>
              </div>
              
              <form onSubmit={handleUpdatePerformance} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    required
                    min="1900"
                    max="2100"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={editPerfYear}
                    onChange={(e) => setEditPerfYear(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={editPerfName}
                    onChange={(e) => setEditPerfName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Photo</label>
                  <div className="flex items-center gap-4">
                    {editPerfImage && (
                      <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden border border-gray-200">
                        <img src={editPerfImage} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => { setEditPerfImage(null); if (editPerfFileInputRef.current) editPerfFileInputRef.current.value = ''; }}
                          className="absolute top-0 right-0 bg-black/50 hover:bg-black/70 text-white p-0.5 rounded-full"
                        >
                          <div className="w-3 h-3 flex items-center justify-center"><Icons.Close /></div>
                        </button>
                      </div>
                    )}
                    <label className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 border-dashed rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                      <Icons.Photo />
                      <span>{editPerfImage ? 'Change Photo' : 'Upload Photo'}</span>
                      <input 
                        type="file" 
                        ref={editPerfFileInputRef}
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleEditPerfImageChange}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">AGG</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={editPerfAgg}
                    onChange={(e) => setEditPerfAgg(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Achievements</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={editPerfAchievement}
                    onChange={(e) => setEditPerfAchievement(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                   <button 
                     type="button"
                     onClick={() => setEditPerfModalOpen(false)}
                     className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit" 
                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                   >
                     Save Changes
                   </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
