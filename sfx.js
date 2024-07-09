class SFX{
    constructor(options){
        this.context = options.context;
        const volume = (options.volume!=undefined) ? options.volume : 1.0;
        this.gainNode = this.context.createGain();
        this.gainNode.gain.setValueAtTime(volume, this.context.currentTime);
        this.gainNode.connect(this.context.destination);
        this._loop = (options.loop==undefined) ? false : options.loop;
        this.fadeDuration = (options.fadeDuration==undefined) ? 0.5 : options.fadeDuration;
        this.autoplay = (options.autoplay==undefined) ? false : options.autoplay;
        this.buffer = null;  

        let codec
        for(let prop in options.src){
            if(prop =="webm" && SFX.supportsVideoType(prop)){
                codec = prop;
                break;
            }
            if(prop =="mp3" && SFX.supportsVideoType(prop)){
                codec = prop
            }
        }

        if(codec){
            this.url = options.src[codec]
            console.log(this.url,":url")
            this.load(this.url)
        }else{
            console.warn("Browser not support files")
        }
    }

    static supportsVideoType(type){
        let video
        let formats = {
            ogg: 'video/ogg; codecs="theora"',
            h264: 'video/mp4; codecs="avc1.42E01E"',
            webm: 'video/webm; codecs="vp8, vorbis"',
            vp9: 'video/webm; codecs="vp9"',
            hls: 'application/x-mpegURL; codecs="avc1.42E01E"'
        }
        if(!video){
            video = document.createElement("video")

            return video.canPlayType(formats[type] || type)
        }
    }
    
      load(url) {
        // Load buffer asynchronously
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        const sfx = this;
       
        request.onload = function() {
           
            // Asynchronously decode the audio file data in request.response
            sfx.context.decodeAudioData(
                request.response,
                function(buffer) {
                    if (!buffer) {
                        console.error('error decoding file data: ' + sfx.url);
                        return;
                    }
                    sfx.buffer = buffer;
                    if (sfx.autoplay) sfx.play();
                },
                function(error) {
                    console.error('decodeAudioData error', error);
                }
            );
        }

        request.onerror = function() {
            console.error('SFX Loader: XHR error');
        }

        request.send();
    }

    set loop(value){
        this._loop = value
        if(this.source){
            this.source.loop = value
        }
    }

    play(){
        if(this.source != undefined) this.source.stop()
        this.source = this.context.createBufferSource()
        console.log(this.source)
        this.source.loop = this._loop
        this.source.buffer = this.buffer
        this.source.connect(this.gainNode)
        this.source.start(0)
        console.log("PLay")
    }

    set volume(value){
        this._volume = 50;
        this.gainNode.gain.setTargetAtTime(value,this.context.currentTime,this.fadeDuration)
    }

    pause(){
        this.source.stop()
    }

    stop(){
        this.source.stop()
    }
}