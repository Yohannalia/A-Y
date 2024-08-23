async function uploadPhotos() {
    const input = document.getElementById('fileInput');
    const formData = new FormData();
    
    for (const file of input.files) {
        formData.append('photos', file);
    }
    
    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            loadPhotos();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadPhotos() {
    try {
        const response = await fetch('/photos');
        const photos = await response.json();
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';
        photos.forEach(photo => {
            const img = document.createElement('img');
            img.src = photo.url;
            img.classList.add('photo');
            img.onclick = () => openModal(photo.url);
            gallery.appendChild(img);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

function openModal(url) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modal.style.display = "block";
    modalImg.src = url;

    const downloadBtn = document.querySelector('.download-btn');
    downloadBtn.onclick = () => downloadImage(url);
}

document.querySelector('.close').onclick = function() {
    document.getElementById('imageModal').style.display = "none";
}

function downloadImage(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'photo_mariage.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function updateSongTitle(title) {
    document.getElementById('nowPlaying').textContent = "Now Playing: " + title;
}

const audio = document.getElementById('audio');
const playlist = [
    { src: "/music/wedding_song.mp3", title: "Notre première danse" },
    { src: "/music/love_ballad.mp3", title: "Ballade d'amour" },
    // Ajoutez d'autres chansons ici
];
let currentSongIndex = 0;

function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    audio.src = playlist[currentSongIndex].src;
    updateSongTitle(playlist[currentSongIndex].title);
    audio.play();
}

audio.addEventListener('ended', playNextSong);

// Initialiser la première chanson
updateSongTitle(playlist[currentSongIndex].title);

// Charger les photos au chargement de la page
window.onload = loadPhotos;
