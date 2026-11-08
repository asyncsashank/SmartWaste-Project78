// Demo alerts + weekly accumulation + collection stats + analytics.
import { bins } from './bins';
import { fillBucket } from './constants';

export function generateAlerts() {
  const out = [];
  bins.forEach((b) => {
    const bucket = fillBucket(b.fill);
    if (b.priority === 'Critical' || b.fill >= 95) {
      out.push({
        id: `ALR-${b.id}-OVR`,
        type: 'Overflow Risk',
        severity: 'Critical',
        bin: b.id,
        location: b.location,
        message: `${b.location} bin (${b.fill}%) approaching overflow.`,
        time: b.lastUpdated,
        read: false,
      });
    } else if (bucket === 'high') {
      out.push({
        id: `ALR-${b.id}-HIGH`,
        type: 'High Fill Level',
        severity: 'High',
        bin: b.id,
        location: b.location,
        message: `${b.location} bin reached ${b.fill}% capacity.`,
        time: b.lastUpdated,
        read: Math.random() > 0.5,
      });
    }
    if (b.sensor === 'Offline') {
      out.push({
        id: `ALR-${b.id}-OFF`,
        type: 'Sensor Offline',
        severity: 'High',
        bin: b.id,
        location: b.location,
        message: `IoT sensor for ${b.location} bin is offline.`,
        time: b.lastUpdated,
        read: false,
      });
    }
    if (b.sensor === 'Weak Signal') {
      out.push({
        id: `ALR-${b.id}-WEAK`,
        type: 'Weak Signal',
        severity: 'Medium',
        bin: b.id,
        location: b.location,
        message: `Sensor at ${b.location} reporting weak signal.`,
        time: b.lastUpdated,
        read: true,
      });
    }
    if (b.battery < 25) {
      out.push({
        id: `ALR-${b.id}-BAT`,
        type: 'Low Battery',
        severity: 'Medium',
        bin: b.id,
        location: b.location,
        message: `Sensor battery at ${b.battery}% for ${b.location} bin.`,
        time: b.lastUpdated,
        read: true,
      });
    }
    if (b.status === 'Overdue') {
      out.push({
        id: `ALR-${b.id}-OD`,
        type: 'Collection Overdue',
        severity: 'High',
        bin: b.id,
        location: b.location,
        message: `Collection overdue at ${b.location} bin.`,
        time: b.lastUpdated,
        read: false,
      });
    }
    if (b.status === 'Completed') {
      out.push({
        id: `ALR-${b.id}-DONE`,
        type: 'Collection Completed',
        severity: 'Low',
        bin: b.id,
        location: b.location,
        message: `Collection completed at ${b.location} bin.`,
        time: b.lastUpdated,
        read: true,
      });
    }
  });
  const sevRank = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  return out.sort((a, b) => sevRank[a.severity] - sevRank[b.severity]);
}

export const recentCollections = [
  { bin: 'BIN-014', location: 'Marripalem', vehicle: 'VHC-001', collectedKg: 58, time: '07:42 AM', date: '2026-11-08' },
  { bin: 'BIN-024', location: 'Scindia Jn', vehicle: 'VHC-003', collectedKg: 72, time: '07:58 AM', date: '2026-11-08' },
  { bin: 'BIN-030', location: 'Chinna Waltair', vehicle: 'VHC-001', collectedKg: 41, time: '08:14 AM', date: '2026-11-08' },
  { bin: 'BIN-031', location: 'Dabagardens', vehicle: 'VHC-002', collectedKg: 64, time: '08:31 AM', date: '2026-11-08' },
  { bin: 'BIN-032', location: 'Waltair Uplands', vehicle: 'VHC-002', collectedKg: 53, time: '08:45 AM', date: '2026-11-08' },
];

export const weeklyAccumulation = [
  { day: 'Mon', collected: 1240, predicted: 1190 },
  { day: 'Tue', collected: 1380, predicted: 1410 },
  { day: 'Wed', collected: 1100, predicted: 1150 },
  { day: 'Thu', collected: 1620, predicted: 1550 },
  { day: 'Fri', collected: 1840, predicted: 1780 },
  { day: 'Sat', collected: 2100, predicted: 2050 },
  { day: 'Sun', collected: 1450, predicted: 1500 },
];

export const wasteCollectedToday = [
  { time: '06:00', kg: 120 },
  { time: '08:00', kg: 340 },
  { time: '10:00', kg: 520 },
  { time: '12:00', kg: 610 },
  { time: '14:00', kg: 690 },
  { time: '16:00', kg: 820 },
  { time: '18:00', kg: 940 },
  { time: '20:00', kg: 1020 },
];

export const areaWiseGeneration = [
  { area: 'Beach Corridor', kg: 1820 },
  { area: 'Central City', kg: 2410 },
  { area: 'Gajuwaka', kg: 1980 },
  { area: 'Old Town', kg: 1340 },
  { area: 'Pendurthi', kg: 920 },
  { area: 'Simhachalam', kg: 760 },
];

export const dailyTrend = [
  { date: 'Nov 02', collected: 4100, fuel: 42, efficiency: 88 },
  { date: 'Nov 03', collected: 4320, fuel: 44, efficiency: 86 },
  { date: 'Nov 04', collected: 3980, fuel: 40, efficiency: 90 },
  { date: 'Nov 05', collected: 4760, fuel: 48, efficiency: 84 },
  { date: 'Nov 06', collected: 5210, fuel: 52, efficiency: 87 },
  { date: 'Nov 07', collected: 4980, fuel: 49, efficiency: 89 },
  { date: 'Nov 08', collected: 3860, fuel: 31, efficiency: 91 },
];

export const routeDistances = [
  { route: 'Route A — Beach', distance: 12.4, stops: 7 },
  { route: 'Route B — Central', distance: 9.8, stops: 6 },
  { route: 'Route C — Gajuwaka', distance: 18.7, stops: 8 },
  { route: 'Route D — Old Town', distance: 11.2, stops: 5 },
];

export const binUtilization = [
  { name: 'Normal', value: 12, color: '#10b981' },
  { name: 'Medium', value: 9, color: '#f97316' },
  { name: 'High', value: 6, color: '#ef4444' },
  { name: 'Critical', value: 3, color: '#dc2626' },
];

export function kpis() {
  const total = bins.length;
  const full = bins.filter((b) => b.fill >= 80).length;
  const medium = bins.filter((b) => b.fill >= 50 && b.fill < 80).length;
  const normal = bins.filter((b) => b.fill < 50).length;
  const requiringCollection = bins.filter(
    (b) => b.status === 'Pending' || b.status === 'Overdue' || b.fill >= 50,
  ).length;
  const activeVehicles = 3;
  return { total, full, medium, normal, requiringCollection, activeVehicles };
}
