import { useState, useEffect } from 'react';
import { User } from '../contexts/AuthContext';

interface GeolocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  region: string;
  timezone: string;
  weather?: {
    temperature: number;
    condition: string;
    humidity: number;
    uvIndex: number;
  };
}

interface ClothingRecommendation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  reason: string;
  styleMatch: number; // Percentage
  category: 'tops' | 'bottoms' | 'outerwear' | 'dresses' | 'accessories';
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  supplier?: string;
  localAvailability?: string;
  seasonalNote?: string;
}

interface HairRecommendation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  reason: string;
  matchScore: number; // Percentage
  difficulty: 'easy' | 'medium' | 'hard';
  timeRequired: string;
  supplier?: string;
  localAvailability?: string;
  seasonalNote?: string;
}

interface MakeupRecommendation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  reason: string;
  matchScore: number; // Percentage
  occasion: 'everyday' | 'work' | 'evening' | 'special';
  products: string[];
  supplier?: string;
  localAvailability?: string;
  seasonalNote?: string;
}

interface JewelryRecommendation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  reason: string;
  matchScore: number; // Percentage
  type: 'earrings' | 'necklace' | 'bracelet' | 'ring' | 'watch';
  metal: 'gold' | 'silver' | 'rose-gold' | 'mixed';
  supplier?: string;
  localAvailability?: string;
  seasonalNote?: string;
}

interface NailRecommendation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  reason: string;
  matchScore: number; // Percentage
  length: 'short' | 'medium' | 'long';
  finish: 'matte' | 'glossy' | 'shimmer';
  maintenance: 'low' | 'medium' | 'high';
  supplier?: string;
  localAvailability?: string;
  seasonalNote?: string;
}

interface MaiStyleRecommendations {
  clothing: ClothingRecommendation[];
  hair: HairRecommendation[];
  makeup: MakeupRecommendation[];
  jewelry: JewelryRecommendation[];
  nails: NailRecommendation[];
}

// Helper function to filter and prioritize recommendations based on preferred suppliers
const filterByPreferredSuppliers = <T extends { supplier?: string }>(
  items: T[],
  preferredSuppliers: string[]
): T[] => {
  if (preferredSuppliers.length === 0) return items;
  
  // Prioritize items from preferred suppliers
  const preferred = items.filter(item => 
    item.supplier && preferredSuppliers.some(supplier => 
      supplier.toLowerCase().includes(item.supplier!.toLowerCase()) ||
      item.supplier!.toLowerCase().includes(supplier.toLowerCase())
    )
  );
  
  // Add non-preferred items if we need more recommendations
  const nonPreferred = items.filter(item => 
    !item.supplier || !preferredSuppliers.some(supplier => 
      supplier.toLowerCase().includes(item.supplier!.toLowerCase()) ||
      item.supplier!.toLowerCase().includes(supplier.toLowerCase())
    )
  );
  
  return [...preferred, ...nonPreferred];
};

