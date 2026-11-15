import fs from 'fs';
import path from 'path';
import os from 'os';
import { Listing, DeliveryBooking } from '@/types';
import { INITIAL_LISTINGS, INITIAL_DELIVERIES } from '@/lib/data/mockData';

// Shared persistent server storage using globalThis + os.tmpdir file backup
// Guaranteed to persist across Next.js API requests and survive server reloads

const STORAGE_DIR = os.tmpdir();
const LISTINGS_FILE = path.join(STORAGE_DIR, 'portex_shared_listings_v1.json');
const DELIVERIES_FILE = path.join(STORAGE_DIR, 'portex_shared_deliveries_v1.json');

declare global {
  // eslint-disable-next-line no-var
  var __portex_listings_cache: Listing[] | undefined;
  // eslint-disable-next-line no-var
  var __portex_deliveries_cache: DeliveryBooking[] | undefined;
}

function readJsonFile<T>(filePath: string): T | null {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as T;
    }
  } catch (err) {
    console.error(`[PORTEX ServerStore] Failed to read ${filePath}:`, err);
  }
  return null;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[PORTEX ServerStore] Failed to write ${filePath}:`, err);
  }
}

// ---------------- LISTINGS ----------------

export function getServerListings(): Listing[] {
  if (globalThis.__portex_listings_cache && globalThis.__portex_listings_cache.length > 0) {
    return globalThis.__portex_listings_cache;
  }

  const fromFile = readJsonFile<Listing[]>(LISTINGS_FILE);
  if (fromFile && Array.isArray(fromFile) && fromFile.length > 0) {
    globalThis.__portex_listings_cache = fromFile;
    return fromFile;
  }

  // Initialize with initial listings
  const initial = [...INITIAL_LISTINGS];
  globalThis.__portex_listings_cache = initial;
  writeJsonFile(LISTINGS_FILE, initial);
  return initial;
}

export function saveServerListing(listing: Listing): Listing[] {
  const current = getServerListings();
  const existingIdx = current.findIndex(l => l.id === listing.id);
  let updated: Listing[];
  if (existingIdx >= 0) {
    updated = current.map(l => (l.id === listing.id ? { ...l, ...listing } : l));
  } else {
    updated = [listing, ...current];
  }
  globalThis.__portex_listings_cache = updated;
  writeJsonFile(LISTINGS_FILE, updated);
  return updated;
}

export function updateServerListing(id: string, partial: Partial<Listing>): Listing[] {
  const current = getServerListings();
  const updated = current.map(l => (l.id === id ? { ...l, ...partial } : l));
  globalThis.__portex_listings_cache = updated;
  writeJsonFile(LISTINGS_FILE, updated);
  return updated;
}

export function deleteServerListing(id: string): Listing[] {
  const current = getServerListings();
  const updated = current.filter(l => l.id !== id);
  globalThis.__portex_listings_cache = updated;
  writeJsonFile(LISTINGS_FILE, updated);
  return updated;
}

// ---------------- DELIVERIES ----------------

export function getServerDeliveries(): DeliveryBooking[] {
  if (globalThis.__portex_deliveries_cache && globalThis.__portex_deliveries_cache.length > 0) {
    return globalThis.__portex_deliveries_cache;
  }

  const fromFile = readJsonFile<DeliveryBooking[]>(DELIVERIES_FILE);
  if (fromFile && Array.isArray(fromFile) && fromFile.length > 0) {
    globalThis.__portex_deliveries_cache = fromFile;
    return fromFile;
  }

  const initial = [...INITIAL_DELIVERIES];
  globalThis.__portex_deliveries_cache = initial;
  writeJsonFile(DELIVERIES_FILE, initial);
  return initial;
}

export function saveServerDelivery(delivery: DeliveryBooking): DeliveryBooking[] {
  const current = getServerDeliveries();
  const existingIdx = current.findIndex(d => d.id === delivery.id);
  let updated: DeliveryBooking[];
  if (existingIdx >= 0) {
    updated = current.map(d => (d.id === delivery.id ? { ...d, ...delivery } : d));
  } else {
    updated = [delivery, ...current];
  }
  globalThis.__portex_deliveries_cache = updated;
  writeJsonFile(DELIVERIES_FILE, updated);
  return updated;
}

export function updateServerDelivery(id: string, partial: Partial<DeliveryBooking>): DeliveryBooking[] {
  const current = getServerDeliveries();
  const updated = current.map(d => (d.id === id ? { ...d, ...partial } : d));
  globalThis.__portex_deliveries_cache = updated;
  writeJsonFile(DELIVERIES_FILE, updated);
  return updated;
}
