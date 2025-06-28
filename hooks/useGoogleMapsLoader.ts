import { useJsApiLoader } from "@react-google-maps/api";

export const useGoogleMapsLoader = () => {
  return useJsApiLoader({
    googleMapsApiKey: String(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
    libraries: ["places"],
  });
};
