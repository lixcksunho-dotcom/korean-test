import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // 1. 배포 시 상대 경로를 인식하도록 설정 (하얀 화면 해결 핵심)
      base: './', 
      
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // 2. 경로 별칭 설정 보완
          '@': path.resolve(__dirname, './src'), 
        }
      },
      // 3. 빌드 결과물 위치 명시 (Vercel 기본값과 일치)
      build: {
        outDir: 'dist',
      }
    };
});
