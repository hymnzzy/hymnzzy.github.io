let transitioning = false;

function setScrollLevel(dir){
	let sections = $('section').length;
	for( let i = 0; i<sections; i++){
		if( $('section')[i].classList.contains('active') ) $('#scroll-level').css({ 'height': `${(i+1+dir)*100/sections}%` })
	}
}

$('body')
.on('mousewheel',async function(e){
    if( transitioning ) return false
	let cS = $('section.active'),
        nS = $(cS).next('section'),
        pS = $(cS).prev('section');
	
	if( e.originalEvent.deltaY > 0 && nS.length && ($(window).scrollTop() + $(window).height() >= $(document).height()) ){
        totalScrolled = 0;
		if( !nS.length ) return false;
		setScrollLevel(1);
        transitioning = true;
		$('body').css({ 'overflow-y':'hidden' });
		await new Promise( r => setTimeout(r,100) );
        $(cS).css({ 'transform': 'translateY(-100%)' });
		await new Promise( r => setTimeout(r,750) );
		$(cS).removeClass('active');
		$(nS).addClass('active');
		$('body').css({ 'overflow-y':'' })
        transitioning = false;
    }
    if( e.originalEvent.deltaY < 0 && pS.length && $(window).scrollTop() <= 0 ){
		totalScrolled = 0;
        if( !pS.length ) return false;
		setScrollLevel(-1);
        transitioning = true;
		$('body').css({ 'overflow-y':'hidden' })
        $(cS).removeClass('active');
		$(pS).addClass('active');
		await new Promise( r => setTimeout(r,100) );
        $(pS).css({ 'transform':'translateY(0)' });
		await new Promise( r => setTimeout(r,750) );
		$('body').css({ 'overflow-y':'' })
        transitioning = false;
    }
})
.on('click','#nav-links a',async function(e){
	e.preventDefault();
	$('#menu:visible').click();
	let cs = $(this).attr('href').replace('#',''),
		found = false,
		others = new Array();
	
	transitioning = true;
		
	$('section').each(function(){
		$(this).removeClass('active')
		if( $(this).attr('id') == cs ) found = true;
		if( !found ) {
			$(this).css({ 'transform': 'translateY(-100%)' });
			others.push(this)
		}
		else if( $(this).attr('id') == cs ) {
			$(this).css({ 'transform': 'translateY(0)' }).addClass('active')
		}
		else if( found && $(this).attr('id') != cs ) {
			$(this).css({ 'transform': 'translateY(0)' });
			others.push(this)
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

(function(){
    var SEPARATION = 40,
		AMOUNTX = 130,
		AMOUNTY = 35;

	var container;
	var camera, scene, renderer;
	
	var particles, particle, count = 0;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

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
})();

(function(){
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
})();

setScrollLevel(0);