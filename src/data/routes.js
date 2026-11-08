// Demo route optimization result. NOT real OR-Tools output — labelled simulation.
// Intended backend: Google OR-Tools VRP solver. This is a clearly-labeled frontend prototype.

export function generateDemoRoute(selectedBins, vehicle) {
  const ordered = [...selectedBins].sort((a, b) => {
    // Simulated nearest-neighbor ordering from city center for demo purposes
    const da = Math.hypot(a.lat - 17.7061, a.lng - 83.3018);
    const db = Math.hypot(b.lat - 17.7061, b.lng - 83.3018);
    return da - db;
  });

  let distance = 0;
  let prev = { lat: vehicle.lat, lng: vehicle.lng };
  const sequence = ordered.map((b, i) => {
    const leg = Math.hypot(b.lat - prev.lat, b.lng - prev.lng) * 111;
    distance += leg;
    prev = { lat: b.lat, lng: b.lng };
    return {
      stop: i + 1,
      bin: b.id,
      location: b.location,
      fill: b.fill,
      priority: b.priority,
      legKm: leg.toFixed(2),
    };
  });

  // return leg to depot
  distance += Math.hypot(prev.lat - 17.7061, prev.lng - 83.3018) * 111;

  return {
    isDemo: true,
    engine: 'Demo nearest-neighbor simulation (OR-Tools intended)',
    vehicleId: vehicle.id,
    driver: vehicle.driver,
    sequence,
    totalDistance: distance.toFixed(2),
    travelTimeMin: Math.round((distance / 22) * 60 + ordered.length * 4),
    stops: ordered.length,
    start: { lat: vehicle.lat, lng: vehicle.lng, label: `${vehicle.id} Depot` },
    end: { lat: 17.7061, lng: 83.3018, label: 'Central Depot' },
  };
}
