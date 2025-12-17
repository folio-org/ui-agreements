const focusByIdWhenReady = (id) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.getElementById(id)?.focus();
    });
  });
};

export default focusByIdWhenReady;
