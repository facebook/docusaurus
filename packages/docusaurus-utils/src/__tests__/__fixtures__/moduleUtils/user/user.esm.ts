export const someNamedExport: number = 42;

export default {
  firstName: 'Sebastien',
  lastName: 'Lorber',
  birthYear: 1986,
} satisfies {
  firstName: string;
  lastName: string;
  birthYear: number;
};
