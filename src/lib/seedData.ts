import { Course, UserProfile, Certificate, Transaction, ConsciousnessBadge, CoachApplication, Book, CoachStory, CoachPost, YouTubeChannelVideo } from '../types';

export const SEED_COACHES: Partial<UserProfile>[] = [
  {
    uid: 'coach_elena_01',
    displayName: 'Dra. Elena Rostova',
    email: 'elena.rostova@kira.coach',
    role: 'coach',
    specialty: 'Neurocoaching & Regulación Nerviosa',
    level: 'Maestría',
    languages: ['Español', 'Inglés'],
    bio: 'Pionera en técnicas de neurofeedback aplicadas a la alta dirección y gestión del estrés crónico.',
    hourlyRate: 85,
    rating: 4.9,
    reviewsCount: 38,
    isPublicProfile: true,
    points: 4200,
    membershipStatus: 'active',
    photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
  },
  {
    uid: 'coach_mateo_02',
    displayName: 'Lic. Mateo Silva',
    email: 'mateo.silva@kira.coach',
    role: 'coach',
    specialty: 'Coaching Ontológico y Propósito',
    level: 'Élite',
    languages: ['Español'],
    bio: 'Especialista en transiciones profesionales, superación de creencias limitantes y liderazgo humanista.',
    hourlyRate: 95,
    rating: 5.0,
    reviewsCount: 44,
    isPublicProfile: true,
    points: 6100,
    membershipStatus: 'active',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  {
    uid: 'coach_valentina_03',
    displayName: 'Valentina Rossi',
    email: 'valentina.rossi@kira.coach',
    role: 'coach',
    specialty: 'Arteterapia y Expresión Emocional',
    level: 'Intermedio',
    languages: ['Español', 'Italiano'],
    bio: 'Terapeuta creativa. Combina mandalas fractales, musicoterapia y escritura introspectiva.',
    hourlyRate: 70,
    rating: 4.8,
    reviewsCount: 29,
    isPublicProfile: true,
    points: 3300,
    membershipStatus: 'active',
    photoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80'
  }
];

export const SEED_COURSES: Course[] = [
  {
    id: 'course_neuro_01',
    title: 'Biología del Éxito & Calma Interior',
    description: 'Protocolos de neurociencia aplicada para hackear la fatiga adrenal, reprogramar los ritmos circadianos y sostener alta energía sin quemarse.',
    shortDescription: 'Regulación del sistema nervioso y foco mental.',
    category: 'Neurociencia',
    coachId: 'coach_elena_01',
    coachName: 'Dra. Elena Rostova',
    coachPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    price: 149,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    level: 'Élite',
    durationHours: 12,
    modulesCount: 4,
    published: true,
    rating: 4.95,
    reviewsCount: 47,
    modules: [
      {
        id: 'mod_1',
        title: 'Módulo 1: Anatomía de la Respuesta de Estrés',
        order: 1,
        lessons: [
          {
            id: 'les_1',
            title: 'El Eje HPA y el Cortisol Crónico',
            order: 1,
            durationMinutes: 18,
            content: 'El estrés crónico mantiene activa la amígdala cerebral y satura los receptores de cortisol. En esta lección aprenderemos a modular el nervio vago en menos de 90 segundos mediante el suspiro fisiológico doble.',
            quiz: {
              question: '¿Cuál es la función principal del nervio vago en la regulación del estrés?',
              options: [
                'Activar el reflejo de lucha o huida',
                'Estimular el sistema nervioso parasimpático y desacelerar el ritmo cardíaco',
                'Aumentar la producción de adrenalina',
                'Inhibir completamente el sueño REM'
              ],
              correctIndex: 1,
              explanation: 'El nervio vago es el componente principal del sistema parasimpático, encargado del descanso, digestión y restauración homeostática.'
            }
          },
          {
            id: 'les_2',
            title: 'Protocolo de Respiración 4-7-8',
            order: 2,
            durationMinutes: 15,
            content: 'La técnica 4-7-8 de respiración rítmica oxigena el córtex prefrontal y desconecta la hiperreactividad emocional.'
          }
        ]
      },
      {
        id: 'mod_2',
        title: 'Módulo 2: Arquitectura del Descanso Profundo',
        order: 2,
        lessons: [
          {
            id: 'les_3',
            title: 'Luz Solar Matutina y Melatonina',
            order: 1,
            durationMinutes: 22,
            content: 'La exposición a fotones en los primeros 30 minutos del despertar fija el reloj circadiano maestro en el núcleo supraquiasmático.'
          }
        ]
      }
    ]
  },
  {
    id: 'course_ontologico_02',
    title: 'Maestría en Coaching Ontológico & Liderazgo',
    description: 'Transforma tu lenguaje, emociones y corporalidad para generar conversaciones de alto impacto y resolver bloqueos organizacionales.',
    shortDescription: 'Liderazgo conversacional y visión reflexiva.',
    category: 'Coaching Ontológico',
    coachId: 'coach_mateo_02',
    coachName: 'Lic. Mateo Silva',
    coachPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    price: 189,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    level: 'Maestría',
    durationHours: 16,
    modulesCount: 5,
    published: true,
    rating: 4.88,
    reviewsCount: 32,
    modules: [
      {
        id: 'mod_o1',
        title: 'Módulo 1: El Lenguaje como Acción Generativa',
        order: 1,
        lessons: [
          {
            id: 'les_o1',
            title: 'Afirmaciones, Declaraciones y Juicios',
            order: 1,
            durationMinutes: 25,
            content: 'El lenguaje no solo describe la realidad; el lenguaje crea realidades y abre o cierra mundos de posibilidades.'
          }
        ]
      }
    ]
  },
  {
    id: 'course_arteterapia_03',
    title: 'Mandalas Fractales & Arteterapia Consciente',
    description: 'Taller práctico de descompresión neuroafectiva mediante el dibujo geométrico sagrado, meditación en color y atención plena.',
    shortDescription: 'Catarsis creativa y descanso mental.',
    category: 'Bienestar & Arte',
    coachId: 'coach_valentina_03',
    coachName: 'Valentina Rossi',
    coachPhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    price: 99,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    level: 'Iniciación',
    durationHours: 8,
    modulesCount: 3,
    published: true,
    rating: 4.92,
    reviewsCount: 26,
    modules: [
      {
        id: 'mod_a1',
        title: 'Módulo 1: La Geometría de la Mente',
        order: 1,
        lessons: [
          {
            id: 'les_a1',
            title: 'El Centro del Mandala como Ancla Emocional',
            order: 1,
            durationMinutes: 14,
            content: 'Carl Jung observó que dibujar círculos y patrones concéntricos favorece la integración armónica del inconsciente.'
          }
        ]
      }
    ]
  }
];

export const SEED_MANDALAS = [
  {
    id: 'mandala_01',
    title: 'Mandala de la Calma Serena',
    description: 'Geometría circular de 8 pétalos para equilibrar la ansiedad y desacelerar pensamientos repetitivos.',
    level: 'Bronce+',
    svgSeed: 'circle-calm',
    category: 'Antiestrés'
  },
  {
    id: 'mandala_02',
    title: 'Flor de la Vida & Coherencia',
    description: 'Patrón armónico fractal que estimula la sincronización hemisférica y el pensamiento lateral.',
    level: 'Plata+',
    svgSeed: 'flower-life',
    category: 'Foco Mental'
  },
  {
    id: 'mandala_03',
    title: 'Metatrón & Voluntad Soberana',
    description: 'Matriz geométrica de alta energía para la toma de decisiones difíciles y liderazgo personal.',
    level: 'Oro+',
    svgSeed: 'metatron',
    category: 'Liderazgo'
  }
];

export const SEED_MICROLEARNING_CHAPTERS = [
  {
    id: 'micro_01',
    title: 'Micro-Hábito: El Suspiro de Emergencia',
    duration: '3 min',
    tags: ['Sistema Nervioso', 'Inmediato'],
    insight: 'Dos inhalaciones cortas por la nariz seguidas de una exhalación prolongada por la boca colapsan los alvéolos sobreinflados y bajan el pulso al instante.',
    exercise: 'Haz 3 repeticiones conscientes ahora mismo antes de continuar.'
  },
  {
    id: 'micro_02',
    title: 'Desactivar la Trampa de los Juicios Automáticos',
    duration: '4 min',
    tags: ['Coaching Ontológico'],
    insight: 'Diferencia siempre un "Hecho" de un "Juicio". Los hechos son observables y consensuados; los juicios son interpretaciones que te pueden empoderar o esclavizar.',
    exercise: 'Identifica una frustración reciente y redacta cuál es el hecho real sin tus adjetivos.'
  },
  {
    id: 'micro_03',
    title: 'El Ancla de la Gratitud No Forzada',
    duration: '3 min',
    tags: ['Neuroquímica'],
    insight: 'Agradecer activa dopamina y serotonina solo cuando se conecta con una emoción corporal genuina, no cuando se repite mecánicamente como deber.',
    exercise: 'Recuerda a alguien que te ayudó en un momento difícil y siente la gratitud 20 segundos.'
  }
];

export const SEED_CONSCIOUSNESS_BADGES: ConsciousnessBadge[] = [
  {
    id: 'badge_coherence_01',
    title: 'Coherencia Semanal',
    description: '7 días consecutivos alineando intenciones matutinas con acciones cumplidas sin desgastarte.',
    category: 'coherence',
    icon: 'Sparkles',
    progress: 85,
    threshold: 100
  },
  {
    id: 'badge_rest_02',
    title: 'Templo del Sueño',
    description: 'Desconexión digital al menos 45 minutos antes de dormir durante 5 noches.',
    category: 'rest',
    icon: 'Moon',
    progress: 100,
    threshold: 100,
    unlockedAt: '2026-11-04'
  },
  {
    id: 'badge_commitment_03',
    title: 'Palabra Impecable',
    description: 'Completar 10 micro-compromisos fijados con tu coach sin aplazar plazos.',
    category: 'commitment',
    icon: 'ShieldCheck',
    progress: 70,
    threshold: 100
  },
  {
    id: 'badge_calm_04',
    title: 'Maestría de la Pausa',
    description: 'Activar y completar el Protocolo de Calma 4 veces en momentos de tensión en vez de reaccionar impulsivamente.',
    category: 'mindfulness',
    icon: 'Wind',
    progress: 50,
    threshold: 100
  }
];

export const SEED_CERTIFICATES: Certificate[] = [
  {
    id: 'cert_safeness_001',
    certificateNumber: 'KIRA-2026-N992',
    userId: 'user_student_demo',
    userName: 'Roberto De Uwy',
    userEmail: 'deuwyrobert@gmail.com',
    courseId: 'course_neuro_01',
    courseTitle: 'Biología del Éxito & Calma Interior',
    coachId: 'coach_elena_01',
    coachName: 'Dra. Elena Rostova',
    issueDate: '2026-11-02',
    status: 'active',
    verificationHash: '7f9a2b1c4e8d3a6f9c2e1b4a8d3e5f7a',
    score: 98,
    organization: 'Safeness Inc.'
  },
  {
    id: 'cert_safeness_002',
    certificateNumber: 'KIRA-2026-O441',
    userId: 'user_student_demo',
    userName: 'Roberto De Uwy',
    userEmail: 'deuwyrobert@gmail.com',
    courseId: 'course_ontologico_02',
    courseTitle: 'Maestría en Coaching Ontológico & Liderazgo',
    coachId: 'coach_mateo_02',
    coachName: 'Lic. Mateo Silva',
    issueDate: '2026-11-08',
    status: 'pending_admin',
    verificationHash: '3d8a7c2e1b9f4e6a8c2d1b5a9e3f7c2a',
    score: 94,
    organization: 'Safeness Inc.'
  }
];

export const SEED_COACH_APPLICATIONS: CoachApplication[] = [
  {
    id: 'app_coach_901',
    userId: 'user_applicant_01',
    name: 'Carlos Menéndez',
    email: 'carlos.menendez@safeness.inc',
    specialty: 'Mindfulness Ejecutivo y Reducción de Burnout',
    experienceYears: 8,
    bio: 'Certificado en MBSR y coaching por la ICF. He guiado a más de 200 líderes en prevención del agotamiento.',
    languages: ['Español', 'Inglés'],
    status: 'pending',
    requestedAt: '2026-11-09T08:30:00Z'
  },
  {
    id: 'app_coach_902',
    userId: 'user_applicant_02',
    name: 'Sofía Valenzuela',
    email: 'sofia.valenzuela@terapia.com',
    specialty: 'Psicología Positiva y Hábitos Somáticos',
    experienceYears: 6,
    bio: 'Máster en Neuropsicología. Especialista en desbloqueo del síndrome del impostor.',
    languages: ['Español', 'Portugués'],
    status: 'pending',
    requestedAt: '2026-11-08T14:15:00Z'
  }
];

export const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_stripe_881',
    userId: 'user_student_demo',
    userEmail: 'deuwyrobert@gmail.com',
    courseId: 'course_neuro_01',
    courseTitle: 'Biología del Éxito & Calma Interior',
    type: 'course_purchase',
    amount: 149,
    currency: 'USD',
    provider: 'stripe',
    status: 'succeeded',
    coachId: 'coach_elena_01',
    platformCut: 104.3, // 70%
    coachCut: 44.7, // 30%
    payoutStatus: 'pending',
    createdAt: '2026-11-07T12:00:00Z'
  },
  {
    id: 'tx_stripe_882',
    userId: 'coach_elena_01',
    userEmail: 'elena.rostova@kira.coach',
    type: 'coach_membership',
    amount: 49,
    currency: 'USD',
    provider: 'stripe',
    status: 'succeeded',
    platformCut: 49,
    coachCut: 0,
    payoutStatus: 'liquidated',
    createdAt: '2026-11-01T09:00:00Z'
  },
  {
    id: 'tx_mp_883',
    userId: 'user_student_demo',
    userEmail: 'deuwyrobert@gmail.com',
    courseId: 'course_ontologico_02',
    courseTitle: 'Maestría en Coaching Ontológico & Liderazgo',
    type: 'course_purchase',
    amount: 189,
    currency: 'USD',
    provider: 'mercadopago',
    status: 'succeeded',
    coachId: 'coach_mateo_02',
    platformCut: 132.3,
    coachCut: 56.7,
    payoutStatus: 'pending',
    createdAt: '2026-11-08T18:40:00Z'
  }
];

