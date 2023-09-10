import globals from 'globals';

export default [{
  languageOptions: {
    globals: {
      ...globals.nodeBuiltin,
    }
  },
  rules: {
    'import/no-unresolved': [
      'error',
      {
        ignore: [
          'got',
        ]
      }
    ]
  }
}];
