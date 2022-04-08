/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");
const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

const plugins = [
  [
    withPWA,
    {
      pwa: {
        dest: "public",
        runtimeCaching,
      },
    },
  ],
];

module.exports = withPlugins(plugins, {
  /* ... */
});
