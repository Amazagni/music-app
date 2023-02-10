const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressBar = wrapper.querySelector(".progress-bar"),
progressArea = wrapper.querySelector(".progress-area"),
audioDuration = wrapper.querySelector("duration");
let musicIndex = 0;

window.addEventListener("load", ()=>{
    loadMusic(musicIndex); //loads music on window opening
})

function loadMusic(index){
    musicName.innerText = allMusic[index].name;
    musicArtist.innerText = allMusic[index].artist;
    musicImg.src = `images/${allMusic[index].img}.jpg`;
    mainAudio.src = `songs/${allMusic[index].src}.mp3`
}

function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText="pause";
    mainAudio.play();
}

function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText="play_arrow";
    mainAudio.pause();
}

function nextMusic(){
    musicIndex = (musicIndex + 1) % allMusic.length;
    loadMusic(musicIndex);
    playMusic();
}
function prevMusic(){
    musicIndex == 0 ? musicIndex = allMusic.length - 1 : musicIndex--;
    loadMusic(musicIndex);
    playMusic();
}

// play/pause button click
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
})
// next and prev button click
nextBtn.addEventListener("click", ()=>{
    nextMusic();
})

prevBtn.addEventListener("click",()=>{
    prevMusic();
})

// PROGRESS BAR | CURRENT TIME | DURATION
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime; //current song time
    const duration = e.target.duration; //song duration
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`; //progress bar width
    let musicCurrentTime = wrapper.querySelector(".current");
    
    mainAudio.addEventListener("loadeddata", ()=>{
        let musicDuration = wrapper.querySelector(".duration");

        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;    
    });

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
})

progressArea.addEventListener("click", (e)=>{
    let progressWidthval = progressArea.clientWidth; // gets porgressbar's width
    let clickedOffSetX = e.offsetX;
    let songDuration = mainAudio.duration;
    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;

})