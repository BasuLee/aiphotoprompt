// 测试推荐系统功能的简单验证脚本
import { PromptData } from '../types';

// 模拟数据
const mockPrompts: PromptData[] = [
  {
    id: '1',
    caseNumber: 1,
    model: 'DALL-E',
    slug: 'portrait-test',
    title: '人像摄影测试',
    prompt: 'portrait photography, professional lighting',
    categories: ['人像', '摄影']
  },
  {
    id: '2', 
    caseNumber: 2,
    model: 'Midjourney',
    slug: 'landscape-test',
    title: '风景摄影测试',
    prompt: 'landscape photography, natural scenery',
    categories: ['风景', '摄影']
  },
  {
    id: '3',
    caseNumber: 3,
    model: 'DALL-E',
    slug: 'portrait-artistic',
    title: '艺术人像',
    prompt: 'artistic portrait, creative lighting',
    categories: ['人像', '艺术']
  }
];

console.log('推荐系统测试数据准备完成');
console.log('模拟提示词数据:', mockPrompts.length, '个');

// 此文件仅用于验证类型定义正确性
export { mockPrompts };