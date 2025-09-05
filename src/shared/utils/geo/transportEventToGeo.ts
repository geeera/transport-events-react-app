import { IEvent } from '../../../core/@types/event.types';
import Supercluster from 'supercluster';

export function transportEventToFeature(
    event: IEvent
): Supercluster.PointFeature<any> {
    return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [event.lng, event.lat] },
        properties: { ...event },
    };
}

export function transportEventToGeo(events: IEvent[]) {
    const features = events.map((event) => transportEventToFeature(event));
    return {
        type: 'FeatureCollection',
        features: features,
    };
}
