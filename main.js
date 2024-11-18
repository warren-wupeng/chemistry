// 初始化场景、相机和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建原子核
const nucleus = new THREE.Group();
scene.add(nucleus);

// 添加质子
const protonGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const protonMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// 添加中子
const neutronGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const neutronMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// 创建电子并围绕原子核旋转
const electronGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const electronMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const electrons = [];

const elements = {
  oxygen: { protons: 8, neutrons: 8, electrons: 8 },
  silicon: { protons: 14, neutrons: 14, electrons: 14 },
  aluminum: { protons: 13, neutrons: 14, electrons: 13 },
  iron: { protons: 26, neutrons: 30, electrons: 26 },
  calcium: { protons: 20, neutrons: 20, electrons: 20 },
  sodium: { protons: 11, neutrons: 12, electrons: 11 },
  potassium: { protons: 19, neutrons: 20, electrons: 19 },
};

function createAtom(element) {
  // 清空场景中的原子核和电子
  while (nucleus.children.length > 0) {
    nucleus.remove(nucleus.children[0]);
  }
  electrons.forEach((electron) => scene.remove(electron));
  electrons.length = 0;

  // 添加质子
  for (let i = 0; i < element.protons; i++) {
    const proton = new THREE.Mesh(protonGeometry, protonMaterial);
    proton.position.set(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    );
    nucleus.add(proton);
  }

  // 添加中子
  for (let i = 0; i < element.neutrons; i++) {
    const neutron = new THREE.Mesh(neutronGeometry, neutronMaterial);
    neutron.position.set(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    );
    nucleus.add(neutron);
  }

  // 添加电子
  for (let i = 0; i < element.electrons; i++) {
    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    electron.position
      .set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
      .normalize()
      .multiplyScalar(2);
    scene.add(electron);
    electrons.push(electron);
  }

  // 更新描述信息
  document.getElementById("proton-count").textContent = element.protons;
  document.getElementById("neutron-count").textContent = element.neutrons;
  document.getElementById("electron-count").textContent = element.electrons;
}

// 监听元素选择变化
document
  .getElementById("element-select")
  .addEventListener("change", (event) => {
    const element = elements[event.target.value];
    createAtom(element);
  });

// 初始化默认元素
createAtom(elements.oxygen);

camera.position.z = 5;

let isPaused = false;

document.addEventListener("click", () => {
  isPaused = !isPaused;
});

// 渲染循环
function animate() {
  requestAnimationFrame(animate);

  if (!isPaused) {
    // 旋转原子核
    nucleus.rotation.x += 0.01;
    nucleus.rotation.y += 0.01;

    // 电子围绕原子核旋转
    electrons.forEach((electron, index) => {
      const angle = Date.now() * 0.001 + index * Math.PI;
      electron.position.x = Math.cos(angle) * 2;
      electron.position.z = Math.sin(angle) * 2;
    });
  }

  renderer.render(scene, camera);
}
animate();
