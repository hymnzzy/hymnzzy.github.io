let transitioning = false,
	tS = 0,
	wH = window.innerHeight,
	skillsContainer = document.getElementById("exp-skills-holder");

async function delay(t){
	return new Promise( r => setTimeout(r,t) );
}

function fadeToggle(elm,speed){
	let style = window.getComputedStyle(elm),
		isHidden = (style.display == "none" || style.opacity == "0");
	fade(elm,isHidden?0:1,isHidden?1:0,speed)
}

function fade(elm,from,to,speed){
	let opacity = from,
		delta = ( from > to ? -1 : 1 ) * 10 / speed,
		anim = setInterval(function(){
			opacity += delta;
			elm.style.opacity = opacity;
			if( from < to ){
				elm.style.visibility = "visible";
				elm.style.display = "block";
			}		
			if( ( from > to && opacity <= to ) || ( from < to && opacity >= to ) ){
				clearInterval(anim);
				if( from > to ){
                    elm.style.visibility = "hidden";
                    elm.style.display = "none";
                }
			}
		},1);
}

function setScrollLevel(){
	let sections = document.querySelectorAll('section'),
		scrollLevel = document.getElementById('scroll-level');
	
	sections.forEach( (s,i) => {
		if( s.classList.contains('active') ){
			scrollLevel.style.height = `${ 100 / sections.length }%`;
			scrollLevel.style.top = `${ i * 100 / sections.length }%`;
		}
	});
}

async function scrollContent(dir,swipe){
	let cS = document.querySelector("section.active"),
		nS = cS.nextElementSibling,
		pS = cS.previousElementSibling,
		sC = cS.querySelector(".section-content"),
		atTop = sC.scrollTop <= ( wH / 20 ),
		atBottom = sC.scrollHeight - sC.scrollTop - sC.clientHeight <= ( wH / 20 );
	
	if( dir > 0 && atBottom && nS && nS.nodeName == "SECTION" ){
		transitioning = true;
		cS.style.transform = "translateY(-100%)";
		cS.classList.remove("active");
		await delay(250);
		nS.style.transform = "translateY(0%)";
		nS.classList.add("active");
		await delay(750);
		transitioning = false;
	}
	else if( dir < 0 && atTop && pS && pS.nodeName == "SECTION" ){
		transitioning = true;
		cS.style.transform = "translateY(10%)";
		await delay(150);
		pS.style.transform = "translateY(0%)";
		cS.classList.remove("active");
		pS.classList.add("active");
		await new Promise( r => setTimeout(r,750) );
		transitioning = false;
	}
	else if( dir < 0 && atTop && !pS.length && swipe ){
		location.reload();
	}
	setScrollLevel();
}

document.body.addEventListener("mousewheel",async function(e){
    if( transitioning ) return false;
	scrollContent(e.deltaY,false);
});
document.body.addEventListener("touchstart",async function(e){
	if( transitioning ) return false;
	tS = e.touches[0].clientY;
});
document.body.addEventListener("touchend",async function(e){
	tS -= e.changedTouches[0].clientY;
	if( transitioning || Math.abs(tS) < ( window.innerHeight / 10 ) ) return false;
	scrollContent(tS,true);
});
document.getElementById("menu").addEventListener("click",function(){
	this.classList.toggle('open');
	fadeToggle(document.getElementById('nav-links-container'),1000)
});

document.querySelectorAll("#nav-links a").forEach( (nav) => {
	nav.addEventListener("click",async function(e){
		e.preventDefault();
		if( transitioning ) return false;
		
		document.querySelector("#menu.open") && document.querySelector("#menu.open").click();

		let cS = nav.getAttribute('href').replace("#","");
		if( document.querySelector("section.active").id == cS ) return document.querySelector("section.active").querySelector(".section-content").scrollTo(0,0);

		transitioning = true;
		let found = false;

		document.querySelectorAll('section').forEach( (section) => {
			section.classList.remove('active');
			if( section.id == cS ) found = true;
			
			if( !found ){
				section.style.transform = "translateY(-100%)"
			} else if( section.id == cS ) {
				section.querySelector(".section-content").scrollTo(0,0);
				section.style.transform = "translateY(0%)"
				section.classList.add('active');
			} else if( found && $(this).attr('id') != cS ) {
				section.style.transform = "translateY(10%)"
			}
		});
		await delay(750);
		transitioning = false;
		setScrollLevel();
	});
});

