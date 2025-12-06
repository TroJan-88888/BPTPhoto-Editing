// ระบบแจ้งเตือน
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = 'notification';
  
  if (type === 'error') {
    notification.classList.add('error');
  } else if (type === 'success') {
    notification.classList.add('success');
  }
  
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, duration);
}

// ระบบเปลี่ยนรูปภาพพื้นหลัง
const backgroundImages = [
  'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
  'url("https://od.lk/s/N18yNzE4MTExNjZf/d3160929-1051-430c-9681-8a9944120018.png")',
  'url("https://od.lk/s/N18yNzY2OTU3MDFf/589078834_3361133514040689_249116019427662915_n.jpg")',
  'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
  'url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80")',
  'url("https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80")'
];

let currentBackgroundIndex = 0;

// ฟังก์ชันเปลี่ยนรูปภาพพื้นหลัง
function changeBackgroundImage() {
  currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
  document.body.style.backgroundImage = backgroundImages[currentBackgroundIndex];
  
  // แสดงการแจ้งเตือน
  showNotification(`เปลี่ยนภาพพื้นหลังเป็นรูปที่ ${currentBackgroundIndex + 1}`, "success");
  
  // พูดยืนยัน
  const tts = new SpeechSynthesisUtterance("ผมเปลี่ยนรูปให้เจ้านายแล้วครับ");
  tts.lang = "th-TH";
  speechSynthesis.speak(tts);
}

// ฟังก์ชันเปลี่ยนรูปภาพพื้นหลังแบบสุ่ม
function changeBackgroundRandom() {
  const randomIndex = Math.floor(Math.random() * backgroundImages.length);
  currentBackgroundIndex = randomIndex;
  document.body.style.backgroundImage = backgroundImages[randomIndex];
  
  // แสดงการแจ้งเตือน
  showNotification(`เปลี่ยนภาพพื้นหลังแบบสุ่มเรียบร้อย`, "success");
  
  // พูดยืนยัน
  const tts = new SpeechSynthesisUtterance("ผมเปลี่ยนรูปแบบสุ่มให้เจ้านายแล้วครับ");
  tts.lang = "th-TH";
  speechSynthesis.speak(tts);
}

// ฟังก์ชันรีเซ็ตรูปภาพพื้นหลังเป็นรูปเดิม
function resetBackgroundImage() {
  document.body.style.backgroundImage = 'url("https://cdn.pixabay.com/animation/2023/02/25/01/14/01-14-55-999_512.gif")';
  currentBackgroundIndex = 0;
  
  // แสดงการแจ้งเตือน
  showNotification(`รีเซ็ตภาพพื้นหลังเป็นรูปเดิมเรียบร้อย`, "success");
  
  // พูดยืนยัน
  const tts = new SpeechSynthesisUtterance("ผมรีเซ็ตรูปพื้นหลังให้เจ้านายแล้วครับ");
  tts.lang = "th-TH";
  speechSynthesis.speak(tts);
}

// ตัวแปรควบคุมระบบ
let isSystemClosed = false;
let closedSystemSpeechRecognition = null;
let mainSpeechRecognition = null;

// ฟังก์ชันสำหรับปิดระบบ
function closeSystem() {
  isSystemClosed = true;
  
  // ซ่อนแอปพลิเคชันหลัก
  document.querySelector('.app-container').style.display = 'none';
  document.getElementById('musicPlayer').style.display = 'none';
  document.getElementById('notification').style.display = 'none';
  document.getElementById('silentModeIndicator').style.display = 'none';
  document.getElementById('reopenAudioBtn').style.display = 'none';
  
  // แสดงหน้าแสดงผลเมื่อปิดระบบ
  const overlay = document.getElementById('closedSystemOverlay');
  overlay.style.display = 'flex';
  
  // หยุดระบบฟังเสียงหลัก
  stopMainSpeechRecognition();
  
  // หยุดเพลง
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  
  // พูดยืนยันการปิดระบบ
  const tts = new SpeechSynthesisUtterance("ระบบปิดแล้วเจ้านาย พูดว่าเปิดระบบเพื่อเริ่มต้นใหม่");
  tts.lang = "th-TH";
  speechSynthesis.speak(tts);
  
  // เริ่มระบบฟังเสียงสำหรับโหมดปิดระบบ
  startClosedSystemSpeechRecognition();
}

// ฟังก์ชันสำหรับเปิดระบบใหม่
function restartApp() {
  isSystemClosed = false;
  
  // ซ่อนหน้าแสดงผลเมื่อปิดระบบ
  document.getElementById('closedSystemOverlay').style.display = 'none';
  
  // แสดงแอปพลิเคชันหลัก
  document.querySelector('.app-container').style.display = 'flex';
  document.getElementById('musicPlayer').style.display = 'block';
  document.getElementById('notification').style.display = 'block';
  
  // หยุดระบบฟังเสียงสำหรับโหมดปิดระบบ
  stopClosedSystemSpeechRecognition();
  
  // เริ่มต้นระบบใหม่
  initCanvas1();
  drawCanvas2();
  updateButtonStates();
  updateMusicControls();
  
  // ตั้งค่าระดับเสียงเริ่มต้น
  if (audio) {
    audio.volume = volumeSlider.value;
  }
  
  // เริ่มระบบฟังเสียงหลัก
  initializeSpeechRecognition();
  
  // พูดต้อนรับ
  const welcomeTTS = new SpeechSynthesisUtterance("ต้อนรับสู่ BPTPhoto Advanced Editing ครับเจ้านาย");
  welcomeTTS.lang = "th-TH";
  speechSynthesis.speak(welcomeTTS);
  
  showNotification("เปิดระบบใหม่เรียบร้อยแล้ว", "success");
}

// ระบบฟังเสียงสำหรับโหมดปิดระบบ
function startClosedSystemSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (SpeechRecognition) {
    closedSystemSpeechRecognition = new SpeechRecognition();
    closedSystemSpeechRecognition.lang = 'th-TH';
    closedSystemSpeechRecognition.continuous = true;
    closedSystemSpeechRecognition.interimResults = false;

    closedSystemSpeechRecognition.onresult = (e) => {
      const t = e.results[e.results.length - 1][0].transcript.trim();
      console.log("คุณพูดในโหมดปิดระบบ:", t);

      if (/เปิดระบบ|เริ่มระบบ|start system/i.test(t)) {
        restartApp();
      }
    };

    closedSystemSpeechRecognition.onerror = (err) => {
      console.log("Closed system voice error:", err);
      // พยายามเริ่มต้นใหม่หลังจากข้อผิดพลาด
      setTimeout(() => {
        if (closedSystemSpeechRecognition && isSystemClosed) {
          try {
            closedSystemSpeechRecognition.start();
          } catch (e) {
            console.error("Cannot restart closed system speech recognition:", e);
          }
        }
      }, 1000);
    };
    
    closedSystemSpeechRecognition.onend = () => {
      // พยายามเริ่มต้นใหม่อัตโนมัติ
      if (isSystemClosed) {
        setTimeout(() => {
          if (closedSystemSpeechRecognition) {
            try {
              closedSystemSpeechRecognition.start();
            } catch (e) {
              console.error("Cannot restart closed system speech recognition:", e);
            }
          }
        }, 500);
      }
    };
    
    try {
      closedSystemSpeechRecognition.start();
    } catch (e) {
      console.error("Cannot start closed system speech recognition:", e);
    }
  }
}

function stopClosedSystemSpeechRecognition() {
  if (closedSystemSpeechRecognition) {
    try {
      closedSystemSpeechRecognition.stop();
      closedSystemSpeechRecognition = null;
    } catch (e) {
      console.error("Error stopping closed system speech recognition:", e);
    }
  }
}

function stopMainSpeechRecognition() {
  if (mainSpeechRecognition) {
    try {
      mainSpeechRecognition.stop();
    } catch (e) {
      console.error("Error stopping main speech recognition:", e);
    }
  }
}

// ตัวแปรสำหรับสถานะระบบฟังเสียง
let isAudioSystemClosed = false;

