import vitest from '@vitest/eslint-plugin';

export default [
  {
    files: ['tests/**'], // 테스트 파일 위치에 맞게 수정
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/max-nested-describe': ['error', { max: 3 }],
    },
  },
];
