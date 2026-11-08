// Demo dataset for smart bins around Visakhapatnam, Andhra Pradesh, India.
// All values are illustrative — not from real IoT devices.
import { PRIORITY, COLLECTION_STATUS, SENSOR_STATUS } from './constants';

const baseTime = Date.UTC(2026, 10, 8, 9, 0, 0); // fixed demo reference time

const RAW = [
  ['BIN-001', 'RK Beach', 17.7239, 83.3265, 92, 96, 'Online', 3, 'Overdue', 'Critical'],
  ['BIN-002', 'Kailasagiri Hill', 17.7742, 83.3632, 88, 91, 'Online', 5, 'Pending', 'High'],
  ['BIN-003', 'Rushikonda Beach', 17.7812, 83.3972, 74, 82, 'Online', 8, 'Scheduled', 'High'],
  ['BIN-004', 'Dwaraka Nagar', 17.7061, 83.3018, 46, 58, 'Online', 12, 'Pending', 'Medium'],
  ['BIN-005', 'Siripuram Junction', 17.7146, 83.2968, 34, 41, 'Online', 6, 'Pending', 'Low'],
  ['BIN-006', 'Gajuwaka Market', 17.6762, 83.2102, 95, 98, 'Online', 2, 'Overdue', 'Critical'],
  ['BIN-007', 'Asilmeta Junction', 17.7156, 83.2852, 62, 71, 'Online', 10, 'Scheduled', 'Medium'],
  ['BIN-008', 'Pendurthi', 17.8236, 83.0932, 28, 35, 'Weak Signal', 18, 'Pending', 'Low'],
  ['BIN-009', 'MVP Colony', 17.7359, 83.3188, 81, 89, 'Online', 4, 'Pending', 'High'],
  ['BIN-010', 'Seethammadhara', 17.7389, 83.3032, 53, 64, 'Online', 9, 'Scheduled', 'Medium'],
  ['BIN-011', 'Jagadamba Junction', 17.7136, 83.2961, 99, 100, 'Offline', 25, 'Overdue', 'Critical'],
  ['BIN-012', 'Dondaparthy', 17.7178, 83.2899, 41, 49, 'Online', 7, 'Pending', 'Low'],
  ['BIN-013', 'Akkayyapalem', 17.7241, 83.2812, 67, 75, 'Online', 11, 'Pending', 'Medium'],
  ['BIN-014', 'Marripalem', 17.7189, 83.2598, 18, 24, 'Online', 5, 'Completed', 'Low'],
  ['BIN-015', 'Gnanapuram', 17.7008, 83.2788, 86, 92, 'Online', 6, 'Pending', 'High'],
  ['BIN-016', 'Town Kotha Road', 17.7102, 83.2734, 58, 66, 'Online', 8, 'Scheduled', 'Medium'],
  ['BIN-017', 'Allipuram', 17.7056, 83.2841, 44, 51, 'Online', 6, 'Pending', 'Low'],
  ['BIN-018', 'NAD Kotha Road', 17.7232, 83.2341, 72, 80, 'Online', 9, 'Scheduled', 'High'],
  ['BIN-019', 'Kancharapalem', 17.7312, 83.2718, 36, 44, 'Online', 7, 'Pending', 'Low'],
  ['BIN-020', 'Balayya Sattiraju St', 17.7089, 83.2898, 90, 95, 'Online', 3, 'Overdue', 'Critical'],
  ['BIN-021', 'HBV Road', 17.7121, 83.3012, 49, 57, 'Online', 10, 'Pending', 'Medium'],
  ['BIN-022', 'Suryabagh', 17.7041, 83.2689, 31, 38, 'Online', 6, 'Pending', 'Low'],
  ['BIN-023', 'Old Town', 17.6812, 83.2598, 77, 84, 'Online', 5, 'Pending', 'High'],
  ['BIN-024', 'Scindia Jn', 17.6921, 83.2654, 21, 28, 'Online', 4, 'Completed', 'Low'],
  ['BIN-025', 'Vepagunta', 17.8412, 83.1021, 64, 72, 'Weak Signal', 14, 'Pending', 'Medium'],
  ['BIN-026', 'Simhachalam', 17.7712, 83.1589, 52, 61, 'Online', 8, 'Scheduled', 'Medium'],
  ['BIN-027', 'Adarsh Nagar', 17.7221, 83.3056, 39, 47, 'Online', 7, 'Pending', 'Low'],
  ['BIN-028', 'Lawsons Bay', 17.7421, 83.3342, 83, 90, 'Online', 4, 'Pending', 'High'],
  ['BIN-029', 'Pandurangapuram', 17.7289, 83.3212, 56, 65, 'Online', 9, 'Scheduled', 'Medium'],
  ['BIN-030', 'Chinna Waltair', 17.7442, 83.3268, 12, 19, 'Online', 5, 'Completed', 'Low'],
];

export const bins = RAW.map(
  ([
    id,
    location,
    lat,
    lng,
    fill,
    predicted,
    sensor,
    lastUpdatedMin,
    status,
    priority,
  ]) => ({
    id,
    location,
    lat,
    lng,
    fill,
    predicted,
    sensor,
    battery: sensor === SENSOR_STATUS.OFFLINE ? 8 : sensor === SENSOR_STATUS.WEAK ? 22 : 60 + Math.round((fill % 9) * 4) + 10,
    lastUpdated: new Date(baseTime - lastUpdatedMin * 60 * 1000).toISOString(),
    status,
    priority,
    area: location.split(' ')[0],
    capacityL: 1200,
    collectedKgToday: Math.round((100 - fill) * 5.2),
    type: 'Street Bin',
  }),
);

// Generate hourly fill history for last 24h (ascending) for a given bin
export function fillHistory(bin) {
  const out = [];
  for (let i = 23; i >= 0; i--) {
    const t = new Date(Date.UTC(2026, 10, 8, 0, 0, 0) + (24 - i) * 3600 * 1000);
    const noise = ((bin.id.charCodeAt(4) + i) % 7) - 3;
    const base = Math.max(0, Math.min(100, bin.fill - i * 1.6 + noise));
    const pred = Math.max(0, Math.min(100, base + 2 + ((i % 3) - 1)));
    out.push({
      time: `${String(t.getUTCHours()).padStart(2, '0')}:00`,
      actual: Math.round(base),
      predicted: Math.round(pred),
    });
  }
  return out;
}

// Collection history for a bin
export function collectionHistory(bin) {
  const days = [7, 5, 3, 1];
  return days.map((d, i) => {
    const date = new Date(Date.UTC(2026, 10, 8) - d * 86400 * 1000);
    return {
      date: date.toISOString().slice(0, 10),
      collectedKg: Math.round(40 + ((bin.fill + i * 11) % 55)),
      vehicle: `VHC-${String((i % 3) + 1).padStart(3, '0')}`,
      durationMin: 6 + ((bin.fill + i * 5) % 12),
    };
  });
}
