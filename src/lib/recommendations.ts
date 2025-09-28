import { PromptData } from '@/types';

/**
 * 获取推荐提示词列表
 * 
 * @param currentPrompt 当前正在查看的提示词
 * @param allPrompts 所有提示词数据
 * @param count 推荐数量，默认6个
 * @returns 推荐的提示词列表
 */
export function getRecommendations(
  currentPrompt: PromptData,
  allPrompts: PromptData[],
  count: number = 6
): PromptData[] {
  if (!allPrompts || allPrompts.length === 0) {
    return [];
  }

  // 排除当前提示词
  const availablePrompts = allPrompts.filter(prompt => prompt.id !== currentPrompt.id);
  
  if (availablePrompts.length === 0) {
    return [];
  }

  const recommendations: PromptData[] = [];
  const currentCategories = currentPrompt.categories || [];

  // 1. 首先推荐同分类的提示词
  if (currentCategories.length > 0) {
    const sameCategoryPrompts = availablePrompts.filter(prompt => {
      const promptCategories = prompt.categories || [];
      return promptCategories.some(category => currentCategories.includes(category));
    });

    // 按照相关度排序（共同类别数量）
    const sortedSameCategoryPrompts = sameCategoryPrompts.sort((a, b) => {
      const aCategoriesMatch = (a.categories || []).filter(cat => currentCategories.includes(cat)).length;
      const bCategoriesMatch = (b.categories || []).filter(cat => currentCategories.includes(cat)).length;
      return bCategoriesMatch - aCategoriesMatch;
    });

    // 添加同分类的提示词
    recommendations.push(...sortedSameCategoryPrompts.slice(0, count));
  }

  // 2. 如果同分类提示词不足，用其他提示词补充
  if (recommendations.length < count) {
    const remainingPrompts = availablePrompts.filter(prompt => 
      !recommendations.some(rec => rec.id === prompt.id)
    );

    // 随机打乱剩余提示词
    const shuffledRemaining = shuffleArray(remainingPrompts);
    const needed = count - recommendations.length;
    recommendations.push(...shuffledRemaining.slice(0, needed));
  }

  return recommendations.slice(0, count);
}

/**
 * 基于分类计算提示词的相关度分数
 * 
 * @param prompt1 第一个提示词
 * @param prompt2 第二个提示词
 * @returns 相关度分数（0-1）
 */
export function calculateRelevanceScore(prompt1: PromptData, prompt2: PromptData): number {
  const categories1 = prompt1.categories || [];
  const categories2 = prompt2.categories || [];

  if (categories1.length === 0 || categories2.length === 0) {
    return 0;
  }

  const commonCategories = categories1.filter(cat => categories2.includes(cat));
  const totalCategories = new Set([...categories1, ...categories2]).size;

  return commonCategories.length / totalCategories;
}

/**
 * 获取指定分类的热门提示词
 * 
 * @param category 分类名称
 * @param allPrompts 所有提示词数据
 * @param count 返回数量
 * @param excludeIds 要排除的提示词ID列表
 * @returns 该分类的热门提示词
 */
export function getPopularPromptsByCategory(
  category: string,
  allPrompts: PromptData[],
  count: number = 5,
  excludeIds: string[] = []
): PromptData[] {
  const categoryPrompts = allPrompts.filter(prompt => {
    const categories = prompt.categories || [];
    return categories.includes(category) && !excludeIds.includes(prompt.id);
  });

  // 按照case number排序，较新的提示词优先
  return categoryPrompts
    .sort((a, b) => b.caseNumber - a.caseNumber)
    .slice(0, count);
}

/**
 * 获取相似的提示词
 * 基于标题和描述的文本相似度
 * 
 * @param currentPrompt 当前提示词
 * @param allPrompts 所有提示词
 * @param count 返回数量
 * @returns 相似的提示词列表
 */
export function getSimilarPrompts(
  currentPrompt: PromptData,
  allPrompts: PromptData[],
  count: number = 3
): PromptData[] {
  const availablePrompts = allPrompts.filter(prompt => prompt.id !== currentPrompt.id);
  
  const currentText = `${currentPrompt.title} ${currentPrompt.description || ''} ${currentPrompt.prompt}`.toLowerCase();
  const currentWords = extractKeywords(currentText);

  const scoredPrompts = availablePrompts.map(prompt => {
    const promptText = `${prompt.title} ${prompt.description || ''} ${prompt.prompt}`.toLowerCase();
    const promptWords = extractKeywords(promptText);
    
    const similarity = calculateTextSimilarity(currentWords, promptWords);
    
    return {
      prompt,
      similarity
    };
  });

  return scoredPrompts
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, count)
    .map(item => item.prompt);
}

/**
 * Fisher-Yates 洗牌算法
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 从文本中提取关键词
 */
function extractKeywords(text: string): Set<string> {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']);
  
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
  );
}

/**
 * 计算两个关键词集合的相似度
 */
function calculateTextSimilarity(words1: Set<string>, words2: Set<string>): number {
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * 获取多样化的推荐
 * 确保推荐列表包含不同类型的提示词
 */
export function getDiversifiedRecommendations(
  currentPrompt: PromptData,
  allPrompts: PromptData[],
  count: number = 6
): PromptData[] {
  const recommendations: PromptData[] = [];
  const usedIds = new Set<string>([currentPrompt.id]);
  
  // 1. 添加2个同分类的提示词
  const sameCategoryPrompts = getRecommendations(currentPrompt, allPrompts, 2);
  sameCategoryPrompts.forEach(prompt => {
    recommendations.push(prompt);
    usedIds.add(prompt.id);
  });
  
  // 2. 添加2个相似的提示词
  const availableForSimilar = allPrompts.filter(p => !usedIds.has(p.id));
  const similarPrompts = getSimilarPrompts(currentPrompt, availableForSimilar, 2);
  similarPrompts.forEach(prompt => {
    recommendations.push(prompt);
    usedIds.add(prompt.id);
  });
  
  // 3. 用随机提示词填充剩余位置
  if (recommendations.length < count) {
    const remainingPrompts = allPrompts.filter(p => !usedIds.has(p.id));
    const shuffled = shuffleArray(remainingPrompts);
    const needed = count - recommendations.length;
    recommendations.push(...shuffled.slice(0, needed));
  }
  
  return recommendations.slice(0, count);
}