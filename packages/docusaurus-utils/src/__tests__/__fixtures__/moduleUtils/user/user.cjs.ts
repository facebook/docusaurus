exports.someNamedExport = 42 as number;

module.exports = {
  firstName: 'Sebastien',
  lastName: 'Lorber',
  birthYear: 1986,
} satisfies {
  firstName: string;
  lastName: string;
  birthYear: number;
};
