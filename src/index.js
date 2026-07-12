import * as THREE from "three";
import { Mesh } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Setup

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#87CEEB");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights

var light2 = new THREE.AmbientLight(0xffffff, 2);
scene.add(light2);

var light3 = new THREE.PointLight(0xffffff, 1, 100);
light3.position.set(0, 60, 0);
scene.add(light3);

var light4 = new THREE.PointLight(0xffffff, 1, 100);
light4.position.set(0, -60, 0);
scene.add(light4);

var light5 = new THREE.PointLight(0xffffff, 3, 20);
light5.position.set(-33, -5, 0);
scene.add(light5);

var light6 = new THREE.PointLight(0xffffff, 3, 20);
light6.position.set(-36, -5, 0);
scene.add(light6);

var light7 = new THREE.PointLight(0xffffff, 3, 20);
light7.position.set(-39, -5, 0);
scene.add(light7);

// Camera

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.lookAt(new THREE.Vector3(0, 0, 0));

camera.position.z = 12;
camera.position.y = -60;
camera.position.x = -50;

camera.rotation.x = -Math.PI / 2;

// Stadium and environment

let loadManager = new THREE.LoadingManager();

loadManager.onLoad = function () {
    startSequence();
};

let floor_geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
let floor_material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0,
    color: 0x000000,
});

let floor = new THREE.Mesh(floor_geometry, floor_material);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const stadium = new GLTFLoader(loadManager);
stadium.load("./../src/stadium.glb", function (gltf) {
    floor.add(gltf.scene);
});

const start = new THREE.Mesh();

const start_loader = new GLTFLoader(loadManager);
start_loader.load("./../src/starting_arch.glb", function (gltf) {
    start.add(gltf.scene);
});

const start_line = new THREE.Mesh();
start_line.geometry = new THREE.BoxGeometry(14, 0.1, 1);
start_line.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
start_line.position.x = -35;
start_line.position.y = 0;
start_line.position.z = 14;

start_line.rotation.x = -Math.PI / 2;

scene.add(start_line);

start.scale.set(0.055, 0.1, 0.1);
start.position.x = -35;
start.position.y = 0;
start.position.z = 14;

start.rotation.x = -Math.PI / 2;
start.rotation.y = Math.PI;

scene.add(start);

// Cars

var start_time = Date.now();

const Car = new THREE.Mesh();

const loader = new GLTFLoader(loadManager);
loader.load("./../src/mcqueen.glb", function (gltf) {
    Car.add(gltf.scene);
});

Car.scale.set(0.4, 0.42, 0.4);

Car.position.x = -37;
Car.position.y = -10;
Car.position.z = 14;

Car.rotation.x = -Math.PI / 2;
Car.rotation.y = 0;
Car.rotation.z = 0;

scene.add(Car);

let car1_Car = new THREE.Mesh();

let car1_loader = new GLTFLoader(loadManager);
car1_loader.load("./../src/mater.glb", function (gltf) {
    car1_Car.add(gltf.scene);
});

car1_Car.scale.set(0.35, 0.35, 0.35);
car1_Car.position.set(-32, -5, 14);
car1_Car.rotation.x = -Math.PI / 2;

scene.add(car1_Car);

let car2_Car = new THREE.Mesh();

let car2_loader = new GLTFLoader(loadManager);
car2_loader.load("./../src/king.glb", function (gltf) {
    car2_Car.add(gltf.scene);
});

car2_Car.scale.set(0.008, 0.008, 0.01);
car2_Car.position.set(-37, -5, 14);
car2_Car.rotation.x = -Math.PI / 2;

scene.add(car2_Car);

let car3_Car = new THREE.Mesh();

let car3_loader = new GLTFLoader(loadManager);
car3_loader.load("./../src/chick.glb", function (gltf) {
    car3_Car.add(gltf.scene);
});

car3_Car.scale.set(1.5, 1.5, 1.5);
car3_Car.position.set(-32, -10, 14);
car3_Car.rotation.x = -Math.PI / 2;

scene.add(car3_Car);

// key presses for controls

var carPosKey = [0, 0];
var camera_toggle = false;

document.onkeydown = function (e) {
    switch (e.keyCode) {
        case 38:
            carPosKey[1] = 1;
            break;
        case 40:
            carPosKey[1] = -0.2;
            break;
        case 37:
            carPosKey[0] = 1;
            break;
        case 39:
            carPosKey[0] = -1;
            break;
    }
};

