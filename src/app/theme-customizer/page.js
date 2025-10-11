import React, { useState } from 'react';

const themes = [
  { name: 'Light', className: 'theme-light' },
  { name: 'Dark', className: 'theme-dark' },
  { name: 'Blue', className: 'theme-blue' },
];

export default function ThemeCustomizerPage() {
  const [selectedTheme, setSelectedTheme] = useState('theme-light');

  const handleThemeChange = (themeClass) => {
    setSelectedTheme(themeClass);
    document.documentElement.className = themeClass;
    localStorage.setItem('selectedTheme', themeClass);
  };

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      document.documentElement.className = savedTheme;
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Theme Customizer</h1>
      <div className="flex gap-4">
        {themes.map((theme) => (
          <button
            key={theme.className}
            className={`px-4 py-2 rounded font-semibold border ${selectedTheme === theme.className ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => handleThemeChange(theme.className)}
          >
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
}
