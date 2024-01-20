module.exports = {
  singleQuote: true,
  semi: false,
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: [
    "<TYPES>",
    "<BUILT_IN_MODULES>",
    "<THIRD_PARTY_MODULES>",
    "",
    "<TYPES>^[@/]",
    "<TYPES>^[.]",
    "^@/",
    "^[.]/",
    "^[.][.]/",
    "",
    "^~/",
  ],
};