document.onkeyup = function (e) {
    switch (e.keyCode) {
        case 38:
            carPosKey[1] = 0;
            break;
        case 40:
            carPosKey[1] = 0;
            break;
        case 37:
            carPosKey[0] = 0;
            break;
        case 39:
            carPosKey[0] = 0;
            break;
    }
};

document.addEventListener("keypress", function (e) {
    if (e.keyCode == 116) {
        camera_toggle = !camera_toggle;
    }
});

// Car movements

let friction = 0.97;

var car_velocity = [0, 0];
let dir1 = 0;
let dir2 = 1;
let car_collision_points = [
    { x: Car.position.x + 0, y: Car.position.y + 0.5, z: 14 },
    { x: Car.position.x + 0, y: Car.position.y + 0, z: 14 },
    { x: Car.position.x + 0, y: Car.position.y - 0.5, z: 14 },
];

let car_dir_change = [0, 20, 40];
let car_dir = [0, 1, -1];

let bot_cars = [car1_Car, car2_Car, car3_Car];
let bot_cars_dir = [
    { dir1: 0, dir2: 1 },
    { dir1: 0, dir2: 1 },
    { dir1: 0, dir2: 1 },
];
let bot_cars_velocities = [
    [0, 0],
    [0, 0],
    [0, 0],
];
let bot_cars_collision_points = [
    [
        {
            x: bot_cars[0].position.x + 0,
            y: bot_cars[0].position.y + 0.5,
            z: 14,
        },
        { x: bot_cars[0].position.x + 0, y: bot_cars[0].position.y + 0, z: 14 },
        {
            x: bot_cars[0].position.x + 0,
            y: bot_cars[0].position.y - 0.5,
            z: 14,
        },
    ],
    [
        {
            x: bot_cars[1].position.x + 0,
            y: bot_cars[1].position.y + 0.5,
            z: 14,
        },
        { x: bot_cars[1].position.x + 0, y: bot_cars[1].position.y + 0, z: 14 },
        {
            x: bot_cars[1].position.x + 0,
            y: bot_cars[1].position.y - 0.5,
            z: 14,
        },
    ],
    [
        {
            x: bot_cars[2].position.x + 0,
            y: bot_cars[2].position.y + 0.5,
            z: 14,
        },
        { x: bot_cars[2].position.x + 0, y: bot_cars[2].position.y + 0, z: 14 },
        {
            x: bot_cars[2].position.x + 0,
            y: bot_cars[2].position.y - 0.5,
            z: 14,
        },
    ],
];

let bot_per_vec = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
];

let cars = [Car, ...bot_cars];

let cars_laps = [-1, -1, -1, -1];
let cars_fuel = [30, 50, 50, 50];
let cars_health = [100, 100, 100, 100];
let cars_collision = [false, false, false, false];
let cars_end_times = [-1000, -1000, -1000, -1000];

