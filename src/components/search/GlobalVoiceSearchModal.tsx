'use client';

import React from 'react';
import { usePortex } from '@/lib/store/portexStore';
import VoiceSearchModal from './VoiceSearchModal';

export default function GlobalVoiceSearchModal() {
  const { isVoiceModalOpen, closeVoiceSearch } = usePortex();
  return <VoiceSearchModal isOpen={isVoiceModalOpen} onClose={closeVoiceSearch} />;
}

