export async function loadRiveScript() {
    return new Promise((resolve, reject) => {
      if (
        document.querySelector(
          "script[src='https://unpkg.com/@rive-app/canvas@2.9.1']"
        )
      ) {
        resolve(true);
      }
  
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@rive-app/canvas@2.9.1";
      script.async = true;
  
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Failed to load Rive script"));
  
      document.head.appendChild(script);
    });
  }