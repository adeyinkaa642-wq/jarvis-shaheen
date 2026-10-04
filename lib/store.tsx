"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Platform = "Zillow" | "Airbnb" | "Realtor";
export type LeadStatus = "New" | "Contacted" | "Replied" | "Approved" | "Paid" | "Video Sent" | "Closed";

export interface Lead {
  id: string;
  platform: Platform;
  address: string;
  city: string;
  state: string;
  hostName: string;
  hostEmail: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  status: LeadStatus;
  addedAt: string;
  notes: string;
}

export type EmailStatus = "Draft" | "Sent" | "Replied" | "No Reply";
export interface Email {
  id: string;
  to: string;
  subject: string;
  body: string;
  status: EmailStatus;
  leadId?: string;
  sentAt?: string;
  repliedAt?: string;
}

export type ApprovalStatus = "Pending" | "Approved" | "Rejected";
export interface Approval {
  id: string;
  type: "Lead Outreach" | "Payment Request" | "Video Delivery" | "Email Send";
  description: string;
  leadId?: string;
  status: ApprovalStatus;
  createdAt: string;
  resolvedAt?: string;
  notes?: string;
}

export interface Activity {
  id: string;
  icon: string;
  message: string;
  time: string;
  type: "lead" | "email" | "approval" | "payment" | "video" | "system";
}

// ─── Seed Data ─────────────────────────────────────────────────────────────────

const seedLeads: Lead[] = [
  {
    id: "L001",
    platform: "Zillow",
    address: "4821 Sunset Blvd",
    city: "Los Angeles",
    state: "CA",
    hostName: "Marcus D.",
    hostEmail: "marcus.d@email.com",
    price: "$3,200/mo",
    bedrooms: 3,
    bathrooms: 2,
    status: "Replied",
    addedAt: "2026-09-30",
    notes: "Interested in a cinematic tour.",
  },
  {
    id: "L002",
    platform: "Airbnb",
    address: "1107 Ocean Drive",
    city: "Miami",
    state: "FL",
    hostName: "Sophia R.",
    hostEmail: "sophiar@mail.com",
    price: "$250/night",
    bedrooms: 2,
    bathrooms: 1,
    status: "Contacted",
    addedAt: "2026-10-01",
    notes: "Sent intro email, awaiting reply.",
  },
  {
    id: "L003",
    platform: "Realtor",
    address: "9 Central Park West",
    city: "New York",
    state: "NY",
    hostName: "James T.",
    hostEmail: "jtompkins@realty.com",
    price: "$8,500/mo",
    bedrooms: 4,
    bathrooms: 3,
    status: "New",
    addedAt: "2026-10-02",
    notes: "",
  },
  {
    id: "L004",
    platform: "Zillow",
    address: "330 Magnolia Lane",
    city: "Austin",
    state: "TX",
    hostName: "Priya K.",
    hostEmail: "priyak@homes.com",
    price: "$2,100/mo",
    bedrooms: 2,
    bathrooms: 2,
    status: "Approved",
    addedAt: "2026-09-28",
    notes: "Payment requested via PayPal.",
  },
];

const seedEmails: Email[] = [
  {
    id: "E001",
    to: "marcus.d@email.com",
    subject: "Professional Cinematic Tour for Your Property",
    body: "Hi Marcus,\n\nI came across your listing at 4821 Sunset Blvd and wanted to reach out about creating a stunning cinematic video tour for your property.\n\nBest,\nSHAHEEN",
    status: "Replied",
    leadId: "L001",
    sentAt: "2026-09-30 10:22 AM",
    repliedAt: "2026-09-30 3:45 PM",
  },
  {
    id: "E002",
    to: "sophiar@mail.com",
    subject: "Elevate Your Airbnb Listing with a Cinematic Tour",
    body: "Hi Sophia,\n\nYour Ocean Drive property caught my eye — I'd love to help you create a high-end video tour.\n\nBest,\nSHAHEEN",
    status: "Sent",
    leadId: "L002",
    sentAt: "2026-10-01 9:00 AM",
  },
  {
    id: "E003",
    to: "jtompkins@realty.com",
    subject: "Luxury Video Tour for 9 Central Park West",
    body: "Hi James,\n\nI noticed your stunning listing and wanted to introduce our cinematic property tour service.\n\nBest,\nSHAHEEN",
    status: "Draft",
    leadId: "L003",
  },
];