// ฟังก์ชันเมื่อผู้ใช้พูดว่า "ไม่อยากฟัง"
function dontWantToListen() {
  if (isAudioSystemClosed) {
    showNotification("ระบบฟังเสียงถูกปิดอยู่แล้ว", "info");
    return;
  }
  
  // พูดยืนยันก่อนเริ่มเอฟเฟกต์
  const tts = new SpeechSynthesisUtterance("ปิดระบบฟังเสียงแล้วครับเจ้านาย พูดว่าอยากฟังเพื่อเปิดใหม่");
  tts.lang = "th-TH";
  speechSynthesis.speak(tts);
  
  // แสดงข้อความฟีดแบ็ค
  const fadeOutMessage = document.getElementById('fadeOutMessage');
  fadeOutMessage.style.display = 'block';
  
  // หยุดระบบฟังเสียง
  stopMainSpeechRecognition();
  stopClosedSystemSpeechRecognition();
  
  // ตั้งค่าสถานะ
  isAudioSystemClosed = true;
  
  // แสดงตัวบ่งชี้โหมดเงียบ
  document.getElementById('silentModeIndicator').style.display = 'flex';
  
  // อัพเดตสถานะเสียงในทั้งสองหน้า
  updateVoiceStatus('inactive');
  
  // เริ่มเอฟเฟกต์หมุนและจางหาย
  setTimeout(() => {
    // เพิ่มคลาสหมุนและจางหายให้กับแอปพลิเคชัน
    const appContainer = document.querySelector('.app-container');
    const musicPlayer = document.getElementById('musicPlayer');
    
    if (appContainer) appContainer.classList.add('rotate-fade-out');
    if (musicPlayer) musicPlayer.classList.add('rotate-fade-out');
    
    // ซ่อนแอปพลิเคชันหลังจากเอฟเฟกต์เสร็จ
    setTimeout(() => {
      if (appContainer) appContainer.style.display = 'none';
      if (musicPlayer) musicPlayer.style.display = 'none';
      
      // แสดงปุ่มเปิดเสียงอีกครั้ง
      document.getElementById('reopenAudioBtn').style.display = 'block';
      
      // ซ่อนข้อความฟีดแบ็ค
      fadeOutMessage.style.display = 'none';
      
      showNotification("ระบบฟังเสียงถูกปิดแล้ว คลิกปุ่มหรือพูดว่า 'อยากฟัง' เพื่อเปิดใหม่", "success");
    }, 3000);
  }, 1500);
}

// ฟังก์ชันสำหรับเปิดระบบฟังเสียงอีกครั้ง
function reopenAudioSystem() {
  if (!isAudioSystemClosed) {
    showNotification("ระบบฟังเสียงกำลังทำงานอยู่แล้ว", "info");
    return;
  }
  
  // พูดยืนยัน
  const tts = new SpeechSynthesisUtterance("เปิดระบบฟังเสียงแล้วครับเจ้านาย");
  tts.lang = "th-TH";
  speechSynthesis.speak(tts);
  
  // ลบเอฟเฟกต์หมุนและจางหาย
  const appContainer = document.querySelector('.app-container');
  const musicPlayer = document.getElementById('musicPlayer');
  
  if (appContainer) {
    appContainer.classList.remove('rotate-fade-out');
    appContainer.style.display = 'flex';
    appContainer.style.opacity = '1';
    appContainer.style.transform = 'rotate(0deg) scale(1)';
  }
  
  if (musicPlayer) {
    musicPlayer.classList.remove('rotate-fade-out');
    musicPlayer.style.display = 'block';
    musicPlayer.style.opacity = '1';
    musicPlayer.style.transform = 'rotate(0deg) scale(1)';
  }
  
  // ซ่อนปุ่มและตัวบ่งชี้
  document.getElementById('reopenAudioBtn').style.display = 'none';
  document.getElementById('silentModeIndicator').style.display = 'none';
  
  // ตั้งค่าสถานะ
  isAudioSystemClosed = false;
  
  // เริ่มระบบฟังเสียงใหม่
  initializeSpeechRecognition();
  
  // อัพเดตสถานะเสียง
  updateVoiceStatus('active');
  
  showNotification("เปิดระบบฟังเสียงใหม่เรียบร้อยแล้ว", "success");
}

// ระบบสลับหน้า
document.querySelectorAll('.nav-button').forEach(button => {
  button.addEventListener('click', function() {
    const targetPage = this.getAttribute('data-page');
    
    // อัพเดตปุ่มนำทาง
    document.querySelectorAll('.nav-button').forEach(btn => {
      btn.classList.remove('active');
    });
    this.classList.add('active');
    
    // ซ่อนทุกหน้า
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    
    // แสดงหน้าที่เลือก
    document.getElementById(targetPage).classList.add('active');
    
    // อัพเดตสถานะปุ่มตามหน้าที่เลือก
    updateButtonStates();
  });
});

// ระบบสำหรับหน้าที่ 1 - ตัดรูปเป็นวงกลม
const fileInput1 = document.getElementById('file1');
const canvas1 = document.getElementById('mainCanvas1');
const ctx1 = canvas1.getContext('2d', { willReadFrequently: true });
const preview1 = document.getElementById('preview1');
const resetBtn1 = document.getElementById('reset1');
const exportBtn1 = document.getElementById('export1');
const clearBtn1 = document.getElementById('clear1');

let img1 = new Image(), originalImg1 = null, imgLoaded1 = false;
let sel1 = {x:0,y:0,r:0}, dragging1=false, resizing1=false, dragOffset1={x:0,y:0};
const EDGE_HIT = 12;
let animationFrameId1 = null;

function initCanvas1(){
  canvas1.width=Math.min(800,window.innerWidth-64);
  canvas1.height=Math.min(600,window.innerHeight*0.6);
  sel1.x=canvas1.width/2; sel1.y=canvas1.height/2;
  sel1.r=Math.min(canvas1.width,canvas1.height)/6;
  draw1();
}

function draw1(){
  ctx1.clearRect(0,0,canvas1.width,canvas1.height);
  if(imgLoaded1){
    ctx1.drawImage(img1,0,0,canvas1.width,canvas1.height);
    ctx1.fillStyle='rgba(0,0,0,0.5)';
    ctx1.beginPath(); ctx1.rect(0,0,canvas1.width,canvas1.height);
    ctx1.arc(sel1.x,sel1.y,sel1.r,0,Math.PI*2,true);
    ctx1.fill('evenodd');
  }else{
    ctx1.fillStyle='#111'; ctx1.fillRect(0,0,canvas1.width,canvas1.height);
    ctx1.fillStyle='#666'; ctx1.font='16px sans-serif';
    ctx1.textAlign='center'; ctx1.fillText('เลือกรูปภาพเพื่อเริ่มต้น',canvas1.width/2,canvas1.height/2);
  }
  ctx1.strokeStyle='white'; ctx1.lineWidth=3;
  ctx1.beginPath(); ctx1.arc(sel1.x,sel1.y,sel1.r,0,Math.PI*2); ctx1.stroke();
  updatePreview1();
}

function updatePreview1(){
  const s=140,p=document.createElement('canvas'); p.width=s; p.height=s;
  const c=p.getContext('2d',{willReadFrequently:true});
  if(imgLoaded1){
    c.save(); c.beginPath(); c.arc(s/2,s/2,s/2,0,Math.PI*2); c.clip();
    const scaleX=originalImg1.width/canvas1.width,scaleY=originalImg1.height/canvas1.height;
    const sx=(sel1.x-sel1.r)*scaleX, sy=(sel1.y-sel1.r)*scaleY, ss=sel1.r*2*scaleX;
    c.drawImage(originalImg1,sx,sy,ss,ss,0,0,s,s); c.restore();
    preview1.innerHTML=''; preview1.appendChild(p);
  } else preview1.innerHTML='<span>ยังไม่มีรูป</span>';
}

function pointDist(ax,ay,bx,by){return Math.hypot(ax-bx,ay-by);}
function toCanvasCoords1(x,y){
  const rect=canvas1.getBoundingClientRect();
  return {x:(x-rect.left)*(canvas1.width/rect.width), y:(y-rect.top)*(canvas1.height/rect.height)};
}

function startDrag1(e){
  if(!imgLoaded1)return;
  const p=toCanvasCoords1(e.clientX,e.clientY);
  const d=pointDist(p.x,p.y,sel1.x,sel1.y);
  if(Math.abs(d-sel1.r)<=EDGE_HIT)resizing1=true;
  else if(d<sel1.r){dragging1=true; dragOffset1.x=p.x-sel1.x; dragOffset1.y=p.y-sel1.y;}
  else{sel1.x=p.x;sel1.y=p.y;sel1.r=0;resizing1=true;}
  
  // ใช้ requestAnimationFrame เพื่อประสิทธิภาพ
  if(!animationFrameId1){
    animationFrameId1 = requestAnimationFrame(() => {
      draw1();
      animationFrameId1 = null;
    });
  }
}

