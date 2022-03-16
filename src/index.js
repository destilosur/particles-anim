import * as THREE from 'three';
// import * as dat from "dat.gui";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Particula from './Particula';


import fragment from './shader/fragment.glsl';
import vertex from './shader/vertex.glsl';





const lado = 250;
const cuadrado = lado * lado;
const canva = document.getElementById('canvas1');
const cWidth = window.innerWidth;
const cHeight = window.innerHeight;





export default class Sketch {
    
    constructor() {
        
        
        this.cSize = {cWidth,cHeight};
		this.initThree();
        this.setParticulas();
		this.addMesh();
		this.render();
		this.mouse()
	}

	initThree() {
		this.time = 0;
        this.picture = new THREE.TextureLoader().load('https://res.cloudinary.com/dlc2ofkpq/image/upload/c_scale,h_1128,r_0,w_1128/v1647085305/bosque_on%C3%ADrico_cja7xu.png');
		this.texture = new THREE.TextureLoader().load(
			'https://res.cloudinary.com/dlc2ofkpq/image/upload/v1647085305/bosque_on%C3%ADrico_cja7xu.png'
		);
		this.background = new THREE.TextureLoader().load(
			'https://res.cloudinary.com/dlc2ofkpq/image/upload/v1647265099/Proyecto_20220314023733_pmidjz.png'
		);



      


		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x262424);

        this.scene.fog = new THREE.Fog(0x464444, 0.08, 0.5);
        // this.scene.background = this.background;

      

		this.camera = new THREE.OrthographicCamera( cWidth / - 2, cWidth / 2, cHeight / 2, cHeight / - 2, 1, 1000 );
		this.camera.position.z = 500 ;

		this.renderer = new THREE.WebGLRenderer({ canvas: canva, antialias: true, preserveDrawingBuffer: true  });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);

        this.ctx = this.renderer.getContext();    
        
		// this.control = new OrbitControls(this.camera, this.renderer.domElement);
		// this.settings();
		this.wheel = 0;
	}


    setParticulas(){
        this.partArr = [];

        for (let i = 0; i < lado; i++) {
			let posY = 0;

			for (let j = 0; j < lado; j++) {
				const particula = new Particula();               
				this.partArr.push(particula);
			}
		}

        // console.log(this.partArr);

    }

	getGeometry() {
        // * cWidth - cWidth/2 

         const geometry = new THREE.BufferGeometry();

		this.position = new THREE.BufferAttribute(new Float32Array(this.partArr.length * 3), 3);
        this.coodinates = new THREE.BufferAttribute(new Float32Array(cuadrado * 3),3);
		this.size = new THREE.BufferAttribute(new Float32Array(this.partArr.length), 1);
		this.speed = new THREE.BufferAttribute(new Float32Array(this.partArr.length), 1);
		
        
        this.partArr.forEach((p,i,a)=>{ 
            this.position.setXYZ(i,p.x,p.y,p.z);
            this.coodinates.setXYZ(this.coodinates.setXYZ(i,p.x -cWidth/2,-p.y +cHeight/2,p.z));
            this.size.setX(i,p.size);
			this.speed.setX(i,p.speed);     

        });         
            
		geometry.setAttribute('position', this.position);
        geometry.setAttribute('aCoordinates', this.coodinates);
		geometry.setAttribute('aSize', this.size);
		geometry.setAttribute('aSpeed', this.speed);
		
		return geometry;
	}

    getMaterial(){
        console.log(this.cSize);
        const material = new THREE.ShaderMaterial({
			fragmentShader: fragment,
			vertexShader: vertex,
			uniforms: {				
				
				mask: {type: "t", value: this.texture},
                camvasSize:{tipe: "v2", value: this.cSize},
				transition: {type: "f", value: null},
				

			},

			side: THREE.DoubleSide,
			transparent: true,
			depthTest: false,
			depthWrite: false

		});

        return material;
    }
    
	addMesh() {
        this.geometry = this.getGeometry();
        
        this.material = this.getMaterial();		

		this.mesh = new THREE.Points(this.geometry, this.material);

		this.scene.add(this.mesh);
	}

	updateParticula() {
		
        this.partArr.forEach((p,i,a)=>{
            p.update();
            this.position.setXYZ(i,p.x -cWidth/2,-p.y +cHeight/2 ,p.z);
			this.coodinates.setXYZ(this.coodinates.setXYZ(i,p.x -cWidth/2,-p.y +cHeight/2,p.z));
			this.size.setX(i,p.size);
			this.speed.setX(i,p.speed); 
			
        });

		

		this.geometry.setAttribute('position', this.position);
		this.geometry.setAttribute('aCoordinates', this.coodinates);
		this.geometry.setAttribute('aSize', this.size);
	}

	mouse() {
		// canva.addEventListener('mousemove', e => {
        //     const pointer = {};
		// 	pointer.x = (e.clientX / window.innerWidth) ;
		// 	pointer.y = (e.clientY );
		// 	console.log(pointer);
		// });

		window.addEventListener('mousewheel',(e)=>{

			this.wheel += e.wheelDeltaY/1200;
			if(this.wheel > 1) this.wheel = 1;
			if(this.wheel < 0) this.wheel = 0;

			// console.log(this.wheel);

		})
	}

// 	settings(){
// 		this.settings = {
// 			progress: 0,
// 		};
// 
// 		this.gui = new dat.GUI();
// 		this.gui.add(this.settings, "progress", 0, 1 , 0.01);
// 	}

	render() {
		this.time += 0.01;

		this.updateParticula(this.time);
		this.geometry.attributes.position.needsUpdate = true;
		this.geometry.attributes.aCoordinates.needsUpdate = true;
		this.geometry.attributes.aSize.needsUpdate = true;
		this.geometry.attributes.aSpeed.needsUpdate = true;
		this.material.uniforms.transition.value = this.wheel;

		// this.mesh.rotation.x = this.time / 3;
		// this.mesh.rotation.y = this.time / 10;
		this.renderer.render(this.scene, this.camera);
		window.requestAnimationFrame(this.render.bind(this));
	}
}
