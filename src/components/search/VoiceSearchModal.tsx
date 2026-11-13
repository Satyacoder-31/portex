'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, X, Sparkles, Languages, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuery?: (query: string) => void;
}

export default function VoiceSearchModal({ isOpen, onClose, onSelectQuery }: VoiceSearchModalProps) {
  const router = useRouter();
  const { addRecentSearch, showToast } = usePortex();

  // Permission state: 'PROMPT' | 'REQUESTING' | 'GRANTED' | 'DENIED'
  const [permissionState, setPermissionState] = useState<'PROMPT' | 'REQUESTING' | 'GRANTED' | 'DENIED'>('PROMPT');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);

  // Check microphone support and cached permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      }

      // Check if user has previously granted permission in this session/browser
      const savedPermission = localStorage.getItem('portex_mic_permission');
      if (savedPermission === 'GRANTED') {
        setPermissionState('GRANTED');
      } else {
        setPermissionState('PROMPT');
      }
    }
  }, []);

  // When modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setErrorMsg(null);
      if (permissionState === 'GRANTED') {
        startSpeechRecognition();
      }
    } else {
      stopSpeechRecognition();
    }

    return () => {
      stopSpeechRecognition();
    };
  }, [isOpen, permissionState, selectedLanguage]);

  // Explicit user permission request handler
  const handleRequestPermission = async () => {
    setPermissionState('REQUESTING');
    setErrorMsg(null);

    try {
      if (navigator?.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Permission successfully granted!
        // Stop audio tracks after permission handshake
        stream.getTracks().forEach(track => track.stop());

        localStorage.setItem('portex_mic_permission', 'GRANTED');
        setPermissionState('GRANTED');
        showToast('Microphone access granted.');
        startSpeechRecognition();
      } else {
        // Fallback for environments where getUserMedia is not directly available
        localStorage.setItem('portex_mic_permission', 'GRANTED');
        setPermissionState('GRANTED');
        startSpeechRecognition();
      }
    } catch (err: any) {
      console.warn('Microphone permission denied:', err);
      setPermissionState('DENIED');
      setErrorMsg('Microphone access was denied. Please allow microphone permissions in your browser address bar.');
    }
  };

  const startSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setIsListening(true);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguage;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);

        if (event.results[current].isFinal) {
          handleSearchSuccess(text);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setPermissionState('DENIED');
          setErrorMsg('Microphone access denied. You can tap a quick search suggestion below.');
        } else if (event.error === 'no-speech') {
          setErrorMsg('No speech detected. Please tap mic and try speaking again.');
        } else {
          setErrorMsg('Listening timed out. You can tap any search suggestion below.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(true);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleSearchSuccess = (queryText: string) => {
    const clean = queryText.trim().replace(/[.?]$/, '');
    if (!clean) return;

    addRecentSearch(clean);
    showToast(`Voice Search: "${clean}"`);

    stopSpeechRecognition();
    onClose();

    if (onSelectQuery) {
      onSelectQuery(clean);
    } else {
      router.push(`/marketplace?q=${encodeURIComponent(clean)}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-center p-6 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close Voice Search"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SCREEN 1: Explicit Microphone Permission Request */}
        {permissionState === 'PROMPT' || permissionState === 'REQUESTING' ? (
          <div className="py-4 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20 shadow-md">
              <Mic className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Microphone Permission Required</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Enable Voice Search
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Portex uses your microphone solely to convert your spoken search queries into product and cargo searches in real time. We do not record or store your audio.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRequestPermission}
                disabled={permissionState === 'REQUESTING'}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-transform hover:scale-105 disabled:opacity-50"
              >
                {permissionState === 'REQUESTING' ? 'Requesting Access...' : 'Allow Microphone Access'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Not Now
              </button>
            </div>
          </div>
        ) : permissionState === 'DENIED' ? (
          /* SCREEN 2: Permission Denied Notice */
          <div className="py-4 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
              <MicOff className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Microphone Access Denied
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {errorMsg || 'Please allow microphone access in your browser permissions to use voice search.'}
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleRequestPermission}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* SCREEN 3: Active Voice Search Interface (Portex Clean Blue Style) */
          <>
            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-xs font-bold mb-2">
                <Mic className="w-3.5 h-3.5" />
                <span>Portex Voice Search</span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {isListening ? 'Listening...' : 'Tap Mic to Speak'}
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Speak your product, vehicle, or cargo requirement in English or Hindi
              </p>
            </div>

            {/* Center Animated Mic Circle */}
            <div className="relative flex items-center justify-center py-4">
              {isListening && (
                <>
                  <span className="absolute w-36 h-36 rounded-full bg-blue-500/15 animate-ping" />
                  <span className="absolute w-28 h-28 rounded-full bg-blue-500/25 animate-pulse" />
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  if (isListening) {
                    stopSpeechRecognition();
                  } else {
                    startSpeechRecognition();
                  }
                }}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all cursor-pointer ${
                  isListening
                    ? 'bg-gradient-to-tr from-blue-700 to-indigo-600 text-white scale-110 shadow-blue-500/35 ring-4 ring-blue-300/40'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
                }`}
              >
                {isListening ? <Mic className="w-9 h-9 animate-bounce" /> : <Mic className="w-9 h-9" />}
              </button>
            </div>

            {/* Live Detected Transcript Display */}
            <div className="min-h-[48px] flex items-center justify-center px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold">
              {transcript ? (
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">"{transcript}"</span>
                  <button
                    type="button"
                    onClick={() => handleSearchSuccess(transcript)}
                    className="px-2.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <span className="text-slate-400 text-xs italic">
                  {isListening ? 'Speak now... (e.g. "MacBook Pro" or "Tata Ace")' : errorMsg || 'Microphone is ready'}
                </span>
              )}
            </div>

            {/* Language Selection Switcher */}
            <div className="flex items-center justify-center gap-2 text-xs">
              <Languages className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500 font-medium">Language:</span>
              <button
                type="button"
                onClick={() => setSelectedLanguage('en-IN')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedLanguage === 'en-IN'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                English (India)
              </button>
              <button
                type="button"
                onClick={() => setSelectedLanguage('hi-IN')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedLanguage === 'hi-IN'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                हिंदी (Hindi)
              </button>
            </div>

            {/* Instant Tap-to-Search Suggestions (Portex Focused) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Quick Search Suggestions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Apple MacBook Pro',
                  'Tata Ace Mini Truck',
                  '2-Wheeler Courier',
                  '3-Wheeler Auto Tempo',
                  'Electronics',
                  'Office Furniture',
                ].map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setTranscript(item);
                      setTimeout(() => handleSearchSuccess(item), 350);
                    }}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-300 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    🔍 {item}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
