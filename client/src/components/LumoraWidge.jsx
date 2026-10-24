import { useEffect } from 'react';

export default function LumoraWidget() {
  useEffect(() => {
    // Prevent duplicate script injection
    if (document.getElementById('lumora-ai-widget')) return;

    const script = document.createElement('script');
    script.id = 'lumora-ai-widget';
    script.src = 'http://localhost:5173/assistant.js';
    script.setAttribute('data-user-id', '6ada3bda6a02631fd8c3d218');
    script.async = true;
    
    document.body.appendChild(script);

    // Cleanup if needed (optional)
    return () => {
      // If your app unmounts, you can choose to remove the widget script
      // document.body.removeChild(script);
    };
  }, []);

  return null; // This component doesn't render anything visible
}