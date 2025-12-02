
import { Incident, IncidentSeverity, IncidentStatus, Task, TaskStatus, TaskType, Volunteer } from './types';

export const incidents: Incident[] = [
  { 
    id: '1', 
    name: 'Banjir Bandang Garut 2025', 
    location: 'Garut, Jawa Barat', 
    dateReported: '2025-03-15', 
    status: IncidentStatus.ACTIVE, 
    severity: IncidentSeverity.CRITICAL,
    coordinates: { lat: -7.2278, lng: 107.9087 }
  },
  { 
    id: '2', 
    name: 'Gempa Bumi Cianjur 2024', 
    location: 'Cianjur, Jawa Barat', 
    dateReported: '2024-11-21', 
    status: IncidentStatus.RESOLVED, 
    severity: IncidentSeverity.CRITICAL,
    coordinates: { lat: -6.8168, lng: 107.1425 }
  },
  { 
    id: '3', 
    name: 'Erupsi Gunung Semeru 2023', 
    location: 'Lumajang, Jawa Timur', 
    dateReported: '2023-12-04', 
    status: IncidentStatus.RESOLVED, 
    severity: IncidentSeverity.HIGH,
    coordinates: { lat: -8.1080, lng: 112.9200 }
  },
  { 
    id: '4', 
    name: 'Tanah Longsor Sukabumi', 
    location: 'Sukabumi, Jawa Barat', 
    dateReported: '2025-01-20', 
    status: IncidentStatus.ACTIVE, 
    severity: IncidentSeverity.HIGH,
    coordinates: { lat: -6.9181, lng: 106.9267 }
  },
  { 
    id: '5', 
    name: 'Kekeringan Sumba Timur', 
    location: 'Sumba Timur, NTT', 
    dateReported: '2024-09-10', 
    status: IncidentStatus.ACTIVE, 
    severity: IncidentSeverity.MEDIUM,
    coordinates: { lat: -9.6467, lng: 120.2644 }
  },
];

export const volunteers: Volunteer[] = [
  { id: '1', name: 'Sarah Chen', role: 'Dokter Medis', status: 'Tersedia', skills: ['P3K', 'Triase'], avatar: 'https://picsum.photos/seed/sarah/200', email: 'sarah.chen@example.com', phone: '0812-3456-7890', location: 'Garut, Jawa Barat' },
  { id: '2', name: 'David Kim', role: 'Pakar Logistik', status: 'Ditugaskan', skills: ['Mengemudi', 'Gudang'], avatar: 'https://picsum.photos/seed/david/200', email: 'david.kim@example.com', phone: '0812-3456-7891', location: 'Garut, Jawa Barat' },
  { id: '3', name: 'Maria Garcia', role: 'Penyelamat', status: 'Tersedia', skills: ['SAR', 'EMT'], avatar: 'https://picsum.photos/seed/maria/200', email: 'maria.garcia@example.com', phone: '0812-3456-7892', location: 'Cianjur, Jawa Barat' },
  { id: '4', name: 'Ahmed Al-Farsi', role: 'IT Support', status: 'Tersedia', skills: ['Jaringan', 'Radio'], avatar: 'https://picsum.photos/seed/ahmed/200', email: 'ahmed.af@example.com', phone: '0812-3456-7893', location: 'Pool Jakarta' },
  { id: '5', name: 'Jane Doe', role: 'Dukungan Umum', status: 'Ditugaskan', skills: ['Memasak', 'Admin'], avatar: 'https://picsum.photos/seed/jane/200', email: 'jane.doe@example.com', phone: '0812-3456-7894', location: 'Garut, Jawa Barat' },
  { id: '6', name: 'John Smith', role: 'Pengemudi', status: 'Tersedia', skills: ['SIM B'], avatar: 'https://picsum.photos/seed/john/200', email: 'john.smith@example.com', phone: '0812-3456-7895', location: 'Pool Jakarta' },
  { id: '7', name: 'Emily White', role: 'Koordinator', status: 'Ditugaskan', skills: ['Leadership', 'Planning'], avatar: 'https://picsum.photos/seed/emily/200', email: 'emily.white@example.com', phone: '0812-3456-7896', location: 'Sukabumi, Jawa Barat' },
  { id: '8', name: 'Michael Brown', role: 'Insinyur', status: 'Tersedia', skills: ['Struktural'], avatar: 'https://picsum.photos/seed/michael/200', email: 'michael.brown@example.com', phone: '0812-3456-7897', location: 'Pool Jakarta' },
];

