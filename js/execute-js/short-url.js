(function () {
  console.log('short-url');
  let fullUrl = location.origin + location.pathname;
  chrome.runtime.sendMessage(
    {
      type: 'getShortUrl',
      url: fullUrl,
    },
    (response) => {
      console.log(response);
    }
  );
})();
