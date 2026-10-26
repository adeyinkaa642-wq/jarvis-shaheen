"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// ─── Property Video Tour Types ─────────────────────────────────────────────────

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
  type: "Lead Outreach" | "Payment Request" | "Video Delivery" | "Email Send" | "AI Call" | "Contract Send" | "Buyer Assignment";
  description: string;
  leadId?: string;
  wholesaleId?: string;
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
  type: "lead" | "email" | "approval" | "payment" | "video" | "system" | "wholesale";
}

// ─── Wholesale Real Estate Types ────────────────────────────────────────────────

export type WholesaleStatus =
  | "Researching"
  | "Initial Outreach"
  | "Interested"
  | "AI Call Scheduled"
  | "Qualified"
  | "Approval Pending"
  | "Under Contract"
  | "Buyer Found"
  | "Assigned"
  | "Closed";

export type WholesaleLeadSource = "Direct Mail" | "Cold Call" | "Driving for Dollars" | "Online" | "Referral" | "MLS" | "Other";

export interface WholesaleDeal {
  id: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  address: string;
  city: string;
  state: string;
  propertyType: "Single Family" | "Multi-Family" | "Commercial" | "Land" | "Other";
  estimatedValue: string;
  askingPrice: string;
  offerPrice: string;
  assignmentFee: string;
  status: WholesaleStatus;
  leadSource: WholesaleLeadSource;
  addedAt: string;
  followUpDate: string;
  motivated: boolean;
  notes: string;
  buyerId?: string;
}

export interface WholesaleBuyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  buyBox: string;
  addedAt: string;
}

// ─── Seed Data — Property Video Tours ──────────────────────────────────────────

const seedLeads: Lead[] = [
  {
    id: "L001", platform: "Zillow", address: "4821 Sunset Blvd", city: "Los Angeles", state: "CA",
    hostName: "Marcus D.", hostEmail: "marcus.d@email.com", price: "$3,200/mo",
    bedrooms: 3, bathrooms: 2, status: "Replied", addedAt: "2026-09-30", notes: "Interested in a cinematic tour.",
  },
  {
    id: "L002", platform: "Airbnb", address: "1107 Ocean Drive", city: "Miami", state: "FL",
    hostName: "Sophia R.", hostEmail: "sophiar@mail.com", price: "$250/night",
    bedrooms: 2, bathrooms: 1, status: "Contacted", addedAt: "2026-10-01", notes: "Sent intro email, awaiting reply.",
  },
  {
    id: "L003", platform: "Realtor", address: "9 Central Park West", city: "New York", state: "NY",
    hostName: "James T.", hostEmail: "jtompkins@realty.com", price: "$8,500/mo",
    bedrooms: 4, bathrooms: 3, status: "New", addedAt: "2026-10-02", notes: "",
  },
  {
    id: "L004", platform: "Zillow", address: "330 Magnolia Lane", city: "Austin", state: "TX",
    hostName: "Priya K.", hostEmail: "priyak@homes.com", price: "$2,100/mo",
    bedrooms: 2, bathrooms: 2, status: "Approved", addedAt: "2026-09-28", notes: "Payment requested via PayPal.",
  },
];

const seedEmails: Email[] = [
  {
    id: "E001", to: "marcus.d@email.com", subject: "Professional Cinematic Tour for Your Property",
    body: "Hi Marcus,\n\nI came across your listing at 4821 Sunset Blvd and wanted to reach out about creating a stunning cinematic video tour for your property.\n\nBest,\nSHAHEEN",
    status: "Replied", leadId: "L001", sentAt: "2026-09-30 10:22 AM", repliedAt: "2026-09-30 3:45 PM",
  },
  {
    id: "E002", to: "sophiar@mail.com", subject: "Elevate Your Airbnb Listing with a Cinematic Tour",
    body: "Hi Sophia,\n\nYour Ocean Drive property caught my eye — I'd love to help you create a high-end video tour.\n\nBest,\nSHAHEEN",
    status: "Sent", leadId: "L002", sentAt: "2026-10-01 9:00 AM",
  },
  {
    id: "E003", to: "jtompkins@realty.com", subject: "Luxury Video Tour for 9 Central Park West",
    body: "Hi James,\n\nI noticed your stunning listing and wanted to introduce our cinematic property tour service.\n\nBest,\nSHAHEEN",
    status: "Draft", leadId: "L003",
  },
];

