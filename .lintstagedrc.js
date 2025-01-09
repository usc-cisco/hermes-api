// .lintstagedrc.js
module.exports = {
    "src/**/*.ts": files => {
        return "eslint --fix " + files.join(" ")
    },
    "src/**/*.{ts,json}": files => {
        return "prettier --write " + files.join(" ")
    },
}