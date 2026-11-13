import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  
  // State untuk menyimpan input user
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Validasi form sederhana
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Semua kolom wajib diisi!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password dan Konfirmasi Password tidak cocok!');
      return;
    }

    // Simulasi sukses mendaftar
    Alert.alert(
      'Registrasi Berhasil!',
      'Akun Anda telah dibuat. Silakan login untuk melanjutkan.',
      [
        { text: 'OK', onPress: () => router.replace('/') } // Kembali ke halaman Login
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Daftar Akun Baru</Text>
      <Text style={styles.subtitle}>Lengkapi data diri Anda di bawah ini</Text>

      <TextInput
        style={styles.input}
        placeholder="Nama Lengkap"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email Aktif"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Nomor Telepon / WhatsApp"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Konfirmasi Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Daftar Sekarang</Text>
      </TouchableOpacity>

      {/* Tombol kembali ke Login */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Sudah punya akun? </Text>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={styles.linkText}>Masuk di sini</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f7fa' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#2c3e50', marginBottom: 5 },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#7f8c8d', marginBottom: 30 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#7f8c8d' },
  linkText: { color: '#3498db', fontWeight: 'bold' }
});
