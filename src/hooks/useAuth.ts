import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { UserRole, UserProfile } from '../types';

const LOCAL_STORAGE_USER_KEY = 'kira_active_session_user';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [role, setRole] = useState<UserRole>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      return cached ? JSON.parse(cached).role : 'alumno';
    } catch {
      return 'alumno';
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const isAdminEmail = u.email === 'safeness.c.a@gmail.com' || u.email === 'deuwyrobert@gmail.com';
        const requestedRole = (sessionStorage.getItem('requestedRole') as UserRole) || (isAdminEmail ? 'admin' : 'alumno');
        sessionStorage.removeItem('requestedRole');

        let resolvedUser: UserProfile = {
          uid: u.uid,
          email: u.email || 'user@safeness.inc',
          displayName: u.displayName || 'Usuario KIRA',
          photoURL: u.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          role: isAdminEmail ? 'admin' : requestedRole,
          points: 380, // Default energy points
          approvalStatus: 'approved',
          membershipStatus: 'active',
          isPublicProfile: true,
          burnoutScore: 18,
          burnoutStatus: 'bajo',
          consciousnessStreak: 5
        };

        // Sync with Firestore if available
        try {
          if (db) {
            const docRef = doc(db, 'users', u.uid);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
              const data = snap.data();
              const effectiveRole = isAdminEmail ? 'admin' : (data.role || requestedRole);
              resolvedUser = {
                ...resolvedUser,
                ...data,
                role: effectiveRole,
                uid: u.uid
              };
              await updateDoc(docRef, {
                lastLoginAt: new Date().toISOString()
              }).catch(() => {});
            } else {
              await setDoc(docRef, {
                ...resolvedUser,
                createdAt: new Date().toISOString()
              }).catch(() => {});
            }
          }
        } catch (e) {
          console.warn('[Auth] Firestore sync fallback to local session state');
        }

        setUser(resolvedUser);
        setRole(resolvedUser.role);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(resolvedUser));
      } else {
        // If no firebase user but we have local demo session, keep it unless explicitly logged out
        const cached = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setUser(parsed);
          setRole(parsed.role || 'alumno');
        } else {
          // Initialize a rich default student profile for immediate seamless preview
          const defaultDemoUser: UserProfile = {
            uid: 'user_student_demo',
            email: 'deuwyrobert@gmail.com',
            displayName: 'Roberto De Uwy',
            photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            role: 'alumno',
            points: 1250,
            tier: 'Plata',
            approvalStatus: 'approved',
            membershipStatus: 'active',
            isPublicProfile: true,
            burnoutScore: 22,
            burnoutStatus: 'bajo',
            consciousnessStreak: 6
          };
          setUser(defaultDemoUser);
          setRole('alumno');
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(defaultDemoUser));
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (targetRole: UserRole = 'alumno') => {
    sessionStorage.setItem('requestedRole', targetRole);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.warn("Popup closed or auth unavailable, setting demo user for role:", targetRole);
      const isAdm = targetRole === 'admin';
      const demoUser: UserProfile = {
        uid: isAdm ? 'admin_safeness_01' : `user_${targetRole}_${Date.now()}`,
        email: isAdm ? 'deuwyrobert@gmail.com' : `${targetRole}@safeness.inc`,
        displayName: isAdm ? 'Roberto De Uwy (Admin)' : targetRole === 'coach' ? 'Dra. Elena Rostova' : targetRole === 'hr_admin' ? 'Lic. Valenzuela (HR)' : 'Roberto De Uwy',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        role: targetRole,
        points: targetRole === 'alumno' ? 1420 : 5000,
        tier: targetRole === 'alumno' ? 'Plata' : 'Platino',
        approvalStatus: 'approved',
        membershipStatus: 'active',
        isPublicProfile: true,
        burnoutScore: 18,
        burnoutStatus: 'bajo',
        consciousnessStreak: 7
      };
      setUser(demoUser);
      setRole(targetRole);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    setRole(newRole);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
    if (db) {
      updateDoc(doc(db, 'users', user.uid), { role: newRole }).catch(() => {});
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    // Revert to demo student
    const defaultStudent: UserProfile = {
      uid: 'user_student_demo',
      email: 'deuwyrobert@gmail.com',
      displayName: 'Roberto De Uwy',
      role: 'alumno',
      points: 450,
      approvalStatus: 'approved',
      membershipStatus: 'active'
    };
    setUser(defaultStudent);
    setRole('alumno');
  };

  return { user, role, loading, login, logout, switchRole };
}
