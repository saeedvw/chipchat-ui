module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
                @import "@/scss/colors.scss";
                `,
      },
    },
  },
};