skillsContainer.addEventListener("mousemove",(e) => {
	let rect = skillsContainer.getBoundingClientRect();
	let xAxis = ( ( e.clientX - rect.x ) - rect.width/2 ) / 120;
	let yAxis = ( ( e.clientY - rect.y ) - rect.height/2 ) / 60;
	
	skillsContainer.querySelectorAll(".skill").forEach((elm) => {
		elm.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg) translateZ(${(32-elm.innerText.length)/2}px)`
	});
});
skillsContainer.addEventListener("mouseenter",()=>{
	skillsContainer.querySelectorAll(".skill").forEach((elm) => {
		elm.style.transition = `none`;
	});
});
skillsContainer.addEventListener("mouseleave",()=>{
	skillsContainer.querySelectorAll(".skill").forEach((elm) => {
		elm.style.transition = `all 0.5s ease`;
		elm.style.transform = `rotateY(0deg) rotateX(0deg) translateZ(0px)`
	});
});

/* Core functions end */
/* Particle function starts */

function genParticles() {
	let SEPARATION = 40,
		AMOUNTX = 130,
		AMOUNTY = 35,
		particleContainer,
		camera,
		scene,
		renderer,
		particles,
		particle,
		count = 0;
		
	function init() {
		particleContainer = document.createElement( 'div' );
		document.body.appendChild( particleContainer );
		if(particleContainer) particleContainer.className += particleContainer.className ? ' waves' : 'waves';

		camera = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.y = 150; //changes how far back you can see i.e the particles towards horizon
		camera.position.z = 300; //This is how close or far the particles are seen
		
		camera.rotation.x = 0.35;
		
		scene = new THREE.Scene();

		particles = new Array();

		var PI2 = Math.PI * 2;
		var material = new THREE.SpriteCanvasMaterial( {
			color: document.querySelector("html").classList.contains("dark")?0xffffff:0x000000,
			program: function ( context ) {
				context.beginPath();
				context.arc( 0, 0, 0.1, 0, PI2, true );
				context.fill();
			}
		} );

		var i = 0;
		for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
			for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
				particle = particles[ i ++ ] = new THREE.Sprite( material );
				particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
				particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) - 10 );
				scene.add( particle );
			}
		}
		renderer = new THREE.CanvasRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setClearColor( document.querySelector("html").classList.contains("dark")?0x000000:0xfbefdf, 1);
		particleContainer.appendChild( renderer.domElement );
		window.addEventListener( 'resize', onWindowResize, false );
	}
	function onWindowResize() {
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
	function animate() {
		requestAnimationFrame( animate );
		render();
	}
	function render() {
		var i = 0;
		for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
			for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
				particle = particles[ i++ ];
				particle.position.y = ( Math.sin( ( ix + count ) * 0.5 ) * 20 ) + ( Math.sin( ( iy + count ) * 0.5 ) * 20 );
				particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 2 ) * 4 + ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 4;
			}
		}
		renderer.render( scene, camera );
		count += 0.05;
	}
	init();
	animate();
}
/* Particle function ends */

function initFuctions(){
	setScrollLevel();
	genParticles();
	fetch("https://type.fit/api/quotes")
		.then( d => d.json() )
		.then( qs => qs.filter( q => q.author ) )
		.then( qs => qs.filter( (q,i) => i == ( (new Date()) % qs.length ) )
			.forEach( q => document.querySelector('blockquote').innerHTML = `<i>&ldquo;${q.text}&rdquo;<br>&mdash;<br>${q.author}</i>` ) 
		).then(() => {
			document.querySelector('blockquote').style.opacity = 1
		});
};