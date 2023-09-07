import { useEffect } from "react";

const SCRIPT_ID = 'appymeal-maps-api-script';

const getScriptById = (scriptId) => {
  const script = document.getElementById(scriptId);
  return script;
}

const useGoogleMaps = (callback) => {
  useEffect(() => {
    const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places&callback=initMap`;
    const existingScript = getScriptById(SCRIPT_ID)
    if (existingScript) {
      // Remove so we don't accidentally load it multiple times
      existingScript.remove();
    }

    const noop = () => {};
      window.initMap = callback;
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.type = "text/javascript";
      script.src = scriptUrl;
      script.id = SCRIPT_ID;
      document.head.appendChild(script);
    
  }, [callback]);
};

export default useGoogleMaps;
