import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';

export default function Dashboard({ navigation }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(data);
    });

    return unsub;
  }, []);

  const logout = async () => {
    await signOut(auth);
    navigation.replace('SignIn');
  };

  const deleteEvent = (id) => {
    Alert.alert('Confirm', 'Delete this event?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          await deleteDoc(doc(db, 'events', id));
        },
      },
    ]);
  };

  const toggleFavorite = async (eventId, isFavorited) => {
    const userId = auth.currentUser.uid;
    const eventRef = doc(db, 'events', eventId);

    try {
      await updateDoc(eventRef, {
        favorites: isFavorited ? arrayRemove(userId) : arrayUnion(userId),
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const renderEventCard = ({ item }) => {
    const isFavorited = item.favorites?.includes(auth.currentUser.uid);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {item.createdBy === auth.currentUser.uid && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditEvent', { event: item })}
              >
                <MaterialIcons name="edit" size={24} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteEvent(item.id)}>
                <MaterialIcons name="delete" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description || 'No description provided'}
          </Text>

          <View style={styles.dateContainer}>
            <MaterialIcons name="event" size={18} color="#666" />
            <Text style={styles.dateText}>
              {item.date} • {item.time}
            </Text>
          </View>

          <View style={styles.authorContainer}>
            <MaterialIcons name="person" size={14} color="#888" />
            <Text style={styles.authorText}>
              {item.authorName || 'Unknown author'}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.favoriteButton, isFavorited && styles.favorited]}
            onPress={() => toggleFavorite(item.id, isFavorited)}
          >
            <MaterialIcons
              name={isFavorited ? 'star' : 'star-border'}
              size={20}
              color={isFavorited ? '#FFD700' : '#999'}
            />
            <Text
              style={[
                styles.favoriteText,
                isFavorited && { color: '#FFD700' },
              ]}
            >
              {isFavorited ? 'Favorited' : 'Add to Favorites'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEventCard}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <MaterialIcons name="logout" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D2D2D',
    flex: 1,
    marginRight: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  cardBody: {
    gap: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  dateText: {
    color: '#666',
    fontSize: 14,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  authorText: {
    color: '#888',
    fontSize: 12,
    fontStyle: 'italic',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 10,
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  favorited: {
    backgroundColor: '#fff7cc',
  },
  favoriteText: {
    fontSize: 13,
    color: '#666',
  },
});
