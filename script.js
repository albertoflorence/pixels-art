const buttonRandomColor = document.querySelector('#button-random-color');
const buttonClearBoard = document.querySelector('#clear-board');
const colorPalette = document.querySelector('#color-palette');
const pixelBoard = document.querySelector('#pixel-board');
const inputBoardSize = document.querySelector('#board-size');
const inputUploadImage = document.querySelector('#upload-image');

const getStorageItem = (key) => {
  const value = localStorage.getItem(key);
  return value && JSON.parse(value);
};

const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const colors = getStorageItem('colorPalette') || [
  'black',
  'purple',
  'orange',
  'green',
];

const random = (min, max) => Math.round(Math.random() * (max - min) + min);

const getRandomColor = () =>
  `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;

const getSelectedColor = () =>
  document.querySelector('.selected').style.backgroundColor;

const generateEmptyBoard = (size) =>
  Array.from({ length: size }, () => 'white');

const getBoardSize = () => getStorageItem('boardSize') || 25;

const getBoard = (size) =>
  getStorageItem('pixelBoard') ||
  generateEmptyBoard(size || getBoardSize() || 25);

const Color = (color) => {
  const element = document.createElement('div');
  element.classList.add('color');
  element.style.backgroundColor = color;

  element.addEventListener('click', () => {
    document.querySelectorAll('.color').forEach((item) => {
      item.classList.remove('selected');
    });

    element.classList.add('selected');
  });

  return element;
};

const Cell = (color, saveCellColor) => {
  const element = document.createElement('div');
  element.classList.add('pixel');
  element.style.backgroundColor = color;

  element.addEventListener('click', () => {
    const selectedColor = getSelectedColor();
    element.style.backgroundColor = selectedColor;
    saveCellColor(selectedColor);
  });

  return element;
};

const createBoard = (table) => {
  const handleChangeCellColor = (index) => (color) => {
    const eslint = table;
    eslint[index] = color;
    setStorageItem('pixelBoard', table);
  };
  return table.map((color, index) => Cell(color, handleChangeCellColor(index)));
};

const changeBoard = (array) => {
  pixelBoard.innerHTML = '';
  const size = `${Math.ceil(Math.sqrt(array.length) * 42)}px`;
  pixelBoard.style.width = size;
  createBoard(array).forEach((item) => pixelBoard.appendChild(item));
  setStorageItem('boardSize', array.length);
  setStorageItem('pixelBoard', array);
};

inputBoardSize.value = Math.sqrt(getBoardSize());
inputBoardSize.addEventListener('input', () => {
  const value = parseInt(inputBoardSize.value, 10);
  if (!value) {
    window.alert('Board inválido!');
    return;
  }
  changeBoard(generateEmptyBoard(Math.min(Math.max(value, 5), 50) ** 2));
});

const imageToArray = (image, cellSize = 1) => {
  const array = [];
  for (let row = 0; row < image.height; row += cellSize) {
    for (let col = 0; col < image.width; col += cellSize) {
      const pos = (col * image.width + row) * 4;
      const [red, green, blue] = image.data.slice(pos, pos + 3);
      const rgb = `rgb(${red},${green},${blue})`;
      array.push(rgb);
    }
  }
  return array;
};

const drawImagem = (url) =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const cellSize = Math.floor(
        Math.sqrt((img.width * img.height) / getBoardSize())
      );

      return resolve(imageToArray(imageData, cellSize));
    };
  });

buttonRandomColor.addEventListener('click', () => {
  document.querySelectorAll('.color').forEach((item, index) => {
    const color = index === 0 ? 'black' : getRandomColor();
    const eslint = item;
    eslint.style.backgroundColor = color;
    colors[index] = color;
    setStorageItem('colorPalette', colors);
  });
});

colors.forEach((color) => colorPalette.appendChild(Color(color)));

buttonClearBoard.addEventListener('click', () => {
  changeBoard(generateEmptyBoard(getBoardSize()));
});

inputUploadImage.addEventListener('change', () => {
  const url = URL.createObjectURL(inputUploadImage.files[0]);
  drawImagem(url).then(changeBoard);
});

changeBoard(getBoard());

document.querySelector('.color').classList.add('selected');
