// API integration layer — clearly separated from demo data.
// All functions are stubs that resolve with demo data today and are ready to be
// pointed at the real backend (Backend -> Database -> ML -> OR-Tools) later.
//
// Data flow architecture this layer is designed for:
//   Ultrasonic Sensor -> ESP32 -> LoRa -> Gateway -> Backend -> Database
//   -> ML Prediction -> Collection Priority -> Route Optimization -> Dashboard
//
// IMPORTANT: Until a real backend is connected, these functions return demo data.
// Do NOT present their output as live IoT / ML / GPS / OR-Tools results.

import axios from 'axios';
import { bins as demoBins, fillHistory, collectionHistory } from '../data/bins';
import { vehicles as demoVehicles } from '../data/vehicles';
import { generateAlerts, recentCollections } from '../data/analytics';
import { generateDemoRoute } from '../data/routes';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Helper to simulate async latency when running on demo data
function withDelay(data, ms = 300) {
  return new Promise((resolve) => setTimeout(() => resolve({ data }), ms));
}

const USE_DEMO = true; // flip to false once backend endpoints are live

export const apiService = {
  /**
   * Smart bin readings (live IoT). Currently demo.
   * Backend: GET /bins -> latest ultrasonic readings via ESP32/LoRa/Gateway.
   */
  async getBins() {
    if (USE_DEMO) return withDelay(demoBins);
    const { data } = await api.get('/bins');
    return data;
  },

  async getBin(id) {
    if (USE_DEMO) {
      const b = demoBins.find((x) => x.id === id);
      return withDelay(b);
    }
    const { data } = await api.get(`/bins/${id}`);
    return data;
  },

  async getBinHistory(id) {
    if (USE_DEMO) {
      const b = demoBins.find((x) => x.id === id) || demoBins[0];
      return withDelay(fillHistory(b));
    }
    const { data } = await api.get(`/bins/${id}/history`);
    return data;
  },

  async getBinCollectionHistory(id) {
    if (USE_DEMO) {
      const b = demoBins.find((x) => x.id === id) || demoBins[0];
      return withDelay(collectionHistory(b));
    }
    const { data } = await api.get(`/bins/${id}/collections`);
    return data;
  },

  /**
   * ML fill-level predictions. Currently demo.
   * Backend: GET /predictions -> ML model inference (fill after 2/4/6h).
   */
  async getPredictions() {
    if (USE_DEMO) {
      const preds = demoBins.map((b) => ({
        binId: b.id,
        location: b.location,
        current: b.fill,
        predicted2h: Math.min(100, b.predicted - 4),
        predicted4h: b.predicted,
        predicted6h: Math.min(100, b.predicted + 5),
        priority: b.priority,
      }));
      return withDelay(preds);
    }
    const { data } = await api.get('/predictions');
    return data;
  },

  async getModelMetrics() {
    if (USE_DEMO) {
      return withDelay({
        isDemo: true,
        mae: 3.42,
        rmse: 4.71,
        r2: 0.918,
        note: 'Illustrative metrics - replace with real model evaluation results.',
      });
    }
    const { data } = await api.get('/predictions/metrics');
    return data;
  },

  /**
   * Collection vehicles with GPS location. Currently demo.
   * Backend: GET /vehicles -> live GPS from vehicle trackers.
   */
  async getVehicles() {
    if (USE_DEMO) return withDelay(demoVehicles);
    const { data } = await api.get('/vehicles');
    return data;
  },

  /**
   * Alerts & notifications. Currently demo.
   * Backend: GET /alerts -> derived from DB + sensor events.
   */
  async getAlerts() {
    if (USE_DEMO) return withDelay(generateAlerts());
    const { data } = await api.get('/alerts');
    return data;
  },

  async getRecentCollections() {
    if (USE_DEMO) return withDelay(recentCollections);
    const { data } = await api.get('/collections/recent');
    return data;
  },

  /**
   * Route optimization. Currently a demo simulation.
   * Backend: POST /routes/optimize -> Google OR-Tools VRP solver.
   */
  async optimizeRoute(selectedBins, vehicle) {
    if (USE_DEMO) return withDelay(generateDemoRoute(selectedBins, vehicle), 600);
    const { data } = await api.post('/routes/optimize', {
      bins: selectedBins.map((b) => b.id),
      vehicleId: vehicle.id,
    });
    return data;
  },
};

export { USE_DEMO };
