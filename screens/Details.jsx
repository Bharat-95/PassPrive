import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import supabase from '../supabase';

export default function Details() {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim() || !phone.trim()) {
      alert('Please fill all fields');
      return;
    }

    try {
      setLoading(true);

      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr || !user) {
        alert('User not found');
        return;
      }

      // send to backend API
      const response = await fetch('https://nxxacdlmcc.execute-api.ap-south-1.amazonaws.com/api/user/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          full_name: fullName,
          phone: phone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || 'Something went wrong');
        return;
      }

      // navigate home
      navigation.replace('Home');
    } catch (e) {
      console.log('Details error:', e);
      alert('Failed to save details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.bg}>
      <Text style={styles.header}>Complete Your Profile</Text>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="Enter your full name"
          placeholderTextColor="#777"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          placeholder="Enter your phone number"
          placeholderTextColor="#777"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Save & Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    padding: 20,
    paddingTop: 60,
  },

  header: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 30,
  },

  inputBox: {
    marginBottom: 20,
  },

  label: {
    color: '#C59D5F',
    marginBottom: 6,
    fontSize: 14,
  },

  input: {
    backgroundColor: '#1A1A1A',
    padding: 12,
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
  },

  saveBtn: {
    backgroundColor: '#C59D5F',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },

  saveText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
