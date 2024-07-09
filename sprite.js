class Sprite{
	constructor(options){
		this.context = options.context;
		this.image = options.image;
		this.index = options.index;
		this.frame = options.frame;
		this.life= (options.life!= undefined) ? options.life : 1
		this.x = options.x;
		this.y = options.y;
		this.anchor = (options.anchor==null) ? { x:0.5, y:0.5 } : options.anchor;
		this.states = options.states;
        this.state = 0;
		this.scale = (options.scale==null) ? 1.0 : options.scale;
		this.opacity = (options.opacity==null) ? 1.0 : options.opacity;
		this.currentTime = 0;
		this.kill = false;
		this.destroy = false
	}

	set state(index){
        this.stateIndex = index;
        this.stateTime = 0;
    }
    
    get state(){
        let result;
        
        if (this.stateIndex<this.states.length) result = this.states[this.stateIndex];
        
        return result;
    }
		
	hitTest(pt){
		const centre = { x: this.x, y: this.y };
		const radius = (this.frame.w * this.scale) / 2;
		//Now test if the pt is in the circle
		const dist = distanceBetweenPoints(pt, centre);

		return (dist<radius);
		
		function distanceBetweenPoints(a, b){
			var x = a.x - b.x;
			var y = a.y - b.y;
			
			return Math.sqrt(x * x + y * y);
		}
	}
		
	update(dt){
		this.stateTime += dt;
		const state = this.state;
		if (state==null){
			this.kill = true;
			return;
		}
		const delta = this.stateTime/state.duration;
        if (delta>1) this.state = this.stateIndex + 1;

		switch(state.mode){
			case "spawn":
				//scale and fade in
				this.scale = delta;
				this.opacity = delta;
				break;
			case "static":
				this.scale = 1.0;
				this.opacity = 1.0;
				break;
			case "die":
				this.scale = 1.0 + delta;
				this.opacity = 1.0 - delta;
                if (this.opacity<=0) this.opacity = 0;this.destroy = true;
				break;
		}
	}
	
	render() {
		// Draw the animation
		const alpha = this.context.globalAlpha;
			
		this.context.globalAlpha = this.opacity;
		
		this.context.drawImage(
		   this.image,
		   this.frame.x,
		   this.frame.y,
		   this.frame.w,
		   this.frame.h,
		   this.x - this.frame.w * this.scale * this.anchor.x,
		   this.y - this.frame.h * this.scale * this.anchor.y,
		   this.frame.w * this.scale,
		   this.frame.h * this.scale);
		
		this.context.globalAlpha = alpha;
	}
}