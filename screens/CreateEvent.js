import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Platform,
  Pressable,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth, db } from '../firebase/firebaseConfig';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

const schema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  date: Yup.date().required('Date is required'),
});

export default function CreateEvent({ route, navigation }) {
  const { event } = route.params || {};
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, setValue, watch, formState: { errors },reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      date: event?.date ? new Date(event.date) : new Date(),
    }
  });

  const selectedDate = watch('date');

  const onSubmit = async (data) => {
    const eventData = {
      ...data,
      date: data.date.toISOString(),
    };

    if (event) {
      await updateDoc(doc(db, 'events', event.id), eventData);
    } else {
      await addDoc(collection(db, 'events'), {
        ...eventData,
        createdBy: auth.currentUser.uid,
        favorites: [],
      });
    }
    navigation.goBack();
  };

  useLayoutEffect(() => {       
    reset();
  }
  , []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>Title</Text>
        <Controller
          name="title"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Enter event title"
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
        />
        {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

        <Text style={styles.label}>Description</Text>
        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Enter event description"
              onChangeText={onChange}
              value={value}
              multiline
              numberOfLines={4}
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            />
          )}
        />
        {errors.description && <Text style={styles.error}>{errors.description.message}</Text>}

        <Text style={styles.label}>Event Date</Text>
        <Pressable
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
        >
          <Text style={styles.dateText}>{selectedDate?.toDateString()}</Text>
        </Pressable>
        {errors.date && <Text style={styles.error}>{errors.date.message}</Text>}

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selected) => {
              setShowDatePicker(false);
              if (selected) {
                setValue('date', selected);
              }
            }}
          />
        )}

        <View style={{ marginTop: 20 }}>
          <Button
            title={event ? 'Update Event' : 'Create Event'}
            onPress={handleSubmit(onSubmit)}
            color="#3B82F6"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 50,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
    textAlign: 'center',
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  dateText: {
    color: '#333',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 12,
  },
});