const seedApprovals: Approval[] = [
  {
    id: "A001", type: "Lead Outreach",
    description: "Approve outreach to James T. — 9 Central Park West, NY ($8,500/mo)",
    leadId: "L003", status: "Pending", createdAt: "2026-10-02 08:14 AM",
  },
  {
    id: "A002", type: "Payment Request",
    description: "Request $299 payment from Priya K. via PayPal for video tour at 330 Magnolia Lane",
    leadId: "L004", status: "Pending", createdAt: "2026-10-01 2:30 PM",
  },
  {
    id: "A003", type: "Email Send",
    description: "Send follow-up email to Marcus D. regarding video tour contract",
    leadId: "L001", status: "Approved", createdAt: "2026-09-30 4:00 PM",
    resolvedAt: "2026-09-30 4:15 PM", notes: "Approved — send immediately.",
  },
  {
    id: "A004", type: "AI Call",
    description: "Jarvis to call Robert M. (512-555-0198) — motivated seller at 88 Pecan Dr, San Antonio TX",
    wholesaleId: "W001", status: "Pending", createdAt: "2026-10-03 09:00 AM",
  },
  {
    id: "A005", type: "Contract Send",
    description: "Send purchase agreement to Linda C. for 2204 Birchwood Ave, Houston TX — Offer: $115,000",
    wholesaleId: "W002", status: "Pending", createdAt: "2026-10-03 11:30 AM",
  },
];

const seedActivity: Activity[] = [
  { id: "ACT1", icon: "💬", message: "Marcus D. replied to your outreach email", time: "2h ago", type: "email" },
  { id: "ACT2", icon: "🏠", message: "New lead found on Airbnb — Ocean Drive, Miami", time: "5h ago", type: "lead" },
  { id: "ACT3", icon: "✅", message: "Approval granted for follow-up email to Marcus D.", time: "Yesterday", type: "approval" },
  { id: "ACT4", icon: "🔍", message: "Jarvis scanned Zillow — 12 new listings found in Austin TX", time: "Yesterday", type: "lead" },
  { id: "ACT5", icon: "📧", message: "Outreach email sent to Sophia R. (Airbnb, Miami)", time: "2 days ago", type: "email" },
  { id: "ACT6", icon: "🏡", message: "Wholesale deal added — Robert M., San Antonio TX (motivated seller)", time: "3h ago", type: "wholesale" },
  { id: "ACT7", icon: "📞", message: "Jarvis AI call scheduled with Linda C. — Houston TX property", time: "4h ago", type: "wholesale" },
  { id: "ACT8", icon: "🤝", message: "Buyer matched for 2204 Birchwood Ave — Cash buyer: David K.", time: "Yesterday", type: "wholesale" },
];

// ─── Seed Data — Wholesale ─────────────────────────────────────────────────────

const seedWholesaleDeals: WholesaleDeal[] = [
  {
    id: "W001", ownerName: "Robert M.", ownerPhone: "512-555-0198", ownerEmail: "robertm@mail.com",
    address: "88 Pecan Drive", city: "San Antonio", state: "TX",
    propertyType: "Single Family", estimatedValue: "$195,000", askingPrice: "$140,000",
    offerPrice: "$118,000", assignmentFee: "$12,000",
    status: "AI Call Scheduled", leadSource: "Direct Mail",
    addedAt: "2026-10-03", followUpDate: "2026-10-05",
    motivated: true, notes: "Behind on mortgage 3 months. Very motivated. Needs quick close.",
  },
  {
    id: "W002", ownerName: "Linda C.", ownerPhone: "713-555-0147", ownerEmail: "lindac@email.com",
    address: "2204 Birchwood Ave", city: "Houston", state: "TX",
    propertyType: "Single Family", estimatedValue: "$160,000", askingPrice: "$120,000",
    offerPrice: "$115,000", assignmentFee: "$10,000",
    status: "Under Contract", leadSource: "Cold Call",
    addedAt: "2026-09-29", followUpDate: "2026-10-10",
    motivated: true, notes: "Agreed to purchase price. Contract being drafted.",
    buyerId: "B001",
  },
  {
    id: "W003", ownerName: "George P.", ownerPhone: "214-555-0322", ownerEmail: "georgep@mail.com",
    address: "401 Elm Street", city: "Dallas", state: "TX",
    propertyType: "Single Family", estimatedValue: "$220,000", askingPrice: "$190,000",
    offerPrice: "$155,000", assignmentFee: "",
    status: "Initial Outreach", leadSource: "Driving for Dollars",
    addedAt: "2026-10-02", followUpDate: "2026-10-06",
    motivated: false, notes: "Property looks vacant. Left voicemail.",
  },
  {
    id: "W004", ownerName: "Maria T.", ownerPhone: "210-555-0871", ownerEmail: "mariat@mail.com",
    address: "9 Riverside Blvd", city: "Austin", state: "TX",
    propertyType: "Multi-Family", estimatedValue: "$380,000", askingPrice: "$310,000",
    offerPrice: "$280,000", assignmentFee: "$25,000",
    status: "Qualified", leadSource: "Referral",
    addedAt: "2026-09-25", followUpDate: "2026-10-04",
    motivated: true, notes: "Duplex. Landlord tired. Wants out fast. Great deal.",
  },
];

