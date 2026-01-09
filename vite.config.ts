import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '', // 배포 환경에서 경로 문제를 방지합니다.
      plugins: [react()],
      define: {
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // 중요: src 폴더가 없으므로 현재 폴더(.)를 가리키도록 수정합니다.
          '@': path.resolve(__dirname, '.'), 
        }
      },
      build: {
        outDir: 'dist',
      }
    };
});
