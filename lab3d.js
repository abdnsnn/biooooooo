// 3D Laboratory Environment Setup
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Main Laboratory Class
class BiochemistryLab {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.controls = null;
    this.mixer = null;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.interactiveObjects = [];
    this.currentExperiment = null;
    this.labModels = {};
    this.experimentModels = {};
    this.lights = [];
    this.animations = {};
    
    this.init();
  }
  
  init() {
    // Setup renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);
    
    // Setup camera
    this.camera.position.set(0, 1.6, 3);
    
    // Setup controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 1, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2;
    
    // Setup lighting
    this.setupLighting();
    
    // Setup laboratory environment
    this.loadLabEnvironment();
    
    // Setup event listeners
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    this.container.addEventListener('click', this.onMouseClick.bind(this), false);
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    
    // Start animation loop
    this.animate();
  }
  
  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    this.lights.push(ambientLight);
    
    // Directional light (sun-like)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    this.scene.add(directionalLight);
    this.lights.push(directionalLight);
    
    // Point lights for laboratory
    const pointLight1 = new THREE.PointLight(0xffffff, 0.8, 10);
    pointLight1.position.set(2, 2.5, 2);
    pointLight1.castShadow = true;
    this.scene.add(pointLight1);
    this.lights.push(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 0.8, 10);
    pointLight2.position.set(-2, 2.5, -2);
    pointLight2.castShadow = true;
    this.scene.add(pointLight2);
    this.lights.push(pointLight2);
  }
  
  loadLabEnvironment() {
    // Setup loaders
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    
    // Load laboratory model
    gltfLoader.load('/assets/3d_models/laboratory/lab_environment.glb', (gltf) => {
      const model = gltf.scene;
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      this.scene.add(model);
      this.labModels.mainLab = model;
      
      // Load laboratory equipment
      this.loadLabEquipment();
    });
  }
  
  loadLabEquipment() {
    const gltfLoader = new GLTFLoader();
    
    // Load microscope
    gltfLoader.load('/assets/3d_models/equipment/microscope.glb', (gltf) => {
      const model = gltf.scene;
      model.position.set(1.5, 0.8, 0.5);
      model.scale.set(0.5, 0.5, 0.5);
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.name.includes('interactive')) {
            this.interactiveObjects.push(child);
            child.userData.type = 'equipment';
            child.userData.name = 'microscope';
          }
        }
      });
      
      this.scene.add(model);
      this.labModels.microscope = model;
    });
    
    // Load centrifuge
    gltfLoader.load('/assets/3d_models/equipment/centrifuge.glb', (gltf) => {
      const model = gltf.scene;
      model.position.set(-1.5, 0.8, 0.5);
      model.scale.set(0.5, 0.5, 0.5);
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.name.includes('interactive')) {
            this.interactiveObjects.push(child);
            child.userData.type = 'equipment';
            child.userData.name = 'centrifuge';
          }
        }
      });
      
      this.scene.add(model);
      this.labModels.centrifuge = model;
    });
    
    // Load spectrophotometer
    gltfLoader.load('/assets/3d_models/equipment/spectrophotometer.glb', (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0.8, -1.5);
      model.scale.set(0.5, 0.5, 0.5);
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.name.includes('interactive')) {
            this.interactiveObjects.push(child);
            child.userData.type = 'equipment';
            child.userData.name = 'spectrophotometer';
          }
        }
      });
      
      this.scene.add(model);
      this.labModels.spectrophotometer = model;
    });
    
    // Load PCR machine
    gltfLoader.load('/assets/3d_models/equipment/pcr_machine.glb', (gltf) => {
      const model = gltf.scene;
      model.position.set(1.5, 0.8, -1.5);
      model.scale.set(0.5, 0.5, 0.5);
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.name.includes('interactive')) {
            this.interactiveObjects.push(child);
            child.userData.type = 'equipment';
            child.userData.name = 'pcr_machine';
          }
        }
      });
      
      this.scene.add(model);
      this.labModels.pcrMachine = model;
    });
    
    // Load electrophoresis apparatus
    gltfLoader.load('/assets/3d_models/equipment/electrophoresis.glb', (gltf) => {
      const model = gltf.scene;
      model.position.set(-1.5, 0.8, -1.5);
      model.scale.set(0.5, 0.5, 0.5);
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.name.includes('interactive')) {
            this.interactiveObjects.push(child);
            child.userData.type = 'equipment';
            child.userData.name = 'electrophoresis';
          }
        }
      });
      
      this.scene.add(model);
      this.labModels.electrophoresis = model;
    });
  }
  
  loadExperimentModels(experimentType) {
    // Clear previous experiment models
    if (this.experimentModels[experimentType]) {
      this.experimentModels[experimentType].forEach(model => {
        this.scene.remove(model);
      });
    }
    
    this.experimentModels[experimentType] = [];
    
    const gltfLoader = new GLTFLoader();
    
    switch (experimentType) {
      case 'protein_analysis':
        // Load protein models
        gltfLoader.load('/assets/3d_models/experiments/protein/protein_sample.glb', (gltf) => {
          const model = gltf.scene;
          model.position.set(0, 0.9, 0);
          model.scale.set(0.2, 0.2, 0.2);
          this.scene.add(model);
          this.experimentModels[experimentType].push(model);
        });
        break;
        
      case 'dna_extraction':
        // Load DNA models
        gltfLoader.load('/assets/3d_models/experiments/dna/dna_sample.glb', (gltf) => {
          const model = gltf.scene;
          model.position.set(0, 0.9, 0);
          model.scale.set(0.2, 0.2, 0.2);
          this.scene.add(model);
          this.experimentModels[experimentType].push(model);
        });
        break;
        
      case 'lipid_analysis':
        // Load lipid models
        gltfLoader.load('/assets/3d_models/experiments/lipid/lipid_sample.glb', (gltf) => {
          const model = gltf.scene;
          model.position.set(0, 0.9, 0);
          model.scale.set(0.2, 0.2, 0.2);
          this.scene.add(model);
          this.experimentModels[experimentType].push(model);
        });
        break;
        
      // Add more experiment types as needed
    }
  }
  
  startExperiment(experimentId) {
    // Load experiment data
    fetch(`/assets/experiments/${experimentId}.json`)
      .then(response => response.json())
      .then(data => {
        this.currentExperiment = data;
        
        // Load experiment models
        this.loadExperimentModels(data.type);
        
        // Update UI
        this.updateExperimentUI(data);
        
        // Show experiment interface
        document.getElementById('experiment-interface').style.display = 'block';
      });
  }
  
  updateExperimentUI(experimentData) {
    const experimentTitle = document.getElementById('experiment-title');
    const experimentObjectives = document.getElementById('experiment-objectives');
    const experimentIntroduction = document.getElementById('experiment-introduction');
    const experimentSteps = document.getElementById('experiment-steps');
    
    experimentTitle.textContent = experimentData.title;
    
    // Clear previous content
    experimentObjectives.innerHTML = '';
    experimentIntroduction.innerHTML = experimentData.introduction;
    experimentSteps.innerHTML = '';
    
    // Add objectives
    experimentData.objectives.forEach(objective => {
      const li = document.createElement('li');
      li.textContent = objective;
      experimentObjectives.appendChild(li);
    });
    
    // Add steps
    experimentData.steps.forEach((step, index) => {
      const stepElement = document.createElement('div');
      stepElement.className = 'experiment-step';
      stepElement.innerHTML = `
        <div class="step-number">${index + 1}</div>
        <div class="step-content">
          <h4>${step.title}</h4>
          <p>${step.description}</p>
        </div>
        <button class="step-button" data-step="${index}">تنفيذ</button>
      `;
      experimentSteps.appendChild(stepElement);
      
      // Add event listener to step button
      stepElement.querySelector('.step-button').addEventListener('click', () => {
        this.executeExperimentStep(index);
      });
    });
  }
  
  executeExperimentStep(stepIndex) {
    const step = this.currentExperiment.steps[stepIndex];
    
    // Update UI to show current step
    const stepElements = document.querySelectorAll('.experiment-step');
    stepElements.forEach((el, i) => {
      if (i === stepIndex) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
    
    // Execute step animation or action
    if (step.animation) {
      this.playStepAnimation(step.animation);
    }
    
    // Show step result if available
    if (step.result) {
      this.showStepResult(step.result);
    }
    
    // Check if this is the last step
    if (stepIndex === this.currentExperiment.steps.length - 1) {
      this.showExperimentCompletion();
    }
  }
  
  playStepAnimation(animationName) {
    // Implementation depends on how animations are set up
    console.log(`Playing animation: ${animationName}`);
    
    // Example implementation
    switch (animationName) {
      case 'mix_samples':
        // Animation for mixing samples
        break;
        
      case 'heat_sample':
        // Animation for heating sample
        break;
        
      case 'centrifuge_sample':
        // Animation for centrifuging sample
        break;
        
      // Add more animations as needed
    }
  }
  
  showStepResult(result) {
    const resultContainer = document.getElementById('step-result');
    resultContainer.innerHTML = `
      <h4>نتيجة الخطوة</h4>
      <p>${result.description}</p>
    `;
    
    if (result.image) {
      const img = document.createElement('img');
      img.src = result.image;
      img.alt = 'نتيجة الخطوة';
      resultContainer.appendChild(img);
    }
    
    resultContainer.style.display = 'block';
  }
  
  showExperimentCompletion() {
    const completionContainer = document.getElementById('experiment-completion');
    completionContainer.innerHTML = `
      <h3>تهانينا! لقد أكملت التجربة بنجاح</h3>
      <p>${this.currentExperiment.conclusion}</p>
      <button id="post-quiz-button">بدء الاختبار البعدي</button>
    `;
    
    completionContainer.style.display = 'block';
    
    // Add event listener to post-quiz button
    document.getElementById('post-quiz-button').addEventListener('click', () => {
      this.startPostQuiz();
    });
  }
  
  startPreQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
      <h3>الاختبار القبلي</h3>
      <p>أجب عن الأسئلة التالية قبل بدء التجربة:</p>
      <div id="quiz-questions"></div>
      <button id="submit-quiz">تقديم الإجابات</button>
    `;
    
    const questionsContainer = document.getElementById('quiz-questions');
    
    // Add quiz questions
    this.currentExperiment.preQuiz.forEach((question, index) => {
      const questionElement = document.createElement('div');
      questionElement.className = 'quiz-question';
      questionElement.innerHTML = `
        <p>${index + 1}. ${question.question}</p>
        <div class="quiz-options">
          ${question.options.map((option, i) => `
            <label>
              <input type="radio" name="q${index}" value="${i}">
              ${option}
            </label>
          `).join('')}
        </div>
      `;
      questionsContainer.appendChild(questionElement);
    });
    
    quizContainer.style.display = 'block';
    
    // Add event listener to submit button
    document.getElementById('submit-quiz').addEventListener('click', () => {
      this.evaluateQuiz('pre');
    });
  }
  
  startPostQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
      <h3>الاختبار البعدي</h3>
      <p>أجب عن الأسئلة التالية بعد إكمال التجربة:</p>
      <div id="quiz-questions"></div>
      <button id="submit-quiz">تقديم الإجابات</button>
    `;
    
    const questionsContainer = document.getElementById('quiz-questions');
    
    // Add quiz questions
    this.currentExperiment.postQuiz.forEach((question, index) => {
      const questionElement = document.createElement('div');
      questionElement.className = 'quiz-question';
      questionElement.innerHTML = `
        <p>${index + 1}. ${question.question}</p>
        <div class="quiz-options">
          ${question.options.map((option, i) => `
            <label>
              <input type="radio" name="q${index}" value="${i}">
              ${option}
            </label>
          `).join('')}
        </div>
      `;
      questionsContainer.appendChild(questionElement);
    });
    
    quizContainer.style.display = 'block';
    
    // Add event listener to submit button
    document.getElementById('submit-quiz').addEventListener('click', () => {
      this.evalu
(Content truncated due to size limit. Use line ranges to read in chunks)