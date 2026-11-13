import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// 1. Import useRouter
import { useRouter } from 'expo-router';


export default function LoginScreen() {
  // 2. Inisialisasi router
  const router = useRouter(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. Tambahkan kata 'async' di sini
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password tidak boleh kosong!');
      return;
    }

    try {
      // 2. Ganti IP ini dengan IP LAN Wi-Fi PC Anda saat ini. 
      // Port bawaan Expo adalah 8081.
      const API_URL = 'http://192.168.0.102:8081/api/login';

      // 3. Proses request Fetch
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // 4. Parsing response dari API
      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // SIMPAN SESI KE MEMORI HP
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userRole', data.role);
        // Jika berhasil, cek role dari API
        if (data.role === 'admin') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/patient/dashboard');
        }
      } else {
        // Jika API merespons dengan error (misal password salah)
        Alert.alert('Login Gagal', data.message || 'Data tidak ditemukan');
      }
    } catch (error) {
      Alert.alert('Koneksi Error', 'Gagal terhubung ke server API');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
          <Text style={styles.title}>Smart Clinic</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email Anda"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Masuk</Text>
          </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Belum punya akun? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerLink}>Daftar Sekarang</Text>
          </TouchableOpacity>
        </View>
    </View>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f7fa', // Warna latar biru sangat muda ala medis
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#2c3e50',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  registerText: {
    color: '#3498db',
    fontSize: 14,
  },
  registerLink: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: 'bold',
  }
});
