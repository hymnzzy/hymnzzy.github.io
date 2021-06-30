let transitioning = false,
	tS = 0,
	wH = window.innerHeight;

function setScrollLevel(dir){
	let sections = $('section').length;
	for( let i = 0; i<sections; i++){
		if( $('section')[i].classList.contains('active') ) $('#scroll-level').css({ 'height': `${(i+1+dir)*100/sections}%` })
	}
}

async function scrollContent(dir,swipe){
	let cS = $('section.active'),
        nS = $(cS).next('section'),
        pS = $(cS).prev('section'),
		sC = cS.find('.section-content'),
		atTop = sC.scrollTop() <= ( window.innerHeight / 20 ),
		atBottom = sC[0].scrollHeight - sC.scrollTop() - sC.outerHeight() <= ( window.innerHeight / 20 );
	
	if( dir > 0 && atBottom && nS.length ){
        setScrollLevel(1);
        transitioning = true;
		$(cS).css({ 'transform': 'translateY(-100%)' }).removeClass('active');
		await new Promise( r => setTimeout(r,250) );
		$(nS).css({ 'transform': 'translateY(0%)' }).addClass('active');
		await new Promise( r => setTimeout(r,750) );
        transitioning = false;
    }
    else if( dir < 0 && atTop && pS.length ){
		setScrollLevel(-1);
        transitioning = true;
		$(cS).css({ 'transform': 'translateY(0%)' }).removeClass('active');
		await new Promise( r => setTimeout(r,250) );
		$(pS).css({ 'transform': 'translateY(0%)' }).addClass('active');
		await new Promise( r => setTimeout(r,750) );
        transitioning = false;
    }
	else if( dir < 0 && atTop && !pS.length && swipe ){
		location.reload();
	}
}

$(function(){
	$('body')
	.on('mousewheel',async function(e){
		if( transitioning ) return false;
		scrollContent(e.originalEvent.deltaY,false);
	})
	.on('touchstart',async function(e){
		tS = e.originalEvent.touches[0].clientY;
	})
	.on('touchend',async function(e){
		tS -= e.originalEvent.changedTouches[0].clientY;
		if( transitioning || Math.abs(tS) < ( window.innerHeight / 10 ) ) return false;
		scrollContent(tS,true);
	})
	.on('click','#nav-links a',async function(e){
		e.preventDefault();
		if( transitioning ) return false;
		$('#menu:visible').click();
		let cs = $(this).attr('href').replace('#',''),
			found = false;
		
		if( $('section.active').attr('id') == cs ) return $('section.active').find('.section-content').scrollTop(0);
		
		transitioning = true;
		
		$('section').each(function(){
			$(this).removeClass('active')
			if( $(this).attr('id') == cs ) found = true;
			if( !found ) {
				$(this).css({ 'transform': 'translateY(-100%)' });
			}
			else if( $(this).attr('id') == cs ) {
				$(this).find('.section-content').scrollTop(0);
				$(this).css({ 'transform': 'translateY(0)' }).addClass('active');
			}
			else if( found && $(this).attr('id') != cs ) {
				$(this).css({ 'transform': 'translateY(0)' });
			}
		});
		await new Promise( r => setTimeout(r,750) );
		transitioning = false;
		setScrollLevel(0);
	})
	.on('click','#menu',function(){
		$(this).toggleClass('open');
		$('#nav-links-container').fadeToggle('fast');
	});

    var SEPARATION = 40,
		AMOUNTX = 130,
		AMOUNTY = 35;

	var container;
	var camera, scene, renderer;
	
	var particles, particle, count = 0;

	init();
	animate();

	function init() {

		container = document.createElement( 'div' );
		document.body.appendChild( container );
		if(container) {
			container.className += container.className ? ' waves' : 'waves';
		}

		camera = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.y = 150; //changes how far back you can see i.e the particles towards horizon
		camera.position.z = 300; //This is how close or far the particles are seen
		
		camera.rotation.x = 0.35;
		
		scene = new THREE.Scene();

		particles = new Array();

		var PI2 = Math.PI * 2;
		var material = new THREE.SpriteCanvasMaterial( {
			color: $('html').hasClass('dark')?0xffffff:0x000000,
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
		renderer.setClearColor( $('html').hasClass('dark')?0x000000:0xfbefdf, 1);
		container.appendChild( renderer.domElement );
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

	let container = document.getElementById("exp-skills-holder");
	
	container.addEventListener("mousemove",(e)=>{
		let rect = container.getBoundingClientRect();
		let xAxis = ( ( e.clientX - rect.x ) - rect.width/2 ) / 120;
		let yAxis = ( ( e.clientY - rect.y ) - rect.height/2 ) / 60;
		
		document.querySelectorAll("#exp-skills-holder .skill").forEach((elm)=>{
			elm.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg) translateZ(${(32-elm.innerText.length)/2}px)`
		});
	});
	container.addEventListener("mouseenter",async (e)=>{
		document.querySelectorAll("#exp-skills-holder .skill").forEach((elm)=>{
			elm.style.transition = `none`;
		});
	});
	container.addEventListener("mouseleave",(e)=>{
		document.querySelectorAll("#exp-skills-holder .skill").forEach((elm)=>{
			elm.style.transition = `all 0.5s ease`;
			elm.style.transform = `rotateY(0deg) rotateX(0deg) translateZ(0px)`
		});
	});
})

setScrollLevel(0);