const PaletteColor = () => {
  const palette = document.createElement('div');
  palette.id = 'color-palette';
  const colors = ['black', 'purple', 'orange', 'green'];

  colors.forEach((color) => {
    const div = document.createElement('div');
    div.classList.add('color');
    div.style.backgroundColor = color;
    palette.appendChild(div);
  });
  return palette;
};

document.body.appendChild(PaletteColor());
