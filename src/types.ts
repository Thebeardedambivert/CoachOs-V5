/**
 * Types & Interfaces for CoachOS V5
 */

export interface Lead {
  id: string;
  name: string;
  email: string;
  source: string;
  sourceIcon: string;
  status: 'New' | 'Responded' | 'Booked' | 'In Session';
  responseTime: string;
  avatar: string;
}

export interface ContentPost {
  id: string;
  preview: string;
  date: string;
  reactions: number;
  comments: number;
  reposts: number;
  dms: number;
  topTrigger: 'DM CTA' | 'Educational' | 'Keyword';
  mediaType: 'image' | 'description' | 'tag';
}

export interface LiveActivity {
  id: string;
  event: string;
  leadClient: string;
  status: 'Processed' | 'Sent' | 'Retry Scheduled';
  time: string;
  icon: string;
  iconBg: string; // Tailwind bg class e.g., 'primary-container/10'
  iconColor: string; // Tailwind text class e.g., 'text-primary'
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  lastTriggered: string;
  badge: 'High Priority' | 'Social' | 'Engagement' | 'Events' | 'Processing' | 'FinOps' | 'Retention' | 'Internal' | 'Critical Error' | 'Maintenance';
  enabled: boolean;
  pulse?: boolean;
}

export interface Session {
  id: string;
  clientName: string;
  avatar: string;
  sessionInfo: string; // e.g. "Session 4 of 12"
  dateTime: string; // e.g. "May 28 • 10:00 AM"
  duration: number; // in minutes
  aiReport: 'Ready' | 'Processing' | 'No Transcript';
  notes?: string;
  audioFile?: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  joinDate: string;
  onboardingStatus: 'Completed' | 'Day 5 Drip' | 'Day 3 Drip' | 'Day 2 Drip';
  lastActive: string;
  eventsAttended: number;
  initials: string;
  avatarColorClass: string;
}

export interface CoachEvent {
  id: string;
  title: string;
  month: string;
  day: string;
  timeRange: string;
  locationType: 'Zoom' | 'Studio' | 'Google Meet';
  location: string;
  sent: boolean;
}
