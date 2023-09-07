import { useEffect } from "react";

const useGoogleMaps = (callback) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    window.initMap = callback;
    document.head.appendChild(script);
  }, [callback]);
};

export default useGoogleMaps;
