import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude:  ['mock-aws-s3', 'aws-sdk', 'nock', './node_modules/@mapbox/node-pre-gyp/lib/util/nw-pre-gyp/index.html']
    }
})

