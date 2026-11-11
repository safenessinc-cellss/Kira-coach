export type UserRole = 'alumno' | 'coach' | 'admin' | 'hr_admin';

export type EnergyTier = 'Bronce' | 'Plata' | 'Oro' | 'Platino';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  points: number; // Energy Points
  tier?: EnergyTier;
  approvalStatus?: 'approved' | 'pending' | 'rejected' | 'suspended';
  membershipStatus?: 'active' | 'inactive' | 'trial';
  membershipPaidAt?: any;
  trialExpiresAt?: any;
  specialty?: string;
  languages?: string[];
  level?: string;
  bio?: string;
  isPublicProfile?: boolean;
  hourlyRate?: number;
  rating?: number;
  reviewsCount?: number;
  phone?: string;
  orgId?: string;
  createdAt?: any;
  lastLoginAt?: any;
  burnoutScore?: number; // 0-100 calculated by AI
  burnoutStatus?: 'bajo' | 'moderado' | 'alto';
  consciousnessStreak?: number; // días de coherencia
  calmSilencedUntil?: any;
  name?: string;
  photoUrl?: string;
  emailVerified?: boolean;
  hasCompletedOnboarding?: boolean;
  favorites?: string[];
  unlockedMedia?: string[];
  unlockedTools?: string[];
  aiFeedback?: any;
  socialLinks?: any;
  theme?: string;
  [key: string]: any;
}

export interface ConsciousnessBadge {
  id: string;
  title: string;
  description: string;
  category: 'coherence' | 'rest' | 'commitment' | 'mindfulness';
  icon: string;
  unlockedAt?: string;
  progress: number; // 0 to 100
  threshold: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  coachId: string;
  coachName?: string;
  coachPhoto?: string;
  price: number;
  currency: 'USD' | 'EUR' | 'MXN';
  imageUrl: string;
  level: 'Iniciación' | 'Intermedio' | 'Maestría' | 'Élite';
  durationHours: number;
  modulesCount: number;
  published: boolean;
  requiresManualApproval?: boolean;
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt?: any;
  modules?: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  order: number;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  title: string;
  order: number;
  durationMinutes: number;
  content: string; // HTML / Markdown
  videoUrl?: string;
  quiz?: LessonQuiz;
}

export interface LessonQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  coachId: string;
  progress: number; // 0-100
  completedLessons: string[];
  enrolledAt: any;
  lastAccessedAt: any;
  certificateId?: string;
  score?: number;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  userId: string;
  userName: string;
  userEmail?: string;
  courseId: string;
  courseTitle: string;
  coachId: string;
  coachName: string;
  issueDate: string;
  status: 'active' | 'pending_admin' | 'revoked';
  verificationHash: string;
  score: number;
  organization: string; // "Safeness Inc."
  qrUrl?: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  mood: 'radiante' | 'sereno' | 'reflexivo' | 'fatigado' | 'estresado';
  tags: string[];
  content: string;
  gratitude?: string;
  aiAnalysis?: {
    primaryEmotion: string;
    energyLevel: 'alta' | 'media' | 'baja';
    insights: string;
    suggestedAction: string;
    burnoutSignal: boolean;
  };
  createdAt: any;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userEmail?: string;
  userRole?: string;
  action: 
    | 'login'
    | 'logout'
    | 'course_enrolled'
    | 'lesson_completed'
    | 'journal_created'
    | 'message_sent'
    | 'review_created'
    | 'certificate_issued'
    | 'coach_approved'
    | 'coach_rejected'
    | 'payment_succeeded'
    | 'calm_activated'
    | 'report_filed'
    | 'refund_processed'
    | 'payout_marked'
    | 'points_awarded';
  metadata?: Record<string, any>; // Strictly NO PII or sensitive message/journal text
  timestamp: any;
}

export interface CalmEvent {
  id: string;
  userId: string;
  type: 'breathing_exercise' | 'emergency_coach_contact' | 'silence_metrics_24h';
  completedDurationSeconds?: number;
  timestamp: any;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'pdf';
  createdAt: any;
  read: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  userEmail?: string;
  courseId?: string;
  courseTitle?: string;
  type: 'course_purchase' | 'coach_membership' | 'vault_unlock';
  amount: number;
  currency: 'USD' | 'EUR' | 'MXN';
  provider: 'stripe' | 'mercadopago';
  status: 'succeeded' | 'refunded' | 'pending';
  coachId?: string;
  platformCut: number; // 70%
  coachCut: number; // 30%
  payoutStatus?: 'pending' | 'liquidated';
  createdAt: any;
  refundReason?: string;
  paymentMethod?: string;
}

export interface CoachApplication {
  id: string;
  userId: string;
  name: string;
  email: string;
  specialty: string;
  experienceYears: number;
  bio: string;
  languages: string[];
  status: 'pending' | 'approved' | 'rejected' | 'info_requested';
  requestedAt: any;
  reviewedAt?: any;
  reviewerNotes?: string;
}

export interface WebsiteSettings {
  appName: string;
  primaryColor: string;
  secondaryColor: string;
  logoImage?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  aboutText?: string;
  contactEmail?: string;
  safenessUrl?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coachId?: string;
  coachName?: string;
  coachPhoto?: string;
  description: string;
  coverUrl: string;
  price: number;
  currency: 'USD' | 'EUR' | 'MXN';
  pagesCount: number;
  format: 'PDF' | 'EPUB' | 'Audiolibro';
  category: string;
  rating: number;
  reviewsCount: number;
  downloadUrl?: string;
  previewSnippet?: string;
  featured?: boolean;
}

export interface CoachStory {
  id: string;
  coachId: string;
  coachName: string;
  coachPhoto: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  createdAt: string;
  expiresAt?: string;
  viewed?: boolean;
}

export interface CoachPost {
  id: string;
  coachId: string;
  imageUrl: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  type: 'photo' | 'reel' | 'quote';
  createdAt: string;
}

export interface YouTubeChannelVideo {
  id: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  duration: string;
  coachId: string;
  coachName: string;
  coachPhoto?: string;
  category: 'Masterclass' | 'Webinar Privado' | 'Estrategia Coach & Admin' | 'Caso Clínico';
  isLive?: boolean;
  viewCount: number;
  createdAt: string;
}

