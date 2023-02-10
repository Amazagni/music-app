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
audioDuration = wrapper.querySelector("duration"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = wrapper.querySelector("#close");

let musicIndex = Math.floor(Math.random()*allMusic.length);


window.addEventListener("load", ()=>{
    loadMusic(musicIndex); //loads music on window opening
})

function loadMusic(index){
    musicName.innerText = allMusic[index].name;
    musicArtist.innerText = allMusic[index].artist;
    musicImg.src = `images/${allMusic[index].img}.jpg`;
    mainAudio.src = `songs/${allMusic[index].src}.mp3`;
}

function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText="pause";
    mainAudio.play();
    playingNow();
}

function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText="play_arrow";
    mainAudio.pause();
}

function nextMusic(){
    if(repeatBtn.innerText == "repeat" || repeatBtn.innerText == "repeat_one"){
        repeatBtn.innerText = "repeat";
        musicIndex = (musicIndex + 1) % allMusic.length;
        loadMusic(musicIndex);
    }
    else{
        let rand = 0;
        while(rand == 0){
            rand = Math.floor(Math.random() * allMusic.length);
        }
        musicIndex += rand;
        musicIndex = musicIndex % allMusic.length;
        loadMusic(musicIndex);
    }
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

// REPEAT BUTTON

const repeatBtn = wrapper.querySelector("#repeat");
repeatBtn.addEventListener("click", ()=>{
    if(repeatBtn.innerText == "repeat"){
        repeatBtn.innerText = "repeat_one";
        repeatBtn.setAttribute("title", "Song looped");
    }

    else if(repeatBtn.innerText == "repeat_one"){
        repeatBtn.innerText = "shuffle";
        repeatBtn.setAttribute("title", "Shuffle");
    }
    else{
        repeatBtn.innerText = "repeat";
        repeatBtn.setAttribute("title", "Playlist looped");
    } 
});

//  AFTER FINISHING THE SONG

mainAudio.addEventListener("ended", ()=>{
    if(repeatBtn.innerText == "repeat_one"){
        mainAudio.currentTime = 0;
        playMusic();
    }
    else{
        nextMusic();
    }
});

showMoreBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show");
});

const ulTag = wrapper.querySelector("ul");

// let create li tags according to array length for list
for (let i = 0; i < allMusic.length; i++) {
    //let's pass the song name, artist from the array
    let liTag = `<li li-index="${i}">
                  <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                  </div>
                  <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                  <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag
    let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    liAudioTag.addEventListener("loadeddata", ()=>{
      let duration = liAudioTag.duration;
      let totalMin = Math.floor(duration / 60);
      let totalSec = Math.floor(duration % 60);
      if(totalSec < 10){ //if sec is less than 10 then add 0 before it
        totalSec = `0${totalSec}`;
      };
      liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
      liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
    });
  }

  const allLiTags = ulTag.querySelectorAll("li");

  function playingNow(){
    for(let j = 0; j < allLiTags.length; j++){
        allLiTags[j].classList.remove("playing");
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
        }
        allLiTags[j].setAttribute("onclick", "clicked(this)");
      }
  }

  function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
  }