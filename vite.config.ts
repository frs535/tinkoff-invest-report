import { defineConfig } from 'vite' //loadEnv
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// export default defineConfig(({ command, mode }) => {
//
//   const env = loadEnv(mode, process.cwd(), '')
//   return {
//     plugins: [react()],
//     // vite config
//     define: {
//       __APP_ENV__: JSON.stringify(env.PUBLIC_URL),
//     },
//   }
// })