function updateCar() {
    // collision points, directions and velocities of cars

    if (additional_frames > 0) {
        for (let i = 0; i < 3; i++) {
            if (car_dir_change[i] == 0) {
                car_dir_change[i] = Math.floor(Math.random() * 60) + 30;
                bot_cars[i].rotation.y -= 0.02 * car_dir[i];
                car_dir[i] = Math.floor(Math.random() * 2.99) - 1;
                bot_cars[i].rotation.y += 0.02 * car_dir[i];
                bot_cars_dir[i].dir1 = Math.sin(cars[i + 1].rotation.y);
                bot_cars_dir[i].dir2 = Math.cos(cars[i + 1].rotation.y);
            } else {
                car_dir_change[i]--;
            }

            bot_cars_collision_points[i] = [
                {
                    x:
                        bot_cars[i].position.x +
                        0.5 * Math.sin(bot_cars[i].rotation.y),
                    y:
                        bot_cars[i].position.y +
                        0.5 * Math.cos(bot_cars[i].rotation.y),
                    z: 14,
                },
                {
                    x: bot_cars[i].position.x,
                    y: bot_cars[i].position.y + 0,
                    z: 14,
                },
                {
                    x:
                        bot_cars[i].position.x -
                        0.5 * Math.sin(bot_cars[i].rotation.y),
                    y:
                        bot_cars[i].position.y -
                        0.5 * Math.cos(bot_cars[i].rotation.y),
                    z: 14,
                },
            ];

            let speed = Math.random() * 0.002 + 0.014;
            if (bot_cars[i].position.y > -60 && bot_cars[i].position.y < 60) {
                bot_cars_velocities[i][0] += speed * bot_cars_dir[i].dir1;
                bot_cars_velocities[i][1] += speed * bot_cars_dir[i].dir2;

                bot_cars_velocities[i][0] *= friction;
                bot_cars_velocities[i][1] *= friction;
                if (
                    bot_cars[i].position.x < -29.3 &&
                    bot_cars[i].position.x > -40
                ) {
                    if (bot_cars_velocities[i][1] < 0) {
                        bot_cars_velocities[i][1] *= -1;
                    }
                    if (
                        bot_cars[i].position.x + bot_cars_velocities[i][0] >=
                            -29.3 ||
                        bot_cars[i].position.x + bot_cars_velocities[i][0] <=
                            -40
                    ) {
                        bot_cars_velocities[i][0] = 0;
                    }
                } else if (
                    bot_cars[i].position.x < 42 &&
                    bot_cars[i].position.x > 31.4
                ) {
                    if (bot_cars_velocities[i][1] > 0) {
                        bot_cars_velocities[i][1] *= -1;
                    }
                    if (
                        bot_cars[i].position.x + bot_cars_velocities[i][0] >=
                            42 ||
                        bot_cars[i].position.x + bot_cars_velocities[i][0] <=
                            31.4
                    ) {
                        bot_cars_velocities[i][0] = 0;
                    }
                } else if (bot_cars[i].position.x < 0) {
                    bot_cars[i].position.x += 0.1;
                    bot_cars_velocities[i][0] = 0;
                    bot_cars_velocities[i][1] = 0;
                } else {
                    bot_cars[i].position.x -= 0.1;
                    bot_cars_velocities[i][0] = 0;
                    bot_cars_velocities[i][1] = 0;
                }
            } else {
                if (bot_cars[i].position.y > 60) {
                    let dis_vec = {
                        x: bot_cars[i].position.x - 1.05,
                        y: bot_cars[i].position.y - 63,
                        z: 14,
                    };
                    let len = Math.sqrt(
                        dis_vec.x * dis_vec.x + dis_vec.y * dis_vec.y
                    );
                    dis_vec = { x: dis_vec.x / len, y: dis_vec.y / len, z: 14 };
                    let per_vec = { x: dis_vec.y, y: -dis_vec.x, z: 14 };
                    bot_per_vec[i] = {
                        x: per_vec.x * speed * 29,
                        y: per_vec.y * speed * 29,
                        z: 14,
                    };

                    let angle = Math.atan2(bot_per_vec[i].x, bot_per_vec[i].y);
                    bot_cars[i].rotation.y = angle;
                } else {
                    let dis_vec = {
                        x: bot_cars[i].position.x - 1.05,
                        y: bot_cars[i].position.y + 55,
                        z: 14,
                    };
                    let len = Math.sqrt(
                        dis_vec.x * dis_vec.x + dis_vec.y * dis_vec.y
                    );
                    dis_vec = { x: dis_vec.x / len, y: dis_vec.y / len, z: 14 };
                    let per_vec = { x: dis_vec.y, y: -dis_vec.x, z: 14 };
                    bot_per_vec[i] = {
                        x: per_vec.x * speed * 29,
                        y: per_vec.y * speed * 29,
                        z: 14,
                    };

                    let angle = Math.atan2(bot_per_vec[i].x, bot_per_vec[i].y);
                    bot_cars[i].rotation.y = angle;
                }
            }
        }
    }

    if (carPosKey[0] != 0) {
        Car.rotation.y += carPosKey[0] * 0.02;
        dir1 = Math.sin(Car.rotation.y);
        dir2 = Math.cos(Car.rotation.y);
        car_collision_points = [
            {
                x: Car.position.x + 0.5 * Math.sin(Car.rotation.y),
                y: Car.position.y + 0.5 * Math.cos(Car.rotation.y),
                z: 14,
            },
            { x: Car.position.x, y: Car.position.y + 0, z: 14 },
            {
                x: Car.position.x - 0.5 * Math.sin(Car.rotation.y),
                y: Car.position.y - 0.5 * Math.cos(Car.rotation.y),
                z: 14,
            },
        ];
    }

    car_velocity[0] += carPosKey[1] * 0.015 * dir1;
    car_velocity[1] += carPosKey[1] * 0.015 * dir2;

    car_velocity[0] *= friction;
    car_velocity[1] *= friction;

    if (additional_frames > 0) {
        if (Car.position.y > -60 && Car.position.y < 60) {
            if (Car.position.x < -29.3 && Car.position.x > -40.7) {
                if (
                    Car.position.x + car_velocity[0] >= -29.3 ||
                    Car.position.x + car_velocity[0] <= -40.7
                ) {
                    car_velocity[0] = 0;
                }
            } else if (Car.position.x < 42.6 && Car.position.x > 31.4) {
                if (
                    Car.position.x + car_velocity[0] >= 42.6 ||
                    Car.position.x + car_velocity[0] <= 31.4
                ) {
                    car_velocity[0] = 0;
                }
            }
        } else {
            if (Car.position.y > 60) {
                var length = Math.sqrt(
                    Math.pow(
                        Math.abs(Car.position.x + car_velocity[0] - 1.05),
                        2
                    ) +
                        Math.pow(
                            Math.abs(Car.position.y + car_velocity[1] - 63),
                            2
                        )
                );

                if (length <= 30.35 || length >= 42.2) {
                    car_velocity[0] = 0;
                    car_velocity[1] = 0;
                }
            } else {
                var length = Math.sqrt(
                    Math.pow(
                        Math.abs(Car.position.x + car_velocity[0] - 1.05),
                        2
                    ) +
                        Math.pow(
                            Math.abs(Car.position.y + car_velocity[1] + 55),
                            2
                        )
                );

                if (length <= 30.35 || length >= 42.2) {
                    car_velocity[0] = 0;
                    car_velocity[1] = 0;
                }
            }
        }
    }

    let cars_collision_points = [
        car_collision_points,
        ...bot_cars_collision_points,
    ];

    let velocities = [car_velocity, ...bot_cars_velocities];

    for (let i = 0; i < cars.length; i++) {
        for (let j = i + 1; j < cars.length; j++) {
            if (
                cars[i].position.distanceTo(cars_collision_points[j][0]) < 2 ||
                cars[i].position.distanceTo(cars_collision_points[j][1]) < 2 ||
                cars[i].position.distanceTo(cars_collision_points[j][2]) < 2
            ) {
                if (cars[i].position.y < 60 && cars[i].position.y > -60) {
                    if (cars_collision[i] == false) {
                        cars_health[i] -= 10;
                        cars_collision[i] = true;
                    }
                    if (cars_collision[j] == false) {
                        cars_health[j] -= 10;
                        cars_collision[j] = true;
                    }

                    if (cars[i].position.x < 0) {
                        if (cars[i].position.y > cars[j].position.y) {
                            velocities[j][0] = 0;
                            velocities[j][1] = 0;
                        } else {
                            velocities[i][0] = 0;
                            velocities[i][1] = 0;
                        }
                    } else {
                        if (cars[i].position.y < cars[j].position.y) {
                            velocities[j][0] = 0;
                            velocities[j][1] = 0;
                        } else {
                            velocities[i][0] = 0;
                            velocities[i][1] = 0;
                        }
                    }
                } else {
                    if (cars_collision[i] == false) {
                        cars_health[i] -= 10;
                        cars_collision[i] = true;
                    }
                    if (cars_collision[j] == false) {
                        cars_health[j] -= 10;
                        cars_collision[j] = true;
                    }

                    if (cars[i].position.y < -60) {
                        let pos_vec1 = {
                            x: cars[i].position.x - 1.05,
                            y: cars[i].position.y + 55,
                        };
                        let pos_vec2 = {
                            x: cars[j].position.x - 1.05,
                            y: cars[j].position.y + 55,
                        };

                        let angle = Math.atan2(
                            pos_vec2.y - pos_vec1.y,
                            pos_vec2.x - pos_vec1.x
                        );

                        if (angle > 0) {
                            bot_per_vec[j - 1].x = 0;
                            bot_per_vec[j - 1].y = 0;
                        } else {
                            if (i == 0) {
                                velocities[i][0] = 0;
                                velocities[i][1] = 0;
                            } else {
                                bot_per_vec[i - 1].x = 0;
                                bot_per_vec[i - 1].y = 0;
                            }
                        }
                    } else {
                        let pos_vec1 = {
                            x: cars[i].position.x - 1.05,
                            y: cars[i].position.y - 63,
                        };
                        let pos_vec2 = {
                            x: cars[j].position.x - 1.05,
                            y: cars[j].position.y - 63,
                        };

                        let angle = Math.atan2(
                            pos_vec2.y - pos_vec1.y,
                            pos_vec2.x - pos_vec1.x
                        );

                        if (angle > 0) {
                            bot_per_vec[j - 1].x = 0;
                            bot_per_vec[j - 1].y = 0;
                        } else {
                            if (i == 0) {
                                velocities[i][0] = 0;
                                velocities[i][1] = 0;
                            } else {
                                bot_per_vec[i - 1].x = 0;
                                bot_per_vec[i - 1].y = 0;
                            }
                        }
                    }
                }
            }
        }
    }

    for (let i = 0; i < 3; i++) {
        if (bot_cars[i].position.y > -60 && bot_cars[i].position.y < 60) {
            if (
                bot_cars[i].position.y < 0 &&
                bot_cars[i].position.y + bot_cars_velocities[i][1] > 0 &&
                bot_cars[i].position.x < 0
            ) {
                cars_laps[i + 1] += 1;
                if (cars_laps[i + 1] == 5) {
                    cars_end_times[i + 1] = Date.now();
                }
            } else if (
                bot_cars[i].position.y > 0 &&
                bot_cars[i].position.y + bot_cars_velocities[i][1] < 0 &&
                bot_cars[i].position.x < 0
            ) {
                cars_laps[i + 1] -= 1;
            }
            bot_cars[i].position.x += bot_cars_velocities[i][0];
            bot_cars[i].position.y += bot_cars_velocities[i][1];
        } else {
            bot_cars[i].position.x += bot_per_vec[i].x;
            bot_cars[i].position.y += bot_per_vec[i].y;
        }
    }

    if (
        Car.position.y < 0 &&
        Car.position.y + car_velocity[1] > 0 &&
        Car.position.x < 0
    ) {
        cars_laps[0] += 1;
        if (cars_laps[0] == 5) {
            cars_end_times[0] = Date.now();
        }
    } else if (
        Car.position.y > 0 &&
        Car.position.y + car_velocity[1] < 0 &&
        Car.position.x < 0
    ) {
        cars_laps[0] -= 1;
    }
    Car.position.x += car_velocity[0];
    Car.position.y += car_velocity[1];

    if (camera_toggle) {
        camera.position.x = Car.position.x;
        camera.position.y = Car.position.y;
        camera.position.z = 13;
        camera.rotation.x = -Math.PI / 2;
        camera.rotation.y = Car.rotation.y + Math.PI;
        camera.rotation.z = 0;
        Car.scale.set(0.4, 0.4, 0.4);
    } else {
        camera.position.x = Car.position.x - 4 * Math.sin(Car.rotation.y);
        camera.position.y = Car.position.y - 4 * Math.cos(Car.rotation.y);
        camera.position.z = 12;
        camera.rotation.x = -Math.PI / 2;
        camera.rotation.y = Car.rotation.y + Math.PI;
        camera.rotation.z = 0;
        Car.scale.set(0.4, 0.42, 0.4);
    }

    map_camera.position.z = 12;
    map_camera.position.x = Car.position.x;
    map_camera.position.y = Car.position.y;
    map_camera.lookAt(Car.position);

    map_camera.rotation.z = Car.rotation.y + Math.PI;
}

