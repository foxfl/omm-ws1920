window.addEventListener("DOMContentLoaded", function() {
  setTimeout(() => {
    console.log("timer");
    Promise.resolve().then(() => console.log("promise1"));
  }, 0);
  Promise.resolve().then(() => {
    console.log("promise2");
    Promise.resolve().then(() => console.log("promise3"));
  });
  console.log("script");
});
