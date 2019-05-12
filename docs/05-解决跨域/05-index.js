let xhr = new XMLHttpRequest();

xhr.open('GET', '/user', true);

xhr.onload = function () {
  console.log(xhr.response);
};

xhr.send();