// Helper function to get seasonal clothing recommendations
const getSeasonalClothingRecommendations = (season: string, location?: GeolocationData): ClothingRecommendation[] => {
  const seasonalItems: ClothingRecommendation[] = [];
  
  switch (season) {
    case 'spring':
      seasonalItems.push(
        {
          id: 'spring_1',
          name: 'Light Trench Coat',
          description: 'Perfect transitional piece for unpredictable spring weather.',
          imageUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
          reason: location?.weather?.condition === 'rainy' ? 'Essential for current rainy conditions in your area.' : 'Ideal for spring\'s changing temperatures and occasional rain.',
          styleMatch: 88,
          category: 'outerwear',
          season: 'spring',
          supplier: 'Zara',
          seasonalNote: location ? `Perfect for ${location.city}'s spring weather` : 'Perfect for spring layering'
        },
        {
          id: 'spring_2',
          name: 'Pastel Silk Blouse',
          description: 'Soft colors that capture the essence of spring renewal.',
          imageUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
          reason: 'Light fabrics and fresh colors perfect for the season.',
          styleMatch: 85,
          category: 'tops',
          season: 'spring',
          supplier: 'COS',
          seasonalNote: 'Spring\'s signature soft palette'
        }
      );
      break;
      
    case 'summer':
      seasonalItems.push(
        {
          id: 'summer_1',
          name: 'Linen Wide-Leg Trousers',
          description: 'Breathable and comfortable for hot summer days.',
          imageUrl: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
          reason: location?.weather?.temperature && location.weather.temperature > 25 ? 'Essential for the current high temperatures in your area.' : 'Natural fibers keep you cool in summer heat.',
          styleMatch: 92,
          category: 'bottoms',
          season: 'summer',
          supplier: 'Arket',
          seasonalNote: location?.weather?.temperature && location.weather.temperature > 25 ? `Perfect for ${location.city}'s ${location.weather.temperature}°C weather` : 'Essential for summer comfort'
        },
        {
          id: 'summer_2',
          name: 'UV Protection Maxi Dress',
          description: 'Stylish sun protection with built-in UPF.',
          imageUrl: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
          reason: location?.weather?.uvIndex && location.weather.uvIndex > 6 ? 'Critical for current high UV levels in your area.' : 'Combines style with essential sun protection.',
          styleMatch: 87,
          category: 'dresses',
          season: 'summer',
          supplier: 'Uniqlo',
          seasonalNote: location?.weather?.uvIndex ? `UV protection for ${location.city}'s UV index ${location.weather.uvIndex}` : 'Smart summer protection'
        }
      );
      break;
      
    case 'autumn':
      seasonalItems.push(
        {
          id: 'autumn_1',
          name: 'Wool Blend Cardigan',
          description: 'Cozy layering piece in rich autumn tones.',
          imageUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
          reason: location?.weather?.temperature && location.weather.temperature < 15 ? 'Essential for the dropping temperatures in your area.' : 'Perfect for autumn\'s cooler temperatures and layering needs.',
          styleMatch: 90,
          category: 'tops',
          season: 'autumn',
          supplier: 'Whistles',
          seasonalNote: location ? `Perfect for ${location.city}'s autumn weather` : 'Autumn layering essential'
        },
        {
          id: 'autumn_2',
          name: 'Leather Ankle Boots',
          description: 'Versatile footwear for autumn\'s changing weather.',
          imageUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
          reason: 'Durable and stylish for autumn activities.',
          styleMatch: 86,
          category: 'accessories',
          season: 'autumn',
          supplier: 'Russell & Bromley',
          seasonalNote: 'Autumn wardrobe staple'
        }
      );
      break;
      
    case 'winter':
      seasonalItems.push(
        {
          id: 'winter_1',
          name: 'Cashmere Turtleneck',
          description: 'Luxurious warmth for cold winter days.',
          imageUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
          reason: location?.weather?.temperature && location.weather.temperature < 5 ? 'Essential luxury warmth for current freezing conditions.' : 'Premium insulation with sophisticated style.',
          styleMatch: 94,
          category: 'tops',
          season: 'winter',
          supplier: 'John Smedley',
          seasonalNote: location?.weather?.temperature && location.weather.temperature < 0 ? `Critical warmth for ${location.city}'s freezing weather` : 'Winter luxury essential'
        },
        {
          id: 'winter_2',
          name: 'Down Puffer Coat',
          description: 'Maximum warmth without bulk.',
          imageUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
          reason: location?.weather?.temperature && location.weather.temperature < 0 ? 'Critical protection against current sub-zero temperatures.' : 'Essential protection against winter cold.',
          styleMatch: 89,
          category: 'outerwear',
          season: 'winter',
          supplier: 'Canada Goose',
          seasonalNote: location?.weather?.temperature ? `Essential for ${location.city}'s ${location.weather.temperature}°C weather` : 'Winter weather protection'
        }
      );
      break;
  }
  
  // Add location-specific availability
  if (location) {
    seasonalItems.forEach(item => {
      item.localAvailability = `Available in ${location.city} stores and online`;
    });
  }
  
  return seasonalItems;
};

