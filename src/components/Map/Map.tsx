import React, { useRef, useState, useEffect } from "react";
import * as ol from "ol";
import styled from "styled-components";
import * as proj from "ol/proj";
import * as source from "ol/source";
import * as geom from "ol/geom";
import { Tile, Vector } from "ol/layer";
import { Style, Fill, Stroke, Circle } from "ol/style";

const MapElement = styled.div`
  width: 100%;
  height: 100%;
  flex: 0 0 auto;
`;

interface IMapProps {
  data: {
    locations: Array<any>;
  } | null;
}

const Map: React.FC<IMapProps> = ({ data }) => {
  const mapRef = useRef<any>(null);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    let options = {
      target: mapRef.current,
      view: new ol.View({
        zoom: 16,
        center: proj.fromLonLat([126.9779451, 37.5662952]),
      }),
      layers: [
        new Tile({
          source: new source.OSM(),
        }),
      ],
      controls: [],
      overlays: [],
    };
    let mapObject = new ol.Map(options);

    setMap(mapObject);

    return () => mapObject.setTarget(undefined);
  }, []);

  useEffect(() => {
    if (!map || !data) return;

    if (map && Array.isArray(data?.locations) && data?.locations.length) {
      data?.locations.forEach((item) => {
        const layer: any = new Vector({
          source: new source.Vector({
            features: [
              new ol.Feature({
                geometry: new geom.Point(proj.fromLonLat([item[1], item[0]])),
              }),
            ],
          }),
          style: new Style({
            image: new Circle({
              radius: 8,
              stroke: new Stroke({
                color: "blue",
                width: 2,
              }),
            }),
          }),
        });
        map.addLayer(layer);
      });
    }
  }, [data, map]);

  return <MapElement ref={mapRef}></MapElement>;
};

export default Map;
