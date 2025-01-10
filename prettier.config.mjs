/** @type {import("prettier").Config} */
export default {
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  printWidth: 120,
  semi: false,
}