export const SEED_BOOKS: Book[] = [
  {
    id: 'book_01',
    title: 'El Mapa de la Mente Serena: Neurociencia para Líderes',
    author: 'Dra. Elena Rostova',
    coachId: 'coach_elena_01',
    coachName: 'Dra. Elena Rostova',
    coachPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    description: 'Manual definitivo para regular el cortisol matutino, apagar el sesgo de negatividad de la amígdala cerebral y consolidar una presencia ejecutiva inquebrantable.',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    price: 29.99,
    currency: 'USD',
    pagesCount: 248,
    format: 'PDF',
    category: 'Neurociencia & Liderazgo',
    rating: 4.95,
    reviewsCount: 86,
    downloadUrl: '#',
    previewSnippet: 'Capítulo 1: El nervio vago no entiende de plazos de entrega; entiende de ritmo cardíaco y oxígeno celular. Aprende a hackearlo.',
    featured: true
  },
  {
    id: 'book_02',
    title: 'Declaraciones de Poder: La Revolución Ontológica',
    author: 'Lic. Mateo Silva',
    coachId: 'coach_mateo_02',
    coachName: 'Lic. Mateo Silva',
    coachPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    description: 'Cómo tus conversaciones internas moldean tus relaciones, contratos y límites. El arte de pasar de la queja estéril al compromiso generativo.',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    price: 24.50,
    currency: 'USD',
    pagesCount: 196,
    format: 'EPUB',
    category: 'Coaching Ontológico',
    rating: 4.88,
    reviewsCount: 62,
    downloadUrl: '#',
    previewSnippet: 'Tus juicios dicen más de tu observador que del mundo exterior. Cambia el observador y cambiará el resultado.',
    featured: true
  },
  {
    id: 'book_03',
    title: 'Arte Fractal: Geometría Sagrada para Sanar la Mente',
    author: 'Valentina Rossi',
    coachId: 'coach_valentina_03',
    coachName: 'Valentina Rossi',
    coachPhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    description: 'Guía práctica ilustrada de colorterapia y mandalas introspectivos para desbloquear el pensamiento lateral y calmar el sistema límbico.',
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80',
    price: 19.99,
    currency: 'USD',
    pagesCount: 164,
    format: 'PDF',
    category: 'Arteterapia',
    rating: 4.92,
    reviewsCount: 41,
    downloadUrl: '#',
    previewSnippet: 'Colorear de afuera hacia adentro simboliza introspección; de adentro hacia afuera, proyección de metas.',
    featured: false
  }
];