export const tasks: Task[] = [
  { 
    id: '1', 
    title: 'Kirim pasokan medis ke Pos 1',
    description: 'Segera kirimkan paket obat-obatan dan P3K ke Posko Utama di Kecamatan Tarogong.',
    assignee: 'Jane Doe', 
    assigneeAvatar: 'https://picsum.photos/seed/jane/200', 
    status: TaskStatus.OPEN, 
    type: TaskType.MEDICAL, 
    dueDate: 'Besok', 
    priority: 'High',
    incidentId: '1',
    coordinates: { lat: -7.2250, lng: 107.9100 },
    resources: [{ id: 1, item: 'Paket Obat', quantity: 50, unit: 'Paket' }, { id: 2, item: 'Perban', quantity: 100, unit: 'Roll' }]
  },
  { 
    id: '2', 
    title: 'Koordinasikan transportasi relawan', 
    description: 'Pastikan 3 truk tersedia untuk mengangkut relawan dari Bandung ke Garut.',
    assignee: 'John Smith', 
    assigneeAvatar: 'https://picsum.photos/seed/john/200', 
    status: TaskStatus.OPEN, 
    type: TaskType.LOGISTICS, 
    dueDate: '3 hari lagi', 
    priority: 'Medium',
    incidentId: '1',
    coordinates: { lat: -7.2300, lng: 107.9050 },
    resources: [{ id: 1, item: 'Truk Angkut', quantity: 3, unit: 'Unit' }]
  },
  { 
    id: '3', 
    title: 'Kaji kerusakan struktural di Jembatan B', 
    description: 'Lakukan inspeksi visual dan pengukuran pada pilar jembatan yang retak.',
    assignee: 'Emily White', 
    assigneeAvatar: 'https://picsum.photos/seed/emily/200', 
    status: TaskStatus.OPEN, 
    type: TaskType.RESCUE, 
    dueDate: '5 hari lagi', 
    priority: 'High',
    incidentId: '4',
    coordinates: { lat: -6.9200, lng: 106.9300 },
    resources: [{ id: 1, item: 'Alat Ukur', quantity: 1, unit: 'Set' }]
  },
  { 
    id: '4', 
    title: 'Siapkan penampungan sementara di Balai Kota', 
    description: 'Dirikan tenda darurat dan siapkan sanitasi portable.',
    assignee: 'Michael B.', 
    assigneeAvatar: 'https://picsum.photos/seed/michael/200', 
    status: TaskStatus.IN_PROGRESS, 
    type: TaskType.RESCUE, 
    dueDate: 'Hari Ini', 
    priority: 'High',
    incidentId: '1',
    coordinates: { lat: -7.2200, lng: 107.9000 },
    resources: [{ id: 1, item: 'Tenda Peleton', quantity: 5, unit: 'Unit' }]
  },
  { 
    id: '5', 
    title: 'Bagikan paket makanan di Sektor 4', 
    description: 'Distribusikan 500 nasi bungkus untuk warga terdampak di RW 05.',
    assignee: 'Jane Doe', 
    assigneeAvatar: 'https://picsum.photos/seed/jane/200', 
    status: TaskStatus.IN_PROGRESS, 
    type: TaskType.LOGISTICS, 
    dueDate: '2 hari lagi', 
    priority: 'Medium',
    incidentId: '1',
    coordinates: { lat: -7.2350, lng: 107.9150 },
    resources: [{ id: 1, item: 'Nasi Bungkus', quantity: 500, unit: 'Bungkus' }]
  },
  { 
    id: '6', 
    title: 'Evakuasi warga dari zona banjir A', 
    description: 'Evakuasi lansia dan anak-anak menggunakan perahu karet.',
    assignee: 'Emily White', 
    assigneeAvatar: 'https://picsum.photos/seed/emily/200', 
    status: TaskStatus.DONE, 
    type: TaskType.RESCUE, 
    dueDate: 'Kemarin', 
    priority: 'High',
    incidentId: '1',
    coordinates: { lat: -7.2280, lng: 107.9080 },
    resources: [{ id: 1, item: 'Perahu Karet', quantity: 2, unit: 'Unit' }]
  },
];
