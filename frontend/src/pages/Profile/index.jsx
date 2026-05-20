import React from 'react';
import SEO from '../../components/seo/SEO';
import useProfileData from '../../hooks/useProfileData';
import ProfileCard from './components/ProfileCard';
import BookingsList from './components/BookingsList';
import NotificationsList from './components/NotificationsList';
import ReviewModal from './components/ReviewModal';

const Profile = React.memo(() => {
  const {
    user, bookings, notifications, loading,
    isEditing, setIsEditing, editForm, setEditForm,
    isReviewOpen, setIsReviewOpen, reviewData, setReviewData, submittingReview,
    handleLogout, handleUpdateProfile, handleMarkNotifRead,
    handleMarkAllRead, handleCancelBooking, handleOpenReview, submitReview,
    navigate,
  } = useProfileData();

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-light)]">
        <div className="w-7 h-7 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-6 flex flex-col items-center justify-center bg-[var(--color-bg-light)]">
        <h2 className="text-2xl font-serif uppercase tracking-widest mb-6 text-[var(--color-primary)]">Authentication Required</h2>
        <button onClick={() => navigate('/login')} className="px-10 py-3 bg-[var(--color-primary)] text-white text-[10px] font-bold tracking-widest uppercase shadow-md hover:bg-[var(--color-primary)]/90 transition-all">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[var(--color-bg-light)] text-[var(--color-primary)] font-sans selection:bg-[var(--color-primary)] selection:text-white">
      <SEO title="My Profile" description="Manage your appointments, view your booking history, and update your personal details at Moonlit Salon." />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <ProfileCard
          user={user} isEditing={isEditing} setIsEditing={setIsEditing}
          editForm={editForm} setEditForm={setEditForm}
          onUpdate={handleUpdateProfile} onLogout={handleLogout} loading={loading}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <BookingsList bookings={bookings} onCancel={handleCancelBooking} onReview={handleOpenReview} navigate={navigate} />
          <NotificationsList notifications={notifications} onMarkRead={handleMarkNotifRead} onMarkAllRead={handleMarkAllRead} />
        </div>
      </div>
      <ReviewModal
        isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)}
        reviewData={reviewData} setReviewData={setReviewData}
        onSubmit={submitReview} submitting={submittingReview}
      />
    </div>
  );
});

export default Profile;
