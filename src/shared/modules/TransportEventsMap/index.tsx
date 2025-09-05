import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import Map, { Marker, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { EventTypes, IEvent } from '../../../core/@types/event.types';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import TramIcon from '@mui/icons-material/Tram';
import SubwayIcon from '@mui/icons-material/Subway';
import moment from 'moment';
import { NavLink } from 'react-router';
import { getBoundsCenter } from '../../utils/geo/getBoundsCenter';
import { transportEventToGeo } from '../../utils/geo/transportEventToGeo';
import Supercluster from 'supercluster';
import type { PointFeature } from 'supercluster';

import { debounce } from 'lodash';

import './TransportEventsMap.css';

interface TransportEventsMapProps {
    events: IEvent[];
}

const IconsPerEventType: Record<EventTypes, any> = {
    [EventTypes.BUS]: <DirectionsBusIcon />,
    [EventTypes.TRAM]: <TramIcon />,
    [EventTypes.METRO]: <SubwayIcon />,
};

interface TransportEventDialogProps {
    onClose: () => void;
    event: IEvent | null;
}

const TransportEventDialog: React.FC<TransportEventDialogProps> = (props) => {
    const { onClose, event } = props;

    const handleClose = () => {
        onClose();
    };

    const formattedDate = useMemo(() => {
        return moment(event?.timestamp).format('MMMM Do YYYY, h:mm:ss');
    }, [moment, event?.timestamp]);

    return (
        <Dialog onClose={handleClose} open={!!event}>
            <DialogTitle>{event?.title}</DialogTitle>

            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Type: {event?.type}
                </DialogContentText>

                <DialogContentText id="alert-dialog-slide-description">
                    Status: {event?.status}
                </DialogContentText>

                <DialogContentText id="alert-dialog-slide-description">
                    createdAt: {formattedDate}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} color="error">
                    Close
                </Button>
                <NavLink to={`/event/${event?.id}`} end>
                    <Button variant="contained" color="primary">
                        Details
                    </Button>
                </NavLink>
            </DialogActions>
        </Dialog>
    );
};

const mapboxAccessToken = process.env
    .REACT_APP_MAPBOX_GL_ACCESS_TOKEN as string;

type BBoxType = [number, number, number, number];

const TransportEventsMap: React.FC<TransportEventsMapProps> = (props) => {
    const [openedEvent, setOpenedEvent] = useState<null | IEvent>(null);
    const [mapBBox, setMapBBox] = useState<BBoxType | []>([]);
    const [mapZoom, setMapZoom] = useState<number>(15);
    const [clusters, setClusters] = useState<PointFeature<any>[]>([]);
    const mapRef = useRef<MapRef>(null);
    const geo = useMemo(
        () => transportEventToGeo(props.events),
        [props.events]
    );
    const clusterIndex = useMemo(() => {
        const sc = new Supercluster({ radius: 50, maxZoom: 16 });
        sc.load(geo.features);
        return sc;
    }, [geo]);

    const points = useMemo(() => {
        return props.events.map((event) => {
            return {
                lat: event.lat,
                lng: event.lng,
            };
        });
    }, [props.events]);
    const center = useMemo(() => {
        return getBoundsCenter(points);
    }, [points]);

    const debouncedMapUpdate = debounce((bbox: BBoxType, zoom: number) => {
        setMapBBox(bbox);
        setMapZoom(zoom);
    }, 300);

    const updateMapBoundsAndZoom = () => {
        const map = mapRef.current as MapRef;
        if (!map) return;
        const bounds = map.getMap().getBounds();
        if (bounds) {
            const bbox: [number, number, number, number] = [
                bounds.getWest(),
                bounds.getSouth(),
                bounds.getEast(),
                bounds.getNorth(),
            ];
            const zoom = map.getZoom();
            debouncedMapUpdate(bbox, zoom);
        }
    };

    useEffect(() => {
        if (mapBBox.length) {
            const updatedClusters = clusterIndex.getClusters(mapBBox, mapZoom);
            setClusters(updatedClusters);
        }
    }, [geo, mapBBox, mapZoom, clusterIndex]);

    const onCloseEventDialog = () => {
        setOpenedEvent(null);
    };

    const onOpenEventDialog = (event: IEvent) => {
        setOpenedEvent(event);
    };

    const updateZoomToCluster = (cluster: PointFeature<any>) => {
        const expansionZoom = Math.min(
            clusterIndex.getClusterExpansionZoom(cluster.id as number),
            20
        );
        mapRef.current?.flyTo({
            center: {
                lat: cluster.geometry.coordinates[1],
                lng: cluster.geometry.coordinates[0],
            },
            zoom: expansionZoom,
        });
    };

    const fitMapToPoints = (
        mapRef: React.RefObject<MapRef>,
        points: { lng: number; lat: number }[]
    ) => {
        if (!mapRef.current || points.length === 0) return;

        const map = mapRef.current.getMap();

        const bounds = map.getBounds();
        if (!bounds) return;

        points.forEach((point) => {
            bounds.extend([point.lng, point.lat]);
        });

        map.fitBounds(bounds, {
            padding: 50,
            maxZoom: 16,
            duration: 500,
        });
    };

    return (
        <>
            <Map
                ref={mapRef}
                mapboxAccessToken={mapboxAccessToken}
                initialViewState={{
                    longitude: center.lng,
                    latitude: center.lat,
                    zoom: 15,
                }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                onZoom={updateMapBoundsAndZoom}
                onMove={updateMapBoundsAndZoom}
                onLoad={() => {
                    fitMapToPoints(mapRef as React.RefObject<MapRef>, points);
                    updateMapBoundsAndZoom();
                }}
            >
                {clusters.map((cluster) => {
                    const event = cluster.properties as IEvent;
                    if (cluster.properties.cluster) {
                        const [lng, lat] = cluster.geometry.coordinates;
                        if (isNaN(lng) || isNaN(lat)) return null;
                        return (
                            <Marker
                                key={'cluster-' + cluster.id}
                                longitude={lng}
                                latitude={lat}
                                anchor="bottom"
                                onClick={() => updateZoomToCluster(cluster)}
                            >
                                <div className="cluster-marker">
                                    {cluster.properties.point_count}
                                </div>
                            </Marker>
                        );
                    }
                    return (
                        <Marker
                            key={event.id + event.timestamp}
                            longitude={event.lng}
                            latitude={event.lat}
                            anchor="bottom"
                            onClick={() => onOpenEventDialog(event)}
                        >
                            {IconsPerEventType[event.type]}
                        </Marker>
                    );
                })}
            </Map>
            <TransportEventDialog
                onClose={onCloseEventDialog}
                event={openedEvent}
            />
        </>
    );
};

export default memo(TransportEventsMap);
