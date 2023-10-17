document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/CameraMicTest/service-worker.js');
  }
});

// カメラの映像を取得してリアルタイム表示
const video = document.getElementById('camera');
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  });

// 保存ボタンで映像をキャプチャ
const captureButton = document.getElementById('capture');
const snapshots = document.getElementById('snapshots');
captureButton.addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const img = document.createElement('img');
  img.src = canvas.toDataURL();
  snapshots.appendChild(img);
});

// マイクの録音と再生
let mediaRecorder;
let audioChunks = [];
const startRecording = document.getElementById('startRecording');
const stopRecording = document.getElementById('stopRecording');
const audioPlayer = document.getElementById('audioPlayer');

// 録音開始
startRecording.addEventListener('click', () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayer.src = audioUrl;
      };

      mediaRecorder.start();
    });
});

// 録音停止
stopRecording.addEventListener('click', () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
});