// Fuel cans

let fuel_cans = [];
let fuel_positions = [];

for (let i = 0; i < 15; i++) {
    let fuel_can = new THREE.Mesh();

    let fuel_loader = new GLTFLoader();
    fuel_loader.load("./../src/fuel_tank.glb", function (gltf) {
        fuel_can.add(gltf.scene);
    });

    fuel_can.scale.set(1.5, 1.5, 1.5);

    fuel_can.rotation.z = Math.PI;

    let y = Math.random() * 199 - 95;
    if (y < 60 && y > -60) {
        let x = Math.random() * 17 - 8;
        if (x < 0) {
            x -= 31;
        } else {
            x += 32;
        }
        fuel_can.position.set(x, y, 14);
    } else if (y < -60) {
        let min_x = 1.05 + Math.sqrt(Math.pow(31, 2) - Math.pow(y + 55, 2));
        let max_x = 1.05 + Math.sqrt(Math.pow(41, 2) - Math.pow(y + 55, 2));
        let x = Math.random() * (max_x - min_x) + min_x;
        if (Math.random() > 0.5) {
            x *= -1;
        }
        fuel_can.position.set(x, y, 14);
    } else {
        let min_x = 1.05 + Math.sqrt(Math.pow(31, 2) - Math.pow(y - 63, 2));
        let max_x = 1.05 + Math.sqrt(Math.pow(41, 2) - Math.pow(y - 63, 2));
        let x = Math.random() * (max_x - min_x) + min_x;
        if (Math.random() > 0.5) {
            x *= -1;
        }
        fuel_can.position.set(x, y, 14);
    }

    fuel_can.rotation.x = 1.57;
    fuel_cans.push(fuel_can);
    fuel_positions.push(fuel_can.position);
    scene.add(fuel_can);
}

