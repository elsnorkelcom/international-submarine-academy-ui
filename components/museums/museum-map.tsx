'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { LayerGroup, Map as LeafletMap } from 'leaflet';

import { useApp } from '@/components/app/data-provider';
import type { Museum } from '@/lib/domain/types';
import { localize } from '@/lib/domain/types';

const INITIAL_CENTER: [number, number] = [25, 0];
const INITIAL_ZOOM = 2;

export function MuseumMap() {
  const { database, ready, language, t } = useApp();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const clusterRef = useRef<LayerGroup | null>(null);
  const leafletRef = useRef<typeof import('leaflet') | null>(null);

  const [museums, setMuseums] = useState<Museum[]>([]);
  const [country, setCountry] = useState('all');
  const [propulsion, setPropulsion] = useState('all');
  const [mapError, setMapError] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!database) {
      return;
    }

    void database
      .repository('museums')
      .list({ pageSize: 0 })
      .then((result) => setMuseums(result.items))
      .catch(() => setMuseums([]));
  }, [database]);

  const visible = useMemo(
    () =>
      museums.filter(
        (museum) =>
          museum.latitude !== null &&
          museum.longitude !== null &&
          (country === 'all' || museum.country === country) &&
          (propulsion === 'all' || museum.propulsion === propulsion),
      ),
    [museums, country, propulsion],
  );

  const countries = useMemo(
    () => Array.from(new Set(museums.map((museum) => museum.country).filter(Boolean))).sort(),
    [museums],
  );

  const propulsions = useMemo(
    () => Array.from(new Set(museums.map((museum) => museum.propulsion).filter(Boolean))).sort(),
    [museums],
  );

  // Create the map once.
  useEffect(() => {
    let disposed = false;

    async function boot() {
      const leafletModule = await import('leaflet');
      const leaflet = (leafletModule.default ?? leafletModule) as unknown as typeof import('leaflet');

      // The clustering plugin is UMD and expects a global `L` at load time.
      (window as unknown as { L: unknown }).L = leaflet;
      await import('leaflet.markercluster');

      if (disposed || !containerRef.current) {
        return;
      }

      const map = leaflet.map(containerRef.current, {
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
        minZoom: 2,
        maxZoom: 12,
        worldCopyJump: true,
        zoomControl: true,
        attributionControl: true,
      });

      leaflet
        .tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        })
        .addTo(map);

      const cluster =
        typeof leaflet.markerClusterGroup === 'function'
          ? leaflet.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 48 }).addTo(map)
          : leaflet.layerGroup().addTo(map);

      leafletRef.current = leaflet;
      mapRef.current = map;
      clusterRef.current = cluster;
      setMapError(false);
      setMapReady(true);
    }

    void boot().catch(() => setMapError(true));

    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
      clusterRef.current = null;
      leafletRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Keep markers in sync with the active filters.
  useEffect(() => {
    const leaflet = leafletRef.current;
    const cluster = clusterRef.current;

    if (!leaflet || !cluster) {
      return;
    }

    cluster.clearLayers();

    for (const museum of visible) {
      const marker = leaflet.marker([museum.latitude ?? 0, museum.longitude ?? 0], {
        title: localize(museum.name, language),
        icon: leaflet.divIcon({
          className: 'isa-map-marker',
          html: '<span></span>',
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        }),
      });

      const name = escapeHtml(localize(museum.name, language));
      const museumName = escapeHtml(localize(museum.museumName, language));
      const place = escapeHtml([museum.city, museum.country].filter(Boolean).join(', '));

      marker.bindPopup(
        `<strong>${name}</strong><br/><span>${museumName}</span><br/><span>${place}</span><br/><a href="/museums/${museum.id}">${escapeHtml(t.register.openFile)} →</a>`,
      );

      cluster.addLayer(marker);
    }
  }, [visible, language, t.register.openFile, mapReady]);

  return (
    <div>
      <header className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">{t.map.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl">
          {t.map.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.map.subtitle}</p>
      </header>

      <div className="mt-6 flex flex-wrap items-end gap-3 border-y border-white/10 py-4">
        <label className="flex min-w-40 flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-metal">{t.map.country}</span>
          <select
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            className="h-10 rounded-sm border border-white/15 bg-white/5 px-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
          >
            <option value="all">{t.map.allCountries}</option>
            {countries.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-40 flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-metal">{t.map.propulsion}</span>
          <select
            value={propulsion}
            onChange={(event) => setPropulsion(event.target.value)}
            className="h-10 rounded-sm border border-white/15 bg-white/5 px-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
          >
            <option value="all">{t.map.allPropulsion}</option>
            {propulsions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => mapRef.current?.setView(INITIAL_CENTER, INITIAL_ZOOM)}
          className="h-10 border border-white/15 px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground transition hover:border-primary hover:text-primary"
        >
          {t.map.reset}
        </button>

        <p className="ml-auto font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="text-primary">{String(visible.length).padStart(3, '0')}</span> {t.map.showing}
        </p>
      </div>

      <div className="relative mt-5 border border-white/10">
        <div ref={containerRef} className="h-[62svh] w-full bg-[#0a1119]" aria-label={t.map.title} />
        {!ready || mapError ? (
          <p className="absolute inset-x-0 bottom-0 bg-black/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200">
            {mapError ? t.common.error : t.common.loading}
          </p>
        ) : null}
      </div>

      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {t.map.markerHint}
      </p>
    </div>
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
