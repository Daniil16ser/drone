import * as Cesium from "cesium";
import { Cartesian3, Color } from "cesium";
import { useState, useRef } from "react";
import { Entity, Viewer } from "resium";

export default function CesiumMap() {
  const [points, setPoints] = useState([]);
  const viewerRef = useRef();

  const handleMapClick = (movement) => {
    if (!viewerRef.current) return;
    
    const viewer = viewerRef.current.cesiumElement;
    const scene = viewer.scene;
    
    const ray = viewer.camera.getPickRay(movement.position);
    const position = scene.globe.pick(ray, scene);
    
    if (position) {

      const cartographic = Cesium.Cartographic.fromCartesian(position);
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      const height = cartographic.height;
      
      console.log( { longitude, latitude, height });

      setPoints(prev => [...prev, {
        id: Date.now(),
        lon: longitude,
        lat: latitude,
        height: height
      }]);
    }
  };

  return (
    <Viewer 
      full 
      ref={viewerRef}
      onClick={handleMapClick}
    >
      <Entity
        name="Tokyo"
        position={Cartesian3.fromDegrees(55.819, 37.867, 100)}
        point={{ pixelSize: 20, color: Color.WHITE }}
        description="Tokyo"
      />
      
      {points.map(point => (
        <Entity
          key={point.id}
          position={Cartesian3.fromDegrees(point.lon, point.lat, point.height || 0)}
          point={{ pixelSize: 15, color: Color.RED }}
          description={`${point.lon.toFixed(4)}, ${point.lat.toFixed(4)}`}
        />
      ))}
    </Viewer>
  );
}

// import { Viewer } from "resium";

// export default function Cesium() {
//   return <Viewer full />;
// }


// import { Viewer } from "resium";

// function App() {
//   return <Viewer />;
// }

// export default App;