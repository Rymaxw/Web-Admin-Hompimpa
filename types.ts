
export enum IncidentSeverity {
  CRITICAL = 'Kritis',
  HIGH = 'Tinggi',
  MEDIUM = 'Sedang',
  LOW = 'Rendah',
}

export enum IncidentStatus {
  ACTIVE = 'Aktif',
  RESOLVED = 'Selesai',
  ARCHIVED = 'Diarsipkan',
}

export interface Incident {
  id: string;
  name: string;
  location: string;
  dateReported: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export enum TaskStatus {
  OPEN = 'Terbuka',
  IN_PROGRESS = 'Dalam Proses',
  DONE = 'Selesai',
}

export enum TaskType {
  MEDICAL = 'Medis',
  LOGISTICS = 'Logistik',
  RESCUE = 'Penyelamatan',
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  assigneeAvatar: string;
  status: TaskStatus;
  type: TaskType;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  incidentId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Volunteer {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'Tersedia' | 'Ditugaskan' | 'Istirahat';
  skills: string[];
}
