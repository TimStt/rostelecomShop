import {
  IBbox,
  IGetGeolocationUser,
  handlerSelectAdress,
} from "@/shared/config/types/geo";
import { selectMapOrder } from "@/shared/stores/order";
import { useSelector } from "react-redux";

const useUpdateMap = () => {
  const map = useSelector(selectMapOrder);

  const handleUpdateMap = async ({
    position,
    box,
    initialMapInstance,
  }: handlerSelectAdress) => {
    const ttmap = await import("@tomtom-international/web-sdk-maps");

    const currentMap = initialMapInstance || map;

    const southwest = new ttmap.LngLat(box.lon1, box.lat1);
    const northeast = new ttmap.LngLat(box.lon2, box.lat2);

    const bounds = new ttmap.LngLatBounds(southwest, northeast);

    const elementMarker = document.createElement("div");
    elementMarker.classList.add("map-marker");

    currentMap.fitBounds(bounds, {
      padding: 130,
      linear: true,
    });

    new ttmap.Marker({
      element: elementMarker,
    })
      .setLngLat([position.lon, position.lat])
      .addTo(currentMap);
  };

  return { handleUpdateMap };
};

export default useUpdateMap;
