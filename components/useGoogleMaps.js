import { useEffect } from "react";

const isMyScriptLoaded = (url) => {
  var scripts = document.getElementsByTagName('script');
  for (var i = scripts.length; i--;) {
      if (scripts[i].src == url) return true;
  }
  return false;
}

const useGoogleMaps = (callback) => {
  useEffect(() => {
    const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places&callback=initMap`;

    if (!isMyScriptLoaded(scriptUrl)) {
      const noop = () => {};
      window.initMap = callback || noop;
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.type = "text/javascript";
      script.src = scriptUrl;
      document.head.appendChild(script);
    }
    
  }, [callback]);
};

export default useGoogleMaps;
