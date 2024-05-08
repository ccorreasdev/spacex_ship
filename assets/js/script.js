//Imports
import * as THREE from "./build/three.module.js";
import Master from "./class/Master.js";
import TouchControls from "./class/TouchControls.js";
import Models from "./class/Model.js";
import Lights from "./class/Lights.js";
import KeyListener from "./class/KeyListener.js";
import MouseMove from "./class/MouseMove.js";
import ScrollWindow from "./class/ScrollWindow.js";
import ModelMovement from "./class/ModelMovement.js";
import { htmlActionsListener } from "./class/HTMLActions.js";
import { calculateDistance } from "./class/Distances.js";
import { windowResizeListener } from "./class/WindowResize.js"

//Constants and variables
const canvas = document.querySelector("#canvas");
const progressBar = document.querySelector("#progress-bar");
let master = new Master();
let touchControls = new TouchControls();
let models = new Models();
let lights = new Lights();
let keyListener = new KeyListener();
let modelMovement = new ModelMovement();
let mouseMove = new MouseMove();
let scrollWindow = new ScrollWindow();
let bgAnimationTo = false;

const init = async () => {
    //Init master - Camera, scene, lights, renderer...
    master.initCamera(60, window.innerWidth / window.innerHeight, 0.1, 4000);
    master.camera.position.set(0, 0, 0);
    master.camera.lookAt(0, 0, 0);
    master.initScene();

    lights.initLights(10, 10);

    master.scene.add(lights.getDirectionalLight());
    master.scene.add(lights.getAmbientLight());

    master.initRenderer();
    master.renderer.setPixelRatio(window.devicePixelRatio);
    master.renderer.setSize(window.innerWidth, window.innerHeight);

    canvas.appendChild(master.renderer.domElement);

    master.initOrbitControls();

    //Load 3D Models
    models = new Models();

    await models.loadModelGLTFAnimation("night_sky").then((resolve) => {
        models.percentLoaded = 50;
        progressBar.innerHTML = models.percentLoaded + "%";
        return models.loadModelGLTF("space_ship")
    }).then((resolve) => {
        models.percentLoaded = 75;
        progressBar.innerHTML = models.percentLoaded + "%";
        return models.loadModelGLTFAnimation("flame");
    }).then((resolve) => {
        models.percentLoaded = 100;
        progressBar.innerHTML = models.percentLoaded + "%";
    })

    console.log(models.getLoadedModels(1));
    //Add to scene 3D Models
    //models.getLoadedModels(0).mixer.clipAction(models.getLoadedModels(0).animations[0]).play();
    models.getLoadedModels(0).model.scale.set(100, 100, 100)
    models.getLoadedModels(0).model.position.x = -6.5;
    models.getLoadedModels(0).model.position.y = 632;
    models.getLoadedModels(0).model.position.z = -78.5;
    models.getLoadedModels(0).model.rotation.y = 2.5;
    master.scene.add(models.getLoadedModels(0).model);

    models.getLoadedModels(1).scale.set(1, 1, 1)
    models.getLoadedModels(1).position.x = 0;
    models.getLoadedModels(1).position.y = -1;
    models.getLoadedModels(1).position.z = -3;
    models.getLoadedModels(1).rotation.x = (15 * Math.PI) / 180;
    models.getLoadedModels(1).rotation.y = (180 * Math.PI) / 180;
    models.getLoadedModels(1).rotation.y = (180 * Math.PI) / 180;
    //master.scene.add(models.getLoadedModels(1));

    models.getLoadedModels(2).mixer.clipAction(models.getLoadedModels(2).animations[0]).play();
    models.getLoadedModels(2).mixer.clipAction(models.getLoadedModels(2).animations[1]).play();
    models.getLoadedModels(2).mixer.clipAction(models.getLoadedModels(2).animations[2]).play();
    models.getLoadedModels(2).mixer.clipAction(models.getLoadedModels(2).animations[3]).play();
    models.getLoadedModels(2).model.scale.set(1, 1, 1)
    models.getLoadedModels(2).model.position.x = 0;
    models.getLoadedModels(2).model.position.y = -0.4;
    models.getLoadedModels(2).model.position.z = -3;
    models.getLoadedModels(2).model.rotation.x = (15 * Math.PI) / 180;;
    models.getLoadedModels(2).model.rotation.y = (180 * Math.PI) / 180;
    models.getLoadedModels(2).model.rotation.z = (0 * Math.PI) / 180;
    master.scene.add(models.getLoadedModels(2).model);

    //Listeners
    windowResizeListener(master);
    mouseMove.mouseMoveListener();
    scrollWindow.scrollListener();
    keyListener.init();
    //touchControls.initTouchControls(keyListener.getKeysPressed());
    htmlActionsListener(0);


    const timeDelay = 15; // En segundos 14

    // Función para ejecutar las animaciones
    const animateModels = () => {
        //Space background position animation
        gsap.to(models.getLoadedModels(0).model.position, {
            duration: timeDelay, x: -6.5, y: 800, z: -500, onComplete: () => {
                gsap.to(models.getLoadedModels(0).model.rotation, {
                    duration: timeDelay, x: 0, y: Math.PI * 360 / 180, z: 0, onComplete: () => {
                        gsap.to(models.getLoadedModels(0).model.position, {
                            duration: timeDelay, x: -6.5, y: 632, z: -78.5, onComplete: () => {
                                gsap.to(models.getLoadedModels(0).model.rotation, {
                                    duration: timeDelay, x: 0, y: 2.5, z: 0, onComplete: () => {
                                        // Aquí puedes agregar más animaciones si es necesario
                                        // Por ejemplo, para reiniciar el ciclo
                                        animateModels();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });


        //Space ship position animation
        gsap.to(models.getLoadedModels(2).model.rotation, {
            delay: timeDelay, duration: timeDelay, z: (15 * Math.PI) / 180, onComplete: () => {
                gsap.to(models.getLoadedModels(2).model.rotation, {
                    delay: 0, duration: timeDelay, z: (0 * Math.PI) / 180, onComplete: () => {
                        gsap.to(models.getLoadedModels(2).model.rotation, {
                            delay: 0, duration: timeDelay, z: (-15 * Math.PI) / 180, onComplete: () => {
                                gsap.to(models.getLoadedModels(2).model.rotation, {
                                    delay: 0, duration: timeDelay, z: (0 * Math.PI) / 180
                                });
                            }
                        });
                    }
                });
            }
        });




    };

    // Iniciar el ciclo de animaciones
    animateModels();

    setInterval(() => {
        console.log("POS", models.getLoadedModels(0).model.position);
        console.log("ROT", models.getLoadedModels(0).model.rotation);
    }, 500)

};


//Render scene
const render = () => {
    master.renderer.render(master.scene, master.camera);
};

//Animate scene
const animate = () => {
    requestAnimationFrame(animate);

    //Wait last model is loaded
    if (models.getLoadedModels(0)) {

        //Movement controller model 1 - Garden
        modelMovement.moveModel(keyListener, models.getLoadedModels(0).model, 5);


        //Camera follow 3D model 1 - plane
        // let distance = 3.5;
        // const objectPosition = models.getLoadedModels(0).model.position;
        // const cameraPosition = new THREE.Vector3(
        //     objectPosition.x,
        //     objectPosition.y + 1.5,
        //     objectPosition.z - distance
        // );

        // master.camera.position.copy(cameraPosition);
        //master.camera.lookAt(objectPosition);

        //Animations mixer
        if (models.getLoadedModels(2)) {

            models.getLoadedModels(2).mixer.update(0.01);
        }

        //Distances from other models
        //calculateDistance(master.camera.position, models.getLoadedModels(4).position, models.getLoadedModels(5).position);

    }




    render();
};


init();
animate();

let audioPlay = true
document.addEventListener("click", (e) => {
    if (audioPlay) {
        audioPlay = false;
        const audio = new Audio('./assets/audio/melody.mp3');
        audio.play();
    }

})