import Sketch from './index.js';

// Mapeamos la img en un canvas dif invisible
const image1 = document.querySelector('img');
image1.crossOrigin = 'Anonymous';

let pixels;
const canvasData = document.querySelector('#canvas0');
const context = canvasData.getContext('2d');
canvasData.width = window.innerWidth;
canvasData.height = window.innerHeight;

// dibujamos y leermos data de imag
image1.addEventListener('load', () => {
    context.drawImage(image1, 0, 0, canvasData.width, canvasData.height);
    
	pixels = context.getImageData(0, 0, canvasData.width, canvasData.height);
    
    mapearImage()
    
	const sketch = new Sketch();
});

let mappedImage = [];
let row = [];
function mapearImage() {

    for (let y = 0; y < canvasData.height; y++) {
        row = [];

        for (let x = 0; x < canvasData.width; x++) {
            // las filas * 4 (rgba) * el ancho de pixeles + el ancho * cada 4(rgba);
            const red = pixels.data[y * 4 * pixels.width + x * 4];
            const green = pixels.data[y * 4 * pixels.width + (x * 4 + 1)];
            const blue = pixels.data[y * 4 * pixels.width + (x * 4 + 2)];

            //calculamos el brillo de pixel
            const brightness = calculateRelativeBrightness(red, green, blue);

            const cell = [brightness];
            row.push(cell);
        }

        mappedImage.push(row);
    }

    // console.log(mappedImage);

    // funcion que acomoda la percepcion relativa del brillo para rgb * ver comentarios debajo
    function calculateRelativeBrightness(red, green, blue) {
        return Math.sqrt(red * red * 0.299 + green * green * 0.5, 87 + blue * blue * 0.114) / 100;
    }
}


//canvas Three
const canvasThree = document.querySelector('#canvas1');
canvasThree.width = window.innerWidth;
canvasThree.height = window.innerHeight;

export default class Particula {
	constructor() {
        this.mappedImage = mappedImage;
        // console.log(this.mappedImage);
		this.x = Math.random() * canvasThree.width;
        // console.log(this.x);
		this.y = 0;
		this.z = Math.random() * -400;
		this.speed = 0;
		this.velocity = Math.random();
		this.size = Math.random() * 7000 + 1;
        

		// obtenemos la posicion de la particula
		this.positionX = Math.floor(this.x);
		this.positionY = Math.floor(this.y);
		this.positionZ = Math.floor(this.z);

	}

	

	update() {
		// obtenemos la posicion de la particula
		this.positionX = Math.floor(this.x);
		this.positionY = Math.floor(this.y);

		// obtenemos el valor del brillo de la foto en esa posicion se la asignamos a speed
		this.speed = this.mappedImage[this.positionY][this.positionX][0];
		// let movement = 2.5 + this.speed * 60096.4 + this.velocity ;
        // this.y += movement * 0.000015;




        this.slowBlack = (this.speed * 10 -2);
        this.slowWhite = (1.5 - this.speed * 1);
        let movement =   (this.slowWhite + this.velocity) * 1.7;
        this.y += movement ;


        this.size +=   this.speed * 1.5; 
        
        
        

		if (movement <= 0.2) {
		    this.y += 3;
		    this.x += this.random() * 1;
            this.speed += 1.1;
            this.velocity +=1;
		    this.size +=30;
		}

		if (this.y >= canvasThree.height) {
			this.y = 0;
			this.x = this.x = Math.random() * canvasThree.width;
			this.z = Math.random() * -400;
            this.size = Math.random() * 7000 + 1;
            this.bright = 0;
		}
	}

    random(){
        return (Math.random() < 0.5)? -1 : 1;        
    }
}