const defaultRecommendations: MaiStyleRecommendations = {
  clothing: [
    {
      id: 'c1',
      name: 'Classic White Button-Down',
      description: 'A versatile wardrobe staple that works for any occasion.',
      imageUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Essential piece that enhances a professional and timeless aesthetic.',
      styleMatch: 85,
      category: 'tops',
      season: 'all',
      supplier: 'John Lewis'
    },
    {
      id: 'c2',
      name: 'High-Waisted Dark Jeans',
      description: 'Flattering fit that pairs well with any top.',
      imageUrl: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Combines comfort with casual elegance and flatters most body types.',
      styleMatch: 78,
      category: 'bottoms',
      season: 'all',
      supplier: 'ASOS'
    },
  ],
  hair: [
    {
      id: 'h1',
      name: 'Soft Beach Waves',
      description: 'Effortless and elegant, suitable for most face shapes.',
      imageUrl: 'https://images.pexels.com/photos/1577920/pexels-photo-1577920.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Adds volume and a natural, flowing look that enhances facial features.',
      matchScore: 90,
      difficulty: 'easy',
      timeRequired: '15 minutes',
      supplier: 'Local Hair Salon'
    },
    {
      id: 'h2',
      name: 'Sleek Low Ponytail',
      description: 'A chic and practical style for any occasion.',
      imageUrl: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Highlights facial features and offers a clean, professional aesthetic.',
      matchScore: 82,
      difficulty: 'easy',
      timeRequired: '5 minutes',
      supplier: 'DIY'
    },
  ],
  makeup: [
    {
      id: 'm1',
      name: 'Natural Everyday Glow',
      description: 'Enhances your features with a subtle, radiant finish.',
      imageUrl: 'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Perfect for everyday wear, emphasizing natural beauty.',
      matchScore: 88,
      occasion: 'everyday',
      products: ['Tinted moisturizer', 'Cream blush', 'Clear lip gloss'],
      supplier: 'Sephora'
    },
    {
      id: 'm2',
      name: 'Smoky Eye Evening Look',
      description: 'A dramatic look for evening events and special occasions.',
      imageUrl: 'https://images.pexels.com/photos/3373714/pexels-photo-3373714.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Adds intensity and sophistication for special occasions.',
      matchScore: 75,
      occasion: 'evening',
      products: ['Eyeshadow palette', 'Eyeliner', 'Mascara', 'Bold lipstick'],
      supplier: 'Charlotte Tilbury'
    },
  ],
  jewelry: [
    {
      id: 'j1',
      name: 'Delicate Gold Chain',
      description: 'A subtle accessory that complements any outfit.',
      imageUrl: 'https://images.pexels.com/photos/1453005/pexels-photo-1453005.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Adds a touch of elegance without overpowering your look.',
      matchScore: 80,
      type: 'necklace',
      metal: 'gold',
      supplier: 'Pandora'
    },
    {
      id: 'j2',
      name: 'Pearl Stud Earrings',
      description: 'Classic and timeless, perfect for any occasion.',
      imageUrl: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Versatile and sophisticated, suitable for both casual and formal settings.',
      matchScore: 85,
      type: 'earrings',
      metal: 'silver',
      supplier: 'Tiffany & Co'
    },
  ],
  nails: [
    {
      id: 'n1',
      name: 'Classic Nude Manicure',
      description: 'Clean, classic, and always in style.',
      imageUrl: 'https://images.pexels.com/photos/3997387/pexels-photo-3997387.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Versatile and professional, suitable for all settings.',
      matchScore: 92,
      length: 'short',
      finish: 'glossy',
      maintenance: 'low',
      supplier: 'Local Nail Salon'
    },
    {
      id: 'n2',
      name: 'French Manicure',
      description: 'A timeless and elegant nail design.',
      imageUrl: 'https://images.pexels.com/photos/3997390/pexels-photo-3997390.jpeg?auto=compress&cs=tinysrgb&w=400',
      reason: 'Sophisticated and polished, ideal for any event.',
      matchScore: 85,
      length: 'medium',
      finish: 'glossy',
      maintenance: 'medium',
      supplier: 'Local Nail Salon'
    },
  ],
};