function fuelCollision() {
    let a = 0;
    cars.forEach((c) => {
        for (let i = 0; i < fuel_cans.length; i++) {
            if (fuel_cans[i].position.distanceTo(c.position) < 1) {
                if (a == 0) {
                    cars_fuel[a] += 30;
                    if (cars_fuel[a] > 30) {
                        cars_fuel[a] = 30;
                    }
                } else {
                    cars_fuel[a] += 50;
                    if (cars_fuel[a] > 50) {
                        cars_fuel[a] = 50;
                    }
                }

                scene.remove(fuel_cans[i]);
                fuel_cans.splice(i, 1);
                fuel_positions.splice(i, 1);

                let fuel_can = new THREE.Mesh();

                let fuel_loader = new GLTFLoader();
                fuel_loader.load("./../src/fuel_tank.glb", function (gltf) {
                    fuel_can.add(gltf.scene);
                });

                fuel_can.scale.set(1.5, 1.5, 1.5);

                fuel_can.rotation.z = Math.PI;

                let y = Math.random() * 199 - 95;
                if (y < 60 && y > -60) {
                    let x = Math.random() * 17 - 8;
                    if (x < 0) {
                        x -= 31;
                    } else {
                        x += 32;
                    }
                    fuel_can.position.set(x, y, 14);
                } else if (y < -60) {
                    let min_x =
                        1.05 + Math.sqrt(Math.pow(31, 2) - Math.pow(y + 55, 2));
                    let max_x =
                        1.05 + Math.sqrt(Math.pow(41, 2) - Math.pow(y + 55, 2));
                    let x = Math.random() * (max_x - min_x) + min_x;
                    if (Math.random() > 0.5) {
                        x *= -1;
                    }
                    fuel_can.position.set(x, y, 14);
                } else {
                    let min_x =
                        1.05 + Math.sqrt(Math.pow(31, 2) - Math.pow(y - 63, 2));
                    let max_x =
                        1.05 + Math.sqrt(Math.pow(41, 2) - Math.pow(y - 63, 2));
                    let x = Math.random() * (max_x - min_x) + min_x;
                    if (Math.random() > 0.5) {
                        x *= -1;
                    }
                    fuel_can.position.set(x, y, 14);
                }

                fuel_can.rotation.x = 1.57;
                fuel_cans.push(fuel_can);
                fuel_positions.push(fuel_can.position);
                scene.add(fuel_can);

                break;
            }
        }
        a++;
    });
    a = 0;
}

