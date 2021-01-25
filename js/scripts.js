let transitioning = false;

$('body:not(.transitioning)').on('mousewheel',function(e){
    let cS = $('section:visible'),
        nS = $(cS).next('section'),
        pS = $(cS).prev('section');

    if( e.originalEvent.deltaY > 0 && nS.length ){
        $('body').addClass('transitioning')
        $(cS).fadeOut(750,function(){
            $(nS).fadeIn(750,function(){
                $('body').removeClass('transitioning')
            })
        })
    }
    if( e.originalEvent.deltaY < 0 && pS.length ){
        $('body').addClass('transitioning')
        $(cS).fadeOut(750,function(){
            $(pS).fadeIn(750,function(){
                $('body').removeClass('transitioning')
            })
        })
    }
});

(function(){
    Particles.init({
        selector: '.background',
        color: ['#888888'],
        speed: 0.25,
        connectParticles: false,
        responsive: [{
            breakpoint: 768,
            options: { maxParticles: 200, connectParticles: false }
        }, {
            breakpoint: 425,
            options: { maxParticles: 100, connectParticles: false }
        }, {
            breakpoint: 320,
            options: { maxParticles: 0 }
        }]
    })
})();