export const SEED_COACH_STORIES: CoachStory[] = [
  {
    id: 'story_01',
    coachId: 'coach_elena_01',
    coachName: 'Dra. Elena Rostova',
    coachPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: '¡Buenos días comunidad! Recuerden sus 3 suspiros fisiológicos antes de entrar a su primera reunión matutina 🫁✨',
    createdAt: 'Hace 2 horas',
    viewed: false
  },
  {
    id: 'story_02',
    coachId: 'coach_mateo_02',
    coachName: 'Lic. Mateo Silva',
    coachPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'Pregunta ontológica del día: ¿Qué declaración estás postergando por temor a lo que dirán? 🎯',
    createdAt: 'Hace 4 horas',
    viewed: false
  },
  {
    id: 'story_03',
    coachId: 'coach_valentina_03',
    coachName: 'Valentina Rossi',
    coachPhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'Trazando el nuevo mandala de 8 pétalos para la Bóveda Élite. ¡Paz y concentración total! 🎨💜',
    createdAt: 'Hace 6 horas',
    viewed: false
  }
];

export const SEED_COACH_POSTS: CoachPost[] = [
  {
    id: 'post_01',
    coachId: 'coach_elena_01',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    caption: 'El cortisol no se elimina con fuerza de voluntad. Se regula con luz solar, respiración y límites claros. En mi nuevo libro "El Mapa de la Mente Serena" te comparto el protocolo completo paso a paso.',
    likesCount: 142,
    commentsCount: 23,
    type: 'photo',
    createdAt: 'Hace 1 día'
  },
  {
    id: 'post_02',
    coachId: 'coach_elena_01',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    caption: 'Cápsula de neurociencia: ¿Por qué la rumiación nocturna apaga el sistema inmunológico? Mira este extracto de la última sesión en vivo.',
    likesCount: 98,
    commentsCount: 15,
    type: 'reel',
    createdAt: 'Hace 3 días'
  },
  {
    id: 'post_03',
    coachId: 'coach_elena_01',
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&auto=format&fit=crop&q=80',
    caption: '"Descansar no es un premio que te ganas al final del colapso; es el requisito biológico para pensar con lucidez."',
    likesCount: 215,
    commentsCount: 34,
    type: 'quote',
    createdAt: 'Hace 5 días'
  }
];

