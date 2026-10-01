'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  MapPin,
  Truck,
  Eye,
  Sparkles,
  Smartphone,
  Car,
  Armchair,
  Tv,
  HardHat,
  Watch,
  BookOpen,
  DollarSign,
  Info,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import { ListingCondition } from '@/types';
import confetti from 'canvas-confetti';

interface PostItemWizardProps {
  onClose?: () => void;
}

export default function PostItemWizard({ onClose }: PostItemWizardProps) {
  const router = useRouter();
  const { addListing, currentUser } = usePortex();

  const [step, setStep] = useState(1);

  // Form State
  const [category, setCategory] = useState('electronics');
  const [subCategory, setSubCategory] = useState('Laptops & Computers');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<ListingCondition>('LIKE_NEW');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
  ]);
  const [address, setAddress] = useState('Sector-I, Aliganj, Near Kapoor Crossing');
  const [city, setCity] = useState('Lucknow');
  const [state, setState] = useState('Uttar Pradesh');
  const [pincode, setPincode] = useState('226024');
  const [weightKg, setWeightKg] = useState<number>(3.5);
  const [dimensions, setDimensions] = useState('38 x 26 x 3 cm');
  const [eligibleForDelivery, setEligibleForDelivery] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  const stepsList = [
    { num: 1, title: 'Category' },
    { num: 2, title: 'Details' },
    { num: 3, title: 'Photos' },
    { num: 4, title: 'Price' },
    { num: 5, title: 'Location' },
    { num: 6, title: 'Porter Delivery' },
    { num: 7, title: 'Preview' },
    { num: 8, title: 'Publish' },
  ];

  const categories = [
    { id: 'electronics', name: 'Electronics & Mobiles', icon: Smartphone, subs: ['Smartphones', 'Laptops & Computers', 'Cameras', 'Audio'] },
    { id: 'furniture', name: 'Home & Furniture', icon: Armchair, subs: ['Sofas & Living', 'Beds & Wardrobes', 'Dining Sets', 'Office Chairs'] },
    { id: 'vehicles', name: 'Vehicles & Bikes', icon: Car, subs: ['Motorcycles', 'Scooters', 'Cars', 'Spare Parts'] },
    { id: 'appliances', name: 'Home Appliances', icon: Tv, subs: ['Televisions', 'Refrigerators', 'Washing Machines', 'ACs'] },
    { id: 'commercial', name: 'Commercial Equipment', icon: HardHat, subs: ['Industrial Tools', 'Office Tech', 'Warehouse Gear'] },
    { id: 'fashion', name: 'Fashion & Watches', icon: Watch, subs: ['Luxury Watches', 'Designer Apparel', 'Sneakers'] },
    { id: 'books', name: 'Books & Hobbies', icon: BookOpen, subs: ['Textbooks', 'Musical Instruments', 'Sports Goods'] },
  ];

  const handleNext = () => {
    if (step === 2 && !title.trim()) {
      alert('Please enter a listing title');
      return;
    }
    if (step === 4 && (!price || Number(price) <= 0)) {
      alert('Please enter a valid asking price');
      return;
    }
    setStep(prev => Math.min(prev + 1, 8));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handlePublish = () => {
    setIsPublishing(true);

    const created = addListing({
      title: title || 'Apple MacBook Pro M2 Pro 16-inch Space Gray',
      description: description || 'Super fast M2 Pro with 32GB RAM and 1TB SSD. Pristine condition with original invoice and warranty.',
      price: Number(price) || 145000,
      originalPrice: Number(originalPrice) || 230000,
      condition,
      category,
      subCategory,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80'],
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      sellerRating: 4.9,
      sellerIsVerified: true,
      sellerPhone: currentUser.phone,
      location: {
        address,
        city,
        state,
        pincode,
        lat: 26.8854,
        lng: 80.9452,
      },
      weightKg: Number(weightKg) || 2.5,
      dimensions: dimensions || '35 x 25 x 2 cm',
      status: 'ACTIVE',
      isFeatured: true,
    });

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }

    setTimeout(() => {
      setIsPublishing(false);
      if (onClose) onClose();
      router.push(`/listings/${created.id}`);
    }, 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Top Wizard Steps Bar */}
      <div className="bg-slate-900 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
            <div>
              <h2 className="text-white font-bold text-xs sm:text-base leading-tight">
                Post an Item &amp; Enable Porter Delivery
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400">Step {step} of 8 &bull; {stepsList[step - 1].title}</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Tracker Stepper */}
        <div className="grid grid-cols-8 gap-1">
          {stepsList.map(s => (
            <div
              key={s.num}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s.num < step
                  ? 'bg-emerald-500'
                  : s.num === step
                  ? 'bg-blue-500 ring-2 ring-blue-500/40'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Wizard Content Body */}
      <div className="p-4 sm:p-8 min-h-[380px] flex flex-col justify-between">
        {/* Step 1: Category */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Choose a Category for your item
            </h3>
            <p className="text-xs text-slate-500">
              Select the primary department to reach verified buyers and enable correct vehicle matching.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
              {categories.map(c => {
                const Icon = c.icon;
                const isSelected = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCategory(c.id);
                      setSubCategory(c.subs[0]);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-600/40 -translate-y-1 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{c.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{c.subs.length} subcategories</div>
                  </button>
                );
              })}
            </div>

            {/* Subcategories selector */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Subcategory
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.find(c => c.id === category)?.subs.map(sub => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSubCategory(sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      subCategory === sub
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:border-slate-300'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Product Details */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Product Specifications &amp; Description
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Listing Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Apple MacBook Pro 16-inch M2 Pro 32GB RAM"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Detailed Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe key specs, condition, original accessories, purchase date, reason for selling..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Item Condition
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['BRAND_NEW', 'LIKE_NEW', 'EXCELLENT', 'GOOD'] as ListingCondition[]).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCondition(c)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                      condition === c
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {c.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Upload High-Resolution Photos
            </h3>
            <p className="text-xs text-slate-500">
              Clear photos attract 4x more buyer offers and help Porter drivers plan handling.
            </p>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
              <Upload className="w-10 h-10 mx-auto text-blue-500 mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Drag and drop your photos here, or click to browse
              </p>
              <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP up to 10MB each</p>
            </div>

            {/* Uploaded Gallery Thumbnails */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                    {idx === 0 ? 'Cover Photo' : `Photo ${idx + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Price */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Set Your Asking Price
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Asking Selling Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-lg font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    placeholder="150000"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Original Invoice MRP (₹) (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-lg font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    placeholder="249900"
                    value={originalPrice}
                    onChange={e => setOriginalPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="text-xs text-slate-700 dark:text-slate-300">
                <strong>Escrow Guarantee:</strong> Buyer payment is held securely in escrow and released to you directly upon delivery confirmation.
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Location */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Item Pickup Location
            </h3>
            <p className="text-xs text-slate-500">
              Where can buyers meet or where will the Porter driver pick up the consignment?
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Street Address / Landmark
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Porter Delivery Options */}
        {step === 6 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Porter Hyperlocal Delivery Settings
            </h3>
            <p className="text-xs text-slate-500">
              Enable automated vehicle recommendations and instant shipping quotes for prospective buyers.
            </p>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  Allow Porter On-Demand Delivery
                </h4>
                <p className="text-[11px] text-slate-500">
                  Buyers can request a driver to pick up and deliver directly.
                </p>
              </div>
              <input
                type="checkbox"
                checked={eligibleForDelivery}
                onChange={e => setEligibleForDelivery(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Approx. Package Weight (Kg)
                </label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={e => setWeightKg(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Dimensions (L x W x H cm)
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={e => setDimensions(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 text-xs text-blue-700 dark:text-blue-300">
              💡 Based on {weightKg} kg, Portex will recommend a{' '}
              <strong>
                {weightKg <= 20
                  ? '2-Wheeler Bike'
                  : weightKg <= 400
                  ? '3-Wheeler Auto'
                  : 'Tata Ace Mini Truck'}
              </strong>{' '}
              to buyers.
            </div>
          </div>
        )}

        {/* Step 7: Preview */}
        {step === 7 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Preview Your Listing
            </h3>
            <p className="text-xs text-slate-500">
              Review how your ad will appear to verified buyers across the city.
            </p>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md flex flex-col sm:flex-row gap-5">
              <img
                src={images[0]}
                alt="preview"
                className="w-full sm:w-48 h-36 rounded-xl object-cover"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                    {condition.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-slate-400">&bull; {subCategory}</span>
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {title || 'Apple MacBook Pro 16-inch M2 Pro'}
                </h4>
                <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                  ₹{Number(price || 145000).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>{address}, {city}</span>
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Porter Delivery Eligible ({weightKg} kg)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 8: Publish */}
        {step === 8 && (
          <div className="text-center py-6 space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Ready to Go Live on Portex!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your item will be immediately indexed across Lucknow &amp; regional buyers. You can track chat messages, offers, and delivery dispatches in real-time.
            </p>

            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-blue-500/25 transition-all hover:scale-105"
            >
              {isPublishing ? 'Publishing Listing...' : 'Publish Listing Now 🚀'}
            </button>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        {step < 8 && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1 ${
                step === 1
                  ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              <span>{step === 7 ? 'Proceed to Publish' : 'Continue'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
