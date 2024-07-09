class GameSound{
    constructor(){
        this.sfx = new SFX({
			context:this.audioContext,
			src:{mp3:"quick_swish.mp3",webm:"quick_swish.webm"},
			loop:false
		})
		const playBtn = document.getElementById("playBtn");
		playBtn.addEventListener('click',function(){game.sfx.play();})
    }
}