import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { UserRole, UserProfile } from '../types';

const OWNER_EMAIL = 'safeness.c.a@gmail.com';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('alumno');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem('kira_active_session_user');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole('alumno');
        setLoading(false);
        return;
      }
      try {
        const isOwner = firebaseUser.email?.toLowerCase() === OWNER_EMAIL && firebaseUser.emailVerified;
        const userRef = doc(db, 'users', firebaseUser.uid);
        const profileSnapshot = await getDoc(userRef);
        let profileData: Record<string, any>;

        if (profileSnapshot.exists()) {
          profileData = profileSnapshot.data();
          const storedRole = profileData.role || 'alumno';
          const pendingCoach = !isOwner &&
            (profileData.requestedRole === 'coach' || storedRole === 'coach') &&
            profileData.approvalStatus !== 'approved';
          const effectiveRole = isOwner ? 'admin' : (pendingCoach ? 'alumno' : storedRole);

          await updateDoc(userRef, { lastLoginAt: serverTimestamp() }).catch((error) => {
            console.warn('[Auth] No se pudo actualizar lastLoginAt:', error);
          });

          const resolved: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Usuario KIRA',
            photoURL: firebaseUser.photoURL || '',
            points: 0,
            approvalStatus: 'pending',
            membershipStatus: 'inactive',
            ...profileData,
            role: effectiveRole,
            requestedRole: pendingCoach ? 'coach' : profileData.requestedRole,
            uid: firebaseUser.uid,
          };
          setUser(resolved);
          setRole(effectiveRole as UserRole);
        } else {
          const requestedRole = sessionStorage.getItem('requestedRole') === 'coach' ? 'coach' : 'alumno';
          sessionStorage.removeItem('requestedRole');
          profileData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Usuario KIRA',
            photoURL: firebaseUser.photoURL || '',
            role: isOwner ? 'admin' : 'alumno',
            requestedRole: isOwner ? 'alumno' : requestedRole,
            approvalStatus: isOwner ? 'approved' : 'pending',
            membershipStatus: isOwner ? 'active' : 'inactive',
            isEmailVerified: firebaseUser.emailVerified,
            isPublicProfile: false,
            points: 0,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          };
          await setDoc(userRef, profileData);
          const resolved = { ...profileData, uid: firebaseUser.uid } as UserProfile;
          setUser(resolved);
          setRole(resolved.role);
        }
      } catch (error) {
        console.error('[Auth] No se pudo validar el perfil en Firestore. No se concede sesión local:', error);
        setUser(null);
        setRole('alumno');
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (targetRole: UserRole = 'alumno') => {
    sessionStorage.setItem('requestedRole', targetRole === 'coach' ? 'coach' : 'alumno');
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      sessionStorage.removeItem('requestedRole');
      throw error;
    }
  };

  const logout = async () => {
    try { await signOut(auth); } finally {
      sessionStorage.removeItem('requestedRole');
      localStorage.removeItem('kira_active_session_user');
      setUser(null);
      setRole('alumno');
    }
  };

  return { user, role, loading, login, logout };
}
