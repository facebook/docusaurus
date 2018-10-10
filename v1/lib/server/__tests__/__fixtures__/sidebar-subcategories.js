module.exports = {
  docs: {
    'First Category': ['doc1', 'doc2'],
    'Second Category': [
      'doc3',
      {
        type: 'subcategory',
        label: 'First Subcategory',
        ids: ['doc4'],
      },
      'doc5',
    ],
    'Third Category': [
      {
        type: 'subcategory',
        label: 'Second Subcategory',
        ids: ['doc6', 'doc7'],
      },
      {
        type: 'subcategory',
        label: 'Third Subcategory',
        ids: ['doc8'],
      },
    ],
  },
};
