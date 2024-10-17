import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});





// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     include: ['@ckeditor/ckeditor5-react', '@ckeditor/ckeditor5-build-classic'],
//   },
//   build: {
//     commonjsOptions: {
//       include: [/@ckeditor/],
//     },
//   },
// });