export const SEED_YOUTUBE_VIDEOS: YouTubeChannelVideo[] = [
  {
    id: 'yt_01',
    title: 'Masterclass Exclusiva: Arquitectura de la Sesión Ontológica de Alto Impacto',
    description: 'Grabación de 75 minutos para coaches de Safeness Inc. Cómo intervenir en el quiebre del coachee sin dar consejos directos y usando el análisis de audio de KIRA.',
    youtubeVideoId: 'dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    duration: '1h 15m',
    coachId: 'coach_elena_01',
    coachName: 'Dra. Elena Rostova & Equipo Admin',
    coachPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    category: 'Masterclass',
    isLive: false,
    viewCount: 340,
    createdAt: '2026-11-04'
  },
  {
    id: 'yt_02',
    title: 'Transmisión en Vivo: Alineación Estratégica Q4 — Expansión de Mentorías y Métricas B2B',
    description: 'Webinar privado entre la dirección de Safeness Inc. y los Coaches certificados. Revisión del split 70/30, nuevas licencias corporativas y herramientas de Session Intelligence.',
    youtubeVideoId: 'jNQXAC9IVRw',
    youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    duration: '52 min',
    coachId: 'admin_safeness',
    coachName: 'Dirección Safeness Inc.',
    coachPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    category: 'Estrategia Coach & Admin',
    isLive: true,
    viewCount: 185,
    createdAt: '2026-11-08'
  },
  {
    id: 'yt_03',
    title: 'Análisis de Caso Clínico #14: Desbloqueo del Síndrome del Impostor con Neurofeedback',
    description: 'Estudio de caso paso a paso. Cómo interpretar el mapa de calor de enfoque (Pasado vs Presente vs Futuro) generado por KIRA.',
    youtubeVideoId: '9bZkp7q19f0',
    youtubeUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    duration: '46 min',
    coachId: 'coach_mateo_02',
    coachName: 'Lic. Mateo Silva',
    coachPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    category: 'Caso Clínico',
    isLive: false,
    viewCount: 290,
    createdAt: '2026-11-01'
  }
];

