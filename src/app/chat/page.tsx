'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Send,
  Image as ImageIcon,
  Truck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Tag,
  Phone,
  ArrowRight,
  ArrowLeft,
  MoreVertical,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import RequestDeliveryModal from '@/components/marketplace/RequestDeliveryModal';

export default function ChatPage() {
  const {
    conversations,
    messages,
    sendMessage,
    respondToOffer,
    currentUser,
    listings,
    showToast,
  } = usePortex();

  const [activeConvId, setActiveConvId] = useState(conversations[0]?.id || 'conv-1');
  const [showMobileThread, setShowMobileThread] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const activeMessages = messages[activeConvId] || [];
  const associatedListing = listings.find(l => l.id === activeConv?.listingId) || listings[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(activeConvId, inputText);
    setInputText('');
  };

  const selectConversation = (id: string) => {
    setActiveConvId(id);
    setShowMobileThread(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden h-[calc(100vh-150px)] md:h-[760px] grid grid-cols-1 md:grid-cols-12">
        {/* Left Thread List (Hidden on mobile when thread is active) */}
        <aside
          className={`md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 ${
            showMobileThread ? 'hidden md:flex' : 'flex col-span-12'
          }`}
        >
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              Messages &amp; Negotiations
            </h2>
            <p className="text-xs text-slate-500">Live chat with sellers, buyers &amp; Porter drivers</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {conversations.map(c => {
              const isSelected = c.id === activeConvId;
              return (
                <div
                  key={c.id}
                  onClick={() => selectConversation(c.id)}
                  className={`p-3.5 sm:p-4 cursor-pointer transition-colors flex items-start gap-3 ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-blue-600'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={c.contactAvatar}
                      alt={c.contactName}
                      className="w-11 h-11 rounded-xl object-cover"
                    />
                    {c.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {c.contactName}
                      </h4>
                      <span className="text-[10px] text-slate-400 flex-shrink-0 ml-1">{c.lastTimestamp}</span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate leading-snug">
                      {c.lastMessage}
                    </p>

                    {c.listingTitle && (
                      <span className="inline-block mt-1 text-[10px] text-blue-600 dark:text-blue-400 font-semibold truncate max-w-full">
                        📌 {c.listingTitle}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Active Message Thread (Hidden on mobile when in list view) */}
        <main
          className={`md:col-span-8 flex flex-col h-full bg-white dark:bg-slate-950 ${
            showMobileThread ? 'flex col-span-12' : 'hidden md:flex'
          }`}
        >
          {/* Thread Header with Back button on Mobile */}
          <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/40 dark:bg-slate-900/40 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Mobile Back Button */}
              <button
                onClick={() => setShowMobileThread(false)}
                className="md:hidden p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                aria-label="Back to messages list"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <img
                src={activeConv.contactAvatar}
                alt={activeConv.contactName}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                  <span className="truncate">{activeConv.contactName}</span>
                </h3>
                <p className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  Active &bull; Escrow Protection
                </p>
              </div>
            </div>

            {/* Quick Listing / Delivery Action Header Widget */}
            {activeConv.listingTitle ? (
              <button
                onClick={() => setShowDeliveryModal(true)}
                className="px-3 py-1.5 sm:px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors flex-shrink-0"
              >
                <Truck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dispatch Porter</span>
                <span className="sm:hidden">Deliver</span>
              </button>
            ) : (
              <Link
                href="/tracking"
                className="px-3 py-1.5 sm:px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 flex-shrink-0"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Track</span>
              </Link>
            )}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
            {activeMessages.map(msg => {
              const isMine = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <span className="text-[10px] text-slate-400 px-1 font-medium">
                    {msg.senderName} &bull; {msg.timestamp}
                  </span>

                  {/* Standard text bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-md p-3 sm:p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isMine
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <p>{msg.content}</p>

                    {/* Interactive Offer Action Box */}
                    {msg.isOffer && (
                      <div className="mt-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-900 text-white border border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                            <Tag className="w-3 h-3 text-amber-400" /> Buyer Offer
                          </span>
                          <span className="text-xs sm:text-sm font-black text-emerald-400">
                            ₹{msg.offerAmount?.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {msg.offerStatus === 'ACCEPTED' ? (
                          <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Offer Accepted!
                          </div>
                        ) : msg.offerStatus === 'DECLINED' ? (
                          <div className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Offer Declined.
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => respondToOffer(activeConvId, msg.id, 'ACCEPTED')}
                              className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => respondToOffer(activeConvId, msg.id, 'DECLINED')}
                              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold border border-slate-700"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-2.5 sm:p-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50/60 dark:bg-slate-900/60"
          >
            <button
              type="button"
              onClick={() => showToast('Photo attachment simulation')}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder="Type message or delivery query..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 py-2 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </main>
      </div>

      {/* Instant Delivery Booking Modal */}
      {showDeliveryModal && associatedListing && (
        <RequestDeliveryModal
          listing={associatedListing}
          onClose={() => setShowDeliveryModal(false)}
        />
      )}
    </div>
  );
}
