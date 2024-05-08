import Master from "./Master.js";

export const windowResizeListener = (master, modelSpaceShip) => {


    window.addEventListener("resize", () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        master.camera.aspect = width / height;
        master.camera.updateProjectionMatrix();
        master.renderer.setSize(width, height);
        console.log("WIDTH: ", width);

        if (width > 1280) {
            modelSpaceShip.scale.set(1, 1, 1)
        }
        else if (width >= 1024) {
            modelSpaceShip.scale.set(0.8, 0.8, 0.8)
        }
        else if (width >= 768) {
            modelSpaceShip.scale.set(0.6, 0.6, 0.6)
        } else if (width >= 600) {
            modelSpaceShip.scale.set(0.4, 0.4, 0.4)
        }


    });
}