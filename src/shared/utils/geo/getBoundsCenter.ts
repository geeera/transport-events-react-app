export function getBoundsCenter(coords: { lat: number; lng: number }[]) {
    const lats = coords.map((c) => c.lat);
    const lngs = coords.map((c) => c.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    return {
        lat: (minLat + maxLat) / 2,
        lng: (minLng + maxLng) / 2,
    };
}
