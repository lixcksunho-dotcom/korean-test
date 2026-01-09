import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // 배포 시 경로 문제를 방지하기 위해 빈 문자열로 설정합니다.
      base: '', 
      
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
          // 중요: 현재 파일들이 src 폴더가 아닌 최상위에 있으므로 경로를 수정합니다.
          '@': path.resolve(__dirname, '.'), 
        }
      },
      build: {
        outDir: 'dist',
        // 브라우저 호환성을 위해 에셋 경로를 관리합니다.
        assetsDir: 'assets',
      }
    };
});
