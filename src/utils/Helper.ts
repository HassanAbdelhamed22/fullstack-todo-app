export const isLightMode = () =>
  !document.documentElement.classList.contains("dark");

export const storageKey = "loggedInUser";
export const userDataString = localStorage.getItem(storageKey);
export const userData = userDataString ? JSON.parse(userDataString) : null;