// Data maintanance and heads up display

var Time = document.createElement("div");
Time.style.position = "absolute";
Time.style.width = 100;
Time.style.height = 100;
Time.style.color = "white";
Time.style.top = 20 + "px";
Time.style.left = 20 + "px";
Time.style.fontSize = 30 + "px";
Time.innerHTML = "Time : 0";

var Health = document.createElement("div");
Health.style.position = "absolute";
Health.style.width = 100;
Health.style.height = 100;
Health.style.color = "white";
Health.style.top = 50 + "px";
Health.style.left = 20 + "px";
Health.style.fontSize = 30 + "px";
Health.innerHTML = "Health : 100";

var Fuel = document.createElement("div");
Fuel.style.position = "absolute";
Fuel.style.width = 100;
Fuel.style.height = 100;
Fuel.style.color = "white";
Fuel.style.top = 80 + "px";
Fuel.style.left = 20 + "px";
Fuel.style.fontSize = 30 + "px";
Fuel.innerHTML = "Fuel : 100";

var Mileage = document.createElement("div");
Mileage.style.position = "absolute";
Mileage.style.width = 100;
Mileage.style.height = 100;
Mileage.style.color = "white";
Mileage.style.top = 110 + "px";
Mileage.style.left = 20 + "px";
Mileage.style.fontSize = 30 + "px";
Mileage.innerHTML = "Mileage : 0";

var Next = document.createElement("div");
Next.style.position = "absolute";
Next.style.width = 100;
Next.style.height = 100;
Next.style.color = "white";
Next.style.top = 140 + "px";
Next.style.left = 20 + "px";
Next.style.fontSize = 30 + "px";
Next.innerHTML = "Next Fuel : 0";

var map_renderer = new THREE.WebGLRenderer({ antialias: true });
map_renderer.setSize(window.innerWidth / 4, window.innerHeight / 4);
map_renderer.setClearColor(0x000000);
map_renderer.domElement.style.position = "absolute";
map_renderer.domElement.style.top = 20 + "px";
map_renderer.domElement.style.right = 20 + "px";
map_renderer.domElement.style.border = "5px solid black";

var map_camera = new THREE.OrthographicCamera(
    window.innerWidth / -40,
    window.innerWidth / 40,
    window.innerHeight / 40,
    window.innerHeight / -40,
    1,
    1000
);
map_camera.position.set(Car.position.x, Car.position.y, Car.position.z + 10);
map_camera.lookAt(Car.position);
map_camera.rotation.z = 1.57;