const seedWholesaleBuyers: WholesaleBuyer[] = [
  { id: "B001", name: "David K.", email: "davidk@invest.com", phone: "832-555-0211", buyBox: "Single Family, Houston TX, $80K-$150K ARV, Cash", addedAt: "2026-09-20" },
  { id: "B002", name: "TrueVest Properties", email: "acquisitions@truevest.com", phone: "512-555-0399", buyBox: "Single/Multi Family, TX statewide, up to $500K", addedAt: "2026-09-15" },
  { id: "B003", name: "Marcus W.", email: "marcusw@realestate.io", phone: "214-555-0566", buyBox: "Dallas/Fort Worth, SFR, BRRR strategy, $100K-$250K", addedAt: "2026-10-01" },
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
  wholesaleDeals: WholesaleDeal[];
  addWholesaleDeal: (d: WholesaleDeal) => void;
  updateWholesaleStatus: (id: string, status: WholesaleStatus) => void;
  wholesaleBuyers: WholesaleBuyer[];
  addWholesaleBuyer: (b: WholesaleBuyer) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(seedLeads);
  const [emails, setEmails] = useState<Email[]>(seedEmails);
  const [approvals, setApprovals] = useState<Approval[]>(seedApprovals);
  const [activity, setActivity] = useState<Activity[]>(seedActivity);
  const [wholesaleDeals, setWholesaleDeals] = useState<WholesaleDeal[]>(seedWholesaleDeals);
  const [wholesaleBuyers, setWholesaleBuyers] = useState<WholesaleBuyer[]>(seedWholesaleBuyers);

  const addLead = (l: Lead) => setLeads((prev) => [l, ...prev]);
  const updateLeadStatus = (id: string, status: LeadStatus) =>
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));

  const addEmail = (e: Email) => setEmails((prev) => [e, ...prev]);
  const updateEmailStatus = (id: string, status: EmailStatus) =>
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));

  const addActivity = (a: Activity) => setActivity((prev) => [a, ...prev]);

  const resolveApproval = (id: string, status: "Approved" | "Rejected", notes?: string) => {
    setApprovals((prev) =>
      prev.map((a) => a.id === id ? { ...a, status, resolvedAt: new Date().toLocaleString(), notes } : a)
    );
    const approval = approvals.find((a) => a.id === id);
    if (approval) {
      addActivity({
        id: `ACT${Date.now()}`,
        icon: status === "Approved" ? "✅" : "❌",
        message: `${status}: ${approval.description.substring(0, 60)}...`,
        time: "Just now",
        type: "approval",
      });
    }
  };

  const addWholesaleDeal = (d: WholesaleDeal) => setWholesaleDeals((prev) => [d, ...prev]);
  const updateWholesaleStatus = (id: string, status: WholesaleStatus) =>
    setWholesaleDeals((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));

  const addWholesaleBuyer = (b: WholesaleBuyer) => setWholesaleBuyers((prev) => [b, ...prev]);

  return (
    <StoreContext.Provider value={{
      leads, setLeads, addLead, updateLeadStatus,
      emails, setEmails, addEmail, updateEmailStatus,
      approvals, setApprovals, resolveApproval,
      activity, addActivity,
      wholesaleDeals, addWholesaleDeal, updateWholesaleStatus,
      wholesaleBuyers, addWholesaleBuyer,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
