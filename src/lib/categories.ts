import { PromptData } from '@/types';

const CATEGORY_KEYWORDS = {
  人像: ['portrait', 'person', 'face', 'human', 'people', 'character', '人像', '人物', '肖像'],
  风景: ['landscape', 'nature', 'mountain', 'sea', 'forest', 'sky', '风景', '自然', '山', '海'],
  室内: ['interior', 'room', 'indoor', 'house', 'home', '室内', '房间', '屋内'],
  动物: ['animal', 'pet', 'dog', 'cat', 'bird', '动物', '宠物', '狗', '猫'],
  建筑: ['architecture', 'building', 'structure', 'construction', '建筑', '房屋', '楼'],
  艺术: ['art', 'artistic', 'painting', 'drawing', '艺术', '绘画', '画'],
  抽象: ['abstract', 'surreal', 'conceptual', '抽象', '概念'],
  现代: ['modern', 'contemporary', 'futuristic', '现代', '当代', '未来'],
  复古: ['vintage', 'retro', 'classic', 'old', '复古', '怀旧', '经典'],
  夜景: ['night', 'evening', 'dark', 'moonlight', '夜晚', '夜景', '夜'],
};

export function extractCategories(prompt: string, title: string): string[] {
  const text = `${prompt.toLowerCase()} ${title.toLowerCase()}`;
  const categories = new Set<string>();
  
  Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
    if (keywords.some((keyword) => text.includes(keyword))) {
      categories.add(category);
    }
  });
  
  return Array.from(categories);
}