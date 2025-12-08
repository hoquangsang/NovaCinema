import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileApi } from '../api/endpoints/profile.api';
import type { User } from '../api/endpoints/auth.api';
import ProfileLayout from '../features/profile/ProfileLayout';

const ProfilePage = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          const data = await profileApi.getProfile();
          setProfile(data);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div className="p-6">Please log in to view your profile.</div>;
  }

  if (isLoading) {
    return <div className="p-6">Loading profile...</div>;
  }

  return <ProfileLayout profile={profile} user={user} onLogout={logout} />;
};

export default ProfilePage;