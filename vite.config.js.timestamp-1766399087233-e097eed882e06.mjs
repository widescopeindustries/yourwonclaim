// vite.config.js
import { defineConfig } from "file:///C:/Users/molyndon/Documents/yourwonclaim.com/yourwonclaim/node_modules/vite/dist/node/index.js";
import { copyFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join } from "path";
var vite_config_default = defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "index.html",
        calculator: "calculator.html"
      }
    }
  },
  server: {
    port: 5173
  },
  plugins: [
    {
      name: "copy-seo-files",
      closeBundle() {
        const articlesDir = "articles";
        const distArticlesDir = "dist/articles";
        if (existsSync(articlesDir)) {
          if (!existsSync(distArticlesDir)) {
            mkdirSync(distArticlesDir, { recursive: true });
          }
          const files = readdirSync(articlesDir);
          files.forEach((file) => {
            copyFileSync(
              join(articlesDir, file),
              join(distArticlesDir, file)
            );
          });
          console.log(`\u2705 Copied ${files.length} SEO articles to dist/articles/`);
        }
        const pagesDir = "pages";
        const distPagesDir = "dist/pages";
        if (existsSync(pagesDir)) {
          if (!existsSync(distPagesDir)) {
            mkdirSync(distPagesDir, { recursive: true });
          }
          const pageFiles = readdirSync(pagesDir);
          pageFiles.forEach((file) => {
            copyFileSync(
              join(pagesDir, file),
              join(distPagesDir, file)
            );
          });
          console.log(`\u2705 Copied ${pageFiles.length} pages to dist/pages/`);
        }
        const seoFiles = ["sitemap.xml", "robots.txt", "site.webmanifest", "favicon.svg", "calculator.html"];
        seoFiles.forEach((file) => {
          if (existsSync(file)) {
            copyFileSync(file, join("dist", file));
            console.log(`\u2705 Copied ${file} to dist/`);
          }
        });
      }
    }
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxtb2x5bmRvblxcXFxEb2N1bWVudHNcXFxceW91cndvbmNsYWltLmNvbVxcXFx5b3Vyd29uY2xhaW1cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXG1vbHluZG9uXFxcXERvY3VtZW50c1xcXFx5b3Vyd29uY2xhaW0uY29tXFxcXHlvdXJ3b25jbGFpbVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvbW9seW5kb24vRG9jdW1lbnRzL3lvdXJ3b25jbGFpbS5jb20veW91cndvbmNsYWltL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHsgY29weUZpbGVTeW5jLCBta2RpclN5bmMsIHJlYWRkaXJTeW5jLCBleGlzdHNTeW5jIH0gZnJvbSAnZnMnXHJcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgb3V0RGlyOiAnZGlzdCcsXHJcbiAgICAgICAgZW1wdHlPdXREaXI6IHRydWUsXHJcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgICAgICBpbnB1dDoge1xyXG4gICAgICAgICAgICAgICAgbWFpbjogJ2luZGV4Lmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY2FsY3VsYXRvcjogJ2NhbGN1bGF0b3IuaHRtbCcsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgICAgcG9ydDogNTE3M1xyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdjb3B5LXNlby1maWxlcycsXHJcbiAgICAgICAgICAgIGNsb3NlQnVuZGxlKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gQ29weSBhcnRpY2xlcyBmb2xkZXIgdG8gZGlzdCBhZnRlciBidWlsZFxyXG4gICAgICAgICAgICAgICAgY29uc3QgYXJ0aWNsZXNEaXIgPSAnYXJ0aWNsZXMnXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXN0QXJ0aWNsZXNEaXIgPSAnZGlzdC9hcnRpY2xlcydcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzU3luYyhhcnRpY2xlc0RpcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWV4aXN0c1N5bmMoZGlzdEFydGljbGVzRGlyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBta2RpclN5bmMoZGlzdEFydGljbGVzRGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZXMgPSByZWFkZGlyU3luYyhhcnRpY2xlc0RpcilcclxuICAgICAgICAgICAgICAgICAgICBmaWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3B5RmlsZVN5bmMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2luKGFydGljbGVzRGlyLCBmaWxlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpvaW4oZGlzdEFydGljbGVzRGlyLCBmaWxlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgXHUyNzA1IENvcGllZCAke2ZpbGVzLmxlbmd0aH0gU0VPIGFydGljbGVzIHRvIGRpc3QvYXJ0aWNsZXMvYClcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDb3B5IHBhZ2VzIGZvbGRlciB0byBkaXN0XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYWdlc0RpciA9ICdwYWdlcydcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RQYWdlc0RpciA9ICdkaXN0L3BhZ2VzJ1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChleGlzdHNTeW5jKHBhZ2VzRGlyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZXhpc3RzU3luYyhkaXN0UGFnZXNEaXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1rZGlyU3luYyhkaXN0UGFnZXNEaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWdlRmlsZXMgPSByZWFkZGlyU3luYyhwYWdlc0RpcilcclxuICAgICAgICAgICAgICAgICAgICBwYWdlRmlsZXMuZm9yRWFjaChmaWxlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29weUZpbGVTeW5jKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgam9pbihwYWdlc0RpciwgZmlsZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2luKGRpc3RQYWdlc0RpciwgZmlsZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFx1MjcwNSBDb3BpZWQgJHtwYWdlRmlsZXMubGVuZ3RofSBwYWdlcyB0byBkaXN0L3BhZ2VzL2ApXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ29weSBTRU8gZmlsZXMgKHNpdGVtYXAsIHJvYm90cy50eHQsIGV0Yy4pXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzZW9GaWxlcyA9IFsnc2l0ZW1hcC54bWwnLCAncm9ib3RzLnR4dCcsICdzaXRlLndlYm1hbmlmZXN0JywgJ2Zhdmljb24uc3ZnJywgJ2NhbGN1bGF0b3IuaHRtbCddXHJcbiAgICAgICAgICAgICAgICBzZW9GaWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHNTeW5jKGZpbGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvcHlGaWxlU3luYyhmaWxlLCBqb2luKCdkaXN0JywgZmlsZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBcdTI3MDUgQ29waWVkICR7ZmlsZX0gdG8gZGlzdC9gKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICBdXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVcsU0FBUyxvQkFBb0I7QUFDdFksU0FBUyxjQUFjLFdBQVcsYUFBYSxrQkFBa0I7QUFDakUsU0FBUyxZQUFZO0FBRXJCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLE9BQU87QUFBQSxJQUNILFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLGVBQWU7QUFBQSxNQUNYLE9BQU87QUFBQSxRQUNILE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxNQUNoQjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSixNQUFNO0FBQUEsRUFDVjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0w7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLGNBQWM7QUFFVixjQUFNLGNBQWM7QUFDcEIsY0FBTSxrQkFBa0I7QUFFeEIsWUFBSSxXQUFXLFdBQVcsR0FBRztBQUN6QixjQUFJLENBQUMsV0FBVyxlQUFlLEdBQUc7QUFDOUIsc0JBQVUsaUJBQWlCLEVBQUUsV0FBVyxLQUFLLENBQUM7QUFBQSxVQUNsRDtBQUVBLGdCQUFNLFFBQVEsWUFBWSxXQUFXO0FBQ3JDLGdCQUFNLFFBQVEsVUFBUTtBQUNsQjtBQUFBLGNBQ0ksS0FBSyxhQUFhLElBQUk7QUFBQSxjQUN0QixLQUFLLGlCQUFpQixJQUFJO0FBQUEsWUFDOUI7QUFBQSxVQUNKLENBQUM7QUFDRCxrQkFBUSxJQUFJLGlCQUFZLE1BQU0sTUFBTSxpQ0FBaUM7QUFBQSxRQUN6RTtBQUdBLGNBQU0sV0FBVztBQUNqQixjQUFNLGVBQWU7QUFFckIsWUFBSSxXQUFXLFFBQVEsR0FBRztBQUN0QixjQUFJLENBQUMsV0FBVyxZQUFZLEdBQUc7QUFDM0Isc0JBQVUsY0FBYyxFQUFFLFdBQVcsS0FBSyxDQUFDO0FBQUEsVUFDL0M7QUFFQSxnQkFBTSxZQUFZLFlBQVksUUFBUTtBQUN0QyxvQkFBVSxRQUFRLFVBQVE7QUFDdEI7QUFBQSxjQUNJLEtBQUssVUFBVSxJQUFJO0FBQUEsY0FDbkIsS0FBSyxjQUFjLElBQUk7QUFBQSxZQUMzQjtBQUFBLFVBQ0osQ0FBQztBQUNELGtCQUFRLElBQUksaUJBQVksVUFBVSxNQUFNLHVCQUF1QjtBQUFBLFFBQ25FO0FBR0EsY0FBTSxXQUFXLENBQUMsZUFBZSxjQUFjLG9CQUFvQixlQUFlLGlCQUFpQjtBQUNuRyxpQkFBUyxRQUFRLFVBQVE7QUFDckIsY0FBSSxXQUFXLElBQUksR0FBRztBQUNsQix5QkFBYSxNQUFNLEtBQUssUUFBUSxJQUFJLENBQUM7QUFDckMsb0JBQVEsSUFBSSxpQkFBWSxJQUFJLFdBQVc7QUFBQSxVQUMzQztBQUFBLFFBQ0osQ0FBQztBQUFBLE1BQ0w7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
