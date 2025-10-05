// Script that runs before React hydration to prevent flash
export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const theme = localStorage.getItem('theme') || 'light';
            if (theme === 'dark') {
              document.documentElement.classList.add('dark');
            }
          })();
        `,
      }}
    />
  );
}

