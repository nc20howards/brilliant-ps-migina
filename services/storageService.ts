import { BlogPost, PostCategory, StudentPerformance, SiteSettings, User, Testimonial } from '../types';
import { APP_NAME } from '../constants';

const POSTS_KEY = 'schola_posts';
const PERFORMANCE_KEY = 'schola_performance';
const SETTINGS_KEY = 'schola_settings';
const ADMIN_CREDS_KEY = 'schola_admin_creds';
const TESTIMONIALS_KEY = 'schola_testimonials';

const initialPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Annual Alumni Reunion 2024',
    content: 'We are thrilled to announce the Annual Alumni Reunion! Join us for a night of nostalgia, networking, and celebration. All batches from 1990-2020 are warmly invited.',
    date: '2024-10-15',
    category: PostCategory.REUNION,
    author: 'Admin',
    imageUrl: 'https://picsum.photos/800/400'
  },
  {
    id: '2',
    title: 'Spring Science Fair Winners',
    content: 'Congratulations to all participants of the Spring Science Fair. Special mention to the 10th-grade robotics team for their innovative solar-powered rover.',
    date: '2024-05-20',
    category: PostCategory.NEWS,
    author: 'Admin',
    imageUrl: 'https://picsum.photos/800/401'
  }
];

const initialPerformance: StudentPerformance[] = [
  {
    id: 'p1',
    year: 2023,
    studentName: 'Sarah Jenkins',
    grade: '12th Grade',
    agg: 8,
    achievements: 'Valedictorian, State Math Champion',
    photoUrl: 'https://picsum.photos/200/200'
  },
  {
    id: 'p2',
    year: 2022,
    studentName: 'Michael Chen',
    grade: '12th Grade',
    agg: 10,
    achievements: 'National Merit Scholar',
    photoUrl: 'https://picsum.photos/201/201'
  },
  {
    id: 'p3',
    year: 2021,
    studentName: 'Emily Davis',
    grade: '12th Grade',
    agg: 9,
    achievements: 'Debate Club President',
    photoUrl: 'https://picsum.photos/202/202'
  }
];

const initialSettings: SiteSettings = {
  schoolName: APP_NAME,
  logoUrl: null,
  marqueeText: 'Welcome to Brilliant Primary School! Admissions for the upcoming academic year are now open.',
  heroImages: [
    'https://picsum.photos/1920/600?blur=2',
    'https://picsum.photos/1920/600?random=10',
    'https://picsum.photos/1920/600?random=20'
  ]
};

const initialAdminCreds = { username: 'admin', password: 'admin' };

const initialTestimonials: Testimonial[] = [
  {
    id: 't1',
    userName: 'Alice Johnson',
    userClass: 'Class of 2015',
    content: 'Brilliant Primary School provided the foundation for my academic success. The dedicated teachers and holistic curriculum prepared me well for high school and beyond.',
    rating: 5,
    date: '2023-08-12',
    userPhoto: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 't2',
    userName: 'David Smith',
    userClass: 'Class of 2010',
    content: 'I have fond memories of the sports programs and extracurricular activities. It was a truly enriching environment to grow up in.',
    rating: 4,
    date: '2023-09-25',
    userPhoto: 'https://randomuser.me/api/portraits/men/32.jpg'
  }
];

export const StorageService = {
  getPosts: (): BlogPost[] => {
    const stored = localStorage.getItem(POSTS_KEY);
    if (!stored) {
      localStorage.setItem(POSTS_KEY, JSON.stringify(initialPosts));
      return initialPosts;
    }
    return JSON.parse(stored);
  },

  addPost: (post: BlogPost): void => {
    const posts = StorageService.getPosts();
    const newPosts = [post, ...posts];
    localStorage.setItem(POSTS_KEY, JSON.stringify(newPosts));
  },

  updatePost: (updatedPost: BlogPost): void => {
    const posts = StorageService.getPosts().map(p => 
      p.id === updatedPost.id ? updatedPost : p
    );
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  },

  deletePost: (id: string): void => {
    const posts = StorageService.getPosts().filter(p => p.id !== id);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  },

  getPerformance: (): StudentPerformance[] => {
    const stored = localStorage.getItem(PERFORMANCE_KEY);
    if (!stored) {
      localStorage.setItem(PERFORMANCE_KEY, JSON.stringify(initialPerformance));
      return initialPerformance;
    }
    return JSON.parse(stored);
  },

  addPerformance: (perf: StudentPerformance): void => {
    const perfs = StorageService.getPerformance();
    // Sort by year descending after add
    const newPerfs = [...perfs, perf].sort((a, b) => b.year - a.year);
    localStorage.setItem(PERFORMANCE_KEY, JSON.stringify(newPerfs));
  },

  addBulkPerformance: (perfs: StudentPerformance[]): void => {
    const currentPerfs = StorageService.getPerformance();
    const newPerfs = [...currentPerfs, ...perfs].sort((a, b) => b.year - a.year);
    localStorage.setItem(PERFORMANCE_KEY, JSON.stringify(newPerfs));
  },

  updatePerformance: (updatedPerf: StudentPerformance): void => {
    const perfs = StorageService.getPerformance().map(p => 
      p.id === updatedPerf.id ? updatedPerf : p
    );
    localStorage.setItem(PERFORMANCE_KEY, JSON.stringify(perfs));
  },

  deletePerformance: (id: string): void => {
    const perfs = StorageService.getPerformance().filter(p => p.id !== id);
    localStorage.setItem(PERFORMANCE_KEY, JSON.stringify(perfs));
  },

  getSettings: (): SiteSettings => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(initialSettings));
      return initialSettings;
    }
    return JSON.parse(stored);
  },

  saveSettings: (settings: SiteSettings): void => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  getAdminCreds: () => {
    const stored = localStorage.getItem(ADMIN_CREDS_KEY);
    if (!stored) {
      localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(initialAdminCreds));
      return initialAdminCreds;
    }
    return JSON.parse(stored);
  },

  saveAdminCreds: (creds: { username: string; password: string }): void => {
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(creds));
  },

  getTestimonials: (): Testimonial[] => {
    const stored = localStorage.getItem(TESTIMONIALS_KEY);
    if (!stored) {
      localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(initialTestimonials));
      return initialTestimonials;
    }
    return JSON.parse(stored);
  },

  addTestimonial: (testimonial: Testimonial): void => {
    const testimonials = StorageService.getTestimonials();
    const newTestimonials = [testimonial, ...testimonials];
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(newTestimonials));
  }
};