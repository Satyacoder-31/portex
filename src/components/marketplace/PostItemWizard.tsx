'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  Camera,
  Image as ImageIcon,
  Link as LinkIcon,
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
  Trash2,
  Star,
  Loader2,
  ShoppingBag,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import { ListingCondition } from '@/types';
import confetti from 'canvas-confetti';
import { compressImageFile, CATEGORY_SAMPLE_PHOTOS } from '@/lib/utils/imageUpload';

interface PostItemWizardProps {
  onClose?: () => void;
}

export default function PostItemWizard({ onClose }: PostItemWizardProps) {
  const router = useRouter();
  const { addListing, currentUser, setUserRole, showToast } = usePortex();

  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [category, setCategory] = useState('electronics');
  const [subCategory, setSubCategory] = useState('Laptops & Computers');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<ListingCondition>('LIKE_NEW');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  
  // Real photos state
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
  ]);
  const [isProcessingPhotos, setIsProcessingPhotos] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Location & Logistics
  const [address, setAddress] = useState(
    currentUser.marketplaceProfile?.sellerPickupAddress ||
    currentUser.porterProfile?.defaultPickupAddress ||
    'Flat 402, Royal Palms, Gomti Nagar Extension'
  );
  const [city, setCity] = useState(currentUser.city || 'Lucknow');
  const [state, setState] = useState('Uttar Pradesh');
  const [pincode, setPincode] = useState(
    currentUser.marketplaceProfile?.sellerPickupPincode ||
    currentUser.porterProfile?.pickupPincode ||
    '226010'
  );
  const [weightKg, setWeightKg] = useState<number>(3.5);
  const [dimensions, setDimensions] = useState('38 x 26 x 3 cm');
  const [eligibleForDelivery, setEligibleForDelivery] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedListingId, setPublishedListingId] = useState<string | null>(null);

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

  // Quick Demo Prefills
  const applyQuickTemplate = (template: {
    cat: string;
    sub: string;
    t: string;
    d: string;
    c: ListingCondition;
    p: number;
    op: number;
    w: number;
    dim: string;
    imgs: string[];
  }) => {
    setCategory(template.cat);
    setSubCategory(template.sub);
    setTitle(template.t);
    setDescription(template.d);
    setCondition(template.c);
    setPrice(template.p);
    setOriginalPrice(template.op);
    setWeightKg(template.w);
    setDimensions(template.dim);
    setImages(template.imgs);
    showToast(`Loaded template for "${template.t}"`);
  };

  // Process chosen files (from device camera or gallery)
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingPhotos(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataUrl = await compressImageFile(file);
        newImages.push(dataUrl);
      }
      setImages(prev => [...newImages, ...prev].slice(0, 8));
      showToast(`Added ${newImages.length} photo${newImages.length > 1 ? 's' : ''}!`);
    } catch (err: any) {
      alert(err.message || 'Error processing photo');
    } finally {
      setIsProcessingPhotos(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  // Drag and Drop files
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    setIsProcessingPhotos(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const dataUrl = await compressImageFile(file);
          newImages.push(dataUrl);
        }
      }
      if (newImages.length > 0) {
        setImages(prev => [...newImages, ...prev].slice(0, 8));
        showToast(`Uploaded ${newImages.length} photo${newImages.length > 1 ? 's' : ''}!`);
      }
    } catch (err: any) {
      alert(err.message || 'Error uploading photo');
    } finally {
      setIsProcessingPhotos(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages(prev => [imageUrlInput.trim(), ...prev]);
    setImageUrlInput('');
    setShowUrlInput(false);
    showToast('Photo URL added to listing!');
  };

  const handleApplySamplePack = () => {
    const samplePack = CATEGORY_SAMPLE_PHOTOS[category] || CATEGORY_SAMPLE_PHOTOS.electronics;
    setImages(samplePack);
    showToast(`Applied sample photos for ${category}!`);
  };

  const handleRemovePhoto = (index: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSetCoverPhoto = (index: number) => {
    setImages(prev => {
      const selected = prev[index];
      const rest = prev.filter((_, idx) => idx !== index);
      return [selected, ...rest];
    });
    showToast('Set as Cover Photo!');
  };

  const handleNext = () => {
    if (step === 2 && !title.trim()) {
      alert('Please enter a listing title');
      return;
    }
    if (step === 3 && images.length === 0) {
      alert('Please upload or select at least 1 photo for your product');
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
      title: title || 'Apple MacBook Pro M2 Pro 16-inch',
      description: description || 'Pristine condition with all original accessories, invoice and warranty.',
      price: Number(price) || 145000,
      originalPrice: Number(originalPrice) || 220000,
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
      weightKg: Number(weightKg) || 3.0,
      dimensions: dimensions || '35 x 25 x 3 cm',
      status: 'ACTIVE',
      isFeatured: true,
    });

    setPublishedListingId(created.id);
    setIsPublishing(false);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Hidden File & Camera Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        multiple
        onChange={handleFilesSelected}
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFilesSelected}
        className="hidden"
      />

      {/* Top Wizard Steps Bar */}
      <div className="bg-slate-900 px-4 sm:px-6 py-3.5 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex-shrink-0 shadow-sm">
              <ShoppingBag className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-white font-extrabold text-xs sm:text-base leading-tight">
                Post Product &bull; Instant Porter Dispatch Ready
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400">
                Step {step} of 8 &bull; {stepsList[step - 1].title} &bull; Visible to all buyers
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Tracker Stepper */}
        <div className="grid grid-cols-8 gap-1.5">
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
      <div className="p-4 sm:p-8 min-h-[420px] flex flex-col justify-between">
        
        {/* Step 1: Category */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Choose a Category for your product
                </h3>
                <p className="text-xs text-slate-500">
                  Select where buyers will browse and find your item.
                </p>
              </div>
            </div>

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
                    className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-600/40 -translate-y-0.5 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{c.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{c.subs.length} subcategories</div>
                  </button>
                );
              })}
            </div>

            {/* Subcategories selector */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Subcategory
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.find(c => c.id === category)?.subs.map(sub => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSubCategory(sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      subCategory === sub
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Product Details &amp; Specifications
                </h3>
                <p className="text-xs text-slate-500">Provide accurate details to build buyer trust.</p>
              </div>

              {/* Quick Template Fill Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Quick Samples:</span>
                <button
                  type="button"
                  onClick={() =>
                    applyQuickTemplate({
                      cat: 'electronics',
                      sub: 'Laptops & Computers',
                      t: 'Apple MacBook Pro 16" M2 Pro (32GB, 1TB SSD) Space Gray',
                      d: 'Pristine condition MacBook Pro 16-inch with Apple Silicon M2 Pro. 96% battery health, AppleCare+ active. Comes with original box, 140W MagSafe charger and tax bill.',
                      c: 'LIKE_NEW',
                      p: 145000,
                      op: 249000,
                      w: 2.15,
                      dim: '35.6 x 24.8 x 1.7 cm',
                      imgs: CATEGORY_SAMPLE_PHOTOS.electronics,
                    })
                  }
                  className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-200 dark:border-blue-800 cursor-pointer"
                >
                  MacBook Pro
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyQuickTemplate({
                      cat: 'vehicles',
                      sub: 'Motorcycles',
                      t: 'Royal Enfield Classic 350 Reborn (Halcyon Black, 2023)',
                      d: 'Single owner, pristine Halcyon Black. 8,400 kms only, dealer serviced, touring mirror & crash guards installed. Zero dep insurance till Sep 2027.',
                      c: 'EXCELLENT',
                      p: 172000,
                      op: 228000,
                      w: 195,
                      dim: '214 x 79 x 109 cm',
                      imgs: CATEGORY_SAMPLE_PHOTOS.vehicles,
                    })
                  }
                  className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                >
                  Royal Enfield
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyQuickTemplate({
                      cat: 'furniture',
                      sub: 'Dining Sets',
                      t: 'Solid Sheesham Wood 6-Seater Dining Set with Glass Top',
                      d: 'Solid Indian Sheesham wood dining table with 6 cushioned chairs. Scratch-free tempered glass top. Excellent condition, ready for Porter mini truck pickup.',
                      c: 'EXCELLENT',
                      p: 24500,
                      op: 48000,
                      w: 65,
                      dim: '180 x 95 x 78 cm',
                      imgs: CATEGORY_SAMPLE_PHOTOS.furniture,
                    })
                  }
                  className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-200 dark:border-amber-800 cursor-pointer"
                >
                  Dining Table
                </button>
              </div>
            </div>

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
                Detailed Description &amp; What&apos;s Included
              </label>
              <textarea
                rows={4}
                placeholder="Describe key specs, condition, original box, accessories, purchase date, warranty..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Item Condition
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['BRAND_NEW', 'LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR'] as ListingCondition[]).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCondition(c)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                      condition === c
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {c.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Photos (100% Functional Real Upload) */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Product Photos ({images.length} / 8)
                </h3>
                <p className="text-xs text-slate-500">
                  Upload real product photos. Clear photos sell 4x faster on the buyer marketplace!
                </p>
              </div>

              {/* Sample Pack button */}
              <button
                type="button"
                onClick={handleApplySamplePack}
                className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply {category} Sample Photos</span>
              </button>
            </div>

            {/* Action Bar: Choose File, Take Camera Photo, Paste URL */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingPhotos}
                className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Upload From Files / Gallery</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isProcessingPhotos}
                className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo with Camera</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
              >
                <LinkIcon className="w-4 h-4 text-blue-500" />
                <span>Paste Image URL</span>
              </button>
            </div>

            {/* URL input bar (collapsible) */}
            {showUrlInput && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <input
                  type="url"
                  placeholder="Paste direct image link (https://...jpg, png)"
                  value={imageUrlInput}
                  onChange={e => setImageUrlInput(e.target.value)}
                  className="flex-1 py-2 px-3 bg-white dark:bg-slate-900 rounded-xl text-xs border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Add
                </button>
              </div>
            )}

            {/* Drag and Drop Zone */}
            <div
              onDragOver={e => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {isProcessingPhotos ? (
                <div className="flex flex-col items-center justify-center py-2 text-blue-600">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <span className="text-xs font-bold">Compressing &amp; Optimizing Photos...</span>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Drag and drop photos here, or click to browse files
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supports JPG, PNG, WEBP &bull; Auto-optimized for instant mobile loading
                  </p>
                </>
              )}
            </div>

            {/* Uploaded Gallery Thumbnails */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 group shadow-sm bg-slate-950"
                  >
                    <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                    
                    {/* Cover badge */}
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                      {idx === 0 ? (
                        <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-sm">
                          COVER PHOTO
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetCoverPhoto(idx)}
                          className="bg-black/75 hover:bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm transition-colors cursor-pointer"
                        >
                          Make Cover
                        </button>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-transform hover:scale-110 cursor-pointer"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Price */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Set Your Selling Price
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
                    placeholder="145000"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl text-lg font-black text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
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
                    placeholder="230000"
                    value={originalPrice}
                    onChange={e => setOriginalPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {price && originalPrice && Number(originalPrice) > Number(price) && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-between border border-blue-200 dark:border-blue-800">
                <span>Buyer Discount Display:</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[11px]">
                  {Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)}% OFF MRP
                </span>
              </div>
            )}

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="text-xs text-slate-700 dark:text-slate-300">
                <strong>100% Escrow Protection:</strong> When a buyer pays, money is deposited in escrow and released directly to your UPI upon doorstep delivery.
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
              Where will the Porter driver or buyer meet to collect this consignment?
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
              Enable automated vehicle recommendations and instant shipping quotes for buyers.
            </p>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  Allow Porter On-Demand Delivery
                </h4>
                <p className="text-[11px] text-slate-500">
                  Buyers can click &quot;Deliver&quot; to summon a mini truck or bike courier.
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

            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <Truck className="w-4 h-4 flex-shrink-0" />
              <span>
                Based on {weightKg} kg, Portex matches buyers with a{' '}
                <strong>
                  {weightKg <= 20
                    ? '2-Wheeler Bike Express'
                    : weightKg <= 400
                    ? '3-Wheeler Auto'
                    : 'Tata Ace (Chota Hathi) Mini Truck'}
                </strong>.
              </span>
            </div>
          </div>
        )}

        {/* Step 7: Preview */}
        {step === 7 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Live Preview (Buyer View)
              </h3>
              <p className="text-xs text-slate-500">
                This is exactly how your listing will appear to buyers across Lucknow!
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md flex flex-col sm:flex-row gap-5">
              <img
                src={images[0]}
                alt="preview"
                className="w-full sm:w-56 h-40 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                    {condition.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-slate-400">&bull; {subCategory}</span>
                </div>
                <h4 className="font-black text-base text-slate-900 dark:text-white">
                  {title || 'Apple MacBook Pro 16-inch M2 Pro'}
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                    ₹{Number(price || 145000).toLocaleString('en-IN')}
                  </span>
                  {originalPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{Number(originalPrice).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>{address}, {city}</span>
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Porter On-Demand Delivery Eligible ({weightKg} kg)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 8: Publish & Success Screen */}
        {step === 8 && (
          <div className="text-center py-6 space-y-5 animate-in fade-in">
            {publishedListingId ? (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Product is LIVE on Marketplace! 🚀
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Your product is now published and visible to buyers across the city. Verified buyers can make offers or book Porter delivery right now.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setUserRole('BUYER');
                      router.push(`/listings/${publishedListingId}`);
                      if (onClose) onClose();
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View on Buyer Site (Live Product)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserRole('BUYER');
                      router.push('/marketplace');
                      if (onClose) onClose();
                    }}
                    className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Browse All Buyer Marketplace</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserRole('SELLER');
                      router.push('/dashboard?tab=listings');
                      if (onClose) onClose();
                    }}
                    className="w-full sm:w-auto px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 cursor-pointer"
                  >
                    <span>Manage in Seller Studio</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center mx-auto">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Ready to Publish on Portex
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Click below to publish your item. It will immediately appear on the buyer site, search results, and category feeds.
                </p>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-500/25 transition-all hover:scale-105 cursor-pointer"
                >
                  {isPublishing ? 'Publishing Product...' : 'Publish Product to Marketplace 🚀'}
                </button>
              </div>
            )}
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
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
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