let start_screen = document.createElement("div");
let start_image = document.createElement("img");
start_image.src = "./../src/start page.png";
start_image.style.width = "100%";
start_image.style.height = "100%";
start_screen.appendChild(start_image);
start_screen.style.position = "absolute";
start_screen.style.top = 0;
start_screen.style.left = 0;
start_screen.style.width = "100%";
start_screen.style.height = "100%";
start_screen.style.zIndex = 1;
start_screen.style.backgroundColor = "rgba(0,0,0,0)";

let additional_frames = 60;

function animate() {
    if (cars_laps[0] < 5 && cars_health[0] > 0) {
        requestAnimationFrame(animate);
    } else {
        if (additional_frames == 0) {
            camera.position.set(0, -20, -5);
            camera.lookAt(-32, 0, 13);
            camera.rotation.z = 2.5;

            renderer.render(scene, camera);
            endGame();
        } else {
            requestAnimationFrame(animate);
        }
    }

    if (additional_frames != 0) {
        if (cars_laps[0] < 5) {
            additional_frames = 60;
        } else {
            additional_frames--;
        }

        updateCar();

        fuelCollision();

        let time_diff = Date.now() - start_time;

        Time.innerHTML = "Time : " + Math.floor(time_diff / 1000);
        Health.innerHTML = "Health : " + cars_health[0];
        Fuel.innerHTML = "Fuel : " + Math.floor(cars_fuel[0] * 3.3333);
        Mileage.innerHTML =
            "Mileage : " +
            Math.floor(
                Math.sqrt(
                    Math.pow(car_velocity[0], 2) + Math.pow(car_velocity[1], 2)
                ) * 100
            );
        let closest = 100;
        for (let i = 0; i < fuel_positions.length; i++) {
            let distance = Car.position.distanceTo(fuel_positions[i]);
            if (distance < closest) {
                closest = distance;
            }
        }
        Next.innerHTML = "Next Fuel : " + Math.floor(closest);
        renderer.render(scene, camera);
        map_renderer.render(scene, map_camera);
    }
}

// Game sequence

function startSequence() {
    camera.position.set(0, -20, -5);
    camera.lookAt(-32, 0, 13);
    camera.rotation.z = 2.5;
    renderer.render(scene, camera);
    document.body.appendChild(start_screen);
    let space = document.addEventListener("keydown", (event) => {
        if (event.keyCode == 32) {
            document.removeEventListener("keydown", space);
            startGame();
        }
    });
}

function startGame() {
    document.body.removeChild(start_screen);

    document.body.appendChild(Time);
    document.body.appendChild(Health);
    document.body.appendChild(Fuel);
    document.body.appendChild(Mileage);
    document.body.appendChild(Next);

    document.body.appendChild(map_renderer.domElement);

    camera.position.x = Car.position.x - 4 * Math.sin(Car.rotation.y);
    camera.position.y = Car.position.y - 4 * Math.cos(Car.rotation.y);
    camera.position.z = 12;
    camera.rotation.x = -Math.PI / 2;
    camera.rotation.y = Car.rotation.y + Math.PI;
    camera.rotation.z = 0;

    map_camera.position.z = 12;
    map_camera.position.x = Car.position.x;
    map_camera.position.y = Car.position.y;
    map_camera.lookAt(Car.position);

    Car.scale.set(0.4, 0.42, 0.4);
    renderer.render(scene, camera);
    map_renderer.render(scene, map_camera);

    let countdown = document.createElement("div");
    countdown.style.position = "absolute";
    countdown.style.top = "0";
    countdown.style.left = "50%";
    countdown.style.fontSize = "100px";
    countdown.style.fontFamily = "Arial";
    countdown.style.color = "white";
    countdown.style.zIndex = 2;
    countdown.innerHTML = "3";
    document.body.appendChild(countdown);

    let fuelReducer = setInterval(() => {
        for (let i = 0; i < 4; i++) {
            if (cars_fuel[i] > 0) {
                cars_fuel[i] -= 1;
                if (cars_fuel[i] == 0) {
                    console.log(i);
                }
            } else {
                cars[i].position.set(0, 0, 20);
            }
        }
    }, 1000);

    let healthChecker = setInterval(() => {
        for (let i = 0; i < 4; i++) {
            if (cars_health[i] <= 0) {
                cars[i].position.set(0, 0, 20);
            }
        }
    }, 1000);

    let collisionChecker = setInterval(() => {
        cars_collision = [false, false, false, false];
    }, 1000);

    let count = 2;
    let countdownFunc = setInterval(() => {
        if (count == 0) {
            clearInterval(countdownFunc);
            start_time = Date.now();
            document.body.removeChild(countdown);
            cars_fuel = [30, 50, 50, 50];
            animate();
        } else {
            count--;
            countdown.innerHTML = count + 1;
        }
    }, 1000);

    let disappearChecker = setInterval(() => {
        for (let i = 0; i < 3; i++) {
            if (cars_laps[i + 1] == 5 && cars[i + 1].position.y > 30) {
                cars[i + 1].position.set(0, 20, 20);
            }
        }
    }, 1000);
}

