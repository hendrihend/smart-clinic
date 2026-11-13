import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  const router = useRouter();

  // useEffect ini akan berjalan sekali setiap kali aplikasi baru dibuka
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const role = await AsyncStorage.getItem('userRole');

        // Jika token ditemukan, langsung pindahkan ke Dashboard
        if (token) {
          if (role === 'admin') {
            router.replace('/admin/dashboard');
          } else {
            router.replace('/patient/dashboard');
          }
        }
      } catch (error) {
        console.error('Error saat membaca token:', error);
      }
    };

    checkSession();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="patient/dashboard" options={{ title: 'Dashboard Pasien', headerBackVisible: false }} />
      <Stack.Screen name="patient/booking" options={{ title: 'Booking Antrian' }} />
      <Stack.Screen name="patient/history" options={{ title: 'Riwayat Kunjungan' }} />
      <Stack.Screen name="admin/dashboard" options={{ title: 'Dahsboard Admin', headerBackVisible: false }} />
    </Stack>
  );
}
