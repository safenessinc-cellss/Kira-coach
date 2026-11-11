import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { AppShell } from './layouts/AppShell';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard, Journal } from './pages/Dashboard';
import { StudentCourses } from './pages/StudentCourses';
import { EliteLibrary } from './pages/EliteLibrary';
import { StudentWellness } from './pages/StudentWellness';
import { StudentProgress } from './pages/StudentProgress';
import { CoachDirectory } from './pages/CoachDirectory';
import { Certificates } from './pages/Certificates';
import { VerifyCertificate } from './pages/VerifyCertificate';
import { StudentMessages } from './pages/StudentMessages';
import { StudentSettings } from './pages/StudentSettings';
import { CoachDashboard, CoachCourses } from './pages/Coach';
import { CoachCopilot } from './pages/CoachCopilot';
import { CoachNexus } from './pages/CoachNexus';
import { CoachMessages } from './pages/CoachMessages';
import { CoachInstagramProfile } from './pages/CoachInstagramProfile';
import { CoachYouTubeChannel } from './pages/CoachYouTubeChannel';
import { BookStore } from './pages/BookStore';
import SessionIntelligence from './pages/SessionIntelligence';
import { AdminMonitor } from './pages/Admin';
import { AdminUsers } from './pages/AdminUsers';
import { AdminCoachApprovals } from './pages/AdminCoachApprovals';
import { AdminCertificateApprovals } from './pages/AdminCertificateApprovals';
import { AdminPayments } from './pages/AdminPayments';
import { AdminModeration } from './pages/AdminModeration';
import { AdminBranding } from './pages/AdminBranding';
import { AdminInsights } from './pages/AdminInsights';
import { HRDashboard } from './pages/HRDashboard';
import { UserProfile } from './pages/UserProfile';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from './hooks/useAuth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

function ProtectedRoute({ allowedRoles, children }: { allowedRoles: string[]; children?: React.ReactNode }) {
  const { user, role, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (role && !allowedRoles.includes(role)) {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'coach') return <Navigate to="/coach" replace />;
    if (role === 'hr_admin') return <Navigate to="/hr" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      if (db) {
        const unsub = onSnapshot(doc(db, 'settings', 'website'), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.primaryColor) {
              document.documentElement.style.setProperty('--primary', data.primaryColor);
            }
            if (data.secondaryColor) {
              document.documentElement.style.setProperty('--accent', data.secondaryColor);
            }
          }
        });
        return () => unsub();
      }
    } catch {}
  }, []);

  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify/:certId" element={<VerifyCertificate />} />

            {/* Rutas Autenticadas unificadas en AppShell */}
            <Route element={<AppShell />}>
              {/* Portal Alumno */}
              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['alumno', 'admin']}><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/courses" element={<ProtectedRoute allowedRoles={['alumno', 'admin']}><StudentCourses /></ProtectedRoute>} />
              <Route path="/dashboard/books" element={<ProtectedRoute allowedRoles={['alumno', 'admin', 'coach']}><BookStore /></ProtectedRoute>} />
              <Route path="/dashboard/journal" element={<ProtectedRoute allowedRoles={['alumno', 'admin']}><Journal /></ProtectedRoute>} />
              <Route path="/dashboard/elite-library" element={<ProtectedRoute allowedRoles={['alumno', 'admin']}><EliteLibrary /></ProtectedRoute>} />
              <Route path="/dashboard/certificates" element={<ProtectedRoute allowedRoles={['alumno', 'admin']}><Certificates /></ProtectedRoute>} />
              <Route path="/dashboard/coaches" element={<ProtectedRoute allowedRoles={['alumno', 'admin']}><CoachDirectory /></ProtectedRoute>} />
              <Route path="/dashboard/messages" element={<ProtectedRoute allowedRoles={['alumno', 'admin']}><StudentMessages /></ProtectedRoute>} />
              <Route path="/dashboard/progress" element={<ProtectedRoute allowedRoles={['alumno', 'admin']}><StudentProgress /></ProtectedRoute>} />
              <Route path="/dashboard/wellness" element={<ProtectedRoute allowedRoles={['alumno', 'admin']}><StudentWellness /></ProtectedRoute>} />
              <Route path="/dashboard/settings" element={<ProtectedRoute allowedRoles={['alumno', 'admin']}><StudentSettings /></ProtectedRoute>} />
              <Route path="/dashboard/profile" element={<ProtectedRoute allowedRoles={['alumno', 'admin']}><UserProfile /></ProtectedRoute>} />

              {/* Portal Coach */}
              <Route path="/coach" element={<ProtectedRoute allowedRoles={['coach', 'admin']}><CoachDashboard /></ProtectedRoute>} />
              <Route path="/coach/instagram-profile" element={<ProtectedRoute allowedRoles={['coach', 'admin']}><CoachInstagramProfile /></ProtectedRoute>} />
              <Route path="/coach/youtube-channel" element={<ProtectedRoute allowedRoles={['coach', 'admin']}><CoachYouTubeChannel /></ProtectedRoute>} />
              <Route path="/coach/courses" element={<ProtectedRoute allowedRoles={['coach', 'admin']}><CoachCourses /></ProtectedRoute>} />
              <Route path="/coach/session" element={<ProtectedRoute allowedRoles={['coach', 'admin']}><SessionIntelligence /></ProtectedRoute>} />
              <Route path="/coach/ai-copilot" element={<ProtectedRoute allowedRoles={['coach', 'admin']}><CoachCopilot /></ProtectedRoute>} />
              <Route path="/coach/nexus" element={<ProtectedRoute allowedRoles={['coach', 'admin']}><CoachNexus /></ProtectedRoute>} />
              <Route path="/coach/messages" element={<ProtectedRoute allowedRoles={['coach', 'admin']}><CoachMessages /></ProtectedRoute>} />
              <Route path="/coach/profile" element={<ProtectedRoute allowedRoles={['coach', 'admin']}><UserProfile /></ProtectedRoute>} />

              {/* Portal Admin */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminMonitor /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/coach-approvals" element={<ProtectedRoute allowedRoles={['admin']}><AdminCoachApprovals /></ProtectedRoute>} />
              <Route path="/admin/certificate-approvals" element={<ProtectedRoute allowedRoles={['admin']}><AdminCertificateApprovals /></ProtectedRoute>} />
              <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={['admin']}><AdminPayments /></ProtectedRoute>} />
              <Route path="/admin/books" element={<ProtectedRoute allowedRoles={['admin']}><BookStore /></ProtectedRoute>} />
              <Route path="/admin/youtube-channel" element={<ProtectedRoute allowedRoles={['admin']}><CoachYouTubeChannel /></ProtectedRoute>} />
              <Route path="/admin/moderation" element={<ProtectedRoute allowedRoles={['admin']}><AdminModeration /></ProtectedRoute>} />
              <Route path="/admin/branding" element={<ProtectedRoute allowedRoles={['admin']}><AdminBranding /></ProtectedRoute>} />
              <Route path="/admin/insights" element={<ProtectedRoute allowedRoles={['admin']}><AdminInsights /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminBranding /></ProtectedRoute>} />

              {/* Portal HR Corporativo */}
              <Route path="/hr" element={<ProtectedRoute allowedRoles={['hr_admin', 'admin']}><HRDashboard /></ProtectedRoute>} />
              <Route path="/hr/settings" element={<ProtectedRoute allowedRoles={['hr_admin', 'admin']}><StudentSettings /></ProtectedRoute>} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