function drag1(e){
  if(!dragging1&&!resizing1)return;
  const p=toCanvasCoords1(e.clientX,e.clientY);
  if(dragging1){
    sel1.x=p.x-dragOffset1.x; sel1.y=p.y-dragOffset1.y;
    sel1.x=Math.max(sel1.r,Math.min(canvas1.width-sel1.r,sel1.x));
    sel1.y=Math.max(sel1.r,Math.min(canvas1.height-sel1.r,sel1.y));
  }else if(resizing1){
    sel1.r=Math.max(10,pointDist(p.x,p.y,sel1.x,sel1.y));
  }
  
  // ใช้ requestAnimationFrame เพื่อประสิทธิภาพ
  if(!animationFrameId1){
    animationFrameId1 = requestAnimationFrame(() => {
      draw1();
      animationFrameId1 = null;
    });
  }
}

function stopDrag1(){
  dragging1=false;
  resizing1=false;
}

function reset1(){
  if(!imgLoaded1){
    showNotification("กรุณาเลือกรูปภาพก่อน", "error");
    return;
  }
  sel1.x=canvas1.width/2; sel1.y=canvas1.height/2;
  sel1.r=Math.min(canvas1.width,canvas1.height)/6;
  draw1();
}

function clearAll1(){
  imgLoaded1 = false;
  originalImg1 = null;
  sel1.x = canvas1.width/2; 
  sel1.y = canvas1.height/2; 
  sel1.r = Math.min(canvas1.width,canvas1.height)/6;
  fileInput1.value = '';
  
  // ลบ URL object เพื่อป้องกันการรั่วไหลของหน่วยความจำ
  if(img1.src && img1.src.startsWith('blob:')) {
    URL.revokeObjectURL(img1.src);
  }
  
  draw1();
  updateButtonStates();
}

function exportImage1(){
  if(!imgLoaded1){
    showNotification("กรุณาเลือกรูปภาพก่อน", "error");
    return;
  }
  
  try {
    const scaleX=originalImg1.width/canvas1.width;
    const scaleY=originalImg1.height/canvas1.height;
    const originalX=sel1.x*scaleX,originalY=sel1.y*scaleY,originalR=sel1.r*scaleX;
    const d=Math.round(originalR*2),out=document.createElement('canvas');
    out.width=d;out.height=d;
    const o=out.getContext('2d',{willReadFrequently:true});
    o.beginPath();o.arc(d/2,d/2,d/2,0,Math.PI*2);o.clip();
    o.drawImage(originalImg1,originalX-originalR,originalY-originalR,d,d,0,0,d,d);
    out.toBlob(b=>{
      const a=document.createElement('a');
      a.href=URL.createObjectURL(b);a.download='crop-circle.png';
      a.click();
      URL.revokeObjectURL(a.href);
      
      showNotification("บันทึกรูปภาพเรียบร้อยแล้ว", "success");
    },'image/png',1.0);
  } catch (error) {
    console.error("Error exporting image:", error);
    showNotification("เกิดข้อผิดพลาดในการบันทึกรูปภาพ", "error");
  }
}

fileInput1.addEventListener('change',e=>{
  const f=e.target.files?.[0];
  if(!f) return;
  
  // ตรวจสอบประเภทไฟล์
  if(!f.type.startsWith('image/')){
    showNotification("กรุณาเลือกไฟล์รูปภาพเท่านั้น", "error");
    fileInput1.value = '';
    return;
  }
  
  // ตรวจสอบขนาดไฟล์ (จำกัดที่ 10MB)
  if(f.size > 10 * 1024 * 1024){
    showNotification("ไฟล์รูปภาพต้องมีขนาดไม่เกิน 10MB", "error");
    fileInput1.value = '';
    return;
  }
  
  // ลบ URL ก่อนหน้าหากมี
  if(img1.src && img1.src.startsWith('blob:')) {
    URL.revokeObjectURL(img1.src);
  }
  
  const url=URL.createObjectURL(f);
  img1=new Image();
  img1.onload=()=>{
    imgLoaded1=true;
    originalImg1=img1;
    const ratio=Math.min(1200/img1.width,800/img1.height);
    canvas1.width=img1.width*ratio;
    canvas1.height=img1.height*ratio;
    sel1.x=canvas1.width/2;
    sel1.y=canvas1.height/2;
    sel1.r=Math.min(canvas1.width,canvas1.height)/6;
    draw1();
    updateButtonStates();
    
    // ลบ URL หลังจากโหลดเสร็จ
    URL.revokeObjectURL(url);
  };
  img1.onerror=()=>{
    showNotification("ไม่สามารถโหลดรูปภาพได้ กรุณาลองอีกครั้ง", "error");
    fileInput1.value = '';
  };
  img1.src=url;
});

// เพิ่มการจัดการ Touch Events ที่ดีขึ้น
function handleTouchStart(e) {
  e.preventDefault();
  if(e.touches.length === 1) {
    startDrag1(e.touches[0]);
  }
}

function handleTouchMove(e) {
  e.preventDefault();
  if(e.touches.length === 1) {
    drag1(e.touches[0]);
  }
}

function handleTouchEnd(e) {
  e.preventDefault();
  stopDrag1();
}

canvas1.addEventListener('mousedown',startDrag1);
window.addEventListener('mousemove',drag1);
window.addEventListener('mouseup',stopDrag1);
canvas1.addEventListener('touchstart', handleTouchStart, {passive: false});
canvas1.addEventListener('touchmove', handleTouchMove, {passive: false});
canvas1.addEventListener('touchend', handleTouchEnd, {passive: false});

resetBtn1.addEventListener('click',reset1);
exportBtn1.addEventListener('click',()=>{
  exportImage1();
  const tts = new SpeechSynthesisUtterance("บันทึกรูปให้แล้วครับเจ้านาย");
  tts.lang = "th-TH";
  speechSynthesis.speak(tts);
});
clearBtn1.addEventListener('click',()=>{
  clearAll1();
  const tts = new SpeechSynthesisUtterance("ลบแล้วครับเจ้านาย");
  tts.lang = "th-TH";
  speechSynthesis.speak(tts);
});

// ระบบสำหรับหน้าที่ 2 - แก้ไขรูปภาพขั้นสูง
const canvas2=document.getElementById('mainCanvas2'), ctx2=canvas2.getContext('2d');
const fileInput2=document.getElementById('file2');
const zoomInBtn=document.getElementById('zoomIn');
const zoomOutBtn=document.getElementById('zoomOut');
const resetBtn2=document.getElementById('reset2');
const savePNGBtn=document.getElementById('savePNG');
const undoBtn=document.getElementById('undo');
const clearAllBtn=document.getElementById('clearAll');

let img2 = new Image();
let scale=1, offsetX=0, offsetY=0;
let circles=[], arrows=[], texts=[];
let isDraggingCanvas=false, dragStart={x:0,y:0};

let isDrawingCircle=false, circleStart={x:0,y:0};
let isDraggingCircle=false, selectedCircle=null, circleOffset={x:0,y:0};

let isDrawingArrow=false, arrowStart={x:0,y:0};
let isDraggingArrow=false, selectedArrow=null, arrowOffset={x1:0,y1:0,x2:0,y2:0};

let isDraggingText=false, selectedText=null, textOffset={x:0,y:0};
let undoStack=[], redoStack=[];
let tempCanvas=document.createElement('canvas'), tempCtx=tempCanvas.getContext('2d');
tempCanvas.width=canvas2.width; tempCanvas.height=canvas2.height;
let animationFrameId2 = null;

// Load Image for page 2
fileInput2.addEventListener('change', e=>{
  const files=e.target.files;
  if(files[0]){ 
    // ตรวจสอบประเภทไฟล์
    if(!files[0].type.startsWith('image/')){
      showNotification("กรุณาเลือกไฟล์รูปภาพเท่านั้น", "error");
      fileInput2.value = '';
      return;
    }
    
    // ตรวจสอบขนาดไฟล์ (จำกัดที่ 10MB)
    if(files[0].size > 10 * 1024 * 1024){
      showNotification("ไฟล์รูปภาพต้องมีขนาดไม่เกิน 10MB", "error");
      fileInput2.value = '';
      return;
    }
    
    // ลบ URL ก่อนหน้าหากมี
    if(img2.src && img2.src.startsWith('blob:')) {
      URL.revokeObjectURL(img2.src);
    }
    
    const reader=new FileReader(); 
    reader.onload=ev=>{ 
      img2.src=ev.target.result; 
      img2.onload = () => {
        drawCanvas2();
        updateButtonStates();
      };
      img2.onerror = () => {
        showNotification("ไม่สามารถโหลดรูปภาพได้ กรุณาลองอีกครั้ง", "error");
        fileInput2.value = '';
      };
    }; 
    reader.readAsDataURL(files[0]); 
  }
});

