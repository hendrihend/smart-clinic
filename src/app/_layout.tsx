import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Halaman Login */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
      {/* Halaman Pasien */}
      <Stack.Screen name="patient/dashboard" options={{ title: 'Dashboard Pasien', headerBackVisible: false }} />
      <Stack.Screen name="patient/booking" options={{ title: 'Booking Antrian' }} />
      <Stack.Screen name="patient/history" options={{ title: 'Riwayat Kunjungan' }} />
      
      {/* Halaman Admin */}
      <Stack.Screen name="admin/dashboard" options={{ title: 'Dashboard Admin', headerBackVisible: false }} />
    </Stack>
  );
}














// import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { useColorScheme } from 'react-native';

// import { AnimatedSplashOverlay } from '@/components/animated-icon';
// import AppTabs from '@/components/app-tabs';

// SplashScreen.preventAutoHideAsync();

// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <AnimatedSplashOverlay />
//       <AppTabs />
//     </ThemeProvider>
//   );
// }
