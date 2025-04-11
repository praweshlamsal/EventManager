import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export const toggleFavorite = async (eventId, isFavorited) => {
  const userId = auth.currentUser.uid;

  const eventRef = doc(db, 'events', eventId);

  try {
    await updateDoc(eventRef, {
      favorites: isFavorited ? arrayRemove(userId) : arrayUnion(userId),
    });
    console.log(isFavorited ? 'Removed from favorites' : 'Added to favorites');
  } catch (error) {
    console.error('Error updating favorites:', error);
  }
};