// Helpers
function hexToRgba(hex,a){ 
  const r=parseInt(hex.slice(1,3),16);
  const g=parseInt(hex.slice(3,5),16);
  const b=parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`; 
}

function getMousePos(evt){ 
  const rect = canvas2.getBoundingClientRect();
  return {
    x: (evt.clientX - rect.left - offsetX) / scale, 
    y: (evt.clientY - rect.top - offsetY) / scale
  }; 
}

function findCircle(pos){ 
  for(let i=circles.length-1;i>=0;i--){ 
    const c=circles[i]; 
    if(Math.hypot(pos.x-c.x, pos.y-c.y)<=c.radius) return c; 
  } 
  return null; 
}

function findText(pos){ 
  for(let i=texts.length-1;i>=0;i--){ 
    const t=texts[i]; 
    const textWidth = ctx2.measureText(t.text).width;
    if(pos.x>=t.x && pos.x<=t.x+textWidth && pos.y>=t.y-20 && pos.y<=t.y){ 
      return t; 
    } 
  } 
  return null; 
}

function findArrow(pos){ 
  for(let i=arrows.length-1;i>=0;i--){ 
    const a=arrows[i]; 
    if(Math.hypot(pos.x-a.x1,pos.y-a.y1)<10 || Math.hypot(pos.x-a.x2,pos.y-a.y2)<10){ 
      return a; 
    } 
  } 
  return null; 
}

function drawCanvas2(){
  if(animationFrameId2) {
    cancelAnimationFrame(animationFrameId2);
  }
  
  animationFrameId2 = requestAnimationFrame(() => {
    ctx2.clearRect(0,0,canvas2.width,canvas2.height);
    ctx2.save(); 
    ctx2.translate(offsetX,offsetY); 
    ctx2.scale(scale,scale);
    
    if(img2.src){
      ctx2.drawImage(img2,0,0,canvas2.width,canvas2.height);
    }
    
    circles.forEach(c=>{
      ctx2.save(); 
      ctx2.strokeStyle=hexToRgba(c.color,c.opacity); 
      ctx2.lineWidth=3;
      ctx2.beginPath(); 
      ctx2.arc(c.x,c.y,c.radius,0,2*Math.PI); 
      ctx2.stroke(); 
      ctx2.restore();
    });
    
    arrows.forEach(a=>{
      ctx2.save(); 
      ctx2.strokeStyle=hexToRgba(a.color,a.opacity); 
      ctx2.lineWidth=3;
      ctx2.beginPath(); 
      ctx2.moveTo(a.x1,a.y1); 
      ctx2.lineTo(a.x2,a.y2); 
      ctx2.stroke();
      const angle=Math.atan2(a.y2-a.y1,a.x2-a.x1);
      ctx2.beginPath(); 
      ctx2.moveTo(a.x2,a.y2);
      ctx2.lineTo(a.x2-10*Math.cos(angle-Math.PI/6),a.y2-10*Math.sin(angle-Math.PI/6));
      ctx2.lineTo(a.x2-10*Math.cos(angle+Math.PI/6),a.y2-10*Math.sin(angle+Math.PI/6));
      ctx2.lineTo(a.x2,a.y2); 
      ctx2.fillStyle=hexToRgba(a.color,a.opacity); 
      ctx2.fill(); 
      ctx2.restore();
    });
    
    texts.forEach(t=>{
      ctx2.save(); 
      ctx2.fillStyle=hexToRgba(t.color,t.opacity); 
      ctx2.font="20px sans-serif"; 
      ctx2.fillText(t.text,t.x,t.y); 
      ctx2.restore();
    });
    
    ctx2.drawImage(tempCanvas,0,0);
    ctx2.restore();
    
    animationFrameId2 = null;
  });
}

// Mouse Events for page 2
canvas2.addEventListener('mousedown', e=>{
  const pos=getMousePos(e);
  const hitCircle=findCircle(pos);
  const hitText=findText(pos);
  const hitArrow=findArrow(pos);

  if(e.shiftKey){ 
    isDrawingCircle=true; 
    circleStart={x:pos.x,y:pos.y}; 
    tempCtx.clearRect(0,0,tempCanvas.width,tempCanvas.height);
  }
  else if(e.altKey){ 
    isDrawingArrow=true; 
    arrowStart={x:pos.x,y:pos.y}; 
    tempCtx.clearRect(0,0,tempCanvas.width,tempCanvas.height);
  }
  else if(hitCircle){ 
    isDraggingCircle=true; 
    selectedCircle=hitCircle; 
    circleOffset={x:pos.x-hitCircle.x, y:pos.y-hitCircle.y}; 
  }
  else if(hitText){ 
    isDraggingText=true; 
    selectedText=hitText; 
    textOffset={x:pos.x-hitText.x, y:pos.y-hitText.y}; 
  }
  else if(hitArrow){ 
    isDraggingArrow=true; 
    selectedArrow=hitArrow; 
    arrowOffset={x1:pos.x-hitArrow.x1, y1:pos.y-hitArrow.y1, x2:pos.x-hitArrow.x2, y2:pos.y-hitArrow.y2}; 
  }
  else{ 
    isDraggingCanvas=true; 
    dragStart={x:e.clientX-offsetX, y:e.clientY-offsetY}; 
    canvas2.style.cursor='grabbing'; 
  }
});

canvas2.addEventListener('mousemove', e=>{
  const pos=getMousePos(e);
  if(isDraggingCanvas){ 
    offsetX=e.clientX-dragStart.x; 
    offsetY=e.clientY-dragStart.y; 
    drawCanvas2(); 
  }
  else if(isDrawingCircle){ 
    const radius=Math.hypot(pos.x-circleStart.x,pos.y-circleStart.y); 
    tempCtx.clearRect(0,0,tempCanvas.width,tempCanvas.height); 
    tempCtx.strokeStyle='rgba(59, 130, 246, 0.7)'; 
    tempCtx.lineWidth=3; 
    tempCtx.beginPath(); 
    tempCtx.arc(circleStart.x,circleStart.y,radius,0,2*Math.PI); 
    tempCtx.stroke(); 
    drawCanvas2(); 
  }
  else if(isDrawingArrow){ 
    tempCtx.clearRect(0,0,tempCanvas.width,tempCanvas.height); 
    tempCtx.strokeStyle='rgba(59, 130, 246, 0.7)'; 
    tempCtx.lineWidth=3; 
    tempCtx.beginPath(); 
    tempCtx.moveTo(arrowStart.x,arrowStart.y); 
    tempCtx.lineTo(pos.x,pos.y); 
    tempCtx.stroke(); 
    drawCanvas2(); 
  }
  else if(isDraggingCircle){ 
    selectedCircle.x=pos.x-circleOffset.x; 
    selectedCircle.y=pos.y-circleOffset.y; 
    drawCanvas2(); 
  }
  else if(isDraggingText){ 
    selectedText.x=pos.x-textOffset.x; 
    selectedText.y=pos.y-textOffset.y; 
    drawCanvas2(); 
  }
  else if(isDraggingArrow){ 
    selectedArrow.x1=pos.x-arrowOffset.x1; 
    selectedArrow.y1=pos.y-arrowOffset.y1; 
    selectedArrow.x2=pos.x-arrowOffset.x2; 
    selectedArrow.y2=pos.y-arrowOffset.y2; 
    drawCanvas2(); 
  }
});

canvas2.addEventListener('mouseup', e=>{
  const pos=getMousePos(e);
  if(isDrawingCircle){ 
    const radius=Math.hypot(pos.x-circleStart.x,pos.y-circleStart.y); 
    if(radius > 5) { // ตรวจสอบว่าวงกลมมีขนาดใหญ่พอ
      circles.push({x:circleStart.x,y:circleStart.y,radius,color:'#3b82f6',opacity:0.7}); 
      undoStack.push(JSON.stringify({circles,arrows,texts})); 
      redoStack = []; // ล้าง redo stack เมื่อมีการกระทำใหม่
    }
    tempCtx.clearRect(0,0,tempCanvas.width,tempCanvas.height); 
    isDrawingCircle=false; 
    drawCanvas2(); 
  }
  else if(isDrawingArrow){ 
    const distance = Math.hypot(pos.x-arrowStart.x, pos.y-arrowStart.y);
    if(distance > 10) { // ตรวจสอบว่าลูกศรมีขนาดใหญ่พอ
      arrows.push({x1:arrowStart.x,y1:arrowStart.y,x2:pos.x,y2:pos.y,color:'#3b82f6',opacity:0.7}); 
      undoStack.push(JSON.stringify({circles,arrows,texts})); 
      redoStack = []; // ล้าง redo stack เมื่อมีการกระทำใหม่
    }
    tempCtx.clearRect(0,0,tempCanvas.width,tempCanvas.height); 
    isDrawingArrow=false; 
    drawCanvas2(); 
  }
  isDraggingCircle=false; selectedCircle=null; 
  isDraggingText=false; selectedText=null; 
  isDraggingArrow=false; selectedArrow=null;
  isDraggingCanvas=false; canvas2.style.cursor='default';
  updateButtonStates();
});

// Buttons for page 2
zoomInBtn.addEventListener('click',()=>{ 
  if(scale < 5) { // จำกัดการซูมเข้าไม่ให้เกิน 5 เท่า
    scale*=1.2; 
    drawCanvas2(); 
  } else {
    showNotification("ไม่สามารถซูมเข้าได้มากกว่านี้", "info");
  }
});

zoomOutBtn.addEventListener('click',()=>{ 
  if(scale > 0.2) { // จำกัดการซูมออกไม่ให้ต่ำกว่า 0.2 เท่า
    scale/=1.2; 
    drawCanvas2(); 
  } else {
    showNotification("ไม่สามารถซูมออกได้มากกว่านี้", "info");
  }
});

resetBtn2.addEventListener('click',()=>{ 
  scale=1; 
  offsetX=0; 
  offsetY=0; 
  drawCanvas2(); 
});

savePNGBtn.addEventListener('click',()=>{ 
  try {
    const link=document.createElement('a'); 
    link.download='canvas.png'; 
    link.href=canvas2.toDataURL('image/png'); 
    link.click(); 
    
    showNotification("บันทึกรูปภาพเรียบร้อยแล้ว", "success");
    
    // พูดยืนยันการบันทึก
    const tts = new SpeechSynthesisUtterance("บันทึกรูปให้แล้วครับเจ้านาย");
    tts.lang = "th-TH";
    speechSynthesis.speak(tts);
  } catch (error) {
    console.error("Error saving image:", error);
    showNotification("เกิดข้อผิดพลาดในการบันทึกรูปภาพ", "error");
  }
});

undoBtn.addEventListener('click',()=>{ 
  if(undoStack.length>0){ 
    redoStack.push(JSON.stringify({circles,arrows,texts})); 
    const data=JSON.parse(undoStack.pop()); 
    circles=data.circles; 
    arrows=data.arrows; 
    texts=data.texts; 
    drawCanvas2(); 
    updateButtonStates();
  } else {
    showNotification("ไม่สามารถย้อนกลับได้แล้ว", "info");
  }
});

clearAllBtn.addEventListener('click',()=>{ 
  if(circles.length > 0 || arrows.length > 0 || texts.length > 0) {
    if(confirm("คุณแน่ใจว่าต้องการล้างทุกอย่าง?")) {
      undoStack.push(JSON.stringify({circles,arrows,texts}));
      circles=[]; 
      arrows=[]; 
      texts=[]; 
      redoStack = [];
      drawCanvas2(); 
      updateButtonStates();
      
      // พูดยืนยันการล้าง
      const tts = new SpeechSynthesisUtterance("ล้างทั้งหมดแล้วครับเจ้านาย");
      tts.lang = "th-TH";
      speechSynthesis.speak(tts);
      
      showNotification("ล้างข้อมูลทั้งหมดเรียบร้อย", "success");
    }
  } else {
    showNotification("ไม่มีข้อมูลที่จะล้าง", "info");
  }
});

// Text Input for page 2
document.addEventListener('keydown', e=>{ 
  if(e.key==='Enter' && e.target.tagName !== 'INPUT'){ 
    texts.push({text:'ข้อความใหม่',x:100,y:100,color:'#3b82f6',opacity:0.7}); 
    undoStack.push(JSON.stringify({circles,arrows,texts})); 
    redoStack = [];
    drawCanvas2(); 
    updateButtonStates();
  } 
});

// Double click to edit text
canvas2.addEventListener('dblclick', e=>{
  const pos=getMousePos(e);
  const hitText=findText(pos);
  if(hitText){
    const newText=prompt('แก้ไขข้อความ:', hitText.text);
    if(newText !== null){
      hitText.text=newText;
      drawCanvas2();
    }
  }
});

// Delete on Escape key
document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){
    if(circles.length > 0 || arrows.length > 0 || texts.length > 0){
      undoStack.push(JSON.stringify({circles,arrows,texts}));
      
      if(circles.length > 0) circles.pop();
      else if(arrows.length > 0) arrows.pop();
      else if(texts.length > 0) texts.pop();
      
      redoStack = [];
      drawCanvas2();
      updateButtonStates();
    }
  }
});

// ฟังก์ชันอัพเดตสถานะปุ่ม
function updateButtonStates() {
  // หน้า 1
  const hasImage1 = imgLoaded1;
  resetBtn1.disabled = !hasImage1;
  exportBtn1.disabled = !hasImage1;
  clearBtn1.disabled = !hasImage1;
  
  // หน้า 2
  const hasImage2 = img2.src && img2.complete && img2.naturalWidth !== 0;
  const hasElements = circles.length > 0 || arrows.length > 0 || texts.length > 0;
  const canUndo = undoStack.length > 0;
  
  zoomInBtn.disabled = !hasImage2;
  zoomOutBtn.disabled = !hasImage2;
  resetBtn2.disabled = !hasImage2;
  savePNGBtn.disabled = !hasImage2 && !hasElements;
  undoBtn.disabled = !canUndo;
  clearAllBtn.disabled = !hasElements;
}

// ฟังก์ชันอัพเดตสถานะเสียง
function updateVoiceStatus(status, isError = false) {
  const status1 = document.getElementById('voiceStatus1');
  const status2 = document.getElementById('voiceStatus');
  
  [status1, status2].forEach(el => {
    if(el) {
      el.className = `voice-status ${isError ? 'error' : status}`;
      if (status === 'active') {
        el.classList.add('pulse');
      } else {
        el.classList.remove('pulse');
      }
    }
  });
}

// ระบบฟังเสียงต่อเนื่องสำหรับทั้งสองหน้า
function initializeSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (SpeechRecognition) {
    mainSpeechRecognition = new SpeechRecognition();
    mainSpeechRecognition.lang = 'th-TH';
    mainSpeechRecognition.continuous = true;
    mainSpeechRecognition.interimResults = false;

    mainSpeechRecognition.onresult = (e) => {
      const t = e.results[e.results.length - 1][0].transcript.trim();
      console.log("คุณพูด:", t);

      // อัพเดตสถานะเสียงในทั้งสองหน้า
      updateVoiceStatus('active');

      if (/บันทึก|save/i.test(t)) {
        // ตรวจสอบว่าอยู่หน้าไหน
        if (document.getElementById('page1').classList.contains('active')) {
          exportBtn1.click();
        } else {
          savePNGBtn.click();
        }
      } else if (/ลบ|เคลียร์|clear/i.test(t)) {
        // ตรวจสอบว่าอยู่หน้าไหน
        if (document.getElementById('page1').classList.contains('active')) {
          clearBtn1.click();
        } else {
          clearAllBtn.click();
        }
      } else if (/ปิดระบบ|close|exit/i.test(t)) {
        closeSystem();
      } else if (/ซูมเข้า|zoom in/i.test(t) && document.getElementById('page2').classList.contains('active')) {
        zoomInBtn.click();
      } else if (/ซูมออก|zoom out/i.test(t) && document.getElementById('page2').classList.contains('active')) {
        zoomOutBtn.click();
      } else if (/ย้อนกลับ|undo/i.test(t) && document.getElementById('page2').classList.contains('active')) {
        undoBtn.click();
      } else if (/รีเซ็ต|reset/i.test(t) && document.getElementById('page2').classList.contains('active')) {
        resetBtn2.click();
      } else if (/เปลี่ยนรูป|เปลี่ยนพื้นหลัง|เปลี่ยนแบ็คกราวด์|เปลี่ยนภาพพื้นหลัง/i.test(t)) {
        changeBackgroundImage();
      } else if (/เปลี่ยนรูปสุ่ม|เปลี่ยนพื้นหลังสุ่ม|เปลี่ยนแบ็คกราวด์สุ่ม/i.test(t)) {
        changeBackgroundRandom();
      } else if (/รีเซ็ตรูปพื้นหลัง|รีเซ็ตพื้นหลัง|พื้นหลังเดิม/i.test(t)) {
        resetBackgroundImage();
      } else if (/เล่นเพลง|play music/i.test(t)) {
        playBtn.click();
      } else if (/หยุดเพลง|pause music/i.test(t)) {
        pauseBtn.click();
      } else if (/หยุดทั้งหมด|stop music/i.test(t)) {
        stopBtn.click();
      } else if (/เบาเสียง|เสียงลง|decrease volume|volume down/i.test(t)) {
        // ลดระดับเสียง
        let newVolume = Math.max(audio.volume - 0.2, 0);
        audio.volume = newVolume;
        volumeSlider.value = newVolume;
        
        // พูดยืนยัน
        const tts = new SpeechSynthesisUtterance(`เบาเสียงเป็น ${Math.round(newVolume * 100)} เปอร์เซ็นต์`);
        tts.lang = "th-TH";
        speechSynthesis.speak(tts);
        
        showNotification(`ปรับระดับเสียงเป็น ${Math.round(newVolume * 100)}%`, "success");
      } else if (/เพิ่มเสียง|เสียงขึ้น|increase volume|volume up/i.test(t)) {
        // เพิ่มระดับเสียง
        let newVolume = Math.min(audio.volume + 0.2, 1);
        audio.volume = newVolume;
        volumeSlider.value = newVolume;
        
        // พูดยืนยัน
        const tts = new SpeechSynthesisUtterance(`เพิ่มเสียงเป็น ${Math.round(newVolume * 100)} เปอร์เซ็นต์`);
        tts.lang = "th-TH";
        speechSynthesis.speak(tts);
        
        showNotification(`ปรับระดับเสียงเป็น ${Math.round(newVolume * 100)}%`, "success");
      } else if (/เสียงเต็ม|full volume|max volume/i.test(t)) {
        // ตั้งค่าเสียงเต็ม
        audio.volume = 1;
        volumeSlider.value = 1;
        
        // พูดยืนยัน
        const tts = new SpeechSynthesisUtterance("ตั้งค่าเสียงเต็มแล้วครับเจ้านาย");
        tts.lang = "th-TH";
        speechSynthesis.speak(tts);
        
        showNotification("ตั้งค่าเสียงเต็ม 100%", "success");
      } else if (/ปิดเสียง|mute|silence/i.test(t)) {
        // ปิดเสียง
        audio.volume = 0;
        volumeSlider.value = 0;
        
        // พูดยืนยัน
        const tts = new SpeechSynthesisUtterance("ปิดเสียงแล้วครับเจ้านาย");
        tts.lang = "th-TH";
        speechSynthesis.speak(tts);
        
        showNotification("ปิดเสียงแล้ว", "success");
      } else if (/ขอรูป|เลือกรูป|เลือกรูปภาพ|เปิดรูป|โหลดรูป/i.test(t)) {
        // คำสั่งใหม่: "ขอรูป" สำหรับเลือกรูปภาพ
        if (document.getElementById('page1').classList.contains('active')) {
          // เรียก file input สำหรับหน้า 1
          fileInput1.click();
          const tts = new SpeechSynthesisUtterance("กรุณาเลือกรูปภาพที่ต้องการ");
          tts.lang = "th-TH";
          speechSynthesis.speak(tts);
        } else if (document.getElementById('page2').classList.contains('active')) {
          // เรียก file input สำหรับหน้า 2
          fileInput2.click();
          const tts = new SpeechSynthesisUtterance("กรุณาเลือกรูปภาพที่ต้องการ");
          tts.lang = "th-TH";
          speechSynthesis.speak(tts);
        }
      } else if (/เปลี่ยนเพลง|เลือกเพลง|เปิดเพลง|โหลดเพลง|เพิ่มเพลง/i.test(t)) {
        // คำสั่งใหม่: "เปลี่ยนเพลง" สำหรับเลือกไฟล์เพลง
        musicFileInput.click();
        const tts = new SpeechSynthesisUtterance("กรุณาเลือกไฟล์เพลงที่ต้องการ");
        tts.lang = "th-TH";
        speechSynthesis.speak(tts);
      } else if (/เพลงถัดไป|next song|next music/i.test(t)) {
        // คำสั่งใหม่: "เพลงถัดไป" สำหรับเล่นเพลงถัดไป
        nextBtn.click();
      } else if (/เพลงก่อนหน้า|previous song|prev music/i.test(t)) {
        // คำสั่งใหม่: "เพลงก่อนหน้า" สำหรับเล่นเพลงก่อนหน้า
        prevBtn.click();
      } else if (/สุ่มเพลง|shuffle music/i.test(t)) {
        // คำสั่งใหม่: "สุ่มเพลง" สำหรับสลับโหมดสุ่ม
        shuffleBtn.click();
      } else if (/วนซ้ำ|repeat music/i.test(t)) {
        // คำสั่งใหม่: "วนซ้ำ" สำหรับสลับโหมดวนซ้ำ
        repeatBtn.click();
      } else if (/เปิดระบบ|start system/i.test(t)) {
        // คำสั่ง "เปิดระบบ" สำหรับเริ่มแอปพลิเคชันใหม่
        if (isSystemClosed) {
          restartApp();
        }
      } else if (/ไม่อยากฟัง|หยุดฟัง|ปิดเสียง|stop listening|don't want to listen/i.test(t)) {
        dontWantToListen();
      } else if (/อยากฟัง|เปิดเสียง|start listening/i.test(t)) {
        reopenAudioSystem();
      }
    };

    mainSpeechRecognition.onerror = (err) => {
      console.log("Voice error:", err);
      updateVoiceStatus('inactive', true);
      
      // พยายามเริ่มต้นใหม่หลังจากข้อผิดพลาด
      setTimeout(() => {
        try {
          if (mainSpeechRecognition && !isSystemClosed && !isAudioSystemClosed) {
            mainSpeechRecognition.start();
          }
        } catch (e) {
          console.error("Cannot restart speech recognition:", e);
        }
      }, 1000);
    };
    
    mainSpeechRecognition.onend = () => {
      updateVoiceStatus('inactive');
      // พยายามเริ่มต้นใหม่อัตโนมัติ
      if (!isSystemClosed && !isAudioSystemClosed) {
        setTimeout(() => {
          try {
            if (mainSpeechRecognition) {
              mainSpeechRecognition.start();
            }
          } catch (e) {
            console.error("Cannot restart speech recognition:", e);
          }
        }, 500);
      }
    };
    
    try {
      mainSpeechRecognition.start();
      updateVoiceStatus('active');
    } catch (e) {
      console.error("Cannot start speech recognition:", e);
      updateVoiceStatus('inactive', true);
    }
  } else {
    console.warn("เบราว์เซอร์นี้ไม่รองรับ Speech Recognition");
    updateVoiceStatus('inactive', true);
  }
}

// ระบบเล่นเพลงแบบเพลย์ลิสต์
const musicFileInput = document.getElementById('musicFile');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const musicInfo = document.getElementById('musicInfo');
const musicToggle = document.getElementById('musicToggle');
const musicPlayer = document.getElementById('musicPlayer');
const playlist = document.getElementById('playlist');
const playlistCount = document.getElementById('playlistCount');

let audio = new Audio();
let isPlaying = false;
let currentMusicIndex = -1;
let playlistSongs = [];
let isShuffle = false;
let isRepeat = false;

// ฟังก์ชันฟอร์แมตเวลา
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// อัพเดตความคืบหน้าเพลง
function updateProgress() {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
}

// ตั้งค่าความคืบหน้าเพลงเมื่อคลิกที่แถบความคืบหน้า
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  
  if (duration) {
    audio.currentTime = (clickX / width) * duration;
  }
}

// อัพเดตเพลย์ลิสต์ใน UI
function updatePlaylistUI() {
  playlist.innerHTML = '';
  
  if (playlistSongs.length === 0) {
    playlistCount.textContent = 'ไม่มีเพลงในเพลย์ลิสต์';
    return;
  }
  
  playlistSongs.forEach((song, index) => {
    const item = document.createElement('div');
    item.className = `playlist-item ${index === currentMusicIndex ? 'active' : ''}`;
    item.innerHTML = `
      <span>${song.name}</span>
      <button class="playlist-item-remove" data-index="${index}">×</button>
    `;
    
    item.addEventListener('click', () => {
      playSong(index);
    });
    
    const removeBtn = item.querySelector('.playlist-item-remove');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeSong(index);
    });
    
    playlist.appendChild(item);
  });
  
  playlistCount.textContent = `เพลง: ${currentMusicIndex + 1}/${playlistSongs.length}`;
}

// เพิ่มเพลงลงในเพลย์ลิสต์
function addSongsToPlaylist(files) {
  let addedCount = 0;
  
  Array.from(files).forEach(file => {
    // ตรวจสอบว่าเป็นไฟล์เสียงหรือไม่
    if (!file.type.startsWith('audio/')) {
      showNotification(`ไฟล์ "${file.name}" ไม่ใช่ไฟล์เสียง`, "error");
      return;
    }
    
    // จำกัดขนาดไฟล์ที่ 50MB
    if (file.size > 50 * 1024 * 1024) {
      showNotification(`ไฟล์ "${file.name}" มีขนาดเกิน 50MB`, "error");
      return;
    }
    
    playlistSongs.push({
      file: file,
      name: file.name,
      url: URL.createObjectURL(file)
    });
    
    addedCount++;
  });
  
  if (addedCount > 0) {
    showNotification(`เพิ่ม ${addedCount} เพลงลงในเพลย์ลิสต์เรียบร้อย`, "success");
    
    // หากเพลย์ลิสต์ว่างอยู่ ให้เล่นเพลงแรก
    if (currentMusicIndex === -1 && playlistSongs.length > 0) {
      playSong(0);
    }
    
    updatePlaylistUI();
    updateMusicControls();
  }
}

// ลบเพลงออกจากเพลย์ลิสต์
function removeSong(index) {
  if (index < 0 || index >= playlistSongs.length) return;
  
  // ถ้าลบเพลงที่กำลังเล่นอยู่
  if (index === currentMusicIndex) {
    if (isPlaying) {
      audio.pause();
    }
    
    // ลบ URL object เพื่อป้องกันการรั่วไหลของหน่วยความจำ
    URL.revokeObjectURL(playlistSongs[index].url);
    
    playlistSongs.splice(index, 1);
    
    // เล่นเพลงถัดไปหรือหยุด
    if (playlistSongs.length > 0) {
      if (index >= playlistSongs.length) {
        playSong(playlistSongs.length - 1);
      } else {
        playSong(index);
      }
    } else {
      currentMusicIndex = -1;
      audio.src = '';
      updateMusicControls();
    }
  } else {
    // ลบ URL object เพื่อป้องกันการรั่วไหลของหน่วยความจำ
    URL.revokeObjectURL(playlistSongs[index].url);
    
    playlistSongs.splice(index, 1);
    
    // ปรับ currentMusicIndex ถ้าจำเป็น
    if (index < currentMusicIndex) {
      currentMusicIndex--;
    }
  }
  
  updatePlaylistUI();
}

// เล่นเพลงตามดัชนี
function playSong(index) {
  if (index < 0 || index >= playlistSongs.length) return;
  
  // หยุดเพลงปัจจุบัน
  if (isPlaying) {
    audio.pause();
  }
  
  currentMusicIndex = index;
  const song = playlistSongs[index];
  
  audio.src = song.url;
  audio.load();
  
  audio.onloadedmetadata = () => {
    durationEl.textContent = formatTime(audio.duration);
    musicInfo.textContent = `กำลังเล่น: ${song.name}`;
    
    audio.play();
    isPlaying = true;
    updateMusicControls();
    updatePlaylistUI();
    
    // พูดยืนยัน
    const tts = new SpeechSynthesisUtterance(`เล่นเพลง ${song.name} แล้วครับเจ้านาย`);
    tts.lang = "th-TH";
    speechSynthesis.speak(tts);
  };
  
  audio.onerror = () => {
    showNotification(`ไม่สามารถเล่นเพลง "${song.name}" ได้`, "error");
    // พยายามเล่นเพลงถัดไป
    playNextSong();
  };
  
  // เมื่อเพลงจบ
  audio.onended = () => {
    isPlaying = false;
    
    if (isRepeat) {
      // เล่นเพลงเดิมซ้ำ
      playSong(currentMusicIndex);
    } else {
      // เล่นเพลงถัดไป
      playNextSong();
    }
  };
  
  // อัพเดตความคืบหน้าขณะเล่น
  audio.ontimeupdate = updateProgress;
}

// เล่นเพลงถัดไป
function playNextSong() {
  if (playlistSongs.length === 0) return;
  
  let nextIndex;
  
  if (isShuffle) {
    // เลือกเพลงแบบสุ่ม
    nextIndex = Math.floor(Math.random() * playlistSongs.length);
  } else {
    // เล่นเพลงถัดไปตามลำดับ
    nextIndex = (currentMusicIndex + 1) % playlistSongs.length;
  }
  
  playSong(nextIndex);
}

// เล่นเพลงก่อนหน้า
function playPrevSong() {
  if (playlistSongs.length === 0) return;
  
  let prevIndex;
  
  if (isShuffle) {
    // เลือกเพลงแบบสุ่ม
    prevIndex = Math.floor(Math.random() * playlistSongs.length);
  } else {
    // เล่นเพลงก่อนหน้าตามลำดับ
    prevIndex = (currentMusicIndex - 1 + playlistSongs.length) % playlistSongs.length;
  }
  
  playSong(prevIndex);
}

// อัพเดตสถานะปุ่มควบคุมเพลง
function updateMusicControls() {
  const hasSongs = playlistSongs.length > 0;
  const canPlay = hasSongs && !isPlaying;
  const canPause = hasSongs && isPlaying;
  const canStop = hasSongs && (isPlaying || audio.currentTime > 0);
  const canNavigate = hasSongs && playlistSongs.length > 1;
  
  playBtn.disabled = !canPlay;
  pauseBtn.disabled = !canPause;
  stopBtn.disabled = !canStop;
  prevBtn.disabled = !canNavigate;
  nextBtn.disabled = !canNavigate;
  shuffleBtn.disabled = !hasSongs;
  repeatBtn.disabled = !hasSongs;
  
  // อัพเดตสไตล์ปุ่มโหมด
  shuffleBtn.style.background = isShuffle ? 'var(--music-hover)' : 'transparent';
  repeatBtn.style.background = isRepeat ? 'var(--music-hover)' : 'transparent';
}

// เลือกไฟล์เพลง
musicFileInput.addEventListener('change', function(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;
  
  addSongsToPlaylist(files);
  
  // รีเซ็ต input เพื่อให้สามารถเลือกไฟล์เดิมได้อีกครั้ง
  this.value = '';
});

// ควบคุมการเล่นเพลง
playBtn.addEventListener('click', () => {
  if (playlistSongs.length > 0) {
    if (currentMusicIndex === -1) {
      playSong(0);
    } else {
      audio.play();
      isPlaying = true;
      updateMusicControls();
    }
  } else {
    showNotification("กรุณาเลือกไฟล์เพลงก่อน", "error");
  }
});

pauseBtn.addEventListener('click', () => {
  audio.pause();
  isPlaying = false;
  updateMusicControls();
  
  // พูดยืนยัน
  const tts = new SpeechSynthesisUtterance("หยุดเพลงชั่วคราวแล้วครับเจ้านาย");
  tts.lang = "th-TH";
  speechSynthesis.speak(tts);
});

stopBtn.addEventListener('click', () => {
  audio.pause();
  audio.currentTime = 0;
  isPlaying = false;
  updateMusicControls();
  progressBar.style.width = '0%';
  currentTimeEl.textContent = '0:00';
  
  // พูดยืนยัน
  const tts = new SpeechSynthesisUtterance("หยุดเพลงแล้วครับเจ้านาย");
  tts.lang = "th-TH";
  speechSynthesis.speak(tts);
});

prevBtn.addEventListener('click', () => {
  playPrevSong();
});

nextBtn.addEventListener('click', () => {
  playNextSong();
});

shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  updateMusicControls();
  
  // พูดยืนยัน
  const tts = new SpeechSynthesisUtterance(isShuffle ? "เปิดโหมดสุ่มเพลงแล้วครับเจ้านาย" : "ปิดโหมดสุ่มเพลงแล้วครับเจ้านาย");
  tts.lang = "th-TH";
  speechSynthesis.speak(tts);
  
  showNotification(isShuffle ? "เปิดโหมดสุ่มเพลงแล้ว" : "ปิดโหมดสุ่มเพลงแล้ว", "success");
});

repeatBtn.addEventListener('click', () => {
  isRepeat = !isRepeat;
  updateMusicControls();
  
  // พูดยืนยัน
  const tts = new SpeechSynthesisUtterance(isRepeat ? "เปิดโหมดวนซ้ำแล้วครับเจ้านาย" : "ปิดโหมดวนซ้ำแล้วครับเจ้านาย");
  tts.lang = "th-TH";
  speechSynthesis.speak(tts);
  
  showNotification(isRepeat ? "เปิดโหมดวนซ้ำแล้ว" : "ปิดโหมดวนซ้ำแล้ว", "success");
});

// ควบคุมระดับเสียง
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});

// คลิกที่แถบความคืบหน้าเพื่อข้ามไปยังส่วนนั้นของเพลง
progressContainer.addEventListener('click', setProgress);

// ซ่อน/แสดงเครื่องเล่นเพลง
musicToggle.addEventListener('click', () => {
  musicPlayer.classList.toggle('collapsed');
  musicToggle.textContent = musicPlayer.classList.contains('collapsed') ? '+' : '-';
});

// ระบบลากเครื่องเล่นเพลง
let isDraggingMusicPlayer = false;
let musicPlayerDragStartX = 0;
let musicPlayerDragStartY = 0;
let musicPlayerStartLeft = 0;
let musicPlayerStartTop = 0;

// ฟังก์ชันเริ่มลากเครื่องเล่นเพลง
function startDragMusicPlayer(e) {
  // ตรวจสอบว่าคลิกที่ส่วนหัวของเครื่องเล่นเพลง
  if (e.target.closest('.music-header') || e.target === musicPlayer) {
    isDraggingMusicPlayer = true;
    musicPlayer.classList.add('dragging');
    
    // บันทึกตำแหน่งเริ่มต้น
    musicPlayerDragStartX = e.clientX;
    musicPlayerDragStartY = e.clientY;
    
    // บันทึกตำแหน่งเริ่มต้นของเครื่องเล่นเพลง
    const rect = musicPlayer.getBoundingClientRect();
    musicPlayerStartLeft = rect.left;
    musicPlayerStartTop = rect.top;
    
    // ป้องกันการเลือกข้อความขณะลาก
    e.preventDefault();
  }
}

// ฟังก์ชันลากเครื่องเล่นเพลง
function dragMusicPlayer(e) {
  if (!isDraggingMusicPlayer) return;
  
  // คำนวณการเคลื่อนที่
  const deltaX = e.clientX - musicPlayerDragStartX;
  const deltaY = e.clientY - musicPlayerDragStartY;
  
  // คำนวณตำแหน่งใหม่
  let newLeft = musicPlayerStartLeft + deltaX;
  let newTop = musicPlayerStartTop + deltaY;
  
  // จำกัดตำแหน่งไม่ให้หลุดออกจากหน้าจอ
  const maxLeft = window.innerWidth - musicPlayer.offsetWidth;
  const maxTop = window.innerHeight - musicPlayer.offsetHeight;
  
  newLeft = Math.max(0, Math.min(newLeft, maxLeft));
  newTop = Math.max(0, Math.min(newTop, maxTop));
  
  // อัพเดตตำแหน่ง
  musicPlayer.style.left = `${newLeft}px`;
  musicPlayer.style.right = 'auto';
  musicPlayer.style.top = `${newTop}px`;
  musicPlayer.style.bottom = 'auto';
}

// ฟังก์ชันหยุดลากเครื่องเล่นเพลง
function stopDragMusicPlayer() {
  if (isDraggingMusicPlayer) {
    isDraggingMusicPlayer = false;
    musicPlayer.classList.remove('dragging');
  }
}

// เพิ่ม Event Listeners สำหรับการลากเครื่องเล่นเพลง
musicPlayer.addEventListener('mousedown', startDragMusicPlayer);
document.addEventListener('mousemove', dragMusicPlayer);
document.addEventListener('mouseup', stopDragMusicPlayer);

// รองรับการลากบนอุปกรณ์ Touch
musicPlayer.addEventListener('touchstart', function(e) {
  if (e.target.closest('.music-header') || e.target === musicPlayer) {
    isDraggingMusicPlayer = true;
    musicPlayer.classList.add('dragging');
    
    const touch = e.touches[0];
    musicPlayerDragStartX = touch.clientX;
    musicPlayerDragStartY = touch.clientY;
    
    const rect = musicPlayer.getBoundingClientRect();
    musicPlayerStartLeft = rect.left;
    musicPlayerStartTop = rect.top;
    
    e.preventDefault();
  }
}, { passive: false });

document.addEventListener('touchmove', function(e) {
  if (!isDraggingMusicPlayer) return;
  
  const touch = e.touches[0];
  const deltaX = touch.clientX - musicPlayerDragStartX;
  const deltaY = touch.clientY - musicPlayerDragStartY;
  
  let newLeft = musicPlayerStartLeft + deltaX;
  let newTop = musicPlayerStartTop + deltaY;
  
  const maxLeft = window.innerWidth - musicPlayer.offsetWidth;
  const maxTop = window.innerHeight - musicPlayer.offsetHeight;
  
  newLeft = Math.max(0, Math.min(newLeft, maxLeft));
  newTop = Math.max(0, Math.min(newTop, maxTop));
  
  musicPlayer.style.left = `${newLeft}px`;
  musicPlayer.style.right = 'auto';
  musicPlayer.style.top = `${newTop}px`;
  musicPlayer.style.bottom = 'auto';
  
  e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', stopDragMusicPlayer);

// Initialize everything when page loads
window.addEventListener('load', () => {
  initCanvas1();
  drawCanvas2();
  updateButtonStates();
  initializeSpeechRecognition();
  updateMusicControls();
  
  // ตั้งค่าระดับเสียงเริ่มต้น
  audio.volume = volumeSlider.value;
  
  // เพิ่ม event listener สำหรับปุ่ม restart
  document.getElementById('restartAppBtn').addEventListener('click', restartApp);
  
  // เพิ่ม event listener สำหรับปุ่ม reopen audio
  document.getElementById('reopenAudioBtn').addEventListener('click', reopenAudioSystem);
  
  // พูดต้อนรับเมื่อเปิดแอปครั้งแรก
  const welcomeTTS = new SpeechSynthesisUtterance("ต้อนรับสู่ โปรแกรมแต่งรูปที่ทันสมัยที่สุด ครับเจ้านาย");
  welcomeTTS.lang = "th-TH";
  welcomeTTS.rate = 1.0;
  welcomeTTS.pitch = 1.0;
  setTimeout(() => {
    speechSynthesis.speak(welcomeTTS);
  }, 500);
});

// Clean up when page unloads
window.addEventListener('beforeunload', () => {
  stopMainSpeechRecognition();
  stopClosedSystemSpeechRecognition();
  
  // ลบ URL objects เพื่อป้องกันการรั่วไหลของหน่วยความจำ
  if(img1.src && img1.src.startsWith('blob:')) {
    URL.revokeObjectURL(img1.src);
  }
  if(img2.src && img2.src.startsWith('blob:')) {
    URL.revokeObjectURL(img2.src);
  }
  
  // ลบ URL objects ของเพลงทั้งหมด
  playlistSongs.forEach(song => {
    if (song.url && song.url.startsWith('blob:')) {
      URL.revokeObjectURL(song.url);
    }
  });
  
  // ยกเลิก animation frames
  if(animationFrameId1) {
    cancelAnimationFrame(animationFrameId1);
  }
  if(animationFrameId2) {
    cancelAnimationFrame(animationFrameId2);
  }
});

// ปรับขนาด canvas เมื่อหน้าต่างถูกปรับขนาด
window.addEventListener('resize', () => {
  initCanvas1();
});
