// @ts-nocheck
import {
  setLoadListGeoDataOffice,
  getOfficeByCity,
} from "@/shared/stores/order";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

export const getBounds = (data) => {
  var btmRight;
  var topLeft;
  if (data.viewport) {
    btmRight = [
      data.viewport.btmRightPoint.lng,
      data.viewport.btmRightPoint.lat,
    ];
    topLeft = [data.viewport.topLeftPoint.lng, data.viewport.topLeftPoint.lat];
  }
  return [btmRight, topLeft];
};

export const useHandleSelectPickUpAddress = () => {
  const dispatch = useDispatch<AppDispatch>();

  return async (valueSearch: string) => {
    dispatch(setLoadListGeoDataOffice(true));
    const data = await dispatch(
      getOfficeByCity({
        city: valueSearch?.split(" ")[0].replace(",", ""),
        lang: "ru",
      })
    );
    return unwrapResult(data);
  };
};

export const handleResultsFound = (event, searchMarkersManager, map) => {
  const results = event.data.results.fuzzySearch.results;

  if (results.length === 0) {
    searchMarkersManager.clear();
  }
  searchMarkersManager.draw(results);
  fitToViewport(results, map);
};

export const fitToViewport = async (markerData, map) => {
  const ttmaps = await import("@tomtom-international/web-sdk-maps");
  if (!markerData || (markerData instanceof Array && !markerData.length)) {
    return;
  }
  const bounds = new ttmaps.LngLatBounds();
  if (markerData instanceof Array) {
    markerData.forEach(function (marker) {
      bounds.extend(getBounds(marker));
    });
  } else {
    bounds.extend(getBounds(markerData));
  }
  map.fitBounds(bounds, { padding: 100, linear: true });
};

export const handleResultSelection = async (
  event,
  searchMarkersManager,
  map,
  handleSelectPickUpAddress
) => {
  const result = event.data?.result;
  await handleSelectPickUpAddress(event.data.text);
  if (result.type === "category" || result.type === "brand") {
    return;
  }
  searchMarkersManager.draw([result]);
  fitToViewport(result, map);
};

export const handleResultClearing = (
  searchMarkersManager,
  map,
  userGeolacation,
  handleSelectPickUpAddress
) => {
  searchMarkersManager.clear();

  if (!!userGeolacation?.features) {
    handleSelectPickUpAddress &&
      handleSelectPickUpAddress(userGeolacation.features[0].properties.city);

    map
      .setCenter([
        userGeolacation.features[0].properties.lon,
        userGeolacation.features[0].properties.lat,
      ])
      .zoomTo(10);
  } else {
    map.setCenter(JSON.parse([37.617644, 55.755819])).zoomTo(10);
  }

  document.querySelector(".map-marker")?.remove();
};

export function SearchMarkersManager(map, options) {
  this.map = map;
  this._options = options || {};
  this._poiList = undefined;
  this.markers = {};
}

export function initSearchMarker(ttMaps) {
  function SearchMarker(poiData, options) {
    this.poiData = poiData;

    this.options = options || {};

    this.marker = new ttMaps.Marker({
      element: this.createMarker(),
      anchor: "bottom",
    });

    const lon = this.poiData.position.lng || this.poiData.position.lon;

    this.marker.setLngLat([lon, this.poiData.position.lat]);
  }

  SearchMarker.prototype.addTo = function (map) {
    this.marker.addTo(map);
    this._map = map;
    return this;
  };

  SearchMarker.prototype.createMarker = function () {
    const elem = document.createElement("div");
    // elem.className = 'tt-icon-marker-black tt-search-marker'
    if (this.options.markerClassName) {
      elem.className += " " + this.options.markerClassName;
    }
    const innerElem = document.createElement("div");
    innerElem.setAttribute(
      "style",
      "background: white; width: 10px; height: 10px; border-radius: 50%; border: 3px solid black;"
    );

    elem.appendChild(innerElem);
    return elem;
  };

  SearchMarker.prototype.remove = function () {
    this.marker.remove();
    this._map = null;
  };

  SearchMarkersManager.prototype.draw = function (poiList) {
    this._poiList = poiList;
    this.clear();

    this._poiList.forEach(function (poi) {
      const markerId = poi.id;
      const poiOpts = {
        name: poi.poi ? poi.poi.name : undefined,
        address: poi.address ? poi.address.freeformAddress : "",
        distance: poi.dist,
        classification: poi.poi ? poi.poi.classifications[0].code : undefined,
        position: poi.position,
        entryPoints: poi.entryPoints,
      };

      const marker = new SearchMarker(poiOpts, this._options);

      marker.addTo(this.map);

      this.markers[markerId] = marker;
    }, this);
  };

  SearchMarkersManager.prototype.clear = function () {
    for (const markerId in this.markers) {
      const marker = this.markers[markerId];
      marker.remove();
    }
    this.markers = {};
    this._lastClickedMarker = null;
  };
}
