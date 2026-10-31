'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  Navigation,
  Sparkles,
  ExternalLink,
  Plus,
  Loader2,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import RequestDeliveryModal from '@/components/marketplace/RequestDeliveryModal';
import MakeOfferModal from '@/components/marketplace/MakeOfferModal';
import { compressImageFile } from '@/lib/utils/imageUpload';

function ChatContent() {
  const searchParams = useSearchParams();
  const convParam = searchParams.get('conv');
  const listingParam = searchParams.get('listingId');
  const deliveryParam = searchParams.get('deliveryId');

  const {
    conversations,
    messages,
    sendMessage,
    respondToOffer,
    getOrCreateConversation,
    currentUser,
    listings,
    deliveries,
    showToast,
  } = usePortex();

  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || 'conv-1');
  const [showMobileThread, setShowMobileThread] = useState<boolean>(false);
  const [inputText, setInputText] = useState('');
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedOfferPrice, setSelectedOfferPrice] = useState<number | undefined>(undefined);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle URL query parameters to route to corresponding conversation
  useEffect(() => {
    if (convParam) {
      const found = conversations.find(c => c.id === convParam);
      if (found) {
        setActiveConvId(found.id);
        setShowMobileThread(true);
        return;
      }
    }

    if (listingParam) {
      const targetListing = listings.find(l => l.id === listingParam);
      if (targetListing) {
        const conv = getOrCreateConversation({
          listingId: targetListing.id,
          contactId: targetListing.sellerId,
          contactName: `${targetListing.sellerName} (Seller)`,
          contactAvatar: targetListing.sellerAvatar,
          contactRole: 'Verified Seller',
          listingTitle: targetListing.title,
          listingPrice: targetListing.price,
          listingImage: targetListing.images[0],
        });
        setActiveConvId(conv.id);
        setShowMobileThread(true);
        return;
      }
    }

    if (deliveryParam) {
      const targetDelivery = deliveries.find(
        d => d.id === deliveryParam || d.trackingNumber === deliveryParam
      );
      if (targetDelivery) {
        const conv = getOrCreateConversation({
          deliveryId: targetDelivery.id,
          contactId: targetDelivery.driverId || 'drv-301',
          contactName: `${targetDelivery.driverName || 'Mohd. Imran Khan'} (Driver)`,
          contactAvatar:
            targetDelivery.driverAvatar ||
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
          contactRole: 'Portex Fleet Partner',
          initialMessage: `Trip #${targetDelivery.trackingNumber}: ${targetDelivery.packageType}`,
        });
        setActiveConvId(conv.id);
        setShowMobileThread(true);
      }
    }
  }, [convParam, listingParam, deliveryParam, listings, deliveries]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConvId]);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0] || {
    id: 'conv-1',
    contactId: 'usr_seller_1',
    contactName: 'Seller Support',
    contactAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    contactRole: 'Verified Seller',
    lastMessage: 'Hello! Feel free to chat with us.',
    lastTimestamp: 'Just now',
    unreadCount: 0,
    isOnline: true,
  };

  const activeMessages = messages[activeConv.id] || [];
  const associatedListing = listings.find(l => l.id === activeConv?.listingId) || (activeConv?.listingTitle ? listings[0] : null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  const handleQuickSend = (text: string) => {
    sendMessage(activeConv.id, text);
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);
    try {
      const file = files[0];
      const compressedDataUrl = await compressImageFile(file, 900, 900, 0.82);
      sendMessage(activeConv.id, '📷 Photo attachment', undefined, compressedDataUrl);
      showToast('Photo uploaded and sent!');
    } catch {
      showToast('Could not attach image. Please try again.');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const selectConversation = (id: string) => {
    setActiveConvId(id);
    setShowMobileThread(true);
  };

  const openDeliveryWithOffer = (offerAmount?: number) => {
    setSelectedOfferPrice(offerAmount);
    setShowDeliveryModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-6">
      {/* Hidden file input for chat photo attachments */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={handlePhotoSelect}
        className="hidden"
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden h-[calc(100vh-140px)] md:h-[760px] grid grid-cols-1 md:grid-cols-12">
        {/* Left Thread List (Hidden on mobile when thread is active) */}
        <aside
          className={`md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 ${
            showMobileThread ? 'hidden md:flex' : 'flex col-span-12'
          }`}
        >
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Messages &amp; Deals
              </h2>
              <p className="text-xs text-slate-500">Live chat with sellers, buyers &amp; Porter drivers</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
              {conversations.length} Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {conversations.map(c => {
              const isSelected = c.id === activeConv.id;
              const isDriver = c.deliveryId || c.contactRole?.toLowerCase().includes('driver');

              return (
                <div
                  key={c.id}
                  onClick={() => selectConversation(c.id)}
                  className={`p-3.5 sm:p-4 cursor-pointer transition-colors flex items-start gap-3 ${
                    isSelected
                      ? 'bg-blue-50/90 dark:bg-blue-950/40 border-l-4 border-blue-600'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={c.contactAvatar}
                      alt={c.contactName}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
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

                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-0.5 font-medium">
                      {isDriver ? (
                        <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Truck className="w-3 h-3" /> Pilot Driver
                        </span>
                      ) : (
                        <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> {c.contactRole || 'Marketplace'}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate leading-snug">
                      {c.lastMessage}
                    </p>

                    {c.listingTitle && (
                      <span className="inline-block mt-1 text-[10px] text-blue-600 dark:text-blue-400 font-semibold truncate max-w-full">
                        📌 {c.listingTitle}
                      </span>
                    )}
                    {c.deliveryId && (
                      <span className="inline-block mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate max-w-full">
                        🚚 Trip #{c.deliveryId}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Active Message Thread */}
        <main
          className={`md:col-span-8 flex flex-col h-full bg-white dark:bg-slate-950 ${
            showMobileThread ? 'flex col-span-12' : 'hidden md:flex'
          }`}
        >
          {/* Thread Header with Back button on Mobile */}
          <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Mobile Back Button */}
              <button
                onClick={() => setShowMobileThread(false)}
                className="md:hidden p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                aria-label="Back to messages list"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative flex-shrink-0">
                <img
                  src={activeConv.contactAvatar}
                  alt={activeConv.contactName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                />
                {activeConv.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                )}
              </div>

              <div className="min-w-0">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                  <span className="truncate">{activeConv.contactName}</span>
                </h3>
                <p className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 truncate font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  {activeConv.deliveryId ? 'Driver Dispatched • Live GPS Telemetry' : 'Verified • 100% Escrow Protection'}
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Call Button */}
              <a
                href="tel:+919839014592"
                className="p-2 sm:px-3 sm:py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Call Contact"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Call</span>
              </a>

              {/* Action Button: Dispatch Porter OR Live Tracking */}
              {activeConv.listingTitle ? (
                <button
                  onClick={() => openDeliveryWithOffer(undefined)}
                  className="px-3 py-1.5 sm:px-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dispatch Porter</span>
                  <span className="sm:hidden">Deliver</span>
                </button>
              ) : activeConv.deliveryId ? (
                <Link
                  href={`/tracking/${activeConv.deliveryId}`}
                  className="px-3 py-1.5 sm:px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Live Tracking</span>
                  <span className="sm:hidden">Track</span>
                </Link>
              ) : null}
            </div>
          </div>

          {/* Listing / Item Ribbon in Active Chat */}
          {activeConv.listingTitle && (
            <div className="px-4 py-2 bg-slate-100/90 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 truncate">
                {activeConv.listingImage && (
                  <img
                    src={activeConv.listingImage}
                    alt={activeConv.listingTitle}
                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                )}
                <div className="truncate">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                    {activeConv.listingTitle}
                  </span>
                  {activeConv.listingPrice && (
                    <span className="font-black text-blue-600 dark:text-blue-400">
                      Asking: ₹{activeConv.listingPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {associatedListing && (
                  <button
                    type="button"
                    onClick={() => setShowOfferModal(true)}
                    className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold rounded-lg text-[11px] border border-amber-500/20 flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3" />
                    <span>Make Offer</span>
                  </button>
                )}
                {activeConv.listingId && (
                  <Link
                    href={`/listings/${activeConv.listingId}`}
                    className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
                    title="Open listing detail page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          )}

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

                  {/* Standard text / image bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-md p-3 sm:p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isMine
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {/* Render attached image if present */}
                    {msg.imageUrl && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-white/20 dark:border-slate-700 shadow-sm max-w-xs">
                        <img
                          src={msg.imageUrl}
                          alt="Photo attachment"
                          className="w-full max-h-56 object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    )}

                    <p className="whitespace-pre-line">{msg.content}</p>

                    {/* Interactive Offer Action Box */}
                    {msg.isOffer && (
                      <div className="mt-2.5 p-3 rounded-xl bg-slate-900 text-white border border-slate-700 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                            <Tag className="w-3 h-3 text-amber-400" /> Buyer Offer
                          </span>
                          <span className="text-xs sm:text-sm font-black text-emerald-400">
                            ₹{msg.offerAmount?.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {msg.offerStatus === 'ACCEPTED' ? (
                          <div className="space-y-2">
                            <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Deal Accepted by Seller!
                            </div>
                            {associatedListing && (
                              <button
                                type="button"
                                onClick={() => openDeliveryWithOffer(msg.offerAmount)}
                                className="w-full py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg text-xs font-black shadow flex items-center justify-center gap-1.5 transition-all"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Book Porter Delivery (₹{msg.offerAmount?.toLocaleString('en-IN')})</span>
                              </button>
                            )}
                          </div>
                        ) : msg.offerStatus === 'DECLINED' ? (
                          <div className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Offer Declined.
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => respondToOffer(activeConv.id, msg.id, 'ACCEPTED')}
                              className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() => respondToOffer(activeConv.id, msg.id, 'DECLINED')}
                              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold border border-slate-700 cursor-pointer"
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
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Negotiation Suggestions */}
          <div className="px-3 py-1.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-slate-400 font-semibold flex-shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Quick:
            </span>
            {[
              'Is this item still available?',
              'Can you arrange same-day Porter pickup?',
              'What is your lowest price for immediate deal?',
              'Please share live location coordinates.',
            ].map((text, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickSend(text)}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap text-[10px] font-medium transition-colors"
              >
                {text}
              </button>
            ))}
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-2.5 sm:p-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50/60 dark:bg-slate-900/60"
          >
            {/* Real photo upload trigger */}
            <button
              type="button"
              disabled={isUploadingPhoto}
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Attach photo"
            >
              {isUploadingPhoto ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              ) : (
                <ImageIcon className="w-5 h-5" />
              )}
            </button>

            <input
              type="text"
              placeholder="Type message, inquiry or negotiate delivery..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 py-2 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-2.5 rounded-xl transition-all ${
                inputText.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
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
          offerPrice={selectedOfferPrice}
          onClose={() => setShowDeliveryModal(false)}
        />
      )}

      {/* Make an Offer Modal from inside chat */}
      {showOfferModal && associatedListing && (
        <MakeOfferModal
          listing={associatedListing}
          onClose={() => setShowOfferModal(false)}
        />
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto py-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading secure Portex chat channels...</p>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
