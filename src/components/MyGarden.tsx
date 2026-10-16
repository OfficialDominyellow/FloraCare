import React, { useState } from 'react';
import { SavedPlant } from '../types';
import {
  Droplets,
  Calendar,
  MapPin,
  Trash2,
  ExternalLink,
  Plus,
  Sparkles,
  Heart,
  CheckCircle,
  AlertCircle,
  Sun,
  Thermometer,
} from 'lucide-react';

interface MyGardenProps {
  plants: SavedPlant[];
  onWaterPlant: (id: string) => void;
  onDeletePlant: (id: string) => void;
  onSelectPlant: (plant: SavedPlant) => void;
  onGoToIdentify: () => void;
}

export const MyGarden: React.FC<MyGardenProps> = ({
  plants,
  onWaterPlant,
  onDeletePlant,
  onSelectPlant,
  onGoToIdentify,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [wateredToastId, setWateredToastId] = useState<string | null>(null);

  // Extract unique locations
  const locations = ['all', ...Array.from(new Set(plants.map((p) => p.location)))];

  const filteredPlants = selectedLocation === 'all'
    ? plants
    : plants.filter((p) => p.location === selectedLocation);

  // Calculate watering status
  const getWateringStatus = (plant: SavedPlant) => {
    const frequencyDays = plant.plantData.careGuide?.watering?.frequencyDaysSummer || 7;
    const lastWatered = new Date(plant.lastWateredDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastWatered.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysLeft = frequencyDays - diffDays;

    if (daysLeft <= 0) {
      return {
        isDue: true,
        label: '오늘 물 줄 날이에요!',
        color: 'text-amber-700 bg-amber-100 border-amber-300',
        badge: '물주기 필요 💧',
      };
    } else if (daysLeft === 1) {
      return {
        isDue: false,
        label: '내일 물 줄 예정',
        color: 'text-sky-700 bg-sky-100 border-sky-300',
        badge: 'D-1',
      };
    } else {
      return {
        isDue: false,
        label: `${daysLeft}일 후 물주기`,
        color: 'text-emerald-700 bg-emerald-100 border-emerald-300',
        badge: `D-${daysLeft}`,
      };
    }
  };

  const handleWaterClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onWaterPlant(id);
    setWateredToastId(id);
    setTimeout(() => setWateredToastId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-emerald-600 fill-emerald-600/20" />
            내 반려식물 정원
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            등록된 식물의 물주기 일정과 건강을 한눈에 관리하세요. (총 {plants.length}그루)
          </p>
        </div>

        <button
          onClick={onGoToIdentify}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          새 식물 등록하기
        </button>
      </div>

      {/* Location Filter Chips */}
      {plants.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedLocation === loc
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {loc === 'all' ? '전체 보기' : loc}
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {plants.length === 0 && (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200 shadow-xs max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Droplets className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-1">
            아직 등록된 식물이 없습니다
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mb-6 max-w-sm mx-auto">
            식물 사진을 업로드하여 종류를 분석하고 ‘내 정원에 등록하기’를 누르면
            맞춤 물주기 알림을 받을 수 있습니다.
          </p>
          <button
            onClick={onGoToIdentify}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
          >
            식물 사진 분석하러 가기
          </button>
        </div>
      )}

      {/* Plants Grid */}
      {filteredPlants.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlants.map((plant) => {
            const status = getWateringStatus(plant);
            const isToast = wateredToastId === plant.id;

            return (
              <div
                key={plant.id}
                onClick={() => onSelectPlant(plant)}
                className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col group relative"
              >
                {/* Photo Header */}
                <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                  <img
                    src={plant.imageUrl}
                    alt={plant.nickname}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm ${status.color}`}
                    >
                      {status.badge}
                    </span>
                  </div>

                  {/* Location badge */}
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {plant.location}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="font-extrabold text-stone-900 text-lg group-hover:text-emerald-700 transition-colors">
                          {plant.nickname}
                        </h3>
                        <p className="text-xs text-stone-500">
                          {plant.plantData.commonNameKo} ({plant.plantData.scientificName})
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`'${plant.nickname}' 식물을 내 정원에서 삭제하시겠습니까?`)) {
                            onDeletePlant(plant.id);
                          }
                        }}
                        className="text-stone-400 hover:text-rose-500 p-1 rounded-lg hover:bg-stone-100 transition-colors"
                        title="식물 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick care stats */}
                    <div className="grid grid-cols-2 gap-2 my-3 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <div className="flex items-center gap-1.5 truncate">
                        <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{plant.plantData.careGuide?.light?.level || '반양지'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Thermometer className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{plant.plantData.careGuide?.temperature?.idealRange || '18~25°C'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Watering Action Button */}
                  <div className="pt-3 border-t border-stone-100">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs">
                        <p className="font-semibold text-stone-700">{status.label}</p>
                        <p className="text-[11px] text-stone-400">
                          마지막: {new Date(plant.lastWateredDate).toLocaleDateString('ko-KR')}
                        </p>
                      </div>

                      <button
                        onClick={(e) => handleWaterClick(plant.id, e)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                          isToast
                            ? 'bg-emerald-600 text-white'
                            : status.isDue
                            ? 'bg-sky-500 hover:bg-sky-400 text-white shadow-sm'
                            : 'bg-stone-100 hover:bg-sky-50 text-sky-700 border border-sky-200'
                        }`}
                      >
                        <Droplets className="w-3.5 h-3.5" />
                        <span>{isToast ? '물 줬어요! ✨' : '물 줬어요'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
