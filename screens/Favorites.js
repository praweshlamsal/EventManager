import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebase/firebaseConfig';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { MaterialIcons, Feather } from '@expo/vector-icons';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snapshot) => {
      const favs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(event => event.favorites?.includes(auth.currentUser.uid));
      setFavorites(favs);
    });

    return unsub;
  }, []);

  const removeFavorite = async (id, currentFavs) => {
    Alert.alert('Confirm', 'Remove from favorites?', [
      { text: 'Cancel' },
      {
        text: 'Remove', onPress: async () => {
          await updateDoc(doc(db, 'events', id), {
            favorites: currentFavs.filter(uid => uid !== auth.currentUser.uid)
          });
        }
      }
    ]);
  };

  const renderFavoriteCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialIcons name="favorite" size={24} color="#E91E63" />
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Feather name="calendar" size={18} color="#666" />
          <Text style={styles.infoText}>{item.date}</Text>
        </View>

        <View style={styles.infoRow}>
          <Feather name="clock" size={18} color="#666" />
          <Text style={styles.infoText}>{item.time}</Text>
        </View>

        <View style={styles.infoRow}>
          <Feather name="user" size={18} color="#666" />
          <Text style={styles.infoText}>{item.authorName || 'Unknown Organizer'}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeFavorite(item.id, item.favorites)}
      >
        <MaterialIcons name="delete-outline" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="favorite-border" size={64} color="#E91E63" />
          <Text style={styles.emptyText}>No favorites yet!</Text>
          <Text style={styles.emptySubtext}>Tap the heart icon on events to add them here</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          renderItem={renderFavoriteCard}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2D2D2D',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginVertical:8
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D2D2D',
    marginLeft: 12,
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FF5252',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
});