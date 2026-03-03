import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.memorychallenge.app',
  appName: '기억력 챌린지',
  webDir: 'dist',
  server: {
    // 1. 여기에 본인 PC의 IP와 React 포트(보통 5173 또는 3000)를 적어주세요.
    url: 'http://192.168.123.105:5173',
    // 2. HTTP 연결을 허용합니다.
    cleartext: true,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#667eea',
      showSpinner: false,
    },
  },
};

export default config;
