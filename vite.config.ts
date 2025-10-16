// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     headers: {
//       "Content-Security-Policy": 
//         "default-src 'self'; " +
//         "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
//         "style-src 'self' 'unsafe-inline' 'sha256-4IOjfnKvRfwgSR9Gq//OYyy0W6EMJM+cBueanLFn880=';",
//     },
//     proxy: {
//       "/api": {
//         target: "http://localhost:3005",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/socket.io": {
//         target: "http://localhost:3005",
//         ws: true,
//         changeOrigin: true,
//       },
//     },
//   },
// })


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     headers: {
//       "Content-Security-Policy": 
//         "default-src 'self'; " +
//         "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
//         "style-src 'self' 'unsafe-inline';",
//     },
//   },
// })

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5176, // ✅ Ensures frontend runs on 5175
//     cors: true,
//     proxy: {
//       "/api": {
//         target: "http://localhost:3005",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/socket.io": {
//         target: "http://localhost:3005",
//         ws: true,
//         changeOrigin: true,
//       },
//     },
//   },
// });


// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5177, // ✅ Ensure frontend runs on 5176
//     proxy: {
//       "/api": {
//         target: "http://localhost:5001", // ✅ Match backend port
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//     headers: {
//       "Content-Security-Policy":
//         "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
//         "style-src 'self' 'unsafe-inline'; " +
//         "connect-src 'self' http://localhost:5001 http://localhost:5177 ws://localhost:5001 wss://localhost:5001;",
//     },
//   },
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // ✅ Set Vite frontend to run on port 5178
    proxy: {
      "/api": {
        target: "http://localhost:5001", // ✅ Proxy API requests to backend running on port 5001
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    headers: {
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:5001 ws://localhost:5001 wss://localhost:5001;"
    },
  },
  define: {
    "process.env": {}, // Prevents Vite from complaining about `process.env`
  },
});

