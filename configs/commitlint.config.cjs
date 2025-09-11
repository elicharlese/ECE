module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      // Support: feat[patch-3](CS, DF): message
      headerPattern: /^(\w+)(?:\[(.+?)\])?(?:\((.+?)\))?!?: (.+)$/,
      headerCorrespondence: ['type', 'patch', 'tags', 'subject'],
    },
  },
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert'
      ],
    ],
    'subject-case': [0],
    'header-max-length': [2, 'always', 120],
  },
};