export const useMaiStyleRecommendations = (
  userProfile: User['profileData'] | undefined,
  location?: GeolocationData | null,
  currentSeason?: string,
  preferredSuppliers: string[] = []
) => {
  const [recommendations, setRecommendations] = useState<MaiStyleRecommendations>(defaultRecommendations);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile && userProfile.styleData) {
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const { stylePreference, colorPalette, bodyType, hairType, skinTone, budget, lifestyle } = userProfile.styleData;

        const newRecommendations: MaiStyleRecommendations = {
          clothing: [],
          hair: [],
          makeup: [],
          jewelry: [],
          nails: [],
        };

        // --- Clothing Recommendations Based on Style Preference ---
        if (stylePreference === 'minimalist') {
          const { budget, lifestyle } = userProfile.styleData;
          const isHighBudget = budget === 'over-2000';
          const isProfessional = lifestyle === 'professional' || lifestyle === 'professional-casual';
          
          newRecommendations.clothing.push(
            {
              id: 'c_min1',
              name: isHighBudget ? 'Designer Tailored Black Trousers' : 'Tailored Black Trousers',
              description: isHighBudget ? 'Premium fabric with impeccable tailoring for a luxury minimalist look.' : 'Clean lines and perfect fit for a sleek silhouette.',
              imageUrl: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
              reason: isProfessional ? 'Perfect for your professional lifestyle while maintaining minimalist principles.' : 'Aligns with minimalist aesthetic, focusing on quality and simplicity.',
              styleMatch: isProfessional ? 98 : 92,
              category: 'bottoms',
              season: 'all',
              supplier: isHighBudget ? 'The Row' : 'COS'
            },
            {
              id: 'c_min2',
              name: isHighBudget ? 'Pure Cashmere Turtleneck' : 'Cashmere Blend Turtleneck',
              description: isHighBudget ? 'Finest cashmere for ultimate luxury and comfort.' : 'Luxurious and understated, perfect for layering.',
              imageUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
              reason: 'High-quality basics are the foundation of minimalist style.',
              styleMatch: 92,
              category: 'tops',
              season: 'autumn',
              supplier: 'Arket'
            }
          );
        } else if (stylePreference === 'bohemian') {
          newRecommendations.clothing.push(
            {
              id: 'c_boh1',
              name: 'Flowy Maxi Dress',
              description: 'Comfortable and free-spirited with beautiful prints.',
              imageUrl: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
              reason: 'Embraces the bohemian style with natural fabrics and relaxed silhouettes.',
              styleMatch: 90,
              category: 'dresses',
              season: 'summer',
              supplier: 'Free People'
            },
            {
              id: 'c_boh2',
              name: 'Embroidered Kimono',
              description: 'Perfect layering piece with artistic details.',
              imageUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
              reason: 'Adds texture and visual interest typical of bohemian style.',
              styleMatch: 88,
              category: 'outerwear',
              season: 'spring',
              supplier: 'Anthropologie'
            }
          );
        } else if (stylePreference === 'classic' || stylePreference === 'classic-modern') {
          newRecommendations.clothing.push(
            {
              id: 'c_cla1',
              name: 'Navy Blazer',
              description: 'Timeless piece that elevates any outfit.',
              imageUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
              reason: 'Essential for classic style, versatile and always appropriate.',
              styleMatch: 94,
              category: 'outerwear',
              season: 'all',
              supplier: 'Reiss'
            },
            {
              id: 'c_cla2',
              name: 'Pencil Skirt',
              description: 'Flattering silhouette perfect for professional settings.',
              imageUrl: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
              reason: 'Classic piece that creates an elegant, polished look.',
              styleMatch: 91,
              category: 'bottoms',
              season: 'all',
              supplier: 'Whistles'
            }
          );
        } else {
          newRecommendations.clothing.push(...defaultRecommendations.clothing);
        }

        // Add seasonal clothing recommendations
        if (currentSeason) {
          const seasonalClothing = getSeasonalClothingRecommendations(currentSeason, location || undefined);
          newRecommendations.clothing.push(...seasonalClothing);
        }

        // Enhanced color palette specific clothing
        if (colorPalette === 'cool-tones') {
          const { skinTone, lifestyle } = userProfile.styleData;
          const isCoolUndertones = skinTone === 'cool-undertones';
          
          newRecommendations.clothing.push({
            id: 'c_cool1',
            name: isCoolUndertones ? 'Sapphire Blue Silk Blouse' : 'Cool-Toned Silk Blouse',
            description: isCoolUndertones ? 'Perfect match for your cool undertones in luxurious silk.' : 'Luxurious fabric in a flattering cool tone.',
            imageUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
            reason: isCoolUndertones ? 'Perfectly matched to your skin tone for maximum color harmony.' : 'Complements cool undertones, enhancing natural complexion.',
            styleMatch: isCoolUndertones ? 95 : 85,
            category: 'tops',
            season: 'all',
            supplier: 'Ganni'
          });
        } else if (colorPalette === 'warm-tones') {
          const { skinTone, lifestyle } = userProfile.styleData;
          const isWarmUndertones = skinTone === 'warm-undertones';
          
          newRecommendations.clothing.push({
            id: 'c_warm1',
            name: isWarmUndertones ? 'Terracotta Wrap Dress' : 'Warm-Toned Wrap Dress',
            description: isWarmUndertones ? 'Perfect harmony with your warm undertones in a flattering wrap style.' : 'Warm, earthy tone that flatters warm undertones.',
            imageUrl: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
            reason: isWarmUndertones ? 'Enhances your natural warm undertones for a radiant, healthy glow.' : 'Enhances warm undertones and creates a radiant glow.',
            styleMatch: isWarmUndertones ? 94 : 86,
            category: 'dresses',
            season: 'autumn',
            supplier: 'Mango'
          });
        }

        // --- Hair Recommendations Based on Hair Type and Face Shape ---
        if (hairType === 'fine-straight') {
          const { lifestyle, budget } = userProfile.styleData;
          const isLowMaintenance = lifestyle === 'active' || lifestyle === 'casual';
          
          newRecommendations.hair.push(
            {
              id: 'h_fine1',
              name: isLowMaintenance ? 'Low-Maintenance Layered Bob' : 'Layered Bob with Bangs',
              description: isLowMaintenance ? 'Easy-care cut that adds volume with minimal styling required.' : 'Adds volume and movement to fine, straight hair.',
              imageUrl: 'https://images.pexels.com/photos/1577920/pexels-photo-1577920.jpeg?auto=compress&cs=tinysrgb&w=400',
              reason: isLowMaintenance ? 'Perfect for your active lifestyle while maximizing your hair\'s natural volume.' : 'Creates the illusion of fullness and frames the face beautifully.',
              matchScore: isLowMaintenance ? 95 : 88,
              difficulty: isLowMaintenance ? 'easy' : 'medium',
              timeRequired: isLowMaintenance ? '10 minutes' : '20 minutes',
              supplier: location ? `Hair salons in ${location.city}` : 'Local Hair Salon',
              seasonalNote: currentSeason === 'summer' ? 'Perfect for summer - easy to style in heat' : currentSeason === 'winter' ? 'Great for winter - adds warmth around face' : undefined
            },
            {
              id: 'h_fine2',
              name: 'Textured Pixie Cut',
              description: 'Modern and low-maintenance for fine hair.',
              imageUrl: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400',
              reason: 'Maximizes volume and creates a chic, contemporary look.',
              matchScore: 85,
              difficulty: 'easy',
              timeRequired: '10 minutes',
              supplier: location ? `Hair salons in ${location.city}` : 'Local Hair Salon'
            }
          );
        } else if (hairType === 'thick-curly' || hairType === 'thick-wavy') {
          const { lifestyle, budget } = userProfile.styleData;
          const isHighMaintenance = budget === 'over-2000';
          
          newRecommendations.hair.push(
            {
              id: 'h_thick1',
              name: isHighMaintenance ? 'Professional Curl Enhancement Treatment' : 'Long Layered Curls',
              description: isHighMaintenance ? 'Salon treatment to enhance and define your natural curl pattern with professional products.' : 'Enhances natural curl pattern with strategic layers.',
              imageUrl: 'https://images.pexels.com/photos/1577920/pexels-photo-1577920.jpeg?auto=compress&cs=tinysrgb&w=400',
              reason: isHighMaintenance ? 'Professional treatment will maximize your curl potential with salon-quality results.' : 'Works with your natural texture to create beautiful, defined curls.',
              matchScore: isHighMaintenance ? 97 : 91,
              difficulty: isHighMaintenance ? 'easy' : 'medium',
              timeRequired: isHighMaintenance ? '15 minutes with treatment' : '25 minutes',
              supplier: location ? `Curl specialists in ${location.city}` : 'Curl Specialist Salon',
              seasonalNote: currentSeason === 'winter' ? 'Great for winter - natural volume keeps you warm' : currentSeason === 'summer' ? 'Embrace natural texture in humid weather' : undefined
            }
          );
        } else {
          newRecommendations.hair.push(...defaultRecommendations.hair);
        }

        // --- Makeup Recommendations Based on Skin Tone and Lifestyle ---
        if (skinTone === 'cool-undertones') {
          const { lifestyle, budget } = userProfile.styleData;
          const isProfessional = lifestyle === 'professional' || lifestyle === 'professional-casual';
          
          newRecommendations.makeup.push(
            {
              id: 'm_cool1',
              name: isProfessional ? 'Professional Cool-Toned Look' : 'Berry Lip and Rosy Cheeks',
              description: isProfessional ? 'Sophisticated cool tones perfect for professional settings.' : 'Cool-toned colors that complement your complexion.',
              imageUrl: 'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=400',
              reason: isProfessional ? 'Cool tones enhance your complexion while maintaining professional appropriateness.' : 'Enhances the natural coolness of your complexion.',
              matchScore: isProfessional ? 92 : 84,
              occasion: isProfessional ? 'work' : 'everyday',
              products: isProfessional ? ['Neutral berry lip', 'Subtle pink blush', 'Taupe eyeshadow'] : ['Berry lipstick', 'Pink blush', 'Cool-toned eyeshadow'],
              supplier: 'Charlotte Tilbury',
              seasonalNote: currentSeason === 'winter' ? 'Perfect winter berry tones' : currentSeason === 'spring' ? 'Fresh spring colors' : undefined
            },
            {
              id: 'm_cool2',
              name: 'Silver Smoky Eye',
              description: 'Dramatic evening look with cool metallic tones.',
              imageUrl: 'https://images.pexels.com/photos/3373714/pexels-photo-3373714.jpeg?auto=compress&cs=tinysrgb&w=400',
              reason: 'Silver tones complement cool undertones beautifully.',
              matchScore: 83,
              occasion: 'evening',
              products: ['Silver eyeshadow', 'Black eyeliner', 'Cool-toned lipstick'],
              supplier: 'Urban Decay'
            }
          );
        } else if (skinTone === 'warm-undertones') {
          const { lifestyle, budget } = userProfile.styleData;
          const isActive = lifestyle === 'active';
          
          newRecommendations.makeup.push(
            {
              id: 'm_warm1',
              name: isActive ? 'Natural Warm Glow' : 'Golden Glow Look',
              description: isActive ? 'Long-wearing warm tones perfect for active lifestyles.' : 'Warm, bronzed look that enhances your natural radiance.',
              imageUrl: 'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=400',
              reason: isActive ? 'Sweat-resistant warm tones that complement your active lifestyle.' : 'Warm tones complement your undertones perfectly.',
              matchScore: isActive ? 93 : 87,
              occasion: 'everyday',
              products: isActive ? ['Waterproof bronze eyeshadow', 'Cream peach blush', 'Tinted lip balm'] : ['Bronze eyeshadow', 'Peach blush', 'Coral lipstick'],
              supplier: 'Fenty Beauty',
              seasonalNote: currentSeason === 'summer' ? 'Perfect for summer glow' : currentSeason === 'autumn' ? 'Warm autumn radiance' : undefined
            }
          );
        } else {
          newRecommendations.makeup.push(...defaultRecommendations.makeup);
        }

        // --- Jewelry Recommendations Based on Style and Metal Preference ---
        if (stylePreference === 'minimalist') {
          newRecommendations.jewelry.push(
            {
              id: 'j_min1',
              name: 'Geometric Stud Earrings',
              description: 'Simple, modern, and understated.',
              imageUrl: 'https://images.pexels.com/photos/1453005/pexels-photo-1453005.jpeg?auto=compress&cs=tinysrgb&w=400',
              reason: 'Complements a minimalist wardrobe with clean lines.',
              matchScore: 90,
              type: 'earrings',
              metal: 'silver',
              supplier: 'Monica Vinader'
            },
            {
              id: 'j_min2',
              name: 'Thin Band Ring',
              description: 'Delicate and refined, perfect for stacking.',
              imageUrl: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400',
              reason: 'Subtle elegance that doesn\'t compete with your outfit.',
              matchScore: 88,
              type: 'ring',
              metal: 'gold',
              supplier: isHighBudget ? 'Brunello Cucinelli' : 'Arket'
            }
          );
        } else if (stylePreference === 'bohemian') {
          const { budget, lifestyle } = userProfile.styleData;
          const isCreativeLifestyle = lifestyle === 'creative';
          const lovesTravel = userProfile.interests?.includes('Travel');
          
          newRecommendations.jewelry.push(
            {
              id: 'j_boh1',
              name: 'Layered Pendant Necklaces',
              description: 'Mixed metals and natural stones for an earthy feel.',
              imageUrl: 'https://images.pexels.com/photos/1453005/pexels-photo-1453005.jpeg?auto=compress&cs=tinysrgb&w=400',
              reason: 'Adds a relaxed, artistic touch to bohemian outfits.',
              matchScore: 88,
              type: 'necklace',
              metal: 'mixed',
              supplier: 'Accessorize'
            }
          );
        } else {
          newRecommendations.jewelry.push(...defaultRecommendations.jewelry);
        }

        // --- Nail Recommendations Based on Style and Lifestyle ---
        if (stylePreference === 'edgy') {
          newRecommendations.nails.push(
            {
              id: 'n_edgy1',
              name: 'Matte Black Nails',
              name: lovesTravel ? 'Travel-Friendly Maxi Dress' : 'Flowy Maxi Dress',
              description: lovesTravel ? 'Wrinkle-resistant fabric perfect for travel adventures with bohemian flair.' : 'Comfortable and free-spirited with beautiful prints.',
              reason: 'Reflects a strong, unconventional style.',
              reason: isCreativeLifestyle ? 'Perfect for your creative lifestyle with artistic bohemian elements.' : 'Embraces the bohemian style with natural fabrics and relaxed silhouettes.',
              styleMatch: lovesTravel ? 94 : 87,
              finish: 'matte',
              maintenance: 'medium',
              supplier: lovesTravel ? 'Reformation' : 'Free People'
            },
            {
              id: 'n_edgy2',
              name: 'Geometric Nail Art',
              description: 'Modern patterns in contrasting colors.',
              imageUrl: 'https://images.pexels.com/photos/3997390/pexels-photo-3997390.jpeg?auto=compress&cs=tinysrgb&w=400',
              reason: 'Artistic expression that complements edgy fashion choices.',
              matchScore: 85,
              length: 'medium',
              finish: 'glossy',
              name: isCreativeLifestyle ? 'Artist-Designed Kimono' : 'Embroidered Kimono',
              description: isCreativeLifestyle ? 'Unique artistic piece that reflects your creative spirit.' : 'Perfect layering piece with artistic details.',
            }
              reason: isCreativeLifestyle ? 'Expresses your artistic nature while maintaining bohemian aesthetic.' : 'Adds texture and visual interest typical of bohemian style.',
              styleMatch: isCreativeLifestyle ? 93 : 85,
          newRecommendations.nails.push(
            {
              supplier: isCreativeLifestyle ? 'Local Artisan Markets' : 'Anthropologie'
              name: 'Soft Pink Ombre',
              description: 'Delicate gradient from clear to soft pink.',
              imageUrl: 'https://images.pexels.com/photos/3997387/pexels-photo-3997387.jpeg?auto=compress&cs=tinysrgb&w=400',
          const { budget, lifestyle } = userProfile.styleData;
          const isProfessional = lifestyle === 'professional' || lifestyle === 'professional-casual';
          const isHighBudget = budget === 'over-2000';
          
              reason: 'Enhances a romantic and gentle aesthetic.',
              matchScore: 87,
              length: 'medium',
              name: isHighBudget ? 'Savile Row Tailored Navy Blazer' : 'Navy Blazer',
              description: isHighBudget ? 'Bespoke tailoring with finest materials for the ultimate classic piece.' : 'Timeless piece that elevates any outfit.',
              supplier: location ? `Nail salons in ${location.city}` : 'Local Nail Salon',
              reason: isProfessional ? 'Essential for your professional wardrobe and classic style preference.' : 'Essential for classic style, versatile and always appropriate.',
              styleMatch: isProfessional ? 98 : 91,
          );
        } else if (lifestyle === 'professional-casual') {
              supplier: isHighBudget ? 'Huntsman Savile Row' : 'Reiss'
            {
              id: 'n_prof1',
              name: 'Neutral Gel Manicure',
              name: isProfessional ? 'Executive Pencil Skirt' : 'Classic Pencil Skirt',
              description: isProfessional ? 'Professional-grade tailoring designed for executive presence.' : 'Flattering silhouette perfect for professional settings.',
              reason: 'Perfect for professional settings while maintaining style.',
              reason: isProfessional ? 'Essential for your professional wardrobe with classic elegance.' : 'Classic piece that creates an elegant, polished look.',
              styleMatch: isProfessional ? 95 : 88,
              finish: 'glossy',
              maintenance: 'low',
              supplier: isProfessional ? 'Theory' : 'Whistles'
            }
          );
        } else {
          newRecommendations.nails.push(...defaultRecommendations.nails);
        }

        // Apply preferred supplier filtering to all categories
        newRecommendations.clothing = filterByPreferredSuppliers(newRecommendations.clothing, preferredSuppliers);
        newRecommendations.hair = filterByPreferredSuppliers(newRecommendations.hair, preferredSuppliers);
        newRecommendations.makeup = filterByPreferredSuppliers(newRecommendations.makeup, preferredSuppliers);
        newRecommendations.jewelry = filterByPreferredSuppliers(newRecommendations.jewelry, preferredSuppliers);
        newRecommendations.nails = filterByPreferredSuppliers(newRecommendations.nails, preferredSuppliers);

        // Add location-specific availability to all items
        if (location) {
          const addLocationInfo = (items: any[]) => {
            return items.map(item => ({
              ...item,
              localAvailability: item.localAvailability || `Available in ${location.city} and online`
            }));
          };

          newRecommendations.clothing = addLocationInfo(newRecommendations.clothing);
          newRecommendations.hair = addLocationInfo(newRecommendations.hair);
          newRecommendations.makeup = addLocationInfo(newRecommendations.makeup);
          newRecommendations.jewelry = addLocationInfo(newRecommendations.jewelry);
          newRecommendations.nails = addLocationInfo(newRecommendations.nails);
        }

        setRecommendations(newRecommendations);
        setLoading(false);
      }, 1000);
    } else {
      // Apply filtering to default recommendations
      const filteredDefaults = {
        clothing: filterByPreferredSuppliers(defaultRecommendations.clothing, preferredSuppliers),
        hair: filterByPreferredSuppliers(defaultRecommendations.hair, preferredSuppliers),
        makeup: filterByPreferredSuppliers(defaultRecommendations.makeup, preferredSuppliers),
        jewelry: filterByPreferredSuppliers(defaultRecommendations.jewelry, preferredSuppliers),
        nails: filterByPreferredSuppliers(defaultRecommendations.nails, preferredSuppliers),
      };
      
      setRecommendations(filteredDefaults);
    }
  }, [userProfile, location, currentSeason, preferredSuppliers]);

  return { recommendations, loading };
};