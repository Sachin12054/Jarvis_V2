export function formatModelDisplayName(rawModel: string): string {
  if (!rawModel) return 'GEMMA 3 4B';
  const model = rawModel.toLowerCase();

  if (model.includes('deepseek')) {
    return 'DEEPSEEK R1 7B';
  } else if (model.includes('qwen')) {
    return 'QWEN CODER 3B';
  } else if (model.includes('gemma')) {
    return 'GEMMA 3 4B';
  }

  // General clean formatting fallback
  return rawModel.replace(':latest', '').replace(/-/g, ' ').toUpperCase();
}

export function getModelCategory(rawModel: string): string {
  if (!rawModel) return 'GENERAL';
  const model = rawModel.toLowerCase();

  if (model.includes('deepseek')) {
    return 'REASONING';
  } else if (model.includes('qwen')) {
    return 'CODING';
  } else if (model.includes('gemma')) {
    return 'GENERAL';
  }

  return 'GENERAL';
}