const seedApprovals: Approval[] = [
  {
    id: "A001",
    type: "Lead Outreach",
    description: "Approve outreach to James T. — 9 Central Park West, NY ($8,500/mo)",
    leadId: "L003",
    status: "Pending",
    createdAt: "2026-10-02 08:14 AM",
  },
  {
    id: "A002",
    type: "Payment Request",
    description: "Request $299 payment from Priya K. via PayPal for video tour at 330 Magnolia Lane",
    leadId: "L004",
    status: "Pending",
    createdAt: "2026-10-01 2:30 PM",
  },
  {
    id: "A003",
    type: "Email Send",
    description: "Send follow-up email to Marcus D. regarding video tour contract",
    leadId: "L001",
    status: "Approved",
    createdAt: "2026-09-30 4:00 PM",
    resolvedAt: "2026-09-30 4:15 PM",
    notes: "Approved — send immediately.",
  },
];

const seedActivity: Activity[] = [
  { id: "ACT1", icon: "💬", message: "Marcus D. replied to your outreach email", time: "2h ago", type: "email" },
  { id: "ACT2", icon: "🏠", message: "New lead found on Airbnb — Ocean Drive, Miami", time: "5h ago", type: "lead" },
  { id: "ACT3", icon: "✅", message: "Approval granted for follow-up email to Marcus D.", time: "Yesterday", type: "approval" },
  { id: "ACT4", icon: "🔍", message: "Jarvis scanned Zillow — 12 new listings found in Austin TX", time: "Yesterday", type: "lead" },
  { id: "ACT5", icon: "📧", message: "Outreach email sent to Sophia R. (Airbnb, Miami)", time: "2 days ago", type: "email" },
];

// ─── Context ───────────────────────────────────────────────────────────────────

interface StoreContextType {
  leads: Lead[];
  setLeads: (l: Lead[]) => void;
  addLead: (l: Lead) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  emails: Email[];
  setEmails: (e: Email[]) => void;
  addEmail: (e: Email) => void;
  updateEmailStatus: (id: string, status: EmailStatus) => void;
  approvals: Approval[];
  setApprovals: (a: Approval[]) => void;
  resolveApproval: (id: string, status: "Approved" | "Rejected", notes?: string) => void;
  activity: Activity[];
  addActivity: (a: Activity) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(seedLeads);
  const [emails, setEmails] = useState<Email[]>(seedEmails);
  const [approvals, setApprovals] = useState<Approval[]>(seedApprovals);
  const [activity, setActivity] = useState<Activity[]>(seedActivity);

  const addLead = (l: Lead) => setLeads((prev) => [l, ...prev]);
  const updateLeadStatus = (id: string, status: LeadStatus) =>
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));

  const addEmail = (e: Email) => setEmails((prev) => [e, ...prev]);
  const updateEmailStatus = (id: string, status: EmailStatus) =>
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));

  const resolveApproval = (id: string, status: "Approved" | "Rejected", notes?: string) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status, resolvedAt: new Date().toLocaleString(), notes }
          : a
      )
    );
    const approval = approvals.find((a) => a.id === id);
    if (approval) {
      addActivity({
        id: `ACT${Date.now()}`,
        icon: status === "Approved" ? "✅" : "❌",
        message: `${status}: ${approval.description.substring(0, 50)}...`,
        time: "Just now",
        type: "approval",
      });
    }
  };

  const addActivity = (a: Activity) => setActivity((prev) => [a, ...prev]);

  return (
    <StoreContext.Provider
      value={{
        leads, setLeads, addLead, updateLeadStatus,
        emails, setEmails, addEmail, updateEmailStatus,
        approvals, setApprovals, resolveApproval,
        activity, addActivity,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
