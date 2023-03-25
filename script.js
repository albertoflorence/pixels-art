const random = (min, max) => Math.round(Math.random() * (max - min) + min);

const getRandomColor = () =>
  `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;

const getStorageItem = (key) => {
  const value = localStorage.getItem(key);
  return value && JSON.parse(value);
};

const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getSelectedColor = () =>
  document.querySelector('.selected').style.backgroundColor;

const generateEmptyBoard = (size) =>
  Array.from({ length: size }, () => 'white');

const getBoardSize = () => getStorageItem('boardSize') || 25;

const getBoard = (size) =>
  getStorageItem('pixelBoard') ||
  generateEmptyBoard(size || getBoardSize() || 25);

const ButtonRandomColor = (saveColors) => {
  const element = document.createElement('button');
  element.id = 'button-random-color';
  element.innerText = 'Cores aleatórias';

  element.addEventListener('click', () => {
    document.querySelectorAll('.color').forEach((item, index) => {
      const color = index === 0 ? 'black' : getRandomColor();
      const eslint = item;
      eslint.style.backgroundColor = color;
      saveColors(index, color);
    });
  });

  return element;
};

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

const PaletteColor = () => {
  const element = document.createElement('div');
  element.id = 'color-palette';
  const colors = getStorageItem('colorPalette') || [
    'black',
    'purple',
    'orange',
    'green',
  ];

  colors.forEach((color) => element.appendChild(Color(color)));

  const handleChangeColor = (index, color) => {
    colors[index] = color;
    setStorageItem('colorPalette', colors);
  };

  element.appendChild(ButtonRandomColor(handleChangeColor));
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

const Board = () => {
  const element = document.createElement('div');
  element.id = 'pixel-board';

  return [
    element,
    (array) => {
      element.innerHTML = '';
      const size = `${Math.ceil(Math.sqrt(array.length) * 42)}px`;
      element.style.width = size;
      createBoard(array).forEach((item) => element.appendChild(item));
      setStorageItem('boardSize', array.length);
      setStorageItem('pixelBoard', array);
    },
  ];
};

const ButtonClearBoard = (changeTable) => {
  const element = document.createElement('button');
  element.id = 'clear-board';
  element.innerText = 'Limpar';

  element.addEventListener('click', () => {
    changeTable(generateEmptyBoard(getBoardSize()));
  });

  return element;
};

const InputBoardSize = () => {
  const element = document.createElement('input');
  element.id = 'board-size';
  element.type = 'number';
  element.min = 1;
  element.max = 50;

  return element;
};

const ButtonVQV = (changeTable) => {
  const element = document.createElement('button');
  element.id = 'generate-board';
  element.innerText = 'VQV';

  element.addEventListener('click', () => {
    const input = document.querySelector('#board-size');
    const value = parseInt(input.value, 10);
    if (!value) {
      window.alert('Board inválido!');
      return;
    }

    changeTable(generateEmptyBoard(Math.min(Math.max(value, 5), 50) ** 2));
  });

  return element;
};

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

const InputImage = (changeTable) => {
  const element = document.createElement('input');
  element.id = 'upload-image';
  element.type = 'file';
  element.addEventListener('change', () => {
    const url = URL.createObjectURL(element.files[0]);
    drawImagem(url).then(changeTable);
  });
  return element;
};

const main = document.querySelector('main');

const [board, changeTable] = Board();

changeTable(getBoard());

main.appendChild(PaletteColor());
main.appendChild(ButtonClearBoard(changeTable));
main.appendChild(InputBoardSize());
main.appendChild(ButtonVQV(changeTable));
main.appendChild(InputImage(changeTable));
main.appendChild(board);

document.querySelector('.color').classList.add('selected');