let end_screen = document.createElement("div");
end_screen.style.position = "absolute";
end_screen.style.top = 0;
end_screen.style.left = 0;
end_screen.style.width = "100%";
end_screen.style.height = "100%";
end_screen.style.zIndex = 1;
end_screen.style.backgroundColor = "rgba(0,0,0,0)";

function endGame() {
    document.body.removeChild(Time);
    document.body.removeChild(Health);
    document.body.removeChild(Fuel);
    document.body.removeChild(Mileage);
    document.body.removeChild(Next);
    document.body.removeChild(map_renderer.domElement);

    let end_text = document.createElement("div");
    end_text.style.position = "absolute";
    end_text.style.top = "10%";
    end_text.style.left = "50%";
    end_text.style.fontSize = "100px";
    end_text.style.fontFamily = "Arial";
    end_text.style.color = "white";
    end_text.style.zIndex = 2;
    end_text.style.transform = "translate(-50%, -50%)";
    end_text.innerHTML = "Game Over";
    end_screen.appendChild(end_text);

    let leaderboard = document.createElement("div");
    leaderboard.style.position = "absolute";
    leaderboard.style.top = "30%";
    leaderboard.style.left = "50%";
    leaderboard.style.fontSize = "50px";
    leaderboard.style.fontFamily = "Arial";
    leaderboard.style.color = "white";
    leaderboard.style.zIndex = 2;
    leaderboard.style.transform = "translate(-50%, -50%)";
    leaderboard.style.marginTop = "100px";
    leaderboard.innerHTML = "Leaderboard";

    // get the highest positive value from the array cars_end_times
    let max = Math.max(...cars_end_times);

    for (let i = 0; i < 4; i++) {
        if (cars_end_times[i] < 0) {
            cars_end_times[i] = max + 1000;
        }
    }

    let scores = [
        3000 +
            cars_laps[0] * 1000 +
            cars_health[0] * 10 -
            (cars_end_times[0] - start_time) / 100,
        3000 +
            cars_laps[1] * 1000 +
            cars_health[1] * 10 -
            (cars_end_times[1] - start_time) / 100,
        3000 +
            cars_laps[2] * 1000 +
            cars_health[2] * 10 -
            (cars_end_times[2] - start_time) / 100,
        3000 +
            cars_laps[3] * 1000 +
            cars_health[3] * 10 -
            (cars_end_times[3] - start_time) / 100,
    ];

    scores = [
        ["McQueen", scores[0], cars_end_times[0] - start_time],
        ["Mater", scores[1], cars_end_times[1] - start_time],
        ["King", scores[2], cars_end_times[2] - start_time],
        ["Chick", scores[3], cars_end_times[3] - start_time],
    ];

    scores.sort((a, b) => a[2] - b[2]);

    let leaderboard_text = document.createElement("div");
    leaderboard_text.style.position = "absolute";
    leaderboard_text.style.top = "55%";
    leaderboard_text.style.left = "50%";
    leaderboard_text.style.fontSize = "50px";
    leaderboard_text.style.fontWeight = "bold";
    leaderboard_text.style.fontFamily = "Arial";
    leaderboard_text.style.color = "white";
    leaderboard_text.style.zIndex = 2;
    leaderboard_text.style.transform = "translate(-50%, -50%)";
    leaderboard_text.style.marginTop = "100px";
    leaderboard_text.innerHTML =
        "1. " +
        scores[0][0] +
        " - " +
        scores[0][1] +
        "<br>2. " +
        scores[1][0] +
        " - " +
        scores[1][1] +
        "<br>3. " +
        scores[2][0] +
        " - " +
        scores[2][1] +
        "<br>4. " +
        scores[3][0] +
        " - " +
        scores[3][1];

    end_screen.appendChild(leaderboard);
    end_screen.appendChild(leaderboard_text);

    document.body.appendChild(end_screen);

    camera.position.set(0, -20, -5);
    camera.lookAt(-32, 0, 13);
    camera.rotation.z = 2.5;

    renderer.render(scene, camera);

    return;
}
